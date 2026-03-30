'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { computeKenyaPayroll } from '@/lib/kenya-tax'
import { submitToETIMS, testETIMSConnection as _testETIMSConnection, type ETIMSInvoicePayload, type ETIMSConfig } from '@/lib/etims'

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function revalidateAccounting() {
  revalidatePath('/finance')
  revalidatePath('/finance/invoices')
  revalidatePath('/finance/ledger')
  revalidatePath('/finance/tax')
  revalidatePath('/finance/banking')
  revalidatePath('/finance/payroll')
  revalidatePath('/finance/budgeting')
  revalidatePath('/finance/assets')
  revalidatePath('/dashboard')
}

function generateRef(prefix: string) {
  const ts = Date.now().toString().slice(-6)
  return `${prefix}-${new Date().getFullYear()}-${ts}`
}

// ─── CHART OF ACCOUNTS ────────────────────────────────────────────────────────

export async function getChartOfAccounts() {
  return prisma.chartOfAccount.findMany({
    where: { isActive: true },
    orderBy: { code: 'asc' },
    include: { children: { where: { isActive: true }, orderBy: { code: 'asc' } } },
  })
}

export async function createChartOfAccount(data: {
  code: string
  name: string
  type: string
  subType?: string
  description?: string
  parentId?: string
}) {
  await prisma.chartOfAccount.create({ data })
  revalidatePath('/finance/ledger')
}

export async function getTrialBalance() {
  const accounts = await prisma.chartOfAccount.findMany({
    where: { isActive: true },
    include: {
      journalLines: { select: { debit: true, credit: true } },
    },
    orderBy: { code: 'asc' },
  })

  return accounts.map((a) => {
    const totalDebit = a.journalLines.reduce((s, l) => s + l.debit, 0)
    const totalCredit = a.journalLines.reduce((s, l) => s + l.credit, 0)
    return {
      id: a.id, code: a.code, name: a.name, type: a.type, subType: a.subType,
      totalDebit, totalCredit, balance: totalDebit - totalCredit,
    }
  })
}


export async function getProfitAndLoss(startDate?: Date, endDate?: Date) {
  const where = startDate && endDate
    ? { entryDate: { gte: startDate, lte: endDate } }
    : {}

  const entries = await prisma.journalEntry.findMany({
    where: { status: 'POSTED', ...where },
    include: { lines: { include: { account: true } } },
  })

  let totalRevenue = 0, totalExpenses = 0
  const revenueBreakdown: Record<string, number> = {}
  const expenseBreakdown: Record<string, number> = {}

  for (const entry of entries) {
    for (const line of entry.lines) {
      if (line.account.type === 'REVENUE') {
        const amount = line.credit - line.debit
        totalRevenue += amount
        revenueBreakdown[line.account.name] = (revenueBreakdown[line.account.name] ?? 0) + amount
      }
      if (line.account.type === 'EXPENSE') {
        const amount = line.debit - line.credit
        totalExpenses += amount
        expenseBreakdown[line.account.name] = (expenseBreakdown[line.account.name] ?? 0) + amount
      }
    }
  }

  return {
    totalRevenue, totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    revenueBreakdown, expenseBreakdown,
  }
}

export async function getBalanceSheet() {
  const trial = await getTrialBalance()

  const assets = trial.filter((a) => a.type === 'ASSET')
  const liabilities = trial.filter((a) => a.type === 'LIABILITY')
  const equity = trial.filter((a) => a.type === 'EQUITY')

  const totalAssets = assets.reduce((s, a) => s + Math.abs(a.balance), 0)
  const totalLiabilities = liabilities.reduce((s, a) => s + Math.abs(a.balance), 0)
  const totalEquity = equity.reduce((s, a) => s + Math.abs(a.balance), 0)

  return { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity }
}

// ─── JOURNAL ENTRIES ──────────────────────────────────────────────────────────

export async function postJournalEntry(data: {
  description: string
  source?: string
  sourceId?: string
  entryDate?: Date
  lines: { accountId: string; description?: string; debit: number; credit: number }[]
}) {
  const totalDebit = data.lines.reduce((s, l) => s + l.debit, 0)
  const totalCredit = data.lines.reduce((s, l) => s + l.credit, 0)

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(`Journal entry not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`)
  }

  const entry = await prisma.journalEntry.create({
    data: {
      reference: generateRef('JE'),
      description: data.description,
      source: data.source,
      sourceId: data.sourceId,
      entryDate: data.entryDate ?? new Date(),
      status: 'POSTED',
      lines: {
        create: data.lines.map((l) => ({
          accountId: l.accountId,
          description: l.description,
          debit: l.debit,
          credit: l.credit,
        })),
      },
    },
  })

  revalidatePath('/finance/ledger')
  return entry
}

export async function getJournalEntries(limit = 50) {
  return prisma.journalEntry.findMany({
    orderBy: { entryDate: 'desc' },
    take: limit,
    include: { lines: { include: { account: true } } },
  })
}

// ─── INVOICES ─────────────────────────────────────────────────────────────────

export async function getInvoices() {
  return prisma.invoice.findMany({
    orderBy: { issueDate: 'desc' },
    include: { customer: true, lineItems: { include: { taxRate: true } }, payments: true },
  })
}

export async function createInvoice(data: {
  customerId?: string
  customerName?: string
  customerPin?: string
  customerEmail?: string
  dueDate?: Date
  notes?: string
  terms?: string
  lineItems: {
    description: string
    quantity: number
    unitPrice: number
    discount?: number
    taxRateId?: string
    taxAmount: number
    lineTotal: number
  }[]
}) {
  const subtotal = data.lineItems.reduce((s, i) => s + (i.lineTotal - i.taxAmount), 0)
  const totalVat = data.lineItems.reduce((s, i) => s + i.taxAmount, 0)
  const totalAmount = subtotal + totalVat
  const invoiceNumber = generateRef('INV')

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPin: data.customerPin,
      customerEmail: data.customerEmail,
      dueDate: data.dueDate,
      notes: data.notes,
      terms: data.terms,
      subtotal,
      totalVat,
      totalAmount,
      status: 'DRAFT',
      etimsStatus: 'PENDING',
      lineItems: { create: data.lineItems },
    },
  })

  revalidateAccounting()
  return invoice
}

export async function submitInvoiceToETIMS(invoiceId: string) {
  const [invoice, orgSettings] = await Promise.all([
    prisma.invoice.findUniqueOrThrow({
      where: { id: invoiceId },
      include: { customer: true, lineItems: { include: { taxRate: true } } },
    }),
    prisma.organizationSettings.findUnique({ where: { tenantId: 'default' } }),
  ])

  // Build per-tenant eTIMS config from DB (falls back gracefully if not configured)
  const etimsConfig: ETIMSConfig | undefined = orgSettings?.etimsEnabled
    ? {
        url: orgSettings.etimsUrl ?? 'https://etims-sbx.kra.go.ke/etims-api',
        deviceSerial: orgSettings.etimsDeviceSerial ?? 'SANDBOX_DEVICE',
        kraPin: orgSettings.kraPin ?? 'P000000000X',
        sandbox: orgSettings.etimsSandbox,
      }
    : undefined

  const companyName = orgSettings?.companyName ?? 'My Company Ltd'
  const kraPin = orgSettings?.kraPin ?? 'P000000000X'

  const payload: ETIMSInvoicePayload = {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.issueDate.toISOString().replace('T', ' ').slice(0, 19),
    supplierPin: kraPin,
    supplierName: companyName,
    buyerPin: invoice.customerPin ?? undefined,
    buyerName: invoice.customerName ?? invoice.customer?.name,
    currency: invoice.currency,
    totalAmount: invoice.totalAmount,
    totalVat: invoice.totalVat,
    totalExcl: invoice.subtotal,
    lineItems: invoice.lineItems.map((li) => ({
      itemCode: li.id.slice(0, 10),
      itemName: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      discount: li.discount,
      taxRate: li.taxRate?.rate ?? 0.16,
      taxAmount: li.taxAmount,
      lineTotal: li.lineTotal,
    })),
  }

  const result = await submitToETIMS(payload, etimsConfig)

  // Log the submission
  await prisma.eTIMSLog.create({
    data: {
      invoiceId,
      action: 'SUBMIT',
      requestBody: JSON.stringify(payload),
      responseBody: JSON.stringify(result),
      statusCode: result.success ? 200 : 400,
      success: result.success,
    },
  })

  // Update invoice with result
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      etimsStatus: result.success ? 'ACCEPTED' : 'REJECTED',
      etimsCuSerial: result.cuSerialNo,
      etimsInvoiceNo: result.cuInvoiceNo,
      etimsQrCode: result.qrCode,
      etimsSubmittedAt: new Date(),
      etimsResponseAt: new Date(),
      etimsError: result.success ? null : result.errorMessage,
    },
  })

  revalidateAccounting()
  return result
}

export async function markInvoicePaid(invoiceId: string, data: {
  amount: number
  paymentMethod: string
  reference?: string
  notes?: string
}) {
  const invoice = await prisma.invoice.findUniqueOrThrow({ where: { id: invoiceId } })
  const newAmountPaid = invoice.amountPaid + data.amount
  const newStatus = newAmountPaid >= invoice.totalAmount ? 'PAID' : 'SENT'

  await prisma.$transaction(async (tx) => {
    await tx.invoicePayment.create({
      data: { invoiceId, ...data, paymentDate: new Date() },
    })
    await tx.invoice.update({
      where: { id: invoiceId },
      data: { amountPaid: newAmountPaid, status: newStatus },
    })
    // Also create a legacy financial record for backward compat
    await tx.financialRecord.create({
      data: {
        type: 'INCOME',
        amount: data.amount,
        description: `Invoice ${invoice.invoiceNumber} payment received`,
        category: 'SALES',
      },
    })
  })

  revalidateAccounting()
}

// ─── BILLS (ACCOUNTS PAYABLE) ─────────────────────────────────────────────────

export async function getBills() {
  return prisma.bill.findMany({
    orderBy: { issueDate: 'desc' },
    include: { supplier: true, lineItems: { include: { taxRate: true } }, payments: true },
  })
}

export async function createBill(data: {
  supplierId?: string
  supplierName?: string
  dueDate?: Date
  notes?: string
  lineItems: {
    description: string
    quantity: number
    unitPrice: number
    taxRateId?: string
    taxAmount: number
    lineTotal: number
  }[]
}) {
  const subtotal = data.lineItems.reduce((s, i) => s + (i.lineTotal - i.taxAmount), 0)
  const totalVat = data.lineItems.reduce((s, i) => s + i.taxAmount, 0)
  const totalAmount = subtotal + totalVat

  const bill = await prisma.bill.create({
    data: {
      billNumber: generateRef('BILL'),
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      dueDate: data.dueDate,
      notes: data.notes,
      subtotal,
      totalVat,
      totalAmount,
      status: 'UNPAID',
      lineItems: { create: data.lineItems },
    },
  })

  revalidateAccounting()
  return bill
}

export async function payBill(billId: string, data: {
  amount: number
  paymentMethod: string
  reference?: string
}) {
  const bill = await prisma.bill.findUniqueOrThrow({ where: { id: billId } })
  const newAmountPaid = bill.amountPaid + data.amount
  const newStatus = newAmountPaid >= bill.totalAmount ? 'PAID' : 'UNPAID'

  await prisma.$transaction(async (tx) => {
    await tx.billPayment.create({ data: { billId, ...data, paymentDate: new Date() } })
    await tx.bill.update({ where: { id: billId }, data: { amountPaid: newAmountPaid, status: newStatus } })
    await tx.financialRecord.create({
      data: {
        type: 'EXPENSE',
        amount: data.amount,
        description: `Bill ${bill.billNumber} payment made`,
        category: 'PROCUREMENT',
      },
    })
  })

  revalidateAccounting()
}

// ─── PAYROLL (Kenya Statutory Deductions) ─────────────────────────────────────

export async function getPayrollHistory() {
  return prisma.payroll.findMany({
    orderBy: { paidAt: 'desc' },
    include: { employee: true, deduction: true },
  })
}

export async function processPayrollWithDeductions(employeeId: string, period: string) {
  const employee = await prisma.employee.findUniqueOrThrow({ where: { id: employeeId } })
  const calc = computeKenyaPayroll({ grossSalary: employee.salary })

  await prisma.$transaction(async (tx) => {
    const record = await tx.financialRecord.create({
      data: {
        type: 'EXPENSE',
        amount: calc.grossSalary,
        description: `Payroll: ${employee.name} — ${period} (Net: KES ${calc.netPay.toFixed(2)})`,
        category: 'PAYROLL',
      },
    })

    const payroll = await tx.payroll.create({
      data: {
        employeeId,
        amount: calc.grossSalary,
        period,
        financialRecordId: record.id,
      },
    })

    await tx.payrollDeduction.create({
      data: {
        payrollId: payroll.id,
        grossSalary: calc.grossSalary,
        shiF: calc.shif,
        ahl: calc.ahl,
        ahlEmployer: calc.ahlEmployer,
        nssfEmployee: calc.nssfEmployee,
        nssfEmployer: calc.nssfEmployer,
        taxableIncome: calc.taxableIncome,
        paye: calc.netPaye,
        personalRelief: calc.personalRelief,
        netPay: calc.netPay,
      },
    })
  })

  revalidatePath('/hr')
  revalidateAccounting()
  return calc
}

export async function getPayrollSummary(period: string) {
  const payrolls = await prisma.payroll.findMany({
    where: { period },
    include: { employee: true, deduction: true },
  })

  const totalGross = payrolls.reduce((s, p) => s + p.amount, 0)
  const totalPAYE = payrolls.reduce((s, p) => s + (p.deduction?.paye ?? 0), 0)
  const totalNSSF = payrolls.reduce((s, p) => s + (p.deduction?.nssfEmployee ?? 0), 0)
  const totalSHIF = payrolls.reduce((s, p) => s + (p.deduction?.shiF ?? 0), 0)
  const totalAHL = payrolls.reduce((s, p) => s + (p.deduction?.ahl ?? 0), 0)
  const totalNet = payrolls.reduce((s, p) => s + (p.deduction?.netPay ?? p.amount), 0)

  return { payrolls, totalGross, totalPAYE, totalNSSF, totalSHIF, totalAHL, totalNet }
}

// ─── TAX FILING ───────────────────────────────────────────────────────────────

export async function getTaxFilingPeriods() {
  return prisma.taxFilingPeriod.findMany({ orderBy: { periodStart: 'desc' } })
}

export async function generateVATReturn(periodStart: Date, periodEnd: Date) {
  const invoices = await prisma.invoice.findMany({
    where: { status: 'PAID', issueDate: { gte: periodStart, lte: periodEnd } },
    include: { lineItems: true },
  })

  const bills = await prisma.bill.findMany({
    where: { status: 'PAID', issueDate: { gte: periodStart, lte: periodEnd } },
    include: { lineItems: true },
  })

  const outputVAT = invoices.reduce((s, inv) => s + inv.totalVat, 0)
  const inputVAT = bills.reduce((s, b) => s + b.totalVat, 0)
  const vatPayable = outputVAT - inputVAT

  return {
    period: `${periodStart.toLocaleDateString('en-KE')} – ${periodEnd.toLocaleDateString('en-KE')}`,
    totalSales: invoices.reduce((s, i) => s + i.totalAmount, 0),
    outputVAT,
    totalPurchases: bills.reduce((s, b) => s + b.totalAmount, 0),
    inputVAT,
    vatPayable,
    invoiceCount: invoices.length,
    billCount: bills.length,
  }
}

export async function markTaxFiled(data: {
  taxType: string
  period: string
  periodStart: Date
  periodEnd: Date
  dueDate: Date
  taxableAmount: number
  taxAmount: number
  paymentRef?: string
}) {
  await prisma.taxFilingPeriod.upsert({
    where: { taxType_period: { taxType: data.taxType, period: data.period } } as never,
    create: { ...data, status: 'FILED', filedAt: new Date() },
    update: { status: 'FILED', filedAt: new Date(), paymentRef: data.paymentRef },
  })
  revalidatePath('/finance/tax')
}

// ─── BANKING & RECONCILIATION ─────────────────────────────────────────────────

export async function getBankAccounts() {
  return prisma.bankAccount.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { transactions: true } } },
  })
}

export async function createBankAccount(data: {
  name: string
  bankName: string
  accountNumber: string
  currency?: string
  openingBalance?: number
  accountType?: string
}) {
  const account = await prisma.bankAccount.create({
    data: {
      ...data,
      currentBalance: data.openingBalance ?? 0,
    },
  })
  revalidatePath('/finance/banking')
  return account
}

export async function getBankTransactions(bankAccountId: string) {
  return prisma.bankTransaction.findMany({
    where: { bankAccountId },
    orderBy: { transactionDate: 'desc' },
  })
}

export async function importBankTransactions(bankAccountId: string, transactions: {
  transactionDate: Date
  description: string
  reference?: string
  amount: number
  type: string
}[]) {
  await prisma.bankTransaction.createMany({
    data: transactions.map((t) => ({ ...t, bankAccountId })),
  })
  revalidatePath('/finance/banking')
}

export async function reconcileTransaction(transactionId: string, journalEntryId: string) {
  await prisma.bankTransaction.update({
    where: { id: transactionId },
    data: { isReconciled: true, journalEntryId },
  })
  revalidatePath('/finance/banking')
}

// ─── BUDGET ───────────────────────────────────────────────────────────────────

export async function getBudgetVsActual(period: string) {
  const [budgets, trial] = await Promise.all([
    prisma.budgetPlan.findMany({
      where: { period },
      include: { account: true },
    }),
    getTrialBalance(),
  ])

  const trialMap = new Map(trial.map((t) => [t.id, t]))

  return budgets.map((b) => {
    const actual = trialMap.get(b.accountId)?.balance ?? 0
    const variance = actual - b.amount
    const variancePct = b.amount !== 0 ? (variance / b.amount) * 100 : 0
    return { ...b, actual, variance, variancePct }
  })
}

export async function createBudget(data: {
  accountId: string
  period: string
  amount: number
  notes?: string
}) {
  await prisma.budgetPlan.upsert({
    where: { accountId_period: { accountId: data.accountId, period: data.period } },
    create: data,
    update: { amount: data.amount, notes: data.notes },
  })
  revalidatePath('/finance/budgeting')
}

// ─── ASSET REGISTER ───────────────────────────────────────────────────────────

export async function getAssets() {
  return prisma.asset.findMany({
    orderBy: { acquisitionDate: 'desc' },
    include: { depreciations: { orderBy: { createdAt: 'desc' }, take: 1 } },
  })
}

export async function createAsset(data: {
  name: string
  category: string
  description?: string
  acquisitionDate: Date
  acquisitionCost: number
  depreciationMethod?: string
  usefulLifeYears?: number
  residualValue?: number
  location?: string
}) {
  const assetCode = generateRef('AST')
  await prisma.asset.create({
    data: {
      ...data,
      assetCode,
      bookValue: data.acquisitionCost,
    },
  })
  revalidatePath('/finance/assets')
}

export async function runMonthlyDepreciation(period: string) {
  const assets = await prisma.asset.findMany({ where: { status: 'ACTIVE' } })
  let totalDeprec = 0

  for (const asset of assets) {
    const monthlyDeprec = (asset.acquisitionCost - asset.residualValue) / (asset.usefulLifeYears * 12)
    const newAccumulated = asset.accumulatedDeprec + monthlyDeprec
    const newBookValue = Math.max(asset.residualValue, asset.acquisitionCost - newAccumulated)

    await prisma.$transaction(async (tx) => {
      await tx.assetDepreciation.create({
        data: { assetId: asset.id, period, amount: monthlyDeprec },
      })
      await tx.asset.update({
        where: { id: asset.id },
        data: {
          accumulatedDeprec: newAccumulated,
          bookValue: newBookValue,
          status: newBookValue <= asset.residualValue ? 'FULLY_DEPRECIATED' : 'ACTIVE',
        },
      })
    })

    totalDeprec += monthlyDeprec
  }

  revalidatePath('/finance/assets')
  return { totalDeprec, assetsProcessed: assets.length }
}

// ─── ACCOUNTING DASHBOARD ─────────────────────────────────────────────────────

export async function getAccountingDashboard() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [
    totalInvoices, overdueInvoices, totalBills, overdueBills,
    monthlyInvoices, monthlyBills, bankAccounts, pendingETIMS,
    recentJournals,
  ] = await Promise.all([
    prisma.invoice.aggregate({ _sum: { totalAmount: true, amountPaid: true } }),
    prisma.invoice.count({ where: { status: 'OVERDUE' } }),
    prisma.bill.aggregate({ _sum: { totalAmount: true, amountPaid: true } }),
    prisma.bill.count({ where: { status: 'OVERDUE' } }),
    prisma.invoice.findMany({
      where: { issueDate: { gte: startOfMonth, lte: endOfMonth }, status: { not: 'CANCELLED' } },
    }),
    prisma.bill.findMany({
      where: { issueDate: { gte: startOfMonth, lte: endOfMonth }, status: { not: 'CANCELLED' } },
    }),
    prisma.bankAccount.findMany({ select: { name: true, currentBalance: true, currency: true } }),
    prisma.invoice.count({ where: { etimsStatus: 'PENDING', status: { not: 'DRAFT' } } }),
    prisma.journalEntry.findMany({ orderBy: { entryDate: 'desc' }, take: 5, include: { lines: { include: { account: true } } } }),
  ])

  const totalAR = (totalInvoices._sum.totalAmount ?? 0) - (totalInvoices._sum.amountPaid ?? 0)
  const totalAP = (totalBills._sum.totalAmount ?? 0) - (totalBills._sum.amountPaid ?? 0)
  const monthRevenue = monthlyInvoices.reduce((s, i) => s + i.totalAmount, 0)
  const monthExpenses = monthlyBills.reduce((s, b) => s + b.totalAmount, 0)
  const totalBankBalance = bankAccounts.reduce((s, b) => s + b.currentBalance, 0)

  return {
    totalAR, totalAP, monthRevenue, monthExpenses,
    netCashflow: monthRevenue - monthExpenses,
    overdueInvoices, overdueBills,
    totalBankBalance, bankAccounts,
    pendingETIMS, recentJournals,
  }
}

// ─── ORGANIZATION SETTINGS ───────────────────────────────────────────────────

export async function getOrganizationSettings() {
  return prisma.organizationSettings.upsert({
    where: { tenantId: 'default' },
    create: { tenantId: 'default' },
    update: {},
  })
}

export async function saveOrganizationSettings(data: {
  companyName?: string
  kraPin?: string
  vatNumber?: string
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  logoUrl?: string
}) {
  await prisma.organizationSettings.upsert({
    where: { tenantId: 'default' },
    create: { tenantId: 'default', ...data },
    update: data,
  })
  revalidatePath('/settings/organization')
  revalidatePath('/finance/tax')
}

export async function saveETIMSSettings(data: {
  etimsEnabled: boolean
  etimsUrl?: string
  etimsDeviceSerial?: string
  etimsSandbox: boolean
  kraPin?: string
}) {
  await prisma.organizationSettings.upsert({
    where: { tenantId: 'default' },
    create: { tenantId: 'default', ...data },
    update: data,
  })
  revalidatePath('/settings/integrations')
  revalidatePath('/finance/tax')
}

export async function testETIMSConnectionFromSettings(): Promise<{
  success: boolean
  message: string
}> {
  const settings = await prisma.organizationSettings.findUnique({
    where: { tenantId: 'default' },
  })

  if (!settings?.etimsEnabled) {
    return { success: false, message: 'eTIMS is not enabled. Enable it in Integration Settings first.' }
  }

  const config: ETIMSConfig = {
    url: settings.etimsUrl ?? 'https://etims-sbx.kra.go.ke/etims-api',
    deviceSerial: settings.etimsDeviceSerial ?? 'SANDBOX_DEVICE',
    kraPin: settings.kraPin ?? 'P000000000X',
    sandbox: settings.etimsSandbox,
  }

  const result = await _testETIMSConnection(config)

  // Persist test result
  await prisma.organizationSettings.update({
    where: { tenantId: 'default' },
    data: {
      etimsLastTestedAt: new Date(),
      etimsTestSuccess: result.success,
      etimsTestMessage: result.success
        ? (settings.etimsSandbox ? 'Sandbox connection OK' : 'Production connection OK')
        : (result.errorMessage ?? 'Connection failed'),
    },
  })

  revalidatePath('/settings/integrations')
  return {
    success: result.success,
    message: result.success
      ? (settings.etimsSandbox ? '✓ Sandbox mode — connection simulated successfully' : '✓ Connected to KRA eTIMS production')
      : `✗ ${result.errorMessage ?? 'Connection failed'}`,
  }
}

// ─── MODULE CONFIG ────────────────────────────────────────────────────────────

export async function getModuleConfig() {
  return prisma.moduleConfig.upsert({
    where: { tenantId: 'default' },
    create: { tenantId: 'default' },
    update: {},
  })
}

export async function updateModuleConfig(data: Partial<{
  accountingEnabled: boolean
  salesEnabled: boolean
  inventoryEnabled: boolean
  hrEnabled: boolean
  crmEnabled: boolean
  procurementEnabled: boolean
  productionEnabled: boolean
  bankingEnabled: boolean
  budgetingEnabled: boolean
  assetsEnabled: boolean
}>) {
  await prisma.moduleConfig.upsert({
    where: { tenantId: 'default' },
    create: { tenantId: 'default', ...data },
    update: data,
  })
  revalidatePath('/settings')
}

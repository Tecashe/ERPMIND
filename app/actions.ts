'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Re-export accounting actions for backward compat
export { getInvoices } from '@/app/actions/accounting'

// ─── HELPERS ────────────────────────────────────────────────────────────────

const revalidateAll = () => {
  revalidatePath('/dashboard')
  revalidatePath('/sales')
  revalidatePath('/finance')
  revalidatePath('/inventory')
  revalidatePath('/procurement')
  revalidatePath('/hr')
  revalidatePath('/crm')
  revalidatePath('/production')
  revalidatePath('/reports')
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export async function getDashboardMetrics() {
  const [products, employees, sales, incomeRecords, expenseRecords, lowStockProducts, pendingSales] = await Promise.all([
    prisma.product.count(),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.sale.count(),
    prisma.financialRecord.aggregate({ _sum: { amount: true }, where: { type: 'INCOME' } }),
    prisma.financialRecord.aggregate({ _sum: { amount: true }, where: { type: 'EXPENSE' } }),
    prisma.product.count({ where: { stockLevel: { lte: 5 } } }),
    prisma.sale.count({ where: { status: 'PENDING' } }),
  ])

  const totalRevenue = incomeRecords._sum.amount ?? 0
  const totalExpenses = expenseRecords._sum.amount ?? 0

  return {
    products,
    employees,
    sales,
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    pendingSales,
  }
}

export async function getRecentActivity() {
  const [recentSales, recentFinance, recentPOs] = await Promise.all([
    prisma.sale.findMany({ take: 5, orderBy: { saleDate: 'desc' }, include: { product: true, customer: true } }),
    prisma.financialRecord.findMany({ take: 5, orderBy: { date: 'desc' } }),
    prisma.purchaseOrder.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { supplier: true, product: true } }),
  ])
  return { recentSales, recentFinance, recentPOs }
}

// ─── SALES MODULE ─────────────────────────────────────────────────────────────

export async function getSales() {
  return prisma.sale.findMany({
    orderBy: { saleDate: 'desc' },
    include: { product: true, customer: true },
  })
}

export async function createSale(data: {
  productId: string
  customerId?: string
  quantity: number
}) {
  const product = await prisma.product.findUniqueOrThrow({ where: { id: data.productId } })
  if (product.stockLevel < data.quantity) {
    throw new Error(`Insufficient stock. Available: ${product.stockLevel}`)
  }

  const subtotal = data.quantity * product.priceKES
  const vatAmount = subtotal * 0.16
  const totalAmount = subtotal + vatAmount

  await prisma.$transaction(async (tx) => {
    const record = await tx.financialRecord.create({
      data: {
        type: 'INCOME',
        amount: totalAmount,
        description: `Sale: ${data.quantity}x ${product.name}`,
        category: 'SALES',
      },
    })

    await tx.sale.create({
      data: {
        productId: data.productId,
        customerId: data.customerId || null,
        quantity: data.quantity,
        totalAmount,
        vatAmount,
        status: 'PAID',
        financialRecordId: record.id,
      },
    })

    await tx.product.update({
      where: { id: data.productId },
      data: { stockLevel: { decrement: data.quantity } },
    })
  })

  revalidateAll()
}

// ─── INVENTORY MODULE ─────────────────────────────────────────────────────────

export async function getProducts() {
  return prisma.product.findMany({ orderBy: { name: 'asc' } })
}

export async function createProduct(data: {
  name: string
  sku: string
  priceKES: number
  stockLevel: number
  lowStockAlert?: number
}) {
  await prisma.product.create({ data })
  revalidatePath('/inventory')
  revalidatePath('/dashboard')
}

export async function updateProduct(id: string, data: {
  name?: string
  priceKES?: number
  stockLevel?: number
  lowStockAlert?: number
}) {
  await prisma.product.update({ where: { id }, data })
  revalidatePath('/inventory')
  revalidatePath('/dashboard')
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath('/inventory')
  revalidatePath('/dashboard')
}

export async function getRawMaterials() {
  return prisma.rawMaterial.findMany({ orderBy: { name: 'asc' } })
}

export async function createRawMaterial(data: {
  name: string
  unit: string
  stockLevel: number
  lowStockAlert?: number
}) {
  await prisma.rawMaterial.create({ data })
  revalidatePath('/inventory')
}

// ─── FINANCE MODULE ───────────────────────────────────────────────────────────

export async function getFinancialRecords() {
  return prisma.financialRecord.findMany({ orderBy: { date: 'desc' } })
}

export async function getFinanceSummary() {
  const [income, expenses, records] = await Promise.all([
    prisma.financialRecord.aggregate({ _sum: { amount: true }, where: { type: 'INCOME' } }),
    prisma.financialRecord.aggregate({ _sum: { amount: true }, where: { type: 'EXPENSE' } }),
    prisma.financialRecord.findMany({
      orderBy: { date: 'desc' },
      take: 50,
    }),
  ])

  return {
    totalIncome: income._sum.amount ?? 0,
    totalExpenses: expenses._sum.amount ?? 0,
    netBalance: (income._sum.amount ?? 0) - (expenses._sum.amount ?? 0),
    records,
  }
}

export async function createFinancialRecord(data: {
  type: string
  amount: number
  description: string
  category?: string
}) {
  await prisma.financialRecord.create({ data: { ...data, category: data.category ?? 'GENERAL' } })
  revalidatePath('/finance')
  revalidatePath('/dashboard')
}

// ─── HR MODULE ────────────────────────────────────────────────────────────────

export async function getEmployees() {
  return prisma.employee.findMany({ orderBy: { name: 'asc' } })
}

export async function createEmployee(data: {
  name: string
  email: string
  role?: string
  department: string
  salary: number
}) {
  await prisma.employee.create({ data })
  revalidatePath('/hr')
  revalidatePath('/dashboard')
}

export async function updateEmployee(id: string, data: {
  name?: string
  department?: string
  salary?: number
  isActive?: boolean
}) {
  await prisma.employee.update({ where: { id }, data })
  revalidatePath('/hr')
}

export async function processPayroll(employeeId: string, period: string) {
  const employee = await prisma.employee.findUniqueOrThrow({ where: { id: employeeId } })

  await prisma.$transaction(async (tx) => {
    const record = await tx.financialRecord.create({
      data: {
        type: 'EXPENSE',
        amount: employee.salary,
        description: `Payroll: ${employee.name} — ${period}`,
        category: 'PAYROLL',
      },
    })

    await tx.payroll.create({
      data: {
        employeeId,
        amount: employee.salary,
        period,
        financialRecordId: record.id,
      },
    })
  })

  revalidatePath('/hr')
  revalidatePath('/finance')
  revalidatePath('/dashboard')
}

export async function getPayrollHistory() {
  return prisma.payroll.findMany({
    orderBy: { paidAt: 'desc' },
    include: { employee: true },
  })
}

// ─── CRM MODULE ───────────────────────────────────────────────────────────────

export async function getCustomers() {
  return prisma.customer.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { sales: true } } },
  })
}

export async function createCustomer(data: {
  name: string
  email?: string
  phone?: string
  company?: string
}) {
  await prisma.customer.create({ data })
  revalidatePath('/crm')
}

export async function updateCustomer(id: string, data: {
  name?: string
  email?: string
  phone?: string
  company?: string
}) {
  await prisma.customer.update({ where: { id }, data })
  revalidatePath('/crm')
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } })
  revalidatePath('/crm')
}

// ─── PROCUREMENT MODULE ───────────────────────────────────────────────────────

export async function getSuppliers() {
  return prisma.supplier.findMany({ orderBy: { name: 'asc' } })
}

export async function createSupplier(data: {
  name: string
  email?: string
  phone?: string
  address?: string
}) {
  await prisma.supplier.create({ data })
  revalidatePath('/procurement')
}

export async function getPurchaseOrders() {
  return prisma.purchaseOrder.findMany({
    orderBy: { createdAt: 'desc' },
    include: { supplier: true, product: true, rawMaterial: true },
  })
}

export async function createPurchaseOrder(data: {
  supplierId: string
  productId?: string
  rawMaterialId?: string
  quantity: number
  unitCostKES: number
}) {
  const totalCostKES = data.quantity * data.unitCostKES
  await prisma.purchaseOrder.create({
    data: { ...data, totalCostKES, status: 'PENDING' },
  })
  revalidatePath('/procurement')
}

export async function receivePurchaseOrder(poId: string) {
  const po = await prisma.purchaseOrder.findUniqueOrThrow({
    where: { id: poId },
    include: { product: true, rawMaterial: true },
  })

  if (po.status !== 'PENDING') throw new Error('Order already processed.')

  await prisma.$transaction(async (tx) => {
    // Create expense record
    const record = await tx.financialRecord.create({
      data: {
        type: 'EXPENSE',
        amount: po.totalCostKES,
        description: `Purchase Order received from supplier`,
        category: 'PROCUREMENT',
      },
    })

    // Update PO status and link financial record
    await tx.purchaseOrder.update({
      where: { id: poId },
      data: { status: 'RECEIVED', receivedAt: new Date(), financialRecordId: record.id },
    })

    // Increase stock
    if (po.productId) {
      await tx.product.update({
        where: { id: po.productId },
        data: { stockLevel: { increment: Math.floor(po.quantity) } },
      })
    }
    if (po.rawMaterialId) {
      await tx.rawMaterial.update({
        where: { id: po.rawMaterialId },
        data: { stockLevel: { increment: po.quantity } },
      })
    }
  })

  revalidateAll()
}

// ─── PRODUCTION MODULE ────────────────────────────────────────────────────────

export async function getProductionRuns() {
  return prisma.productionRun.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: true, materials: { include: { rawMaterial: true } } },
  })
}

export async function createProductionRun(data: {
  productId: string
  quantityMade: number
  notes?: string
  materials: { rawMaterialId: string; quantityUsed: number }[]
}) {
  await prisma.$transaction(async (tx) => {
    // Deduct raw materials
    for (const mat of data.materials) {
      const rm = await tx.rawMaterial.findUniqueOrThrow({ where: { id: mat.rawMaterialId } })
      if (rm.stockLevel < mat.quantityUsed) {
        throw new Error(`Insufficient stock of ${rm.name}. Available: ${rm.stockLevel} ${rm.unit}`)
      }
      await tx.rawMaterial.update({
        where: { id: mat.rawMaterialId },
        data: { stockLevel: { decrement: mat.quantityUsed } },
      })
    }

    // Increase finished product stock
    await tx.product.update({
      where: { id: data.productId },
      data: { stockLevel: { increment: data.quantityMade } },
    })

    // Log the run
    const run = await tx.productionRun.create({
      data: {
        productId: data.productId,
        quantityMade: data.quantityMade,
        notes: data.notes,
      },
    })

    for (const mat of data.materials) {
      await tx.productionRunMaterial.create({
        data: {
          productionRunId: run.id,
          rawMaterialId: mat.rawMaterialId,
          quantityUsed: mat.quantityUsed,
        },
      })
    }
  })

  revalidateAll()
}

/**
 * Kenya Statutory Tax Computation Engine
 * Rates as per Finance Act 2024 / Tax Laws Amendment Act 2024
 */

export interface KenyaPayrollInput {
  grossSalary: number
  isResident?: boolean
}

export interface KenyaPayrollResult {
  grossSalary: number
  shif: number             // 2.75% of gross, min KES 300
  ahl: number              // 1.5% employee
  ahlEmployer: number      // 1.5% employer
  nssfEmployee: number     // 6% tiered
  nssfEmployer: number     // 6% tiered
  taxableIncome: number    // gross - shif - ahl
  paye: number             // progressive tax
  personalRelief: number   // KES 2,400
  netPaye: number          // paye - personalRelief (floor 0)
  netPay: number           // gross - shif - ahl - nssfEmployee - netPaye
  totalEmployerCost: number // gross + ahlEmployer + nssfEmployer
}

// NSSF Tier limits (effective Feb 2025, Year 3 rates)
const NSSF_TIER_1_LIMIT = 7000   // Lower Earnings Limit
const NSSF_TIER_2_LIMIT = 36000  // Upper Earnings Limit
const NSSF_RATE = 0.06           // 6%

// SHIF
const SHIF_RATE = 0.0275
const SHIF_MIN = 300

// AHL
const AHL_RATE = 0.015

// PAYE Tax Bands 2025 (monthly)
const PAYE_BANDS = [
  { limit: 24000,   rate: 0.10 },
  { limit: 8333,    rate: 0.25 },
  { limit: 467667,  rate: 0.30 },
  { limit: 300000,  rate: 0.325 },
  { limit: Infinity, rate: 0.35 },
]

const PERSONAL_RELIEF = 2400  // KES per month

function computeNSSF(grossSalary: number): { employee: number; employer: number } {
  const tier1 = Math.min(grossSalary, NSSF_TIER_1_LIMIT) * NSSF_RATE
  const tier2Eligible = Math.max(0, Math.min(grossSalary, NSSF_TIER_2_LIMIT) - NSSF_TIER_1_LIMIT)
  const tier2 = tier2Eligible * NSSF_RATE
  const total = tier1 + tier2
  return { employee: total, employer: total }
}

function computePAYE(taxableIncome: number): number {
  let tax = 0
  let remaining = taxableIncome

  for (const band of PAYE_BANDS) {
    if (remaining <= 0) break
    const taxable = Math.min(remaining, band.limit)
    tax += taxable * band.rate
    remaining -= taxable
  }

  return Math.max(0, tax - PERSONAL_RELIEF)
}

export function computeKenyaPayroll(input: KenyaPayrollInput): KenyaPayrollResult {
  const { grossSalary } = input

  // SHIF
  const shif = Math.max(SHIF_MIN, grossSalary * SHIF_RATE)

  // AHL
  const ahl = grossSalary * AHL_RATE
  const ahlEmployer = grossSalary * AHL_RATE

  // NSSF
  const { employee: nssfEmployee, employer: nssfEmployer } = computeNSSF(grossSalary)

  // Taxable income (SHIF + AHL deductible before PAYE per 2024 amendment)
  const taxableIncome = Math.max(0, grossSalary - shif - ahl)

  // PAYE
  const rawPaye = computePAYE(taxableIncome)
  const netPaye = rawPaye  // personal relief already deducted inside computePAYE

  // Net Pay
  const netPay = grossSalary - shif - ahl - nssfEmployee - netPaye

  return {
    grossSalary,
    shif: Math.round(shif * 100) / 100,
    ahl: Math.round(ahl * 100) / 100,
    ahlEmployer: Math.round(ahlEmployer * 100) / 100,
    nssfEmployee: Math.round(nssfEmployee * 100) / 100,
    nssfEmployer: Math.round(nssfEmployer * 100) / 100,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    paye: Math.round(rawPaye * 100) / 100,
    personalRelief: PERSONAL_RELIEF,
    netPaye: Math.round(netPaye * 100) / 100,
    netPay: Math.round(netPay * 100) / 100,
    totalEmployerCost: Math.round((grossSalary + ahlEmployer + nssfEmployer) * 100) / 100,
  }
}

// VAT helpers
export const VAT_RATE = 0.16
export const WHT_RATE = 0.05

export function computeVAT(netAmount: number): { net: number; vat: number; gross: number } {
  const vat = netAmount * VAT_RATE
  return { net: netAmount, vat: Math.round(vat * 100) / 100, gross: Math.round((netAmount + vat) * 100) / 100 }
}

export function extractVATFromGross(grossAmount: number): { net: number; vat: number; gross: number } {
  const vat = (grossAmount * VAT_RATE) / (1 + VAT_RATE)
  const net = grossAmount - vat
  return { net: Math.round(net * 100) / 100, vat: Math.round(vat * 100) / 100, gross: grossAmount }
}

// Tax filing due dates
export function getVATDueDate(period: Date): Date {
  const due = new Date(period.getFullYear(), period.getMonth() + 1, 20)
  return due
}

export function getPAYEDueDate(period: Date): Date {
  const due = new Date(period.getFullYear(), period.getMonth() + 1, 9)
  return due
}

export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

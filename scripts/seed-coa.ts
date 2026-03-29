/**
 * Kenya IFRS-aligned Standard Chart of Accounts Seed
 * Run: npx ts-node scripts/seed-coa.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const accounts = [
  // ─── ASSETS ────────────────────────────────────────────────────────
  { code: '1000', name: 'Current Assets', type: 'ASSET', subType: 'GROUP', isSystem: true },
  { code: '1100', name: 'Cash and Cash Equivalents', type: 'ASSET', subType: 'CURRENT_ASSET', isSystem: true, parent: '1000' },
  { code: '1110', name: 'Petty Cash', type: 'ASSET', subType: 'CURRENT_ASSET', parent: '1100' },
  { code: '1120', name: 'KCB Bank Account', type: 'ASSET', subType: 'CURRENT_ASSET', parent: '1100' },
  { code: '1130', name: 'Equity Bank Account', type: 'ASSET', subType: 'CURRENT_ASSET', parent: '1100' },
  { code: '1140', name: 'M-Pesa Paybill', type: 'ASSET', subType: 'CURRENT_ASSET', parent: '1100' },
  { code: '1200', name: 'Accounts Receivable', type: 'ASSET', subType: 'CURRENT_ASSET', isSystem: true, parent: '1000' },
  { code: '1210', name: 'Trade Receivables', type: 'ASSET', subType: 'CURRENT_ASSET', parent: '1200' },
  { code: '1300', name: 'Inventory', type: 'ASSET', subType: 'CURRENT_ASSET', parent: '1000' },
  { code: '1310', name: 'Finished Goods', type: 'ASSET', subType: 'CURRENT_ASSET', parent: '1300' },
  { code: '1320', name: 'Raw Materials', type: 'ASSET', subType: 'CURRENT_ASSET', parent: '1300' },
  { code: '1400', name: 'Prepaid Expenses', type: 'ASSET', subType: 'CURRENT_ASSET', parent: '1000' },
  { code: '1500', name: 'VAT Receivable (Input Tax)', type: 'ASSET', subType: 'CURRENT_ASSET', isSystem: true, parent: '1000' },
  { code: '2000', name: 'Non-Current Assets', type: 'ASSET', subType: 'GROUP', isSystem: true },
  { code: '2100', name: 'Property, Plant & Equipment', type: 'ASSET', subType: 'FIXED_ASSET', parent: '2000' },
  { code: '2110', name: 'Motor Vehicles', type: 'ASSET', subType: 'FIXED_ASSET', parent: '2100' },
  { code: '2120', name: 'Furniture & Fittings', type: 'ASSET', subType: 'FIXED_ASSET', parent: '2100' },
  { code: '2130', name: 'Computer Equipment', type: 'ASSET', subType: 'FIXED_ASSET', parent: '2100' },
  { code: '2200', name: 'Accumulated Depreciation', type: 'ASSET', subType: 'CONTRA_ASSET', isSystem: true, parent: '2000' },

  // ─── LIABILITIES ────────────────────────────────────────────────────
  { code: '3000', name: 'Current Liabilities', type: 'LIABILITY', subType: 'GROUP', isSystem: true },
  { code: '3100', name: 'Accounts Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', isSystem: true, parent: '3000' },
  { code: '3110', name: 'Trade Payables', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', parent: '3100' },
  { code: '3200', name: 'Tax Liabilities', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', isSystem: true, parent: '3000' },
  { code: '3210', name: 'VAT Payable (Output Tax)', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', isSystem: true, parent: '3200' },
  { code: '3220', name: 'PAYE Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', isSystem: true, parent: '3200' },
  { code: '3230', name: 'NSSF Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', isSystem: true, parent: '3200' },
  { code: '3240', name: 'SHIF Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', isSystem: true, parent: '3200' },
  { code: '3250', name: 'AHL Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', isSystem: true, parent: '3200' },
  { code: '3300', name: 'Accrued Liabilities', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', parent: '3000' },
  { code: '3310', name: 'Salaries Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', parent: '3300' },
  { code: '4000', name: 'Non-Current Liabilities', type: 'LIABILITY', subType: 'GROUP' },
  { code: '4100', name: 'Bank Loans', type: 'LIABILITY', subType: 'LONG_TERM_LIABILITY', parent: '4000' },

  // ─── EQUITY ─────────────────────────────────────────────────────────
  { code: '5000', name: 'Equity', type: 'EQUITY', subType: 'GROUP', isSystem: true },
  { code: '5100', name: 'Share Capital', type: 'EQUITY', subType: 'EQUITY', isSystem: true, parent: '5000' },
  { code: '5200', name: 'Retained Earnings', type: 'EQUITY', subType: 'EQUITY', isSystem: true, parent: '5000' },
  { code: '5300', name: 'Current Year Profit', type: 'EQUITY', subType: 'EQUITY', isSystem: true, parent: '5000' },

  // ─── REVENUE ─────────────────────────────────────────────────────────
  { code: '6000', name: 'Revenue', type: 'REVENUE', subType: 'GROUP', isSystem: true },
  { code: '6100', name: 'Sales Revenue', type: 'REVENUE', subType: 'OPERATING', isSystem: true, parent: '6000' },
  { code: '6110', name: 'Product Sales', type: 'REVENUE', subType: 'OPERATING', parent: '6100' },
  { code: '6120', name: 'Service Revenue', type: 'REVENUE', subType: 'OPERATING', parent: '6100' },
  { code: '6200', name: 'Other Income', type: 'REVENUE', subType: 'NON_OPERATING', parent: '6000' },
  { code: '6210', name: 'Interest Income', type: 'REVENUE', subType: 'NON_OPERATING', parent: '6200' },
  { code: '6220', name: 'Foreign Exchange Gain', type: 'REVENUE', subType: 'NON_OPERATING', parent: '6200' },

  // ─── EXPENSES ────────────────────────────────────────────────────────
  { code: '7000', name: 'Cost of Goods Sold', type: 'EXPENSE', subType: 'COGS', isSystem: true },
  { code: '7100', name: 'Material Costs', type: 'EXPENSE', subType: 'COGS', parent: '7000' },
  { code: '7200', name: 'Direct Labour', type: 'EXPENSE', subType: 'COGS', parent: '7000' },
  { code: '8000', name: 'Operating Expenses', type: 'EXPENSE', subType: 'GROUP', isSystem: true },
  { code: '8100', name: 'Salaries & Wages', type: 'EXPENSE', subType: 'PERSONNEL', isSystem: true, parent: '8000' },
  { code: '8110', name: 'Gross Salaries', type: 'EXPENSE', subType: 'PERSONNEL', parent: '8100' },
  { code: '8120', name: 'NSSF Employer Contribution', type: 'EXPENSE', subType: 'PERSONNEL', parent: '8100' },
  { code: '8130', name: 'AHL Employer Contribution', type: 'EXPENSE', subType: 'PERSONNEL', parent: '8100' },
  { code: '8200', name: 'Rent & Occupancy', type: 'EXPENSE', subType: 'OCCUPANCY', parent: '8000' },
  { code: '8300', name: 'Utilities', type: 'EXPENSE', subType: 'UTILITIES', parent: '8000' },
  { code: '8400', name: 'Marketing & Advertising', type: 'EXPENSE', subType: 'MARKETING', parent: '8000' },
  { code: '8500', name: 'Office & Admin Expenses', type: 'EXPENSE', subType: 'ADMIN', parent: '8000' },
  { code: '8600', name: 'Depreciation Expense', type: 'EXPENSE', subType: 'DEPRECIATION', isSystem: true, parent: '8000' },
  { code: '8700', name: 'Bank Charges', type: 'EXPENSE', subType: 'FINANCIAL', parent: '8000' },
  { code: '8800', name: 'Professional Fees', type: 'EXPENSE', subType: 'ADMIN', parent: '8000' },
  { code: '8810', name: 'Audit Fees', type: 'EXPENSE', subType: 'ADMIN', parent: '8800' },
  { code: '8820', name: 'Legal Fees', type: 'EXPENSE', subType: 'ADMIN', parent: '8800' },
  { code: '8900', name: 'Miscellaneous Expenses', type: 'EXPENSE', subType: 'GENERAL', parent: '8000' },
]

async function seedCoA() {
  console.log('🌱 Seeding Kenya Standard Chart of Accounts...')

  // Build code → id map for parent linking
  const codeToId = new Map<string, string>()

  for (const acc of accounts) {
    const existing = await prisma.chartOfAccount.findFirst({ where: { code: acc.code } })
    if (existing) {
      codeToId.set(acc.code, existing.id)
      console.log(`  ✓ Exists: ${acc.code} ${acc.name}`)
      continue
    }

    const parentId = acc.parent ? codeToId.get(acc.parent) : undefined

    const created = await prisma.chartOfAccount.create({
      data: {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        subType: acc.subType,
        isSystem: acc.isSystem ?? false,
        parentId: parentId ?? null,
      },
    })

    codeToId.set(acc.code, created.id)
    console.log(`  + Created: ${acc.code} ${acc.name}`)
  }

  // Seed default tax rates
  const taxRates = [
    { code: 'VAT16', name: 'VAT 16%', rate: 0.16, taxType: 'VAT' },
    { code: 'VAT0', name: 'Zero Rated (0%)', rate: 0, taxType: 'VAT' },
    { code: 'EXEMPT', name: 'Exempt', rate: 0, taxType: 'EXEMPT' },
    { code: 'WHT5', name: 'WHT 5%', rate: 0.05, taxType: 'WHT' },
    { code: 'WHT3', name: 'WHT 3%', rate: 0.03, taxType: 'WHT' },
    { code: 'WHT15', name: 'WHT 15% (Dividends)', rate: 0.15, taxType: 'WHT' },
  ]

  for (const tr of taxRates) {
    await prisma.taxRate.upsert({
      where: { code: tr.code },
      create: tr,
      update: tr,
    })
    console.log(`  ✓ Tax Rate: ${tr.name}`)
  }

  // Seed module config
  await prisma.moduleConfig.upsert({
    where: { tenantId: 'default' },
    create: { tenantId: 'default' },
    update: {},
  })
  console.log('  ✓ Module config initialized')

  console.log('\n✅ Chart of Accounts seeded successfully!')
  console.log(`   ${accounts.length} accounts | ${taxRates.length} tax rates`)
}

seedCoA()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

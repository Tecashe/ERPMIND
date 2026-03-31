'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { submitInvoiceToETIMS } from './accounting'

export type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  taxRate: number // usually 0.16
}

export async function checkoutPOS(data: {
  cart: CartItem[]
  customerId?: string
  paymentMethod: string
}) {
  if (!data.cart || data.cart.length === 0) {
    throw new Error('Cart is empty')
  }

  // 1. Verify stock levels before doing anything
  const productIds = data.cart.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  })

  // Check inventory
  for (const item of data.cart) {
    const product = products.find((p) => p.id === item.productId)
    if (!product) throw new Error(`Product ${item.name} not found in database.`)
    if (product.stockLevel < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stockLevel}`)
    }
  }

  // 2. Compute totals
  let subtotal = 0
  let totalVat = 0

  for (const item of data.cart) {
    const lineSubtotal = item.price * item.quantity
    const lineVat = lineSubtotal * item.taxRate
    subtotal += lineSubtotal
    totalVat += lineVat
  }
  const totalAmount = subtotal + totalVat

  // 3. Database Transaction (Atomic)
  const invoiceId = await prisma.$transaction(async (tx) => {
    // A. Generate Invoice Number
    const count = await tx.invoice.count()
    const invoiceNumber = `POS-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`

    // B. Create Financial Record (Unified for the receipt)
    const finRecord = await tx.financialRecord.create({
      data: {
        type: 'INCOME',
        amount: totalAmount,
        description: `POS Sale: ${invoiceNumber}`,
        category: 'SALES',
      },
    })

    // C. Create the Master Invoice
    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        customerId: data.customerId || null,
        status: 'PAID',
        subtotal,
        totalVat,
        totalAmount,
        amountPaid: totalAmount,
        // Since it's POS, paid instantly
        payments: {
          create: {
            amount: totalAmount,
            paymentMethod: data.paymentMethod,
            notes: 'POS Instant Checkout',
          },
        },
      },
    })

    // D. Process Line Items
    for (const item of data.cart) {
      const lineSubtotal = item.price * item.quantity
      const lineVat = lineSubtotal * item.taxRate

      // Create Invoice Line Item (For eTIMS & Receipts)
      await tx.invoiceLineItem.create({
        data: {
          invoiceId: invoice.id,
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          taxAmount: lineVat,
          lineTotal: lineSubtotal + lineVat,
        },
      })

      // Create Legacy Sale Record (For Dashboard Metrics compatibility)
      // Since POS aggregates into 1 Financial Record, we leave financialRecordId blank on the Sale to avoid unique constraint violations, OR we create a mini financial record per sale. 
      // It's cleaner to create 1 unified financial record and skip linking it to the legacy Sale, as `financialRecordId` is optional.
      await tx.sale.create({
        data: {
          productId: item.productId,
          customerId: data.customerId || null,
          quantity: item.quantity,
          totalAmount: lineSubtotal + lineVat,
          vatAmount: lineVat,
          status: 'PAID',
        },
      })

      // Deduct Inventory Stock
      await tx.product.update({
        where: { id: item.productId },
        data: { stockLevel: { decrement: item.quantity } },
      })
    }

    return invoice.id
  })

  // 4. Submit to eTIMS asynchronously
  try {
    // We don't await this so the POS drawer opens instantly for the cashier
    submitInvoiceToETIMS(invoiceId).catch((err) => {
      console.error('POS eTIMS Submission Failed:', err)
    })
  } catch (e) {
    console.warn('Could not dispatch eTIMS background task', e)
  }

  revalidatePath('/dashboard')
  revalidatePath('/sales')
  revalidatePath('/finance')
  revalidatePath('/inventory')
  
  return { success: true, invoiceId }
}

export async function getPOSProducts() {
  return prisma.product.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      sku: true,
      priceKES: true,
      stockLevel: true,
    },
  })
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkoutPOS, CartItem } from '@/app/actions/pos'

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
    }

    const keyToken = authHeader.split(' ')[1]
    const apiKeyInfo = await prisma.apiKey.findUnique({
      where: { keyString: keyToken },
    })

    if (!apiKeyInfo || !apiKeyInfo.isActive) {
      return NextResponse.json({ error: 'Invalid or revoked API Key' }, { status: 403 })
    }

    // Security: Only WRITE_ONLY / READ_WRITE allowed for checkouts (but all are right now)
    await prisma.apiKey.update({
      where: { id: apiKeyInfo.id },
      data: { lastUsedAt: new Date() },
    })

    // 2. Parse Payload
    const body = await req.json()
    const { items, paymentMethod, customerId } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Payload must contain a non-empty "items" array' }, { status: 400 })
    }

    // 3. Map SKUs to Internal Products
    const skus = items.map((i: any) => i.sku)
    const products = await prisma.product.findMany({
      where: { sku: { in: skus } },
    })

    const cart: CartItem[] = []
    for (const item of items) {
      const dbProduct = products.find(p => p.sku === item.sku)
      if (!dbProduct) {
        return NextResponse.json({ error: `Product with SKU ${item.sku} not found in ERP` }, { status: 404 })
      }
      
      cart.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        // Override price if external system provides it, otherwise use DB price
        price: item.overridePrice !== undefined ? Number(item.overridePrice) : dbProduct.priceKES,
        quantity: Number(item.quantity || 1),
        taxRate: 0.16, // Fixed KRA rate for MVP
      })
    }

    // 4. Dispatch Atomic Transaction (Same engine as POS)
    const result = await checkoutPOS({
      cart,
      customerId,
      paymentMethod: paymentMethod || 'ONLINE'
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Sale successfully committed to ERP and queued for KRA eTIMS',
        invoiceId: result.invoiceId
      })
    } else {
      return NextResponse.json({ error: 'Failed to process sale internally' }, { status: 500 })
    }

  } catch (error: any) {
    console.error('API Checkout Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

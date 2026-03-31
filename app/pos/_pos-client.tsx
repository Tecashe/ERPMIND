'use client'

import React, { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, ScanLine, ArrowLeft, ShoppingCart, Trash2,
  Plus, Minus, CreditCard, Banknote, Smartphone,
  CheckCircle2, Loader2, FileText, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { checkoutPOS, CartItem } from '@/app/actions/pos'

type Product = {
  id: string
  name: string
  sku: string
  priceKES: number
  stockLevel: number
}

type Customer = {
  id: string
  name: string
  email: string | null
  phone: string | null
}

const TAX_RATE = 0.16

export function POSClient({
  initialProducts,
  customers,
}: {
  initialProducts: Product[]
  customers: Customer[]
}) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MPESA' | 'CARD'>('CASH')

  const [isPending, startTransition] = useTransition()
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 1. Barcode Scanner Listener
  // Scanners act as keyboards. They type chars very fast and hit "Enter".
  const barcodeBuffer = useRef('')
  const lastKeyTime = useRef(Date.now())

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input/textarea manually typing
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return
      }

      const now = Date.now()
      // If > 100ms between keystrokes, it's a human typing. Reset buffer.
      if (now - lastKeyTime.current > 100) {
        barcodeBuffer.current = ''
      }
      lastKeyTime.current = now

      if (e.key === 'Enter' && barcodeBuffer.current.length > 2) {
        // Barcode scan complete
        const scannedSku = barcodeBuffer.current
        barcodeBuffer.current = ''
        handleBarcodeScanned(scannedSku)
        e.preventDefault()
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [initialProducts]) // eslint-disable-line

  const handleBarcodeScanned = (sku: string) => {
    const product = initialProducts.find((p) => p.sku === sku || p.id === sku)
    if (product) {
      addToCart(product)
      // Visual feedback via console (or a toast)
      console.log(`Scanned: ${product.name}`)
    } else {
      setError(`No product found for barcode: ${sku}`)
      setTimeout(() => setError(null), 3000)
    }
  }

  // 2. Cart Management
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        if (existing.quantity >= product.stockLevel) return prev // Can't add more than stock
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      if (product.stockLevel < 1) return prev
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.priceKES,
        quantity: 1,
        taxRate: TAX_RATE,
      }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item
        const product = initialProducts.find(p => p.id === productId)
        const newQty = item.quantity + delta
        if (newQty < 1) return item
        if (product && newQty > product.stockLevel) return item
        return { ...item, quantity: newQty }
      })
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  // 3. Derived Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalVat = subtotal * TAX_RATE
  const grandTotal = subtotal + totalVat

  // 4. Checkout Handler
  const handleCheckout = () => {
    if (cart.length === 0) return
    setError(null)

    startTransition(async () => {
      try {
        const result = await checkoutPOS({
          cart,
          customerId: selectedCustomerId || undefined,
          paymentMethod,
        })
        if (result.success) {
          setCheckoutSuccess(result.invoiceId)
          setCart([]) // Clear cart
          setSearchTerm('')
          setSelectedCustomerId('')
          // Reset success screen after 3 seconds
          setTimeout(() => {
            setCheckoutSuccess(null)
            router.refresh()
          }, 3000)
        }
      } catch (err: any) {
        setError(err.message || 'Checkout failed')
      }
    })
  }

  // 5. Product Filtering
  const filteredProducts = initialProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`

  // Success Screen
  if (checkoutSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Checkout Complete</h1>
        <p className="text-muted-foreground mb-8">
          Invoice created and dispatched to KRA eTIMS successfully.
        </p>
        <button
          onClick={() => setCheckoutSuccess(null)}
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all"
        >
          New Sale
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden text-sm">
      
      {/* LEFT PANEL: Products Library */}
      <div className="flex-1 flex flex-col bg-muted/10 border-r border-border h-full">
        {/* Top Navbar */}
        <div className="h-16 px-6 border-b border-border bg-background flex items-center gap-4 justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-foreground text-lg">Point of Sale</h1>
              <p className="text-xs text-muted-foreground">Scan barcodes or select items manually</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
            </div>
            <div className="px-3 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center gap-2 border border-emerald-500/20">
              <ScanLine className="w-4 h-4" />
              <span className="font-semibold text-xs relative top-[0.5px]">Scanner Active</span>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
              <p>No products match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stockLevel <= 0
                return (
                  <button
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    disabled={isOutOfStock}
                    className={`card-premium p-4 text-left transition-all duration-200 active:scale-95 flex flex-col h-32 ${
                      isOutOfStock ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:border-primary/50 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="mb-auto">
                      <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{p.sku}</p>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <span className="font-bold text-primary">{fmt(p.priceKES)}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isOutOfStock ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {p.stockLevel} in stock
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Cart & Checkout */}
      <div className="w-[420px] bg-background flex flex-col h-full shadow-2xl relative z-20">
        
        {/* Cart Header */}
        <div className="p-5 border-b border-border bg-muted/10 shrink-0">
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" /> Current Sale
          </h2>
          
          {/* Customer Selection */}
          <div className="mt-4">
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
              Customer (Optional)
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 appearance-none"
            >
              <option value="">Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-xs font-semibold flex items-start gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 scroll-smooth space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/60 text-center">
              <ScanLine className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium text-sm">Cart is empty</p>
              <p className="text-xs mt-1">Scan a barcode or add items from the grid</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex gap-3 p-3 rounded-xl border border-border bg-background hover:bg-muted/10 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate leading-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{fmt(item.price)} each</p>
                  <div className="mt-2 flex items-center w-max bg-muted/50 rounded-lg border border-border">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-l-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-r-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between items-end">
                  <span className="font-bold text-foreground block">
                    {fmt(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        <div className="p-5 bg-muted/10 border-t border-border shrink-0">
          
          <div className="space-y-2.5 mb-5 text-sm">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>VAT (16%)</span>
              <span>{fmt(totalVat)}</span>
            </div>
            <div className="flex justify-between items-end mt-4 pt-4 border-t border-border border-dashed">
              <span className="font-bold text-foreground uppercase tracking-wider text-xs">Total Amount</span>
              <span className="text-3xl font-bold text-primary tracking-tight font-mono">{fmt(grandTotal).replace('KES ', '')}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { id: 'CASH', label: 'Cash', icon: Banknote },
              { id: 'MPESA', label: 'M-Pesa', icon: Smartphone },
              { id: 'CARD', label: 'Card', icon: CreditCard },
            ].map((pm) => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id as any)}
                className={`py-2 px-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all text-xs font-semibold ${
                  paymentMethod === pm.id
                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                    : 'bg-background border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/30'
                }`}
              >
                <pm.icon className="w-4 h-4" />
                {pm.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isPending}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-lg hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
            {isPending ? 'Processing Checkout...' : 'Charge Customer'}
          </button>
        </div>

      </div>
    </div>
  )
}

'use client'

import React, { useState, useTransition } from 'react'
import { PlusCircle, ShoppingCart } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createSale } from '@/app/actions'

type Product = { id: string; name: string; sku: string; priceKES: number; stockLevel: number }
type Customer = { id: string; name: string }

const saleSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  customerId: z.string().optional(),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
})
type SaleFormValues = z.infer<typeof saleSchema>

export function RecordSaleModal({ products, customers = [] }: { products: Product[]; customers?: Customer[] }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: { productId: '', quantity: 1 },
  })

  const selectedProductId = watch('productId')
  const quantity = watch('quantity') || 0
  const selectedProduct = products.find(p => p.id === selectedProductId)
  const priceKES = selectedProduct?.priceKES ?? 0
  const subtotal = quantity * priceKES
  const vat = subtotal * 0.16
  const totalAmount = subtotal + vat

  const onSubmit = (data: SaleFormValues) => {
    if (selectedProduct && data.quantity > selectedProduct.stockLevel) {
      toast.error(`Insufficient stock! Only ${selectedProduct.stockLevel} left.`)
      return
    }
    startTransition(async () => {
      try {
        await createSale({
          productId: data.productId,
          customerId: data.customerId || undefined,
          quantity: data.quantity,
        })
        toast.success('Sale recorded! Inventory & Finance updated.')
        setOpen(false)
        reset()
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'Failed to record sale.')
      }
    })
  }

  const inputClass = "flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all appearance-none"

  return (
    <Dialog open={open} onOpenChange={(val: boolean) => { setOpen(val); if (!val) reset() }}>
      <DialogTrigger asChild>
        <button className="btn-primary gap-2">
          <PlusCircle className="w-5 h-5" />
          <span>Record Sale</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] glassmorphism border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">Record a Sale</DialogTitle>
          </div>
          <DialogDescription>Log a sale. VAT (16%) is calculated automatically. Stock and Finance update instantly.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Product</label>
            <select {...register('productId')} className={inputClass}>
              <option value="" disabled>-- Select a Product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.stockLevel === 0}>
                  {p.name} ({p.sku}) — {p.stockLevel} in stock
                </option>
              ))}
            </select>
            {errors.productId && <p className="text-xs text-destructive">{errors.productId.message}</p>}
          </div>

          {customers.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Customer (optional)</label>
              <select {...register('customerId')} className={inputClass}>
                <option value="">Walk-in / Anonymous</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Quantity</label>
            <input type="number" {...register('quantity')} className={inputClass} placeholder="1" min="1"
              max={selectedProduct?.stockLevel ?? undefined} />
            {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
          </div>

          {/* Live price preview */}
          <div className="mt-4 p-5 rounded-xl bg-card border border-border shadow-sm space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Unit Price:</span>
              <span className="font-medium text-foreground">KES {priceKES.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-medium text-foreground">KES {subtotal.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>VAT (16%):</span>
              <span className="font-medium text-foreground">KES {vat.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-primary pt-3 border-t border-border">
              <span>Total:</span>
              <span>KES {totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={isPending || !selectedProductId} className="btn-primary">
              {isPending ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

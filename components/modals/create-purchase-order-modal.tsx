'use client'

import React, { useState, useTransition } from 'react'
import { ShoppingBag } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createPurchaseOrder } from '@/app/actions'

type Supplier = { id: string; name: string }

const schema = z.object({
  supplierId: z.string().min(1, 'Select a supplier'),
  productId: z.string().optional(),
  quantity: z.coerce.number().min(1),
  unitCostKES: z.coerce.number().min(0.01),
})
type FormValues = z.infer<typeof schema>

export function CreatePurchaseOrderModal({ suppliers }: { suppliers: Supplier[] }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      try {
        await createPurchaseOrder(data)
        toast.success('Purchase order created!')
        setOpen(false)
        reset()
      } catch {
        toast.error('Failed to create purchase order.')
      }
    })
  }

  const inputClass = "flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"

  return (
    <Dialog open={open} onOpenChange={(val: boolean) => { setOpen(val); if (!val) reset() }}>
      <DialogTrigger asChild>
        <button className="btn-primary gap-2">
          <ShoppingBag className="w-5 h-5" />
          <span>Create Order</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] glassmorphism border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <DialogTitle className="text-2xl font-bold">Create Purchase Order</DialogTitle>
          </div>
          <DialogDescription>Raise a PO. Mark it as Received to update stock and Finance.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Supplier</label>
            <select {...register('supplierId')} className={inputClass}>
              <option value="">Select supplier...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.supplierId && <p className="text-xs text-destructive">{errors.supplierId.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Quantity</label>
              <input {...register('quantity')} type="number" className={inputClass} placeholder="100" />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Unit Cost (KES)</label>
              <input {...register('unitCostKES')} type="number" step="0.01" className={inputClass} placeholder="0.00" />
              {errors.unitCostKES && <p className="text-xs text-destructive">{errors.unitCostKES.message}</p>}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? 'Creating...' : 'Create PO'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

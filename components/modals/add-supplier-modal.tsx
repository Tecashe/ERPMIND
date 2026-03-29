'use client'

import React, { useState, useTransition } from 'react'
import { Truck, PlusCircle } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createSupplier } from '@/app/actions'

const schema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export function AddSupplierModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      try {
        await createSupplier({ ...data, email: data.email || undefined })
        toast.success('Supplier added!')
        setOpen(false)
        reset()
      } catch {
        toast.error('Failed to add supplier.')
      }
    })
  }

  const inputClass = "flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"

  return (
    <Dialog open={open} onOpenChange={(val: boolean) => { setOpen(val); if (!val) reset() }}>
      <DialogTrigger asChild>
        <button className="btn-secondary gap-2">
          <Truck className="w-5 h-5" />
          <span>Add Supplier</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] glassmorphism border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <DialogTitle className="text-2xl font-bold">Add Supplier</DialogTitle>
          </div>
          <DialogDescription>Register a new supplier in the procurement module.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Supplier Name</label>
            <input {...register('name')} className={inputClass} placeholder="Kenya Office Supplies Ltd" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email (optional)</label>
              <input {...register('email')} type="email" className={inputClass} placeholder="info@supplier.co.ke" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Phone (optional)</label>
              <input {...register('phone')} className={inputClass} placeholder="+254..." />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Address (optional)</label>
            <input {...register('address')} className={inputClass} placeholder="Nairobi, Kenya" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? 'Saving...' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

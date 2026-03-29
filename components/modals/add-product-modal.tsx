'use client'

import React, { useState, useTransition } from 'react'
import { PlusCircle, Package } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createProduct } from '@/app/actions'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  priceKES: z.coerce.number().min(0, 'Price must be a positive number'),
  stockLevel: z.coerce.number().min(0, 'Stock cannot be negative'),
})

type ProductFormValues = z.infer<typeof productSchema>

export function AddProductModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
    },
  })

  const onSubmit = (data: ProductFormValues) => {
    startTransition(async () => {
      try {
        await createProduct(data)
        toast.success('Product added successfully!')
        setOpen(false)
        reset()
      } catch (error) {
        toast.error('Failed to add product. Please check your inputs or ensure SKU is unique.')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-primary gap-2">
          <PlusCircle className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphism border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
               <Package className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">Add New Product</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground pt-1">
            Enter the details for the new product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-foreground">Product Name</label>
            <input
              id="name"
              {...register('name')}
              className="flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
              placeholder="e.g. Dell XPS 15"
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="sku" className="text-sm font-semibold text-foreground">SKU (Stock Keeping Unit)</label>
            <input
              id="sku"
              {...register('sku')}
              className="flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring uppercase transition-all"
              placeholder="DEL-XPS-15"
            />
            {errors.sku && <p className="text-xs text-destructive mt-1">{errors.sku.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="priceKES" className="text-sm font-semibold text-foreground">Price (KES)</label>
              <input
                id="priceKES"
                type="number"
                step="0.01"
                {...register('priceKES')}
                className="flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                placeholder="0.00"
              />
              {errors.priceKES && <p className="text-xs text-destructive mt-1">{errors.priceKES.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="stockLevel" className="text-sm font-semibold text-foreground">Initial Stock</label>
              <input
                id="stockLevel"
                type="number"
                {...register('stockLevel')}
                className="flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                placeholder="0"
              />
              {errors.stockLevel && <p className="text-xs text-destructive mt-1">{errors.stockLevel.message}</p>}
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary"
            >
              {isPending ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import React, { useState, useTransition } from 'react'
import { PlusCircle, TrendingDown, DollarSign } from 'lucide-react'
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
import { createFinancialRecord } from '@/app/actions'

const financeSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
})

type FinanceFormValues = z.infer<typeof financeSchema>

export function RecordFinancialModal({ defaultType = 'INCOME' }: { defaultType?: 'INCOME' | 'EXPENSE' }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FinanceFormValues>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      type: defaultType,
      amount: 0,
      description: '',
    },
  })

  const onSubmit = (data: FinanceFormValues) => {
    startTransition(async () => {
      try {
        await createFinancialRecord(data)
        toast.success(`${data.type.toLowerCase()} recorded successfully!`)
        setOpen(false)
        reset()
      } catch (error) {
        toast.error('Failed to record transaction.')
      }
    })
  }

  const isIncome = defaultType === 'INCOME'

  return (
    <Dialog open={open} onOpenChange={(val: boolean) => {
      setOpen(val)
      if (val) reset({ type: defaultType, amount: 0, description: '' })
    }}>
      <DialogTrigger asChild>
        <button className={isIncome ? 'btn-primary gap-2' : 'btn-secondary gap-2'}>
          {isIncome ? <PlusCircle className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span>Record {isIncome ? 'Income' : 'Expense'}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphism border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
               <DollarSign className="w-5 h-5" />
            </div>
            <DialogTitle className="text-2xl font-bold">Record {isIncome ? 'Income' : 'Expense'}</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground pt-1">
            Log a new financial record to the general ledger.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <input type="hidden" {...register('type')} />
          
           <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-foreground">Description</label>
            <input
              id="description"
              {...register('description')}
              className="flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
              placeholder={isIncome ? "e.g. Consulting Services" : "e.g. Office Supplies"}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-semibold text-foreground">Amount (KES)</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount')}
              className="flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
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
              className={isIncome ? 'btn-primary' : 'btn-destructive bg-destructive text-destructive-foreground px-4 py-2.5 rounded-lg hover:brightness-110 font-medium'}
            >
              {isPending ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

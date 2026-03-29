'use client'

import React, { useState, useTransition } from 'react'
import { Users, PlusCircle, Wallet, BadgeCheck, XCircle } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createEmployee } from '@/app/actions'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  department: z.string().min(1, 'Department is required'),
  salary: z.coerce.number().min(1, 'Salary must be greater than 0'),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']),
})
type FormValues = z.infer<typeof schema>

export function AddEmployeeModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STAFF' },
  })

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      try {
        await createEmployee(data)
        toast.success('Employee added successfully!')
        setOpen(false)
        reset()
      } catch {
        toast.error('Failed to add employee.')
      }
    })
  }

  const inputClass = "flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"

  return (
    <Dialog open={open} onOpenChange={(val: boolean) => { setOpen(val); if (!val) reset() }}>
      <DialogTrigger asChild>
        <button className="btn-primary gap-2">
          <PlusCircle className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] glassmorphism border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <DialogTitle className="text-2xl font-bold">Add Employee</DialogTitle>
          </div>
          <DialogDescription>Register a new employee to HR and payroll.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-semibold">Full Name</label>
              <input {...register('name')} className={inputClass} placeholder="Jane Njeri" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-semibold">Email</label>
              <input {...register('email')} type="email" className={inputClass} placeholder="jane@company.co.ke" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Department</label>
              <input {...register('department')} className={inputClass} placeholder="e.g. Finance" />
              {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Role</label>
              <select {...register('role')} className={inputClass}>
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-semibold">Monthly Salary (KES)</label>
              <input {...register('salary')} type="number" step="100" className={inputClass} placeholder="0.00" />
              {errors.salary && <p className="text-xs text-destructive">{errors.salary.message}</p>}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? 'Saving...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

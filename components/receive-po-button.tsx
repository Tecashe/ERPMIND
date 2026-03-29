'use client'

import { useTransition } from 'react'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { receivePurchaseOrder } from '@/app/actions'

export function ReceivePOButton({ poId }: { poId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleReceive = () => {
    startTransition(async () => {
      try {
        await receivePurchaseOrder(poId)
        toast.success('PO received! Inventory and Finance updated.')
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to receive PO.')
      }
    })
  }

  return (
    <button
      onClick={handleReceive}
      disabled={isPending}
      className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
    >
      <CheckCircle className="w-3.5 h-3.5" />
      {isPending ? 'Receiving...' : 'Receive'}
    </button>
  )
}

'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { markInvoicePaid } from '@/app/actions/accounting';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function MarkPaidButton({ invoiceId, balance }: { invoiceId: string; balance: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState(balance.toString());
  const [method, setMethod] = useState('BANK');
  const [ref, setRef] = useState('');
  const router = useRouter();

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await markInvoicePaid(invoiceId, {
        amount: parseFloat(amount),
        paymentMethod: method,
        reference: ref || undefined,
      });
      toast.success('Payment recorded');
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1 text-xs h-7 border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10">
          <CheckCircle2 className="w-3 h-3" /> Pay
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
        <form onSubmit={handlePay} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Amount (KES)</Label>
            <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Payment Method</Label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
              {['CASH', 'BANK', 'MPESA', 'CHEQUE', 'CREDIT'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Reference / Transaction Code</Label>
            <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="M-Pesa ref, bank ref..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Record Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

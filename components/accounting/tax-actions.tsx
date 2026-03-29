'use client'

import { useState, useTransition } from 'react';
import { markTaxFiled } from '@/app/actions/accounting';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function TaxActions({ month, vatAmount, grossAmount }: {
  month: string;
  vatAmount: number;
  grossAmount: number;
}) {
  const [open, setOpen] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleFile(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 20);

      await markTaxFiled({
        taxType: 'VAT',
        period: month,
        periodStart,
        periodEnd,
        dueDate,
        taxableAmount: grossAmount,
        taxAmount: vatAmount,
        paymentRef,
      });
      toast.success(`VAT for ${month} marked as filed`);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1 text-xs h-7">
          <FileCheck className="w-3 h-3" /> Mark Filed
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Mark VAT as Filed — {month}</DialogTitle></DialogHeader>
        <form onSubmit={handleFile} className="space-y-4 pt-2">
          <div className="bg-muted/40 rounded-lg p-3 border border-border space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">VAT Amount</span><span className="font-bold text-primary">KES {vatAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Period</span><span className="font-medium">{month}</span></div>
          </div>
          <div className="space-y-1.5">
            <Label>KRA Payment Reference (optional)</Label>
            <Input value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="e.g. KRA ref number" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Filed'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

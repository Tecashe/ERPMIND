'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createBankAccount } from '@/app/actions/accounting';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export function CreateBankAccountModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [accountType, setAccountType] = useState('CURRENT');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createBankAccount({
        name, bankName, accountNumber,
        openingBalance: parseFloat(openingBalance) || 0,
        accountType,
      });
      toast.success('Bank account added');
      setOpen(false);
      setName(''); setBankName(''); setAccountNumber(''); setOpeningBalance('0');
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add Bank Account</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Wallet className="w-5 h-5 text-primary" /> Add Bank Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Account Name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. KCB Business Current" />
          </div>
          <div className="space-y-1.5">
            <Label>Bank Name</Label>
            <select value={bankName} onChange={(e) => setBankName(e.target.value)}
              required className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option value="">Select bank...</option>
              {['KCB','Equity','M-Pesa','NCBA','Absa','Co-op','Stanbic','Standard Chartered','DTB','Family Bank','Other'].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Account Number</Label>
            <Input required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="1234567890" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Account Type</Label>
              <select value={accountType} onChange={(e) => setAccountType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                {['CURRENT','SAVINGS','MPESA','LOAN'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Opening Balance (KES)</Label>
              <Input type="number" min="0" step="0.01" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

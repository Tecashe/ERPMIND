'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createInvoice } from '@/app/actions/accounting';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Receipt } from 'lucide-react';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxAmount: number;
  lineTotal: number;
}

const VAT_RATE = 0.16;

export function CreateInvoiceModal({ customerList }: {
  customerList: { id: string; name: string; kraPin?: string | null; email?: string | null }[]
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPin, setCustomerPin] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [applyVAT, setApplyVAT] = useState(true);

  const [lines, setLines] = useState<LineItem[]>([
    { description: '', quantity: 1, unitPrice: 0, discount: 0, taxAmount: 0, lineTotal: 0 },
  ]);

  function recompute(ls: LineItem[]): LineItem[] {
    return ls.map((l) => {
      const net = (l.quantity * l.unitPrice) * (1 - l.discount / 100);
      const vat = applyVAT ? net * VAT_RATE : 0;
      return { ...l, taxAmount: Math.round(vat * 100) / 100, lineTotal: Math.round((net + vat) * 100) / 100 };
    });
  }

  function updateLine(idx: number, field: keyof LineItem, value: string | number) {
    const updated = lines.map((l, i) => i === idx ? { ...l, [field]: value } : l);
    setLines(recompute(updated));
  }

  function addLine() { setLines([...recompute(lines), { description: '', quantity: 1, unitPrice: 0, discount: 0, taxAmount: 0, lineTotal: 0 }]); }
  function removeLine(idx: number) { setLines(lines.filter((_, i) => i !== idx)); }

  const subtotal = lines.reduce((s, l) => s + (l.lineTotal - l.taxAmount), 0);
  const totalVat = lines.reduce((s, l) => s + l.taxAmount, 0);
  const totalAmount = subtotal + totalVat;

  function onCustomerSelect(id: string) {
    setCustomerId(id);
    const c = customerList.find((c) => c.id === id);
    if (c) {
      setCustomerName(c.name);
      setCustomerPin(c.kraPin ?? '');
      setCustomerEmail(c.email ?? '');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createInvoice({
        customerId: customerId || undefined,
        customerName: customerName || undefined,
        customerPin: customerPin || undefined,
        customerEmail: customerEmail || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes: notes || undefined,
        lineItems: lines,
      });
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> New Invoice</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" /> Create Invoice
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">

          {/* Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Customer (select or type below)</Label>
              <select
                value={customerId}
                onChange={(e) => onCustomerSelect(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">-- Walk-in / Manual --</option>
                {customerList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Customer Name</Label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full name or company" />
            </div>
            <div className="space-y-1.5">
              <Label>KRA PIN (for eTIMS B2B)</Label>
              <Input value={customerPin} onChange={(e) => setCustomerPin(e.target.value)} placeholder="P000000000X" />
            </div>
            <div className="space-y-1.5">
              <Label>Customer Email</Label>
              <Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="customer@email.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="applyVAT" checked={applyVAT} onChange={(e) => { setApplyVAT(e.target.checked); setLines(recompute([...lines])); }} className="rounded" />
              <Label htmlFor="applyVAT" className="cursor-pointer">Apply VAT 16%</Label>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-semibold">Line Items</Label>
              <Button type="button" size="sm" variant="outline" onClick={addLine} className="gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Line
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">Description</th>
                    <th className="text-right px-3 py-2 font-medium w-20">Qty</th>
                    <th className="text-right px-3 py-2 font-medium w-24">Unit Price</th>
                    <th className="text-right px-3 py-2 font-medium w-20">Disc %</th>
                    <th className="text-right px-3 py-2 font-medium w-24">VAT</th>
                    <th className="text-right px-3 py-2 font-medium w-28">Total</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="px-2 py-1.5">
                        <Input
                          value={line.description}
                          onChange={(e) => updateLine(idx, 'description', e.target.value)}
                          placeholder="Item description"
                          className="border-0 shadow-none h-8"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input
                          type="number" min="0" step="0.01"
                          value={line.quantity}
                          onChange={(e) => updateLine(idx, 'quantity', parseFloat(e.target.value) || 0)}
                          className="border-0 shadow-none h-8 text-right"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input
                          type="number" min="0" step="0.01"
                          value={line.unitPrice}
                          onChange={(e) => updateLine(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="border-0 shadow-none h-8 text-right"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input
                          type="number" min="0" max="100" step="0.1"
                          value={line.discount}
                          onChange={(e) => updateLine(idx, 'discount', parseFloat(e.target.value) || 0)}
                          className="border-0 shadow-none h-8 text-right"
                        />
                      </td>
                      <td className="px-3 py-1.5 text-right text-muted-foreground tabular-nums">
                        {line.taxAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-1.5 text-right font-semibold tabular-nums">
                        {line.lineTotal.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5">
                        {lines.length > 1 && (
                          <button type="button" onClick={() => removeLine(idx)} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-3 space-y-1 text-sm text-right pr-20">
              <div className="flex justify-end gap-6">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono w-24">KES {subtotal.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-end gap-6">
                <span className="text-muted-foreground">VAT (16%)</span>
                <span className="font-mono w-24">KES {totalVat.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-end gap-6 font-bold text-base border-t border-border pt-2 mt-1">
                <span>Total</span>
                <span className="font-mono w-24 text-primary">KES {totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes / Payment Terms</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Payment due within 30 days..."
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || lines.every((l) => !l.description)}>
              {isPending ? 'Creating…' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

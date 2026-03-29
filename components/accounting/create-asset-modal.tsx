'use client'

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createAsset } from '@/app/actions/accounting';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

export function CreateAssetModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('EQUIPMENT');
  const [description, setDescription] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().slice(0, 10));
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [usefulLifeYears, setUsefulLifeYears] = useState('5');
  const [residualValue, setResidualValue] = useState('0');
  const [location, setLocation] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createAsset({
        name, category, description: description || undefined,
        acquisitionDate: new Date(acquisitionDate),
        acquisitionCost: parseFloat(acquisitionCost),
        usefulLifeYears: parseFloat(usefulLifeYears),
        residualValue: parseFloat(residualValue) || 0,
        location: location || undefined,
      });
      toast.success(`Asset "${name}" added to register`);
      setOpen(false);
      setName(''); setAcquisitionCost(''); setDescription(''); setLocation('');
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add Asset</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Register Fixed Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label>Asset Name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HP Laptop Pro" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                {['EQUIPMENT','VEHICLE','FURNITURE','BUILDING','INTANGIBLE'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Office, Warehouse..." />
            </div>
            <div className="space-y-1.5">
              <Label>Acquisition Date</Label>
              <Input type="date" required value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Cost (KES)</Label>
              <Input type="number" min="0" step="0.01" required value={acquisitionCost} onChange={(e) => setAcquisitionCost(e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label>Useful Life (years)</Label>
              <Input type="number" min="1" step="0.5" required value={usefulLifeYears} onChange={(e) => setUsefulLifeYears(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Residual Value (KES)</Label>
              <Input type="number" min="0" step="0.01" value={residualValue} onChange={(e) => setResidualValue(e.target.value)} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Description (optional)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Serial number, details..." />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isPending || !name || !acquisitionCost}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Asset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

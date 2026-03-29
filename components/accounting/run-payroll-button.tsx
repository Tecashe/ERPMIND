'use client'

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { processPayrollWithDeductions } from '@/app/actions/accounting';
import { Button } from '@/components/ui/button';
import { DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function RunPayrollButton({ employeeId, period, employeeName }: {
  employeeId: string;
  period: string;
  employeeName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleRun() {
    startTransition(async () => {
      try {
        const result = await processPayrollWithDeductions(employeeId, period);
        toast.success(`Payroll processed — ${employeeName}`, {
          description: `Net Pay: KES ${result.netPay.toLocaleString('en-KE', { minimumFractionDigits: 2 })} | PAYE: KES ${result.netPaye.toFixed(2)}`,
        });
        router.refresh();
      } catch (err) {
        toast.error('Payroll failed', {
          description: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    });
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleRun}
      disabled={isPending}
      className="gap-1 text-xs h-7 border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10"
    >
      {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <DollarSign className="w-3 h-3" />}
      Pay
    </Button>
  );
}

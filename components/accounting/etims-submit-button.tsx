'use client'

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitInvoiceToETIMS } from '@/app/actions/accounting';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ETIMSSubmitButton({ invoiceId }: { invoiceId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    startTransition(async () => {
      try {
        const result = await submitInvoiceToETIMS(invoiceId);
        if (result.success) {
          toast.success('Invoice submitted to KRA eTIMS', {
            description: `CU Invoice No: ${result.cuInvoiceNo}`,
          });
        } else {
          toast.error('eTIMS submission failed', { description: result.errorMessage });
        }
        router.refresh();
      } catch {
        toast.error('Failed to submit to eTIMS');
      }
    });
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleSubmit}
      disabled={isPending}
      className="gap-1 text-xs h-7 border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
    >
      {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
      eTIMS
    </Button>
  );
}

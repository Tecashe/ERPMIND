import React from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { KeyRound, Copy, Trash2, Code2, CheckCircle2, FileJson, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getApiKeys } from '@/app/actions/accounting'
import { ApiKeyManager } from './_api-key-manager'

export const dynamic = 'force-dynamic'

export default async function ApiKeysPage() {
  const keys = await getApiKeys()

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <Link href="/settings/integrations" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Integrations
        </Link>
        
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <KeyRound className="w-8 h-8 text-primary" /> API Keys
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate secure Bearer tokens to push external sales (e.g. Shopify, Custom POS) directly into your ERP.
            </p>
          </div>
        </div>

        {/* API Key Manager (Client Component for Add/Revoke/Copy interaction) */}
        <ApiKeyManager initialKeys={keys} />

        {/* Developer Documentation Reference */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-foreground/50" /> Developer Quickstart
          </h2>
          <div className="card-premium overflow-hidden border border-border">
            <div className="p-6 bg-muted/10 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono bg-foreground text-background px-3 py-1 rounded font-bold text-sm select-all">POST /api/v1/sales/checkout</span>
              </div>
              <p className="text-sm text-foreground my-3">
                Send a <code className="bg-muted px-1 py-0.5 rounded font-mono text-primary">POST</code> request with your JSON payload. Set the headers to include your secure Bearer token.
              </p>
              
              <div className="space-y-4 text-sm font-mono mt-6">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-muted-foreground mb-2"># Headers</p>
                  <p><span className="text-blue-500">Authorization:</span> Bearer nx_live_xxxxxxxxxxxxxxxxxxxxxxxx</p>
                  <p><span className="text-blue-500">Content-Type:</span> application/json</p>
                </div>
                
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-muted-foreground mb-2"># Request Body (JSON)</p>
                  <pre className="text-emerald-600">
{`{
  "paymentMethod": "MPESA",
  "items": [
    {
      "sku": "TSHIRT-01",
      "quantity": 2,
      "overridePrice": 850
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
            <div className="p-6 bg-background">
              <h3 className="font-bold text-foreground mb-2">How it works atomically:</h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                <li>Looks up the <strong>SKU</strong> in your ERP Database. If it exists, logic proceeds.</li>
                <li>Deducts the <strong>quantity</strong> from local Stock Levels instantly.</li>
                <li>Funnels the sale into a Master KRA Invoice and dispatches to eTIMS precisely mimicking the Web POS.</li>
                <li>Injects standard legacy metrics so Dashboard charts reflect external sales.</li>
                <li>Returns a <code className="font-mono text-emerald-500">200 OK</code> with <code className="font-mono">invoiceId</code> so your developers can print receipts externally.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Trash2, Copy, CheckCircle2, ShieldAlert, Loader2, KeyRound } from 'lucide-react'
import { createApiKey, revokeApiKey } from '@/app/actions/accounting'
import { useRouter } from 'next/navigation'

export function ApiKeyManager({ initialKeys }: { initialKeys: any[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [newKeyLabel, setNewKeyLabel] = useState('')
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    if (!newKeyLabel.trim()) return

    startTransition(async () => {
      try {
        const secret = await createApiKey({ name: newKeyLabel, permission: 'WRITE_ONLY' })
        setRevealedKey(secret)
        setNewKeyLabel('')
      } catch (err: any) {
        console.error('Failed to generate key', err)
      }
    })
  }

  const handleRevoke = (id: string) => {
    if (!confirm('Are you sure you want to revoke this API Key? External systems will lose access immediately.')) return
    startTransition(async () => {
      try {
        await revokeApiKey(id)
      } catch (err) {
        console.error(err)
      }
    })
  }

  const copyToClipboard = () => {
    if (revealedKey) {
      navigator.clipboard.writeText(revealedKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Generate New Key Widget */}
      <div className="card-premium p-6 border border-border bg-background">
        <h2 className="text-xl font-bold text-foreground mb-4">Create New API Token</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newKeyLabel}
            onChange={(e) => setNewKeyLabel(e.target.value)}
            placeholder="e.g. Shopify Main Store"
            className="flex-1 px-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={!newKeyLabel.trim() || isPending}
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate Token
          </button>
        </div>

        {/* Revealed Secret Toast (Once Only) */}
        {revealedKey && (
          <div className="mt-6 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl relative animate-in fade-in slide-in-from-top-4">
            <h3 className="text-emerald-600 font-bold mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Save this token now!
            </h3>
            <p className="text-sm text-emerald-600/80 mb-4">
              For security reasons, this Bearer Token will <strong>never be shown again</strong>. If you lose it, you must revoke it and generate a new one.
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 p-3 bg-background border border-border rounded-lg text-emerald-600 font-mono text-lg select-all text-center tracking-wider font-bold shadow-inner">
                {revealedKey}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold flex items-center justify-center gap-2 w-28 shrink-0"
              >
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <button
               onClick={() => setRevealedKey(null)}
               className="mt-4 text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
            >
               I have saved my token securely 
            </button>
          </div>
        )}
      </div>

      {/* Existing Keys Table */}
      <div className="card-premium overflow-hidden border border-border">
        <div className="p-6 border-b border-border bg-muted/10">
          <h2 className="text-xl font-bold text-foreground">Active Tokens</h2>
        </div>
        
        {initialKeys.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-muted-foreground/50">
            <KeyRound className="w-12 h-12 mb-4 opacity-50" />
            <p>No external integrations active.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">Integration Name</th>
                <th className="px-6 py-4">Token Prefix</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {initialKeys.map((k) => (
                <tr key={k.id} className="border-t border-border hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground">{k.name}</td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">
                    {k.keyString.substring(0, 12)}••••••••••••
                  </td>
                  <td className="px-6 py-4">
                    {k.isActive ? (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-500 rounded-full">Active</span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-destructive/10 text-destructive rounded-full">Revoked</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {k.isActive && (
                      <button
                        onClick={() => handleRevoke(k.id)}
                        disabled={isPending}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors inline-flex"
                        title="Revoke Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

'use client'

import React, { useState, useTransition } from 'react'
import {
  FileCheck, Zap, CheckCircle2, XCircle, Loader2, Save,
  AlertCircle, ExternalLink, Shield, Smartphone
} from 'lucide-react'
import { saveETIMSSettings, testETIMSConnectionFromSettings } from '@/app/actions/accounting'

type Settings = {
  kraPin: string | null
  etimsEnabled: boolean
  etimsUrl: string | null
  etimsDeviceSerial: string | null
  etimsSandbox: boolean
  etimsLastTestedAt: Date | null
  etimsTestSuccess: boolean | null
  etimsTestMessage: string | null
  mpesaEnabled: boolean
}

export function IntegrationsForm({ initial }: { initial: Settings }) {
  const [isPending, startTransition] = useTransition()
  const [isTesting, startTest] = useTransition()
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const [form, setForm] = useState({
    etimsEnabled: initial.etimsEnabled,
    etimsUrl: initial.etimsUrl ?? 'https://etims-sbx.kra.go.ke/etims-api',
    etimsDeviceSerial: initial.etimsDeviceSerial ?? '',
    etimsSandbox: initial.etimsSandbox,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(false)
    startTransition(async () => {
      await saveETIMSSettings({
        etimsEnabled: form.etimsEnabled,
        etimsUrl: form.etimsUrl || undefined,
        etimsDeviceSerial: form.etimsDeviceSerial || undefined,
        etimsSandbox: form.etimsSandbox,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    })
  }

  const handleTest = () => {
    setTestResult(null)
    startTest(async () => {
      const result = await testETIMSConnectionFromSettings()
      setTestResult(result)
    })
  }

  const lastTested = initial.etimsLastTestedAt
    ? new Date(initial.etimsLastTestedAt).toLocaleString('en-KE')
    : null

  return (
    <div className="space-y-6">
      {/* KRA eTIMS Section */}
      <div className="card-premium overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">KRA eTIMS Integration</h2>
              <p className="text-xs text-muted-foreground">Connect to Kenya Revenue Authority's Electronic Tax Invoicing System</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            form.etimsEnabled
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              : 'bg-muted text-muted-foreground border border-border'
          }`}>
            {form.etimsEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        <div className="p-5">
          {/* No KRA PIN warning */}
          {!initial.kraPin && (
            <div className="mb-5 p-3 rounded-lg border border-red-500/30 bg-red-500/5 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">
                KRA PIN not configured.{' '}
                <a href="/settings/organization" className="underline font-semibold">
                  Go to Organization Settings
                </a>{' '}
                to set your KRA PIN first — it is required for eTIMS submissions.
              </p>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Enable toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
              <div>
                <p className="font-semibold text-foreground text-sm">Enable eTIMS Submission</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  When enabled, all issued invoices will be submitted to KRA for compliance
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, etimsEnabled: !f.etimsEnabled }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  form.etimsEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    form.etimsEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {form.etimsEnabled && (
              <>
                {/* Sandbox / Production toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Mode:{' '}
                      <span className={form.etimsSandbox ? 'text-amber-500' : 'text-emerald-600'}>
                        {form.etimsSandbox ? 'Sandbox (Testing)' : 'Production (Live KRA)'}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {form.etimsSandbox
                        ? 'Submissions are simulated — no real KRA data sent'
                        : 'Live mode — all invoices reported to KRA in real-time'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, etimsSandbox: !f.etimsSandbox }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      !form.etimsSandbox ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        !form.etimsSandbox ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* eTIMS API URL */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    eTIMS API URL
                  </label>
                  <input
                    type="url"
                    value={form.etimsUrl}
                    onChange={(e) => setForm((f) => ({ ...f, etimsUrl: e.target.value }))}
                    placeholder="https://etims-sbx.kra.go.ke/etims-api"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm font-mono"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Sandbox: <code className="bg-muted px-1 rounded">https://etims-sbx.kra.go.ke/etims-api</code>
                    {' · '}
                    Production: <code className="bg-muted px-1 rounded">https://etims-api.kra.go.ke/etims-api</code>
                  </p>
                </div>

                {/* Device Serial */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Device Serial Number (VSCU/OSCU)
                  </label>
                  <input
                    type="text"
                    value={form.etimsDeviceSerial}
                    onChange={(e) => setForm((f) => ({ ...f, etimsDeviceSerial: e.target.value }))}
                    placeholder="e.g. KRA00012345678"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm font-mono"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Assigned by KRA when you register your VSCU/OSCU device.{' '}
                    <a
                      href="https://etims.kra.go.ke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      Register at etims.kra.go.ke <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </>
            )}

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all shadow-sm"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isPending ? 'Saving…' : 'Save Settings'}
              </button>

              {form.etimsEnabled && (
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={isTesting || isPending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background text-foreground font-semibold text-sm hover:bg-muted disabled:opacity-60 transition-all"
                >
                  {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-500" />}
                  {isTesting ? 'Testing…' : 'Test Connection'}
                </button>
              )}

              {saved && (
                <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Settings saved
                </span>
              )}
            </div>
          </form>

          {/* Test result */}
          {testResult && (
            <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
              testResult.success
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-red-500/30 bg-red-500/5'
            }`}>
              {testResult.success
                ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              }
              <div>
                <p className={`text-sm font-semibold ${testResult.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                </p>
                <p className={`text-xs mt-0.5 ${testResult.success ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-red-600/80 dark:text-red-400/80'}`}>
                  {testResult.message}
                </p>
              </div>
            </div>
          )}

          {/* Last tested status */}
          {lastTested && !testResult && (
            <div className={`mt-4 p-3 rounded-lg border text-xs flex items-center gap-2 ${
              initial.etimsTestSuccess
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                : 'border-red-500/20 bg-red-500/5 text-red-600'
            }`}>
              {initial.etimsTestSuccess
                ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                : <XCircle className="w-3.5 h-3.5 shrink-0" />
              }
              Last tested {lastTested} — {initial.etimsTestMessage}
            </div>
          )}

          {/* How to get device serial */}
          <div className="mt-5 p-4 rounded-xl bg-muted/30 border border-border">
            <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-primary" /> How to get your eTIMS credentials
            </p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://etims.kra.go.ke" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">etims.kra.go.ke</a> and log in with your KRA credentials</li>
              <li>Go to <strong>Device Management → Register VSCU</strong></li>
              <li>Download the VSCU software and complete the registration wizard</li>
              <li>Your Device Serial Number will be displayed in the portal</li>
              <li>Enter it above and click <strong>Test Connection</strong> to verify</li>
            </ol>
          </div>
        </div>
      </div>

      {/* M-Pesa Section — Coming Soon */}
      <div className="card-premium p-6 opacity-80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">M-Pesa STK Push</h2>
              <p className="text-xs text-muted-foreground">Collect invoice payments via M-Pesa directly from customers</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
            Coming Soon
          </span>
        </div>
        <div className="p-4 rounded-xl border border-dashed border-border text-center">
          <p className="text-sm text-muted-foreground">
            M-Pesa STK Push integration will allow customers to pay invoices directly from their phones.
            Enable it here once your Safaricom Daraja API credentials are ready.
          </p>
        </div>
      </div>
    </div>
  )
}

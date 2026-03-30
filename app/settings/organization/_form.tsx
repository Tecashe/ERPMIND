'use client'

import React, { useState, useTransition } from 'react'
import {
  Building2, MapPin, Globe, CreditCard,
  Save, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react'
import { saveOrganizationSettings } from '@/app/actions/accounting'

type OrgSettings = {
  companyName: string
  kraPin: string | null
  vatNumber: string | null
  address: string | null
  city: string
  country: string
  phone: string | null
  email: string | null
  website: string | null
  logoUrl: string | null
}

export function OrgSettingsForm({ initial }: { initial: OrgSettings }) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    companyName: initial.companyName ?? '',
    kraPin: initial.kraPin ?? '',
    vatNumber: initial.vatNumber ?? '',
    address: initial.address ?? '',
    city: initial.city ?? 'Nairobi',
    country: initial.country ?? 'Kenya',
    phone: initial.phone ?? '',
    email: initial.email ?? '',
    website: initial.website ?? '',
    logoUrl: initial.logoUrl ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await saveOrganizationSettings({
          companyName: form.companyName || undefined,
          kraPin: form.kraPin || undefined,
          vatNumber: form.vatNumber || undefined,
          address: form.address || undefined,
          city: form.city || undefined,
          country: form.country || undefined,
          phone: form.phone || undefined,
          email: form.email || undefined,
          website: form.website || undefined,
          logoUrl: form.logoUrl || undefined,
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 4000)
      } catch {
        setError('Failed to save settings. Please try again.')
      }
    })
  }

  const Field = ({
    label, name, placeholder, hint, type = 'text',
  }: { label: string; name: keyof typeof form; placeholder: string; hint?: string; type?: string }) => (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
      />
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Identity */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Company Identity</h2>
            <p className="text-xs text-muted-foreground">Registered business details used on invoices and tax filings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Company Name *" name="companyName" placeholder="e.g. Acme Trading Limited" />
          <Field
            label="KRA PIN"
            name="kraPin"
            placeholder="e.g. P051234567M"
            hint="Your KRA tax PIN — used on all invoices and eTIMS submissions"
          />
          <Field
            label="VAT Registration Number"
            name="vatNumber"
            placeholder="e.g. 00123456X"
            hint="Required if VAT-registered (turnover > KES 5M/year)"
          />
          <Field label="Business Email" name="email" placeholder="accounts@company.co.ke" type="email" />
          <Field label="Phone Number" name="phone" placeholder="+254 700 000 000" type="tel" />
          <Field label="Website" name="website" placeholder="https://yourcompany.co.ke" />
        </div>
      </div>

      {/* Address */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Registered Address</h2>
            <p className="text-xs text-muted-foreground">Appears on invoices, payslips, and tax documents</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Field label="Street / Building" name="address" placeholder="e.g. Upperhill Road, ABC Towers, 3rd Floor" />
          </div>
          <Field label="City" name="city" placeholder="Nairobi" />
          <Field label="Country" name="country" placeholder="Kenya" />
        </div>
      </div>

      {/* Branding */}
      <div className="card-premium p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Globe className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Branding</h2>
            <p className="text-xs text-muted-foreground">Logo displayed on invoices and printed documents</p>
          </div>
        </div>
        <Field
          label="Logo URL"
          name="logoUrl"
          placeholder="https://yourcompany.co.ke/logo.png"
          hint="Direct link to your logo image (PNG/SVG recommended, transparent background)"
        />
      </div>

      {/* Save */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all shadow-sm"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? 'Saving…' : 'Save Organization Settings'}
        </button>
        {saved && (
          <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Settings saved successfully
          </span>
        )}
        {error && (
          <span className="flex items-center gap-2 text-red-600 text-sm font-medium">
            <AlertCircle className="w-4 h-4" /> {error}
          </span>
        )}
      </div>
    </form>
  )
}

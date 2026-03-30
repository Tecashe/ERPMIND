import { DashboardLayout } from '@/components/dashboard-layout'
import { Building2, CreditCard } from 'lucide-react'
import { getOrganizationSettings } from '@/app/actions/accounting'
import { OrgSettingsForm } from './_form'

export default async function OrganizationSettingsPage() {
  const settings = await getOrganizationSettings()

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Organization Settings</h1>
              <p className="text-muted-foreground text-sm">Company profile, KRA PIN, and registered business details</p>
            </div>
          </div>
        </div>

        {/* KRA PIN Notice */}
        {!settings.kraPin && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-400 text-sm">KRA PIN not configured</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                  Your KRA PIN is required for eTIMS invoice submission. Set it below, then go to{' '}
                  <a href="/settings/integrations" className="underline font-semibold">
                    Settings → Integrations
                  </a>{' '}
                  to enable and test eTIMS connectivity.
                </p>
              </div>
            </div>
          </div>
        )}

        {settings.kraPin && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                KRA PIN configured: <span className="font-mono font-bold">{settings.kraPin}</span>
              </p>
            </div>
          </div>
        )}

        <OrgSettingsForm initial={settings} />
      </div>
    </DashboardLayout>
  )
}
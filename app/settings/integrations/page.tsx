import { DashboardLayout } from '@/components/dashboard-layout'
import { Zap, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { getOrganizationSettings } from '@/app/actions/accounting'
import { IntegrationsForm } from './_form'

export default async function IntegrationsSettingsPage() {
  const settings = await getOrganizationSettings()

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Integrations</h1>
              <p className="text-muted-foreground text-sm">Connect your ERP to KRA eTIMS, M-Pesa, and other services</p>
            </div>
          </div>
        </div>

        {/* API Keys Banner */}
        <div className="mb-6 card-premium p-6 border border-primary/20 bg-primary/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" /> Open API Integrations
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Manage API Keys to connect external software (Shopify, Custom POS) directly to your ERP sales engine.</p>
          </div>
          <Link href="/settings/integrations/api-keys" className="px-5 py-2.5 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-all shadow-sm text-sm shrink-0 whitespace-nowrap">
            Manage API Keys
          </Link>
        </div>

        <IntegrationsForm
          initial={{
            kraPin: settings.kraPin,
            etimsEnabled: settings.etimsEnabled,
            etimsUrl: settings.etimsUrl,
            etimsDeviceSerial: settings.etimsDeviceSerial,
            etimsSandbox: settings.etimsSandbox,
            etimsLastTestedAt: settings.etimsLastTestedAt,
            etimsTestSuccess: settings.etimsTestSuccess,
            etimsTestMessage: settings.etimsTestMessage,
            mpesaEnabled: settings.mpesaEnabled,
          }}
        />
      </div>
    </DashboardLayout>
  )
}
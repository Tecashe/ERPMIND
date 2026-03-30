import { DashboardLayout } from '@/components/dashboard-layout'
import { Zap } from 'lucide-react'
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
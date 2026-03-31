import { getPOSProducts } from '@/app/actions/pos'
import { getCustomers } from '@/app/actions'
import { POSClient } from './_pos-client'

export const dynamic = 'force-dynamic'

export default async function POSPage() {
  const [products, customers] = await Promise.all([
    getPOSProducts(),
    getCustomers(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <POSClient initialProducts={products} customers={customers} />
    </div>
  )
}

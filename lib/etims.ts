/**
 * KRA eTIMS OSCU Integration Service
 *
 * Credentials are injected per-call from OrganizationSettings (DB).
 * Falls back to env vars only as a last resort for backward compatibility.
 *
 * Required env vars (platform defaults / sandbox only):
 *   ETIMS_URL          — e.g. https://etims-sbx.kra.go.ke/etims-api
 *   ETIMS_DEVICE_SERIAL — sandbox/test device serial
 *   ETIMS_KRA_PIN       — sandbox/test KRA PIN
 *   ETIMS_SANDBOX       — "true" for sandbox mode
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ETIMSConfig {
  url: string
  deviceSerial: string
  kraPin: string
  sandbox: boolean
}

export interface ETIMSInvoicePayload {
  invoiceNumber: string
  invoiceDate: string         // YYYY-MM-DD HH:mm:ss
  supplierPin: string
  supplierName: string
  buyerPin?: string
  buyerName?: string
  currency: string
  lineItems: {
    itemCode: string
    itemName: string
    quantity: number
    unitPrice: number
    discount: number
    taxRate: number           // e.g. 0.16
    taxAmount: number
    lineTotal: number
  }[]
  totalAmount: number
  totalVat: number
  totalExcl: number
}

export interface ETIMSResponse {
  success: boolean
  cuInvoiceNo?: string        // KRA assigned CU invoice number
  cuSerialNo?: string         // Device serial
  qrCode?: string             // QR code string for printing
  timestamp?: string
  errorCode?: string
  errorMessage?: string
  rawResponse?: unknown
}

// ─── Default config (env-based, platform sandbox) ────────────────────────────

function getPlatformConfig(): ETIMSConfig {
  return {
    url: process.env.ETIMS_URL ?? 'https://etims-sbx.kra.go.ke/etims-api',
    deviceSerial: process.env.ETIMS_DEVICE_SERIAL ?? 'SANDBOX_DEVICE',
    kraPin: process.env.ETIMS_KRA_PIN ?? 'P000000000X',
    sandbox: process.env.ETIMS_SANDBOX !== 'false',
  }
}

// ─── Submit invoice to KRA eTIMS ─────────────────────────────────────────────

export async function submitToETIMS(
  payload: ETIMSInvoicePayload,
  config?: ETIMSConfig,
): Promise<ETIMSResponse> {
  const cfg = config ?? getPlatformConfig()

  if (cfg.sandbox) {
    // Sandbox: simulate a successful eTIMS response instantly
    await new Promise((r) => setTimeout(r, 400))
    return {
      success: true,
      cuInvoiceNo: `CU${Date.now()}`,
      cuSerialNo: cfg.deviceSerial,
      qrCode: `https://etims.kra.go.ke/verify?inv=${payload.invoiceNumber}&pin=${cfg.kraPin}`,
      timestamp: new Date().toISOString(),
    }
  }

  try {
    const body = {
      deviceSerial: cfg.deviceSerial,
      kraPin: cfg.kraPin,
      ...payload,
    }

    const res = await fetch(`${cfg.url}/saveItems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DeviceSerial': cfg.deviceSerial,
        'Pin': cfg.kraPin,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (res.ok && data.resultCd === '000') {
      return {
        success: true,
        cuInvoiceNo: data.data?.rcptNo,
        cuSerialNo: data.data?.cuSn,
        qrCode: data.data?.qrCode,
        timestamp: data.data?.rcptDt,
        rawResponse: data,
      }
    }

    return {
      success: false,
      errorCode: data.resultCd,
      errorMessage: data.resultMsg ?? 'eTIMS submission failed',
      rawResponse: data,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error'
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      errorMessage: message,
    }
  }
}

// ─── Query invoice status from eTIMS ─────────────────────────────────────────

export async function queryETIMSStatus(
  cuInvoiceNo: string,
  config?: ETIMSConfig,
): Promise<ETIMSResponse> {
  const cfg = config ?? getPlatformConfig()

  if (cfg.sandbox) {
    return { success: true, cuInvoiceNo, cuSerialNo: cfg.deviceSerial }
  }

  try {
    const res = await fetch(
      `${cfg.url}/selectTrnsSaleList?cuInvoiceNo=${cuInvoiceNo}`,
      { headers: { 'DeviceSerial': cfg.deviceSerial, 'Pin': cfg.kraPin } },
    )
    const data = await res.json()
    return { success: res.ok, rawResponse: data }
  } catch (err: unknown) {
    return { success: false, errorMessage: err instanceof Error ? err.message : 'Error' }
  }
}

// ─── Test eTIMS connection ────────────────────────────────────────────────────

export async function testETIMSConnection(config: ETIMSConfig): Promise<ETIMSResponse> {
  if (config.sandbox) {
    await new Promise((r) => setTimeout(r, 600))
    return {
      success: true,
      cuSerialNo: config.deviceSerial,
      errorMessage: 'Sandbox mode — connection simulated successfully',
    }
  }

  try {
    const res = await fetch(`${config.url}/selectInitOsdcInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DeviceSerial': config.deviceSerial,
        'Pin': config.kraPin,
      },
      body: JSON.stringify({ deviceSerial: config.deviceSerial, kraPin: config.kraPin }),
    })
    const data = await res.json()
    return {
      success: res.ok && data.resultCd === '000',
      cuSerialNo: data.data?.cuSn,
      errorCode: data.resultCd,
      errorMessage: data.resultMsg,
      rawResponse: data,
    }
  } catch (err: unknown) {
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      errorMessage: err instanceof Error ? err.message : 'Could not reach KRA eTIMS',
    }
  }
}

// ─── Build QR code URL ────────────────────────────────────────────────────────

export function buildQRCodeUrl(cuInvoiceNo: string, kraPin: string): string {
  return `https://etims.kra.go.ke/verify?inv=${cuInvoiceNo}&pin=${kraPin}`
}

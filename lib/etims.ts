/**
 * KRA eTIMS OSCU Integration Service
 * Supports sandbox and production modes via env vars.
 *
 * Required env vars:
 *   ETIMS_URL          — e.g. https://etims-api.kra.go.ke/etims-api (prod) or sandbox URL
 *   ETIMS_DEVICE_SERIAL — Your registered VSCU/OSCU device serial
 *   ETIMS_KRA_PIN       — Company KRA PIN
 *   ETIMS_SANDBOX       — "true" for sandbox mode
 */

const BASE_URL = process.env.ETIMS_URL ?? 'https://etims-sbx.kra.go.ke/etims-api'
const DEVICE_SERIAL = process.env.ETIMS_DEVICE_SERIAL ?? 'SANDBOX_DEVICE'
const KRA_PIN = process.env.ETIMS_KRA_PIN ?? 'P000000000X'
const IS_SANDBOX = process.env.ETIMS_SANDBOX !== 'false'

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

/**
 * Submit an invoice to KRA eTIMS OSCU API
 */
export async function submitToETIMS(payload: ETIMSInvoicePayload): Promise<ETIMSResponse> {
  if (IS_SANDBOX) {
    // Sandbox: simulate a successful eTIMS response
    await new Promise((r) => setTimeout(r, 500))
    return {
      success: true,
      cuInvoiceNo: `CU${Date.now()}`,
      cuSerialNo: DEVICE_SERIAL,
      qrCode: `https://etims.kra.go.ke/verify?inv=${payload.invoiceNumber}&pin=${KRA_PIN}`,
      timestamp: new Date().toISOString(),
    }
  }

  try {
    const body = {
      deviceSerial: DEVICE_SERIAL,
      kraPin: KRA_PIN,
      ...payload,
    }

    const res = await fetch(`${BASE_URL}/saveItems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DeviceSerial': DEVICE_SERIAL,
        'Pin': KRA_PIN,
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

/**
 * Query invoice status from eTIMS
 */
export async function queryETIMSStatus(cuInvoiceNo: string): Promise<ETIMSResponse> {
  if (IS_SANDBOX) {
    return { success: true, cuInvoiceNo, cuSerialNo: DEVICE_SERIAL }
  }

  try {
    const res = await fetch(`${BASE_URL}/selectTrnsSaleList?cuInvoiceNo=${cuInvoiceNo}`, {
      headers: { 'DeviceSerial': DEVICE_SERIAL, 'Pin': KRA_PIN },
    })
    const data = await res.json()
    return { success: res.ok, rawResponse: data }
  } catch (err: unknown) {
    return { success: false, errorMessage: err instanceof Error ? err.message : 'Error' }
  }
}

/**
 * Build QR code URL for an eTIMS-approved invoice
 */
export function buildQRCodeUrl(cuInvoiceNo: string, kraPin: string): string {
  return `https://etims.kra.go.ke/verify?inv=${cuInvoiceNo}&pin=${kraPin}`
}

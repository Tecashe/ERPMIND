'use client'

import React, { useState, useRef } from 'react'
import { UploadCloud, FileSpreadsheet, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { bulkImportProducts } from '@/app/actions'
import { useRouter } from 'next/navigation'

type ImportMode = 'skip' | 'overwrite'

export function BulkImportModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [strategy, setStrategy] = useState<ImportMode>('skip')
  
  const [isParsing, setIsParsing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successCount, setSuccessCount] = useState<number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.name.endsWith('.csv')) {
      setError('Please upload a valid .csv file')
      return
    }
    setError(null)
    setFile(selected)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
      if (!dropped.name.endsWith('.csv')) {
        setError('Only .csv files are supported')
        return
      }
      setError(null)
      setFile(dropped)
    }
  }

  const parseCSVLine = (text: string) => {
    const result = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result.map(s => s.replace(/^"|"$/g, '').trim());
  }

  const handleSubmit = async () => {
    if (!file) return
    setIsParsing(true)
    setError(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim() !== '')
      
      if (lines.length < 2) {
        throw new Error('File is empty or missing headers')
      }

      // Read Header mapping
      const headers = parseCSVLine(lines[0]!.toLowerCase())
      const nameIdx = headers.findIndex(h => h.includes('name'))
      const skuIdx = headers.findIndex(h => h.includes('sku') || h.includes('code'))
      const priceIdx = headers.findIndex(h => h.includes('price'))
      const stockIdx = headers.findIndex(h => h.includes('stock') || h.includes('quantity'))
      const alertIdx = headers.findIndex(h => h.includes('alert') || h.includes('low'))

      if (nameIdx === -1 || skuIdx === -1 || priceIdx === -1) {
        throw new Error('CSV must contain "Name", "SKU", and "Price" columns.')
      }

      // Parse Data
      const productsToImport = []
      
      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]!)
        if (row.length === 0 || !row[nameIdx]) continue

        const price = parseFloat(row[priceIdx] || '0')
        const stock = parseInt(row[stockIdx] || '0', 10)
        const alert = parseInt(row[alertIdx] || '5', 10)

        if (isNaN(price)) throw new Error(`Row ${i + 1}: Invalid price limit format.`)

        productsToImport.push({
          name: row[nameIdx],
          sku: row[skuIdx],
          priceKES: price,
          stockLevel: isNaN(stock) ? 0 : stock,
          lowStockAlert: isNaN(alert) ? 5 : alert,
        })
      }

      if (productsToImport.length === 0) {
        throw new Error('No valid products found to import.')
      }

      // Submit to Server Action
      setIsParsing(false)
      setIsUploading(true)
      
      await bulkImportProducts(productsToImport, strategy)
      
      setSuccessCount(productsToImport.length)
      router.refresh()
      
      setTimeout(() => {
        onClose()
      }, 3000)

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to process CSV file')
      setIsParsing(false)
      setIsUploading(false)
    }
  }

  const generateTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,SKU,Price,StockLevel,LowStockAlert\nSample Product,SKU-001,1500,50,5\n"
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "nexus_product_import_template.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Bulk Import Products</h2>
              <p className="text-xs text-muted-foreground">Upload a CSV to quickly populate inventory</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {successCount !== null ? (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Import Successful!</h3>
              <p className="text-muted-foreground mb-6">
                Successfully processed and imported <span className="font-bold text-foreground">{successCount}</span> products into your inventory.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Drag & Drop Zone */}
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {!file ? (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-sm font-semibold text-foreground mb-1">Drag and drop your CSV here</p>
                    <p className="text-xs text-muted-foreground mb-6">Only .csv files are supported. Maximum 500 rows recommended.</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors text-sm shadow-md"
                    >
                      Browse Files
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                      <FileSpreadsheet className="w-8 h-8" />
                    </div>
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-xs font-semibold text-red-500 hover:text-red-400"
                    >
                      Remove File
                    </button>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden" 
                />
              </div>

              {/* Download Template */}
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={generateTemplate}
                  className="text-xs font-semibold text-primary hover:underline hover:text-primary/80"
                >
                  Download sample template
                </button>
              </div>

              {/* Duplicate Strategy Selection */}
              <div className="mt-6 border border-border rounded-xl p-4 bg-muted/10">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 block">
                  Duplicate SKU Strategy
                </label>
                <div className="flex flex-col gap-3">
                  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    strategy === 'skip' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted/50'
                  }`}>
                    <input 
                      type="radio" 
                      name="strategy" 
                      value="skip" 
                      checked={strategy === 'skip'} 
                      onChange={() => setStrategy('skip')}
                      className="mt-0.5 w-4 h-4 accent-primary" 
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Skip existing products <span className="text-emerald-500 ml-1">(Recommended)</span></p>
                      <p className="text-xs text-muted-foreground mt-0.5">If a SKU already exists in ERP, it will be skipped entirely.</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    strategy === 'overwrite' ? 'border-amber-500/50 bg-amber-500/5' : 'border-transparent hover:bg-muted/50'
                  }`}>
                    <input 
                      type="radio" 
                      name="strategy" 
                      value="overwrite" 
                      checked={strategy === 'overwrite'} 
                      onChange={() => setStrategy('overwrite')}
                      className="mt-0.5 w-4 h-4 accent-amber-500" 
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Overwrite existing products</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Existing products will have their Price and Stock completely replaced by the CSV values.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isParsing || isUploading}
                  className="flex-1 px-4 py-3 bg-muted text-muted-foreground font-semibold rounded-xl hover:bg-border transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!file || isParsing || isUploading}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(isParsing || isUploading) && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isParsing ? 'Parsing...' : isUploading ? 'Uploading...' : 'Import Products'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

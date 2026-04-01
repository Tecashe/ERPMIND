'use client'

import React, { useState } from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { BulkImportModal } from './bulk-import-modal'

export function BulkImportTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 text-sm"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Bulk Import CSV
      </button>

      {isOpen && <BulkImportModal onClose={() => setIsOpen(false)} />}
    </>
  )
}

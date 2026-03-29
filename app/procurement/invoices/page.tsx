import React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Construction } from "lucide-react";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Vendor Invoices</h1>
          <p className="text-muted-foreground">Procurement Module Workspace</p>
        </div>
        <div className="card-premium p-12 text-center border border-dashed border-border">
          <Construction className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Vendor Invoices features are being built out in the next schema expansion.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
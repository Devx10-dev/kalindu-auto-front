import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InvoiceData } from "@/types/Invoices/invoiceTypes";
import { formatCurrency } from "@/utils/price";
import React from "react";

function InvoiceDetailedView({ invoiceData }: { invoiceData: InvoiceData }) {
  return (
    <div className="space-y-3">
      {/* Invoice Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h3 className="font-medium text-lg">
            Invoice #{invoiceData.invoiceId}
          </h3>
          {invoiceData.creditorName && (
            <p className="text-sm text-muted-foreground">
              Creditor: {invoiceData.creditorName}
            </p>
          )}
        </div>
        <Badge variant="outline" className="mt-0 sm:mt-0">
          {invoiceData.vat > 0 ? "VAT Applied" : "No VAT"}
        </Badge>
      </div>

      <Separator />

      {/* Invoice Summary */}
      <Card>
        <CardHeader className="px-4 py-2">
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4 py-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              {formatCurrency(invoiceData.totalPrice - invoiceData.vat)}
            </span>
          </div>

          {invoiceData.totalDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Discount</span>
              <span className="text-red-600">
                -{formatCurrency(invoiceData.totalDiscount)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT</span>
            <span>{formatCurrency(invoiceData.vat)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-lg">
              {formatCurrency(invoiceData.totalPrice)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InvoiceDetailedView;

'use client';

import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DeliveryBooking } from '@/types';
import { usePortex } from '@/lib/store/portexStore';

interface InvoiceModalProps {
  booking: DeliveryBooking;
  onClose: () => void;
}

export default function InvoiceModal({ booking, onClose }: InvoiceModalProps) {
  const { businessProfile } = usePortex();

  const handlePrint = () => {
    window.print();
  };

  const cgst = Number((booking.pricing.gstAmount / 2).toFixed(2));
  const sgst = Number((booking.pricing.gstAmount / 2).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Top Header Actions (hidden in print) */}
        <div className="print:hidden px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Tax Invoice &bull; GST Compliant
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Sheet */}
        <div className="p-8 sm:p-10 space-y-6 bg-white text-slate-900">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  P
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">PORTEX</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Hyperlocal On-Demand Logistics &amp; Marketplace
              </p>
              <div className="mt-2 text-xs text-slate-700 space-y-0.5">
                <p className="font-bold text-slate-900">{businessProfile.legalName}</p>
                <p className="text-[11px] text-slate-500">{businessProfile.principalAddress}</p>
                <p className="font-mono text-[11px] font-semibold text-blue-700">
                  GSTIN: {businessProfile.gstin}
                </p>
                <p className="text-[11px] text-slate-500">Jurisdiction: {businessProfile.jurisdiction}</p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[11px] mb-2">
                PAID &bull; SAC 9965
              </span>
              <p className="text-slate-500 text-[11px]">Invoice No:</p>
              <p className="font-mono font-bold text-slate-900 text-sm">
                INV-{booking.trackingNumber}
              </p>
              <p className="text-slate-500 text-[11px] mt-1">Date &amp; Time:</p>
              <p className="font-medium text-slate-800">{booking.createdAt}</p>
            </div>
          </div>

          {/* Billed To / Consignment Details */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                Consignor / Pickup From
              </span>
              <p className="font-bold text-slate-900">{booking.pickup.contactName}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">{booking.pickup.address}</p>
              <p className="text-slate-500 text-[11px]">Ph: {booking.pickup.contactPhone}</p>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                Consignee / Deliver To
              </span>
              <p className="font-bold text-slate-900">{booking.drop.contactName}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">{booking.drop.address}</p>
              <p className="text-slate-500 text-[11px]">Ph: {booking.drop.contactPhone}</p>
            </div>
          </div>

          {/* Consignment Specs */}
          <div className="text-xs grid grid-cols-3 gap-3 p-3 border border-slate-200 rounded-xl">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Vehicle Dispatched</span>
              <span className="font-semibold text-slate-800">{booking.vehicleName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Package Cargo</span>
              <span className="font-semibold text-slate-800">{booking.packageType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Weight / Distance</span>
              <span className="font-semibold text-slate-800">
                {booking.packageWeightKg} kg &bull; {booking.distanceKm} km
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 text-left">Description</th>
                  <th className="py-2.5 px-3 text-center">SAC Code</th>
                  <th className="py-2.5 px-3 text-center">Tax Rate</th>
                  <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-semibold">Hyperlocal Road Freight Logistics</p>
                    <p className="text-[11px] text-slate-500">
                      Base handling + {booking.distanceKm} km transit via {booking.vehicleName}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">996511</td>
                  <td className="py-3 px-3 text-center">18%</td>
                  <td className="py-3 px-4 text-right font-medium">
                    ₹{(booking.pricing.baseFare + booking.pricing.distanceFare).toFixed(2)}
                  </td>
                </tr>
                {booking.pricing.weightSurcharge > 0 && (
                  <tr>
                    <td className="py-3 px-4">
                      <p className="font-semibold">Heavy Load Handling Surcharge</p>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">996511</td>
                    <td className="py-3 px-3 text-center">18%</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ₹{booking.pricing.weightSurcharge.toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Total */}
          <div className="flex justify-end">
            <div className="w-72 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Value:</span>
                <span>
                  ₹
                  {(
                    booking.pricing.baseFare +
                    booking.pricing.distanceFare +
                    booking.pricing.weightSurcharge
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9.0%):</span>
                <span>₹{cgst}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9.0%):</span>
                <span>₹{sgst}</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-base text-slate-950">
                <span>Total Amount Paid:</span>
                <span>₹{booking.pricing.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Digitally verified invoice for MANGO TECH ENTERPRISES</span>
            </div>
            <span>No signature required (System Generated)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

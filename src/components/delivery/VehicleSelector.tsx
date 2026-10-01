'use client';

import React from 'react';
import { Bike, Truck, Zap, PackageOpen, Container, Shield, Info } from 'lucide-react';
import { VEHICLE_OPTIONS } from '@/lib/data/mockData';
import { DeliveryVehicleType, VehicleOption } from '@/types';

interface VehicleSelectorProps {
  selectedType: DeliveryVehicleType;
  onSelect: (type: DeliveryVehicleType) => void;
  distanceKm: number;
}

export default function VehicleSelector({ selectedType, onSelect, distanceKm }: VehicleSelectorProps) {
  const getIcon = (type: DeliveryVehicleType) => {
    switch (type) {
      case 'TWO_WHEELER':
        return <Bike className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'THREE_WHEELER_AUTO':
        return <PackageOpen className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'TATA_ACE_MINI_TRUCK':
      case 'PICKUP_8FT':
        return <Truck className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'ELECTRIC_CARGO':
        return <Zap className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'EICHER_14FT':
        return <Container className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <Truck className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Available Portex Fleets ({VEHICLE_OPTIONS.length} Tiers)
        </label>
        <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 flex-shrink-0" /> Includes fuel, driver &amp; basic loading
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {VEHICLE_OPTIONS.map(v => {
          const isSelected = selectedType === v.type;
          const estimatedFare = Math.round(v.baseFare + distanceKm * v.perKmRate);

          return (
            <div
              key={v.type}
              onClick={() => onSelect(v.type)}
              className={`relative p-3 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-lg ring-2 ring-emerald-500/80 -translate-y-0.5'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              {v.badge && (
                <span
                  className={`absolute -top-2 right-2 sm:right-3 text-[9px] font-bold px-2 py-0.2 rounded-full shadow-sm truncate max-w-[120px] ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-200 dark:bg-slate-700'
                  }`}
                >
                  {v.badge}
                </span>
              )}

              <div>
                <div className="flex items-start justify-between">
                  <div
                    className={`p-2 sm:p-2.5 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {getIcon(v.type)}
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      ₹{estimatedFare}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block -mt-0.5">Est. Total</span>
                  </div>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-2.5 leading-tight">
                  {v.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 sm:line-clamp-2">
                  {v.tagline}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-[10px] sm:text-[11px]">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Max Payload</span>
                  <strong className="text-slate-900 dark:text-slate-200">&le; {v.maxWeightKg} kg</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 hidden sm:flex">
                  <span>Cargo Box</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{v.dimensions}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>ETA</span>
                  <span>~{v.etaMins} mins</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

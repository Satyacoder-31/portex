'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, ZoomIn, ZoomOut, Maximize2, ShieldCheck, Radio, Compass } from 'lucide-react';

interface LiveMapProps {
  pickupAddress: string;
  dropAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropLat?: number;
  dropLng?: number;
  vehicleType?: string;
  driverName?: string;
  driverPlate?: string;
  statusStage?: string;
  interactive?: boolean;
  heightClass?: string;
}

export default function LiveMap({
  pickupAddress,
  dropAddress,
  vehicleType = 'TATA_ACE_MINI_TRUCK',
  driverName = 'Mohd. Imran Khan',
  driverPlate = 'UP32 EZ 4912',
  statusStage = 'IN_TRANSIT',
  heightClass = 'h-[300px] sm:h-[440px]',
}: LiveMapProps) {
  // Vehicle progress animation (0 to 1 along curve)
  const [progress, setProgress] = useState(0.48);
  const [speed, setSpeed] = useState(38);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (statusStage === 'DELIVERED') {
      setProgress(1.0);
      return;
    }
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 0.95) return 0.2; // loop for demo
        return Number((prev + 0.015).toFixed(3));
      });
      // slight speed variation
      setSpeed(Math.floor(32 + Math.random() * 12));
    }, 1200);

    return () => clearInterval(interval);
  }, [statusStage]);

  // SVG route path bezier points:
  // Start: (120, 320) -> Control 1: (260, 240) -> Control 2: (440, 160) -> End: (640, 110)
  // Approximate vehicle coordinates via quadratic bezier
  const t = progress;
  // Cubic Bezier interpolation: P0(110, 330), P1(280, 290), P2(420, 130), P3(650, 110)
  const cx = 3 * (280 - 110);
  const bx = 3 * (420 - 280) - cx;
  const ax = 650 - 110 - cx - bx;

  const cy = 3 * (290 - 330);
  const by = 3 * (130 - 290) - cy;
  const ay = 110 - 330 - cy - by;

  const vehicleX = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + 110;
  const vehicleY = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + 330;

  // Tangent angle for vehicle heading rotation
  const dx = 3 * ax * Math.pow(t, 2) + 2 * bx * t + cx;
  const dy = 3 * ay * Math.pow(t, 2) + 2 * by * t + cy;
  const headingAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <div className={`relative w-full ${heightClass} bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl`}>
      {/* Map Graphic Layer */}
      <svg
        viewBox="0 0 760 440"
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* City Map Base / Grid */}
        <rect width="100%" height="100%" fill="#0a0f1d" />
        <rect width="100%" height="100%" fill="url(#gridPattern)" />

        {/* River Gomti stylized curve */}
        <path
          d="M -20,180 Q 220,140 380,260 T 800,280"
          fill="none"
          stroke="#0f3460"
          strokeWidth="32"
          strokeOpacity="0.45"
        />

        {/* Major arterial road networks */}
        <path d="M 0,90 L 760,90" stroke="#1e293b" strokeWidth="6" />
        <path d="M 0,220 L 760,220" stroke="#1e293b" strokeWidth="8" />
        <path d="M 0,360 L 760,360" stroke="#1e293b" strokeWidth="6" />
        <path d="M 180,0 L 180,440" stroke="#1e293b" strokeWidth="6" />
        <path d="M 380,0 L 380,440" stroke="#1e293b" strokeWidth="8" />
        <path d="M 580,0 L 580,440" stroke="#1e293b" strokeWidth="6" />

        {/* Diagonal Flyovers / Expressway */}
        <path d="M 40,420 L 720,40" stroke="#1e293b" strokeWidth="10" strokeOpacity="0.6" />

        {/* Route Shadow / Base Line */}
        <path
          d="M 110,330 C 280,290 420,130 650,110"
          fill="none"
          stroke="#0f172a"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Active Route Glow */}
        <path
          d="M 110,330 C 280,290 420,130 650,110"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Animated Moving Pulses on Route */}
        <path
          d="M 110,330 C 280,290 420,130 650,110"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeDasharray="10 20"
          className="animate-route-dash"
          strokeOpacity="0.8"
        />

        {/* Origin / Pickup Marker (Gomti Nagar) */}
        <g transform="translate(110, 330)">
          <circle r="22" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
          <circle r="12" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
          <circle r="4" fill="#ffffff" />
          <text x="-40" y="32" fill="#94a3b8" fontSize="11" fontWeight="600">
            PICKUP (Gomti Nagar)
          </text>
        </g>

        {/* Destination / Drop Marker (Aliganj) */}
        <g transform="translate(650, 110)">
          <circle r="22" fill="#3b82f6" fillOpacity="0.2" />
          <circle r="12" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
          <circle r="4" fill="#ffffff" />
          <text x="-50" y="-18" fill="#94a3b8" fontSize="11" fontWeight="600">
            DROP (Aliganj Sec-I)
          </text>
        </g>

        {/* Live Moving Vehicle Marker */}
        <g transform={`translate(${vehicleX}, ${vehicleY})`}>
          {/* Signal wave */}
          <circle r="28" fill="#3b82f6" fillOpacity="0.25" className="animate-ping" />
          <circle r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Vehicle Icon rotated towards heading */}
          <g transform={`rotate(${headingAngle}) scale(0.9)`}>
            {/* Truck Cab & Cargo bed representation */}
            <rect x="-8" y="-14" width="16" height="28" rx="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="-6" y="2" width="12" height="10" rx="1.5" fill="#38bdf8" />
            {/* Headlights beams */}
            <polygon points="-5,-14 0,-24 5,-14" fill="#fef08a" fillOpacity="0.6" />
          </g>
        </g>
      </svg>

      {/* Top Floating Telemetry Overlay */}
      <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold text-slate-200 uppercase tracking-wider">
            GPS Live
          </span>
          <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
            {speed} km/h
          </span>
          <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            ETA: {Math.max(2, Math.round(18 * (1 - progress)))}m
          </span>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
            className="p-1 sm:p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="p-1 sm:p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 sm:p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Recenter"
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Live Driver & Route Card Overlay */}
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-2xl flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs sm:text-lg shadow-md">
                MI
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <h4 className="text-white font-bold text-xs sm:text-sm truncate">{driverName}</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded-full hidden sm:inline-flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Pro Driver
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                {driverPlate} &bull; ⭐ 4.9
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <span className="text-[9px] sm:text-[11px] text-slate-400 block leading-tight">Stage</span>
              <span className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-wide">
                {statusStage.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

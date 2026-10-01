'use client';

import React from 'react';
import { usePortex } from '@/lib/store/portexStore';
import { CheckCircle, Bell } from 'lucide-react';

export default function ToastNotification() {
  const { toastMessage } = usePortex();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 max-w-sm">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-4 h-4" />
        </div>
        <p className="text-xs font-medium text-slate-200 leading-snug">{toastMessage}</p>
      </div>
    </div>
  );
}

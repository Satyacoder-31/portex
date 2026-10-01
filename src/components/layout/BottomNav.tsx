'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Truck, MessageSquare, User } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function BottomNav() {
  const pathname = usePathname();
  const { conversations } = usePortex();
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Market', href: '/marketplace', icon: Compass },
    { label: 'Deliver', href: '/deliver', icon: Truck, highlight: true },
    { label: 'Chat', href: '/chat', icon: MessageSquare, badge: unreadCount },
    { label: 'Account', href: '/dashboard', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 px-3 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.highlight) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center -mt-5 group"
                aria-label="Deliver Something"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-all border-3 border-white dark:border-slate-950">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center relative py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

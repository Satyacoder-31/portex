'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Truck, MessageSquare, User, PlusCircle, ShieldCheck } from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

export default function BottomNav() {
  const pathname = usePathname();
  const { conversations, userRole } = usePortex();
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  let navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Market', href: '/marketplace', icon: Compass },
    { label: 'Deliver', href: '/deliver', icon: Truck, highlight: true },
    { label: 'Chat', href: '/chat', icon: MessageSquare, badge: unreadCount },
    { label: 'Account', href: '/dashboard', icon: User },
  ];

  if (userRole === 'DRIVER') {
    navItems = [
      { label: 'Cockpit', href: '/', icon: Home },
      { label: 'Radar Map', href: '/driver', icon: Compass },
      { label: 'Duty Radar', href: '/driver', icon: Truck, highlight: true },
      { label: 'Chat', href: '/chat', icon: MessageSquare, badge: unreadCount },
      { label: 'Earnings', href: '/dashboard', icon: User },
    ];
  } else if (userRole === 'SELLER') {
    navItems = [
      { label: 'Studio', href: '/', icon: Home },
      { label: 'Catalog', href: '/marketplace', icon: Compass },
      { label: '+ Post Ad', href: '/sell', icon: PlusCircle, highlight: true },
      { label: 'Inquiries', href: '/chat', icon: MessageSquare, badge: unreadCount },
      { label: 'Payouts', href: '/dashboard', icon: User },
    ];
  } else if (userRole === 'ENTERPRISE') {
    navItems = [
      { label: 'Operations', href: '/', icon: Home },
      { label: 'Freight', href: '/tracking', icon: Compass },
      { label: 'Dispatch', href: '/deliver', icon: Truck, highlight: true },
      { label: 'Logistics', href: '/chat', icon: MessageSquare, badge: unreadCount },
      { label: 'B2B Taxes', href: '/dashboard', icon: User },
    ];
  }

  // Hide mobile bottom nav on chat page so the message input bar stays fully accessible
  if (pathname === '/chat') return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-2xl border-t border-amber-500/20 px-3 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl">
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
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-black flex items-center justify-center shadow-lg shadow-amber-500/40 group-active:scale-95 transition-all border-2 border-[#09090b]">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-amber-400 mt-1">
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
                  ? 'text-amber-400 font-black'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-500 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

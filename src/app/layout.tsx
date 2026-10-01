import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { PortexProvider } from '@/lib/store/portexStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import DriverIncomingModal from '@/components/driver/DriverIncomingModal';
import ToastNotification from '@/components/common/ToastNotification';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PORTEX — Unified Marketplace & Hyperlocal On-Demand Logistics',
  description:
    'Buy, sell, and instantly book Porter-style mini trucks and 2-wheelers. Real-time GPS tracking, escrow safety, and verified sellers powered by Mango Tech Enterprises.',
  keywords: [
    'marketplace',
    'hyperlocal delivery',
    'porter logistics',
    'olx classifieds',
    'tata ace booking',
    'secondhand buy sell',
    'live gps tracking',
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portex-theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
        <PortexProvider>
          <Navbar />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <DriverIncomingModal />
          <ToastNotification />
        </PortexProvider>
      </body>
    </html>
  );
}

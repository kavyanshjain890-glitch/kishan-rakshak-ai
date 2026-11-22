import type { Metadata, Viewport } from 'next';
import './globals.css';
import ServiceWorkerRegister from '@/components/layout/ServiceWorkerRegister';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'KISHAN RAKSHAK AI | किसान रक्षक एआई',
  description: 'AI-Powered Smart Agriculture, Weather Advisory & Crop Protection for Indian Farmers',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KishanRakshak',
  },
};

export const viewport: Viewport = {
  themeColor: '#15803d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 text-slate-900" suppressHydrationWarning>
        <ServiceWorkerRegister />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

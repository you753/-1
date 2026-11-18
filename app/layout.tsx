import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NŪR Studio — Wear your story',
  description: 'Contemporary essentials, thoughtfully made.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}

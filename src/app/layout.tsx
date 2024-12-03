import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quantum Pay - M-PESA Payments',
  description: 'Secure and fast M-PESA payments with Safaricom Daraja 2.0',
  keywords: ['M-PESA', 'payments', 'Safaricom', 'Daraja', 'mobile money'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

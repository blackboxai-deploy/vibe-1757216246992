import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StockProvider } from '@/contexts/StockContext';
import { Header } from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Control de Stock - Esencias',
  description: 'Sistema de gestión de inventario para esencias aromáticas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <StockProvider>
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </StockProvider>
      </body>
    </html>
  );
}
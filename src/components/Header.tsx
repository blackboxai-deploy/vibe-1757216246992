'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Control de Stock - Esencias
            </h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link href="/" passHref>
              <Button 
                variant={pathname === '/' ? 'default' : 'ghost'}
                className="font-medium"
              >
                Gestión de Stock
              </Button>
            </Link>
            <Link href="/planilla" passHref>
              <Button 
                variant={pathname === '/planilla' ? 'default' : 'ghost'}
                className="font-medium"
              >
                Planilla de Datos
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { ProviderSelector } from '@/components/ProviderSelector';
import { StockController } from '@/components/StockController';
import { Esencia, Proveedor } from '@/types';

export default function HomePage() {
  const [esenciaSeleccionada, setEsenciaSeleccionada] = useState<Esencia | null>(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Gestión de Stock de Esencias
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Controla el inventario de esencias aromáticas de manera eficiente. 
          Busca, selecciona proveedores y gestiona las cantidades de stock.
        </p>
      </div>

      {/* Panel Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Izquierda - Búsqueda y Selección */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Seleccionar Esencia y Proveedor
                </h2>
                <p className="text-sm text-gray-600">
                  Comienza buscando la esencia que deseas gestionar
                </p>
              </div>

              <SearchBar
                onEsenciaSelect={setEsenciaSeleccionada}
                selectedEsencia={esenciaSeleccionada}
              />

              <ProviderSelector
                esencia={esenciaSeleccionada}
                onProviderSelect={setProveedorSeleccionado}
                selectedProvider={proveedorSeleccionado}
              />
            </div>
          </Card>

          {/* Acceso rápido a planilla */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  📊 Planilla de Datos
                </h3>
                <p className="text-sm text-blue-700">
                  Consulta el historial completo de todos los movimientos de stock
                </p>
              </div>
              <Link href="/planilla">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6">
                  Ver Planilla Completa
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Columna Derecha - Control de Stock */}
        <div>
          <StockController
            esencia={esenciaSeleccionada}
            proveedor={proveedorSeleccionado}
          />
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {esenciaSeleccionada && (
        <Card className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen de Stock - {esenciaSeleccionada.nombre}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {esenciaSeleccionada.proveedores.length}
              </div>
              <div className="text-sm text-blue-700">
                Proveedor{esenciaSeleccionada.proveedores.length !== 1 ? 'es' : ''}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {esenciaSeleccionada.proveedores.reduce((total, p) => total + p.stockActual, 0)}
              </div>
              <div className="text-sm text-green-700">Stock Total</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${(esenciaSeleccionada.proveedores
                  .filter(p => p.precio)
                  .reduce((sum, p) => sum + (p.precio || 0), 0) / 
                  esenciaSeleccionada.proveedores.filter(p => p.precio).length || 0).toFixed(2)}
              </div>
              <div className="text-sm text-purple-700">Precio Promedio</div>
            </div>
          </div>
        </Card>
      )}

      {/* Instrucciones de uso */}
      {!esenciaSeleccionada && (
        <Card className="p-6 bg-gray-50">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              🚀 Cómo usar el sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="font-medium text-gray-800">1. Buscar</div>
                <div>Escribe el nombre de la esencia en el buscador</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-800">2. Seleccionar</div>
                <div>Elige el proveedor de la lista disponible</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-800">3. Gestionar</div>
                <div>Agrega o descuenta cantidades del inventario</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
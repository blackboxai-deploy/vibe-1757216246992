'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MovementsTable } from '@/components/MovementsTable';
import { useStock } from '@/contexts/StockContext';

export default function PlanillaPage() {
  const { movimientos, esencias } = useStock();

  // Calcular estadísticas
  const totalMovimientos = movimientos.length;
  const totalEntradas = movimientos.filter(m => m.tipo === 'entrada').length;
  const totalSalidas = movimientos.filter(m => m.tipo === 'salida').length;
  const stockTotal = esencias.reduce((total, esencia) => 
    total + esencia.proveedores.reduce((subtotal, proveedor) => 
      subtotal + proveedor.stockActual, 0), 0
  );

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Planilla de Datos
          </h1>
          <p className="text-lg text-gray-600">
            Historial completo de movimientos de stock de esencias
          </p>
        </div>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
            ← Volver a Gestión
          </Button>
        </Link>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalMovimientos}</div>
            <div className="text-sm text-blue-700">Total Movimientos</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalEntradas}</div>
            <div className="text-sm text-green-700">Entradas</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalSalidas}</div>
            <div className="text-sm text-red-700">Salidas</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stockTotal}</div>
            <div className="text-sm text-purple-700">Stock Total Actual</div>
          </div>
        </Card>
      </div>

      {/* Resumen por esencia */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen por Esencia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {esencias.map((esencia) => {
            const stockTotalEsencia = esencia.proveedores.reduce((sum, p) => sum + p.stockActual, 0);
            const movimientosEsencia = movimientos.filter(m => m.esenciaId === esencia.id);
            
            return (
              <div 
                key={esencia.id} 
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border"
              >
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">{esencia.nombre}</div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span className="font-medium">{stockTotalEsencia}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proveedores:</span>
                      <span className="font-medium">{esencia.proveedores.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Movimientos:</span>
                      <span className="font-medium">{movimientosEsencia.length}</span>
                    </div>
                  </div>
                  
                  {stockTotalEsencia <= 20 && (
                    <div className="px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                      ⚠️ Stock bajo
                    </div>
                  )}
                  
                  {stockTotalEsencia === 0 && (
                    <div className="px-2 py-1 bg-red-100 border border-red-300 rounded text-xs text-red-800">
                      ❌ Sin stock
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabla de movimientos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Historial de Movimientos
        </h2>
        <MovementsTable />
      </div>

      {/* Información adicional */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-900">
            💡 Información sobre la Planilla
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div className="space-y-2">
              <div className="font-medium">Filtros Disponibles:</div>
              <ul className="space-y-1 pl-4">
                <li>• Buscar por nombre de esencia</li>
                <li>• Filtrar por proveedor específico</li>
                <li>• Mostrar solo entradas o salidas</li>
                <li>• Paginación de resultados</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Información Mostrada:</div>
              <ul className="space-y-1 pl-4">
                <li>• Fecha y hora exacta del movimiento</li>
                <li>• Tipo de operación (entrada/salida)</li>
                <li>• Cantidad movida</li>
                <li>• Stock antes y después de la operación</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
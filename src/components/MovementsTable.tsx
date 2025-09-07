'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStock } from '@/contexts/StockContext';

export function MovementsTable() {
  const { movimientos } = useStock();
  const [filtroEsencia, setFiltroEsencia] = useState<string>('');
  const [filtroProveedor, setFiltroProveedor] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [paginaActual, setPaginaActual] = useState(1);
  const movimientosPorPagina = 10;

  // Obtener listas únicas para filtros
  const proveedoresUnicos = useMemo(() => {
    const proveedores = Array.from(new Set(movimientos.map(m => m.proveedor)));
    return proveedores.sort();
  }, [movimientos]);

  // Aplicar filtros
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter(movimiento => {
      const cumpleFiltroEsencia = !filtroEsencia || 
        movimiento.esenciaNombre.toLowerCase().includes(filtroEsencia.toLowerCase());
      const cumpleFiltroProveedor = !filtroProveedor || movimiento.proveedor === filtroProveedor;
      const cumpleFiltroTipo = !filtroTipo || movimiento.tipo === filtroTipo;
      
      return cumpleFiltroEsencia && cumpleFiltroProveedor && cumpleFiltroTipo;
    });
  }, [movimientos, filtroEsencia, filtroProveedor, filtroTipo]);

  // Paginación
  const totalPaginas = Math.ceil(movimientosFiltrados.length / movimientosPorPagina);
  const indiceInicio = (paginaActual - 1) * movimientosPorPagina;
  const movimientosPaginados = movimientosFiltrados.slice(indiceInicio, indiceInicio + movimientosPorPagina);

  const limpiarFiltros = () => {
    setFiltroEsencia('');
    setFiltroProveedor('');
    setFiltroTipo('');
    setPaginaActual(1);
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (movimientos.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay movimientos registrados
          </h3>
          <p className="text-gray-600">
            Los movimientos de stock aparecerán aquí cuando realices operaciones de agregar o descontar inventario.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filtrar Movimientos</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={limpiarFiltros}
              className="text-xs"
            >
              Limpiar Filtros
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Esencia</label>
              <Input
                placeholder="Buscar esencia..."
                value={filtroEsencia}
                onChange={(e) => setFiltroEsencia(e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Proveedor</label>
              <Select value={filtroProveedor} onValueChange={setFiltroProveedor}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Todos los proveedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los proveedores</SelectItem>
                  {proveedoresUnicos.map(proveedor => (
                    <SelectItem key={proveedor} value={proveedor}>
                      {proveedor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tipo de Movimiento</label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="entrada">Entradas</SelectItem>
                  <SelectItem value="salida">Salidas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Resultados</label>
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-700">
                {movimientosFiltrados.length} de {movimientos.length}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Esencia
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Anterior
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Nuevo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movimientosPaginados.map((movimiento) => (
                <tr key={movimiento.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearFecha(movimiento.fecha)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {movimiento.esenciaNombre}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {movimiento.proveedor}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge 
                      variant={movimiento.tipo === 'entrada' ? 'default' : 'destructive'}
                      className={movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {movimiento.tipo === 'entrada' ? '+ Entrada' : '- Salida'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                    {movimiento.cantidad}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                    {movimiento.stockAnterior}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-right">
                    {movimiento.stockNuevo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
            <div className="text-sm text-gray-700">
              Mostrando {indiceInicio + 1} - {Math.min(indiceInicio + movimientosPorPagina, movimientosFiltrados.length)} de {movimientosFiltrados.length} resultados
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                disabled={paginaActual === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  const pagina = i + 1;
                  return (
                    <Button
                      key={pagina}
                      variant={pagina === paginaActual ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaginaActual(pagina)}
                      className="w-8 h-8"
                    >
                      {pagina}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
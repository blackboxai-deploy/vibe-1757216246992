'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Esencia, Proveedor } from '@/types';

interface ProviderSelectorProps {
  esencia: Esencia | null;
  onProviderSelect: (proveedor: Proveedor) => void;
  selectedProvider: Proveedor | null;
}

export function ProviderSelector({ esencia, onProviderSelect, selectedProvider }: ProviderSelectorProps) {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<string>('');

  useEffect(() => {
    // Reset cuando cambia la esencia
    setProveedorSeleccionado('');
    onProviderSelect(null as any);
  }, [esencia, onProviderSelect]);

  const handleProviderChange = (proveedorNombre: string) => {
    if (!esencia) return;
    
    const proveedor = esencia.proveedores.find(p => p.nombre === proveedorNombre);
    if (proveedor) {
      setProveedorSeleccionado(proveedorNombre);
      onProviderSelect(proveedor);
    }
  };

  if (!esencia) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-400">
          Seleccionar Proveedor
        </label>
        <Select disabled>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Primero selecciona una esencia" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="proveedor-select" className="block text-sm font-medium text-gray-700">
          Seleccionar Proveedor
        </label>
        <Select value={proveedorSeleccionado} onValueChange={handleProviderChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Elige un proveedor..." />
          </SelectTrigger>
          <SelectContent>
            {esencia.proveedores.map((proveedor) => (
              <SelectItem key={proveedor.nombre} value={proveedor.nombre}>
                <div className="flex justify-between items-center w-full">
                  <span>{proveedor.nombre}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    Stock: {proveedor.stockActual}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProvider && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="space-y-2">
            <h3 className="font-medium text-blue-900">Información del Proveedor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-blue-800">Proveedor:</span>
                <div className="text-blue-700">{selectedProvider.nombre}</div>
              </div>
              <div>
                <span className="font-medium text-blue-800">Stock Actual:</span>
                <div className="text-blue-700 font-semibold">{selectedProvider.stockActual} unidades</div>
              </div>
              {selectedProvider.precio && (
                <div className="sm:col-span-2">
                  <span className="font-medium text-blue-800">Precio por unidad:</span>
                  <div className="text-blue-700">${selectedProvider.precio.toFixed(2)}</div>
                </div>
              )}
            </div>
            
            {selectedProvider.stockActual <= 10 && (
              <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-md">
                <div className="text-xs text-yellow-800 font-medium">
                  ⚠️ Stock bajo - Solo quedan {selectedProvider.stockActual} unidades
                </div>
              </div>
            )}
            
            {selectedProvider.stockActual === 0 && (
              <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-md">
                <div className="text-xs text-red-800 font-medium">
                  ❌ Sin stock disponible
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
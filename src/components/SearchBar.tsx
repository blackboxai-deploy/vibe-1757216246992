'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useStock } from '@/contexts/StockContext';
import { Esencia } from '@/types';

interface SearchBarProps {
  onEsenciaSelect: (esencia: Esencia) => void;
  selectedEsencia: Esencia | null;
}

export function SearchBar({ onEsenciaSelect, selectedEsencia }: SearchBarProps) {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState<Esencia[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const { buscarEsencias } = useStock();

  useEffect(() => {
    if (termino.trim()) {
      const esenciasEncontradas = buscarEsencias(termino);
      setResultados(esenciasEncontradas);
      setMostrarResultados(true);
    } else {
      setResultados([]);
      setMostrarResultados(false);
    }
  }, [termino, buscarEsencias]);

  const handleEsenciaClick = (esencia: Esencia) => {
    setTermino(esencia.nombre);
    setMostrarResultados(false);
    onEsenciaSelect(esencia);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermino(e.target.value);
    if (!e.target.value.trim() && selectedEsencia) {
      onEsenciaSelect(null as any);
    }
  };

  return (
    <div className="relative w-full">
      <div className="space-y-2">
        <label htmlFor="buscar-esencia" className="block text-sm font-medium text-gray-700">
          Buscar Esencia
        </label>
        <Input
          id="buscar-esencia"
          type="text"
          placeholder="Escribe el nombre de la esencia..."
          value={termino}
          onChange={handleInputChange}
          className="w-full text-base"
          autoComplete="off"
        />
      </div>

      {mostrarResultados && resultados.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg">
          <div className="py-1">
            {resultados.map((esencia) => (
              <button
                key={esencia.id}
                onClick={() => handleEsenciaClick(esencia)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
              >
                <div className="font-medium text-gray-900">{esencia.nombre}</div>
                <div className="text-xs text-gray-500">
                  {esencia.proveedores.length} proveedor{esencia.proveedores.length !== 1 ? 'es' : ''}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {mostrarResultados && resultados.length === 0 && termino.trim() && (
        <Card className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500">
            No se encontraron esencias que coincidan con "{termino}"
          </div>
        </Card>
      )}

      {selectedEsencia && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <div className="text-sm">
              <span className="font-medium text-green-800">Esencia seleccionada: </span>
              <span className="text-green-700">{selectedEsencia.nombre}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
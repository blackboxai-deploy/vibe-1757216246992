'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStock } from '@/contexts/StockContext';
import { Esencia, Proveedor } from '@/types';

interface StockControllerProps {
  esencia: Esencia | null;
  proveedor: Proveedor | null;
}

export function StockController({ esencia, proveedor }: StockControllerProps) {
  const [cantidad, setCantidad] = useState<string>('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error' | 'info', texto: string } | null>(null);
  const [procesando, setProcesando] = useState(false);
  
  const { agregarStock, descontarStock } = useStock();

  const limpiarMensaje = () => {
    setTimeout(() => setMensaje(null), 4000);
  };

  const handleOperacion = async (tipo: 'agregar' | 'descontar') => {
    if (!esencia || !proveedor) {
      setMensaje({ tipo: 'error', texto: 'Debe seleccionar una esencia y un proveedor' });
      limpiarMensaje();
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setMensaje({ tipo: 'error', texto: 'Ingrese una cantidad válida mayor a 0' });
      limpiarMensaje();
      return;
    }

    if (tipo === 'descontar' && cantidadNum > proveedor.stockActual) {
      setMensaje({ 
        tipo: 'error', 
        texto: `No hay suficiente stock. Disponible: ${proveedor.stockActual} unidades` 
      });
      limpiarMensaje();
      return;
    }

    setProcesando(true);
    
    try {
      let resultado: boolean;
      
      if (tipo === 'agregar') {
        resultado = agregarStock(esencia.id, proveedor.nombre, cantidadNum);
      } else {
        resultado = descontarStock(esencia.id, proveedor.nombre, cantidadNum);
      }

      if (resultado) {
        const stockNuevo = tipo === 'agregar' 
          ? proveedor.stockActual + cantidadNum 
          : proveedor.stockActual - cantidadNum;
          
        setMensaje({ 
          tipo: 'success', 
          texto: `✅ ${tipo === 'agregar' ? 'Agregado' : 'Descontado'} ${cantidadNum} unidades. Nuevo stock: ${stockNuevo}` 
        });
        setCantidad('');
      } else {
        setMensaje({ tipo: 'error', texto: 'Error al procesar la operación' });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error inesperado al procesar la operación' });
    } finally {
      setProcesando(false);
      limpiarMensaje();
    }
  };

  const puedeOperar = esencia && proveedor && !procesando;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Control de Stock
          </h2>
          <p className="text-sm text-gray-600">
            Agregue o descuente cantidades del inventario
          </p>
        </div>

        {mensaje && (
          <Alert className={`${
            mensaje.tipo === 'success' ? 'border-green-200 bg-green-50' :
            mensaje.tipo === 'error' ? 'border-red-200 bg-red-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <AlertDescription className={`${
              mensaje.tipo === 'success' ? 'text-green-800' :
              mensaje.tipo === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {mensaje.texto}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cantidad-input" className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <Input
              id="cantidad-input"
              type="number"
              min="1"
              placeholder="Ingrese la cantidad..."
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              disabled={!puedeOperar}
              className="text-center text-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => handleOperacion('agregar')}
              disabled={!puedeOperar || !cantidad.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
              size="lg"
            >
              {procesando ? 'Procesando...' : '+ Agregar Stock'}
            </Button>

            <Button
              onClick={() => handleOperacion('descontar')}
              disabled={!puedeOperar || !cantidad.trim()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
              size="lg"
            >
              {procesando ? 'Procesando...' : '- Descontar Stock'}
            </Button>
          </div>
        </div>

        {!esencia && (
          <div className="text-center text-sm text-gray-500 py-4">
            Seleccione una esencia para comenzar
          </div>
        )}

        {esencia && !proveedor && (
          <div className="text-center text-sm text-gray-500 py-4">
            Seleccione un proveedor para continuar
          </div>
        )}

        {puedeOperar && (
          <div className="text-center text-xs text-gray-400 border-t pt-4">
            Esencia: <span className="font-medium">{esencia?.nombre}</span> | 
            Proveedor: <span className="font-medium">{proveedor?.nombre}</span> | 
            Stock actual: <span className="font-medium">{proveedor?.stockActual}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
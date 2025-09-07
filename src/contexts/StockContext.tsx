'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Esencia, Movimiento, StockContextType } from '@/types';
import { esenciasIniciales, movimientosIniciales, generarId, STORAGE_KEYS } from '@/lib/stockData';

const StockContext = createContext<StockContextType | undefined>(undefined);

interface StockProviderProps {
  children: ReactNode;
}

export function StockProvider({ children }: StockProviderProps) {
  const [esencias, setEsencias] = useState<Esencia[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const esenciasGuardadas = localStorage.getItem(STORAGE_KEYS.ESENCIAS);
    const movimientosGuardados = localStorage.getItem(STORAGE_KEYS.MOVIMIENTOS);

    if (esenciasGuardadas) {
      setEsencias(JSON.parse(esenciasGuardadas));
    } else {
      setEsencias(esenciasIniciales);
    }

    if (movimientosGuardados) {
      const movimientosParsed = JSON.parse(movimientosGuardados).map((mov: any) => ({
        ...mov,
        fecha: new Date(mov.fecha)
      }));
      setMovimientos(movimientosParsed);
    } else {
      setMovimientos(movimientosIniciales);
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    if (esencias.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ESENCIAS, JSON.stringify(esencias));
    }
  }, [esencias]);

  useEffect(() => {
    if (movimientos.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MOVIMIENTOS, JSON.stringify(movimientos));
    }
  }, [movimientos]);

  const agregarStock = (esenciaId: string, proveedor: string, cantidad: number): boolean => {
    if (cantidad <= 0) return false;

    const nuevasEsencias = [...esencias];
    const esenciaIndex = nuevasEsencias.findIndex(e => e.id === esenciaId);
    
    if (esenciaIndex === -1) return false;

    const proveedorIndex = nuevasEsencias[esenciaIndex].proveedores.findIndex(p => p.nombre === proveedor);
    
    if (proveedorIndex === -1) return false;

    const stockAnterior = nuevasEsencias[esenciaIndex].proveedores[proveedorIndex].stockActual;
    const stockNuevo = stockAnterior + cantidad;

    // Actualizar stock
    nuevasEsencias[esenciaIndex].proveedores[proveedorIndex].stockActual = stockNuevo;
    setEsencias(nuevasEsencias);

    // Registrar movimiento
    const nuevoMovimiento: Movimiento = {
      id: generarId(),
      esenciaId,
      esenciaNombre: nuevasEsencias[esenciaIndex].nombre,
      proveedor,
      tipo: 'entrada',
      cantidad,
      fecha: new Date(),
      stockAnterior,
      stockNuevo
    };

    setMovimientos(prev => [nuevoMovimiento, ...prev]);
    return true;
  };

  const descontarStock = (esenciaId: string, proveedor: string, cantidad: number): boolean => {
    if (cantidad <= 0) return false;

    const nuevasEsencias = [...esencias];
    const esenciaIndex = nuevasEsencias.findIndex(e => e.id === esenciaId);
    
    if (esenciaIndex === -1) return false;

    const proveedorIndex = nuevasEsencias[esenciaIndex].proveedores.findIndex(p => p.nombre === proveedor);
    
    if (proveedorIndex === -1) return false;

    const stockAnterior = nuevasEsencias[esenciaIndex].proveedores[proveedorIndex].stockActual;
    
    // Verificar que hay suficiente stock
    if (stockAnterior < cantidad) return false;

    const stockNuevo = stockAnterior - cantidad;

    // Actualizar stock
    nuevasEsencias[esenciaIndex].proveedores[proveedorIndex].stockActual = stockNuevo;
    setEsencias(nuevasEsencias);

    // Registrar movimiento
    const nuevoMovimiento: Movimiento = {
      id: generarId(),
      esenciaId,
      esenciaNombre: nuevasEsencias[esenciaIndex].nombre,
      proveedor,
      tipo: 'salida',
      cantidad,
      fecha: new Date(),
      stockAnterior,
      stockNuevo
    };

    setMovimientos(prev => [nuevoMovimiento, ...prev]);
    return true;
  };

  const buscarEsencias = (termino: string): Esencia[] => {
    if (!termino.trim()) return esencias;
    
    const terminoLower = termino.toLowerCase();
    return esencias.filter(esencia => 
      esencia.nombre.toLowerCase().includes(terminoLower)
    );
  };

  const obtenerEsencia = (id: string): Esencia | undefined => {
    return esencias.find(esencia => esencia.id === id);
  };

  const contextValue: StockContextType = {
    esencias,
    movimientos,
    agregarStock,
    descontarStock,
    buscarEsencias,
    obtenerEsencia
  };

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock debe ser usado dentro de un StockProvider');
  }
  return context;
}
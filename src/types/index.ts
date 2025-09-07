// Tipos de datos para el sistema de control de stock de esencias

export interface Proveedor {
  nombre: string;
  stockActual: number;
  precio?: number;
}

export interface Esencia {
  id: string;
  nombre: string;
  proveedores: Proveedor[];
}

export interface Movimiento {
  id: string;
  esenciaId: string;
  esenciaNombre: string;
  proveedor: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  fecha: Date;
  stockAnterior: number;
  stockNuevo: number;
}

export interface StockContextType {
  esencias: Esencia[];
  movimientos: Movimiento[];
  agregarStock: (esenciaId: string, proveedor: string, cantidad: number) => boolean;
  descontarStock: (esenciaId: string, proveedor: string, cantidad: number) => boolean;
  buscarEsencias: (termino: string) => Esencia[];
  obtenerEsencia: (id: string) => Esencia | undefined;
}
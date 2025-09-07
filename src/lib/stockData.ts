import { Esencia, Movimiento } from '@/types';

// Datos iniciales de esencias con múltiples proveedores
export const esenciasIniciales: Esencia[] = [
  {
    id: '1',
    nombre: 'Vainilla',
    proveedores: [
      { nombre: 'Proveedor A', stockActual: 150, precio: 25.50 },
      { nombre: 'Proveedor B', stockActual: 200, precio: 23.00 },
    ]
  },
  {
    id: '2',
    nombre: 'Canela',
    proveedores: [
      { nombre: 'Proveedor A', stockActual: 120, precio: 18.75 },
      { nombre: 'Proveedor C', stockActual: 80, precio: 20.00 },
    ]
  },
  {
    id: '3',
    nombre: 'Lavanda',
    proveedores: [
      { nombre: 'Proveedor B', stockActual: 90, precio: 32.00 },
      { nombre: 'Proveedor D', stockActual: 110, precio: 30.50 },
    ]
  },
  {
    id: '4',
    nombre: 'Rosa',
    proveedores: [
      { nombre: 'Proveedor A', stockActual: 75, precio: 45.00 },
      { nombre: 'Proveedor D', stockActual: 60, precio: 47.50 },
    ]
  },
  {
    id: '5',
    nombre: 'Eucalipto',
    proveedores: [
      { nombre: 'Proveedor B', stockActual: 180, precio: 22.00 },
      { nombre: 'Proveedor C', stockActual: 140, precio: 24.25 },
    ]
  },
  {
    id: '6',
    nombre: 'Jazmín',
    proveedores: [
      { nombre: 'Proveedor A', stockActual: 65, precio: 55.00 },
      { nombre: 'Proveedor D', stockActual: 50, precio: 52.75 },
    ]
  },
  {
    id: '7',
    nombre: 'Limón',
    proveedores: [
      { nombre: 'Proveedor B', stockActual: 220, precio: 15.50 },
      { nombre: 'Proveedor C', stockActual: 190, precio: 16.25 },
    ]
  },
  {
    id: '8',
    nombre: 'Naranja',
    proveedores: [
      { nombre: 'Proveedor A', stockActual: 170, precio: 14.75 },
      { nombre: 'Proveedor C', stockActual: 160, precio: 15.00 },
    ]
  },
  {
    id: '9',
    nombre: 'Menta',
    proveedores: [
      { nombre: 'Proveedor B', stockActual: 130, precio: 19.50 },
      { nombre: 'Proveedor D', stockActual: 95, precio: 21.00 },
    ]
  },
  {
    id: '10',
    nombre: 'Sándalo',
    proveedores: [
      { nombre: 'Proveedor A', stockActual: 40, precio: 75.00 },
      { nombre: 'Proveedor D', stockActual: 35, precio: 78.50 },
    ]
  }
];

// Movimientos iniciales vacíos (se llenarán con las operaciones del usuario)
export const movimientosIniciales: Movimiento[] = [];

// Función para generar ID único
export const generarId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Claves para localStorage
export const STORAGE_KEYS = {
  ESENCIAS: 'stock_esencias',
  MOVIMIENTOS: 'stock_movimientos'
};
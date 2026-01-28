'use client';

import { useState, useEffect } from 'react';

// Precios fijos para Uruguay (USD → UYU)
const PRECIOS_URUGUAY = {
  convertir: (precioUSD) => {
    const precio = parseFloat(precioUSD);
    if (precio <= 75) return 2500;
    if (precio <= 160) return 5500;
    if (precio <= 210) return 8000;
    if (precio <= 350) return 12500;
    if (precio <= 500) return 16500;
    if (precio <= 700) return 24500;
    if (precio <= 1100) return 39800;
    return 79800;
  }
};

// Monedas por país
const PAIS_MONEDA = {
  UY: { codigo: 'UYU', simbolo: '$', nombre: 'pesos uruguayos' },
  AR: { codigo: 'ARS', simbolo: '$', nombre: 'pesos argentinos' },
  MX: { codigo: 'MXN', simbolo: '$', nombre: 'pesos mexicanos' },
  CO: { codigo: 'COP', simbolo: '$', nombre: 'pesos colombianos' },
  CL: { codigo: 'CLP', simbolo: '$', nombre: 'pesos chilenos' },
  PE: { codigo: 'PEN', simbolo: 'S/', nombre: 'soles' },
  BR: { codigo: 'BRL', simbolo: 'R$', nombre: 'reales' },
  ES: { codigo: 'EUR', simbolo: '€', nombre: 'euros' },
  US: { codigo: 'USD', simbolo: '$', nombre: 'dólares' },
  EC: { codigo: 'USD', simbolo: '$', nombre: 'dólares' },
  PA: { codigo: 'USD', simbolo: '$', nombre: 'dólares' },
};

// Tasas de respaldo
const TASAS_FALLBACK = {
  ARS: 1250,
  MXN: 21,
  COP: 4500,
  CLP: 1020,
  PEN: 3.85,
  BRL: 6.4,
  EUR: 0.96,
  USD: 1,
};

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function formatearNumero(num) {
  return Math.round(num).toLocaleString('es-UY');
}

export default function PrecioProducto({ precioUSD, precioRegular, enOferta, className = '' }) {
  const [precioFormateado, setPrecioFormateado] = useState(null);
  const [precioRegularFormateado, setPrecioRegularFormateado] = useState(null);

  useEffect(() => {
    const paisCookie = getCookie('duendes_pais') || 'US';
    const precio = parseFloat(precioUSD);
    const regular = precioRegular ? parseFloat(precioRegular) : null;

    if (paisCookie === 'UY') {
      const precioUYU = PRECIOS_URUGUAY.convertir(precio);
      setPrecioFormateado(`$${formatearNumero(precioUYU)} UYU`);
      if (enOferta && regular) {
        setPrecioRegularFormateado(`$${formatearNumero(PRECIOS_URUGUAY.convertir(regular))} UYU`);
      }
    } else if (['US', 'EC', 'PA'].includes(paisCookie)) {
      setPrecioFormateado(`$${formatearNumero(precio)} USD`);
      if (enOferta && regular) {
        setPrecioRegularFormateado(`$${formatearNumero(regular)} USD`);
      }
    } else {
      const monedaInfo = PAIS_MONEDA[paisCookie];
      if (monedaInfo && monedaInfo.codigo !== 'USD') {
        const tasa = TASAS_FALLBACK[monedaInfo.codigo] || 1;
        const precioLocal = Math.round(precio * tasa);
        setPrecioFormateado(
          `$${formatearNumero(precio)} USD (aprox. ${monedaInfo.simbolo}${formatearNumero(precioLocal)} ${monedaInfo.nombre})`
        );
        if (enOferta && regular) {
          const regularLocal = Math.round(regular * tasa);
          setPrecioRegularFormateado(`$${formatearNumero(regular)} USD`);
        }
      } else {
        setPrecioFormateado(`$${formatearNumero(precio)} USD`);
        if (enOferta && regular) {
          setPrecioRegularFormateado(`$${formatearNumero(regular)} USD`);
        }
      }
    }
  }, [precioUSD, precioRegular, enOferta]);

  // SSR fallback
  if (!precioFormateado) {
    return (
      <div className={`flex items-baseline gap-3 ${className}`}>
        <span className="text-3xl font-serif text-stone-900">
          ${parseFloat(precioUSD).toLocaleString('es-UY')} USD
        </span>
        {enOferta && precioRegular && (
          <span className="text-lg text-stone-400 line-through">
            ${parseFloat(precioRegular).toLocaleString('es-UY')} USD
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-baseline gap-3 ${className}`}>
      <span className="text-3xl font-serif text-stone-900">
        {precioFormateado}
      </span>
      {enOferta && precioRegularFormateado && (
        <span className="text-lg text-stone-400 line-through">
          {precioRegularFormateado}
        </span>
      )}
    </div>
  );
}

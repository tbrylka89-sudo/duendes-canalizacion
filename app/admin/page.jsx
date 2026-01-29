'use client';

import { useState } from 'react';

const SECCIONES = [
  {
    titulo: '🎯 Ventas & Conversión',
    descripcion: 'Herramientas para vender más y mejor',
    tools: [
      {
        nombre: 'Panel de Tito',
        url: '/admin/tito',
        descripcion: 'Ver conversaciones, métricas y escalamientos del chatbot',
        estado: 'activo'
      },
      {
        nombre: 'Promociones',
        url: '/admin/promociones',
        descripcion: 'Crear y gestionar promociones, cupones y ofertas',
        estado: 'activo'
      },
      {
        nombre: 'Promos Automáticas',
        url: '/admin/promociones/automaticas',
        descripcion: 'Configurar promociones que se activan solas (carrito abandonado, cumpleaños)',
        estado: 'activo'
      },
      {
        nombre: 'Promos Relámpago',
        url: '/admin/promociones/relampago',
        descripcion: 'Crear ofertas flash de tiempo limitado',
        estado: 'activo'
      },
      {
        nombre: 'Stats de Promos',
        url: '/admin/promociones/stats',
        descripcion: 'Ver rendimiento de promociones activas',
        estado: 'activo'
      },
    ]
  },
  {
    titulo: '✨ Contenido & Productos',
    descripcion: 'Generar y gestionar contenido de guardianes',
    tools: [
      {
        nombre: 'Generador de Historias',
        url: '/admin/generador-historias',
        descripcion: 'Crear historias únicas para guardianes usando IA. Analiza imagen, hace encuesta, genera historia con scoring de conversión.',
        estado: 'activo',
        destacado: true
      },
      {
        nombre: 'Corregir Productos',
        url: '/admin/corregir-productos',
        descripcion: 'Editar fichas de productos en WooCommerce (descripciones, SEO, categorías)',
        estado: 'activo'
      },
      {
        nombre: 'Guardian Intelligence',
        url: '/admin/inteligencia',
        descripcion: 'IA que analiza y mejora automáticamente los productos (descripciones, SEO, cross-selling)',
        estado: 'activo'
      },
    ]
  },
  {
    titulo: '📜 Canalizaciones',
    descripcion: 'Sistema de mensajes personalizados post-compra',
    tools: [
      {
        nombre: 'Panel de Canalizaciones',
        url: '/admin/canalizaciones',
        descripcion: 'Ver canalizaciones pendientes, aprobar, editar y enviar',
        estado: 'activo',
        destacado: true
      },
    ]
  },
  {
    titulo: '🔮 El Círculo',
    descripcion: 'Membresía exclusiva (PAUSADO - en construcción)',
    tools: [
      {
        nombre: 'Panel Maestro',
        url: '/admin/circulo/maestro',
        descripcion: 'Control completo del Círculo: miembros, contenido, configuración',
        estado: 'construccion',
        destacado: true
      },
      {
        nombre: 'Generador de Contenido',
        url: '/admin/circulo/contenido',
        descripcion: 'Crear rituales, consejos diarios, mensajes de guardianes',
        estado: 'construccion'
      },
      {
        nombre: 'Calendario Editorial',
        url: '/admin/circulo/calendario',
        descripcion: 'Programar publicaciones por fecha',
        estado: 'construccion'
      },
      {
        nombre: 'Duende de la Semana',
        url: '/admin/circulo/duende-semana',
        descripcion: 'Rotar guardián destacado semanalmente',
        estado: 'construccion'
      },
    ]
  },
  {
    titulo: '🎮 Gamificación',
    descripcion: 'Sistema de puntos, runas y recompensas',
    tools: [
      {
        nombre: 'Panel Gamificación',
        url: '/admin/gamificacion',
        descripcion: 'Ver usuarios, dar runas, gestionar badges y recompensas',
        estado: 'activo'
      },
      {
        nombre: 'Comunidad',
        url: '/admin/comunidad',
        descripcion: 'Moderar foro, ver actividad, gestionar contenido de usuarios',
        estado: 'activo'
      },
      {
        nombre: 'Sugerencias',
        url: '/admin/sugerencias',
        descripcion: 'Ver sugerencias de usuarios para nuevos guardianes',
        estado: 'activo'
      },
    ]
  },
  {
    titulo: '⚡ Modo Dios',
    descripcion: 'Control total del sistema',
    tools: [
      {
        nombre: 'Modo Dios',
        url: '/admin/modo-dios',
        descripcion: 'Panel de control general: KV, estadísticas, diagnóstico, acciones masivas',
        estado: 'activo',
        destacado: true
      },
    ]
  },
];

const API_UTILES = [
  {
    nombre: 'Cotizaciones',
    url: '/api/cotizaciones',
    descripcion: 'Ver/actualizar tasas de cambio para precios internacionales',
    metodo: 'GET/POST'
  },
  {
    nombre: 'Certificado',
    url: '/api/certificado?order=NUMERO',
    descripcion: 'Generar certificado de guardián por número de orden',
    metodo: 'GET'
  },
  {
    nombre: 'Productos WooCommerce',
    url: '/api/tienda/productos',
    descripcion: 'Lista de productos de la tienda',
    metodo: 'GET'
  },
  {
    nombre: 'Tito Web (actual)',
    url: '/api/tito/gpt',
    descripcion: 'Endpoint activo del widget web - Híbrido GPT + Claude',
    metodo: 'POST',
    nota: 'Body: {"mensaje": "hola", "pais": "AR"}'
  },
  {
    nombre: 'Tito ManyChat (actual)',
    url: '/api/tito/mc-direct',
    descripcion: 'Endpoint activo para Instagram/Facebook vía ManyChat',
    metodo: 'POST',
    nota: 'Body: {"mensaje": "hola", "subscriber_id": "123"}'
  },
  {
    nombre: 'Webhooks WooCommerce',
    url: '/api/webhooks/woocommerce',
    descripcion: 'Sincronización automática con WooCommerce',
    metodo: 'POST'
  },
  {
    nombre: 'Escalamientos Tito',
    url: '/api/tito/escalamientos',
    descripcion: 'Ver conversaciones escaladas que requieren atención humana',
    metodo: 'GET'
  },
];

const PAGINAS_PUBLICAS = [
  {
    nombre: 'Mi Magia',
    url: '/mi-magia',
    descripcion: 'Portal post-compra para clientes (canalizaciones, historia del guardián)',
  },
  {
    nombre: 'Tienda Vercel',
    url: '/tienda',
    descripcion: 'Versión de la tienda en Vercel (alternativa a WooCommerce)',
  },
  {
    nombre: 'Círculo Landing',
    url: '/circulo-landing',
    descripcion: 'Página de captura para El Círculo',
  },
  {
    nombre: 'Login Mi Magia',
    url: '/mi-magia/login',
    descripcion: 'Acceso al portal con email',
  },
];

export default function AdminHub() {
  const [busqueda, setBusqueda] = useState('');

  const filtrar = (items) => {
    if (!busqueda) return items;
    return items.filter(item =>
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      color: '#fff',
      padding: '40px 20px',
      fontFamily: "'Cormorant Garamond', Georgia, serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '2.5rem',
            color: '#c9a227',
            marginBottom: '10px'
          }}>
            🏰 Hub de Administración
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
            Todas las herramientas ocultas de Duendes del Uruguay
          </p>

          {/* Buscador */}
          <input
            type="text"
            placeholder="🔍 Buscar herramienta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              marginTop: '20px',
              padding: '12px 20px',
              width: '100%',
              maxWidth: '400px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(201,162,39,0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
        </header>

        {/* Secciones principales */}
        {SECCIONES.map((seccion, idx) => {
          const toolsFiltradas = filtrar(seccion.tools);
          if (toolsFiltradas.length === 0) return null;

          return (
            <section key={idx} style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '1.5rem',
                color: '#c9a227',
                marginBottom: '8px',
                borderBottom: '1px solid rgba(201,162,39,0.3)',
                paddingBottom: '8px'
              }}>
                {seccion.titulo}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px', fontSize: '0.95rem' }}>
                {seccion.descripcion}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {toolsFiltradas.map((tool, tidx) => (
                  <a
                    key={tidx}
                    href={tool.url}
                    style={{
                      display: 'block',
                      padding: '20px',
                      background: tool.destacado
                        ? 'linear-gradient(135deg, rgba(201,162,39,0.2), rgba(201,162,39,0.05))'
                        : 'rgba(255,255,255,0.05)',
                      border: tool.destacado
                        ? '1px solid rgba(201,162,39,0.5)'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: '#fff',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#c9a227';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = tool.destacado
                        ? 'rgba(201,162,39,0.5)'
                        : 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1.1rem',
                        margin: 0,
                        color: tool.destacado ? '#c9a227' : '#fff'
                      }}>
                        {tool.nombre}
                      </h3>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        background: tool.estado === 'activo'
                          ? 'rgba(46,204,113,0.2)'
                          : 'rgba(241,196,15,0.2)',
                        color: tool.estado === 'activo'
                          ? '#2ecc71'
                          : '#f1c40f'
                      }}>
                        {tool.estado === 'activo' ? '● Activo' : '🚧 En construcción'}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.7)',
                      marginTop: '8px',
                      lineHeight: '1.4'
                    }}>
                      {tool.descripcion}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          );
        })}

        {/* APIs Útiles */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.5rem',
            color: '#c9a227',
            marginBottom: '8px',
            borderBottom: '1px solid rgba(201,162,39,0.3)',
            paddingBottom: '8px'
          }}>
            🔌 APIs Útiles
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px', fontSize: '0.95rem' }}>
            Endpoints que podés usar directamente
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {filtrar(API_UTILES).map((api, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px 20px',
                  borderBottom: idx < API_UTILES.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <code style={{
                  background: 'rgba(201,162,39,0.2)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#c9a227'
                }}>
                  {api.metodo}
                </code>
                <div style={{ flex: 1 }}>
                  <a
                    href={api.url}
                    target="_blank"
                    style={{ color: '#fff', textDecoration: 'none' }}
                  >
                    <code style={{ color: '#e8d48b' }}>{api.url}</code>
                  </a>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.6)',
                    margin: '4px 0 0 0'
                  }}>
                    {api.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Páginas Públicas */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.5rem',
            color: '#c9a227',
            marginBottom: '8px',
            borderBottom: '1px solid rgba(201,162,39,0.3)',
            paddingBottom: '8px'
          }}>
            🌐 Páginas en Vercel
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px', fontSize: '0.95rem' }}>
            Páginas públicas alojadas en Vercel (no en WordPress)
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '12px'
          }}>
            {filtrar(PAGINAS_PUBLICAS).map((pag, idx) => (
              <a
                key={idx}
                href={pag.url}
                target="_blank"
                style={{
                  display: 'block',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#fff'
                }}
              >
                <h3 style={{ fontSize: '1rem', margin: '0 0 4px 0' }}>{pag.nombre}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                  {pag.descripcion}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '40px 0',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.9rem'
        }}>
          <p>URL base: <code style={{ color: '#c9a227' }}>https://duendes-vercel.vercel.app</code></p>
          <p style={{ marginTop: '8px' }}>
            Ejemplo: <code style={{ color: '#e8d48b' }}>https://duendes-vercel.vercel.app/admin/generador-historias</code>
          </p>
        </footer>
      </div>
    </div>
  );
}

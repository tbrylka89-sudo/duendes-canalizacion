'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// INSIGHTS PAGE - APRENDIZAJES DE TITO
// ═══════════════════════════════════════════════════════════════

export default function InsightsPage() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState('insights');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/tito/memoria?tipo=resumen');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e) {
      console.error('Error cargando insights:', e);
    }
    setCargando(false);
  };

  const formatearNombre = (nombre) => {
    const nombres = {
      proteccion: 'Proteccion',
      abundancia: 'Abundancia',
      amor: 'Amor',
      sanacion: 'Sanacion',
      hogar: 'Hogar',
      regalo: 'Regalo',
      coleccion: 'Coleccion',
      precio: 'Precio alto',
      tiempo: 'Lo dejo para despues',
      envio: 'Dudas de envio',
      confianza: 'Confianza',
      tamano: 'Tamano',
      proceso_compra: 'Como comprar',
      precios: 'Precios',
      materiales: 'Materiales',
      reserva: 'Sistema de reserva',
      seguimiento: 'Seguimiento pedido',
      devolucion: 'Devoluciones',
      personalizado: 'Pedidos custom'
    };
    return nombres[nombre] || nombre;
  };

  if (cargando) {
    return (
      <div style={estilos.loading}>
        <div style={estilos.spinner}></div>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      {/* Header */}
      <div style={estilos.header}>
        <div>
          <h1 style={estilos.titulo}>Insights de Tito</h1>
          <p style={estilos.subtitulo}>
            Aprendizajes acumulados de {data?.global?.totalConversaciones || 0} conversaciones
          </p>
        </div>
        <button onClick={cargarDatos} style={estilos.refreshBtn}>
          &#8635; Actualizar
        </button>
      </div>

      {/* Stats globales */}
      <div style={estilos.statsGrid}>
        <div style={estilos.statCard}>
          <span style={estilos.statIcono}>💬</span>
          <div style={estilos.statValor}>{data?.global?.totalConversaciones || 0}</div>
          <div style={estilos.statLabel}>Conversaciones</div>
        </div>
        <div style={estilos.statCard}>
          <span style={estilos.statIcono}>📈</span>
          <div style={estilos.statValor}>{data?.global?.promedioIntencionCompra || 0}%</div>
          <div style={estilos.statLabel}>Intencion promedio</div>
        </div>
        <div style={estilos.statCard}>
          <span style={estilos.statIcono}>💬</span>
          <div style={estilos.statValor}>{data?.global?.promedioMensajes || 0}</div>
          <div style={estilos.statLabel}>Msgs/conversacion</div>
        </div>
        <div style={estilos.statCard}>
          <span style={estilos.statIcono}>😊</span>
          <div style={estilos.statValor}>
            {data?.global?.sentimientos ?
              Math.round((data.global.sentimientos.positivo || 0) /
                ((data.global.sentimientos.positivo || 0) + (data.global.sentimientos.neutral || 0) + (data.global.sentimientos.negativo || 0) || 1) * 100)
              : 0}%
          </div>
          <div style={estilos.statLabel}>Satisfaccion</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={estilos.tabs}>
        {[
          { id: 'insights', label: 'Insights', icono: '💡' },
          { id: 'intereses', label: 'Intereses', icono: '🎯' },
          { id: 'objeciones', label: 'Objeciones', icono: '⚠️' },
          { id: 'geografia', label: 'Geografia', icono: '🌎' },
          { id: 'conversaciones', label: 'Ultimas', icono: '📋' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              ...estilos.tab,
              ...(tab === t.id ? estilos.tabActivo : {})
            }}
          >
            {t.icono} {t.label}
          </button>
        ))}
      </div>

      {/* Contenido de tabs */}
      <div style={estilos.tabContent}>
        {/* TAB INSIGHTS */}
        {tab === 'insights' && (
          <div style={estilos.insightsGrid}>
            {(data?.insights || []).map((insight, i) => (
              <div key={i} style={estilos.insightCard}>
                <div style={estilos.insightHeader}>
                  <span style={estilos.insightIcono}>{insight.icono}</span>
                  <span style={estilos.insightTitulo}>{insight.titulo}</span>
                </div>
                <p style={estilos.insightTexto}>{insight.texto}</p>
                {insight.accion && (
                  <div style={estilos.insightAccion}>
                    <span style={estilos.accionLabel}>Accion sugerida:</span>
                    <span style={estilos.accionTexto}>{insight.accion}</span>
                  </div>
                )}
              </div>
            ))}
            {(!data?.insights || data.insights.length === 0) && (
              <div style={estilos.vacio}>
                Aun no hay suficientes conversaciones para generar insights.
                Espera unas cuantas interacciones con clientes.
              </div>
            )}
          </div>
        )}

        {/* TAB INTERESES */}
        {tab === 'intereses' && (
          <div style={estilos.listaGrid}>
            <div style={estilos.listaCard}>
              <h3 style={estilos.listaTitulo}>Que buscan</h3>
              {(data?.topIntereses || []).map((item, i) => (
                <div key={i} style={estilos.listaItem}>
                  <div style={estilos.listaRank}>#{i + 1}</div>
                  <div style={estilos.listaNombre}>{formatearNombre(item.nombre)}</div>
                  <div style={estilos.listaCantidad}>{item.cantidad}</div>
                  <div style={estilos.listaBar}>
                    <div style={{
                      ...estilos.listaBarFill,
                      width: `${(item.cantidad / (data.topIntereses[0]?.cantidad || 1)) * 100}%`
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={estilos.listaCard}>
              <h3 style={estilos.listaTitulo}>Preguntas frecuentes</h3>
              {(data?.topPreguntas || []).map((item, i) => (
                <div key={i} style={estilos.listaItem}>
                  <div style={estilos.listaRank}>#{i + 1}</div>
                  <div style={estilos.listaNombre}>{formatearNombre(item.nombre)}</div>
                  <div style={estilos.listaCantidad}>{item.cantidad}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB OBJECIONES */}
        {tab === 'objeciones' && (
          <div style={estilos.objecionesGrid}>
            {(data?.topObjeciones || []).map((obj, i) => {
              const soluciones = {
                precio: 'Reforzar el 30% de reserva y valor artesanal unico',
                tiempo: 'Crear urgencia con disponibilidad limitada',
                envio: 'Destacar DHL Express 5-10 dias',
                confianza: 'Mostrar testimonios y proceso artesanal',
                tamano: 'Agregar comparativas de tamano visuales',
                material: 'Explicar durabilidad porcelana fria',
                pago: 'Destacar metodos de pago disponibles'
              };
              return (
                <div key={i} style={estilos.objecionCard}>
                  <div style={estilos.objecionHeader}>
                    <span style={estilos.objecionRank}>#{i + 1}</span>
                    <span style={estilos.objecionNombre}>{formatearNombre(obj.nombre)}</span>
                    <span style={estilos.objecionCantidad}>{obj.cantidad} veces</span>
                  </div>
                  <div style={estilos.objecionSolucion}>
                    <span style={estilos.solucionLabel}>Como resolverla:</span>
                    <p style={estilos.solucionTexto}>{soluciones[obj.nombre] || 'Revisar respuestas de Tito'}</p>
                  </div>
                </div>
              );
            })}
            {(!data?.topObjeciones || data.topObjeciones.length === 0) && (
              <div style={estilos.vacio}>No hay objeciones registradas aun.</div>
            )}
          </div>
        )}

        {/* TAB GEOGRAFIA */}
        {tab === 'geografia' && (
          <div style={estilos.listaGrid}>
            <div style={estilos.listaCard}>
              <h3 style={estilos.listaTitulo}>Top paises</h3>
              {(data?.topPaises || []).map((pais, i) => (
                <div key={i} style={estilos.listaItem}>
                  <div style={estilos.listaRank}>#{i + 1}</div>
                  <div style={estilos.listaNombre}>{pais.nombre}</div>
                  <div style={estilos.listaCantidad}>{pais.visitas} visitas</div>
                  <div style={estilos.listaBar}>
                    <div style={{
                      ...estilos.listaBarFill,
                      width: `${(pais.visitas / (data.topPaises[0]?.visitas || 1)) * 100}%`
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={estilos.listaCard}>
              <h3 style={estilos.listaTitulo}>Horarios pico</h3>
              {(data?.horariosPico || []).map((h, i) => (
                <div key={i} style={estilos.listaItem}>
                  <div style={estilos.listaRank}>#{i + 1}</div>
                  <div style={estilos.listaNombre}>{h.rango}</div>
                  <div style={estilos.listaCantidad}>{h.conversaciones} chats</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONVERSACIONES */}
        {tab === 'conversaciones' && (
          <div style={estilos.conversacionesLista}>
            {(data?.ultimasConversaciones || []).map((conv, i) => (
              <div key={i} style={estilos.conversacionCard}>
                <div style={estilos.convHeader}>
                  <span style={estilos.convFecha}>
                    {new Date(conv.fecha).toLocaleDateString('es-UY', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span style={estilos.convPais}>{conv.pais}</span>
                  <span style={{
                    ...estilos.convIntencion,
                    background: conv.intencionCompra > 60 ? 'rgba(34, 197, 94, 0.15)' :
                               conv.intencionCompra > 35 ? 'rgba(245, 158, 11, 0.15)' :
                               'rgba(239, 68, 68, 0.1)',
                    color: conv.intencionCompra > 60 ? '#22c55e' :
                           conv.intencionCompra > 35 ? '#f59e0b' : '#ef4444'
                  }}>
                    {conv.intencionCompra}% intencion
                  </span>
                </div>
                <div style={estilos.convDetalles}>
                  {conv.intereses?.length > 0 && (
                    <div style={estilos.convTags}>
                      <span style={estilos.tagLabel}>Intereses:</span>
                      {conv.intereses.map((int, j) => (
                        <span key={j} style={estilos.tag}>{formatearNombre(int)}</span>
                      ))}
                    </div>
                  )}
                  {conv.objeciones?.length > 0 && (
                    <div style={estilos.convTags}>
                      <span style={estilos.tagLabel}>Objeciones:</span>
                      {conv.objeciones.map((obj, j) => (
                        <span key={j} style={{...estilos.tag, ...estilos.tagObjecion}}>{formatearNombre(obj)}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={estilos.convMeta}>
                  {conv.mensajes} mensajes | {Math.round((conv.duracion || 0) / 60)} min | {conv.sentimiento}
                </div>
              </div>
            ))}
            {(!data?.ultimasConversaciones || data.ultimasConversaciones.length === 0) && (
              <div style={estilos.vacio}>No hay conversaciones registradas aun.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #222',
    borderTopColor: '#C6A962',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  titulo: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  subtitulo: {
    color: '#666',
    fontSize: '14px'
  },
  refreshBtn: {
    padding: '10px 16px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer'
  },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center'
  },
  statIcono: {
    fontSize: '24px',
    marginBottom: '8px',
    display: 'block'
  },
  statValor: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  statLabel: {
    color: '#666',
    fontSize: '12px'
  },

  // Tabs
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: '1px solid #2a2a2a',
    paddingBottom: '16px'
  },
  tab: {
    padding: '10px 16px',
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabActivo: {
    background: 'rgba(198, 169, 98, 0.15)',
    borderColor: 'rgba(198, 169, 98, 0.4)',
    color: '#C6A962'
  },
  tabContent: {
    minHeight: '400px'
  },

  // Insights
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px'
  },
  insightCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px'
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  insightIcono: {
    fontSize: '28px'
  },
  insightTitulo: {
    color: '#C6A962',
    fontSize: '16px',
    fontWeight: '600'
  },
  insightTexto: {
    color: '#ccc',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '16px'
  },
  insightAccion: {
    background: '#0a0a0a',
    borderRadius: '8px',
    padding: '12px'
  },
  accionLabel: {
    color: '#888',
    fontSize: '11px',
    display: 'block',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  accionTexto: {
    color: '#22c55e',
    fontSize: '13px',
    fontWeight: '500'
  },

  // Listas
  listaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  },
  listaCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px'
  },
  listaTitulo: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px'
  },
  listaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #1f1f1f'
  },
  listaRank: {
    color: '#C6A962',
    fontWeight: '600',
    fontSize: '13px',
    minWidth: '30px'
  },
  listaNombre: {
    color: '#fff',
    fontSize: '14px',
    flex: 1
  },
  listaCantidad: {
    color: '#888',
    fontSize: '13px'
  },
  listaBar: {
    width: '80px',
    height: '6px',
    background: '#1f1f1f',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  listaBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #C6A962, #d4bc7d)',
    borderRadius: '3px'
  },

  // Objeciones
  objecionesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '16px'
  },
  objecionCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px'
  },
  objecionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  objecionRank: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: '14px'
  },
  objecionNombre: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    flex: 1
  },
  objecionCantidad: {
    color: '#888',
    fontSize: '13px'
  },
  objecionSolucion: {
    background: 'rgba(34, 197, 94, 0.05)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '8px',
    padding: '12px'
  },
  solucionLabel: {
    color: '#22c55e',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '4px'
  },
  solucionTexto: {
    color: '#ccc',
    fontSize: '13px',
    margin: 0,
    lineHeight: '1.5'
  },

  // Conversaciones
  conversacionesLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  conversacionCard: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '16px'
  },
  convHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  convFecha: {
    color: '#888',
    fontSize: '13px'
  },
  convPais: {
    color: '#C6A962',
    fontSize: '13px',
    fontWeight: '500'
  },
  convIntencion: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    marginLeft: 'auto'
  },
  convDetalles: {
    marginBottom: '10px'
  },
  convTags: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '8px'
  },
  tagLabel: {
    color: '#666',
    fontSize: '12px'
  },
  tag: {
    background: 'rgba(198, 169, 98, 0.15)',
    color: '#C6A962',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px'
  },
  tagObjecion: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444'
  },
  convMeta: {
    color: '#555',
    fontSize: '12px'
  },

  vacio: {
    textAlign: 'center',
    padding: '60px',
    color: '#555',
    fontSize: '14px'
  }
};

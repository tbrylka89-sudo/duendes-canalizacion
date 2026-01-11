'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// PALETA DE COLORES - CALENDARIO
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  bg: '#0a0a0f',
  bgCard: '#12121a',
  bgElevated: '#1a1a25',
  bgHover: '#22222f',
  border: '#2a2a3a',
  borderLight: '#3a3a4a',
  text: '#ffffff',
  textMuted: '#9ca3af',
  textDim: '#6b7280',

  // Calendario = Teal/Cyan
  primary: '#14B8A6',
  primaryLight: '#2DD4BF',
  primaryDark: '#0D9488',

  // Secundarios
  purple: '#8B5CF6',
  pink: '#EC4899',
  emerald: '#10B981',
  orange: '#F97316',
  amber: '#F59E0B',
  blue: '#3B82F6',
  gold: '#D4A853',

  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
};

// Colores por categoría
const CATEGORIA_COLORS = {
  duendes: { bg: '#F59E0B22', border: '#F59E0B', text: '#F59E0B' },
  luna: { bg: '#8B5CF622', border: '#8B5CF6', text: '#8B5CF6' },
  cristales: { bg: '#06B6D422', border: '#06B6D4', text: '#06B6D4' },
  proteccion: { bg: '#10B98122', border: '#10B981', text: '#10B981' },
  abundancia: { bg: '#D4A85322', border: '#D4A853', text: '#D4A853' },
  sanacion: { bg: '#EC489922', border: '#EC4899', text: '#EC4899' },
  tarot: { bg: '#A78BFA22', border: '#A78BFA', text: '#A78BFA' },
  rituales: { bg: '#F9731622', border: '#F97316', text: '#F97316' },
  autoconocimiento: { bg: '#3B82F622', border: '#3B82F6', text: '#3B82F6' },
};

// Días de la semana
const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DIAS_DISPLAY = {
  lunes: { nombre: 'Lunes', icono: '🌱', color: '#10B981' },
  martes: { nombre: 'Martes', icono: '📚', color: '#3B82F6' },
  miercoles: { nombre: 'Miércoles', icono: '🔮', color: '#8B5CF6' },
  jueves: { nombre: 'Jueves', icono: '🧙', color: '#F59E0B' },
  viernes: { nombre: 'Viernes', icono: '🌙', color: '#EC4899' },
  sabado: { nombre: 'Sábado', icono: '📖', color: '#06B6D4' },
  domingo: { nombre: 'Domingo', icono: '✨', color: '#D4A853' },
};

// Fases lunares
const FASES_LUNARES = [
  { id: 'nueva', nombre: 'Luna Nueva', icono: '🌑', color: '#1f2937' },
  { id: 'creciente', nombre: 'Luna Creciente', icono: '🌒', color: '#4B5563' },
  { id: 'llena', nombre: 'Luna Llena', icono: '🌕', color: '#F59E0B' },
  { id: 'menguante', nombre: 'Luna Menguante', icono: '🌘', color: '#6B7280' },
];

export default function CalendarioAdmin() {
  const [periodo, setPeriodo] = useState('semana');
  const [faseLunar, setFaseLunar] = useState('creciente');
  const [fechaInicio, setFechaInicio] = useState('');
  const [temasExcluir, setTemasExcluir] = useState('');
  const [enfoqueMes, setEnfoqueMes] = useState('');
  const [calendario, setCalendario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temasTrending, setTemasTrending] = useState(null);
  const [estructuraSemanal, setEstructuraSemanal] = useState(null);
  const [contenidoExpandido, setContenidoExpandido] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    // Fecha de hoy
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    setFechaInicio(`${yyyy}-${mm}-${dd}`);

    // Cargar temas trending y estructura
    fetch('/api/admin/calendario/generar')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTemasTrending(data.temasTrending);
          setEstructuraSemanal(data.estructuraSemanal);
        }
      })
      .catch(console.error);
  }, []);

  const generarCalendario = async () => {
    setLoading(true);
    setError(null);
    setCalendario(null);

    try {
      const response = await fetch('/api/admin/calendario/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodo,
          fechaInicio,
          faseLunar,
          temasExcluir: temasExcluir.split(',').map(t => t.trim()).filter(Boolean),
          enfoqueMes: enfoqueMes || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCalendario(data.calendario);
      } else {
        setError(data.error || 'Error al generar calendario');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copiarJSON = () => {
    if (calendario) {
      navigator.clipboard.writeText(JSON.stringify(calendario, null, 2));
    }
  };

  const exportarMarkdown = () => {
    if (!calendario) return;

    let md = `# Calendario de Contenido - El Círculo\n\n`;

    if (periodo === 'semana') {
      md += `## Semana del ${calendario.semana}\n`;
      md += `**Fase Lunar:** ${calendario.faseLunar}\n\n`;
      md += `---\n\n`;

      calendario.contenidos?.forEach(c => {
        md += `### ${DIAS_DISPLAY[c.dia]?.icono || ''} ${DIAS_DISPLAY[c.dia]?.nombre || c.dia} - ${c.fecha}\n\n`;
        md += `**${c.titulo}**\n\n`;
        md += `- Categoría: ${c.categoria}\n`;
        md += `- Tipo: ${c.tipo}\n`;
        md += `- ${c.descripcion}\n\n`;
        md += `> "${c.gancho}"\n\n`;
        md += `*${c.porQueHoy}*\n\n`;
        md += `---\n\n`;
      });

      md += `## Resumen\n`;
      md += `- **Tema destacado:** ${calendario.temaDestacado}\n`;
      md += `- **Hilo conector:** ${calendario.hiloConector}\n`;
    } else {
      // Mes
      md += `## ${calendario.mes}\n`;
      md += `**Tema del mes:** ${calendario.temaDelMes}\n\n`;
      md += `*${calendario.porQueEsteTema}*\n\n`;
      md += `---\n\n`;

      calendario.semanas?.forEach(semana => {
        md += `### Semana ${semana.numero}: ${semana.miniTema}\n\n`;
        semana.contenidos?.forEach(c => {
          md += `**${DIAS_DISPLAY[c.dia]?.nombre || c.dia}** - ${c.titulo}\n`;
          md += `${c.descripcion}\n\n`;
        });
        md += `---\n\n`;
      });

      if (calendario.contenidoEspecial) {
        md += `## Contenido Especial\n`;
        md += `**${calendario.contenidoEspecial.titulo}**\n`;
        md += `${calendario.contenidoEspecial.descripcion}\n\n`;
      }
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendario-${periodo}-${fechaInicio}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      color: COLORS.text,
      padding: '24px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
          }}>
            Calendario de Contenido
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>
            Generador automático de planes semanales y mensuales para El Círculo
          </p>
        </div>

        <a
          href="/admin"
          style={{
            padding: '10px 20px',
            background: COLORS.bgElevated,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            color: COLORS.textMuted,
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          ← Volver al Admin
        </a>
      </div>

      {/* Controles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}>
        {/* Periodo */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            color: COLORS.textMuted,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Período a generar
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { id: 'semana', nombre: 'Semana', icono: '📅' },
              { id: 'mes', nombre: 'Mes completo', icono: '🗓️' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPeriodo(p.id)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: periodo === p.id ? `${COLORS.primary}22` : COLORS.bgElevated,
                  border: `2px solid ${periodo === p.id ? COLORS.primary : COLORS.border}`,
                  borderRadius: '10px',
                  color: periodo === p.id ? COLORS.primary : COLORS.text,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '15px',
                  fontWeight: periodo === p.id ? '600' : '400',
                }}
              >
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>
                  {p.icono}
                </span>
                {p.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Fecha y Fase Lunar */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            color: COLORS.textMuted,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Fecha de inicio
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: COLORS.bgElevated,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              color: COLORS.text,
              fontSize: '15px',
              marginBottom: '16px',
            }}
          />

          <label style={{
            display: 'block',
            marginBottom: '12px',
            color: COLORS.textMuted,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Fase lunar actual
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {FASES_LUNARES.map(fase => (
              <button
                key={fase.id}
                onClick={() => setFaseLunar(fase.id)}
                title={fase.nombre}
                style={{
                  padding: '12px 8px',
                  background: faseLunar === fase.id ? `${COLORS.primary}22` : COLORS.bgElevated,
                  border: `2px solid ${faseLunar === fase.id ? COLORS.primary : COLORS.border}`,
                  borderRadius: '8px',
                  color: COLORS.text,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '20px',
                }}
              >
                {fase.icono}
              </button>
            ))}
          </div>
        </div>

        {/* Opciones adicionales */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            color: COLORS.textMuted,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Temas a excluir (separados por coma)
          </label>
          <input
            type="text"
            value={temasExcluir}
            onChange={(e) => setTemasExcluir(e.target.value)}
            placeholder="luna llena, cristales, tarot..."
            style={{
              width: '100%',
              padding: '12px',
              background: COLORS.bgElevated,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              color: COLORS.text,
              fontSize: '14px',
              marginBottom: '16px',
            }}
          />

          {periodo === 'mes' && (
            <>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                color: COLORS.textMuted,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Enfoque del mes (opcional)
              </label>
              <input
                type="text"
                value={enfoqueMes}
                onChange={(e) => setEnfoqueMes(e.target.value)}
                placeholder="Ej: Abundancia y prosperidad"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: COLORS.bgElevated,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  color: COLORS.text,
                  fontSize: '14px',
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Botón Generar */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <button
          onClick={generarCalendario}
          disabled={loading}
          style={{
            padding: '16px 48px',
            background: loading
              ? COLORS.bgElevated
              : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            boxShadow: loading ? 'none' : `0 4px 20px ${COLORS.primary}40`,
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              Generando calendario...
            </>
          ) : (
            <>
              <span style={{ fontSize: '20px' }}>✨</span>
              Generar Calendario
            </>
          )}
        </button>

        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '16px 20px',
          background: `${COLORS.error}15`,
          border: `1px solid ${COLORS.error}40`,
          borderRadius: '12px',
          color: COLORS.error,
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          {error}
        </div>
      )}

      {/* Resultado - Semana */}
      {calendario && periodo === 'semana' && (
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {/* Header del calendario */}
          <div style={{
            padding: '24px',
            background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.primaryDark}15)`,
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}>
                Semana del {calendario.semana}
              </h2>
              <div style={{ display: 'flex', gap: '16px', color: COLORS.textMuted }}>
                <span>
                  {FASES_LUNARES.find(f => f.id === calendario.faseLunar)?.icono} {' '}
                  {FASES_LUNARES.find(f => f.id === calendario.faseLunar)?.nombre}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={copiarJSON}
                style={{
                  padding: '10px 16px',
                  background: COLORS.bgElevated,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  color: COLORS.text,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                📋 Copiar JSON
              </button>
              <button
                onClick={exportarMarkdown}
                style={{
                  padding: '10px 16px',
                  background: COLORS.primary,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                📥 Exportar MD
              </button>
            </div>
          </div>

          {/* Grid de días */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1px',
            background: COLORS.border,
          }}>
            {calendario.contenidos?.map((contenido, idx) => {
              const diaInfo = DIAS_DISPLAY[contenido.dia] || {};
              const catColor = CATEGORIA_COLORS[contenido.categoria] || { bg: COLORS.bgElevated, border: COLORS.border, text: COLORS.text };
              const isExpanded = contenidoExpandido === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setContenidoExpandido(isExpanded ? null : idx)}
                  style={{
                    background: COLORS.bgCard,
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = COLORS.bgElevated}
                  onMouseLeave={(e) => e.currentTarget.style.background = COLORS.bgCard}
                >
                  {/* Header del día */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '24px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `${diaInfo.color}22`,
                        borderRadius: '10px',
                      }}>
                        {diaInfo.icono}
                      </span>
                      <div>
                        <div style={{
                          fontWeight: '600',
                          color: diaInfo.color,
                          fontSize: '15px',
                        }}>
                          {diaInfo.nombre}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: COLORS.textDim,
                        }}>
                          {contenido.fecha}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      background: catColor.bg,
                      border: `1px solid ${catColor.border}`,
                      borderRadius: '20px',
                      fontSize: '11px',
                      color: catColor.text,
                      fontWeight: '500',
                    }}>
                      {contenido.categoria}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '10px',
                    lineHeight: '1.4',
                  }}>
                    {contenido.titulo}
                  </h3>

                  {/* Tipo */}
                  <div style={{
                    fontSize: '12px',
                    color: COLORS.textMuted,
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {contenido.tipo}
                  </div>

                  {/* Descripción */}
                  <p style={{
                    fontSize: '14px',
                    color: COLORS.textMuted,
                    marginBottom: '12px',
                    lineHeight: '1.5',
                  }}>
                    {contenido.descripcion}
                  </p>

                  {/* Expandido */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: `1px solid ${COLORS.border}`,
                    }}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{
                          fontSize: '12px',
                          color: COLORS.primary,
                          marginBottom: '6px',
                          fontWeight: '600',
                        }}>
                          GANCHO (Primera frase)
                        </div>
                        <p style={{
                          fontSize: '15px',
                          color: COLORS.text,
                          fontStyle: 'italic',
                          lineHeight: '1.5',
                          padding: '12px',
                          background: COLORS.bgElevated,
                          borderRadius: '8px',
                          borderLeft: `3px solid ${COLORS.primary}`,
                        }}>
                          "{contenido.gancho}"
                        </p>
                      </div>

                      <div>
                        <div style={{
                          fontSize: '12px',
                          color: COLORS.textMuted,
                          marginBottom: '6px',
                          fontWeight: '600',
                        }}>
                          ¿POR QUÉ ESTE DÍA?
                        </div>
                        <p style={{
                          fontSize: '14px',
                          color: COLORS.textMuted,
                          lineHeight: '1.5',
                        }}>
                          {contenido.porQueHoy}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Indicador expandir */}
                  <div style={{
                    textAlign: 'center',
                    marginTop: '12px',
                    color: COLORS.textDim,
                    fontSize: '12px',
                  }}>
                    {isExpanded ? '▲ Menos' : '▼ Ver más'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen */}
          {(calendario.temaDestacado || calendario.hiloConector) && (
            <div style={{
              padding: '24px',
              borderTop: `1px solid ${COLORS.border}`,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
            }}>
              {calendario.temaDestacado && (
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: COLORS.primary,
                    marginBottom: '8px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}>
                    Tema Destacado de la Semana
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.5' }}>
                    {calendario.temaDestacado}
                  </p>
                </div>
              )}
              {calendario.hiloConector && (
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: COLORS.textMuted,
                    marginBottom: '8px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}>
                    Hilo Conector
                  </div>
                  <p style={{ fontSize: '15px', color: COLORS.textMuted, lineHeight: '1.5' }}>
                    {calendario.hiloConector}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Resultado - Mes */}
      {calendario && periodo === 'mes' && (
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {/* Header del mes */}
          <div style={{
            padding: '24px',
            background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.primaryDark}15)`,
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}>
                  {calendario.mes}
                </h2>
                <div style={{
                  fontSize: '18px',
                  color: COLORS.primary,
                  fontWeight: '500',
                  marginBottom: '12px',
                }}>
                  {calendario.temaDelMes}
                </div>
                <p style={{ color: COLORS.textMuted, maxWidth: '600px' }}>
                  {calendario.porQueEsteTema}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={copiarJSON}
                  style={{
                    padding: '10px 16px',
                    background: COLORS.bgElevated,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    color: COLORS.text,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  📋 Copiar JSON
                </button>
                <button
                  onClick={exportarMarkdown}
                  style={{
                    padding: '10px 16px',
                    background: COLORS.primary,
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  📥 Exportar MD
                </button>
              </div>
            </div>
          </div>

          {/* Semanas */}
          <div style={{ padding: '24px' }}>
            {calendario.semanas?.map((semana, sIdx) => (
              <div
                key={sIdx}
                style={{
                  marginBottom: '32px',
                  paddingBottom: '32px',
                  borderBottom: sIdx < calendario.semanas.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                }}>
                  <span style={{
                    width: '40px',
                    height: '40px',
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                  }}>
                    {semana.numero}
                  </span>
                  <div>
                    <div style={{ fontSize: '12px', color: COLORS.textDim }}>
                      Semana {semana.numero}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>
                      {semana.miniTema}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                }}>
                  {semana.contenidos?.map((contenido, cIdx) => {
                    const diaInfo = DIAS_DISPLAY[contenido.dia] || {};
                    const catColor = CATEGORIA_COLORS[contenido.categoria] || { bg: COLORS.bgElevated, border: COLORS.border, text: COLORS.text };

                    return (
                      <div
                        key={cIdx}
                        style={{
                          background: COLORS.bgElevated,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: '12px',
                          padding: '16px',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <span style={{ fontSize: '18px' }}>{diaInfo.icono}</span>
                            <span style={{
                              fontWeight: '600',
                              color: diaInfo.color,
                              fontSize: '14px',
                            }}>
                              {diaInfo.nombre}
                            </span>
                          </div>
                          <span style={{
                            padding: '3px 8px',
                            background: catColor.bg,
                            border: `1px solid ${catColor.border}`,
                            borderRadius: '12px',
                            fontSize: '10px',
                            color: catColor.text,
                          }}>
                            {contenido.categoria}
                          </span>
                        </div>

                        <h4 style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          lineHeight: '1.4',
                        }}>
                          {contenido.titulo}
                        </h4>

                        <p style={{
                          fontSize: '13px',
                          color: COLORS.textMuted,
                          lineHeight: '1.5',
                        }}>
                          {contenido.descripcion}
                        </p>

                        {contenido.gancho && (
                          <p style={{
                            marginTop: '12px',
                            fontSize: '12px',
                            color: COLORS.primary,
                            fontStyle: 'italic',
                            borderLeft: `2px solid ${COLORS.primary}`,
                            paddingLeft: '10px',
                          }}>
                            "{contenido.gancho}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contenido Especial */}
          {calendario.contenidoEspecial && (
            <div style={{
              margin: '0 24px 24px',
              padding: '24px',
              background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.amber}15)`,
              border: `1px solid ${COLORS.gold}40`,
              borderRadius: '12px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '28px' }}>⭐</span>
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: COLORS.gold,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '4px',
                  }}>
                    Contenido Especial del Mes
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {calendario.contenidoEspecial.titulo}
                  </h3>
                </div>
              </div>
              <p style={{ color: COLORS.textMuted, marginBottom: '12px' }}>
                {calendario.contenidoEspecial.descripcion}
              </p>
              {calendario.contenidoEspecial.porQueEspecial && (
                <p style={{
                  fontSize: '14px',
                  color: COLORS.gold,
                  fontStyle: 'italic',
                }}>
                  {calendario.contenidoEspecial.porQueEspecial}
                </p>
              )}
            </div>
          )}

          {/* Anticipo próximo mes */}
          {calendario.proximoMesAnticipo && (
            <div style={{
              padding: '20px 24px',
              borderTop: `1px solid ${COLORS.border}`,
              background: COLORS.bgElevated,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <span style={{ fontSize: '20px' }}>👀</span>
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: COLORS.textDim,
                    marginBottom: '4px',
                  }}>
                    Próximo mes...
                  </div>
                  <p style={{ color: COLORS.textMuted }}>
                    {calendario.proximoMesAnticipo}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Temas Trending - Info */}
      {temasTrending && !calendario && (
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '16px',
          padding: '24px',
          marginTop: '32px',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span>🔥</span> Temas Trending Disponibles
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
          }}>
            {Object.entries(temasTrending).map(([cat, temas]) => {
              const catColor = CATEGORIA_COLORS[cat] || { bg: COLORS.bgElevated, border: COLORS.border, text: COLORS.textMuted };

              return (
                <div
                  key={cat}
                  style={{
                    background: COLORS.bgElevated,
                    border: `1px solid ${catColor.border}40`,
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: catColor.text,
                    marginBottom: '12px',
                    textTransform: 'capitalize',
                  }}>
                    {cat}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: COLORS.textDim,
                    lineHeight: '1.8',
                  }}>
                    {temas.slice(0, 5).map((tema, idx) => (
                      <div key={idx}>• {tema}</div>
                    ))}
                    {temas.length > 5 && (
                      <div style={{ color: COLORS.textMuted, marginTop: '4px' }}>
                        +{temas.length - 5} más...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

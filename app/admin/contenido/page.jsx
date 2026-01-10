'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════

const CATEGORIAS = [
  { id: 'cosmos', nombre: 'Cosmos y Luna', icono: '🌙', temas: ['Fases lunares', 'Eclipses', 'Astrologia', 'Rituales lunares', 'Planetas y energia'] },
  { id: 'duendes', nombre: 'Mundo Duende', icono: '🧙', temas: ['Historia de los duendes', 'Tipos de guardianes', 'Comunicacion elemental', 'Rituales de conexion'] },
  { id: 'diy', nombre: 'DIY Magico', icono: '✂️', temas: ['Velas rituales', 'Altares caseros', 'Amuletos', 'Decoracion magica', 'Herramientas rituales'] },
  { id: 'esoterico', nombre: 'Esoterico', icono: '🔮', temas: ['Tarot', 'Runas', 'Cristales', 'Numerologia', 'Simbolos sagrados'] },
  { id: 'sanacion', nombre: 'Sanacion', icono: '💚', temas: ['Chakras', 'Limpieza energetica', 'Meditacion', 'Hierbas', 'Cristaloterapia'] },
  { id: 'celebraciones', nombre: 'Celebraciones', icono: '🎉', temas: ['Sabbats', 'Lunas especiales', 'Solsticios', 'Equinoccios', 'Festividades paganas'] }
];

const TIPOS = [
  { id: 'articulo', nombre: 'Articulo', desc: 'Texto educativo o informativo extenso' },
  { id: 'guia', nombre: 'Guia Practica', desc: 'Paso a paso detallado' },
  { id: 'ritual', nombre: 'Ritual', desc: 'Ritual completo con instrucciones' },
  { id: 'meditacion', nombre: 'Meditacion', desc: 'Guia de meditacion escrita' },
  { id: 'diy', nombre: 'DIY/Tutorial', desc: 'Proyecto para hacer en casa' },
  { id: 'lectura', nombre: 'Lectura Colectiva', desc: 'Mensaje para todos los miembros' }
];

const LONGITUDES = [
  { id: 1500, nombre: 'Corto', desc: '~1500 palabras' },
  { id: 3000, nombre: 'Medio', desc: '~3000 palabras' },
  { id: 5000, nombre: 'Largo', desc: '~5000 palabras' }
];

// ═══════════════════════════════════════════════════════════════
// CONTENIDO PAGE
// ═══════════════════════════════════════════════════════════════

export default function ContenidoPage() {
  const [categoria, setCategoria] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [tema, setTema] = useState('');
  const [temaCustom, setTemaCustom] = useState('');
  const [longitud, setLongitud] = useState(3000);
  const [generando, setGenerando] = useState(false);
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);

  const temaFinal = temaCustom || tema;

  const generar = async () => {
    if (!categoria || !tipo || !temaFinal) {
      setError('Completa todos los campos');
      return;
    }

    setGenerando(true);
    setError('');
    setContenido('');

    try {
      const res = await fetch('/api/admin/contenido/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoria: categoria.id,
          tipo: tipo.id,
          tema: temaFinal,
          longitud
        })
      });

      const data = await res.json();
      if (data.success) {
        setContenido(data.contenido);
      } else {
        setError(data.error || 'Error al generar contenido');
      }
    } catch (e) {
      setError('Error de conexion');
    }
    setGenerando(false);
  };

  const copiar = () => {
    navigator.clipboard.writeText(contenido);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const limpiar = () => {
    setCategoria(null);
    setTipo(null);
    setTema('');
    setTemaCustom('');
    setContenido('');
    setError('');
  };

  return (
    <div style={estilos.container}>
      {/* Header */}
      <div style={estilos.header}>
        <h1 style={estilos.titulo}>📝 Contenido</h1>
        <p style={estilos.subtitulo}>Genera articulos con IA para el Circulo</p>
      </div>

      {contenido ? (
        // Vista de resultado
        <div style={estilos.resultado}>
          <div style={estilos.resultadoHeader}>
            <h3 style={estilos.resultadoTitulo}>Contenido generado</h3>
            <div style={estilos.resultadoAcciones}>
              <button onClick={copiar} style={estilos.accionBtn}>
                {copiado ? '✓ Copiado' : '📋 Copiar'}
              </button>
              <button onClick={limpiar} style={estilos.accionBtnSecundario}>
                ✨ Nuevo
              </button>
            </div>
          </div>
          <div style={estilos.contenidoPreview}>
            <pre style={estilos.contenidoTexto}>{contenido}</pre>
          </div>
          <div style={estilos.contenidoInfo}>
            <span>~{contenido.split(/\s+/).length} palabras</span>
            <span>•</span>
            <span>{categoria?.nombre}</span>
            <span>•</span>
            <span>{tipo?.nombre}</span>
          </div>
        </div>
      ) : (
        // Formulario de generacion
        <div style={estilos.formulario}>
          {/* Paso 1: Categoria */}
          <div style={estilos.paso}>
            <h3 style={estilos.pasoTitulo}>1. Categoria</h3>
            <div style={estilos.categoriaGrid}>
              {CATEGORIAS.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => { setCategoria(cat); setTema(''); }}
                  style={{
                    ...estilos.categoriaCard,
                    ...(categoria?.id === cat.id ? estilos.categoriaCardActiva : {})
                  }}
                >
                  <span style={estilos.categoriaIcono}>{cat.icono}</span>
                  <span style={estilos.categoriaNombre}>{cat.nombre}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Paso 2: Tipo */}
          <div style={estilos.paso}>
            <h3 style={estilos.pasoTitulo}>2. Tipo de contenido</h3>
            <div style={estilos.tipoGrid}>
              {TIPOS.map(t => (
                <div
                  key={t.id}
                  onClick={() => setTipo(t)}
                  style={{
                    ...estilos.tipoCard,
                    ...(tipo?.id === t.id ? estilos.tipoCardActivo : {})
                  }}
                >
                  <span style={estilos.tipoNombre}>{t.nombre}</span>
                  <span style={estilos.tipoDesc}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Paso 3: Tema */}
          <div style={estilos.paso}>
            <h3 style={estilos.pasoTitulo}>3. Tema</h3>
            {categoria && (
              <div style={estilos.temasSugeridos}>
                <span style={estilos.temasLabel}>Sugerencias:</span>
                {categoria.temas.map(t => (
                  <button
                    key={t}
                    onClick={() => { setTema(t); setTemaCustom(''); }}
                    style={{
                      ...estilos.temaBtn,
                      ...(tema === t ? estilos.temaBtnActivo : {})
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder="O escribe tu propio tema..."
              value={temaCustom}
              onChange={e => { setTemaCustom(e.target.value); setTema(''); }}
              style={estilos.input}
            />
          </div>

          {/* Paso 4: Longitud */}
          <div style={estilos.paso}>
            <h3 style={estilos.pasoTitulo}>4. Longitud</h3>
            <div style={estilos.longitudGrid}>
              {LONGITUDES.map(l => (
                <div
                  key={l.id}
                  onClick={() => setLongitud(l.id)}
                  style={{
                    ...estilos.longitudCard,
                    ...(longitud === l.id ? estilos.longitudCardActiva : {})
                  }}
                >
                  <span style={estilos.longitudNombre}>{l.nombre}</span>
                  <span style={estilos.longitudDesc}>{l.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={estilos.error}>{error}</div>
          )}

          {/* Boton generar */}
          <button
            onClick={generar}
            disabled={generando || !categoria || !tipo || !temaFinal}
            style={{
              ...estilos.generarBtn,
              ...(generando || !categoria || !tipo || !temaFinal ? estilos.generarBtnDisabled : {})
            }}
          >
            {generando ? (
              <>
                <span style={estilos.spinner}></span>
                Generando... (esto puede tardar 1-2 minutos)
              </>
            ) : (
              <>✨ Generar contenido</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = {
  container: {
    maxWidth: '900px',
    margin: '0 auto'
  },

  // Header
  header: {
    marginBottom: '32px'
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

  // Formulario
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },

  // Paso
  paso: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '24px'
  },
  pasoTitulo: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px'
  },

  // Categorias
  categoriaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px'
  },
  categoriaCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  categoriaCardActiva: {
    background: 'rgba(198, 169, 98, 0.1)',
    borderColor: 'rgba(198, 169, 98, 0.4)'
  },
  categoriaIcono: {
    fontSize: '28px'
  },
  categoriaNombre: {
    color: '#ccc',
    fontSize: '13px',
    textAlign: 'center'
  },

  // Tipos
  tipoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px'
  },
  tipoCard: {
    padding: '16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tipoCardActivo: {
    background: 'rgba(198, 169, 98, 0.1)',
    borderColor: 'rgba(198, 169, 98, 0.4)'
  },
  tipoNombre: {
    display: 'block',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px'
  },
  tipoDesc: {
    color: '#666',
    fontSize: '12px'
  },

  // Temas
  temasSugeridos: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
    alignItems: 'center'
  },
  temasLabel: {
    color: '#666',
    fontSize: '13px'
  },
  temaBtn: {
    padding: '8px 14px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '20px',
    color: '#888',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  temaBtnActivo: {
    background: 'rgba(198, 169, 98, 0.15)',
    borderColor: 'rgba(198, 169, 98, 0.4)',
    color: '#C6A962'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none'
  },

  // Longitud
  longitudGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  longitudCard: {
    padding: '16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  longitudCardActiva: {
    background: 'rgba(198, 169, 98, 0.1)',
    borderColor: 'rgba(198, 169, 98, 0.4)'
  },
  longitudNombre: {
    display: 'block',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '4px'
  },
  longitudDesc: {
    color: '#666',
    fontSize: '12px'
  },

  // Error
  error: {
    padding: '14px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '14px'
  },

  // Boton generar
  generarBtn: {
    padding: '18px 32px',
    background: 'linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0a0a0a',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  generarBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTopColor: '#0a0a0a',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  // Resultado
  resultado: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  resultadoHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  resultadoTitulo: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600'
  },
  resultadoAcciones: {
    display: 'flex',
    gap: '10px'
  },
  accionBtn: {
    padding: '10px 16px',
    background: '#C6A962',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0a0a',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  accionBtnSecundario: {
    padding: '10px 16px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#ccc',
    fontSize: '13px',
    cursor: 'pointer'
  },
  contenidoPreview: {
    padding: '24px',
    maxHeight: '60vh',
    overflowY: 'auto'
  },
  contenidoTexto: {
    color: '#ccc',
    fontSize: '15px',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit'
  },
  contenidoInfo: {
    padding: '16px 24px',
    borderTop: '1px solid #2a2a2a',
    display: 'flex',
    gap: '12px',
    color: '#666',
    fontSize: '13px'
  }
};

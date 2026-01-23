'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// TEST DE PERFILADO - Conocerte para personalizar tu experiencia
// ═══════════════════════════════════════════════════════════════════════════════

function PerfiladoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [datosAdicionales, setDatosAdicionales] = useState({
    nombre: '',
    fechaNacimiento: '',
    genero: ''
  });
  const [fase, setFase] = useState('cargando');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (emailParam) {
      setEmail(emailParam);
    }

    cargarPreguntas(emailParam);
  }, [searchParams]);

  const cargarPreguntas = async (emailParam) => {
    try {
      const url = emailParam
        ? `/api/mi-magia/perfilado?email=${encodeURIComponent(emailParam)}`
        : '/api/mi-magia/perfilado';

      const res = await fetch(url);
      const data = await res.json();

      if (data.yaCompletado) {
        setFase('completado');
        return;
      }

      setPreguntas(data.preguntas || []);
      setFase('datos');
    } catch (err) {
      setError('Error cargando el test');
      setFase('error');
    }
  };

  const handleDatosSubmit = () => {
    if (!datosAdicionales.nombre.trim()) {
      setError('Tu nombre es importante para personalizar tu experiencia');
      return;
    }
    setError(null);
    setFase('preguntas');
  };

  const handleRespuesta = (preguntaId, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor
    }));

    setTimeout(() => {
      if (preguntaActual < preguntas.length - 1) {
        setPreguntaActual(prev => prev + 1);
      } else {
        enviarRespuestas();
      }
    }, 300);
  };

  const enviarRespuestas = async () => {
    setFase('enviando');

    try {
      const res = await fetch('/api/mi-magia/perfilado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          respuestas,
          datosAdicionales
        })
      });

      const data = await res.json();

      if (data.success) {
        setFase('completado');
        setTimeout(() => {
          const token = searchParams.get('token');
          router.push(token ? `/mi-magia?token=${token}` : '/mi-magia');
        }, 3000);
      } else {
        setError(data.error);
        setFase('error');
      }
    } catch (err) {
      setError('Error guardando tus respuestas');
      setFase('error');
    }
  };

  const pregunta = preguntas[preguntaActual];
  const progreso = preguntas.length > 0 ? ((preguntaActual + 1) / preguntas.length) * 100 : 0;

  return (
    <div style={{
      background: 'rgba(26, 26, 46, 0.95)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '500px',
      width: '100%'
    }}>

      {/* CARGANDO */}
      {fase === 'cargando' && (
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p style={{ color: '#a0a0a0' }}>Preparando tu experiencia...</p>
        </div>
      )}

      {/* DATOS INICIALES */}
      {fase === 'datos' && (
        <>
          <h2 style={{ color: '#d4af37', textAlign: 'center', marginBottom: '10px' }}>
            Antes de empezar...
          </h2>
          <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '30px' }}>
            Contanos un poco sobre vos para personalizar tu experiencia
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#d4af37', marginBottom: '8px', fontSize: '14px' }}>
              ¿Cómo te llamás? *
            </label>
            <input
              type="text"
              value={datosAdicionales.nombre}
              onChange={(e) => setDatosAdicionales(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Tu nombre"
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '10px',
                color: '#f5f5dc',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#d4af37', marginBottom: '8px', fontSize: '14px' }}>
              Fecha de nacimiento (opcional, para tu carta astral)
            </label>
            <input
              type="date"
              value={datosAdicionales.fechaNacimiento}
              onChange={(e) => setDatosAdicionales(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '10px',
                color: '#f5f5dc',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: '#d4af37', marginBottom: '12px', fontSize: '14px' }}>
              ¿Cómo preferís que te hablemos?
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { valor: 'ella', texto: 'Ella (femenino)' },
                { valor: 'el', texto: 'Él (masculino)' },
                { valor: 'neutro', texto: 'Neutro' }
              ].map(opcion => (
                <button
                  key={opcion.valor}
                  onClick={() => setDatosAdicionales(prev => ({ ...prev, genero: opcion.valor }))}
                  style={{
                    flex: '1',
                    minWidth: '100px',
                    padding: '12px',
                    background: datosAdicionales.genero === opcion.valor
                      ? 'linear-gradient(135deg, #d4af37, #f4d03f)'
                      : 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '10px',
                    color: datosAdicionales.genero === opcion.valor ? '#1a1a1a' : '#f5f5dc',
                    cursor: 'pointer',
                    fontWeight: datosAdicionales.genero === opcion.valor ? 'bold' : 'normal'
                  }}
                >
                  {opcion.texto}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '15px' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleDatosSubmit}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
              border: 'none',
              borderRadius: '50px',
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Continuar →
          </button>
        </>
      )}

      {/* PREGUNTAS */}
      {fase === 'preguntas' && pregunta && (
        <>
          <div style={{
            height: '4px',
            background: 'rgba(212, 175, 55, 0.2)',
            borderRadius: '2px',
            marginBottom: '30px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #d4af37, #f4d03f)',
              width: `${progreso}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>

          <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>
            Pregunta {preguntaActual + 1} de {preguntas.length}
          </p>

          <h2 style={{
            color: '#f5f5dc',
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '20px',
            lineHeight: '1.5'
          }}>
            {pregunta.pregunta}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pregunta.opciones.map((opcion, idx) => (
              <button
                key={idx}
                onClick={() => handleRespuesta(pregunta.id, opcion.valor)}
                style={{
                  padding: '16px 20px',
                  background: respuestas[pregunta.id] === opcion.valor
                    ? 'linear-gradient(135deg, #d4af37, #f4d03f)'
                    : 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  color: respuestas[pregunta.id] === opcion.valor ? '#1a1a1a' : '#f5f5dc',
                  fontSize: '15px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                {opcion.texto}
              </button>
            ))}
          </div>

          {preguntaActual > 0 && (
            <button
              onClick={() => setPreguntaActual(prev => prev - 1)}
              style={{
                marginTop: '20px',
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Anterior
            </button>
          )}
        </>
      )}

      {/* ENVIANDO */}
      {fase === 'enviando' && (
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p style={{ color: '#a0a0a0' }}>Analizando tus respuestas...</p>
        </div>
      )}

      {/* COMPLETADO */}
      {fase === 'completado' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>✨</div>
          <h2 style={{ color: '#d4af37', marginBottom: '15px' }}>¡Listo!</h2>
          <p style={{ color: '#a0a0a0', lineHeight: '1.6' }}>
            Ya conocemos un poco más sobre vos.
            Tu experiencia ahora será más personalizada.
          </p>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '20px' }}>
            Redirigiendo a Mi Magia...
          </p>
        </div>
      )}

      {/* ERROR */}
      {fase === 'error' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>😔</div>
          <h2 style={{ color: '#d4af37', marginBottom: '15px' }}>Algo salió mal</h2>
          <p style={{ color: '#ff6b6b', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
              border: 'none',
              borderRadius: '50px',
              color: '#1a1a1a',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      <style jsx>{`
        .spinner {
          width: 50px;
          height: 50px;
          margin: 0 auto 20px;
          border: 3px solid rgba(212, 175, 55, 0.3);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div style={{
      background: 'rgba(26, 26, 46, 0.95)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '500px',
      width: '100%',
      textAlign: 'center'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        margin: '0 auto 20px',
        border: '3px solid rgba(212, 175, 55, 0.3)',
        borderTopColor: '#d4af37',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#a0a0a0' }}>Cargando...</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function PerfiladoPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Suspense fallback={<LoadingFallback />}>
        <PerfiladoContent />
      </Suspense>
    </div>
  );
}

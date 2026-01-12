'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CertificadoPage() {
  const params = useParams();
  const [guardian, setGuardian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarGuardian() {
      try {
        const res = await fetch(`/api/producto/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setGuardian(data);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    cargarGuardian();
  }, [params.id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#C6A962'
      }}>
        <p>Canalizando energía...</p>
      </div>
    );
  }

  if (!guardian) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
      }}>
        <p>Guardián no encontrado</p>
      </div>
    );
  }

  const fechaCreacion = new Date().toLocaleDateString('es-UY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const codigoUnico = `DU-${params.id}-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '40px 20px',
      fontFamily: "'Cormorant Garamond', Georgia, serif"
    }}>
      {/* Certificado */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
        border: '3px solid #C6A962',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(198, 169, 98, 0.2)'
      }}>
        {/* Header dorado */}
        <div style={{
          background: 'linear-gradient(135deg, #C6A962, #a88a42)',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '28px',
            color: '#000',
            margin: 0,
            letterSpacing: '4px'
          }}>
            CERTIFICADO DE AUTENTICIDAD
          </h1>
          <p style={{
            color: '#000',
            opacity: 0.7,
            margin: '10px 0 0 0',
            fontSize: '14px',
            letterSpacing: '2px'
          }}>
            DUENDES DEL URUGUAY®
          </p>
        </div>

        {/* Contenido */}
        <div style={{ padding: '40px' }}>
          {/* Imagen y nombre */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            {guardian.imagenes?.[0] && (
              <div style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                border: '4px solid #C6A962',
                overflow: 'hidden',
                boxShadow: '0 0 30px rgba(198, 169, 98, 0.3)'
              }}>
                <img
                  src={guardian.imagenes[0]}
                  alt={guardian.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}

            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '42px',
              color: '#C6A962',
              margin: '0 0 10px 0'
            }}>
              {guardian.nombre}
            </h2>

            <p style={{
              color: '#888',
              fontSize: '18px',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '3px'
            }}>
              {guardian.tipo || 'Guardián'} • {guardian.elemento || 'Éter'}
            </p>
          </div>

          {/* Línea decorativa */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #C6A962, transparent)',
            margin: '30px 0'
          }} />

          {/* Texto certificación */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{
              color: '#e8e4dc',
              fontSize: '18px',
              lineHeight: 1.8,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Este documento certifica que <strong style={{ color: '#C6A962' }}>{guardian.nombre}</strong> es
              una pieza <strong>ÚNICA</strong> y <strong>ORIGINAL</strong>, creada artesanalmente en
              el Bosque Ancestral de Piriápolis, Uruguay.
            </p>
          </div>

          {/* Datos del guardián */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'rgba(198, 169, 98, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(198, 169, 98, 0.2)'
            }}>
              <p style={{ color: '#888', fontSize: '12px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
                Código Único
              </p>
              <p style={{ color: '#C6A962', fontSize: '18px', margin: 0, fontFamily: 'monospace' }}>
                {codigoUnico}
              </p>
            </div>

            <div style={{
              background: 'rgba(198, 169, 98, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(198, 169, 98, 0.2)'
            }}>
              <p style={{ color: '#888', fontSize: '12px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
                Fecha de Canalización
              </p>
              <p style={{ color: '#C6A962', fontSize: '18px', margin: 0 }}>
                {fechaCreacion}
              </p>
            </div>

            <div style={{
              background: 'rgba(198, 169, 98, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(198, 169, 98, 0.2)'
            }}>
              <p style={{ color: '#888', fontSize: '12px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
                Propósito Principal
              </p>
              <p style={{ color: '#C6A962', fontSize: '18px', margin: 0, textTransform: 'capitalize' }}>
                {guardian.proposito || 'Protección y guía'}
              </p>
            </div>

            <div style={{
              background: 'rgba(198, 169, 98, 0.1)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(198, 169, 98, 0.2)'
            }}>
              <p style={{ color: '#888', fontSize: '12px', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
                Origen
              </p>
              <p style={{ color: '#C6A962', fontSize: '18px', margin: 0 }}>
                Piriápolis, Uruguay
              </p>
            </div>
          </div>

          {/* Mensaje de poder */}
          {guardian.historia?.mensajePoder && (
            <div style={{
              background: 'linear-gradient(135deg, #1B4D3E 0%, #0d2d24 100%)',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <p style={{
                color: '#fff',
                fontSize: '22px',
                fontStyle: 'italic',
                margin: 0,
                lineHeight: 1.6
              }}>
                "{guardian.historia.mensajePoder}"
              </p>
            </div>
          )}

          {/* Adoptante (si existe) */}
          {guardian.adoptante && (
            <div style={{
              textAlign: 'center',
              marginBottom: '40px',
              padding: '30px',
              background: 'rgba(35, 134, 54, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(35, 134, 54, 0.3)'
            }}>
              <p style={{ color: '#888', fontSize: '14px', margin: '0 0 10px 0' }}>
                Este guardián ha sido adoptado por
              </p>
              <p style={{
                color: '#3fb950',
                fontSize: '24px',
                fontFamily: "'Cinzel', serif",
                margin: 0
              }}>
                {guardian.adoptante}
              </p>
            </div>
          )}

          {/* Línea decorativa */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #C6A962, transparent)',
            margin: '30px 0'
          }} />

          {/* Firma */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: '#888',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              Certificado emitido por
            </p>
            <p style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '24px',
              color: '#C6A962',
              margin: '0 0 5px 0'
            }}>
              Duendes del Uruguay
            </p>
            <p style={{
              color: '#666',
              fontSize: '14px',
              margin: 0
            }}>
              Canalizadores de Seres Mágicos desde el Bosque Ancestral
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#000',
          padding: '20px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#666',
            fontSize: '12px',
            margin: 0
          }}>
            Verificá la autenticidad en duendesdeluruguay.com/certificado/{params.id}
          </p>
        </div>
      </div>

      {/* Botones */}
      <div style={{
        maxWidth: '800px',
        margin: '30px auto 0',
        display: 'flex',
        gap: '15px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #C6A962, #a88a42)',
            border: 'none',
            borderRadius: '10px',
            color: '#000',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🖨️ Imprimir Certificado
        </button>

        <button
          onClick={() => navigator.share?.({
            title: `Certificado de ${guardian.nombre}`,
            url: window.location.href
          })}
          style={{
            padding: '15px 30px',
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '10px',
            color: '#e6edf3',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          📤 Compartir
        </button>
      </div>

      {/* Estilos para impresión */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

        @media print {
          body {
            background: white !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

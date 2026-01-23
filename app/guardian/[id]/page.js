import { kv } from '@vercel/kv';
import { generatePrivateMetadata } from '@/lib/seo/metadata';

// ═══════════════════════════════════════════════════════════════════════════════
// PAGINA DE GUIA DE GUARDIAN - CONTENIDO PRIVADO
// Guias de canalizacion personalizadas (noindex)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera metadata dinamico para cada guia de guardian
 * IMPORTANTE: noindex para proteger contenido privado del cliente
 */
export async function generateMetadata({ params }) {
  const { id } = await params;

  // Intentar obtener info para el titulo
  let titulo = 'Guia de Canalizacion';
  try {
    const guide = await kv.get('guide:' + id);
    if (guide?.productos?.[0]?.nombre) {
      titulo = `Guia de ${guide.productos[0].nombre}`;
    } else if (guide?.receptorNombre) {
      titulo = `Guia para ${guide.receptorNombre}`;
    }
  } catch (e) {
    // Si falla, usamos el titulo generico
  }

  return {
    ...generatePrivateMetadata(
      titulo,
      'Tu guia de canalizacion personalizada de Duendes del Uruguay. Instrucciones exclusivas para conectar con tu guardian.'
    ),
    // Asegurar que no se indexe
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        'max-image-preview': 'none',
        'max-snippet': -1,
        noimageindex: true,
      },
    },
  };
}

export default async function GuardianPage({ params }) {
  const { id } = await params;
  const guide = await kv.get('guide:' + id);

  if (!guide) {
    return (
      <div style={{
        fontFamily: 'Georgia',
        background: '#FDF8F0',
        minHeight: '100vh',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#4A5D4A' }}>Guia no encontrada</h1>
        <p style={{ color: '#666', marginTop: '20px' }}>
          Esta guia no existe o el enlace ha expirado.
        </p>
        <a
          href="https://duendesdeluruguay.com"
          style={{
            display: 'inline-block',
            marginTop: '30px',
            background: '#4A5D4A',
            color: 'white',
            padding: '15px 40px',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Ir al inicio
        </a>
      </div>
    );
  }

  const { receptorNombre, productos, content, esRegalo, compradorNombre } = guide;
  const nombresProductos = productos?.map(p => p.nombre).join(', ') || 'Tu guardian';

  const Section = ({ children, dark }) => (
    <section style={{
      background: dark ? '#4A5D4A' : 'white',
      color: dark ? 'white' : '#2C2416',
      padding: '25px',
      borderRadius: '10px',
      marginBottom: '20px',
      lineHeight: '1.8',
      fontSize: '16px',
      whiteSpace: 'pre-wrap'
    }}>
      {children}
    </section>
  );

  return (
    <div style={{ fontFamily: 'Georgia', background: '#FDF8F0', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{
          textAlign: 'center',
          padding: '30px 0',
          borderBottom: '2px solid #C6A962',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#C6A962', fontSize: '14px', letterSpacing: '2px' }}>
            DUENDES DEL URUGUAY
          </p>
          <h1 style={{ color: '#4A5D4A', fontSize: '26px' }}>Guia de Canalizacion</h1>
          <p style={{ color: '#2C2416', fontSize: '18px' }}>{nombresProductos}</p>
          {esRegalo && (
            <p style={{ color: '#4A5D4A', fontSize: '14px', marginTop: '10px' }}>
              Regalo de {compradorNombre}
            </p>
          )}
        </header>

        {content.bienvenida && <Section>{content.bienvenida}</Section>}
        {content.tu_guardian && <Section>{content.tu_guardian}</Section>}
        {content.mensaje_guardian && <Section dark>{content.mensaje_guardian}</Section>}
        {content.cristales && <Section>{content.cristales}</Section>}
        {content.antes_de_que_llegue && <Section>{content.antes_de_que_llegue}</Section>}
        {content.donde_ponerlo && <Section>{content.donde_ponerlo}</Section>}
        {content.ritual_cuando_llegue && <Section>{content.ritual_cuando_llegue}</Section>}
        {content.como_pedirle && <Section>{content.como_pedirle}</Section>}
        {content.senales && <Section>{content.senales}</Section>}
        {content.cuidados && <Section>{content.cuidados}</Section>}
        {content.dudas_frecuentes && <Section>{content.dudas_frecuentes}</Section>}
        {content.sinergia && <Section>{content.sinergia}</Section>}

        {content.cierre && (
          <Section>
            <p>{content.cierre}</p>
            <p style={{ color: '#4A5D4A', marginTop: '15px' }}>{content.firma}</p>
          </Section>
        )}

        <div style={{ textAlign: 'center', padding: '30px' }}>
          <a
            href={'/api/pdf/' + id}
            style={{
              background: '#4A5D4A',
              color: 'white',
              padding: '15px 40px',
              textDecoration: 'none',
              borderRadius: '5px',
              display: 'inline-block'
            }}
          >
            Descargar PDF
          </a>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'white',
          borderRadius: '10px',
          marginTop: '10px'
        }}>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            Queres explorar mas guardianes?
          </p>
          <a
            href="https://duendesdeluruguay.com"
            style={{
              color: '#4A5D4A',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            Visitar la tienda
          </a>
        </div>
      </div>
    </div>
  );
}

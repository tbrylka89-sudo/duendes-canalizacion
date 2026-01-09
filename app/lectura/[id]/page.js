import { kv } from '@vercel/kv';

export default async function LecturaPage({ params }) {
  const { id } = await params;
  const lectura = await kv.get('lectura:' + id);

  if (!lectura) {
    return (<div style={{ fontFamily: 'Georgia', background: '#FDF8F0', minHeight: '100vh', padding: '40px', textAlign: 'center' }}><h1 style={{ color: '#4A5D4A' }}>Lectura no encontrada</h1></div>);
  }

  const { nombreCliente, datosLectura, content } = lectura;

  const Section = ({ children, dark, accent }) => (
    <section style={{ background: dark ? '#4A5D4A' : accent ? '#f9f6f0' : 'white', color: dark ? 'white' : '#2C2416', padding: '25px', borderRadius: '10px', marginBottom: '20px', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-wrap', border: accent ? '2px solid #C6A962' : 'none' }}>{children}</section>
  );

  return (
    <div style={{ fontFamily: 'Georgia', background: '#FDF8F0', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', padding: '30px 0', borderBottom: '2px solid #C6A962', marginBottom: '30px' }}>
          <p style={{ color: '#C6A962', fontSize: '14px', letterSpacing: '2px' }}>🔮 DUENDES DEL URUGUAY</p>
          <h1 style={{ color: '#4A5D4A', fontSize: '26px' }}>Lectura Ancestral</h1>
          <p style={{ color: '#2C2416', fontSize: '18px' }}>Para {nombreCliente}</p>
        </header>

        {datosLectura?.foto_url && (
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src={datosLectura.foto_url} alt="Tu guardian" style={{ maxWidth: '300px', borderRadius: '15px', border: '3px solid #C6A962' }} />
          </div>
        )}

        {content.saludo && <Section>{content.saludo}</Section>}
        {content.nombre_guardian && <Section accent>{content.nombre_guardian}</Section>}
        {content.tipo_guardian && <Section dark>{content.tipo_guardian}</Section>}
        {content.nivel_energia && <Section>{content.nivel_energia}</Section>}
        {content.donde_ubicarlo && <Section>{content.donde_ubicarlo}</Section>}
        {content.como_activarlo && <Section>{content.como_activarlo}</Section>}
        {content.que_pedirle && <Section>{content.que_pedirle}</Section>}
        {content.limitaciones && <Section accent>{content.limitaciones}</Section>}
        {content.cuidados && <Section>{content.cuidados}</Section>}
        {content.mensaje_final && <Section dark>{content.mensaje_final}</Section>}
        
        <Section>
          <p style={{ textAlign: 'center', margin: 0 }}>{content.firma}</p>
        </Section>

        <div style={{ textAlign: 'center', padding: '30px', background: 'white', borderRadius: '10px', marginTop: '20px' }}>
          <p style={{ color: '#4A5D4A', fontSize: '18px', marginBottom: '20px' }}>¿Querés un guardian canalizado especialmente para vos?</p>
          <a href="https://duendesdeluruguay.com" style={{ background: '#4A5D4A', color: 'white', padding: '15px 40px', textDecoration: 'none', borderRadius: '5px' }}>🍀 Conocer Guardianes</a>
        </div>
      </div>
    </div>
  );
}

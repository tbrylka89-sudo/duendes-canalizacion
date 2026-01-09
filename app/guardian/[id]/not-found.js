export default function NotFound() {
  return (
    <div className="error">
      <div style={{ fontSize: '60px', marginBottom: '20px' }}>🍀</div>
      <h2>Guía no encontrada</h2>
      <p>
        Esta guía de canalización no existe o aún no ha sido generada.
      </p>
      <p style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
        Si acabás de realizar tu compra, tu guía estará lista en unas horas.<br />
        Recibirás un email cuando esté disponible.
      </p>
      <a 
        href="https://duendesdeluruguay.com" 
        style={{
          display: 'inline-block',
          marginTop: '30px',
          padding: '12px 30px',
          background: '#4A5D4A',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '25px',
          fontFamily: 'Cinzel, serif'
        }}
      >
        Volver a la tienda
      </a>
    </div>
  )
}

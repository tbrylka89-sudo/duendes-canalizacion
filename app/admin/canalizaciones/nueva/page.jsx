'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════
// NUEVA CANALIZACIÓN — Enviar formulario al cliente
// El cliente provee foto y datos del producto en el formulario.
// ═══════════════════════════════════════════════════════════════

export default function NuevaCanalizacion() {
  const router = useRouter();

  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [formType, setFormType] = useState('para_mi');
  const [notaAdmin, setNotaAdmin] = useState('');

  const [creando, setCreando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const crear = async () => {
    if (!clienteNombre || !clienteEmail) {
      setError('Nombre y email son requeridos');
      return;
    }

    setCreando(true);
    setError(null);

    try {
      // 1. Crear borrador
      const resBorrador = await fetch('/api/admin/canalizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          esManual: true,
          email: clienteEmail.toLowerCase().trim(),
          nombreCliente: clienteNombre,
          productoManual: { nombre: 'Pendiente de formulario', tipo: 'guardian', categoria: 'proteccion' },
          modoContexto: 'formulario',
          formType,
          notaAdmin: notaAdmin || null
        })
      });

      const dataBorrador = await resBorrador.json();

      if (!dataBorrador.success) {
        setError(dataBorrador.error || 'Error creando borrador');
        setCreando(false);
        return;
      }

      // 2. Enviar formulario vinculado a la canalización
      const resForm = await fetch('/api/admin/formularios/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clienteEmail.toLowerCase().trim(),
          nombre: clienteNombre,
          formType,
          notaAdmin: notaAdmin || null,
          canalizacionId: dataBorrador.id
        })
      });

      const dataForm = await resForm.json();

      setResultado({
        id: dataBorrador.id,
        emailEnviado: dataForm.emailEnviado,
        linkFormulario: dataForm.linkFormulario
      });
    } catch {
      setError('Error de conexión');
    }
    setCreando(false);
  };

  if (resultado) {
    return (
      <div className="nueva-container">
        <div className="success-card">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
          <h2 style={{ color: '#d4af37', fontFamily: "'MedievalSharp', cursive" }}>Formulario enviado</h2>
          <p style={{ color: '#aaa', marginBottom: '1rem' }}>
            {resultado.emailEnviado
              ? `Se envió un email a ${clienteEmail} con el formulario.`
              : `Borrador creado. El email no pudo enviarse.`
            }
          </p>
          {resultado.linkFormulario && (
            <p style={{ color: '#888', fontSize: '0.8rem', wordBreak: 'break-all', marginBottom: '1.5rem' }}>
              Link: <a href={resultado.linkFormulario} target="_blank" rel="noreferrer" style={{ color: '#d4af37' }}>{resultado.linkFormulario}</a>
            </p>
          )}
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Cuando el cliente complete el formulario, podrás generar la canalización con IA.
          </p>
          <button className="btn-gold" onClick={() => router.push(`/admin/canalizaciones/${encodeURIComponent(resultado.id)}`)}>
            Ver detalle
          </button>
          <button className="btn-sec" onClick={() => router.push('/admin/canalizaciones')}>
            Volver a la lista
          </button>
        </div>
        <style jsx>{estilos}</style>
      </div>
    );
  }

  return (
    <div className="nueva-container">
      <header className="header">
        <div>
          <h1 className="titulo">Nueva Canalización</h1>
          <p className="subtitulo">Enviar formulario al cliente</p>
        </div>
        <button className="btn-sec" onClick={() => router.push('/admin/canalizaciones')}>
          Cancelar
        </button>
      </header>

      <div className="form-card">
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          El cliente recibirá un email con el formulario. Ahí sube la foto de su guardián, indica qué tipo es, y completa sus datos personales.
        </p>

        <div className="campo">
          <label className="label">Email del cliente</label>
          <input className="input" type="email" value={clienteEmail} onChange={e => setClienteEmail(e.target.value)} placeholder="cliente@email.com" />
        </div>

        <div className="campo">
          <label className="label">Nombre</label>
          <input className="input" value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} placeholder="Nombre del cliente" />
        </div>

        <div className="campo">
          <label className="label">Tipo de formulario</label>
          <select className="input" value={formType} onChange={e => setFormType(e.target.value)}>
            <option value="para_mi">Para mí (la persona lo llena)</option>
            <option value="regalo_sabe">Regalo — la persona lo sabe</option>
            <option value="regalo_sorpresa">Regalo sorpresa (comprador llena)</option>
            <option value="para_nino">Para un niño/a</option>
            <option value="reconexion">Reconexión (ya tiene guardián)</option>
          </select>
        </div>

        <div className="campo">
          <label className="label">Nota para la IA (opcional)</label>
          <textarea className="textarea" value={notaAdmin} onChange={e => setNotaAdmin(e.target.value)} placeholder="Ej: compró en la feria de Piriápolis, mencionar la conexión con el lugar..." />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn-gold btn-crear" onClick={crear} disabled={creando || !clienteEmail || !clienteNombre}>
          {creando ? 'Creando...' : '📧 Crear borrador y enviar formulario'}
        </button>
      </div>

      <style jsx>{estilos}</style>
    </div>
  );
}

const estilos = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=MedievalSharp&display=swap');

  .nueva-container {
    min-height: 100vh;
    background: #0a0a0a;
    font-family: 'Cinzel', serif;
    color: #e8e0d5;
    padding: 0 0 4rem;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 2rem;
    border-bottom: 1px solid rgba(212,175,55,0.1);
  }
  @media (max-width: 768px) {
    .header { flex-direction: column; gap: 1rem; padding: 1rem; }
  }
  .titulo {
    font-family: 'MedievalSharp', cursive;
    font-size: 1.5rem;
    color: #d4af37;
    margin: 0;
  }
  .subtitulo {
    font-size: 0.8rem;
    color: #888;
    margin: 0;
    font-weight: 400;
  }
  .form-card {
    max-width: 520px;
    margin: 2rem auto;
    padding: 2rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
  }
  @media (max-width: 768px) {
    .form-card { margin: 1rem; }
  }
  .campo { margin-bottom: 1.25rem; }
  .label {
    display: block;
    color: rgba(255,255,255,0.7);
    font-size: 0.8rem;
    margin-bottom: 0.4rem;
    font-weight: 500;
  }
  .input, .textarea {
    width: 100%;
    padding: 12px 14px;
    background: #0a0a0a;
    border: 1px solid #333;
    border-radius: 8px;
    color: #fff;
    font-size: 0.95rem;
    font-family: inherit;
    box-sizing: border-box;
    outline: none;
  }
  .input:focus, .textarea:focus { border-color: rgba(212,175,55,0.5); }
  .textarea { min-height: 100px; resize: vertical; }
  .btn-gold {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #d4af37, #aa8a2e);
    border: none;
    color: #0a0a0a;
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
  }
  .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-sec {
    padding: 10px 20px;
    background: transparent;
    border: 1px solid rgba(212,175,55,0.3);
    color: #d4af37;
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 0.75rem;
    width: 100%;
    text-align: center;
  }
  .btn-crear { margin-top: 1.5rem; }
  .error { color: #f66; font-size: 0.85rem; margin-bottom: 0.5rem; }
  .success-card {
    max-width: 480px;
    margin: 4rem auto;
    text-align: center;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(212,175,55,0.15);
    border-radius: 20px;
    padding: 3rem 2rem;
  }
`;

'use client';
import { useState } from 'react';
import { API_BASE, WORDPRESS_URL } from './constants';

// ═══════════════════════════════════════════════════════════════
// LECTURAS REGALABLES (específico de esta sección)
// ═══════════════════════════════════════════════════════════════

const LECTURAS_REGALABLES = [
  // Temática Duendes - Básicas
  { id: 'consejo_bosque', nombre: 'Consejo del Bosque', runas: 15, icono: '🌲', descripcion: 'Mensaje breve del bosque', categoria: 'duendes' },
  { id: 'energia_dia', nombre: 'Energía del Día', runas: 15, icono: '☀️', descripcion: 'Qué energía te rodea hoy', categoria: 'duendes' },
  { id: 'susurro_guardian', nombre: 'Susurro del Guardián', runas: 20, icono: '👂', descripcion: 'Un guardián te susurra un mensaje', categoria: 'duendes' },
  { id: 'mensaje_hogar_protegido', nombre: 'Mensaje del Hogar', runas: 25, icono: '🏠', descripcion: 'Tu guardián habla sobre tu hogar', categoria: 'duendes' },
  { id: 'cuatro_elementales', nombre: 'Los 4 Elementales', runas: 50, icono: '🌍', descripcion: 'Tierra, Agua, Fuego y Aire te hablan', categoria: 'duendes' },

  // Tiradas Clásicas
  { id: 'tirada_3_runas', nombre: 'Tirada de 3 Runas', runas: 25, icono: 'ᚱ', descripcion: 'Pasado, Presente y Futuro', categoria: 'clasicas' },
  { id: 'tirada_5_runas', nombre: 'Tirada de 5 Runas', runas: 40, icono: 'ᚱᛏ', descripcion: 'Situación completa con consejo', categoria: 'clasicas' },
  { id: 'tarot_3_cartas', nombre: 'Tarot 3 Cartas', runas: 50, icono: '🃏', descripcion: 'Tres cartas con interpretación', categoria: 'clasicas' },
  { id: 'tarot_amor', nombre: 'Tarot del Amor', runas: 75, icono: '💕', descripcion: 'Especializado en relaciones', categoria: 'clasicas' },

  // Estudios y Rituales
  { id: 'registros_akashicos', nombre: 'Registros Akáshicos', runas: 75, icono: '📜', descripcion: 'Tu biblioteca cósmica personal', categoria: 'estudios' },
  { id: 'numerologia_personal', nombre: 'Numerología Personal', runas: 65, icono: '🔢', descripcion: 'Tu número de vida y ciclos', categoria: 'estudios' },
  { id: 'ritual_abundancia', nombre: 'Ritual de Abundancia', runas: 65, icono: '🌟', descripcion: 'Abrí los canales de prosperidad', categoria: 'rituales' },
  { id: 'limpieza_energetica', nombre: 'Limpieza Energética', runas: 45, icono: '✨', descripcion: 'Limpieza de energía y espacio', categoria: 'rituales' },

  // Premium
  { id: 'tirada_7_runas', nombre: 'Tirada de 7 Runas', runas: 100, icono: 'ᚱᛏᚠ', descripcion: 'La tirada profunda completa', categoria: 'premium' },
  { id: 'tarot_cruz_celta', nombre: 'Tarot Cruz Celta', runas: 120, icono: '🎴', descripcion: '10 cartas revelando todo', categoria: 'premium' },
  { id: 'lectura_ano_personal', nombre: 'Lectura de Año Personal', runas: 140, icono: '📅', descripcion: 'Los 12 meses que vienen', categoria: 'premium' },
  { id: 'mapa_karmico', nombre: 'Mapa Kármico', runas: 180, icono: '🔄', descripcion: 'Tus lecciones y misión', categoria: 'premium' },
  { id: 'mision_alma', nombre: 'Misión del Alma', runas: 200, icono: '🎯', descripcion: 'Para qué viniste a este mundo', categoria: 'premium' },
  { id: 'estudio_alma', nombre: 'Estudio del Alma', runas: 200, icono: '👁️', descripcion: 'Quién sos realmente, revelado', categoria: 'premium' }
];

// ═══════════════════════════════════════════════════════════════
// REGALOS (COMPLETO CON FLUJO DE REGALO DE LECTURAS)
// ═══════════════════════════════════════════════════════════════

export default function SeccionRegalos({ ir, usuario, setUsuario }) {
  const [vista, setVista] = useState('menu'); // menu, lecturas, form, enviando, exito
  const [lecturaSeleccionada, setLecturaSeleccionada] = useState(null);
  const [form, setForm] = useState({ nombreDestinatario: '', emailDestinatario: '', mensaje: '' });
  const [error, setError] = useState(null);
  const [codigoRegalo, setCodigoRegalo] = useState(null);

  const enviarRegalo = async () => {
    if (!lecturaSeleccionada || !form.emailDestinatario) {
      setError('Completá todos los campos requeridos');
      return;
    }

    if ((usuario?.runas || 0) < lecturaSeleccionada.runas) {
      setError('No tenés suficientes runas');
      return;
    }

    setVista('enviando');
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/regalos/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailRemitente: usuario.email,
          nombreRemitente: usuario.nombrePreferido || usuario.nombre,
          emailDestinatario: form.emailDestinatario,
          nombreDestinatario: form.nombreDestinatario,
          mensaje: form.mensaje,
          lecturaId: lecturaSeleccionada.id,
          lecturaNombre: lecturaSeleccionada.nombre,
          runasUsadas: lecturaSeleccionada.runas
        })
      });

      const data = await res.json();

      if (data.success) {
        setCodigoRegalo(data.codigo);
        setUsuario({ ...usuario, runas: (usuario.runas || 0) - lecturaSeleccionada.runas });
        setVista('exito');
      } else {
        setError(data.error || 'Error al enviar el regalo');
        setVista('form');
      }
    } catch (e) {
      setError('Error de conexión');
      setVista('form');
    }
  };

  const reset = () => {
    setVista('menu');
    setLecturaSeleccionada(null);
    setForm({ nombreDestinatario: '', emailDestinatario: '', mensaje: '' });
    setCodigoRegalo(null);
    setError(null);
  };

  // Vista de éxito
  if (vista === 'exito') {
    return (
      <div className="sec regalo-exito">
        <div className="exito-card">
          <span className="exito-icono">🎁</span>
          <h1>¡Regalo enviado!</h1>
          <p>{form.nombreDestinatario || 'Tu ser querido'} recibirá un email con el regalo.</p>
          <div className="codigo-box">
            <small>Código del regalo:</small>
            <strong>{codigoRegalo}</strong>
          </div>
          <p className="nota">La persona recibirá instrucciones para canjear su lectura y completar sus propios datos.</p>
          <button className="btn-gold" onClick={reset}>Volver a Regalos</button>
        </div>
      </div>
    );
  }

  // Vista enviando
  if (vista === 'enviando') {
    return (
      <div className="sec regalo-enviando">
        <div className="enviando-card">
          <div className="spinner-regalo"></div>
          <p>Preparando tu regalo mágico...</p>
        </div>
      </div>
    );
  }

  // Vista formulario
  if (vista === 'form' && lecturaSeleccionada) {
    const puedeEnviar = (usuario?.runas || 0) >= lecturaSeleccionada.runas;

    return (
      <div className="sec regalo-form-sec">
        <button className="btn-back" onClick={() => setVista('lecturas')}>← Cambiar lectura</button>

        <div className="regalo-form-card">
          <div className="lectura-seleccionada">
            <span className="lectura-icono">{lecturaSeleccionada.icono}</span>
            <div>
              <h3>{lecturaSeleccionada.nombre}</h3>
              <p>{lecturaSeleccionada.descripcion}</p>
              <span className="lectura-precio">{lecturaSeleccionada.runas} ᚱ</span>
            </div>
          </div>

          <h2>¿A quién le regalás?</h2>

          <div className="form-campos">
            <div className="campo">
              <label>Email del destinatario *</label>
              <input
                type="email"
                value={form.emailDestinatario}
                onChange={e => setForm({ ...form, emailDestinatario: e.target.value })}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div className="campo">
              <label>Nombre (para personalizar)</label>
              <input
                type="text"
                value={form.nombreDestinatario}
                onChange={e => setForm({ ...form, nombreDestinatario: e.target.value })}
                placeholder="¿Cómo se llama?"
              />
            </div>
            <div className="campo">
              <label>Tu mensaje personal (opcional)</label>
              <textarea
                value={form.mensaje}
                onChange={e => setForm({ ...form, mensaje: e.target.value })}
                placeholder="Un mensaje que acompañará el regalo..."
                rows={3}
              />
            </div>
          </div>

          <div className="regalo-resumen">
            <div className="resumen-row">
              <span>Lectura:</span>
              <span>{lecturaSeleccionada.nombre}</span>
            </div>
            <div className="resumen-row">
              <span>Costo:</span>
              <span>{lecturaSeleccionada.runas} ᚱ</span>
            </div>
            <div className="resumen-row">
              <span>Tus runas:</span>
              <span className={puedeEnviar ? '' : 'insuficientes'}>{usuario?.runas || 0} ᚱ</span>
            </div>
            {!puedeEnviar && (
              <div className="resumen-alerta">
                Te faltan {lecturaSeleccionada.runas - (usuario?.runas || 0)} runas
              </div>
            )}
          </div>

          {error && <div className="error-msg">{error}</div>}

          <div className="form-actions">
            <button className="btn-sec" onClick={() => setVista('lecturas')}>Cancelar</button>
            <button
              className="btn-gold"
              onClick={enviarRegalo}
              disabled={!puedeEnviar || !form.emailDestinatario}
            >
              Enviar Regalo 🎁
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista selección de lecturas
  if (vista === 'lecturas') {
    return (
      <div className="sec regalo-lecturas">
        <button className="btn-back" onClick={() => setVista('menu')}>← Volver</button>

        <div className="sec-head">
          <h1>Elegí qué regalar</h1>
          <p>Seleccioná la lectura que querés regalar. La persona recibirá un email y completará sus propios datos.</p>
        </div>

        <div className="runas-header">
          <div className="runas-balance"><span>ᚱ</span><strong>{usuario?.runas || 0}</strong><small>disponibles</small></div>
        </div>

        <div className="lecturas-regalo-grid">
          {LECTURAS_REGALABLES.map(lectura => {
            const puedeRegalar = (usuario?.runas || 0) >= lectura.runas;
            return (
              <div
                key={lectura.id}
                className={`lectura-regalo-card ${puedeRegalar ? '' : 'bloqueada'}`}
                onClick={() => {
                  if (puedeRegalar) {
                    setLecturaSeleccionada(lectura);
                    setVista('form');
                  }
                }}
              >
                <span className="lectura-icono">{lectura.icono}</span>
                <h3>{lectura.nombre}</h3>
                <p>{lectura.descripcion}</p>
                <div className="lectura-precio">{lectura.runas} ᚱ</div>
                {!puedeRegalar && <span className="bloqueado-tag">Runas insuficientes</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vista menú principal
  return (
    <div className="sec">
      <div className="sec-head regalo-head"><span>❤</span><h1>Regalá Magia</h1><p>Un regalo de Duendes del Uruguay es diferente. Es compañía, protección, transformación.</p></div>

      <div className="regalos-grid">
        <div className="regalo-card regalo-card-principal" onClick={() => setVista('lecturas')}>
          <span>✦</span>
          <h3>Regalar una Lectura</h3>
          <p>Tiradas de runas, registros akáshicos, estudios del alma y más.</p>
          <small className="regalo-badge">Pagás con tus runas</small>
        </div>

        <div className="regalo-card" onClick={() => window.open(`${WORDPRESS_URL}/shop/`, '_blank')}>
          <span>◆</span>
          <h3>Regalar un Guardián</h3>
          <p>Un compañero de vida para alguien especial.</p>
          <small>Ir a la tienda ↗</small>
        </div>

        <div className="regalo-card" onClick={() => window.open('/product/circulo-seis-meses/', '_blank')}>
          <span>★</span>
          <h3>Regalar Membresía</h3>
          <p>6 meses de Círculo: contenido, comunidad, descuentos.</p>
          <small>Ver membresías ↗</small>
        </div>

        <div className="regalo-card" onClick={() => window.open('/product/paquete-runas-80/', '_blank')}>
          <span>ᚱ</span>
          <h3>Regalar Runas</h3>
          <p>Que elija qué experiencia mágica quiere tener.</p>
          <small>Ver paquetes ↗</small>
        </div>
      </div>

      <div className="regalo-info">
        <h4>¿Cómo funcionan los regalos de lecturas?</h4>
        <ol>
          <li>Elegís la lectura que querés regalar</li>
          <li>Ponés el email de quien recibe</li>
          <li>Pagás con tus runas</li>
          <li>La persona recibe un email con un código</li>
          <li>Canjea el código y completa SUS propios datos</li>
          <li>Recibe la lectura personalizada para ELLA</li>
        </ol>
      </div>
    </div>
  );
}

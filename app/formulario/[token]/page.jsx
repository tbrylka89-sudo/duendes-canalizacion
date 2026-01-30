'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════
// FORMULARIO DE CANALIZACIÓN — Página pública
// Acceso por token, sin login. 5 vías según tipo de formulario.
// Step 0 siempre es sobre el guardián/producto.
// ═══════════════════════════════════════════════════════════════

export default function FormularioPage() {
  const { token } = useParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paso, setPaso] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [subiendoFotoProducto, setSubiendoFotoProducto] = useState(false);
  const [tipoElegido, setTipoElegido] = useState(null);

  // Multi-item states
  const [multiMode, setMultiMode] = useState(false);
  const [multiPhase, setMultiPhase] = useState('assign'); // 'assign' | 'fill'
  const [itemTypes, setItemTypes] = useState({});
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [allItemsDatos, setAllItemsDatos] = useState([]);

  // Estado del formulario (campos universales)
  const [datos, setDatos] = useState({
    // Producto/guardián (Step 0 — todas las vías)
    tipo_producto: '',
    nombre_producto: '',
    foto_producto_url: null,
    // Campos personales
    nombre_preferido: '',
    momento_vida: '',
    necesidades: [],
    mensaje_guardian: '',
    foto_url: null,
    es_mayor_18: false,
    // Regalo/sorpresa
    relacion: '',
    que_necesita_escuchar: '',
    personalidad: [],
    que_le_hace_brillar: '',
    mensaje_personal: '',
    es_anonimo: false,
    // Niño
    edad_nino: '',
    relacion_nino: '',
    gustos_nino: '',
    personalidad_nino: [],
    necesidades_nino: [],
    info_extra_nino: '',
    // Pareja
    nombre_pareja: '',
    tiempo_juntos: '',
    momento_pareja: '',
    necesidades_pareja: [],
    mensaje_pareja: '',
    // Familia
    miembros_familia: '',
    momento_familia: '',
    necesidades_familia: [],
    dinamica_familia: '',
    mensaje_familia: '',
  });

  useEffect(() => {
    if (!token) return;
    fetch(`/api/formulario/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          if (data.completed) {
            setCompletado(true);
          } else {
            setConfig(data);
            // Multi-item: si el invite trae items, activar modo multi
            if (data.items && data.items.length > 0) {
              setMultiMode(true);
            }
            // Si ya tiene formType (del checkout web), saltar selección
            if (data.formType) {
              setTipoElegido(data.formType);
            }
            if (data.customerName) {
              setDatos(d => ({ ...d, nombre_preferido: data.customerName }));
            }
          }
        } else {
          setError(data.error || 'Formulario no encontrado');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error de conexión');
        setLoading(false);
      });
  }, [token]);

  const updateDato = (key, value) => {
    setDatos(d => ({ ...d, [key]: value }));
  };

  const toggleArray = (key, value) => {
    setDatos(d => {
      const arr = d[key] || [];
      return { ...d, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const subirFoto = async (e, campo) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const setSubiendo = campo === 'foto_producto_url' ? setSubiendoFotoProducto : setSubiendoFoto;
    setSubiendo(true);
    try {
      const fd = new FormData();
      fd.append('token', token);
      fd.append('archivo', file);
      const res = await fetch('/api/formulario/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        updateDato(campo, data.url);
      } else {
        alert(data.error || 'Error subiendo foto');
      }
    } catch {
      alert('Error subiendo foto');
    }
    setSubiendo(false);
  };

  const enviar = async () => {
    // Multi-item: guardar item actual y avanzar o enviar todo
    if (multiMode) {
      const newAllDatos = [...allItemsDatos];
      newAllDatos[currentItemIdx] = { ...datos };

      const nextIdx = currentItemIdx + 1;
      if (nextIdx < config.items.length) {
        // Más items por completar — avanzar al siguiente
        setAllItemsDatos(newAllDatos);
        setCurrentItemIdx(nextIdx);
        setPaso(0);
        setTipoElegido(itemTypes[nextIdx]);
        const nextItem = config.items[nextIdx];
        setDatos({
          tipo_producto: '', nombre_producto: nextItem.nombre || '', foto_producto_url: nextItem.imagen || null,
          nombre_preferido: config.customerName || '',
          momento_vida: '', necesidades: [], mensaje_guardian: '', foto_url: null, es_mayor_18: false,
          relacion: '', que_necesita_escuchar: '', personalidad: [],
          que_le_hace_brillar: '', mensaje_personal: '', es_anonimo: false,
          edad_nino: '', relacion_nino: '', gustos_nino: '',
          personalidad_nino: [], necesidades_nino: [], info_extra_nino: '',
          nombre_pareja: '', tiempo_juntos: '', momento_pareja: '',
          necesidades_pareja: [], mensaje_pareja: '',
          miembros_familia: '', momento_familia: '',
          necesidades_familia: [], dinamica_familia: '', mensaje_familia: '',
        });
        return;
      }

      // Último item — enviar todo
      setEnviando(true);
      try {
        const itemsData = config.items.map((item, i) => ({
          canalizacionId: item.canalizacionId,
          formType: itemTypes[i],
          datos: newAllDatos[i]
        }));
        const res = await fetch(`/api/formulario/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newAllDatos[0],
            formType: itemTypes[0],
            itemsData
          })
        });
        const data = await res.json();
        if (data.success) setCompletado(true);
        else alert(data.error || 'Error al enviar');
      } catch {
        alert('Error de conexión');
      }
      setEnviando(false);
      return;
    }

    // Single-item submission
    setEnviando(true);
    try {
      const res = await fetch(`/api/formulario/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datos, formType: tipoElegido })
      });
      const data = await res.json();
      if (data.success) {
        setCompletado(true);
      } else {
        alert(data.error || 'Error al enviar');
      }
    } catch {
      alert('Error de conexión');
    }
    setEnviando(false);
  };

  // ═══════════ ESTILOS ═══════════
  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Cormorant Garamond', Georgia, serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    card: { maxWidth: '480px', width: '100%', background: '#111', borderRadius: '20px', padding: '2.5rem 2rem', border: '1px solid #222', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
    icon: { fontSize: '3rem', display: 'block', textAlign: 'center', marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.3))' },
    title: { fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: '#fff', textAlign: 'center', margin: '0 0 0.5rem' },
    subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.5' },
    label: { display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '0.5rem', fontFamily: "'Cinzel', serif" },
    input: { width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontSize: '1.05rem', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' },
    textarea: { width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '10px', color: '#fff', fontSize: '1.05rem', fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '120px', resize: 'vertical', outline: 'none' },
    campo: { marginBottom: '1.5rem' },
    btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #d4af37 0%, #b8972e 100%)', color: '#0a0a0a', border: 'none', borderRadius: '10px', fontFamily: "'Cinzel', serif", fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
    btnSec: { width: '100%', padding: '14px', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid #333', borderRadius: '10px', fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.75rem', fontFamily: 'inherit' },
    chip: { display: 'inline-block', padding: '10px 18px', margin: '4px', borderRadius: '20px', border: '1px solid #333', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', background: 'transparent' },
    chipActive: { background: 'rgba(212,175,55,0.15)', borderColor: '#d4af37', color: '#d4af37' },
    radio: { display: 'block', padding: '12px 16px', margin: '6px 0', borderRadius: '10px', border: '1px solid #333', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'all 0.2s' },
    radioActive: { background: 'rgba(212,175,55,0.1)', borderColor: '#d4af37', color: '#d4af37' },
    progress: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem' },
    dot: { width: '8px', height: '8px', borderRadius: '50%', background: '#333', transition: 'all 0.3s' },
    dotActive: { background: '#d4af37', boxShadow: '0 0 8px rgba(212,175,55,0.5)' },
    highlight: { background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '1.5rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: '1.5' },
    fotoPreview: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4af37', margin: '1rem auto', display: 'block' },
    check: { display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '1rem', cursor: 'pointer' },
  };

  // ═══════════ LOADING / ERROR / COMPLETED ═══════════
  if (loading) return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>✨</div>
        <h1 style={s.title}>Cargando...</h1>
      </div>
    </div>
  );

  if (error) return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>🔮</div>
        <h1 style={s.title}>Enlace no válido</h1>
        <p style={s.subtitle}>{error}</p>
      </div>
    </div>
  );

  if (completado) return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>✨</div>
        <h1 style={s.title}>Gracias</h1>
        <p style={s.subtitle}>
          Tu guardián ya te escuchó.<br/>
          Pronto recibirás una carta que fue escrita solo para vos.
        </p>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="https://duendesdeluruguay.com" style={{ color: '#d4af37', textDecoration: 'none', fontFamily: "'Cinzel', serif" }}>
            Visitar Duendes del Uruguay
          </a>
        </div>
      </div>
    </div>
  );

  // ═══════════ MULTI-ITEM: ASIGNACIÓN DE TIPOS ═══════════
  if (multiMode && multiPhase === 'assign') {
    const opcionesMulti = [
      { value: 'para_mi', label: 'Para mí' },
      { value: 'pareja', label: 'Para mi pareja y yo' },
      { value: 'familia', label: 'Para mi familia' },
      { value: 'regalo_sabe', label: 'Regalo (lo sabe)' },
      { value: 'regalo_sorpresa', label: 'Regalo sorpresa' },
      { value: 'para_nino', label: 'Para un niño/a' },
      { value: 'reconexion', label: 'Reconexión' },
    ];
    const todosAsignados = config.items.every((_, i) => itemTypes[i]);

    return (
      <div style={s.page}>
        <div style={{ ...s.card, maxWidth: '560px' }}>
          <div style={s.icon}>✨</div>
          <h1 style={s.title}>Tu pedido tiene {config.items.length} guardianes</h1>
          <p style={s.subtitle}>Contanos para quién es cada uno.</p>

          {config.items.map((item, idx) => (
            <div key={idx} style={{
              marginBottom: '1rem', padding: '16px', borderRadius: '12px',
              border: `1px solid ${itemTypes[idx] ? 'rgba(212,175,55,0.4)' : '#333'}`,
              background: itemTypes[idx] ? 'rgba(212,175,55,0.05)' : 'transparent',
              transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                {item.imagen && (
                  <img src={item.imagen} alt={item.nombre} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #333' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontFamily: "'Cinzel', serif", fontSize: '1rem' }}>{item.nombre}</div>
                </div>
              </div>
              <select
                value={itemTypes[idx] || ''}
                onChange={e => setItemTypes(prev => ({ ...prev, [idx]: e.target.value }))}
                style={{
                  width: '100%', padding: '12px 14px', background: '#0a0a0a',
                  border: `1px solid ${itemTypes[idx] ? '#d4af37' : '#333'}`, borderRadius: '10px',
                  color: itemTypes[idx] ? '#d4af37' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none',
                  appearance: 'none', WebkitAppearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23999\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
                }}
              >
                <option value="">¿Para quién es?</option>
                {opcionesMulti.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            </div>
          ))}

          <button
            style={{ ...s.btn, opacity: todosAsignados ? 1 : 0.4, marginTop: '1rem' }}
            disabled={!todosAsignados}
            onClick={() => {
              setMultiPhase('fill');
              setTipoElegido(itemTypes[0]);
              const firstItem = config.items[0];
              setDatos(d => ({
                ...d,
                nombre_producto: firstItem.nombre || '',
                foto_producto_url: firstItem.imagen || null,
              }));
            }}
          >
            Comenzar
          </button>

          {config?.personalMessage && (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: '0.85rem', marginTop: '1.5rem', fontStyle: 'italic' }}>
              {config.personalMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ═══════════ SELECCIÓN DE TIPO (si no viene predefinido — single item) ═══════════
  if (!multiMode && !tipoElegido) {
    const opciones = [
      { value: 'para_mi', icon: '✦', label: 'Es para mí', desc: 'Este guardián viene a acompañarme' },
      { value: 'pareja', icon: '💑', label: 'Para mi pareja y yo', desc: 'Nos va a acompañar a los dos' },
      { value: 'familia', icon: '🏠', label: 'Para mi familia', desc: 'Va a cuidar a toda la familia' },
      { value: 'regalo_sabe', icon: '🎁', label: 'Es un regalo', desc: 'Y la persona lo sabe' },
      { value: 'regalo_sorpresa', icon: '🎁', label: 'Es un regalo sorpresa', desc: 'La persona no sabe que lo recibirá' },
      { value: 'para_nino', icon: '🧸', label: 'Es para un niño/a', desc: 'Menor de 18 años' },
      { value: 'reconexion', icon: '🔮', label: 'Es una reconexión', desc: 'Ya tengo este guardián y quiero reconectar' },
    ];

    return (
      <div style={s.page}>
        <div style={{ ...s.card, maxWidth: '520px' }}>
          <div style={s.icon}>✨</div>
          <h1 style={s.title}>¿Quién recibirá la magia?</h1>
          <p style={s.subtitle}>Antes de empezar, contanos para quién es este guardián.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {opciones.map(op => (
              <div
                key={op.value}
                onClick={() => setTipoElegido(op.value)}
                style={{
                  padding: '16px 18px',
                  borderRadius: '12px',
                  border: '1px solid #333',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{op.icon}</span>
                  <div>
                    <div style={{ color: '#fff', fontSize: '1rem', fontFamily: "'Cinzel', serif", marginBottom: '2px' }}>{op.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{op.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {config?.productName && (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: '0.85rem', marginTop: '1.5rem' }}>
              Guardián: <span style={{ color: '#d4af37' }}>{config.productName}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  const formType = tipoElegido;
  const totalPasos = 4;

  // ═══════════ COMPONENTES COMPARTIDOS ═══════════

  const ProgressBar = () => (
    <>
      {multiMode && config?.items && (
        <div style={{
          textAlign: 'center', marginBottom: '1rem', padding: '10px 16px',
          background: 'rgba(212,175,55,0.06)', borderRadius: '10px',
          border: '1px solid rgba(212,175,55,0.15)'
        }}>
          <span style={{ color: '#d4af37', fontFamily: "'Cinzel', serif", fontSize: '0.85rem' }}>
            {config.items[currentItemIdx]?.nombre}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginLeft: '8px' }}>
            ({currentItemIdx + 1} de {config.items.length})
          </span>
          <span
            onClick={() => {
              const newAll = [...allItemsDatos];
              newAll[currentItemIdx] = { ...datos };
              setAllItemsDatos(newAll);
              setMultiPhase('assign');
              setTipoElegido(null);
            }}
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '10px', textDecoration: 'underline' }}
          >
            cambiar
          </span>
        </div>
      )}
      <div style={s.progress}>
        {Array.from({ length: totalPasos }).map((_, i) => (
          <div key={i} style={{ ...s.dot, ...(i <= paso ? s.dotActive : {}) }} />
        ))}
      </div>
    </>
  );

  const NavButtons = ({ canNext = true, onNext }) => {
    const isLastItem = !multiMode || currentItemIdx >= (config?.items?.length || 1) - 1;
    const lastStepLabel = isLastItem
      ? 'Completar conexión'
      : `Siguiente: ${config.items[currentItemIdx + 1]?.nombre || 'guardián'} →`;

    return (
      <div style={{ marginTop: '1.5rem' }}>
        {paso < totalPasos - 1 ? (
          <button style={{ ...s.btn, opacity: canNext ? 1 : 0.5 }} disabled={!canNext} onClick={onNext || (() => setPaso(p => p + 1))}>
            Continuar
          </button>
        ) : (
          <button style={{ ...s.btn, opacity: enviando ? 0.6 : 1 }} disabled={enviando} onClick={enviar}>
            {enviando ? 'Enviando...' : lastStepLabel}
          </button>
        )}
        {paso > 0 && (
          <button style={s.btnSec} onClick={() => setPaso(p => p - 1)}>Atrás</button>
        )}
      </div>
    );
  };

  const Chips = ({ options, field, max }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {options.map(opt => {
        const selected = (datos[field] || []).includes(opt.value);
        const atMax = max && (datos[field] || []).length >= max && !selected;
        return (
          <div key={opt.value}
            style={{ ...s.chip, ...(selected ? s.chipActive : {}), opacity: atMax ? 0.4 : 1, cursor: atMax ? 'default' : 'pointer' }}
            onClick={() => !atMax && toggleArray(field, opt.value)}>
            {opt.label}
          </div>
        );
      })}
    </div>
  );

  // Chips de selección única
  const SingleChips = ({ options, field }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {options.map(opt => {
        const selected = datos[field] === opt.value;
        return (
          <div key={opt.value}
            style={{ ...s.chip, ...(selected ? s.chipActive : {}) }}
            onClick={() => updateDato(field, selected ? '' : opt.value)}>
            {opt.label}
          </div>
        );
      })}
    </div>
  );

  const tipoProductoOpts = [
    { value: 'duende', label: 'Duende' },
    { value: 'talisman', label: 'Talismán' },
    { value: 'cristal', label: 'Cristal' },
    { value: 'set', label: 'Set' },
    { value: 'otro', label: 'Otro' },
  ];

  const necesidadesOpts = [
    { value: 'proteccion', label: 'Protección / Sentirme segura' },
    { value: 'claridad', label: 'Claridad / Saber qué hacer' },
    { value: 'abundancia', label: 'Abundancia / Desbloquear lo que merezco' },
    { value: 'sanacion', label: 'Sanación / Soltar lo que me pesa' },
    { value: 'amor', label: 'Amor / Conexión genuina' },
    { value: 'fuerza', label: 'Fuerza / Seguir adelante' },
  ];

  // Checkbox reutilizable
  const Check = ({ checked, onToggle, label }) => (
    <div style={s.check} onClick={onToggle}>
      <div style={{ width: '22px', height: '22px', borderRadius: '4px', border: `2px solid ${checked ? '#d4af37' : '#555'}`, background: checked ? 'rgba(212,175,55,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', fontSize: '14px', color: '#d4af37' }}>
        {checked ? '✓' : ''}
      </div>
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: '1.4' }}>{label}</span>
    </div>
  );

  // Botón upload de foto
  const FotoBtn = ({ campo, labelText, uploading }) => (
    <div style={s.campo}>
      <label style={{ ...s.btn, display: 'block', textAlign: 'center', background: 'transparent', border: '1px dashed #d4af37', color: '#d4af37', opacity: uploading ? 0.6 : 1 }}>
        {uploading ? 'Subiendo...' : labelText}
        <input type="file" accept="image/*" onChange={e => subirFoto(e, campo)} disabled={uploading} style={{ display: 'none' }} />
      </label>
    </div>
  );

  // ═══════════ VÍA 1: PARA MÍ / VÍA 2: REGALO QUE SABE ═══════════
  if (formType === 'para_mi' || formType === 'regalo_sabe') {
    const esRegalo = formType === 'regalo_sabe';

    const pasos = [
      // Paso 0: Producto/guardián
      <>
        <div style={s.icon}>🔮</div>
        <h1 style={s.title}>Mostranos a tu guardián</h1>
        <p style={s.subtitle}>Una foto nos ayuda a canalizar mejor.</p>
        {esRegalo && <div style={s.highlight}>Alguien que te quiere eligió un guardián para vos.</div>}
        <div style={s.campo}>
          <label style={s.label}>¿Qué tipo de guardián es?</label>
          <SingleChips field="tipo_producto" options={tipoProductoOpts} />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Tiene nombre? (si lo sabés)</label>
          <input style={s.input} value={datos.nombre_producto} onChange={e => updateDato('nombre_producto', e.target.value)} placeholder="El nombre de tu guardián" />
        </div>
        {datos.foto_producto_url && <img src={datos.foto_producto_url} alt="Tu guardián" style={s.fotoPreview} />}
        <FotoBtn campo="foto_producto_url" labelText={datos.foto_producto_url ? 'Cambiar foto' : '📷 Subir foto del guardián'} uploading={subiendoFotoProducto} />
        <NavButtons />
      </>,

      // Paso 1: Nombre + momento
      <>
        <div style={s.icon}>{esRegalo ? '🎁' : '✦'}</div>
        <h1 style={s.title}>Tu guardián quiere conocerte</h1>
        <p style={s.subtitle}>No hay respuestas correctas — solo tu verdad.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Cómo te llamás?</label>
          <input style={s.input} value={datos.nombre_preferido} onChange={e => updateDato('nombre_preferido', e.target.value)} placeholder="Tu nombre o cómo te gustaría que te llame" />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Qué momento de tu vida estás atravesando?</label>
          <textarea style={s.textarea} value={datos.momento_vida} onChange={e => updateDato('momento_vida', e.target.value)} placeholder="Un cambio, una pérdida, un nuevo comienzo, una búsqueda..." />
        </div>
        <NavButtons canNext={datos.nombre_preferido.trim().length > 0} />
      </>,

      // Paso 2: Necesidades
      <>
        <div style={s.icon}>✦</div>
        <h1 style={s.title}>¿Qué necesitás?</h1>
        <p style={s.subtitle}>A veces lo que más necesitamos es lo que más nos cuesta pedir.</p>
        <Chips field="necesidades" options={necesidadesOpts} />
        <NavButtons />
      </>,

      // Paso 3: Mensaje + foto personal + confirmación
      <>
        <div style={s.icon}>💬</div>
        <h1 style={s.title}>Un mensaje y tu imagen</h1>
        <p style={s.subtitle}>Si pudieras decirle algo a alguien que realmente te escucha...</p>
        <div style={s.campo}>
          <textarea style={s.textarea} value={datos.mensaje_guardian} onChange={e => updateDato('mensaje_guardian', e.target.value)} placeholder="Algo que no le contás a nadie, algo que te pesa, algo que soñás..." />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.95rem', margin: '1.5rem 0 1rem' }}>
          Una imagen tuya ayuda a tu guardián a reconocerte.
        </p>
        {datos.foto_url && <img src={datos.foto_url} alt="Tu foto" style={s.fotoPreview} />}
        <FotoBtn campo="foto_url" labelText={datos.foto_url ? 'Cambiar foto' : '📷 Subir tu foto'} uploading={subiendoFoto} />
        <Check checked={datos.es_mayor_18} onToggle={() => updateDato('es_mayor_18', !datos.es_mayor_18)} label="Confirmo que soy mayor de 18 años" />
        <NavButtons canNext={datos.es_mayor_18} />
      </>
    ];

    return (
      <div style={s.page}>
        <div style={s.card}>
          <ProgressBar />
          {pasos[paso]}
        </div>
      </div>
    );
  }

  // ═══════════ VÍA 3: REGALO SORPRESA ═══════════
  if (formType === 'regalo_sorpresa') {
    const pasos = [
      // Paso 0: Producto/guardián
      <>
        <div style={s.icon}>🎁</div>
        <h1 style={s.title}>Lo que elegiste</h1>
        <p style={s.subtitle}>Mostranos lo que elegiste para esa persona especial.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Qué tipo de guardián es?</label>
          <SingleChips field="tipo_producto" options={tipoProductoOpts} />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Tiene nombre? (si lo sabés)</label>
          <input style={s.input} value={datos.nombre_producto} onChange={e => updateDato('nombre_producto', e.target.value)} placeholder="El nombre del guardián" />
        </div>
        {datos.foto_producto_url && <img src={datos.foto_producto_url} alt="El guardián" style={s.fotoPreview} />}
        <FotoBtn campo="foto_producto_url" labelText={datos.foto_producto_url ? 'Cambiar foto' : '📷 Subir foto del guardián'} uploading={subiendoFotoProducto} />
        <NavButtons />
      </>,

      // Paso 1: Sobre la persona
      <>
        <div style={s.icon}>💭</div>
        <h1 style={s.title}>Sobre esa persona</h1>
        <p style={s.subtitle}>Conocés a esta persona. Eso es valioso.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Cómo se llama?</label>
          <input style={s.input} value={datos.nombre_preferido} onChange={e => updateDato('nombre_preferido', e.target.value)} placeholder="Su nombre" />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Cuál es tu relación?</label>
          {['Pareja', 'Mamá', 'Papá', 'Hermana/o', 'Hija/o', 'Amiga/o', 'Otro'].map(r => (
            <div key={r} style={{ ...s.radio, ...(datos.relacion === r ? s.radioActive : {}) }} onClick={() => updateDato('relacion', r)}>
              {r}
            </div>
          ))}
        </div>
        <NavButtons canNext={datos.nombre_preferido.trim() && datos.relacion} />
      </>,

      // Paso 2: Su momento y esencia
      <>
        <div style={s.icon}>✦</div>
        <h1 style={s.title}>Su momento y esencia</h1>
        <p style={s.subtitle}>Pensá en {datos.nombre_preferido || 'esa persona'}. ¿Qué ves?</p>
        <div style={s.campo}>
          <label style={s.label}>¿Qué momento está atravesando?</label>
          <textarea style={s.textarea} value={datos.momento_vida} onChange={e => updateDato('momento_vida', e.target.value)} placeholder="Una separación, un duelo, un logro, una crisis..." />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Qué creés que necesita escuchar?</label>
          <textarea style={s.textarea} value={datos.que_necesita_escuchar} onChange={e => updateDato('que_necesita_escuchar', e.target.value)} placeholder="Algo que vos le dirías si pudieras..." />
        </div>
        <div style={s.campo}>
          <label style={s.label}>Su personalidad (elegí hasta 3)</label>
          <Chips field="personalidad" max={3} options={[
            { value: 'sensible', label: 'Sensible' }, { value: 'fuerte', label: 'Fuerte' },
            { value: 'soñadora', label: 'Soñadora' }, { value: 'practica', label: 'Práctica' },
            { value: 'reservada', label: 'Reservada' }, { value: 'expresiva', label: 'Expresiva' },
            { value: 'luchadora', label: 'Luchadora' }, { value: 'tranquila', label: 'Tranquila' },
          ]} />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Qué le hace brillar los ojos?</label>
          <textarea style={s.textarea} value={datos.que_le_hace_brillar} onChange={e => updateDato('que_le_hace_brillar', e.target.value)} placeholder="¿Qué la apasiona, qué la hace feliz?" />
        </div>
        <NavButtons />
      </>,

      // Paso 3: Foto + mensaje
      <>
        <div style={s.icon}>📷</div>
        <h1 style={s.title}>Foto y mensaje</h1>
        <p style={s.subtitle}>Si tenés una foto, ayuda. Si no, el amor que ponés ya dice mucho.</p>
        {datos.foto_url && <img src={datos.foto_url} alt="Foto" style={s.fotoPreview} />}
        <FotoBtn campo="foto_url" labelText={datos.foto_url ? 'Cambiar foto' : '📷 Subir foto de la persona'} uploading={subiendoFoto} />
        {datos.foto_url && (
          <Check checked={datos.es_mayor_18} onToggle={() => updateDato('es_mayor_18', !datos.es_mayor_18)} label="Confirmo que la persona es mayor de 18 años" />
        )}
        <div style={{ ...s.campo, marginTop: '1.5rem' }}>
          <label style={s.label}>¿Querés incluir un mensaje tuyo?</label>
          <textarea style={s.textarea} value={datos.mensaje_personal} onChange={e => updateDato('mensaje_personal', e.target.value)} placeholder="Un mensaje para incluir..." />
        </div>
        <Check checked={datos.es_anonimo} onToggle={() => updateDato('es_anonimo', !datos.es_anonimo)} label="Prefiero que sea anónimo" />
        <NavButtons canNext={!datos.foto_url || datos.es_mayor_18} />
      </>
    ];

    return (
      <div style={s.page}>
        <div style={s.card}>
          <ProgressBar />
          {pasos[paso]}
        </div>
      </div>
    );
  }

  // ═══════════ VÍA 4: PARA NIÑO/A ═══════════
  if (formType === 'para_nino') {
    const pasos = [
      // Paso 0: Producto/guardián
      <>
        <div style={s.icon}>🧸</div>
        <h1 style={s.title}>El guardián del pequeño/a</h1>
        <p style={s.subtitle}>Mostranos al guardián del pequeño/a.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Qué tipo de guardián es?</label>
          <SingleChips field="tipo_producto" options={tipoProductoOpts} />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Tiene nombre? (si lo sabés)</label>
          <input style={s.input} value={datos.nombre_producto} onChange={e => updateDato('nombre_producto', e.target.value)} placeholder="El nombre del guardián" />
        </div>
        {datos.foto_producto_url && <img src={datos.foto_producto_url} alt="El guardián" style={s.fotoPreview} />}
        <FotoBtn campo="foto_producto_url" labelText={datos.foto_producto_url ? 'Cambiar foto' : '📷 Subir foto del guardián'} uploading={subiendoFotoProducto} />
        <NavButtons />
      </>,

      // Paso 1: Datos del niño
      <>
        <div style={s.icon}>🌈</div>
        <h1 style={s.title}>Sobre el niño/a</h1>
        <p style={s.subtitle}>Los guardianes aman a los más pequeños.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Cómo se llama el niño/a?</label>
          <input style={s.input} value={datos.nombre_preferido} onChange={e => updateDato('nombre_preferido', e.target.value)} placeholder="Su nombre" />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Qué edad tiene?</label>
          {['3-6 años', '7-10 años', '11-14 años', '15-17 años'].map(e => (
            <div key={e} style={{ ...s.radio, ...(datos.edad_nino === e ? s.radioActive : {}) }} onClick={() => updateDato('edad_nino', e)}>
              {e}
            </div>
          ))}
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Cuál es tu relación?</label>
          {['Mamá', 'Papá', 'Abuela/o', 'Tía/o', 'Madrina/Padrino', 'Otro'].map(r => (
            <div key={r} style={{ ...s.radio, ...(datos.relacion_nino === r ? s.radioActive : {}) }} onClick={() => updateDato('relacion_nino', r)}>
              {r}
            </div>
          ))}
        </div>
        <NavButtons canNext={datos.nombre_preferido.trim() && datos.edad_nino && datos.relacion_nino} />
      </>,

      // Paso 2: Su mundo
      <>
        <div style={s.icon}>🌟</div>
        <h1 style={s.title}>Su mundo</h1>
        <p style={s.subtitle}>Contanos sobre {datos.nombre_preferido || 'el niño/a'}. ¿Cómo es?</p>
        <div style={s.campo}>
          <label style={s.label}>Personalidad</label>
          <Chips field="personalidad_nino" options={[
            { value: 'timido', label: 'Tímido/a' }, { value: 'sociable', label: 'Sociable' },
            { value: 'sensible', label: 'Sensible' }, { value: 'aventurero', label: 'Aventurero/a' },
            { value: 'creativo', label: 'Creativo/a' }, { value: 'curioso', label: 'Curioso/a' },
            { value: 'tranquilo', label: 'Tranquilo/a' },
          ]} />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Qué le gusta hacer?</label>
          <textarea style={s.textarea} value={datos.gustos_nino} onChange={e => updateDato('gustos_nino', e.target.value)} placeholder="Dibujar, jugar, leer, los animales..." />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Hay algo que esté necesitando?</label>
          <Chips field="necesidades_nino" options={[
            { value: 'miedos_nocturnos', label: 'Miedos nocturnos' },
            { value: 'cambios_familia', label: 'Cambios en la familia' },
            { value: 'escuela', label: 'Dificultades en la escuela' },
            { value: 'confianza', label: 'Necesita confianza' },
            { value: 'sensible', label: 'Está muy sensible' },
            { value: 'amigo_magico', label: 'Solo quiero que tenga un amigo mágico' },
          ]} />
        </div>
        <NavButtons />
      </>,

      // Paso 3: Confirmación (sin foto)
      <>
        <div style={s.icon}>🛡️</div>
        <h1 style={s.title}>Confirmación</h1>
        <div style={s.highlight}>
          Para proteger a los más pequeños, no pedimos fotos de menores.<br/>
          El guardián se conectará a través de tu amor y lo que nos contaste.
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Algo más que el guardián debería saber?</label>
          <textarea style={s.textarea} value={datos.info_extra_nino} onChange={e => updateDato('info_extra_nino', e.target.value)} placeholder="Cualquier cosa que ayude..." />
        </div>
        <Check checked={datos.es_mayor_18} onToggle={() => updateDato('es_mayor_18', !datos.es_mayor_18)} label="Entiendo y confirmo" />
        <NavButtons canNext={datos.es_mayor_18} />
      </>
    ];

    return (
      <div style={s.page}>
        <div style={s.card}>
          <ProgressBar />
          {pasos[paso]}
        </div>
      </div>
    );
  }

  // ═══════════ VÍA 5: PAREJA ═══════════
  if (formType === 'pareja') {
    const necesidadesParejaOpts = [
      { value: 'comunicacion', label: 'Comunicarnos mejor' },
      { value: 'reconectar', label: 'Reconectarnos' },
      { value: 'crisis', label: 'Atravesar una crisis juntos' },
      { value: 'celebrar', label: 'Celebrar lo que somos' },
      { value: 'proteccion', label: 'Proteger lo que construimos' },
      { value: 'nuevo_comienzo', label: 'Un nuevo comienzo juntos' },
    ];

    const pasos = [
      // Paso 0: Producto/guardián
      <>
        <div style={s.icon}>💑</div>
        <h1 style={s.title}>Su guardián de pareja</h1>
        <p style={s.subtitle}>Mostranos al guardián que los va a acompañar.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Qué tipo de guardián es?</label>
          <SingleChips field="tipo_producto" options={tipoProductoOpts} />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Tiene nombre? (si lo saben)</label>
          <input style={s.input} value={datos.nombre_producto} onChange={e => updateDato('nombre_producto', e.target.value)} placeholder="El nombre del guardián" />
        </div>
        {datos.foto_producto_url && <img src={datos.foto_producto_url} alt="El guardián" style={s.fotoPreview} />}
        <FotoBtn campo="foto_producto_url" labelText={datos.foto_producto_url ? 'Cambiar foto' : '📷 Subir foto del guardián'} uploading={subiendoFotoProducto} />
        <NavButtons />
      </>,

      // Paso 1: Sobre la pareja
      <>
        <div style={s.icon}>💑</div>
        <h1 style={s.title}>Sobre ustedes dos</h1>
        <p style={s.subtitle}>Tu guardián quiere conocerlos como pareja.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Cómo te llamás vos?</label>
          <input style={s.input} value={datos.nombre_preferido} onChange={e => updateDato('nombre_preferido', e.target.value)} placeholder="Tu nombre" />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Cómo se llama tu pareja?</label>
          <input style={s.input} value={datos.nombre_pareja} onChange={e => updateDato('nombre_pareja', e.target.value)} placeholder="Su nombre" />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Cuánto tiempo llevan juntos?</label>
          {['Menos de 1 año', '1-3 años', '3-10 años', 'Más de 10 años'].map(t => (
            <div key={t} style={{ ...s.radio, ...(datos.tiempo_juntos === t ? s.radioActive : {}) }} onClick={() => updateDato('tiempo_juntos', t)}>
              {t}
            </div>
          ))}
        </div>
        <NavButtons canNext={datos.nombre_preferido.trim() && datos.nombre_pareja.trim()} />
      </>,

      // Paso 2: Su momento como pareja
      <>
        <div style={s.icon}>✦</div>
        <h1 style={s.title}>Su momento juntos</h1>
        <p style={s.subtitle}>¿Qué están viviendo como pareja?</p>
        <div style={s.campo}>
          <label style={s.label}>¿Qué momento están atravesando juntos?</label>
          <textarea style={s.textarea} value={datos.momento_pareja} onChange={e => updateDato('momento_pareja', e.target.value)} placeholder="Un cambio, una mudanza, un duelo, una celebración, una crisis..." />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Qué necesitan como pareja?</label>
          <Chips field="necesidades_pareja" options={necesidadesParejaOpts} />
        </div>
        <NavButtons />
      </>,

      // Paso 3: Mensaje + foto + confirmación
      <>
        <div style={s.icon}>💬</div>
        <h1 style={s.title}>Un mensaje y su imagen</h1>
        <p style={s.subtitle}>Si pudieran decirle algo a alguien que realmente los escucha...</p>
        <div style={s.campo}>
          <textarea style={s.textarea} value={datos.mensaje_pareja} onChange={e => updateDato('mensaje_pareja', e.target.value)} placeholder="Lo que necesitan como pareja, lo que sueñan juntos, lo que les cuesta..." />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.95rem', margin: '1.5rem 0 1rem' }}>
          Una foto de ustedes juntos ayuda al guardián a reconocerlos.
        </p>
        {datos.foto_url && <img src={datos.foto_url} alt="Foto de pareja" style={{ ...s.fotoPreview, width: '140px', height: '100px', borderRadius: '12px' }} />}
        <FotoBtn campo="foto_url" labelText={datos.foto_url ? 'Cambiar foto' : '📷 Subir foto de ustedes'} uploading={subiendoFoto} />
        <Check checked={datos.es_mayor_18} onToggle={() => updateDato('es_mayor_18', !datos.es_mayor_18)} label="Confirmamos que ambos somos mayores de 18 años" />
        <NavButtons canNext={datos.es_mayor_18} />
      </>
    ];

    return (
      <div style={s.page}>
        <div style={s.card}>
          <ProgressBar />
          {pasos[paso]}
        </div>
      </div>
    );
  }

  // ═══════════ VÍA 6: FAMILIA ═══════════
  if (formType === 'familia') {
    const necesidadesFamiliaOpts = [
      { value: 'union', label: 'Unión / Estar más juntos' },
      { value: 'proteccion', label: 'Protección para la familia' },
      { value: 'sanacion', label: 'Sanar heridas familiares' },
      { value: 'transicion', label: 'Atravesar un cambio juntos' },
      { value: 'armonia', label: 'Armonía en casa' },
      { value: 'celebrar', label: 'Celebrar lo que somos' },
    ];

    const pasos = [
      // Paso 0: Producto/guardián
      <>
        <div style={s.icon}>🏠</div>
        <h1 style={s.title}>El guardián de la familia</h1>
        <p style={s.subtitle}>Mostranos al guardián que va a cuidar a toda la familia.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Qué tipo de guardián es?</label>
          <SingleChips field="tipo_producto" options={tipoProductoOpts} />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Tiene nombre? (si lo saben)</label>
          <input style={s.input} value={datos.nombre_producto} onChange={e => updateDato('nombre_producto', e.target.value)} placeholder="El nombre del guardián" />
        </div>
        {datos.foto_producto_url && <img src={datos.foto_producto_url} alt="El guardián" style={s.fotoPreview} />}
        <FotoBtn campo="foto_producto_url" labelText={datos.foto_producto_url ? 'Cambiar foto' : '📷 Subir foto del guardián'} uploading={subiendoFotoProducto} />
        <NavButtons />
      </>,

      // Paso 1: Sobre la familia
      <>
        <div style={s.icon}>🏠</div>
        <h1 style={s.title}>Sobre tu familia</h1>
        <p style={s.subtitle}>Tu guardián quiere conocerlos a todos.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Cómo te llamás vos?</label>
          <input style={s.input} value={datos.nombre_preferido} onChange={e => updateDato('nombre_preferido', e.target.value)} placeholder="Tu nombre" />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Quiénes forman tu familia?</label>
          <textarea style={s.textarea} value={datos.miembros_familia} onChange={e => updateDato('miembros_familia', e.target.value)} placeholder="Ej: mi pareja Juan, mis hijos Lucía (8) y Mateo (5), mi mamá Rosa..." />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Cómo es la dinámica de tu familia?</label>
          <textarea style={s.textarea} value={datos.dinamica_familia} onChange={e => updateDato('dinamica_familia', e.target.value)} placeholder="Cómo se llevan, qué los une, qué los hace especiales..." />
        </div>
        <NavButtons canNext={datos.nombre_preferido.trim() && datos.miembros_familia.trim()} />
      </>,

      // Paso 2: Su momento como familia
      <>
        <div style={s.icon}>✦</div>
        <h1 style={s.title}>Su momento familiar</h1>
        <p style={s.subtitle}>¿Qué están viviendo como familia?</p>
        <div style={s.campo}>
          <label style={s.label}>¿Qué momento están atravesando?</label>
          <textarea style={s.textarea} value={datos.momento_familia} onChange={e => updateDato('momento_familia', e.target.value)} placeholder="Una mudanza, la llegada de alguien nuevo, una pérdida, un nuevo comienzo..." />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Qué necesita tu familia?</label>
          <Chips field="necesidades_familia" options={necesidadesFamiliaOpts} />
        </div>
        <NavButtons />
      </>,

      // Paso 3: Mensaje + foto + confirmación
      <>
        <div style={s.icon}>💬</div>
        <h1 style={s.title}>Un mensaje y una imagen</h1>
        <p style={s.subtitle}>Si tu familia pudiera hablarle a alguien que realmente los escucha...</p>
        <div style={s.campo}>
          <textarea style={s.textarea} value={datos.mensaje_familia} onChange={e => updateDato('mensaje_familia', e.target.value)} placeholder="Lo que necesitan como familia, lo que sueñan juntos, lo que quieren sanar..." />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.95rem', margin: '1.5rem 0 1rem' }}>
          Una foto familiar ayuda al guardián a reconocerlos.
        </p>
        {datos.foto_url && <img src={datos.foto_url} alt="Foto familiar" style={{ ...s.fotoPreview, width: '140px', height: '100px', borderRadius: '12px' }} />}
        <FotoBtn campo="foto_url" labelText={datos.foto_url ? 'Cambiar foto' : '📷 Subir foto familiar'} uploading={subiendoFoto} />
        <Check checked={datos.es_mayor_18} onToggle={() => updateDato('es_mayor_18', !datos.es_mayor_18)} label="Confirmo que soy mayor de 18 años" />
        <NavButtons canNext={datos.es_mayor_18} />
      </>
    ];

    return (
      <div style={s.page}>
        <div style={s.card}>
          <ProgressBar />
          {pasos[paso]}
        </div>
      </div>
    );
  }

  // ═══════════ VÍA 7: RECONEXIÓN ═══════════
  if (formType === 'reconexion') {
    const pasos = [
      // Paso 0: Producto/guardián — reconexión
      <>
        <div style={s.icon}>🔮</div>
        <h1 style={s.title}>Tu guardián quiere reconectarse</h1>
        <p style={s.subtitle}>Mostranos cómo está tu guardián hoy — nos encanta ver cómo viven en sus nuevos hogares.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Qué tipo de guardián es?</label>
          <SingleChips field="tipo_producto" options={tipoProductoOpts} />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Cómo se llama?</label>
          <input style={s.input} value={datos.nombre_producto} onChange={e => updateDato('nombre_producto', e.target.value)} placeholder="El nombre de tu guardián" />
        </div>
        {datos.foto_producto_url && <img src={datos.foto_producto_url} alt="Tu guardián" style={s.fotoPreview} />}
        <FotoBtn campo="foto_producto_url" labelText={datos.foto_producto_url ? 'Cambiar foto' : '📷 Subir foto de tu guardián'} uploading={subiendoFotoProducto} />
        <NavButtons />
      </>,

      // Paso 1: ¿Qué está pasando ahora?
      <>
        <div style={s.icon}>✦</div>
        <h1 style={s.title}>¿Qué está pasando ahora?</h1>
        <p style={s.subtitle}>Ha pasado un tiempo... contanos cómo estás.</p>
        <div style={s.campo}>
          <label style={s.label}>¿Cómo te llamás?</label>
          <input style={s.input} value={datos.nombre_preferido} onChange={e => updateDato('nombre_preferido', e.target.value)} placeholder="Tu nombre o cómo te gustaría que te llame" />
        </div>
        <div style={s.campo}>
          <label style={s.label}>¿Qué cambió desde la última vez?</label>
          <textarea style={s.textarea} value={datos.momento_vida} onChange={e => updateDato('momento_vida', e.target.value)} placeholder="Nuevas situaciones, cambios, lo que estás viviendo ahora..." />
        </div>
        <NavButtons canNext={datos.nombre_preferido.trim().length > 0} />
      </>,

      // Paso 2: ¿Qué necesitás hoy?
      <>
        <div style={s.icon}>💬</div>
        <h1 style={s.title}>¿Qué necesitás hoy?</h1>
        <p style={s.subtitle}>Tu guardián quiere saber cómo acompañarte ahora.</p>
        <Chips field="necesidades" options={necesidadesOpts} />
        <div style={{ ...s.campo, marginTop: '1.5rem' }}>
          <label style={s.label}>¿Qué le dirías hoy a tu guardián?</label>
          <textarea style={s.textarea} value={datos.mensaje_guardian} onChange={e => updateDato('mensaje_guardian', e.target.value)} placeholder="Lo que necesitás decirle, lo que querés que sepa..." />
        </div>
        <NavButtons />
      </>,

      // Paso 3: Tu imagen
      <>
        <div style={s.icon}>📷</div>
        <h1 style={s.title}>Tu imagen</h1>
        <p style={s.subtitle}>Una foto tuya ayuda a tu guardián a reconectarse con vos.</p>
        {datos.foto_url && <img src={datos.foto_url} alt="Tu foto" style={s.fotoPreview} />}
        <FotoBtn campo="foto_url" labelText={datos.foto_url ? 'Cambiar foto' : '📷 Subir tu foto'} uploading={subiendoFoto} />
        <Check checked={datos.es_mayor_18} onToggle={() => updateDato('es_mayor_18', !datos.es_mayor_18)} label="Confirmo que soy mayor de 18 años" />
        <NavButtons canNext={datos.es_mayor_18} />
      </>
    ];

    return (
      <div style={s.page}>
        <div style={s.card}>
          <ProgressBar />
          {pasos[paso]}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>🔮</div>
        <h1 style={s.title}>Formulario no disponible</h1>
        <p style={s.subtitle}>Tipo de formulario no reconocido.</p>
      </div>
    </div>
  );
}

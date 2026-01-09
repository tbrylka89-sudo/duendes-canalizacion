'use client';
import { useState, useEffect } from 'react';

const API_BASE = '';
const ADMIN_KEY = 'DuendesAdmin2026';

// ═══════════════════════════════════════════════════════════════
// RANGOS DE USUARIO
// ═══════════════════════════════════════════════════════════════

const RANGOS = [
  { id: 'semilla', nombre: 'Semilla Mágica', min: 0, icono: '🌱', color: '#90EE90', beneficio: 'Bienvenida al mundo elemental' },
  { id: 'brote', nombre: 'Brote de Luz', min: 50, icono: '🌿', color: '#98FB98', beneficio: '5% extra en tréboles' },
  { id: 'aprendiz', nombre: 'Aprendiz Elemental', min: 150, icono: '✨', color: '#d4af37', beneficio: '1 tirada gratis' },
  { id: 'guardian', nombre: 'Guardiana del Bosque', min: 300, icono: '🌳', color: '#228B22', beneficio: '10% descuento permanente' },
  { id: 'hechicera', nombre: 'Hechicera de Cristal', min: 500, icono: '💎', color: '#9b59b6', beneficio: 'Acceso anticipado 72hs' },
  { id: 'alquimista', nombre: 'Alquimista del Alba', min: 800, icono: '⚗️', color: '#e74c3c', beneficio: '15% descuento + 1 lectura/mes' },
  { id: 'maestra', nombre: 'Maestra Elemental', min: 1200, icono: '👑', color: '#f39c12', beneficio: 'Todo lo anterior + sorpresas' }
];

// ═══════════════════════════════════════════════════════════════
// TEMPLATES DE EMAIL
// ═══════════════════════════════════════════════════════════════

const EMAIL_TEMPLATES = {
  bienvenida: { asunto: '✨ Bienvenida a Duendes del Uruguay, {nombre}', categoria: 'sistema' },
  compra: { asunto: '🎁 Tu guardián está en camino, {nombre}', categoria: 'compras' },
  envio: { asunto: '📦 Tu pedido ya salió - Seguimiento', categoria: 'compras' },
  entrega: { asunto: '🏠 ¡Tu guardián llegó! Ritual de bienvenida', categoria: 'compras' },
  regalo: { asunto: '🎁 {remitente} te envió un regalo mágico', categoria: 'regalos' },
  circuloBienvenida: { asunto: '★ Bienvenida al Círculo de Duendes', categoria: 'circulo' },
  circuloContenido: { asunto: '✦ Nuevo contenido exclusivo del Círculo', categoria: 'circulo' },
  circuloVencer: { asunto: '⏰ Tu membresía vence pronto', categoria: 'circulo' },
  circuloVencida: { asunto: '💫 Te extrañamos en el Círculo', categoria: 'circulo' },
  lecturaLista: { asunto: '📜 Tu lectura está lista, {nombre}', categoria: 'lecturas' },
  subisteRango: { asunto: '🎉 ¡Subiste de rango! Ahora sos {rango}', categoria: 'sistema' },
  cumpleanos: { asunto: '🎂 ¡Feliz cumpleaños, {nombre}! Tu regalo te espera', categoria: 'sistema' },
  reactivacion: { asunto: '💝 Te extrañamos, {nombre}', categoria: 'marketing' },
  descuentoSorpresa: { asunto: '🎁 Sorpresa especial solo para vos', categoria: 'marketing' },
  resenaGracias: { asunto: '💕 Gracias por tu reseña, {nombre}', categoria: 'sistema' }
};

// ═══════════════════════════════════════════════════════════════
// CATEGORÍAS DE CONTENIDO CÍRCULO - PREMIUM
// ═══════════════════════════════════════════════════════════════

const CATEGORIAS_CONTENIDO = [
  { id: 'cosmos', nombre: 'Cosmos y Luna', icono: '🌙', color: '#1a1a2e', temas: ['Fases lunares', 'Eclipses', 'Astrología', 'Rituales lunares'] },
  { id: 'duendes', nombre: 'Mundo Duende', icono: '🧙', color: '#2d5016', temas: ['Historia', 'Tipos', 'Comunicación', 'Rituales'] },
  { id: 'diy', nombre: 'DIY Mágico', icono: '✂️', color: '#8b4513', temas: ['Velas', 'Altares', 'Amuletos', 'Decoración'] },
  { id: 'esoterico', nombre: 'Esotérico', icono: '🔮', color: '#4a0080', temas: ['Tarot', 'Runas', 'Cristales', 'Numerología'] },
  { id: 'sanacion', nombre: 'Sanación', icono: '💚', color: '#0d7377', temas: ['Chakras', 'Limpieza', 'Meditación', 'Hierbas'] },
  { id: 'celebraciones', nombre: 'Celebraciones', icono: '🎉', color: '#c9a227', temas: ['Sabbats', 'Lunas especiales', 'Solsticios', 'Equinoccios'] }
];

const TIPOS_CONTENIDO = [
  { id: 'articulo', nombre: 'Artículo', desc: 'Texto educativo o informativo', icono: '📄' },
  { id: 'guia', nombre: 'Guía Práctica', desc: 'Paso a paso de algo', icono: '📋' },
  { id: 'ritual', nombre: 'Ritual', desc: 'Ritual completo con instrucciones', icono: '🕯️' },
  { id: 'meditacion', nombre: 'Meditación', desc: 'Guía de meditación escrita', icono: '🧘' },
  { id: 'diy', nombre: 'DIY/Tutorial', desc: 'Proyecto para hacer', icono: '✂️' },
  { id: 'lectura', nombre: 'Lectura Colectiva', desc: 'Mensaje para todos', icono: '🔮' },
  { id: 'receta', nombre: 'Receta Mágica', desc: 'Preparación (té, agua, etc)', icono: '🫖' }
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL ADMIN
// ═══════════════════════════════════════════════════════════════

export default function AdminPanel() {
  const [auth, setAuth] = useState(false);
  const [key, setKey] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [titoAbierto, setTitoAbierto] = useState(false);
  const [stats, setStats] = useState(null);
  
  // Estados para modales globales (desde Dashboard)
  const [modalGlobal, setModalGlobal] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('key') === ADMIN_KEY) {
      setAuth(true);
      cargarStats();
    }
  }, []);
  
  const cargarStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch(e) {}
  };
  
  const login = () => {
    if (key === ADMIN_KEY) {
      setAuth(true);
      cargarStats();
      window.history.pushState({}, '', `?key=${key}`);
    }
  };
  
  if (!auth) {
    return (
      <div className="login-page">
        <style jsx global>{estilosAdmin}</style>
        <div className="login-box">
          <h1>✦ Panel Admin</h1>
          <p>Duendes del Uruguay</p>
          <input type="password" placeholder="Clave de acceso" value={key} onChange={e => setKey(e.target.value)} onKeyPress={e => e.key === 'Enter' && login()} />
          <button onClick={login}>Entrar</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin">
      <style jsx global>{estilosAdmin}</style>
      
      <header className="admin-header">
        <div className="admin-logo">✦ Panel Admin</div>
        <div className="admin-user">Thibisay & Gabriel</div>
      </header>
      
      <nav className="admin-nav">
        {[
          ['dashboard', '◇', 'Dashboard'],
          ['clientes', '👥', 'Clientes'],
          ['contenido', '📝', 'Contenido'],
          ['circulo', '★', 'Círculo'],
          ['regalos', '🎁', 'Regalos'],
          ['anticipado', '🚀', 'Anticipado'],
          ['emails', '📧', 'Emails'],
          ['config', '⚙️', 'Config']
        ].map(([k, i, t]) => (
          <button key={k} className={`nav-btn ${tab === k ? 'act' : ''}`} onClick={() => setTab(k)}>
            <span>{i}</span>{t}
          </button>
        ))}
      </nav>
      
      <main className="admin-main">
        {tab === 'dashboard' && <Dashboard stats={stats} setTab={setTab} setTitoAbierto={setTitoAbierto} setModalGlobal={setModalGlobal} />}
        {tab === 'clientes' && <Clientes />}
        {tab === 'contenido' && <Contenido />}
        {tab === 'circulo' && <CirculoAdmin />}
        {tab === 'regalos' && <Regalos />}
        {tab === 'anticipado' && <Anticipado />}
        {tab === 'emails' && <Emails modalGlobal={modalGlobal} setModalGlobal={setModalGlobal} />}
        {tab === 'config' && <Config />}
      </main>
      
      <TitoAdmin abierto={titoAbierto} setAbierto={setTitoAbierto} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD - CON BOTONES FUNCIONANDO
// ═══════════════════════════════════════════════════════════════

function Dashboard({ stats, setTab, setTitoAbierto, setModalGlobal }) {
  const hoy = new Date().toLocaleDateString('es-UY', { weekday: 'long', day: 'numeric', month: 'long' });
  
  // Acciones rápidas que navegan o abren modales
  const accionesRapidas = [
    { icono: '📜', texto: 'Nueva Lectura', accion: () => setTab('clientes') },
    { icono: '📝', texto: 'Crear Contenido', accion: () => setTab('contenido') },
    { icono: '🎁', texto: 'Enviar Regalo', accion: () => setTab('regalos') },
    { icono: '📧', texto: 'Email Masivo', accion: () => { setModalGlobal('email'); setTab('emails'); } },
    { icono: '🚀', texto: 'Nuevo Anticipado', accion: () => setTab('anticipado') },
    { icono: '💬', texto: 'Hablar con Tito', accion: () => setTitoAbierto(true) }
  ];
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h1>Buenos días ✨</h1>
        <p>{hoy}</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card gold">
          <span className="stat-icon">💰</span>
          <div className="stat-value">${stats?.ingresosMes || 0}</div>
          <div className="stat-label">Ingresos este mes</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🛒</span>
          <div className="stat-value">{stats?.ventasMes || 0}</div>
          <div className="stat-label">Ventas este mes</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">★</span>
          <div className="stat-value">{stats?.miembrosCirculo || 0}</div>
          <div className="stat-label">Miembros Círculo</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-value">{stats?.clientesTotal || 0}</div>
          <div className="stat-label">Clientes totales</div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dash-card">
          <h3>⏰ Pendientes</h3>
          <div className="pendientes">
            <div className="pend-item"><span>📦</span> {stats?.pedidosPendientes || 0} pedidos por enviar</div>
            <div className="pend-item"><span>📜</span> {stats?.lecturasPendientes || 0} lecturas por hacer</div>
            <div className="pend-item"><span>★</span> {stats?.circulosPorVencer || 0} círculos por vencer</div>
          </div>
        </div>
        
        <div className="dash-card">
          <h3>🏆 Top Clientes</h3>
          <div className="top-list">
            {(stats?.topClientes || []).slice(0, 5).map((c, i) => (
              <div key={i} className="top-item">
                <span className="top-pos">{i + 1}</span>
                <span className="top-name">{c.nombre}</span>
                <span className="top-val">${c.gastado}</span>
              </div>
            ))}
            {(!stats?.topClientes || stats.topClientes.length === 0) && (
              <p className="empty-small">Sin datos aún</p>
            )}
          </div>
        </div>
        
        <div className="dash-card">
          <h3>📊 Actividad Reciente</h3>
          <div className="actividad">
            {(stats?.actividad || []).slice(0, 5).map((a, i) => (
              <div key={i} className="act-item">
                <span className="act-icon">{a.icono}</span>
                <span className="act-text">{a.texto}</span>
                <span className="act-time">{a.tiempo}</span>
              </div>
            ))}
            {(!stats?.actividad || stats.actividad.length === 0) && (
              <p className="empty-small">Sin actividad reciente</p>
            )}
          </div>
        </div>
        
        <div className="dash-card">
          <h3>📅 Esta Semana</h3>
          <div className="semana">
            <p><strong>Luna:</strong> {stats?.faseLunar || 'Cargando...'}</p>
            <p><strong>Contenido:</strong> {stats?.tematicaSemana || 'Por definir'}</p>
            <p><strong>Sabbat:</strong> {stats?.sabbatProximo || '-'}</p>
          </div>
        </div>
      </div>
      
      <div className="acciones-rapidas">
        <h3>Acciones Rápidas</h3>
        <div className="acciones-grid">
          {accionesRapidas.map((a, i) => (
            <button key={i} className="accion" onClick={a.accion}>
              <span>{a.icono}</span>
              {a.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLIENTES - CON ACCIONES FUNCIONANDO
// ═══════════════════════════════════════════════════════════════

function Clientes() {
  const [busqueda, setBusqueda] = useState('');
  const [cliente, setCliente] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [tab, setTab] = useState('info');
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [formNuevo, setFormNuevo] = useState({ email: '', nombre: '' });
  
  // Estados para modales de acciones
  const [modalAccion, setModalAccion] = useState(null);
  const [cantidadRegalo, setCantidadRegalo] = useState(10);
  const [mensajeRegalo, setMensajeRegalo] = useState('');
  const [diasCirculo, setDiasCirculo] = useState(15);
  const [enviandoAccion, setEnviandoAccion] = useState(false);
  const [resultadoAccion, setResultadoAccion] = useState(null);
  
  const buscar = async () => {
    if (!busqueda.trim()) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/clientes/buscar?q=${busqueda}`);
      const data = await res.json();
      if (data.clientes?.length === 1) {
        setCliente(data.clientes[0]);
      } else {
        setClientes(data.clientes || []);
        setCliente(null);
      }
    } catch(e) {}
    setCargando(false);
  };
  
  const crearCliente = async () => {
    if (!formNuevo.email) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/clientes/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formNuevo)
      });
      const data = await res.json();
      if (data.success) {
        setCliente(data.cliente);
        setNuevoCliente(false);
        setFormNuevo({ email: '', nombre: '' });
      }
    } catch(e) {}
  };
  
  const modificarCliente = async (campo, valor) => {
    try {
      await fetch(`${API_BASE}/api/admin/clientes/modificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cliente.email, campo, valor })
      });
      setCliente({ ...cliente, [campo]: valor });
    } catch(e) {}
  };
  
  const ejecutarAccion = async () => {
    if (!cliente) return;
    setEnviandoAccion(true);
    setResultadoAccion(null);
    
    try {
      let res;
      switch(modalAccion) {
        case 'runas':
          res = await fetch(`${API_BASE}/api/admin/regalos/enviar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cliente.email, tipo: 'runas', cantidad: cantidadRegalo, mensaje: mensajeRegalo })
          });
          break;
        case 'treboles':
          res = await fetch(`${API_BASE}/api/admin/regalos/enviar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cliente.email, tipo: 'treboles', cantidad: cantidadRegalo, mensaje: mensajeRegalo })
          });
          break;
        case 'circulo':
          res = await fetch(`${API_BASE}/api/admin/regalos/enviar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cliente.email, tipo: 'circulo', cantidad: diasCirculo, mensaje: mensajeRegalo })
          });
          break;
        case 'email':
          res = await fetch(`${API_BASE}/api/admin/emails/masivo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destinatarios: 'individual', email: cliente.email, asunto: '✨ Mensaje de Duendes del Uruguay', mensaje: mensajeRegalo })
          });
          break;
      }
      
      const data = await res.json();
      if (data.success) {
        setResultadoAccion('✅ ¡Listo!');
        if (modalAccion === 'runas') setCliente({ ...cliente, runas: (cliente.runas || 0) + cantidadRegalo });
        else if (modalAccion === 'treboles') setCliente({ ...cliente, treboles: (cliente.treboles || 0) + cantidadRegalo });
        else if (modalAccion === 'circulo') setCliente({ ...cliente, esCirculo: true });
        setTimeout(() => { setModalAccion(null); setResultadoAccion(null); setCantidadRegalo(10); setMensajeRegalo(''); }, 1500);
      } else {
        setResultadoAccion('❌ Error: ' + (data.error || 'Algo falló'));
      }
    } catch(e) {
      setResultadoAccion('❌ Error de conexión');
    }
    setEnviandoAccion(false);
  };
  
  const getRango = (gastado) => {
    const g = gastado || 0;
    for (let i = RANGOS.length - 1; i >= 0; i--) {
      if (g >= RANGOS[i].min) return RANGOS[i];
    }
    return RANGOS[0];
  };
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h1>👥 Gestión de Clientes</h1>
        <button className="btn-nuevo" onClick={() => setNuevoCliente(true)}>+ Crear Cliente</button>
      </div>
      
      <div className="buscador">
        <input placeholder="Email, nombre o teléfono..." value={busqueda} onChange={e => setBusqueda(e.target.value)} onKeyPress={e => e.key === 'Enter' && buscar()} />
        <button onClick={buscar} disabled={cargando}>{cargando ? '...' : '🔍 Buscar'}</button>
      </div>
      
      {clientes.length > 1 && !cliente && (
        <div className="resultados-lista">
          {clientes.map((c, i) => (
            <div key={i} className="resultado-item" onClick={() => { setCliente(c); setClientes([]); }}>
              <strong>{c.nombre || c.email}</strong>
              <span>{c.email}</span>
              <span className="rango-mini">{getRango(c.gastado).icono}</span>
            </div>
          ))}
        </div>
      )}
      
      {cliente && (
        <div className="cliente-detalle">
          <div className="cliente-header">
            <div className="cliente-avatar">{cliente.nombre?.[0] || '?'}</div>
            <div className="cliente-info">
              <h2>{cliente.nombre || 'Sin nombre'}</h2>
              <p>{cliente.email}</p>
              <div className="cliente-rango" style={{ background: getRango(cliente.gastado).color }}>
                {getRango(cliente.gastado).icono} {getRango(cliente.gastado).nombre}
              </div>
            </div>
            <div className="cliente-stats">
              <div><strong>${cliente.gastado || 0}</strong><span>Gastado</span></div>
              <div><strong>{cliente.runas || 0}</strong><span>Runas</span></div>
              <div><strong>{cliente.treboles || 0}</strong><span>Tréboles</span></div>
              <div><strong>{cliente.guardianes?.length || 0}</strong><span>Guardianes</span></div>
            </div>
          </div>
          
          <div className="cliente-tabs">
            {[['info', '📋 Info'], ['compras', '🛒 Compras'], ['lecturas', '📜 Lecturas'], ['acciones', '⚡ Acciones']].map(([k, t]) => (
              <button key={k} className={tab === k ? 'act' : ''} onClick={() => setTab(k)}>{t}</button>
            ))}
          </div>
          
          {tab === 'info' && (
            <div className="cliente-tab">
              <div className="info-grid">
                <div className="info-item">
                  <label>Nombre preferido</label>
                  <input value={cliente.nombrePreferido || ''} onChange={e => modificarCliente('nombrePreferido', e.target.value)} />
                </div>
                <div className="info-item">
                  <label>Teléfono</label>
                  <input value={cliente.telefono || ''} onChange={e => modificarCliente('telefono', e.target.value)} />
                </div>
                <div className="info-item">
                  <label>País</label>
                  <input value={cliente.pais || ''} onChange={e => modificarCliente('pais', e.target.value)} />
                </div>
                <div className="info-item">
                  <label>Cumpleaños</label>
                  <input type="date" value={cliente.cumpleanos || ''} onChange={e => modificarCliente('cumpleanos', e.target.value)} />
                </div>
                <div className="info-item full">
                  <label>Notas internas</label>
                  <textarea value={cliente.notas || ''} onChange={e => modificarCliente('notas', e.target.value)} rows={3} />
                </div>
                <div className="info-item">
                  <label>Miembro Círculo</label>
                  <span className={cliente.esCirculo ? 'badge-si' : 'badge-no'}>{cliente.esCirculo ? `Sí (hasta ${cliente.circuloExpira})` : 'No'}</span>
                </div>
                <div className="info-item">
                  <label>Token Mi Magia</label>
                  <code>{cliente.token}</code>
                  <button className="btn-mini" onClick={() => navigator.clipboard.writeText(`https://duendes-vercel.vercel.app/mi-magia?token=${cliente.token}`)}>Copiar link</button>
                </div>
              </div>
            </div>
          )}
          
          {tab === 'compras' && (
            <div className="cliente-tab">
              <h3>Historial de Compras</h3>
              {cliente.compras?.length > 0 ? (
                <div className="compras-lista">
                  {cliente.compras.map((c, i) => (
                    <div key={i} className="compra-item">
                      <span className="compra-fecha">{c.fecha}</span>
                      <span className="compra-prod">{c.producto}</span>
                      <span className="compra-precio">${c.precio}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty">Sin compras registradas</p>
              )}
            </div>
          )}
          
          {tab === 'lecturas' && (
            <div className="cliente-tab">
              <h3>Lecturas Realizadas</h3>
              {cliente.lecturas?.length > 0 ? (
                <div className="lecturas-lista">
                  {cliente.lecturas.map((l, i) => (
                    <div key={i} className="lectura-item">
                      <span>{l.fecha}</span>
                      <strong>{l.tipo}</strong>
                      <button className="btn-mini">Ver</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty">Sin lecturas</p>
              )}
            </div>
          )}
          
          {tab === 'acciones' && (
            <div className="cliente-tab">
              <h3>Acciones Rápidas</h3>
              <div className="acciones-cliente">
                <AccionCliente icono="🎁" titulo="Regalar Runas" onClick={() => setModalAccion('runas')} />
                <AccionCliente icono="☘" titulo="Regalar Tréboles" onClick={() => setModalAccion('treboles')} />
                <AccionCliente icono="★" titulo="Dar Círculo Gratis" onClick={() => setModalAccion('circulo')} />
                <AccionCliente icono="📧" titulo="Enviar Email" onClick={() => setModalAccion('email')} />
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* MODALES */}
      {nuevoCliente && (
        <div className="modal-overlay" onClick={() => setNuevoCliente(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Crear Nuevo Cliente</h2>
            <div className="form-group"><label>Email *</label><input value={formNuevo.email} onChange={e => setFormNuevo({...formNuevo, email: e.target.value})} /></div>
            <div className="form-group"><label>Nombre</label><input value={formNuevo.nombre} onChange={e => setFormNuevo({...formNuevo, nombre: e.target.value})} /></div>
            <div className="modal-actions">
              <button className="btn-sec" onClick={() => setNuevoCliente(false)}>Cancelar</button>
              <button className="btn-pri" onClick={crearCliente}>Crear</button>
            </div>
          </div>
        </div>
      )}
      
      {(modalAccion === 'runas' || modalAccion === 'treboles') && (
        <div className="modal-overlay" onClick={() => setModalAccion(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modalAccion === 'runas' ? '🎁 Regalar Runas' : '☘ Regalar Tréboles'}</h2>
            <p>Para: <strong>{cliente?.nombre || cliente?.email}</strong></p>
            <div className="form-group"><label>Cantidad</label>
              <div className="cantidad-btns">
                {[5, 10, 20, 50, 100].map(n => (
                  <button key={n} className={cantidadRegalo === n ? 'act' : ''} onClick={() => setCantidadRegalo(n)}>{n}</button>
                ))}
              </div>
            </div>
            <div className="form-group"><label>Mensaje (opcional)</label><textarea value={mensajeRegalo} onChange={e => setMensajeRegalo(e.target.value)} placeholder="Un mensaje cariñoso..." rows={2} /></div>
            {resultadoAccion && <div className={`resultado ${resultadoAccion.includes('Error') ? 'error' : 'ok'}`}>{resultadoAccion}</div>}
            <div className="modal-actions">
              <button className="btn-sec" onClick={() => setModalAccion(null)}>Cancelar</button>
              <button className="btn-pri" onClick={ejecutarAccion} disabled={enviandoAccion}>{enviandoAccion ? 'Enviando...' : 'Enviar Regalo'}</button>
            </div>
          </div>
        </div>
      )}
      
      {modalAccion === 'circulo' && (
        <div className="modal-overlay" onClick={() => setModalAccion(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>★ Dar Círculo Gratis</h2>
            <p>Para: <strong>{cliente?.nombre || cliente?.email}</strong></p>
            <div className="form-group"><label>Días de membresía</label>
              <div className="cantidad-btns">
                {[7, 15, 30, 60, 90].map(n => (
                  <button key={n} className={diasCirculo === n ? 'act' : ''} onClick={() => setDiasCirculo(n)}>{n} días</button>
                ))}
              </div>
            </div>
            <div className="form-group"><label>Mensaje (opcional)</label><textarea value={mensajeRegalo} onChange={e => setMensajeRegalo(e.target.value)} placeholder="Bienvenida al Círculo..." rows={2} /></div>
            {resultadoAccion && <div className={`resultado ${resultadoAccion.includes('Error') ? 'error' : 'ok'}`}>{resultadoAccion}</div>}
            <div className="modal-actions">
              <button className="btn-sec" onClick={() => setModalAccion(null)}>Cancelar</button>
              <button className="btn-pri" onClick={ejecutarAccion} disabled={enviandoAccion}>{enviandoAccion ? 'Activando...' : 'Activar Círculo'}</button>
            </div>
          </div>
        </div>
      )}
      
      {modalAccion === 'email' && (
        <div className="modal-overlay" onClick={() => setModalAccion(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>📧 Enviar Email</h2>
            <p>Para: <strong>{cliente?.nombre || cliente?.email}</strong></p>
            <div className="form-group"><label>Mensaje</label><textarea value={mensajeRegalo} onChange={e => setMensajeRegalo(e.target.value)} placeholder="Tu mensaje personalizado..." rows={5} /></div>
            {resultadoAccion && <div className={`resultado ${resultadoAccion.includes('Error') ? 'error' : 'ok'}`}>{resultadoAccion}</div>}
            <div className="modal-actions">
              <button className="btn-sec" onClick={() => setModalAccion(null)}>Cancelar</button>
              <button className="btn-pri" onClick={ejecutarAccion} disabled={enviandoAccion || !mensajeRegalo.trim()}>{enviandoAccion ? 'Enviando...' : 'Enviar Email'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AccionCliente({ icono, titulo, onClick }) {
  return (
    <button className="accion-cliente" onClick={onClick}>
      <span>{icono}</span>
      <span>{titulo}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTENIDO - PREMIUM CON VISTA PREVIA ESTÉTICA
// ═══════════════════════════════════════════════════════════════

function Contenido() {
  const [modo, setModo] = useState('crear');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('articulo');
  const [tema, setTema] = useState('');
  const [temaPersonalizado, setTemaPersonalizado] = useState('');
  const [opciones, setOpciones] = useState({ tono: 'cercano', longitud: 'medio', incluirRitual: true, incluirCristales: false });
  const [generando, setGenerando] = useState(false);
  const [contenido, setContenido] = useState(null);
  const [imagenGenerada, setImagenGenerada] = useState(null);
  const [generandoImg, setGenerandoImg] = useState(false);
  
  const generarContenido = async () => {
    setGenerando(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/contenido/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
        body: JSON.stringify({ tematica: categoria, tipo, tema: tema || temaPersonalizado, opciones, adminKey: ADMIN_KEY })
      });
      const data = await res.json();
      if (data.success && data.contenido) {
        setContenido(data.contenido);
      } else {
        alert('Error generando contenido');
      }
    } catch(e) { alert('Error de conexión'); }
    setGenerando(false);
  };
  
  const generarImagen = async () => {
    if (!contenido) return;
    setGenerandoImg(true);
    try {
      const prompt = `Imagen mística y mágica para contenido sobre ${categoria}: ${contenido.titulo}. Estilo watercolor, colores dorados y verdes, atmósfera de bosque encantado con cristales brillantes.`;
      const res = await fetch(`${API_BASE}/api/admin/imagen/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, estilo: 'magico' })
      });
      const data = await res.json();
      if (data.url) setImagenGenerada(data.url);
    } catch(e) {}
    setGenerandoImg(false);
  };
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h1>📝 Creador de Contenido</h1>
        <div className="panel-tabs">
          <button className={modo === 'crear' ? 'act' : ''} onClick={() => setModo('crear')}>✨ Crear</button>
          <button className={modo === 'historial' ? 'act' : ''} onClick={() => setModo('historial')}>📚 Historial</button>
          <button className={modo === 'imagenes' ? 'act' : ''} onClick={() => setModo('imagenes')}>🎨 Imágenes IA</button>
        </div>
      </div>
      
      {modo === 'crear' && (
        <div className="contenido-crear">
          <div className="crear-form">
            <div className="form-section">
              <h3>1. Tipo de contenido</h3>
              <div className="tipos-grid-pro">
                {TIPOS_CONTENIDO.map(t => (
                  <button key={t.id} className={`tipo-btn-pro ${tipo === t.id ? 'act' : ''}`} onClick={() => setTipo(t.id)}>
                    <span className="tipo-icono-big">{t.icono}</span>
                    <strong>{t.nombre}</strong>
                    <small>{t.desc}</small>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-section">
              <h3>2. Categoría</h3>
              <div className="cats-grid-pro">
                {CATEGORIAS_CONTENIDO.map(c => (
                  <button key={c.id} className={`cat-btn-pro ${categoria === c.id ? 'act' : ''}`} onClick={() => setCategoria(c.id)} style={{'--cat-color': c.color}}>
                    <span className="cat-icono">{c.icono}</span>
                    <span>{c.nombre}</span>
                  </button>
                ))}
              </div>
              {categoria && (
                <div className="temas-sugeridos">
                  <p>Temas sugeridos:</p>
                  <div className="temas-btns">
                    {CATEGORIAS_CONTENIDO.find(c => c.id === categoria)?.temas.map(t => (
                      <button key={t} className={tema === t ? 'act' : ''} onClick={() => setTema(t)}>{t}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section">
              <h3>3. Tema específico (opcional)</h3>
              <input placeholder="Ej: Ritual de luna llena para abundancia en enero" value={temaPersonalizado} onChange={e => setTemaPersonalizado(e.target.value)} />
            </div>
            
            <button className="btn-generar-pro" onClick={generarContenido} disabled={generando || !categoria}>
              {generando ? '✨ Claude está creando...' : '✨ Generar con Claude'}
            </button>
          </div>
          
          {contenido && (
            <div className="contenido-preview-pro">
              <div className="preview-header-pro">
                <div className="preview-badge" style={{background: CATEGORIAS_CONTENIDO.find(c => c.id === categoria)?.color}}>
                  {CATEGORIAS_CONTENIDO.find(c => c.id === categoria)?.icono} {CATEGORIAS_CONTENIDO.find(c => c.id === categoria)?.nombre}
                </div>
                <div className="preview-actions">
                  <button className="btn-sec" onClick={generarImagen} disabled={generandoImg}>
                    {generandoImg ? '🎨 Generando...' : '🎨 Imagen con Leonardo'}
                  </button>
                  <button className="btn-gold">📤 Publicar</button>
                </div>
              </div>
              
              {imagenGenerada && (
                <div className="preview-imagen">
                  <img src={imagenGenerada} alt="Imagen generada" />
                </div>
              )}
              
              <div className="preview-content-pro">
                <h1>{contenido.titulo}</h1>
                {contenido.subtitulo && <p className="subtitulo">{contenido.subtitulo}</p>}
                
                {contenido.contenidoPrincipal && (
                  <div className="contenido-body">
                    {contenido.contenidoPrincipal.introduccion && <p className="intro">{contenido.contenidoPrincipal.introduccion}</p>}
                    {contenido.contenidoPrincipal.desarrollo && <div className="desarrollo">{contenido.contenidoPrincipal.desarrollo}</div>}
                    {contenido.contenidoPrincipal.ritual && (
                      <div className="ritual-box">
                        <h3>🕯️ Ritual</h3>
                        <p>{contenido.contenidoPrincipal.ritual}</p>
                      </div>
                    )}
                    {contenido.contenidoPrincipal.cierre && <p className="cierre">{contenido.contenidoPrincipal.cierre}</p>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {modo === 'imagenes' && (
        <ImagenesIA />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// IMÁGENES IA - LEONARDO AI
// ═══════════════════════════════════════════════════════════════

function ImagenesIA() {
  const [prompt, setPrompt] = useState('');
  const [estilo, setEstilo] = useState('magico');
  const [generando, setGenerando] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [historial, setHistorial] = useState([]);
  
  const estilos = [
    { id: 'magico', nombre: '✨ Mágico', desc: 'Bosque encantado, cristales, luz dorada' },
    { id: 'watercolor', nombre: '🎨 Watercolor', desc: 'Acuarela suave y etérea' },
    { id: 'realista', nombre: '📸 Realista', desc: 'Fotografía de alta calidad' },
    { id: 'mistico', nombre: '🔮 Místico', desc: 'Oscuro, misterioso, con brillos' }
  ];
  
  const generar = async () => {
    if (!prompt.trim()) return;
    setGenerando(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/imagen/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, estilo })
      });
      const data = await res.json();
      if (data.url) {
        setImagen(data.url);
        setHistorial(prev => [{ url: data.url, prompt, estilo, fecha: new Date().toLocaleString() }, ...prev]);
      }
    } catch(e) { alert('Error generando imagen'); }
    setGenerando(false);
  };
  
  return (
    <div className="imagenes-ia-panel">
      <div className="img-gen-form">
        <h3>🎨 Generador de Imágenes con Leonardo AI</h3>
        <div className="form-group">
          <label>Descripción de la imagen</label>
          <textarea 
            placeholder="Ej: Un duende guardián pelirrojo con pecas, sentado sobre un hongo azul, rodeado de cristales de amatista, luz dorada del atardecer filtrándose entre los árboles..." 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)} 
            rows={4} 
          />
        </div>
        
        <div className="estilos-grid">
          {estilos.map(e => (
            <button key={e.id} className={`estilo-btn ${estilo === e.id ? 'act' : ''}`} onClick={() => setEstilo(e.id)}>
              <strong>{e.nombre}</strong>
              <small>{e.desc}</small>
            </button>
          ))}
        </div>
        
        <button className="btn-generar-pro" onClick={generar} disabled={generando || !prompt.trim()}>
          {generando ? '🎨 Leonardo está creando...' : '🎨 Generar Imagen'}
        </button>
      </div>
      
      {imagen && (
        <div className="img-resultado">
          <img src={imagen} alt="Imagen generada" />
          <div className="img-actions">
            <button className="btn-sec" onClick={() => window.open(imagen)}>📥 Descargar</button>
            <button className="btn-sec" onClick={() => navigator.clipboard.writeText(imagen)}>📋 Copiar URL</button>
          </div>
        </div>
      )}
      
      {historial.length > 0 && (
        <div className="img-historial">
          <h4>Historial reciente</h4>
          <div className="historial-grid">
            {historial.slice(0, 6).map((h, i) => (
              <div key={i} className="hist-item" onClick={() => setImagen(h.url)}>
                <img src={h.url} alt={h.prompt} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CÍRCULO ADMIN - CONTENIDO PREMIUM DIGERIDO
// ═══════════════════════════════════════════════════════════════

function CirculoAdmin() {
  const [tab, setTab] = useState('miembros');
  const [miembros, setMiembros] = useState([]);
  const [contenidoSemanal, setContenidoSemanal] = useState(null);
  const [cargandoContenido, setCargandoContenido] = useState(false);
  
  useEffect(() => { cargarMiembros(); cargarContenidoSemanal(); }, []);
  
  const cargarMiembros = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/circulo/miembros`);
      const data = await res.json();
      setMiembros(data.miembros || []);
    } catch(e) {}
  };
  
  const cargarContenidoSemanal = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/circulo/contenido-actual`);
      const data = await res.json();
      if (data.contenido) setContenidoSemanal(data.contenido);
    } catch(e) {}
  };
  
  const generarContenidoSemanal = async () => {
    setCargandoContenido(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/contenido/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: ADMIN_KEY, autoSemanal: true })
      });
      const data = await res.json();
      if (data.success) {
        setContenidoSemanal(data.contenido);
        alert('✅ Contenido semanal generado y guardado');
      }
    } catch(e) { alert('Error'); }
    setCargandoContenido(false);
  };
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h1>★ Círculo de Duendes</h1>
        <div className="panel-tabs">
          <button className={tab === 'miembros' ? 'act' : ''} onClick={() => setTab('miembros')}>👥 Miembros</button>
          <button className={tab === 'contenido' ? 'act' : ''} onClick={() => setTab('contenido')}>📝 Contenido Semanal</button>
          <button className={tab === 'beneficios' ? 'act' : ''} onClick={() => setTab('beneficios')}>✨ Beneficios</button>
        </div>
      </div>
      
      {tab === 'miembros' && (
        <div className="circulo-miembros">
          <div className="miembros-stats-pro">
            <div className="m-stat-pro"><div className="m-num">{miembros.filter(m => m.tipo === 'mensual').length}</div><div className="m-label">Mensual</div></div>
            <div className="m-stat-pro"><div className="m-num">{miembros.filter(m => m.tipo === 'trimestral').length}</div><div className="m-label">Trimestral</div></div>
            <div className="m-stat-pro"><div className="m-num">{miembros.filter(m => m.tipo === 'semestral').length}</div><div className="m-label">Semestral</div></div>
            <div className="m-stat-pro"><div className="m-num">{miembros.filter(m => m.tipo === 'anual').length}</div><div className="m-label">Anual</div></div>
            <div className="m-stat-pro highlight"><div className="m-num">{miembros.length}</div><div className="m-label">Total</div></div>
          </div>
          
          <div className="por-vencer-pro">
            <h3>⏰ Por Vencer (próximos 7 días)</h3>
            <div className="vencer-lista">
              {miembros.filter(m => {
                const exp = new Date(m.expira);
                const hoy = new Date();
                const diff = (exp - hoy) / (1000 * 60 * 60 * 24);
                return diff > 0 && diff <= 7;
              }).map((m, i) => (
                <div key={i} className="vencer-item-pro">
                  <div className="v-info">
                    <strong>{m.nombre || m.email}</strong>
                    <span>Vence: {m.expira}</span>
                  </div>
                  <button className="btn-mini gold">📧 Recordar</button>
                </div>
              ))}
              {miembros.filter(m => {
                const exp = new Date(m.expira);
                const hoy = new Date();
                const diff = (exp - hoy) / (1000 * 60 * 60 * 24);
                return diff > 0 && diff <= 7;
              }).length === 0 && <p className="empty-small">Ninguno por vencer esta semana ✨</p>}
            </div>
          </div>
          
          <h3>Todos los Miembros ({miembros.length})</h3>
          <div className="miembros-lista-pro">
            {miembros.map((m, i) => (
              <div key={i} className="miembro-item-pro">
                <div className="miembro-avatar">{m.nombre?.[0] || '?'}</div>
                <div className="miembro-info">
                  <strong>{m.nombre || m.email}</strong>
                  <span>{m.email}</span>
                </div>
                <span className={`tipo-badge-pro ${m.tipo}`}>{m.prueba ? '🎁 Prueba' : m.tipo}</span>
                <span className="miembro-exp">Hasta: {m.expira}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {tab === 'contenido' && (
        <div className="circulo-contenido-pro">
          <div className="contenido-header">
            <div>
              <h3>📅 Contenido de Esta Semana</h3>
              <p>Se publica automáticamente cada lunes</p>
            </div>
            <button className="btn-gold" onClick={generarContenidoSemanal} disabled={cargandoContenido}>
              {cargandoContenido ? '✨ Generando...' : '✨ Generar Nuevo'}
            </button>
          </div>
          
          {contenidoSemanal ? (
            <div className="contenido-semanal-preview">
              <div className="cs-header" style={{background: `linear-gradient(135deg, ${CATEGORIAS_CONTENIDO.find(c => c.id === contenidoSemanal.tematica)?.color || '#d4af37'}, #1a1a1a)`}}>
                <span className="cs-icono">{CATEGORIAS_CONTENIDO.find(c => c.id === contenidoSemanal.tematica)?.icono}</span>
                <div>
                  <h2>{contenidoSemanal.titulo}</h2>
                  <p>{contenidoSemanal.subtitulo}</p>
                </div>
              </div>
              
              <div className="cs-body">
                {contenidoSemanal.contenidoPrincipal?.introduccion && (
                  <div className="cs-section">
                    <h4>✨ Introducción</h4>
                    <p>{contenidoSemanal.contenidoPrincipal.introduccion}</p>
                  </div>
                )}
                
                {contenidoSemanal.contenidoPrincipal?.desarrollo && (
                  <div className="cs-section">
                    <h4>📖 Desarrollo</h4>
                    <p>{contenidoSemanal.contenidoPrincipal.desarrollo}</p>
                  </div>
                )}
                
                {contenidoSemanal.ritual && (
                  <div className="cs-ritual">
                    <h4>🕯️ Ritual de la Semana</h4>
                    <div className="ritual-content">
                      <p><strong>Necesitás:</strong> {contenidoSemanal.ritual.materiales?.join(', ')}</p>
                      <p><strong>Pasos:</strong></p>
                      <ol>
                        {contenidoSemanal.ritual.pasos?.map((p, i) => <li key={i}>{p}</li>)}
                      </ol>
                    </div>
                  </div>
                )}
                
                {contenidoSemanal.mensajeFinal && (
                  <div className="cs-mensaje">
                    <p>"{contenidoSemanal.mensajeFinal}"</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-contenido">
              <p>No hay contenido generado para esta semana</p>
              <button className="btn-gold" onClick={generarContenidoSemanal}>✨ Generar Ahora</button>
            </div>
          )}
        </div>
      )}
      
      {tab === 'beneficios' && (
        <div className="circulo-beneficios">
          <h3>✨ Lo que incluye el Círculo de Duendes</h3>
          <div className="beneficios-grid">
            <div className="beneficio-card">
              <span className="b-icono">📝</span>
              <h4>Contenido Semanal Exclusivo</h4>
              <p>Artículos, rituales y guías generados con IA cada semana</p>
            </div>
            <div className="beneficio-card">
              <span className="b-icono">🚀</span>
              <h4>Acceso Anticipado 72hs</h4>
              <p>Primeras en ver los nuevos guardianes antes que nadie</p>
            </div>
            <div className="beneficio-card">
              <span className="b-icono">🎁</span>
              <h4>50 Runas de Regalo</h4>
              <p>Al unirse reciben runas para tiradas y experiencias</p>
            </div>
            <div className="beneficio-card">
              <span className="b-icono">💰</span>
              <h4>Descuentos Exclusivos</h4>
              <p>10-15% en todos los guardianes</p>
            </div>
            <div className="beneficio-card">
              <span className="b-icono">🔮</span>
              <h4>Lecturas Colectivas</h4>
              <p>Mensajes canalizados mensuales para el grupo</p>
            </div>
            <div className="beneficio-card">
              <span className="b-icono">💬</span>
              <h4>Comunidad Privada</h4>
              <p>Grupo exclusivo de amantes de los duendes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REGALOS
// ═══════════════════════════════════════════════════════════════

function Regalos() {
  const [email, setEmail] = useState('');
  const [cliente, setCliente] = useState(null);
  const [tipoRegalo, setTipoRegalo] = useState('runas');
  const [cantidad, setCantidad] = useState(10);
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  
  const buscarCliente = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/clientes/buscar?q=${email}`);
      const data = await res.json();
      if (data.clientes?.length > 0) setCliente(data.clientes[0]);
    } catch(e) {}
  };
  
  const enviarRegalo = async () => {
    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/regalos/enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cliente.email, tipo: tipoRegalo, cantidad, mensaje, remitente: 'Duendes del Uruguay' })
      });
      const data = await res.json();
      setResultado(data.success ? '✅ ¡Regalo enviado!' : '❌ Error');
      if (data.success) {
        setTimeout(() => { setCliente(null); setEmail(''); setResultado(null); }, 2000);
      }
    } catch(e) { setResultado('❌ Error'); }
    setEnviando(false);
  };
  
  const TIPOS_REGALO = [
    { id: 'runas', nombre: 'Runas', icono: 'ᚱ', opciones: [5, 10, 20, 50, 100] },
    { id: 'treboles', nombre: 'Tréboles', icono: '☘', opciones: [5, 10, 20, 50] },
    { id: 'circulo', nombre: 'Círculo Gratis', icono: '★', opciones: [7, 15, 30, 60] },
    { id: 'cupon', nombre: 'Cupón %', icono: '🎟️', opciones: [10, 15, 20, 25] }
  ];
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h1>🎁 Regalos y Sorpresas</h1>
        <p>Sorprendé a tus clientes con regalos especiales</p>
      </div>
      
      <div className="regalo-form-pro">
        <div className="paso-regalo">
          <div className="paso-num">1</div>
          <div className="paso-content">
            <h3>¿Para quién?</h3>
            <div className="buscar-cliente-pro">
              <input placeholder="Email del cliente" value={email} onChange={e => setEmail(e.target.value)} onKeyPress={e => e.key === 'Enter' && buscarCliente()} />
              <button onClick={buscarCliente}>Buscar</button>
            </div>
            {cliente && (
              <div className="cliente-encontrado">
                <span>✓</span>
                <strong>{cliente.nombre || cliente.email}</strong>
                <span className="cliente-monedas">ᚱ{cliente.runas || 0} ☘{cliente.treboles || 0}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="paso-regalo">
          <div className="paso-num">2</div>
          <div className="paso-content">
            <h3>¿Qué regalo?</h3>
            <div className="tipos-regalo-pro">
              {TIPOS_REGALO.map(t => (
                <button key={t.id} className={`tipo-regalo-pro ${tipoRegalo === t.id ? 'act' : ''}`} onClick={() => setTipoRegalo(t.id)}>
                  <span className="tipo-icono-big">{t.icono}</span>
                  <span>{t.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="paso-regalo">
          <div className="paso-num">3</div>
          <div className="paso-content">
            <h3>Cantidad</h3>
            <div className="cantidad-btns-pro">
              {TIPOS_REGALO.find(t => t.id === tipoRegalo)?.opciones.map(o => (
                <button key={o} className={cantidad === o ? 'act' : ''} onClick={() => setCantidad(o)}>
                  {tipoRegalo === 'circulo' ? `${o} días` : tipoRegalo === 'cupon' ? `${o}%` : o}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="paso-regalo">
          <div className="paso-num">4</div>
          <div className="paso-content">
            <h3>Mensaje (opcional)</h3>
            <textarea placeholder="Un mensaje cariñoso que acompañará el regalo..." value={mensaje} onChange={e => setMensaje(e.target.value)} rows={2} />
          </div>
        </div>
        
        <button className="btn-enviar-regalo" onClick={enviarRegalo} disabled={!cliente || enviando}>
          {enviando ? '✨ Enviando...' : '🎁 Enviar Regalo'}
        </button>
        
        {resultado && <div className={`resultado ${resultado.includes('Error') ? 'error' : 'ok'}`}>{resultado}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANTICIPADO - MEJORADO CON SELECTOR DE WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════

function Anticipado() {
  const [productos, setProductos] = useState([]);
  const [cargandoProds, setCargandoProds] = useState(true);
  const [seleccionados, setSeleccionados] = useState([]);
  const [duracion, setDuracion] = useState('48');
  const [activos, setActivos] = useState([]);
  const [activando, setActivando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  
  useEffect(() => { cargarProductos(); cargarActivos(); }, []);
  
  const cargarProductos = async () => {
    setCargandoProds(true);
    try {
      // Traer productos de WooCommerce
      const res = await fetch(`${API_BASE}/api/woo/productos`);
      const data = await res.json();
      setProductos(data.productos || []);
    } catch(e) {
      // Productos de ejemplo si no hay API
      setProductos([
        { id: 1, nombre: 'Finnegan - Guardián de la Abundancia', precio: 89, imagen: '/duende1.jpg', stock: 1 },
        { id: 2, nombre: 'Bramble - Protector del Hogar', precio: 75, imagen: '/duende2.jpg', stock: 1 },
        { id: 3, nombre: 'Thistle - Sanador de Cristal', precio: 95, imagen: '/duende3.jpg', stock: 1 },
      ]);
    }
    setCargandoProds(false);
  };
  
  const cargarActivos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/anticipado/listar`);
      const data = await res.json();
      setActivos(data.anticipados || []);
    } catch(e) {}
  };
  
  const toggleSeleccion = (prod) => {
    if (seleccionados.find(p => p.id === prod.id)) {
      setSeleccionados(seleccionados.filter(p => p.id !== prod.id));
    } else {
      setSeleccionados([...seleccionados, prod]);
    }
  };
  
  const activarAnticipado = async () => {
    if (seleccionados.length === 0) return;
    setActivando(true);
    setResultado(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/anticipado/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productos: seleccionados.map(p => ({
            idWoo: p.id,
            nombre: p.nombre,
            precio: p.precio,
            imagen: p.imagen
          })),
          duracion
        })
      });
      const data = await res.json();
      if (data.success) {
        setResultado(`✅ ¡${seleccionados.length} guardián(es) en anticipado! ${data.enviados || 0} emails enviados al Círculo`);
        setSeleccionados([]);
        cargarActivos();
      } else {
        setResultado('❌ Error al activar');
      }
    } catch(e) { setResultado('❌ Error de conexión'); }
    setActivando(false);
  };
  
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h1>🚀 Acceso Anticipado</h1>
        <p>Seleccioná los guardianes que querés ofrecer primero al Círculo</p>
      </div>
      
      {/* ACTIVOS */}
      {activos.length > 0 && (
        <div className="anticipados-activos-pro">
          <h3>⚡ Anticipados Activos</h3>
          <div className="activos-grid">
            {activos.map((a, i) => (
              <div key={i} className="activo-card">
                {a.imagen && <img src={a.imagen} alt={a.nombre} />}
                <div className="activo-info">
                  <strong>{a.nombre}</strong>
                  <span>${a.precio}</span>
                  <span className="tiempo-restante">⏱️ {a.tiempoRestante}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* SELECTOR DE PRODUCTOS */}
      <div className="selector-productos">
        <div className="selector-header">
          <h3>Seleccionar Guardianes</h3>
          <input 
            placeholder="🔍 Buscar por nombre..." 
            value={busqueda} 
            onChange={e => setBusqueda(e.target.value)}
            className="buscar-producto"
          />
        </div>
        
        {cargandoProds ? (
          <div className="loading">Cargando productos de WooCommerce...</div>
        ) : (
          <div className="productos-grid">
            {productosFiltrados.map(p => (
              <div 
                key={p.id} 
                className={`producto-card ${seleccionados.find(s => s.id === p.id) ? 'seleccionado' : ''}`}
                onClick={() => toggleSeleccion(p)}
              >
                <div className="prod-check">{seleccionados.find(s => s.id === p.id) ? '✓' : ''}</div>
                {p.imagen && <img src={p.imagen} alt={p.nombre} />}
                <div className="prod-info">
                  <strong>{p.nombre}</strong>
                  <span>${p.precio}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {seleccionados.length > 0 && (
          <div className="seleccion-footer">
            <div className="seleccion-info">
              <span className="seleccion-count">{seleccionados.length} seleccionado(s)</span>
              <div className="duracion-selector">
                <label>Duración:</label>
                <select value={duracion} onChange={e => setDuracion(e.target.value)}>
                  <option value="24">24 horas</option>
                  <option value="48">48 horas</option>
                  <option value="72">72 horas</option>
                </select>
              </div>
            </div>
            <button className="btn-activar" onClick={activarAnticipado} disabled={activando}>
              {activando ? '🚀 Activando...' : `🚀 Activar Anticipado (${seleccionados.length})`}
            </button>
          </div>
        )}
        
        {resultado && <div className={`resultado ${resultado.includes('Error') ? 'error' : 'ok'}`}>{resultado}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EMAILS
// ═══════════════════════════════════════════════════════════════

function Emails({ modalGlobal, setModalGlobal }) {
  const [tab, setTab] = useState('enviar');
  const [destinatarios, setDestinatarios] = useState('circulo');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  
  const enviarMasivo = async () => {
    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/emails/masivo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinatarios, asunto, mensaje })
      });
      const data = await res.json();
      if (data.success) {
        setResultado(`✅ Enviados ${data.enviados || 0} emails`);
        setAsunto(''); setMensaje('');
      } else {
        setResultado('❌ Error');
      }
    } catch(e) { setResultado('❌ Error'); }
    setEnviando(false);
  };
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h1>📧 Centro de Emails</h1>
        <div className="panel-tabs">
          <button className={tab === 'enviar' ? 'act' : ''} onClick={() => setTab('enviar')}>📤 Enviar</button>
          <button className={tab === 'automaticos' ? 'act' : ''} onClick={() => setTab('automaticos')}>⚡ Automáticos</button>
        </div>
      </div>
      
      {tab === 'enviar' && (
        <div className="email-form-pro">
          <div className="form-section">
            <h3>Destinatarios</h3>
            <div className="dest-btns-pro">
              <button className={destinatarios === 'circulo' ? 'act' : ''} onClick={() => setDestinatarios('circulo')}>
                <span>★</span> Círculo ({0} miembros)
              </button>
              <button className={destinatarios === 'todos' ? 'act' : ''} onClick={() => setDestinatarios('todos')}>
                <span>👥</span> Todos los clientes
              </button>
              <button className={destinatarios === 'compradores' ? 'act' : ''} onClick={() => setDestinatarios('compradores')}>
                <span>🛒</span> Compradores
              </button>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Asunto</h3>
            <input value={asunto} onChange={e => setAsunto(e.target.value)} placeholder="✨ Asunto del email" />
            <small>Podés usar {'{nombre}'} para personalizar</small>
          </div>
          
          <div className="form-section">
            <h3>Mensaje</h3>
            <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} rows={8} placeholder="El contenido del email..." />
          </div>
          
          <button className="btn-enviar-email" onClick={enviarMasivo} disabled={enviando || !asunto || !mensaje}>
            {enviando ? '📧 Enviando...' : '📧 Enviar Email Masivo'}
          </button>
          {resultado && <div className={`resultado ${resultado.includes('Error') ? 'error' : 'ok'}`}>{resultado}</div>}
        </div>
      )}
      
      {tab === 'automaticos' && (
        <div className="emails-auto-pro">
          <h3>Emails Automáticos Configurados</h3>
          <div className="autos-lista-pro">
            {Object.entries(EMAIL_TEMPLATES).map(([id, template]) => (
              <div key={id} className="auto-item-pro">
                <div className="auto-info">
                  <strong>{template.asunto.replace('{nombre}', 'Cliente')}</strong>
                  <span className={`auto-cat ${template.categoria}`}>{template.categoria}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════

function Config() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h1>⚙️ Configuración</h1>
      </div>
      
      <div className="config-sections-pro">
        <div className="config-section-pro">
          <h3>🔑 APIs Conectadas</h3>
          <div className="api-status">
            <div className="api-item">
              <span className="api-name">Anthropic (Claude)</span>
              <span className="status ok">✓ Conectado</span>
            </div>
            <div className="api-item">
              <span className="api-name">Leonardo AI</span>
              <span className="status pending">⚠️ Pendiente</span>
            </div>
            <div className="api-item">
              <span className="api-name">Resend (Emails)</span>
              <span className="status ok">✓ Conectado</span>
            </div>
            <div className="api-item">
              <span className="api-name">WooCommerce</span>
              <span className="status ok">✓ Conectado</span>
            </div>
          </div>
        </div>
        
        <div className="config-section-pro">
          <h3>💰 Monedas</h3>
          <div className="config-grid">
            <div className="config-item-pro">
              <label>Tasa USD/UYU</label>
              <input type="number" defaultValue="43" />
            </div>
            <div className="config-item-pro">
              <label>Tréboles por $10 USD</label>
              <input type="number" defaultValue="1" />
            </div>
          </div>
        </div>
        
        <div className="config-section-pro">
          <h3>★ Círculo</h3>
          <div className="config-grid">
            <div className="config-item-pro">
              <label>Días prueba gratis</label>
              <input type="number" defaultValue="15" />
            </div>
            <div className="config-item-pro">
              <label>Runas regalo prueba</label>
              <input type="number" defaultValue="50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TITO ADMIN
// ═══════════════════════════════════════════════════════════════

function TitoAdmin({ abierto, setAbierto }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);
  
  const enviar = async () => {
    if (!input.trim() || enviando) return;
    const m = input.trim();
    setInput('');
    setMsgs(prev => [...prev, { rol: 'user', texto: m }]);
    setEnviando(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/tito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: m })
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { rol: 'tito', texto: data.respuesta }]);
      if (data.accion) setAccionPendiente(data.accion);
      else setAccionPendiente(null);
    } catch(e) {
      setMsgs(prev => [...prev, { rol: 'tito', texto: 'Ups, hubo un error. Intentá de nuevo.' }]);
    }
    setEnviando(false);
  };
  
  const ejecutarAccion = async (confirmar) => {
    if (!confirmar) {
      setAccionPendiente(null);
      setMsgs(prev => [...prev, { rol: 'tito', texto: 'Ok, cancelado.' }]);
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/tito/accion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: accionPendiente })
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { rol: 'tito', texto: data.resultado }]);
    } catch(e) {
      setMsgs(prev => [...prev, { rol: 'tito', texto: 'Error al ejecutar la acción.' }]);
    }
    setAccionPendiente(null);
    setEnviando(false);
  };
  
  return (
    <>
      <button className="tito-fab" onClick={() => setAbierto(!abierto)}>
        <span>🧙</span>
        <span className="tito-label">Tito</span>
      </button>
      
      {abierto && (
        <div className="tito-panel">
          <div className="tito-header">
            <div className="tito-avatar">🧙</div>
            <div>
              <strong>Tito Admin</strong>
              <small>Tu asistente mágico</small>
            </div>
            <button onClick={() => setAbierto(false)}>✕</button>
          </div>
          
          <div className="tito-msgs">
            {msgs.length === 0 && (
              <div className="tito-welcome">
                <p>¡Hola! Soy Tito 🧙</p>
                <p>Puedo ayudarte a:</p>
                <ul>
                  <li>🔍 Buscar clientes</li>
                  <li>🎁 Regalar runas/tréboles</li>
                  <li>📧 Enviar emails</li>
                  <li>📊 Ver estadísticas</li>
                  <li>✨ Y mucho más...</li>
                </ul>
                <p>¿En qué te ayudo?</p>
              </div>
            )}
            
            {msgs.map((m, i) => (
              <div key={i} className={`tito-msg ${m.rol}`}>
                {m.rol === 'tito' && <span className="msg-avatar">🧙</span>}
                <div className="msg-content">{m.texto}</div>
              </div>
            ))}
            
            {accionPendiente && (
              <div className="tito-confirmar">
                <p>¿Confirmo esta acción?</p>
                <div className="confirmar-btns">
                  <button className="btn-si" onClick={() => ejecutarAccion(true)}>✓ Sí</button>
                  <button className="btn-no" onClick={() => ejecutarAccion(false)}>✕ No</button>
                </div>
              </div>
            )}
            
            {enviando && <div className="tito-typing">Tito está pensando...</div>}
          </div>
          
          <div className="tito-input">
            <input placeholder="Pedile algo a Tito..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && enviar()} />
            <button onClick={enviar} disabled={enviando}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS PRO - PREMIUM
// ═══════════════════════════════════════════════════════════════

const estilosAdmin = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, sans-serif;
  background: linear-gradient(135deg, #FFFEF9 0%, #FFF8E7 100%);
  color: #1a1a1a;
  min-height: 100vh;
}

/* LOGIN */
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #FFFEF9, #FFF8E7); }
.login-box { background: white; padding: 3rem; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); text-align: center; max-width: 400px; }
.login-box h1 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 0.5rem; }
.login-box p { color: #666; margin-bottom: 2rem; }
.login-box input { width: 100%; padding: 1rem; border: 2px solid #f0f0f0; border-radius: 12px; font-size: 1rem; margin-bottom: 1rem; }
.login-box button { width: 100%; padding: 1rem; background: linear-gradient(135deg, #d4af37, #b8962e); border: none; border-radius: 12px; color: #1a1a1a; font-weight: 600; cursor: pointer; }

/* LAYOUT */
.admin { min-height: 100vh; }
.admin-header { background: white; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; position: sticky; top: 0; z-index: 100; }
.admin-logo { font-family: 'Cinzel', serif; font-size: 1.25rem; color: #d4af37; }
.admin-user { color: #666; font-size: 0.9rem; }
.admin-nav { background: white; padding: 1rem 2rem; display: flex; gap: 0.5rem; border-bottom: 1px solid #f0f0f0; overflow-x: auto; }
.nav-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #f8f8f8; border: 1px solid #f0f0f0; border-radius: 50px; font-size: 0.9rem; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
.nav-btn:hover { background: #f0f0f0; }
.nav-btn.act { background: #d4af37; border-color: #d4af37; color: #1a1a1a; font-weight: 500; }
.nav-btn span:first-child { font-size: 1.1rem; }
.admin-main { padding: 2rem; max-width: 1400px; margin: 0 auto; }

/* PANELS */
.panel { background: white; border-radius: 24px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
.panel-header h1 { font-family: 'Cinzel', serif; font-size: 1.5rem; font-weight: 500; }
.panel-header p { color: #666; width: 100%; margin-top: -0.5rem; }
.panel-tabs { display: flex; gap: 0.5rem; }
.panel-tabs button { padding: 0.5rem 1rem; background: #f8f8f8; border: 1px solid #f0f0f0; border-radius: 8px; font-size: 0.85rem; cursor: pointer; }
.panel-tabs button.act { background: #1a1a1a; color: white; border-color: #1a1a1a; }

/* STATS */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { background: #f8f8f8; border-radius: 16px; padding: 1.5rem; text-align: center; }
.stat-card.gold { background: linear-gradient(135deg, #FFF8E7, #FFF3D4); border: 1px solid #d4af37; }
.stat-icon { font-size: 1.5rem; margin-bottom: 0.5rem; display: block; }
.stat-value { font-family: 'Cinzel', serif; font-size: 2rem; font-weight: 600; color: #d4af37; }
.stat-label { font-size: 0.85rem; color: #666; margin-top: 0.25rem; }

/* DASHBOARD */
.dashboard-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
.dash-card { background: #f8f8f8; border-radius: 16px; padding: 1.5rem; }
.dash-card h3 { font-family: 'Cinzel', serif; font-size: 1rem; margin-bottom: 1rem; }
.pendientes { display: flex; flex-direction: column; gap: 0.75rem; }
.pend-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: white; border-radius: 8px; }
.top-list { display: flex; flex-direction: column; gap: 0.5rem; }
.top-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; }
.top-pos { width: 24px; height: 24px; background: #d4af37; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; }
.top-name { flex: 1; }
.top-val { color: #d4af37; font-weight: 600; }
.empty-small { color: #999; font-size: 0.85rem; text-align: center; padding: 1rem; }
.acciones-rapidas h3 { font-family: 'Cinzel', serif; margin-bottom: 1rem; }
.acciones-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; }
.accion { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.25rem; background: #f8f8f8; border: 1px solid #f0f0f0; border-radius: 12px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
.accion:hover { background: #f0f0f0; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.accion span:first-child { font-size: 1.5rem; }

/* BUSCADOR */
.buscador { display: flex; gap: 0.75rem; margin-bottom: 2rem; }
.buscador input { flex: 1; padding: 1rem 1.5rem; border: 2px solid #f0f0f0; border-radius: 50px; font-size: 1rem; }
.buscador button { padding: 1rem 2rem; background: #d4af37; border: none; border-radius: 50px; font-weight: 500; cursor: pointer; }

/* CLIENTE DETALLE */
.cliente-detalle { background: #f8f8f8; border-radius: 16px; overflow: hidden; }
.cliente-header { background: white; padding: 2rem; display: flex; align-items: center; gap: 1.5rem; border-bottom: 1px solid #f0f0f0; }
.cliente-avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #d4af37, #f4d03f); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 2rem; color: white; }
.cliente-info { flex: 1; }
.cliente-info h2 { font-family: 'Cinzel', serif; margin-bottom: 0.25rem; }
.cliente-info p { color: #666; margin-bottom: 0.5rem; }
.cliente-rango { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.8rem; color: white; }
.cliente-stats { display: flex; gap: 2rem; text-align: center; }
.cliente-stats div strong { display: block; font-family: 'Cinzel', serif; font-size: 1.5rem; color: #d4af37; }
.cliente-stats div span { font-size: 0.8rem; color: #666; }
.cliente-tabs { display: flex; gap: 0.5rem; padding: 1rem 2rem; background: white; border-bottom: 1px solid #f0f0f0; }
.cliente-tabs button { padding: 0.5rem 1rem; background: none; border: none; font-size: 0.9rem; cursor: pointer; border-radius: 8px; }
.cliente-tabs button.act { background: #d4af37; color: #1a1a1a; }
.cliente-tab { padding: 2rem; }
.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.info-item { display: flex; flex-direction: column; gap: 0.5rem; }
.info-item.full { grid-column: span 2; }
.info-item label { font-size: 0.85rem; color: #666; }
.info-item input, .info-item textarea { padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 0.95rem; }
.info-item code { background: #f0f0f0; padding: 0.5rem; border-radius: 4px; font-size: 0.8rem; word-break: break-all; }
.badge-si { color: #22c55e; font-weight: 500; }
.badge-no { color: #999; }
.btn-mini { padding: 0.35rem 0.75rem; background: #f0f0f0; border: none; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
.btn-mini.gold { background: #d4af37; }
.acciones-cliente { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.accion-cliente { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: white; border: 1px solid #f0f0f0; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.accion-cliente:hover { border-color: #d4af37; background: #FFF8E7; }

/* FORMS */
.form-section { margin-bottom: 2rem; }
.form-section h3 { font-family: 'Cinzel', serif; font-size: 1rem; margin-bottom: 1rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 0.95rem; }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.form-group.full { grid-column: span 2; }

/* BUTTONS */
.btn-nuevo { padding: 0.75rem 1.5rem; background: #d4af37; border: none; border-radius: 50px; font-weight: 500; cursor: pointer; }
.btn-pri { padding: 0.75rem 1.5rem; background: #1a1a1a; color: white; border: none; border-radius: 8px; cursor: pointer; }
.btn-sec { padding: 0.75rem 1.5rem; background: white; border: 1px solid #e0e0e0; border-radius: 8px; cursor: pointer; }
.btn-gold { padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #d4af37, #b8962e); border: none; border-radius: 50px; font-weight: 500; cursor: pointer; }
.btn-lg { padding: 1rem 2rem; font-size: 1rem; }

/* CONTENIDO PRO */
.tipos-grid-pro { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.tipo-btn-pro { padding: 1.25rem; background: #f8f8f8; border: 2px solid #f0f0f0; border-radius: 16px; text-align: center; cursor: pointer; transition: all 0.2s; }
.tipo-btn-pro:hover { border-color: #d4af37; transform: translateY(-2px); }
.tipo-btn-pro.act { border-color: #d4af37; background: linear-gradient(135deg, #FFF8E7, #fff); box-shadow: 0 4px 12px rgba(212,175,55,0.2); }
.tipo-icono-big { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
.tipo-btn-pro strong { display: block; margin-bottom: 0.25rem; }
.tipo-btn-pro small { color: #666; font-size: 0.75rem; }
.cats-grid-pro { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.cat-btn-pro { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #f8f8f8; border: 2px solid #f0f0f0; border-radius: 50px; cursor: pointer; transition: all 0.2s; }
.cat-btn-pro:hover { border-color: var(--cat-color, #d4af37); }
.cat-btn-pro.act { border-color: var(--cat-color, #d4af37); background: linear-gradient(135deg, #FFF8E7, #fff); }
.cat-icono { font-size: 1.25rem; }
.temas-sugeridos { margin-top: 1rem; padding: 1rem; background: #f8f8f8; border-radius: 12px; }
.temas-sugeridos p { font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; }
.temas-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.temas-btns button { padding: 0.5rem 1rem; background: white; border: 1px solid #e0e0e0; border-radius: 20px; font-size: 0.85rem; cursor: pointer; }
.temas-btns button.act { background: #d4af37; border-color: #d4af37; }
.btn-generar-pro { width: 100%; padding: 1.25rem; background: linear-gradient(135deg, #d4af37, #b8962e); border: none; border-radius: 16px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 1rem; transition: all 0.2s; }
.btn-generar-pro:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,175,55,0.3); }
.btn-generar-pro:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* CONTENIDO PREVIEW PRO */
.contenido-preview-pro { margin-top: 2rem; border: 2px solid #d4af37; border-radius: 24px; overflow: hidden; }
.preview-header-pro { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; background: #f8f8f8; }
.preview-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 50px; color: white; font-size: 0.85rem; }
.preview-actions { display: flex; gap: 0.5rem; }
.preview-imagen { width: 100%; }
.preview-imagen img { width: 100%; height: 200px; object-fit: cover; }
.preview-content-pro { padding: 2rem; }
.preview-content-pro h1 { font-family: 'Cinzel', serif; font-size: 1.75rem; margin-bottom: 0.5rem; color: #1a1a1a; }
.preview-content-pro .subtitulo { color: #666; font-size: 1.1rem; margin-bottom: 1.5rem; font-style: italic; }
.contenido-body { line-height: 1.8; }
.contenido-body .intro { font-size: 1.1rem; color: #444; margin-bottom: 1.5rem; }
.ritual-box { background: linear-gradient(135deg, #FFF8E7, #fff); border: 1px solid #d4af37; border-radius: 16px; padding: 1.5rem; margin: 1.5rem 0; }
.ritual-box h3 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 1rem; }

/* IMAGENES IA */
.imagenes-ia-panel { padding: 1rem 0; }
.img-gen-form { background: #f8f8f8; border-radius: 16px; padding: 2rem; }
.img-gen-form h3 { font-family: 'Cinzel', serif; margin-bottom: 1.5rem; }
.estilos-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 1.5rem 0; }
.estilo-btn { padding: 1rem; background: white; border: 2px solid #f0f0f0; border-radius: 12px; text-align: left; cursor: pointer; }
.estilo-btn:hover { border-color: #d4af37; }
.estilo-btn.act { border-color: #d4af37; background: #FFF8E7; }
.estilo-btn strong { display: block; margin-bottom: 0.25rem; }
.estilo-btn small { color: #666; font-size: 0.8rem; }
.img-resultado { margin-top: 2rem; text-align: center; }
.img-resultado img { max-width: 100%; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
.img-actions { margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center; }
.img-historial { margin-top: 2rem; }
.img-historial h4 { margin-bottom: 1rem; }
.historial-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; }
.hist-item { cursor: pointer; border-radius: 8px; overflow: hidden; }
.hist-item img { width: 100%; aspect-ratio: 1; object-fit: cover; }

/* CIRCULO PRO */
.miembros-stats-pro { display: flex; gap: 1rem; margin-bottom: 2rem; }
.m-stat-pro { flex: 1; background: #f8f8f8; border-radius: 12px; padding: 1.25rem; text-align: center; }
.m-stat-pro.highlight { background: linear-gradient(135deg, #d4af37, #f4d03f); }
.m-num { font-family: 'Cinzel', serif; font-size: 2rem; font-weight: 600; color: #d4af37; }
.m-stat-pro.highlight .m-num { color: #1a1a1a; }
.m-label { font-size: 0.8rem; color: #666; }
.por-vencer-pro { background: #FFF8E7; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; }
.por-vencer-pro h3 { font-family: 'Cinzel', serif; font-size: 1rem; margin-bottom: 1rem; }
.vencer-lista { display: flex; flex-direction: column; gap: 0.75rem; }
.vencer-item-pro { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: white; border-radius: 8px; }
.v-info strong { display: block; }
.v-info span { font-size: 0.8rem; color: #666; }
.miembros-lista-pro { display: flex; flex-direction: column; gap: 0.5rem; }
.miembro-item-pro { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f8f8; border-radius: 12px; }
.miembro-avatar { width: 40px; height: 40px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; }
.miembro-info { flex: 1; }
.miembro-info strong { display: block; }
.miembro-info span { font-size: 0.8rem; color: #666; }
.tipo-badge-pro { padding: 0.25rem 0.75rem; background: #e0e0e0; border-radius: 20px; font-size: 0.75rem; }
.tipo-badge-pro.mensual { background: #dbeafe; color: #1e40af; }
.tipo-badge-pro.trimestral { background: #dcfce7; color: #166534; }
.tipo-badge-pro.semestral { background: #fef3c7; color: #92400e; }
.tipo-badge-pro.anual { background: #f3e8ff; color: #7c3aed; }

/* CONTENIDO SEMANAL PRO */
.circulo-contenido-pro { }
.contenido-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.contenido-header h3 { font-family: 'Cinzel', serif; }
.contenido-header p { color: #666; font-size: 0.9rem; }
.contenido-semanal-preview { border: 2px solid #d4af37; border-radius: 24px; overflow: hidden; }
.cs-header { padding: 2rem; color: white; display: flex; align-items: center; gap: 1.5rem; }
.cs-icono { font-size: 3rem; }
.cs-header h2 { font-family: 'Cinzel', serif; margin-bottom: 0.5rem; }
.cs-header p { opacity: 0.9; }
.cs-body { padding: 2rem; }
.cs-section { margin-bottom: 2rem; }
.cs-section h4 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 0.75rem; }
.cs-section p { line-height: 1.7; color: #444; }
.cs-ritual { background: linear-gradient(135deg, #FFF8E7, #fff); border: 1px solid #d4af37; border-radius: 16px; padding: 1.5rem; margin: 1.5rem 0; }
.cs-ritual h4 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 1rem; }
.ritual-content p { margin-bottom: 0.5rem; }
.ritual-content ol { margin-left: 1.5rem; line-height: 1.8; }
.cs-mensaje { text-align: center; padding: 2rem; background: #f8f8f8; border-radius: 16px; font-style: italic; color: #666; font-size: 1.1rem; }
.empty-contenido { text-align: center; padding: 3rem; color: #666; }
.empty-contenido button { margin-top: 1rem; }

/* BENEFICIOS */
.beneficios-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.beneficio-card { background: #f8f8f8; border-radius: 16px; padding: 1.5rem; text-align: center; }
.b-icono { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
.beneficio-card h4 { font-family: 'Cinzel', serif; margin-bottom: 0.5rem; }
.beneficio-card p { color: #666; font-size: 0.9rem; }

/* REGALOS PRO */
.regalo-form-pro { max-width: 600px; }
.paso-regalo { display: flex; gap: 1.5rem; margin-bottom: 2rem; }
.paso-num { width: 40px; height: 40px; background: #d4af37; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0; }
.paso-content { flex: 1; }
.paso-content h3 { font-family: 'Cinzel', serif; font-size: 1rem; margin-bottom: 1rem; }
.buscar-cliente-pro { display: flex; gap: 0.5rem; }
.buscar-cliente-pro input { flex: 1; padding: 0.75rem 1rem; border: 2px solid #f0f0f0; border-radius: 8px; }
.buscar-cliente-pro button { padding: 0.75rem 1.5rem; background: #1a1a1a; color: white; border: none; border-radius: 8px; cursor: pointer; }
.cliente-encontrado { display: flex; align-items: center; gap: 0.75rem; margin-top: 1rem; padding: 1rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; }
.cliente-encontrado span:first-child { color: #22c55e; font-size: 1.25rem; }
.cliente-monedas { color: #666; font-size: 0.85rem; }
.tipos-regalo-pro { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
.tipo-regalo-pro { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.25rem 1rem; background: #f8f8f8; border: 2px solid #f0f0f0; border-radius: 12px; cursor: pointer; }
.tipo-regalo-pro:hover { border-color: #d4af37; }
.tipo-regalo-pro.act { border-color: #d4af37; background: #FFF8E7; }
.cantidad-btns-pro { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.cantidad-btns-pro button { padding: 0.75rem 1.25rem; background: #f8f8f8; border: 2px solid #f0f0f0; border-radius: 8px; cursor: pointer; }
.cantidad-btns-pro button.act { background: #d4af37; border-color: #d4af37; }
.btn-enviar-regalo { width: 100%; padding: 1.25rem; background: linear-gradient(135deg, #d4af37, #b8962e); border: none; border-radius: 16px; font-size: 1.1rem; font-weight: 600; cursor: pointer; }

/* ANTICIPADO PRO */
.anticipados-activos-pro { margin-bottom: 2rem; padding: 1.5rem; background: #FFF8E7; border-radius: 16px; }
.anticipados-activos-pro h3 { font-family: 'Cinzel', serif; margin-bottom: 1rem; }
.activos-grid { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; }
.activo-card { flex-shrink: 0; width: 200px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.activo-card img { width: 100%; height: 120px; object-fit: cover; }
.activo-info { padding: 1rem; }
.activo-info strong { display: block; font-size: 0.9rem; margin-bottom: 0.25rem; }
.activo-info span { display: block; color: #666; font-size: 0.8rem; }
.tiempo-restante { color: #ef4444 !important; font-weight: 500; }
.selector-productos { }
.selector-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.selector-header h3 { font-family: 'Cinzel', serif; }
.buscar-producto { padding: 0.75rem 1rem; border: 2px solid #f0f0f0; border-radius: 8px; width: 250px; }
.productos-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.producto-card { background: #f8f8f8; border: 2px solid transparent; border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.2s; position: relative; }
.producto-card:hover { border-color: #d4af37; transform: translateY(-2px); }
.producto-card.seleccionado { border-color: #d4af37; background: #FFF8E7; }
.prod-check { position: absolute; top: 0.75rem; right: 0.75rem; width: 28px; height: 28px; background: #d4af37; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; opacity: 0; transition: opacity 0.2s; }
.producto-card.seleccionado .prod-check { opacity: 1; }
.producto-card img { width: 100%; height: 150px; object-fit: cover; }
.prod-info { padding: 1rem; }
.prod-info strong { display: block; font-size: 0.9rem; margin-bottom: 0.25rem; line-height: 1.3; }
.prod-info span { color: #d4af37; font-weight: 600; }
.seleccion-footer { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; background: #1a1a1a; border-radius: 16px; color: white; }
.seleccion-info { display: flex; align-items: center; gap: 2rem; }
.seleccion-count { font-weight: 600; }
.duracion-selector { display: flex; align-items: center; gap: 0.5rem; }
.duracion-selector select { padding: 0.5rem; border-radius: 6px; border: none; }
.btn-activar { padding: 1rem 2rem; background: linear-gradient(135deg, #d4af37, #f4d03f); border: none; border-radius: 50px; font-weight: 600; cursor: pointer; color: #1a1a1a; }
.loading { text-align: center; padding: 3rem; color: #666; }

/* EMAILS PRO */
.email-form-pro { max-width: 700px; }
.dest-btns-pro { display: flex; gap: 0.75rem; }
.dest-btns-pro button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: #f8f8f8; border: 2px solid #f0f0f0; border-radius: 12px; cursor: pointer; }
.dest-btns-pro button:hover { border-color: #d4af37; }
.dest-btns-pro button.act { border-color: #d4af37; background: #FFF8E7; }
.btn-enviar-email { width: 100%; padding: 1.25rem; background: linear-gradient(135deg, #d4af37, #b8962e); border: none; border-radius: 16px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 1rem; }
.emails-auto-pro { }
.autos-lista-pro { display: flex; flex-direction: column; gap: 0.75rem; }
.auto-item-pro { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; background: #f8f8f8; border-radius: 12px; }
.auto-info strong { display: block; margin-bottom: 0.25rem; }
.auto-cat { font-size: 0.75rem; padding: 0.2rem 0.5rem; background: #e0e0e0; border-radius: 4px; }
.switch { position: relative; width: 50px; height: 26px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; inset: 0; background: #ccc; border-radius: 26px; transition: 0.3s; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
input:checked + .slider { background: #22c55e; }
input:checked + .slider:before { transform: translateX(24px); }

/* CONFIG PRO */
.config-sections-pro { display: flex; flex-direction: column; gap: 2rem; }
.config-section-pro { background: #f8f8f8; border-radius: 16px; padding: 1.5rem; }
.config-section-pro h3 { font-family: 'Cinzel', serif; margin-bottom: 1.5rem; }
.api-status { display: flex; flex-direction: column; gap: 0.75rem; }
.api-item { display: flex; justify-content: space-between; padding: 0.75rem 1rem; background: white; border-radius: 8px; }
.status { font-size: 0.85rem; }
.status.ok { color: #22c55e; }
.status.pending { color: #f59e0b; }
.config-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.config-item-pro label { display: block; font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; }
.config-item-pro input { width: 100%; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 8px; }

/* TITO */
.tito-fab { position: fixed; bottom: 2rem; right: 2rem; display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; background: linear-gradient(135deg, #d4af37, #b8962e); border: none; border-radius: 50px; box-shadow: 0 8px 24px rgba(212,175,55,0.3); cursor: pointer; z-index: 1000; transition: all 0.2s; }
.tito-fab:hover { transform: translateY(-2px); }
.tito-fab span:first-child { font-size: 1.5rem; }
.tito-label { font-weight: 600; }
.tito-panel { position: fixed; bottom: 6rem; right: 2rem; width: 380px; height: 500px; background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); display: flex; flex-direction: column; z-index: 999; overflow: hidden; }
.tito-header { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: linear-gradient(135deg, #d4af37, #b8962e); }
.tito-avatar { font-size: 2rem; }
.tito-header strong { display: block; }
.tito-header small { opacity: 0.8; font-size: 0.8rem; }
.tito-header button { margin-left: auto; background: none; border: none; font-size: 1.25rem; cursor: pointer; opacity: 0.7; }
.tito-msgs { flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
.tito-welcome { color: #666; line-height: 1.6; }
.tito-welcome p { margin-bottom: 0.5rem; }
.tito-welcome ul { margin: 0.5rem 0 0.5rem 1.5rem; }
.tito-msg { display: flex; gap: 0.75rem; max-width: 90%; }
.tito-msg.user { align-self: flex-end; flex-direction: row-reverse; }
.msg-avatar { width: 32px; height: 32px; background: #FFF8E7; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.msg-content { padding: 0.75rem 1rem; background: #f8f8f8; border-radius: 16px; font-size: 0.95rem; line-height: 1.5; }
.tito-msg.user .msg-content { background: #d4af37; color: #1a1a1a; }
.tito-confirmar { background: #FFF8E7; border: 1px solid #d4af37; border-radius: 12px; padding: 1rem; text-align: center; }
.tito-confirmar p { margin-bottom: 0.75rem; }
.confirmar-btns { display: flex; gap: 0.75rem; justify-content: center; }
.btn-si { padding: 0.5rem 1.5rem; background: #22c55e; color: white; border: none; border-radius: 8px; cursor: pointer; }
.btn-no { padding: 0.5rem 1.5rem; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; }
.tito-typing { color: #666; font-size: 0.85rem; font-style: italic; }
.tito-input { display: flex; gap: 0.75rem; padding: 1rem; border-top: 1px solid #f0f0f0; }
.tito-input input { flex: 1; padding: 0.75rem 1rem; border: 1px solid #e0e0e0; border-radius: 50px; font-size: 0.95rem; }
.tito-input button { width: 40px; height: 40px; background: #d4af37; border: none; border-radius: 50%; font-size: 1.1rem; cursor: pointer; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: white; padding: 2rem; border-radius: 24px; max-width: 500px; width: 90%; }
.modal h2 { font-family: 'Cinzel', serif; margin-bottom: 1.5rem; }
.modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
.cantidad-btns { display: flex; gap: 0.5rem; }
.cantidad-btns button { padding: 0.75rem 1.25rem; background: #f8f8f8; border: 2px solid #f0f0f0; border-radius: 8px; cursor: pointer; }
.cantidad-btns button.act { background: #d4af37; border-color: #d4af37; }

/* UTILIDADES */
.empty { color: #999; text-align: center; padding: 2rem; }
.resultado { padding: 1rem; border-radius: 8px; text-align: center; margin-top: 1rem; }
.resultado.ok { background: #f0fdf4; color: #166534; }
.resultado.error { background: #fef2f2; color: #991b1b; }

/* RESPONSIVE */
@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .acciones-grid { grid-template-columns: repeat(3, 1fr); }
  .tipos-grid-pro { grid-template-columns: repeat(2, 1fr); }
  .productos-grid { grid-template-columns: repeat(3, 1fr); }
  .beneficios-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .admin-main { padding: 1rem; }
  .panel { padding: 1.5rem; }
  .stats-grid { grid-template-columns: 1fr; }
  .dashboard-grid { grid-template-columns: 1fr; }
  .cliente-header { flex-direction: column; text-align: center; }
  .cliente-stats { justify-content: center; flex-wrap: wrap; }
  .acciones-cliente { grid-template-columns: repeat(2, 1fr); }
  .tipos-grid-pro { grid-template-columns: 1fr 1fr; }
  .productos-grid { grid-template-columns: repeat(2, 1fr); }
  .tipos-regalo-pro { grid-template-columns: repeat(2, 1fr); }
  .tito-panel { right: 1rem; left: 1rem; width: auto; bottom: 5rem; }
  .tito-fab { right: 1rem; bottom: 1rem; }
  .miembros-stats-pro { flex-wrap: wrap; }
  .m-stat-pro { min-width: calc(50% - 0.5rem); }
  .beneficios-grid { grid-template-columns: 1fr; }
}
`;

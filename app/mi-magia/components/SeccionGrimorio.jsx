'use client';
import { useState } from 'react';
import { API_BASE, TIPOS_DIARIO } from './constants';

// ═══════════════════════════════════════════════════════════════
// GRIMORIO (con explicación completa)
// ═══════════════════════════════════════════════════════════════

export default function SeccionGrimorio({ usuario, token, setUsuario }) {
  const [tab, setTab] = useState('intro');
  const [entrada, setEntrada] = useState('');
  const [tipoEntrada, setTipoEntrada] = useState('libre');
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState(null);

  // Estados del calendario interactivo
  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [vistaCalendario, setVistaCalendario] = useState(true);

  // Calcular fase lunar para una fecha
  const calcularFaseLunar = (fecha) => {
    const cicloLunar = 29.530588853;
    const lunaLlena = new Date(2024, 0, 25); // Luna llena conocida
    const diff = (fecha - lunaLlena) / (1000 * 60 * 60 * 24);
    const fase = ((diff % cicloLunar) + cicloLunar) % cicloLunar;
    if (fase < 1.84566) return { nombre: 'Nueva', icono: '🌑', energia: 'Nuevos comienzos, introspección' };
    if (fase < 7.38264) return { nombre: 'Creciente', icono: '🌒', energia: 'Manifestación, acción' };
    if (fase < 9.22830) return { nombre: 'Cuarto Creciente', icono: '🌓', energia: 'Decisiones, compromiso' };
    if (fase < 14.76528) return { nombre: 'Gibosa Creciente', icono: '🌔', energia: 'Refinamiento, paciencia' };
    if (fase < 16.61094) return { nombre: 'Llena', icono: '🌕', energia: 'Culminación, gratitud, magia potente' };
    if (fase < 22.14792) return { nombre: 'Gibosa Menguante', icono: '🌖', energia: 'Gratitud, compartir' };
    if (fase < 23.99358) return { nombre: 'Cuarto Menguante', icono: '🌗', energia: 'Soltar, liberar' };
    return { nombre: 'Menguante', icono: '🌘', energia: 'Descanso, limpieza' };
  };

  // Obtener días del mes para el calendario
  const obtenerDiasMes = () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();
    const dias = [];

    // Días vacíos al inicio
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push({ vacio: true });
    }

    // Días del mes
    for (let d = 1; d <= diasEnMes; d++) {
      const fecha = new Date(year, month, d);
      const fechaStr = fecha.toLocaleDateString('es-UY');
      const entradasDia = (usuario?.diario || []).filter(e => e.fecha === fechaStr);
      const faseLunar = calcularFaseLunar(fecha);
      const esHoy = new Date().toDateString() === fecha.toDateString();
      dias.push({
        dia: d,
        fecha: fechaStr,
        fechaObj: fecha,
        entradas: entradasDia,
        tieneEntradas: entradasDia.length > 0,
        faseLunar,
        esHoy
      });
    }
    return dias;
  };

  // Obtener entradas del día seleccionado
  const entradasDelDia = diaSeleccionado
    ? (usuario?.diario || []).filter(e => e.fecha === diaSeleccionado)
    : [];

  const guardarEntrada = async () => {
    if (!entrada.trim()) return;
    setGuardando(true);
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/diario`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: usuario.email, tipo: tipoEntrada, contenido: entrada }) });
      const data = await res.json();
      setUsuario({ ...usuario, diario: [...(usuario.diario || []), { tipo: tipoEntrada, contenido: entrada, fecha: new Date().toLocaleDateString('es-UY') }], runas: data.runaOtorgada ? (usuario.runas || 0) + 1 : usuario.runas });
      setEntrada('');
      if (data.runaOtorgada) setMsg({ t: 'ok', m: '+1 Runa por tu práctica diaria!' });
    } catch(e) {}
    setGuardando(false);
  };

  return (
    <div className="sec">
      <div className="sec-head"><h1>Tu Grimorio</h1><p>Biblioteca mágica personal. Todo lo que recibís y escribís queda guardado acá para siempre.</p></div>

      <div className="tabs-h">
        {[['intro','◇','¿Qué es?'],['lecturas','✦','Mis Lecturas'],['diario','✎','Mi Diario']].map(([k,i,t]) =>
          <button key={k} className={`tab ${tab===k?'act':''}`} onClick={() => setTab(k)}>{i} {t}</button>
        )}
      </div>

      {tab === 'intro' && (
        <div className="grim-intro">
          <div className="grim-intro-section">
            <h3>📜 ¿Qué es un Grimorio?</h3>
            <p>En la tradición mágica, un grimorio es el libro personal de una bruja, mago o practicante espiritual. Es donde se guardan hechizos, rituales, sueños, visiones, y todo el conocimiento acumulado en el camino.</p>
            <p>Tu grimorio en Mi Magia tiene dos partes:</p>
          </div>

          <div className="grim-intro-cards">
            <div className="grim-card" onClick={() => setTab('lecturas')}>
              <span>✦</span>
              <h4>Mis Lecturas</h4>
              <p>Todas las experiencias mágicas que solicites (tiradas de runas, lecturas del alma, registros akáshicos, etc.) quedan guardadas acá. Podés releerlas cuando quieras, encontrar patrones, ver tu evolución.</p>
            </div>
            <div className="grim-card" onClick={() => setTab('diario')}>
              <span>✎</span>
              <h4>Mi Diario</h4>
              <p>Tu espacio personal para escribir lo que quieras: reflexiones, sueños, señales que recibiste, rituales que hiciste, sincronicidades, gratitud, intenciones. Es privado y solo vos lo ves.</p>
            </div>
          </div>

          <div className="grim-tip">
            <strong>💡 Tip:</strong> Mantener un diario espiritual es una de las prácticas más poderosas para desarrollar la intuición. No tiene que ser largo ni elaborado - a veces una frase basta.
          </div>
        </div>
      )}

      {tab === 'lecturas' && (
        <div className="grim-lecturas">
          <h2>Mis Lecturas</h2>
          {usuario?.lecturas?.length > 0 ? (
            <div className="lecturas-lista">
              {usuario.lecturas.map((l, i) => (
                <div key={i} className="lectura-card">
                  <div className="lectura-head"><span className="lectura-tipo">{l.tipo}</span><span className="lectura-fecha">{l.fecha}</span></div>
                  <p className="lectura-preview">{l.resumen || l.contenido?.substring(0, 300)}...</p>
                  <button className="btn-sec">Leer completa</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-grim">
              <span>📜</span>
              <h3>Todavía no tenés lecturas</h3>
              <p>Cuando solicites una experiencia mágica (tirada de runas, lectura del alma, etc.), el resultado completo quedará guardado acá. Podrás releerlo cuando quieras, buscar patrones, ver cómo evoluciona tu camino.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'diario' && (
        <div className="grim-diario">
          <h2>Mi Diario Mágico</h2>
          <p className="diario-intro">Tu espacio sagrado. Cada entrada es un hechizo, cada reflexión una semilla de magia.</p>

          {/* Barra de vista */}
          <div className="diario-vistas">
            <button className={`vista-btn ${vistaCalendario ? 'act' : ''}`} onClick={() => setVistaCalendario(true)}>
              📅 Calendario Lunar
            </button>
            <button className={`vista-btn ${!vistaCalendario ? 'act' : ''}`} onClick={() => setVistaCalendario(false)}>
              📜 Lista Cronológica
            </button>
          </div>

          {/* VISTA CALENDARIO */}
          {vistaCalendario && (
            <div className="diario-calendario">
              {/* Navegación del mes */}
              <div className="cal-nav">
                <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))} className="cal-nav-btn">◀</button>
                <div className="cal-mes">
                  <span className="cal-mes-nombre">{mesActual.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })}</span>
                  <span className="cal-fase-hoy">{calcularFaseLunar(new Date()).icono} Luna {calcularFaseLunar(new Date()).nombre}</span>
                </div>
                <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))} className="cal-nav-btn">▶</button>
              </div>

              {/* Cabecera días de la semana */}
              <div className="cal-header">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                  <div key={d} className="cal-header-dia">{d}</div>
                ))}
              </div>

              {/* Grid del calendario */}
              <div className="cal-grid">
                {obtenerDiasMes().map((d, i) => (
                  <div
                    key={i}
                    className={`cal-dia ${d.vacio ? 'vacio' : ''} ${d.esHoy ? 'hoy' : ''} ${d.tieneEntradas ? 'con-entradas' : ''} ${diaSeleccionado === d.fecha ? 'sel' : ''}`}
                    onClick={() => !d.vacio && setDiaSeleccionado(d.fecha === diaSeleccionado ? null : d.fecha)}
                  >
                    {!d.vacio && (
                      <>
                        <span className="cal-dia-num">{d.dia}</span>
                        <span className="cal-dia-luna" title={`Luna ${d.faseLunar.nombre}: ${d.faseLunar.energia}`}>{d.faseLunar.icono}</span>
                        {d.tieneEntradas && <span className="cal-dia-marker">✦</span>}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Leyenda */}
              <div className="cal-leyenda">
                <span><span className="marker-dot hoy"></span> Hoy</span>
                <span><span className="marker-dot entradas"></span> Tiene entradas</span>
                <span>🌑 Nueva → 🌕 Llena → 🌑</span>
              </div>

              {/* Entradas del día seleccionado */}
              {diaSeleccionado && (
                <div className="dia-seleccionado">
                  <h3>📖 {diaSeleccionado}</h3>
                  {(() => {
                    const fechaSel = obtenerDiasMes().find(d => d.fecha === diaSeleccionado);
                    return fechaSel && (
                      <div className="dia-info-luna">
                        {fechaSel.faseLunar.icono} Luna {fechaSel.faseLunar.nombre}
                        <span className="luna-energia">{fechaSel.faseLunar.energia}</span>
                      </div>
                    );
                  })()}
                  {entradasDelDia.length > 0 ? (
                    <div className="entradas-dia">
                      {entradasDelDia.map((e, i) => {
                        const tipo = TIPOS_DIARIO.find(t => t.id === e.tipo) || TIPOS_DIARIO[TIPOS_DIARIO.length - 1];
                        return (
                          <div key={i} className="entrada-mini">
                            <span className="entrada-mini-tipo">{tipo.icono} {tipo.nombre}</span>
                            <p>{e.contenido}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="sin-entradas">No hay entradas este día. ¿Querés agregar una reflexión?</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VISTA LISTA */}
          {!vistaCalendario && usuario?.diario?.length > 0 && (
            <div className="diario-entradas">
              <h3>Todas tus entradas</h3>
              {usuario.diario.slice().reverse().map((e, i) => {
                const tipo = TIPOS_DIARIO.find(t => t.id === e.tipo) || TIPOS_DIARIO[TIPOS_DIARIO.length - 1];
                return (
                  <div key={i} className="entrada-card">
                    <div className="entrada-head"><span>{tipo.icono} {tipo.nombre}</span><span>{e.fecha}</span></div>
                    <p>{e.contenido}</p>
                  </div>
                );
              })}
            </div>
          )}

          {!vistaCalendario && (!usuario?.diario || usuario.diario.length === 0) && (
            <div className="empty-grim">
              <span>📜</span>
              <h3>Tu diario está vacío</h3>
              <p>Cada entrada que escribas aquí se guarda para siempre. Es tu registro mágico personal.</p>
            </div>
          )}

          {/* NUEVA ENTRADA */}
          <div className="diario-nuevo">
            <h3>✎ Nueva entrada</h3>
            <div className="tipos-entrada">
              {TIPOS_DIARIO.map(t => (
                <button key={t.id} className={`tipo-btn ${tipoEntrada === t.id ? 'act' : ''}`} onClick={() => setTipoEntrada(t.id)} title={t.desc}>
                  <span>{t.icono}</span>{t.nombre}
                </button>
              ))}
            </div>
            <div className="tipo-desc">{TIPOS_DIARIO.find(t => t.id === tipoEntrada)?.desc}</div>
            <textarea
              placeholder="Escribí lo que tengas en mente... No hay reglas, es tu espacio sagrado."
              value={entrada}
              onChange={e => setEntrada(e.target.value)}
              rows={5}
            />
            <div className="diario-acciones">
              <button className="btn-gold" onClick={guardarEntrada} disabled={!entrada.trim() || guardando}>
                {guardando ? 'Guardando...' : 'Guardar en mi grimorio'}
              </button>
              <span className="tip-runa">+1 Runa por día de práctica</span>
            </div>
          </div>

          {/* Estadísticas del diario */}
          {usuario?.diario?.length > 0 && (
            <div className="diario-stats">
              <h4>Tu camino en números</h4>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-num">{usuario.diario.length}</span>
                  <span className="stat-label">Entradas</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{[...new Set(usuario.diario.map(e => e.fecha))].length}</span>
                  <span className="stat-label">Días practicando</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{TIPOS_DIARIO.find(t => t.id === (usuario.diario.reduce((acc, e) => { acc[e.tipo] = (acc[e.tipo] || 0) + 1; return acc; }, {}), Object.entries(usuario.diario.reduce((acc, e) => { acc[e.tipo] = (acc[e.tipo] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0]?.[0]))?.icono || '✦'}</span>
                  <span className="stat-label">Tipo favorito</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

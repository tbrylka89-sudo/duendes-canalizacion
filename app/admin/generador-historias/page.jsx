'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Catálogo completo de guardianes
import catalogoData from '../../../data/guardianes-catalogo-completo.json';

function GeneradorHistoriasContent() {
  const searchParams = useSearchParams();
  const productoIdUrl = searchParams.get('producto');
  const nombreUrl = searchParams.get('nombre');

  // Estados del flujo
  const [paso, setPaso] = useState(1);
  const [modo, setModo] = useState(null); // 'existente' o 'nuevo'
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Catálogo
  const [catalogo] = useState(catalogoData);

  // Datos
  const [escaneo, setEscaneo] = useState(null);
  const [guardianes, setGuardianes] = useState([]);
  const [guardianSeleccionado, setGuardianSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [analisisImagen, setAnalisisImagen] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [historiaGenerada, setHistoriaGenerada] = useState('');
  const [sincrodestinos, setSincrodestinos] = useState([]);

  // Datos del guardián (para existentes se cargan, para nuevos se llenan)
  const [datosGuardian, setDatosGuardian] = useState({
    nombre: '',
    genero: 'M',
    especie: 'duende',
    categoria: 'Protección',
    tamano: 'mediano_especial',
    tamanoCm: 18,
    accesorios: '',
    esUnico: true,
    precioUSD: 200,
    precioUYU: 8000
  });

  // Chat de encuesta para guardianes nuevos
  const [chatEncuesta, setChatEncuesta] = useState([]);
  const [inputChat, setInputChat] = useState('');
  const [encuestaCompleta, setEncuestaCompleta] = useState(false);

  // Todas las especies disponibles
  const especiesDisponibles = [
    { id: 'duende', nombre: 'Duende', genero: 'M' },
    { id: 'duenda', nombre: 'Duenda', genero: 'F' },
    { id: 'pixie', nombre: 'Pixie', genero: 'F', siempreUnico: true },
    { id: 'elfo', nombre: 'Elfo', genero: 'M' },
    { id: 'elfa', nombre: 'Elfa', genero: 'F' },
    { id: 'bruja', nombre: 'Bruja', genero: 'F' },
    { id: 'brujo', nombre: 'Brujo', genero: 'M' },
    { id: 'vikingo', nombre: 'Vikingo', genero: 'M' },
    { id: 'vikinga', nombre: 'Vikinga', genero: 'F' },
    { id: 'leprechaun', nombre: 'Leprechaun', genero: 'M' },
    { id: 'chaman', nombre: 'Chamán', genero: 'M' },
    { id: 'chamana', nombre: 'Chamana', genero: 'F' },
    { id: 'mago', nombre: 'Mago', genero: 'M' },
    { id: 'maga', nombre: 'Maga', genero: 'F' },
    { id: 'guerrero', nombre: 'Guerrero', genero: 'M' },
    { id: 'guerrera', nombre: 'Guerrera', genero: 'F' },
    { id: 'gaucho', nombre: 'Gaucho', genero: 'M' },
    { id: 'sanador', nombre: 'Sanador', genero: 'M' },
    { id: 'sanadora', nombre: 'Sanadora', genero: 'F' },
    { id: 'maestro', nombre: 'Maestro', genero: 'M' },
    { id: 'maestra', nombre: 'Maestra', genero: 'F' },
    { id: 'alma_maestra', nombre: 'Alma Maestra', genero: 'neutro' },
    { id: 'duende_medicina', nombre: 'Duende Medicina', genero: 'M' },
    { id: 'gnomo', nombre: 'Gnomo', genero: 'M' },
    { id: 'ninfa', nombre: 'Ninfa', genero: 'F' },
    { id: 'druida', nombre: 'Druida', genero: 'M' },
    { id: 'alquimista', nombre: 'Alquimista', genero: 'M' },
    { id: 'oraculo', nombre: 'Oráculo', genero: 'neutro' },
    { id: 'hada', nombre: 'Hada (futuro)', genero: 'F' }
  ];

  // Todos los tamaños con precios
  const tamanosDisponibles = [
    { id: 'mini', nombre: 'Mini', cm: '~10', precioUSD: 70, precioUYU: 2500, esUnico: false, desc: 'Recreable' },
    { id: 'mini_especial', nombre: 'Mini Especial', cm: '~10', precioUSD: 150, precioUYU: 5500, esUnico: false, desc: 'Recreable, con detalles' },
    { id: 'pixie', nombre: 'Pixie', cm: '10-13', precioUSD: 150, precioUYU: 5500, esUnico: true, desc: 'SIEMPRE único' },
    { id: 'mediano_especial', nombre: 'Mediano Especial', cm: '17-22', precioUSD: 200, precioUYU: 8000, esUnico: true, desc: 'Pieza única' },
    { id: 'mediano_maestro_mistico', nombre: 'Mediano Maestro Místico', cm: '22-25', precioUSD: 550, precioUYU: 18000, esUnico: true, desc: 'Alta gama, único' },
    { id: 'grande_especial', nombre: 'Grande Especial', cm: '25-28', precioUSD: 450, precioUYU: 16000, esUnico: true, desc: 'Pieza única grande' },
    { id: 'grande_maestro_mistico', nombre: 'Grande Maestro Místico', cm: '27-30', precioUSD: 800, precioUYU: 32000, esUnico: true, desc: 'Máximo poder' },
    { id: 'gigante_especial', nombre: 'Gigante Especial', cm: '30+', precioUSD: 1050, precioUYU: 40000, esUnico: true, desc: 'Pieza monumental' },
    { id: 'gigante_maestro_mistico', nombre: 'Gigante Maestro Místico', cm: '35+', precioUSD: 2000, precioUYU: 80000, esUnico: true, desc: 'Obra maestra' }
  ];

  // Categorías
  const categoriasDisponibles = catalogo.categorias;

  // Cargar datos del catálogo cuando se selecciona un guardián existente
  const cargarDatosExistente = (nombreGuardian) => {
    const guardian = catalogo.guardianes.find(g =>
      g.nombre.toLowerCase() === nombreGuardian.toLowerCase()
    );

    if (guardian) {
      // Determinar tamaño y si es único
      let tamanoId = 'mediano_especial';
      let esUnico = true;

      if (guardian.especie === 'pixie') {
        tamanoId = 'pixie';
        esUnico = true;
      } else if (guardian.tamano === 'mini') {
        tamanoId = guardian.cm <= 10 ? 'mini' : 'mini_especial';
        esUnico = false;
      } else if (guardian.tamano === 'especial') {
        tamanoId = guardian.cm >= 17 ? 'mediano_especial' : 'mini_especial';
      } else if (guardian.tamano === 'mediano') {
        tamanoId = guardian.cm >= 22 ? 'mediano_maestro_mistico' : 'mediano_especial';
        esUnico = true;
      } else if (guardian.tamano === 'grande') {
        tamanoId = guardian.cm >= 27 ? 'grande_maestro_mistico' : 'grande_especial';
        esUnico = true;
      }

      const tamanoInfo = tamanosDisponibles.find(t => t.id === tamanoId);

      setDatosGuardian({
        nombre: guardian.nombre,
        genero: guardian.genero || 'M',
        especie: guardian.especie || 'duende',
        categoria: guardian.categoria || 'Protección',
        tamano: tamanoId,
        tamanoCm: guardian.cm || 18,
        accesorios: guardian.accesorios || '',
        esUnico: esUnico,
        precioUSD: tamanoInfo?.precioUSD || 200,
        precioUYU: tamanoInfo?.precioUYU || 8000
      });

      return guardian;
    }
    return null;
  };

  // Seleccionar guardián existente
  const seleccionarGuardian = (guardian) => {
    setGuardianSeleccionado(guardian);
    cargarDatosExistente(guardian.nombre);
  };

  // Manejar cambio de tamaño
  const handleTamanoChange = (tamanoId) => {
    const tamanoInfo = tamanosDisponibles.find(t => t.id === tamanoId);
    if (tamanoInfo) {
      const especie = especiesDisponibles.find(e => e.id === datosGuardian.especie);
      const esPixie = datosGuardian.especie === 'pixie';

      setDatosGuardian(prev => ({
        ...prev,
        tamano: tamanoId,
        tamanoCm: parseInt(tamanoInfo.cm) || 18,
        esUnico: esPixie ? true : tamanoInfo.esUnico,
        precioUSD: tamanoInfo.precioUSD,
        precioUYU: tamanoInfo.precioUYU
      }));
    }
  };

  // Manejar cambio de especie
  const handleEspecieChange = (especieId) => {
    const especie = especiesDisponibles.find(e => e.id === especieId);
    const esPixie = especieId === 'pixie';

    setDatosGuardian(prev => ({
      ...prev,
      especie: especieId,
      genero: especie?.genero || prev.genero,
      esUnico: esPixie ? true : prev.esUnico,
      tamano: esPixie ? 'pixie' : prev.tamano
    }));
  };

  // Paso 1: Escanear historias existentes
  const escanearHistorias = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/historias/escanear');
      const data = await res.json();
      if (data.success) {
        setEscaneo(data.analisis);
        setGuardianes(data.guardianes);
        setSincrodestinos(data.analisis?.patrones_detectados?.sincrodestinos?.map(s => s.sincrodestino) || []);
        setPaso(2);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  };

  // Iniciar encuesta para guardián nuevo
  const iniciarEncuestaNuevo = async () => {
    setCargando(true);
    setModo('nuevo');

    // Mensaje inicial del asistente
    const mensajeInicial = {
      rol: 'asistente',
      contenido: `¡Hola! Voy a ayudarte a registrar un nuevo guardián para el catálogo.

Necesito conocer algunos datos. Empecemos:

**¿Cómo se llama este guardián?**

(Escribí el nombre que canalizaron para este ser)`
    };

    setChatEncuesta([mensajeInicial]);
    setPaso(10); // Paso especial para encuesta
    setCargando(false);
  };

  // Enviar mensaje en encuesta
  const enviarMensajeEncuesta = async () => {
    if (!inputChat.trim()) return;

    const nuevoMensaje = { rol: 'usuario', contenido: inputChat };
    const chatActualizado = [...chatEncuesta, nuevoMensaje];
    setChatEncuesta(chatActualizado);
    setInputChat('');
    setCargando(true);

    try {
      const res = await fetch('/api/admin/historias/encuesta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          historialChat: chatActualizado,
          datosActuales: datosGuardian,
          catalogo: {
            especies: especiesDisponibles.map(e => e.nombre),
            tamanos: tamanosDisponibles.map(t => `${t.nombre} (${t.cm}cm - $${t.precioUYU})`),
            categorias: categoriasDisponibles
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        setChatEncuesta([...chatActualizado, { rol: 'asistente', contenido: data.respuesta }]);

        if (data.datosExtraidos) {
          setDatosGuardian(prev => ({ ...prev, ...data.datosExtraidos }));
        }

        if (data.encuestaCompleta) {
          setEncuestaCompleta(true);
        }
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setCargando(false);
  };

  // Continuar después de encuesta
  const continuarDespuesEncuesta = () => {
    setGuardianSeleccionado({ nombre: datosGuardian.nombre, esNuevo: true });
    setPaso(3);
  };

  // Analizar imagen
  const analizarImagen = async () => {
    if (!guardianSeleccionado?.imagen) {
      setPaso(4);
      cargarPreguntas();
      return;
    }

    setCargando(true);
    try {
      const res = await fetch('/api/admin/historias/analizar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagenUrl: guardianSeleccionado.imagen,
          nombre: datosGuardian.nombre,
          categoria: datosGuardian.categoria
        })
      });
      const data = await res.json();
      if (data.success) {
        setAnalisisImagen(data.analisis);
      }
    } catch (e) {
      console.error('Error analizando imagen:', e);
    }
    setPaso(4);
    cargarPreguntas();
    setCargando(false);
  };

  // Cargar preguntas dinámicas
  const cargarPreguntas = async () => {
    try {
      const params = new URLSearchParams({
        nombre: datosGuardian.nombre,
        categoria: datosGuardian.categoria,
        especie: datosGuardian.especie,
        analisis: analisisImagen || ''
      });
      const res = await fetch(`/api/admin/historias?${params}`);
      const data = await res.json();
      if (data.success) {
        setPreguntas(data.preguntas);
      }
    } catch (e) {
      console.error('Error cargando preguntas:', e);
    }
  };

  // Generar historia
  const generarHistoria = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/historias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: guardianSeleccionado?.id,
          ...datosGuardian,
          analisisImagen,
          respuestasEncuesta: respuestas,
          sincrodestinos_usados: sincrodestinos
        })
      });
      const data = await res.json();
      if (data.success) {
        setHistoriaGenerada(data.historia);
        setPaso(6);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  };

  // Guardar en WooCommerce
  const guardarEnWoo = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/historias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: guardianSeleccionado?.id,
          historia: historiaGenerada,
          datosGuardian: datosGuardian
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Historia guardada exitosamente para ${datosGuardian.nombre}`);
        // Reset
        setPaso(1);
        setGuardianSeleccionado(null);
        setHistoriaGenerada('');
        setRespuestas({});
        setModo(null);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError(e.message);
    }
    setCargando(false);
  };

  // Filtrar guardianes
  const guardianesFiltrados = guardianes.filter(g =>
    g.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="generador-container">
      <header className="generador-header">
        <h1>Generador de Historias</h1>
        <p className="subtitulo">Sistema inteligente de creación de contenido para guardianes</p>
        <div className="pasos">
          <span className={paso >= 1 ? 'activo' : ''}>1. Inicio</span>
          <span className={paso >= 2 ? 'activo' : ''}>2. Seleccionar</span>
          <span className={paso >= 3 ? 'activo' : ''}>3. Datos</span>
          <span className={paso >= 4 ? 'activo' : ''}>4. Encuesta</span>
          <span className={paso >= 6 ? 'activo' : ''}>5. Preview</span>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <main className="generador-main">
        {/* PASO 1: Elegir modo */}
        {paso === 1 && (
          <div className="paso-content">
            <h2>¿Qué querés hacer?</h2>

            <div className="modos-grid">
              <div className="modo-card" onClick={() => { setModo('existente'); escanearHistorias(); }}>
                <div className="icono">📚</div>
                <h3>Guardián Existente</h3>
                <p>Generar o regenerar historia para un guardián que ya está en el catálogo</p>
                <span className="badge">Carga automática de datos</span>
              </div>

              <div className="modo-card" onClick={iniciarEncuestaNuevo}>
                <div className="icono">✨</div>
                <h3>Guardián Nuevo</h3>
                <p>Registrar un nuevo guardián con encuesta inteligente</p>
                <span className="badge">Claude te guía paso a paso</span>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: Seleccionar guardián existente */}
        {paso === 2 && modo === 'existente' && (
          <div className="paso-content">
            <h2>Seleccionar Guardián</h2>

            {escaneo && (
              <div className="resumen-escaneo">
                <div className="stats">
                  <div className="stat">
                    <span className="numero">{escaneo.total_guardianes}</span>
                    <span className="label">Total</span>
                  </div>
                  <div className="stat">
                    <span className="numero">{escaneo.con_historia}</span>
                    <span className="label">Con Historia</span>
                  </div>
                  <div className="stat">
                    <span className="numero">{escaneo.sin_historia}</span>
                    <span className="label">Sin Historia</span>
                  </div>
                </div>
              </div>
            )}

            <div className="busqueda">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="guardianes-grid">
              {guardianesFiltrados.map(g => (
                <div
                  key={g.id}
                  className={`guardian-card ${guardianSeleccionado?.id === g.id ? 'seleccionado' : ''}`}
                  onClick={() => seleccionarGuardian(g)}
                >
                  {g.imagen && <img src={g.imagen} alt={g.nombre} />}
                  <div className="info">
                    <h4>{g.nombre}</h4>
                    <span className="categoria">{g.categorias?.[0] || 'Sin categoría'}</span>
                    <span className={`estado ${g.tiene_historia ? 'tiene' : 'no-tiene'}`}>
                      {g.tiene_historia ? '✓ Con historia' : '○ Sin historia'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {guardianSeleccionado && (
              <div className="acciones-fijas">
                <p>Seleccionado: <strong>{guardianSeleccionado.nombre}</strong></p>
                <button className="btn-primary" onClick={() => setPaso(3)}>
                  Continuar
                </button>
              </div>
            )}
          </div>
        )}

        {/* PASO 3: Datos del guardián */}
        {paso === 3 && (
          <div className="paso-content">
            <h2>Datos de {datosGuardian.nombre || 'Guardián'}</h2>

            {modo === 'existente' && datosGuardian.accesorios && (
              <div className="datos-cargados">
                ✓ Datos cargados automáticamente del catálogo
              </div>
            )}

            <div className="datos-form">
              <div className="campo-row">
                <div className="campo">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={datosGuardian.nombre}
                    onChange={(e) => setDatosGuardian({...datosGuardian, nombre: e.target.value})}
                    disabled={modo === 'existente'}
                  />
                </div>
                <div className="campo">
                  <label>Género</label>
                  <select
                    value={datosGuardian.genero}
                    onChange={(e) => setDatosGuardian({...datosGuardian, genero: e.target.value})}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="neutro">Neutro</option>
                  </select>
                </div>
              </div>

              <div className="campo-row">
                <div className="campo">
                  <label>Especie</label>
                  <select
                    value={datosGuardian.especie}
                    onChange={(e) => handleEspecieChange(e.target.value)}
                  >
                    {especiesDisponibles.map(esp => (
                      <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="campo">
                  <label>Categoría</label>
                  <select
                    value={datosGuardian.categoria}
                    onChange={(e) => setDatosGuardian({...datosGuardian, categoria: e.target.value})}
                  >
                    {categoriasDisponibles.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="campo">
                <label>Tamaño y Precio</label>
                <div className="tamanos-grid">
                  {tamanosDisponibles.map(tam => (
                    <div
                      key={tam.id}
                      className={`tamano-option ${datosGuardian.tamano === tam.id ? 'selected' : ''}`}
                      onClick={() => handleTamanoChange(tam.id)}
                    >
                      <span className="tamano-nombre">{tam.nombre}</span>
                      <span className="tamano-cm">{tam.cm}cm</span>
                      <span className="tamano-precio">${tam.precioUYU.toLocaleString()}</span>
                      <span className="tamano-desc">{tam.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="campo-row">
                <div className="campo">
                  <label>Medida exacta (cm)</label>
                  <input
                    type="number"
                    value={datosGuardian.tamanoCm}
                    onChange={(e) => setDatosGuardian({...datosGuardian, tamanoCm: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="campo">
                  <label>Tipo de pieza</label>
                  <div className={`tipo-pieza ${datosGuardian.esUnico ? 'unico' : 'recreable'}`}>
                    {datosGuardian.especie === 'pixie'
                      ? 'Pixie - SIEMPRE única'
                      : datosGuardian.esUnico
                        ? 'Pieza Única (desaparece al adoptarse)'
                        : 'Recreable (cada rostro es único)'}
                  </div>
                </div>
              </div>

              <div className="campo">
                <label>Accesorios y Cristales</label>
                <textarea
                  value={datosGuardian.accesorios}
                  onChange={(e) => setDatosGuardian({...datosGuardian, accesorios: e.target.value})}
                  placeholder="Descripción detallada de todos los accesorios, cristales, ropa..."
                  rows={4}
                />
              </div>

              <div className="info-sincrodestino">
                <span className="icon">✨</span>
                <p>El <strong>sincrodestino</strong> se genera automáticamente por la IA, eligiendo uno que no se haya usado antes.</p>
              </div>
            </div>

            <div className="acciones">
              <button className="btn-secondary" onClick={() => setPaso(modo === 'existente' ? 2 : 1)}>
                Volver
              </button>
              <button className="btn-primary" onClick={analizarImagen} disabled={cargando}>
                {cargando ? 'Procesando...' : 'Continuar'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: Encuesta dinámica */}
        {paso === 4 && (
          <div className="paso-content">
            <h2>Encuesta para {datosGuardian.nombre}</h2>

            {analisisImagen && (
              <div className="analisis-imagen">
                <h3>Análisis de la imagen</h3>
                <p>{analisisImagen}</p>
              </div>
            )}

            <div className="encuesta">
              {preguntas.map(p => (
                <div key={p.id} className="pregunta">
                  <label>{p.pregunta}</label>
                  {p.tipo === 'texto' ? (
                    <textarea
                      placeholder={p.opcional ? '(Opcional)' : 'Tu respuesta...'}
                      value={respuestas[p.pregunta] || ''}
                      onChange={(e) => setRespuestas({...respuestas, [p.pregunta]: e.target.value})}
                    />
                  ) : (
                    <div className="opciones">
                      {p.opciones?.map(op => (
                        <label key={op} className="opcion">
                          <input
                            type="radio"
                            name={p.id}
                            checked={respuestas[p.pregunta] === op}
                            onChange={() => setRespuestas({...respuestas, [p.pregunta]: op})}
                          />
                          {op}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="acciones">
              <button className="btn-secondary" onClick={() => setPaso(3)}>Volver</button>
              <button className="btn-primary" onClick={generarHistoria} disabled={cargando}>
                {cargando ? 'Generando...' : 'Generar Historia'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 6: Preview */}
        {paso === 6 && (
          <div className="paso-content paso-preview">
            <h2>Preview: {datosGuardian.nombre}</h2>

            <div className="preview-info">
              <span>{datosGuardian.especie}</span>
              <span>{datosGuardian.categoria}</span>
              <span>{datosGuardian.tamanoCm}cm</span>
              <span>${datosGuardian.precioUYU?.toLocaleString()}</span>
            </div>

            <div className="preview-container">
              <div className="preview-historia">
                {historiaGenerada.split('\n').map((linea, i) => {
                  if (linea.startsWith('**') && linea.endsWith('**')) {
                    return <h3 key={i}>{linea.replace(/\*\*/g, '')}</h3>;
                  }
                  if (linea.startsWith('*') && linea.endsWith('*')) {
                    return <p key={i} className="mensaje-guardian"><em>{linea.replace(/\*/g, '')}</em></p>;
                  }
                  if (linea.startsWith('- ')) {
                    return <li key={i}>{linea.substring(2)}</li>;
                  }
                  if (linea.trim()) {
                    return <p key={i}>{linea}</p>;
                  }
                  return null;
                })}
              </div>
            </div>

            <div className="acciones">
              <button className="btn-secondary" onClick={() => setPaso(4)}>Regenerar</button>
              <button className="btn-primary" onClick={guardarEnWoo} disabled={cargando}>
                {cargando ? 'Guardando...' : 'Guardar en WooCommerce'}
              </button>
            </div>
          </div>
        )}

        {/* PASO 10: Encuesta para guardián nuevo */}
        {paso === 10 && (
          <div className="paso-content paso-encuesta-chat">
            <h2>Registro de Nuevo Guardián</h2>

            <div className="chat-container">
              <div className="chat-mensajes">
                {chatEncuesta.map((msg, i) => (
                  <div key={i} className={`chat-mensaje ${msg.rol}`}>
                    <div className="contenido" dangerouslySetInnerHTML={{
                      __html: msg.contenido.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                    }} />
                  </div>
                ))}
                {cargando && (
                  <div className="chat-mensaje asistente">
                    <div className="typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
              </div>

              {!encuestaCompleta ? (
                <div className="chat-input">
                  <input
                    type="text"
                    value={inputChat}
                    onChange={(e) => setInputChat(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enviarMensajeEncuesta()}
                    placeholder="Escribí tu respuesta..."
                    disabled={cargando}
                  />
                  <button onClick={enviarMensajeEncuesta} disabled={cargando || !inputChat.trim()}>
                    Enviar
                  </button>
                </div>
              ) : (
                <div className="encuesta-completa">
                  <div className="resumen-datos">
                    <h4>Datos recopilados:</h4>
                    <p><strong>Nombre:</strong> {datosGuardian.nombre}</p>
                    <p><strong>Especie:</strong> {datosGuardian.especie}</p>
                    <p><strong>Categoría:</strong> {datosGuardian.categoria}</p>
                    <p><strong>Tamaño:</strong> {datosGuardian.tamanoCm}cm</p>
                    <p><strong>Accesorios:</strong> {datosGuardian.accesorios}</p>
                  </div>
                  <button className="btn-primary" onClick={continuarDespuesEncuesta}>
                    Continuar a generar historia
                  </button>
                </div>
              )}
            </div>

            <button className="btn-secondary volver-inicio" onClick={() => { setPaso(1); setModo(null); setChatEncuesta([]); }}>
              Cancelar y volver
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        .generador-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #e0e0e0;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .generador-header {
          padding: 2rem;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }

        .generador-header h1 {
          margin: 0;
          color: #fff;
          font-size: 2rem;
        }

        .subtitulo {
          margin: 0.5rem 0 1.5rem;
          opacity: 0.7;
        }

        .pasos {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .pasos span {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          font-size: 0.85rem;
          opacity: 0.5;
        }

        .pasos span.activo {
          opacity: 1;
          background: rgba(139, 92, 246, 0.3);
          border: 1px solid rgba(139, 92, 246, 0.5);
        }

        .generador-main {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .paso-content {
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 2rem;
        }

        .paso-content h2 {
          margin-top: 0;
          color: #fff;
        }

        /* Modos */
        .modos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .modo-card {
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .modo-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          background: rgba(139, 92, 246, 0.1);
          transform: translateY(-4px);
        }

        .modo-card .icono {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .modo-card h3 {
          margin: 0 0 0.5rem;
          color: #fff;
        }

        .modo-card p {
          margin: 0 0 1rem;
          opacity: 0.7;
          font-size: 0.9rem;
        }

        .modo-card .badge {
          background: rgba(139, 92, 246, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        /* Botones */
        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: transparent;
          color: #e0e0e0;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #fca5a5;
          padding: 1rem;
          margin: 1rem 2rem;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
        }

        .error-banner button {
          background: none;
          border: none;
          color: #fca5a5;
          font-size: 1.5rem;
          cursor: pointer;
        }

        /* Stats */
        .resumen-escaneo {
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
        }

        .stat {
          text-align: center;
        }

        .stat .numero {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #8b5cf6;
        }

        .stat .label {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        /* Búsqueda */
        .busqueda {
          margin-bottom: 1rem;
        }

        .busqueda input {
          width: 100%;
          max-width: 400px;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
        }

        /* Grid de guardianes */
        .guardianes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
          max-height: 450px;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .guardian-card {
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .guardian-card:hover {
          background: rgba(255,255,255,0.1);
        }

        .guardian-card.seleccionado {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.2);
        }

        .guardian-card img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .guardian-card h4 {
          margin: 0;
          font-size: 0.95rem;
        }

        .guardian-card .categoria {
          display: block;
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .guardian-card .estado {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          margin-top: 0.25rem;
        }

        .guardian-card .estado.tiene {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }

        .guardian-card .estado.no-tiene {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .acciones-fijas {
          position: sticky;
          bottom: 0;
          background: rgba(26, 26, 46, 0.95);
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem -2rem -2rem;
          border-radius: 0 0 16px 16px;
        }

        /* Formulario */
        .datos-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .campo-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .campo label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .campo input,
        .campo select,
        .campo textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
        }

        .campo input:disabled {
          opacity: 0.6;
        }

        .datos-cargados {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.5);
          color: #4ade80;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        /* Tamaños grid */
        .tamanos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .tamano-option {
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .tamano-option:hover {
          border-color: rgba(139, 92, 246, 0.3);
        }

        .tamano-option.selected {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.2);
        }

        .tamano-nombre {
          display: block;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .tamano-cm {
          display: block;
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .tamano-precio {
          display: block;
          color: #8b5cf6;
          font-weight: 600;
          margin: 0.25rem 0;
        }

        .tamano-desc {
          display: block;
          font-size: 0.7rem;
          opacity: 0.6;
        }

        .tipo-pieza {
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
        }

        .tipo-pieza.unico {
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.5);
        }

        .tipo-pieza.recreable {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.5);
        }

        .info-sincrodestino {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .info-sincrodestino .icon {
          font-size: 1.5rem;
        }

        .info-sincrodestino p {
          margin: 0;
          font-size: 0.9rem;
        }

        /* Encuesta */
        .encuesta {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .pregunta label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .pregunta textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
          min-height: 80px;
        }

        .opciones {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .opcion {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          cursor: pointer;
        }

        .analisis-imagen {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .acciones {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        /* Preview */
        .paso-preview {
          max-width: 800px;
          margin: 0 auto;
        }

        .preview-info {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .preview-info span {
          background: rgba(255,255,255,0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
        }

        .preview-container {
          background: #fff;
          color: #333;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .preview-historia h3 {
          color: #1a1a2e;
          margin-top: 1.5rem;
        }

        .preview-historia p {
          line-height: 1.7;
        }

        .preview-historia .mensaje-guardian {
          background: rgba(139, 92, 246, 0.1);
          padding: 1rem;
          border-left: 3px solid #8b5cf6;
          margin: 1rem 0;
        }

        .preview-historia li {
          margin-left: 1.5rem;
        }

        /* Chat encuesta */
        .paso-encuesta-chat {
          max-width: 700px;
          margin: 0 auto;
        }

        .chat-container {
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          overflow: hidden;
        }

        .chat-mensajes {
          max-height: 400px;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chat-mensaje {
          max-width: 85%;
        }

        .chat-mensaje.asistente {
          align-self: flex-start;
        }

        .chat-mensaje.usuario {
          align-self: flex-end;
        }

        .chat-mensaje .contenido {
          padding: 1rem;
          border-radius: 12px;
          line-height: 1.5;
        }

        .chat-mensaje.asistente .contenido {
          background: rgba(139, 92, 246, 0.2);
          border-bottom-left-radius: 4px;
        }

        .chat-mensaje.usuario .contenido {
          background: rgba(255,255,255,0.1);
          border-bottom-right-radius: 4px;
        }

        .typing {
          display: flex;
          gap: 4px;
          padding: 0.5rem;
        }

        .typing span {
          width: 8px;
          height: 8px;
          background: #8b5cf6;
          border-radius: 50%;
          animation: typing 1s infinite;
        }

        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .chat-input {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(0,0,0,0.2);
        }

        .chat-input input {
          flex: 1;
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #fff;
        }

        .chat-input button {
          padding: 0.75rem 1.5rem;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .chat-input button:disabled {
          opacity: 0.5;
        }

        .encuesta-completa {
          padding: 1.5rem;
          background: rgba(34, 197, 94, 0.1);
          border-top: 1px solid rgba(34, 197, 94, 0.3);
        }

        .resumen-datos {
          margin-bottom: 1rem;
        }

        .resumen-datos h4 {
          margin: 0 0 0.5rem;
          color: #4ade80;
        }

        .resumen-datos p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        .volver-inicio {
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .campo-row {
            grid-template-columns: 1fr;
          }

          .tamanos-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .guardianes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default function GeneradorHistorias() {
  return (
    <Suspense fallback={<div style={{padding: '2rem', color: '#fff', background: '#1a1a2e', minHeight: '100vh'}}>Cargando generador...</div>}>
      <GeneradorHistoriasContent />
    </Suspense>
  );
}

'use client';

import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TEST DE PERFILADO PSICOLÓGICO
// Clasifica usuarios por: vulnerabilidad, dolor, estilo decisión, poder adquisitivo, creencias
// ═══════════════════════════════════════════════════════════════════════════════

const PREGUNTAS = [
  {
    id: 'estado_actual',
    pregunta: '¿Cómo te sentís en este momento de tu vida?',
    opciones: [
      { valor: 'crisis', texto: 'Atravesando un momento difícil' },
      { valor: 'busqueda', texto: 'Buscando algo nuevo, un cambio' },
      { valor: 'curiosidad', texto: 'Con curiosidad, explorando' },
      { valor: 'estable', texto: 'Bien, pero abierta a crecer' }
    ]
  },
  {
    id: 'dolor_principal',
    pregunta: '¿Qué es lo que más te gustaría transformar?',
    opciones: [
      { valor: 'soledad', texto: 'Sentirme menos sola/incomprendida' },
      { valor: 'dinero', texto: 'Mi situación económica' },
      { valor: 'salud', texto: 'Mi bienestar físico o emocional' },
      { valor: 'relaciones', texto: 'Mis relaciones con otros' }
    ]
  },
  {
    id: 'decision',
    pregunta: 'Cuando algo te llama la atención, ¿cómo actuás?',
    opciones: [
      { valor: 'impulso', texto: 'Si me resuena, voy. Confío en mi intuición.' },
      { valor: 'analisis', texto: 'Investigo, leo reseñas, lo pienso bien.' },
      { valor: 'emocional', texto: 'Depende de cómo me haga sentir en el momento.' },
      { valor: 'consulto', texto: 'Le pregunto a alguien de confianza qué opina.' }
    ]
  },
  {
    id: 'tiempo_libre',
    pregunta: '¿En qué invertís tu tiempo libre idealmente?',
    opciones: [
      { valor: 'naturaleza', texto: 'Conectar con la naturaleza' },
      { valor: 'hobbies', texto: 'Hobbies creativos o artísticos' },
      { valor: 'social', texto: 'Estar con amigos/familia' },
      { valor: 'desarrollo', texto: 'Cursos, libros, crecimiento personal' }
    ]
  },
  {
    id: 'espiritualidad',
    pregunta: '¿Cuál es tu relación con lo espiritual?',
    opciones: [
      { valor: 'creyente', texto: 'Creo firmemente en lo que no se ve' },
      { valor: 'buscador', texto: 'Estoy explorando, abierta a todo' },
      { valor: 'esceptico', texto: 'Necesito pruebas, pero no descarto nada' },
      { valor: 'practico', texto: 'Me interesa lo que funciona, sin importar por qué' }
    ]
  },
  {
    id: 'inversion_bienestar',
    pregunta: '¿Cuánto solés invertir en tu bienestar al mes?',
    opciones: [
      { valor: 'poco', texto: 'Poco o nada, no es mi prioridad' },
      { valor: 'moderado', texto: 'Algo, cuando puedo' },
      { valor: 'regular', texto: 'Tengo un presupuesto fijo para esto' },
      { valor: 'alto', texto: 'Es una prioridad, invierto lo que sea necesario' }
    ]
  }
];

export default function TestPerfiladoPsicologico({ usuario, onComplete, onSkip }) {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [enviando, setEnviando] = useState(false);

  const pregunta = PREGUNTAS[preguntaActual];
  const progreso = ((preguntaActual + 1) / PREGUNTAS.length) * 100;

  const handleRespuesta = async (valor) => {
    const nuevasRespuestas = { ...respuestas, [pregunta.id]: valor };
    setRespuestas(nuevasRespuestas);

    // Pequeña pausa para feedback visual
    await new Promise(r => setTimeout(r, 200));

    if (preguntaActual < PREGUNTAS.length - 1) {
      setPreguntaActual(prev => prev + 1);
    } else {
      // Última pregunta - enviar
      enviarRespuestas(nuevasRespuestas);
    }
  };

  const enviarRespuestas = async (respuestasFinales) => {
    setEnviando(true);
    try {
      const res = await fetch('/api/mi-magia/perfilado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario.email,
          respuestas: respuestasFinales,
          datosAdicionales: {
            nombre: usuario.nombrePreferido || usuario.nombre,
            fechaNacimiento: usuario.fechaNacimiento,
            genero: usuario.genero || usuario.pronombre
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        onComplete(data.perfil);
      } else {
        console.error('Error en perfilado:', data.error);
        onComplete(null); // Continuar aunque falle
      }
    } catch (err) {
      console.error('Error enviando perfilado:', err);
      onComplete(null);
    }
    setEnviando(false);
  };

  if (enviando) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Analizando tus respuestas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.icono}>🔮</span>
          <h1 style={styles.titulo}>Una última cosa...</h1>
          <p style={styles.subtitulo}>Para personalizar tu experiencia al máximo</p>
        </div>

        {/* Barra de progreso */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progreso}%` }} />
        </div>
        <p style={styles.progressText}>
          Pregunta {preguntaActual + 1} de {PREGUNTAS.length}
        </p>

        {/* Pregunta */}
        <h2 style={styles.pregunta}>{pregunta.pregunta}</h2>

        {/* Opciones */}
        <div style={styles.opciones}>
          {pregunta.opciones.map((opcion, idx) => (
            <button
              key={idx}
              onClick={() => handleRespuesta(opcion.valor)}
              style={{
                ...styles.opcionBtn,
                ...(respuestas[pregunta.id] === opcion.valor ? styles.opcionSelected : {})
              }}
            >
              {opcion.texto}
            </button>
          ))}
        </div>

        {/* Navegación */}
        <div style={styles.nav}>
          {preguntaActual > 0 && (
            <button
              onClick={() => setPreguntaActual(prev => prev - 1)}
              style={styles.backBtn}
            >
              ← Anterior
            </button>
          )}
          <button onClick={onSkip} style={styles.skipBtn}>
            Omitir por ahora
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: 'rgba(26, 26, 46, 0.95)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  icono: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '15px'
  },
  titulo: {
    color: '#d4af37',
    fontSize: '24px',
    margin: '0 0 10px 0'
  },
  subtitulo: {
    color: '#a0a0a0',
    margin: 0
  },
  progressBar: {
    height: '4px',
    background: 'rgba(212, 175, 55, 0.2)',
    borderRadius: '2px',
    marginBottom: '10px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #d4af37, #f4d03f)',
    transition: 'width 0.3s ease'
  },
  progressText: {
    color: '#888',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px'
  },
  pregunta: {
    color: '#f5f5dc',
    fontSize: '20px',
    textAlign: 'center',
    marginBottom: '25px',
    lineHeight: '1.5'
  },
  opciones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  opcionBtn: {
    padding: '16px 20px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    color: '#f5f5dc',
    fontSize: '15px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease'
  },
  opcionSelected: {
    background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
    color: '#1a1a1a',
    fontWeight: 'bold'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '25px'
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px'
  },
  skipBtn: {
    background: 'transparent',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    color: '#888',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  spinner: {
    width: '50px',
    height: '50px',
    margin: '0 auto 20px',
    border: '3px solid rgba(212, 175, 55, 0.3)',
    borderTopColor: '#d4af37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#a0a0a0',
    textAlign: 'center'
  }
};

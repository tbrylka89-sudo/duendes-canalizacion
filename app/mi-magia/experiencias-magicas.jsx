'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// EXPERIENCIAS MÁGICAS - DISEÑO PREMIUM
// Sin emojis, animaciones elegantes, estética mística
// ═══════════════════════════════════════════════════════════════

const API_BASE = typeof window !== 'undefined' ? window.location.origin : '';

// ─────────────────────────────────────────────────────────────
// CATEGORÍAS CON SÍMBOLOS ELEGANTES
// ─────────────────────────────────────────────────────────────
const CATEGORIAS = {
  mensajes: { id: 'mensajes', nombre: 'Mensajes', simbolo: '◈', color: '#9370DB' },
  guardianes: { id: 'guardianes', nombre: 'Guardián', simbolo: '⬡', color: '#4A7C59' },
  elementales: { id: 'elementales', nombre: 'Elementales', simbolo: '◇', color: '#E07020' },
  cristales: { id: 'cristales', nombre: 'Cristales', simbolo: '◆', color: '#00CED1' },
  tarot: { id: 'tarot', nombre: 'Tarot', simbolo: '▣', color: '#8B4513' },
  runas: { id: 'runas', nombre: 'Runas', simbolo: 'ᚱ', color: '#D4AF37' },
  astrologia: { id: 'astrologia', nombre: 'Lunar', simbolo: '☽', color: '#4169E1' },
  energia: { id: 'energia', nombre: 'Energía', simbolo: '✧', color: '#FFD700' },
  alma: { id: 'alma', nombre: 'Alma', simbolo: '❋', color: '#DDA0DD' },
  proteccion: { id: 'proteccion', nombre: 'Protección', simbolo: '⛊', color: '#708090' },
  amor: { id: 'amor', nombre: 'Amor', simbolo: '♡', color: '#E91E63' },
  numerologia: { id: 'numerologia', nombre: 'Números', simbolo: '#', color: '#9C27B0' },
  suenos: { id: 'suenos', nombre: 'Sueños', simbolo: '☁', color: '#3F51B5' },
  abundancia: { id: 'abundancia', nombre: 'Abundancia', simbolo: '₿', color: '#FF9800' },
  akashicos: { id: 'akashicos', nombre: 'Akáshicos', simbolo: '∞', color: '#673AB7' },
  sanacion: { id: 'sanacion', nombre: 'Sanación', simbolo: '❤', color: '#4CAF50' }
};

// ─────────────────────────────────────────────────────────────
// EXPERIENCIAS
// ─────────────────────────────────────────────────────────────
const EXPERIENCIAS = [
  // MENSAJES CANALIZADOS
  {
    id: 'susurro_guardian',
    nombre: 'Susurro de tu Guardián',
    categoria: 'mensajes',
    runas: 20,
    tiempoMinutos: 15,
    descripcionCorta: 'Un mensaje directo de tu duende protector',
    descripcionLarga: `Tu guardián tiene algo que decirte. Algo que ha observado, algo que necesitás escuchar. Este no es un mensaje genérico. Es lo que TU duende quiere transmitirte en este momento exacto.`,
    requiereGuardian: true,
    campos: [
      { id: 'estado_animo', tipo: 'select', label: '¿Cómo te sentís hoy?', opciones: ['Tranquila', 'Ansiosa', 'Triste', 'Confundida', 'Esperanzada', 'Cansada', 'Emocionada'] },
      { id: 'tema_mensaje', tipo: 'select', label: '¿Sobre qué te gustaría recibir guía?', opciones: ['Lo que mi guardián quiera decirme', 'Una decisión que tengo que tomar', 'Mi camino espiritual', 'Mis relaciones', 'Mi trabajo o proyectos', 'Mi salud emocional'] },
      { id: 'pregunta_opcional', tipo: 'textarea', label: '¿Hay algo específico que quieras preguntarle?', placeholder: 'Podés dejarlo vacío y dejar que fluya...' }
    ]
  },
  {
    id: 'mensaje_universo',
    nombre: 'Lo que el Universo Quiere Decirte',
    categoria: 'mensajes',
    runas: 25,
    tiempoMinutos: 25,
    descripcionCorta: 'Canalización directa del cosmos',
    descripcionLarga: `El universo siempre está hablando. Esta canalización es un mensaje específico que el universo tiene para VOS, en ESTE momento, considerando TODO lo que estás viviendo.`,
    requiereGuardian: false,
    campos: [
      { id: 'momento_vida', tipo: 'textarea', label: '¿Qué momento de tu vida estás atravesando?', placeholder: 'Contanos brevemente qué está pasando...' },
      { id: 'sensacion_recurrente', tipo: 'select', label: '¿Qué sensación te persigue últimamente?', opciones: ['Que algo grande viene', 'Que estoy estancada', 'Que algo termina', 'Que necesito cambiar', 'Que estoy en el camino correcto', 'No sé qué siento'] },
      { id: 'area_claridad', tipo: 'select', label: '¿En qué área necesitás más claridad?', opciones: ['Propósito de vida', 'Amor y relaciones', 'Trabajo y abundancia', 'Salud y energía', 'Decisiones importantes', 'Todo en general'] }
    ]
  },
  {
    id: 'carta_ancestros',
    nombre: 'Carta de tus Ancestros',
    categoria: 'mensajes',
    runas: 45,
    tiempoMinutos: 45,
    descripcionCorta: 'Mensaje canalizado de tu linaje',
    descripcionLarga: `Tus ancestros te observan. Esta carta es un mensaje de ellos. No de "los ancestros" en general, sino de los TUYOS. Los que caminaron antes para que vos pudieras caminar ahora.`,
    requiereGuardian: false,
    campos: [
      { id: 'conocimiento_ancestros', tipo: 'select', label: '¿Qué tanto conocés de tu historia familiar?', opciones: ['Mucho, conozco varias generaciones', 'Algo, conozco a mis abuelos', 'Poco, hay muchos misterios', 'Casi nada, familia fragmentada'] },
      { id: 'herencia_sentida', tipo: 'textarea', label: '¿Qué sentís que heredaste de tu familia?', placeholder: 'Patrones, dones, miedos, fortalezas...' },
      { id: 'ancestro_conexion', tipo: 'text', label: '¿Hay algún ancestro con quien sientas conexión especial?', placeholder: 'Un nombre, un rol, o dejalo vacío' },
      { id: 'pregunta_linaje', tipo: 'textarea', label: '¿Qué te gustaría preguntarles?', placeholder: 'Tu pregunta para el linaje...' }
    ]
  },

  // CONEXIÓN CON GUARDIANES
  {
    id: 'estado_guardian',
    nombre: 'Estado Energético de tu Guardián',
    categoria: 'guardianes',
    runas: 20,
    tiempoMinutos: 20,
    descripcionCorta: 'Cómo está tu duende y qué necesita',
    descripcionLarga: `Los guardianes también tienen estados. Este estudio analiza cómo está TU guardián en este momento. Su nivel de energía, lo que ha estado haciendo por vos, y lo que necesita.`,
    requiereGuardian: true,
    campos: [
      { id: 'ultima_conexion', tipo: 'select', label: '¿Cuándo fue la última vez que "hablaste" con tu guardián?', opciones: ['Hoy', 'Esta semana', 'Este mes', 'Hace mucho', 'Nunca conscientemente'] },
      { id: 'donde_guardian', tipo: 'select', label: '¿Dónde está tu guardián físicamente?', opciones: ['En mi altar', 'En mi habitación', 'En la sala', 'En mi lugar de trabajo', 'Lo llevo conmigo', 'No tengo figura física'] },
      { id: 'cambios_notados', tipo: 'textarea', label: '¿Has notado algo diferente últimamente?', placeholder: 'Sueños, sensaciones, coincidencias...' }
    ]
  },
  {
    id: 'mision_guardian',
    nombre: 'La Misión de tu Guardián',
    categoria: 'guardianes',
    runas: 45,
    tiempoMinutos: 50,
    descripcionCorta: 'Por qué te eligió y cuál es su propósito',
    descripcionLarga: `Tu guardián no te eligió por casualidad. Este estudio revela POR QUÉ este duende específico te eligió. Qué vio en tu alma. Qué viene a enseñarte.`,
    requiereGuardian: true,
    campos: [
      { id: 'como_llego', tipo: 'textarea', label: '¿Cómo llegó tu guardián a tu vida?', placeholder: 'Cómo lo encontraste, qué sentiste...' },
      { id: 'conexion_sentida', tipo: 'textarea', label: '¿Qué conexión especial sentís con él?', placeholder: 'Lo que te hace sentir, lo que representa...' },
      { id: 'desafio_actual', tipo: 'textarea', label: '¿Cuál es tu mayor desafío de vida actualmente?', placeholder: 'Algo que estés enfrentando...' },
      { id: 'don_principal', tipo: 'select', label: '¿Cuál sentís que es tu don principal?', opciones: ['Intuición', 'Sanación', 'Creatividad', 'Fortaleza', 'Empatía', 'Sabiduría', 'No lo sé aún'] }
    ]
  },
  {
    id: 'historia_guardian',
    nombre: 'La Historia de tu Guardián',
    categoria: 'guardianes',
    runas: 55,
    tiempoMinutos: 60,
    descripcionCorta: 'Su origen milenario y memorias',
    descripcionLarga: `Tu guardián tiene una historia. Miles de años de existencia. Este estudio canaliza la HISTORIA completa de tu guardián. De dónde viene. Cómo llegó al bosque de Uruguay.`,
    requiereGuardian: true,
    campos: [
      { id: 'caracteristicas_guardian', tipo: 'textarea', label: 'Describí a tu guardián: su apariencia, lo que transmite', placeholder: 'Todo lo que percibas de él...' },
      { id: 'nombre_historia', tipo: 'text', label: '¿Le pusiste un nombre o usás el original?', placeholder: 'El nombre con el que lo llamás' },
      { id: 'curiosidad_guardian', tipo: 'textarea', label: '¿Qué te gustaría saber de su historia?', placeholder: 'Qué te genera curiosidad de su pasado...' }
    ]
  },

  // REINO ELEMENTAL
  {
    id: 'elemento_dominante',
    nombre: 'Tu Elemento Dominante Oculto',
    categoria: 'elementales',
    runas: 25,
    tiempoMinutos: 25,
    descripcionCorta: 'Descubre qué elemento realmente te rige',
    descripcionLarga: `A veces el elemento que nos rige está oculto. Este estudio analiza tu energía real y revela qué elemento está verdaderamente en tu núcleo.`,
    requiereGuardian: false,
    campos: [
      { id: 'elemento_creido', tipo: 'select', label: '¿Qué elemento siempre creíste que eras?', opciones: ['Fuego', 'Agua', 'Tierra', 'Aire', 'Ninguno en particular', 'Todos un poco'] },
      { id: 'reaccion_estres', tipo: 'select', label: 'Cuando estás bajo estrés, ¿qué hacés?', opciones: ['Exploto y después me calmo', 'Me cierro y proceso sola', 'Busco soluciones prácticas', 'Analizo y racionalizo', 'Me paralizo', 'Huyo o evito'] },
      { id: 'ambiente_preferido', tipo: 'select', label: '¿Dónde te sentís más vos?', opciones: ['Cerca del mar o ríos', 'En montañas o bosques', 'En lugares altos con viento', 'Cerca del fuego o sol', 'En la ciudad', 'En mi casa'] },
      { id: 'patron_relaciones', tipo: 'textarea', label: 'Describí el patrón que se repite en tus relaciones', placeholder: 'Cómo empiezan, cómo terminan, qué rol tomás...' }
    ]
  },
  {
    id: 'sanacion_elemental',
    nombre: 'Sanación con los 4 Elementos',
    categoria: 'elementales',
    runas: 50,
    tiempoMinutos: 45,
    descripcionCorta: 'Protocolo de sanación personalizado',
    descripcionLarga: `Cada elemento tiene poder sanador. Este estudio crea un PROTOCOLO DE SANACIÓN personalizado usando los 4 elementos para lo que necesitás sanar ahora.`,
    requiereGuardian: false,
    campos: [
      { id: 'que_sanar', tipo: 'textarea', label: '¿Qué necesitás sanar o soltar?', placeholder: 'Puede ser emocional, físico, mental o espiritual...' },
      { id: 'elemento_afinidad', tipo: 'select', label: '¿Con qué elemento tenés más afinidad?', opciones: ['Fuego', 'Agua', 'Tierra', 'Aire', 'Ninguno en particular'] },
      { id: 'elemento_resistencia', tipo: 'select', label: '¿Qué elemento te cuesta o evitás?', opciones: ['Fuego', 'Agua', 'Tierra', 'Aire', 'Ninguno en particular'] }
    ]
  },
  {
    id: 'elemental_personal',
    nombre: 'Tu Elemental Personal',
    categoria: 'elementales',
    runas: 35,
    tiempoMinutos: 35,
    descripcionCorta: 'El ser elemental que te acompaña',
    descripcionLarga: `Además de tu guardián, hay un ser elemental que te acompaña. Una salamandra, ondina, gnomo o sílfide. Este estudio revela quién es.`,
    requiereGuardian: false,
    campos: [
      { id: 'conexion_naturaleza', tipo: 'textarea', label: '¿Cómo es tu relación con la naturaleza?', placeholder: 'Cuánto tiempo pasás en ella...' },
      { id: 'experiencias_elementales', tipo: 'textarea', label: '¿Has tenido experiencias extrañas con elementos?', placeholder: 'Fuego que se mueve raro, agua que te llama...' },
      { id: 'suenos_naturaleza', tipo: 'textarea', label: '¿Sueños recurrentes con elementos naturales?', placeholder: 'Sueños con agua, fuego, volar, cuevas...' }
    ]
  },

  // CRISTALOMANCIA
  {
    id: 'cristal_alma',
    nombre: 'El Cristal de tu Alma',
    categoria: 'cristales',
    runas: 30,
    tiempoMinutos: 30,
    descripcionCorta: 'Qué cristal está codificado en tu esencia',
    descripcionLarga: `Cada alma tiene un cristal. No es el que te gusta, es el que ERES. Este estudio revela qué cristal está codificado en tu esencia.`,
    requiereGuardian: false,
    campos: [
      { id: 'cristales_actuales', tipo: 'textarea', label: '¿Qué cristales tenés o te atraen?', placeholder: 'Los que tenés, los que te gustaría tener...' },
      { id: 'sensacion_cristales', tipo: 'select', label: '¿Qué sentís cuando tocás cristales?', opciones: ['Mucha energía/vibración', 'Calma y paz', 'No siento nada particular', 'Depende del cristal', 'Nunca he tocado conscientemente'] },
      { id: 'cualidad_buscada', tipo: 'select', label: '¿Qué cualidad buscás más en tu vida?', opciones: ['Amor', 'Protección', 'Claridad', 'Abundancia', 'Sanación', 'Intuición', 'Fuerza', 'Paz'] }
    ]
  },
  {
    id: 'grid_cristales',
    nombre: 'Tu Grid de Cristales',
    categoria: 'cristales',
    runas: 40,
    tiempoMinutos: 40,
    descripcionCorta: 'Diseño de red de cristales personalizado',
    descripcionLarga: `Los grids son geometrías de poder. Este estudio diseña un GRID PERSONALIZADO para tu intención específica con los cristales que tenés.`,
    requiereGuardian: false,
    campos: [
      { id: 'intencion_grid', tipo: 'textarea', label: '¿Cuál es la intención para tu grid?', placeholder: 'Qué querés manifestar, sanar, proteger...' },
      { id: 'cristales_disponibles', tipo: 'textarea', label: '¿Qué cristales tenés disponibles?', placeholder: 'Listá todos los que tenés...' },
      { id: 'espacio_grid', tipo: 'select', label: '¿Dónde colocarías el grid?', opciones: ['Altar', 'Mesa de noche', 'Escritorio', 'Centro de la casa', 'Jardín', 'Otro lugar especial'] }
    ]
  },

  // TAROT Y ORÁCULOS
  {
    id: 'tarot_profundo',
    nombre: 'Lectura de Tarot Profunda',
    categoria: 'tarot',
    runas: 50,
    tiempoMinutos: 35,
    descripcionCorta: 'Tirada completa de 10 cartas',
    descripcionLarga: `Lectura profunda de 10 cartas que cubre pasado, presente, futuro, influencias, miedos, ambiente, consejos y resultado. Interpretación personalizada.`,
    requiereGuardian: false,
    campos: [
      { id: 'pregunta_tarot', tipo: 'textarea', label: '¿Cuál es tu pregunta o situación?', placeholder: 'Sé lo más específica posible...' },
      { id: 'area_consulta', tipo: 'select', label: '¿En qué área de vida?', opciones: ['Amor y relaciones', 'Trabajo y carrera', 'Dinero y abundancia', 'Salud y bienestar', 'Familia', 'Decisiones importantes', 'Espiritualidad', 'General'] },
      { id: 'tiempo_situacion', tipo: 'select', label: '¿Hace cuánto dura esta situación?', opciones: ['Es nueva (menos de 1 mes)', 'Reciente (1-6 meses)', 'Ya lleva tiempo (6 meses - 2 años)', 'Crónica (más de 2 años)', 'Acaba de aparecer'] }
    ]
  },
  {
    id: 'oraculo_duendes',
    nombre: 'Oráculo de los Duendes',
    categoria: 'tarot',
    runas: 25,
    tiempoMinutos: 25,
    descripcionCorta: 'Mensaje a través del oráculo del bosque',
    descripcionLarga: `Los duendes tienen su propio sistema de adivinación usando los símbolos del bosque. Es un oráculo único que no encontrarás en otro lugar.`,
    requiereGuardian: false,
    campos: [
      { id: 'pregunta_oraculo', tipo: 'textarea', label: '¿Qué querés preguntarle al bosque?', placeholder: 'Tu pregunta para los duendes...' },
      { id: 'urgencia', tipo: 'select', label: '¿Qué tan urgente es esto para vos?', opciones: ['Muy urgente', 'Importante pero no urgente', 'Curiosidad general', 'Guía para el futuro lejano'] },
      { id: 'simbolo_atrae', tipo: 'select', label: '¿Qué símbolo del bosque te atrae más?', opciones: ['Hongos', 'Hojas', 'Piedras', 'Raíces', 'Flores', 'Animales pequeños', 'Agua/arroyos', 'Luz entre los árboles'] }
    ]
  },
  {
    id: 'carta_año',
    nombre: 'Tu Carta del Año',
    categoria: 'tarot',
    runas: 40,
    tiempoMinutos: 30,
    descripcionCorta: 'El arcano que rige tu año personal',
    descripcionLarga: `Cada año tiene una carta de tarot que lo rige para vos. Este estudio profundiza en tu arcano del año y cómo trabajar con su energía.`,
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nacimiento', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'temas_año', tipo: 'textarea', label: '¿Qué temas están siendo importantes este año?', placeholder: 'Lo que ha estado presente...' },
      { id: 'meta_año', tipo: 'textarea', label: '¿Cuál es tu mayor meta para este año?', placeholder: 'Lo que querés lograr...' }
    ]
  },

  // RUNAS NÓRDICAS
  {
    id: 'tirada_runas_3',
    nombre: 'Tirada de 3 Runas',
    categoria: 'runas',
    runas: 25,
    tiempoMinutos: 20,
    descripcionCorta: 'Pasado, presente y futuro en runas',
    descripcionLarga: `Las runas nórdicas son uno de los sistemas de adivinación más antiguos. Esta tirada te muestra el flujo de tu situación.`,
    requiereGuardian: false,
    campos: [
      { id: 'pregunta_runas', tipo: 'textarea', label: '¿Sobre qué querés consultar?', placeholder: 'Tu pregunta o situación...' },
      { id: 'contexto_breve', tipo: 'textarea', label: 'Contexto breve', placeholder: 'Lo esencial que debo saber...' }
    ]
  },
  {
    id: 'tirada_runas_9',
    nombre: 'Tirada de las 9 Runas',
    categoria: 'runas',
    runas: 65,
    tiempoMinutos: 45,
    descripcionCorta: 'Lectura completa del destino rúnico',
    descripcionLarga: `La tirada de 9 runas cubre todos los aspectos: lo visible y lo oculto, tus aliados y obstáculos, el camino y el destino.`,
    requiereGuardian: false,
    campos: [
      { id: 'situacion_completa', tipo: 'textarea', label: 'Describí tu situación completa', placeholder: 'Todo lo que está pasando...' },
      { id: 'pregunta_central', tipo: 'textarea', label: '¿Cuál es tu pregunta central?', placeholder: 'Lo que más necesitás saber...' },
      { id: 'obstaculos_percibidos', tipo: 'textarea', label: '¿Qué obstáculos percibís?', placeholder: 'Lo que creés que te frena...' }
    ]
  },
  {
    id: 'runa_personal',
    nombre: 'Tu Runa de Nacimiento',
    categoria: 'runas',
    runas: 30,
    tiempoMinutos: 30,
    descripcionCorta: 'La runa que rige tu alma',
    descripcionLarga: `Así como hay signos zodiacales, hay runas de nacimiento. Este estudio revela tu runa y cómo trabajar con ella.`,
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nac_runas', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'atraccion_runas', tipo: 'textarea', label: '¿Hay alguna runa que siempre te atrajo?', placeholder: 'Describila o decí que no...' },
      { id: 'caracteristica_principal', tipo: 'select', label: '¿Cómo te describirían tus amigos?', opciones: ['Fuerte y decidida', 'Sabia y tranquila', 'Creativa y libre', 'Protectora y leal', 'Intensa y apasionada', 'Misteriosa y profunda'] }
    ]
  },

  // ASTROLOGÍA Y CICLOS
  {
    id: 'luna_personal',
    nombre: 'Tu Luna Personal',
    categoria: 'astrologia',
    runas: 40,
    tiempoMinutos: 35,
    descripcionCorta: 'Análisis profundo de tu luna natal',
    descripcionLarga: `El sol muestra quién sos al mundo. La luna muestra quién sos en privado. Este estudio analiza tu luna natal y su influencia.`,
    requiereGuardian: false,
    campos: [
      { id: 'fecha_hora_lugar', tipo: 'text', label: 'Fecha, hora y lugar de nacimiento', placeholder: 'Ej: 15/03/1990, 14:30, Montevideo' },
      { id: 'relacion_emociones', tipo: 'select', label: '¿Cómo es tu relación con tus emociones?', opciones: ['Las siento muy intensamente', 'Me cuesta sentirlas', 'Son un torbellino', 'Las controlo bien', 'Depende del día'] },
      { id: 'relacion_madre', tipo: 'textarea', label: '¿Cómo fue/es tu relación con tu madre?', placeholder: 'Breve descripción...' }
    ]
  },
  {
    id: 'ciclo_lunar_mes',
    nombre: 'Tu Mes Lunar',
    categoria: 'astrologia',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Guía completa según las fases lunares',
    descripcionLarga: `La luna cambia cada semana. Este estudio crea una GUÍA COMPLETA del mes lunar para vos. Qué hacer en cada fase.`,
    requiereGuardian: false,
    campos: [
      { id: 'mes_consulta', tipo: 'select', label: '¿Para qué mes?', opciones: ['Este mes actual', 'El próximo mes'] },
      { id: 'proyectos_actuales', tipo: 'textarea', label: '¿Qué proyectos o temas tenés activos?', placeholder: 'Lo que estás trabajando...' },
      { id: 'signo_solar', tipo: 'select', label: 'Tu signo solar', opciones: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'] }
    ]
  },

  // LECTURAS ENERGÉTICAS
  {
    id: 'lectura_aura',
    nombre: 'Lectura de Aura',
    categoria: 'energia',
    runas: 40,
    tiempoMinutos: 35,
    descripcionCorta: 'Análisis completo de tu campo energético',
    descripcionLarga: `Tu aura tiene colores, capas, manchas, brillos. Esta lectura analiza tu aura tal como está AHORA y qué significa.`,
    requiereGuardian: false,
    campos: [
      { id: 'estado_actual', tipo: 'textarea', label: '¿Cómo te sentís física, emocional y mentalmente?', placeholder: 'Tu estado general...' },
      { id: 'sensaciones_fisicas', tipo: 'textarea', label: '¿Tenés sensaciones físicas particulares?', placeholder: 'Hormigueos, frío/calor, pesadez...' },
      { id: 'ambiente_frecuente', tipo: 'select', label: '¿Dónde pasás más tiempo?', opciones: ['En casa sola', 'En casa con familia', 'En oficina/trabajo', 'En muchos lugares diferentes', 'En la naturaleza'] }
    ]
  },
  {
    id: 'corte_cordones',
    nombre: 'Análisis de Cordones Energéticos',
    categoria: 'energia',
    runas: 55,
    tiempoMinutos: 45,
    descripcionCorta: 'Detecta y corta conexiones dañinas',
    descripcionLarga: `Estamos conectados energéticamente a muchas personas. Este estudio detecta qué cordones necesitan ser cortados e incluye el ritual.`,
    requiereGuardian: false,
    campos: [
      { id: 'personas_peso', tipo: 'textarea', label: '¿Con quién sentís un peso o conexión intensa?', placeholder: 'Personas que ocupan mucho espacio mental...' },
      { id: 'relaciones_cerradas', tipo: 'textarea', label: '¿Hay relaciones que terminaron pero siguen presentes?', placeholder: 'Ex parejas, amistades rotas...' }
    ]
  },
  {
    id: 'chakras_estado',
    nombre: 'Estado de tus Chakras',
    categoria: 'energia',
    runas: 50,
    tiempoMinutos: 40,
    descripcionCorta: 'Diagnóstico de tus 7 centros energéticos',
    descripcionLarga: `Los chakras son vórtices de energía. Este estudio analiza cada uno de tus 7 chakras: su estado, bloqueos y cómo sanarlos.`,
    requiereGuardian: false,
    campos: [
      { id: 'sintomas_fisicos', tipo: 'textarea', label: '¿Tenés algún síntoma físico recurrente?', placeholder: 'Dolores, tensiones...' },
      { id: 'patron_emocional', tipo: 'textarea', label: '¿Cuál es tu patrón emocional más frecuente?', placeholder: 'Ansiedad, tristeza, enojo, miedo...' },
      { id: 'area_trabada', tipo: 'select', label: '¿Qué área de tu vida sentís más trabada?', opciones: ['Supervivencia/dinero', 'Relaciones/sexualidad', 'Poder personal/autoestima', 'Amor/relaciones profundas', 'Comunicación/expresión', 'Intuición/claridad', 'Conexión espiritual'] }
    ]
  },

  // ESTUDIOS DEL ALMA
  {
    id: 'mision_alma',
    nombre: 'La Misión de tu Alma',
    categoria: 'alma',
    runas: 200,
    tiempoMinutos: 60,
    descripcionCorta: 'Descubre para qué viniste a esta vida',
    descripcionLarga: `Tu alma eligió venir. Este estudio revela la misión de tu alma. Lo que viniste a aprender, a sanar, a aportar.`,
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nacimiento_mision', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'preguntas_existenciales', tipo: 'textarea', label: '¿Qué preguntas existenciales te persiguen?', placeholder: 'Lo que te preguntás sobre la vida...' },
      { id: 'patrones_vida', tipo: 'textarea', label: '¿Qué patrones se repiten en tu vida?', placeholder: 'Situaciones, tipos de personas...' },
      { id: 'momentos_conexion', tipo: 'textarea', label: '¿En qué momentos sentís que estás donde tenés que estar?', placeholder: 'Cuándo sentís propósito...' }
    ]
  },
  {
    id: 'contratos_alma',
    nombre: 'Contratos del Alma',
    categoria: 'alma',
    runas: 180,
    tiempoMinutos: 75,
    descripcionCorta: 'Los acuerdos que hiciste antes de nacer',
    descripcionLarga: `Antes de nacer, tu alma hizo acuerdos. Este estudio revela los CONTRATOS e incluye la posibilidad de revocar los obsoletos.`,
    requiereGuardian: false,
    campos: [
      { id: 'relacion_familia', tipo: 'textarea', label: 'Describí tu relación con tu familia de origen', placeholder: 'Padres, hermanos, dinámicas...' },
      { id: 'patrones_repetidos', tipo: 'textarea', label: '¿Qué situaciones se repiten aunque no quieras?', placeholder: 'Patrones que no podés romper...' },
      { id: 'bloqueo_principal', tipo: 'textarea', label: '¿Cuál es el bloqueo más grande que no lográs superar?', placeholder: 'Eso que siempre te frena...' }
    ]
  },
  {
    id: 'vidas_pasadas',
    nombre: 'Ecos de Vidas Pasadas',
    categoria: 'alma',
    runas: 300,
    tiempoMinutos: 90,
    descripcionCorta: 'Vidas anteriores que afectan tu presente',
    descripcionLarga: `Tu alma ha vivido antes. Este estudio canaliza 2-3 vidas pasadas relevantes que están afectando lo que vivís AHORA.`,
    requiereGuardian: false,
    campos: [
      { id: 'miedos_inexplicables', tipo: 'textarea', label: '¿Tenés miedos que no tienen explicación en esta vida?', placeholder: 'Fobias, aversiones sin razón...' },
      { id: 'talentos_naturales', tipo: 'textarea', label: '¿Qué te sale naturalmente sin haberlo aprendido?', placeholder: 'Habilidades innatas...' },
      { id: 'epocas_atraccion', tipo: 'textarea', label: '¿Hay épocas históricas que te atraen mucho?', placeholder: 'Períodos, culturas, países...' }
    ]
  },

  // PROTECCIÓN Y LIMPIEZA
  {
    id: 'escudo_protector',
    nombre: 'Tu Escudo Protector',
    categoria: 'proteccion',
    runas: 40,
    tiempoMinutos: 35,
    descripcionCorta: 'Diseño de protección energética a medida',
    descripcionLarga: `No todos necesitan la misma protección. Este estudio diseña un ESCUDO PROTECTOR personalizado para vos.`,
    requiereGuardian: false,
    campos: [
      { id: 'sensibilidad', tipo: 'select', label: '¿Qué tan sensible sos energéticamente?', opciones: ['Muy sensible (siento todo)', 'Bastante sensible', 'Normal', 'Poco sensible', 'No sé'] },
      { id: 'protecciones_actuales', tipo: 'textarea', label: '¿Qué usás actualmente para protegerte?', placeholder: 'Cristales, rituales, oraciones...' },
      { id: 'situacion_puntual', tipo: 'textarea', label: '¿Hay alguna situación puntual que te preocupe?', placeholder: 'Algo específico de lo que protegerte...' }
    ]
  },
  {
    id: 'limpieza_casa',
    nombre: 'Limpieza Energética del Hogar',
    categoria: 'proteccion',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Protocolo completo para limpiar tu espacio',
    descripcionLarga: `Tu casa acumula energía. Este estudio analiza tu hogar y crea un PROTOCOLO DE LIMPIEZA habitación por habitación.`,
    requiereGuardian: false,
    campos: [
      { id: 'tipo_hogar', tipo: 'select', label: '¿Qué tipo de hogar es?', opciones: ['Departamento', 'Casa', 'Habitación alquilada', 'Casa compartida', 'Otro'] },
      { id: 'habitantes', tipo: 'textarea', label: '¿Quiénes viven ahí?', placeholder: 'Personas, mascotas...' },
      { id: 'zonas_densas', tipo: 'textarea', label: '¿Hay zonas que sientas más densas?', placeholder: 'Habitaciones, rincones...' },
      { id: 'historia_lugar', tipo: 'textarea', label: '¿Sabés algo de la historia del lugar?', placeholder: 'Anteriores habitantes, eventos...' }
    ]
  },
  {
    id: 'deteccion_influencias',
    nombre: 'Detección de Influencias Negativas',
    categoria: 'proteccion',
    runas: 55,
    tiempoMinutos: 50,
    descripcionCorta: '¿Hay algo afectándote negativamente?',
    descripcionLarga: `A veces sentimos que algo anda mal pero no sabemos qué. Este estudio investiga si hay alguna influencia negativa y cómo neutralizarla.`,
    requiereGuardian: false,
    campos: [
      { id: 'inicio_sintomas', tipo: 'textarea', label: '¿Cuándo empezó y qué pasaba en tu vida?', placeholder: 'Hace cuánto y contexto...' },
      { id: 'sospechas', tipo: 'textarea', label: '¿Sospechás de alguien o algo?', placeholder: 'Si tenés alguna intuición...' },
      { id: 'cosas_raras', tipo: 'textarea', label: '¿Han pasado cosas raras?', placeholder: 'Eventos extraños, objetos que aparecen...' }
    ]
  },

  // AMOR Y RELACIONES
  {
    id: 'lectura_amor_actual',
    nombre: 'Tu Situación Amorosa Actual',
    categoria: 'amor',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Análisis profundo de tu vida amorosa',
    descripcionLarga: `¿Qué está pasando realmente en tu vida amorosa? Este estudio analiza tu situación amorosa actual: lo que sentís, los obstáculos invisibles y las oportunidades.`,
    requiereGuardian: false,
    campos: [
      { id: 'estado_actual_amor', tipo: 'select', label: '¿Cuál es tu situación actual?', opciones: ['En pareja estable', 'En pareja con problemas', 'Separándome', 'Soltera buscando', 'Soltera sin buscar', 'Situación complicada'] },
      { id: 'tiempo_situacion', tipo: 'select', label: '¿Hace cuánto estás en esta situación?', opciones: ['Menos de un mes', '1-6 meses', '6 meses - 2 años', 'Más de 2 años'] },
      { id: 'que_sientes', tipo: 'textarea', label: '¿Qué sentís respecto al amor en tu vida?', placeholder: 'Tus emociones, frustraciones, esperanzas...' },
      { id: 'pregunta_amor', tipo: 'textarea', label: '¿Qué querés saber específicamente?', placeholder: 'Tu pregunta sobre tu vida amorosa...' }
    ]
  },
  {
    id: 'compatibilidad_pareja',
    nombre: 'Compatibilidad de Pareja',
    categoria: 'amor',
    runas: 55,
    tiempoMinutos: 50,
    descripcionCorta: 'Análisis energético de dos personas',
    descripcionLarga: `¿Son realmente compatibles? Este estudio analiza la compatibilidad real entre vos y otra persona. Dónde fluyen, dónde chocan, qué vienen a enseñarse.`,
    requiereGuardian: false,
    campos: [
      { id: 'tu_fecha', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'fecha_otro', tipo: 'date', label: 'Fecha de nacimiento de la otra persona' },
      { id: 'relacion_actual', tipo: 'select', label: '¿Qué relación tienen actualmente?', opciones: ['Pareja formal', 'Saliendo/conociendo', 'Amistad con tensión', 'Ex que volvió', 'Todavía no hay nada', 'Situación complicada'] },
      { id: 'lo_que_ves', tipo: 'textarea', label: '¿Qué ves en esta relación?', placeholder: 'Tu percepción de la dinámica...' }
    ]
  },
  {
    id: 'sanar_corazon_roto',
    nombre: 'Sanar un Corazón Roto',
    categoria: 'amor',
    runas: 60,
    tiempoMinutos: 55,
    descripcionCorta: 'Proceso de sanación post-ruptura',
    descripcionLarga: `El dolor de un corazón roto es real. Este estudio te acompaña en el proceso de sanación. Entiende tu dolor, valida tu proceso, y te guía.`,
    requiereGuardian: false,
    campos: [
      { id: 'que_paso', tipo: 'textarea', label: '¿Qué pasó?', placeholder: 'La ruptura, la pérdida...' },
      { id: 'tiempo_ruptura', tipo: 'select', label: '¿Hace cuánto pasó?', opciones: ['Menos de una semana', '1-4 semanas', '1-3 meses', '3-6 meses', '6 meses - 1 año', 'Más de un año'] },
      { id: 'como_estas', tipo: 'textarea', label: '¿Cómo te sentís ahora?', placeholder: 'Tu estado emocional actual...' },
      { id: 'que_necesitas', tipo: 'select', label: '¿Qué sentís que necesitás?', opciones: ['Entender qué pasó', 'Soltar y seguir', 'Cerrar el ciclo', 'Recuperar mi autoestima', 'Volver a creer en el amor', 'Todo lo anterior'] }
    ]
  },
  {
    id: 'atraer_amor',
    nombre: 'Ritual para Atraer el Amor',
    categoria: 'amor',
    runas: 50,
    tiempoMinutos: 45,
    descripcionCorta: 'Preparate para recibir el amor',
    descripcionLarga: `No se trata de magia para "atrapar" a alguien. Se trata de preparar TU energía para ser capaz de recibir amor. Un ritual personalizado.`,
    requiereGuardian: false,
    campos: [
      { id: 'historia_amorosa', tipo: 'textarea', label: 'Breve historia de tus relaciones', placeholder: 'Patrones que ves, cómo terminaron...' },
      { id: 'que_buscas', tipo: 'textarea', label: '¿Qué tipo de amor buscás?', placeholder: 'Cómo te gustaría que fuera...' },
      { id: 'disponibilidad', tipo: 'select', label: '¿Qué tan disponible estás?', opciones: ['Totalmente lista', 'Casi lista', 'No estoy segura', 'Todavía sanando'] }
    ]
  },

  // NUMEROLOGÍA
  {
    id: 'perfil_numerologico',
    nombre: 'Tu Perfil Numerológico Completo',
    categoria: 'numerologia',
    runas: 70,
    tiempoMinutos: 55,
    descripcionCorta: 'Todos tus números revelados',
    descripcionLarga: `Tu fecha y tu nombre esconden códigos. Este estudio calcula TODOS tus números importantes: vida, expresión, alma, personalidad.`,
    requiereGuardian: false,
    campos: [
      { id: 'nombre_completo', tipo: 'text', label: 'Tu nombre completo de nacimiento', placeholder: 'Como figura en tu partida' },
      { id: 'fecha_nacimiento_num', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'nombre_actual', tipo: 'text', label: '¿Usás otro nombre? (opcional)', placeholder: 'Si te cambiaste el nombre' }
    ]
  },
  {
    id: 'año_personal_num',
    nombre: 'Tu Año Personal Numerológico',
    categoria: 'numerologia',
    runas: 35,
    tiempoMinutos: 30,
    descripcionCorta: 'Qué energía rige este año',
    descripcionLarga: `Cada año tiene un número personal que influye en todo lo que vivís. Saber en qué año estás te ayuda a fluir.`,
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nac_año', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'como_va_año', tipo: 'textarea', label: '¿Cómo viene siendo tu año?', placeholder: 'Breve resumen...' }
    ]
  },
  {
    id: 'numerologia_nombre',
    nombre: 'Análisis de tu Nombre',
    categoria: 'numerologia',
    runas: 40,
    tiempoMinutos: 35,
    descripcionCorta: 'El poder oculto en tu nombre',
    descripcionLarga: `Tu nombre no es casualidad. Cada letra vibra en una frecuencia específica. Este estudio analiza qué energías activa tu nombre.`,
    requiereGuardian: false,
    campos: [
      { id: 'nombre_analizar', tipo: 'text', label: 'Nombre a analizar', placeholder: 'Tu nombre actual o uno que considerás' },
      { id: 'es_nombre_actual', tipo: 'select', label: '¿Es tu nombre actual?', opciones: ['Es mi nombre actual', 'Es uno que considero usar', 'Es mi nombre artístico'] },
      { id: 'motivo_analisis', tipo: 'textarea', label: '¿Por qué querés analizarlo?', placeholder: 'Tu motivación...' }
    ]
  },

  // INTERPRETACIÓN DE SUEÑOS
  {
    id: 'interpretar_sueno',
    nombre: 'Interpretación de un Sueño',
    categoria: 'suenos',
    runas: 30,
    tiempoMinutos: 25,
    descripcionCorta: 'Descifra el mensaje de tu sueño',
    descripcionLarga: `Los sueños son mensajes del inconsciente. Este estudio interpreta UN sueño específico. Interpretación personalizada para VOS.`,
    requiereGuardian: false,
    campos: [
      { id: 'sueno_detalle', tipo: 'textarea', label: 'Describí tu sueño con detalles', placeholder: 'Personas, lugares, objetos, emociones...' },
      { id: 'cuando_soñaste', tipo: 'select', label: '¿Cuándo lo soñaste?', opciones: ['Anoche', 'Esta semana', 'Este mes', 'Hace tiempo pero no lo olvido'] },
      { id: 'emocion_despertar', tipo: 'select', label: '¿Cómo te sentiste al despertar?', opciones: ['Confundida', 'Asustada', 'Triste', 'Feliz', 'Inquieta', 'En paz', 'Intrigada'] },
      { id: 'situacion_actual', tipo: 'textarea', label: '¿Qué pasa en tu vida actualmente?', placeholder: 'Contexto de tu vida...' }
    ]
  },
  {
    id: 'diario_onirico',
    nombre: 'Análisis de Sueños Recurrentes',
    categoria: 'suenos',
    runas: 55,
    tiempoMinutos: 45,
    descripcionCorta: 'Patrones en tus sueños repetitivos',
    descripcionLarga: `Cuando un sueño se repite, tu alma grita un mensaje. Este estudio analiza PATRONES en tus sueños recurrentes.`,
    requiereGuardian: false,
    campos: [
      { id: 'suenos_recurrentes', tipo: 'textarea', label: 'Describí los sueños que se repiten', placeholder: 'Pueden ser varios con tema similar...' },
      { id: 'desde_cuando', tipo: 'select', label: '¿Desde cuándo los tenés?', opciones: ['Semanas', 'Meses', 'Años', 'Toda mi vida'] },
      { id: 'variaciones', tipo: 'textarea', label: '¿Hay variaciones entre uno y otro?', placeholder: 'Qué cambia y qué se mantiene...' }
    ]
  },
  {
    id: 'suenos_profeticos',
    nombre: '¿Tus Sueños son Proféticos?',
    categoria: 'suenos',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Descubrí si tenés precognición',
    descripcionLarga: `Algunas personas sueñan cosas que después pasan. Este estudio evalúa si tenés el don de los sueños proféticos.`,
    requiereGuardian: false,
    campos: [
      { id: 'ejemplos_profeticos', tipo: 'textarea', label: '¿Ejemplos de sueños que después pasaron?', placeholder: 'Casos específicos...' },
      { id: 'frecuencia', tipo: 'select', label: '¿Con qué frecuencia te pasa?', opciones: ['Muy seguido', 'A veces', 'Pocas veces pero claras', 'Creo que me pasó pero no estoy segura'] },
      { id: 'como_te_sientes', tipo: 'textarea', label: '¿Cómo te sentís con este don?', placeholder: 'Tu relación con esta habilidad...' }
    ]
  },

  // ABUNDANCIA Y PROSPERIDAD
  {
    id: 'bloqueos_abundancia',
    nombre: 'Bloqueos de Abundancia',
    categoria: 'abundancia',
    runas: 55,
    tiempoMinutos: 50,
    descripcionCorta: 'Por qué el dinero no fluye',
    descripcionLarga: `El dinero es energía. Si no fluye hacia vos, hay algo bloqueándolo. Este estudio detecta tus BLOQUEOS reales.`,
    requiereGuardian: false,
    campos: [
      { id: 'relacion_dinero', tipo: 'textarea', label: 'Describí tu relación con el dinero', placeholder: 'Cómo te sentís con el dinero...' },
      { id: 'patron_familiar', tipo: 'textarea', label: '¿Cómo era en tu familia?', placeholder: 'Tus padres, lo que decían del dinero...' },
      { id: 'frases_dinero', tipo: 'textarea', label: '¿Qué frases escuchaste de chica?', placeholder: '"El dinero no crece en los árboles"...' },
      { id: 'situacion_actual_dinero', tipo: 'textarea', label: '¿Tu situación financiera actual?', placeholder: 'Breve descripción...' }
    ]
  },
  {
    id: 'ritual_abundancia',
    nombre: 'Ritual de Activación de Abundancia',
    categoria: 'abundancia',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Abrí las puertas a la prosperidad',
    descripcionLarga: `La abundancia existe. Este estudio crea un RITUAL DE ABUNDANCIA completamente personalizado para tu energía específica.`,
    requiereGuardian: false,
    campos: [
      { id: 'que_necesitas', tipo: 'textarea', label: '¿Qué tipo de abundancia necesitás?', placeholder: 'Dinero, oportunidades, clientes...' },
      { id: 'cuanto_necesitas', tipo: 'select', label: '¿Qué tan urgente es?', opciones: ['Muy urgente (supervivencia)', 'Importante (mejorar)', 'Sería lindo (extra)', 'Para el futuro'] },
      { id: 'acciones_tomadas', tipo: 'textarea', label: '¿Qué acciones estás tomando?', placeholder: 'Trabajo, emprendimiento...' }
    ]
  },
  {
    id: 'lectura_prosperidad',
    nombre: 'Tu Camino de Prosperidad',
    categoria: 'abundancia',
    runas: 65,
    tiempoMinutos: 55,
    descripcionCorta: 'Tu mapa hacia la abundancia',
    descripcionLarga: `¿Cuál es TU camino hacia la prosperidad? Este estudio revela tu ruta natural de prosperidad y qué dones monetizables tenés.`,
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nac_prosp', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'habilidades', tipo: 'textarea', label: '¿Qué se te da bien?', placeholder: 'Tus talentos naturales...' },
      { id: 'que_disfruta', tipo: 'textarea', label: '¿Qué disfrutás hacer?', placeholder: 'Lo que harías gratis pero podrías cobrar...' },
      { id: 'intentos_pasados', tipo: 'textarea', label: '¿Qué has intentado?', placeholder: 'Trabajos, emprendimientos...' }
    ]
  },

  // REGISTROS AKÁSHICOS
  {
    id: 'lectura_akashicos',
    nombre: 'Lectura de Registros Akáshicos',
    categoria: 'akashicos',
    runas: 250,
    tiempoMinutos: 90,
    descripcionCorta: 'Accede a la biblioteca de tu alma',
    descripcionLarga: `Los Registros Akáshicos son la biblioteca del universo. Esta lectura abre TUS registros y extrae información específica para tu momento actual.`,
    requiereGuardian: false,
    campos: [
      { id: 'nombre_completo_ak', tipo: 'text', label: 'Tu nombre completo de nacimiento', placeholder: 'Como aparece en tu partida' },
      { id: 'preguntas_akashicos', tipo: 'textarea', label: '¿Qué preguntas querés hacer?', placeholder: 'Hasta 3 preguntas importantes...' },
      { id: 'area_vida', tipo: 'select', label: '¿Qué área necesita claridad?', opciones: ['Propósito de vida', 'Relaciones', 'Trabajo/vocación', 'Sanación personal', 'Espiritualidad', 'Patrones repetitivos', 'Todo/general'] },
      { id: 'experiencia_previa', tipo: 'select', label: '¿Has consultado antes?', opciones: ['Nunca', 'Una vez', 'Varias veces', 'Regularmente'] }
    ]
  },
  {
    id: 'origen_alma',
    nombre: 'Tu Origen de Alma',
    categoria: 'akashicos',
    runas: 180,
    tiempoMinutos: 75,
    descripcionCorta: '¿De dónde viene tu alma?',
    descripcionLarga: `Tu alma no empezó en la Tierra. Viene de algún lugar del cosmos. Este estudio revela tu origen estelar y tu familia cósmica.`,
    requiereGuardian: false,
    campos: [
      { id: 'sensacion_no_pertenecer', tipo: 'select', label: '¿Te sentís diferente a los demás?', opciones: ['Siempre me sentí diferente', 'A veces', 'No especialmente', 'Me siento muy humana'] },
      { id: 'atraccion_estrellas', tipo: 'textarea', label: '¿Hay estrellas que te atraigan?', placeholder: 'Lo que te llama del cosmos...' },
      { id: 'dones_especiales', tipo: 'textarea', label: '¿Qué dones especiales tenés?', placeholder: 'Intuición, sanación...' },
      { id: 'mision_percibida', tipo: 'textarea', label: '¿Sentís que viniste a hacer algo?', placeholder: 'Tu intuición sobre tu misión...' }
    ]
  },
  {
    id: 'limpieza_akashica',
    nombre: 'Limpieza de Registros Akáshicos',
    categoria: 'akashicos',
    runas: 150,
    tiempoMinutos: 65,
    descripcionCorta: 'Libera karmas y contratos obsoletos',
    descripcionLarga: `Tus Registros pueden tener "archivos corruptos". Esta limpieza BORRA lo que te frena: karmas, votos, contratos vencidos.`,
    requiereGuardian: false,
    campos: [
      { id: 'cargas_sentidas', tipo: 'textarea', label: '¿Qué cargas sentís que no son de esta vida?', placeholder: 'Miedos, limitaciones...' },
      { id: 'patrones_ancestrales', tipo: 'textarea', label: '¿Qué patrones familiares se repiten?', placeholder: 'Lo que se repite en tu linaje...' },
      { id: 'que_liberar', tipo: 'textarea', label: '¿Qué te gustaría liberar?', placeholder: 'Lo que sentís que necesitás soltar...' }
    ]
  },

  // SANACIÓN INTERIOR
  {
    id: 'nino_interior',
    nombre: 'Sanación del Niño Interior',
    categoria: 'sanacion',
    runas: 80,
    tiempoMinutos: 60,
    descripcionCorta: 'Conectá y saná a tu niña interior',
    descripcionLarga: `Dentro de vos vive la niña que fuiste. Este trabajo te conecta con tu niño interior para escucharla, sanarla y reintegrarla.`,
    requiereGuardian: false,
    campos: [
      { id: 'infancia_breve', tipo: 'textarea', label: 'Describí brevemente tu infancia', placeholder: 'Cómo fue, ambiente familiar...' },
      { id: 'relacion_padres', tipo: 'textarea', label: '¿Cómo era la relación con tus padres?', placeholder: 'Lo más significativo...' },
      { id: 'que_necesitaba', tipo: 'textarea', label: '¿Qué necesitabas de niña que no recibiste?', placeholder: 'Lo que te faltó...' }
    ]
  },
  {
    id: 'sombra_personal',
    nombre: 'Trabajo con tu Sombra',
    categoria: 'sanacion',
    runas: 90,
    tiempoMinutos: 70,
    descripcionCorta: 'Integra lo que rechazás de vos',
    descripcionLarga: `Tu sombra es todo lo que rechazás de vos misma. Este trabajo te ayuda a VER tu sombra, entenderla e integrarla.`,
    requiereGuardian: false,
    campos: [
      { id: 'que_rechazas', tipo: 'textarea', label: '¿Qué características detestás en otros?', placeholder: 'Lo que no soportás...' },
      { id: 'que_escondes', tipo: 'textarea', label: '¿Qué partes de vos escondés?', placeholder: 'Lo que no mostrás...' },
      { id: 'patron_conflictos', tipo: 'textarea', label: '¿Qué conflictos se repiten en tu vida?', placeholder: 'Peleas, problemas recurrentes...' },
      { id: 'miedo_profundo', tipo: 'textarea', label: '¿Cuál es tu miedo más profundo?', placeholder: 'Lo que más te aterra...' }
    ]
  },
  {
    id: 'sanacion_linaje',
    nombre: 'Sanación del Linaje',
    categoria: 'sanacion',
    runas: 100,
    tiempoMinutos: 75,
    descripcionCorta: 'Sana las heridas heredadas',
    descripcionLarga: `Cargás heridas que no son tuyas. Este trabajo sana las heridas de tu linaje femenino O masculino. Corta cadenas generacionales.`,
    requiereGuardian: false,
    campos: [
      { id: 'linaje_elegido', tipo: 'select', label: '¿Qué linaje querés sanar?', opciones: ['Linaje materno', 'Linaje paterno', 'Ambos (más extenso)'] },
      { id: 'historia_linaje', tipo: 'textarea', label: '¿Qué sabés de ese linaje?', placeholder: 'Sus historias, sus luchas...' },
      { id: 'patrones_heredados', tipo: 'textarea', label: '¿Qué patrones se repiten?', placeholder: 'Enfermedades, relaciones, traumas...' },
      { id: 'relacion_linaje', tipo: 'textarea', label: '¿Cómo es tu relación con ese linaje?', placeholder: 'Cómo te sentís con ellos...' }
    ]
  },
  {
    id: 'perdon_profundo',
    nombre: 'Proceso de Perdón Profundo',
    categoria: 'sanacion',
    runas: 70,
    tiempoMinutos: 55,
    descripcionCorta: 'Liberá el peso del resentimiento',
    descripcionLarga: `Perdonar no es olvidar. Es liberarte. Este proceso te guía en un PERDÓN REAL que sana de verdad porque entiende de verdad.`,
    requiereGuardian: false,
    campos: [
      { id: 'a_quien_perdonar', tipo: 'textarea', label: '¿A quién necesitás perdonar?', placeholder: 'Otra persona o vos misma...' },
      { id: 'que_paso', tipo: 'textarea', label: '¿Qué pasó?', placeholder: 'Lo que te hicieron o hiciste...' },
      { id: 'intentos_perdon', tipo: 'select', label: '¿Has intentado perdonar antes?', opciones: ['Nunca', 'Muchas veces sin éxito', 'Creí que había perdonado pero no', 'No quiero perdonar'] },
      { id: 'que_sientes', tipo: 'textarea', label: '¿Qué sentís hacia esa persona ahora?', placeholder: 'Tus emociones actuales...' }
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────

export function ExperienciasMagicas({ usuario, token, setUsuario }) {
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [experienciaSeleccionada, setExperienciaSeleccionada] = useState(null);
  const [formulario, setFormulario] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [misExperiencias, setMisExperiencias] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [vistaActiva, setVistaActiva] = useState('catalogo');

  useEffect(() => {
    if (token) cargarHistorial();
  }, [token]);

  const cargarHistorial = async () => {
    try {
      setCargandoHistorial(true);
      const res = await fetch(`${API_BASE}/api/experiencias/historial?token=${token}`);
      const data = await res.json();
      if (data.success) setMisExperiencias(data.experiencias || []);
    } catch (err) {
      console.error('Error cargando historial:', err);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleCampoChange = (campoId, valor) => {
    setFormulario(prev => ({ ...prev, [campoId]: valor }));
  };

  const solicitarExperiencia = async () => {
    if (!experienciaSeleccionada) return;

    if ((usuario?.runas || 0) < experienciaSeleccionada.runas) {
      setResultado({
        success: false,
        mensaje: `Necesitás ${experienciaSeleccionada.runas} runas y tenés ${usuario?.runas || 0}.`
      });
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/api/experiencias/solicitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          experienciaId: experienciaSeleccionada.id,
          datos: formulario
        })
      });

      const data = await res.json();
      setResultado(data);

      if (data.success) {
        if (setUsuario && data.solicitud) {
          setUsuario(prev => ({ ...prev, runas: data.solicitud.runasRestantes }));
        }
        cargarHistorial();
      }
    } catch (err) {
      setResultado({ success: false, mensaje: 'Error al procesar la solicitud' });
    } finally {
      setEnviando(false);
    }
  };

  const volverACatalogo = () => {
    setExperienciaSeleccionada(null);
    setCategoriaActiva(null);
    setFormulario({});
    setResultado(null);
  };

  // ═══════════════════════════════════════════════════════════════
  // ESTILOS INLINE PREMIUM
  // ═══════════════════════════════════════════════════════════════

  const styles = {
    container: {
      minHeight: '100%',
      background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
      padding: '0',
      fontFamily: "'Inter', -apple-system, sans-serif"
    },
    header: {
      textAlign: 'center',
      padding: '50px 20px 30px',
      position: 'relative',
      background: 'radial-gradient(ellipse at center top, rgba(212,175,55,0.08) 0%, transparent 60%)'
    },
    title: {
      fontFamily: "'Cinzel', 'Times New Roman', serif",
      fontSize: '2.5rem',
      color: '#d4af37',
      margin: '0 0 12px',
      letterSpacing: '3px',
      textShadow: '0 0 40px rgba(212,175,55,0.3)',
      fontWeight: '400'
    },
    subtitle: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '1rem',
      margin: '0 0 30px',
      fontWeight: '300',
      letterSpacing: '1px'
    },
    toggleContainer: {
      display: 'inline-flex',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '50px',
      padding: '5px',
      border: '1px solid rgba(255,255,255,0.08)'
    },
    toggleBtn: (active) => ({
      padding: '12px 28px',
      background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.1) 100%)' : 'transparent',
      border: 'none',
      color: active ? '#d4af37' : 'rgba(255,255,255,0.4)',
      fontSize: '0.95rem',
      cursor: 'pointer',
      borderRadius: '45px',
      transition: 'all 0.3s ease',
      fontWeight: active ? '500' : '400',
      letterSpacing: '0.5px'
    }),
    categorias: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      padding: '0 20px 40px',
      justifyContent: 'center'
    },
    catBtn: (active, color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      background: active
        ? `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`
        : 'rgba(255,255,255,0.02)',
      border: `1px solid ${active ? color : 'rgba(255,255,255,0.06)'}`,
      color: active ? color : 'rgba(255,255,255,0.5)',
      fontSize: '0.9rem',
      borderRadius: '30px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: active ? '500' : '400'
    }),
    catSymbol: {
      fontSize: '1.1rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      padding: '0 24px 60px'
    },
    card: (color, locked) => ({
      position: 'relative',
      background: 'linear-gradient(165deg, rgba(25,25,35,0.95) 0%, rgba(15,15,22,0.98) 100%)',
      borderRadius: '20px',
      padding: '28px',
      cursor: locked ? 'not-allowed' : 'pointer',
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: locked ? 0.5 : 1,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }),
    cardGlow: (color) => ({
      position: 'absolute',
      top: '-30%',
      right: '-30%',
      width: '200px',
      height: '200px',
      background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
      pointerEvents: 'none',
      transition: 'opacity 0.4s ease'
    }),
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '18px',
      position: 'relative',
      zIndex: 1
    },
    cardSymbol: (color) => ({
      fontSize: '2.2rem',
      color: color,
      filter: `drop-shadow(0 0 10px ${color}40)`,
      lineHeight: 1
    }),
    cardPrice: (canAfford) => ({
      fontFamily: "'Cinzel', serif",
      fontSize: '1rem',
      padding: '6px 14px',
      borderRadius: '20px',
      background: 'rgba(0,0,0,0.4)',
      color: canAfford ? '#d4af37' : 'rgba(255,100,100,0.8)',
      border: `1px solid ${canAfford ? 'rgba(212,175,55,0.3)' : 'rgba(255,100,100,0.3)'}`,
      fontWeight: '500'
    }),
    cardTitle: {
      fontFamily: "'Cinzel', serif",
      color: '#fff',
      fontSize: '1.2rem',
      margin: '0 0 10px',
      letterSpacing: '0.5px',
      fontWeight: '500',
      position: 'relative',
      zIndex: 1
    },
    cardDesc: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '0.92rem',
      lineHeight: '1.6',
      margin: '0 0 18px',
      position: 'relative',
      zIndex: 1
    },
    cardFooter: {
      display: 'flex',
      gap: '16px',
      fontSize: '0.85rem',
      color: 'rgba(255,255,255,0.35)',
      position: 'relative',
      zIndex: 1
    },
    reqGuardian: (color) => ({
      color: color,
      fontSize: '0.8rem'
    }),
    // Detalle experiencia
    backBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: 'none',
      border: 'none',
      color: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      padding: '20px 24px',
      fontSize: '1rem',
      transition: 'color 0.2s'
    },
    detalleContainer: {
      maxWidth: '700px',
      margin: '0 auto',
      padding: '0 24px 60px'
    },
    detalleHeader: (color) => ({
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
      marginBottom: '35px',
      paddingBottom: '30px',
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    }),
    symbolLarge: (color) => ({
      width: '90px',
      height: '90px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)`,
      borderRadius: '24px',
      border: `1px solid ${color}30`,
      fontSize: '3rem',
      color: color,
      filter: `drop-shadow(0 0 20px ${color}30)`
    }),
    categoriaLabel: (color) => ({
      fontSize: '0.85rem',
      color: color,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '6px'
    }),
    detalleTitle: {
      fontFamily: "'Cinzel', serif",
      color: '#fff',
      fontSize: '1.9rem',
      margin: '0',
      fontWeight: '400',
      letterSpacing: '1px'
    },
    descripcionLarga: {
      color: 'rgba(255,255,255,0.65)',
      lineHeight: '1.8',
      marginBottom: '35px',
      fontSize: '1.05rem'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '30px',
      border: '1px solid rgba(255,255,255,0.04)'
    },
    stat: {
      textAlign: 'center'
    },
    statLabel: {
      display: 'block',
      fontSize: '0.8rem',
      color: 'rgba(255,255,255,0.35)',
      marginBottom: '6px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    statValue: (gold) => ({
      display: 'block',
      fontSize: '1.5rem',
      color: gold ? '#d4af37' : '#fff',
      fontWeight: '500',
      fontFamily: "'Cinzel', serif"
    }),
    alertaGuardian: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: 'rgba(147,112,219,0.08)',
      border: '1px solid rgba(147,112,219,0.25)',
      padding: '18px 22px',
      borderRadius: '14px',
      color: 'rgba(255,255,255,0.8)',
      marginBottom: '30px',
      fontSize: '0.95rem'
    },
    form: {
      background: 'rgba(255,255,255,0.015)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '20px',
      padding: '35px'
    },
    formTitle: {
      fontFamily: "'Cinzel', serif",
      color: '#d4af37',
      fontSize: '1.15rem',
      margin: '0 0 30px',
      letterSpacing: '1px',
      fontWeight: '400'
    },
    campo: {
      marginBottom: '26px'
    },
    label: {
      display: 'block',
      color: 'rgba(255,255,255,0.8)',
      marginBottom: '10px',
      fontSize: '0.95rem',
      fontWeight: '400'
    },
    input: {
      width: '100%',
      padding: '16px 18px',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#fff',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '16px 18px',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#fff',
      borderRadius: '12px',
      fontSize: '1rem',
      resize: 'vertical',
      minHeight: '100px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '16px 18px',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#fff',
      borderRadius: '12px',
      fontSize: '1rem',
      cursor: 'pointer',
      outline: 'none',
      boxSizing: 'border-box'
    },
    errorMsg: {
      background: 'rgba(255,100,100,0.08)',
      border: '1px solid rgba(255,100,100,0.25)',
      padding: '16px',
      borderRadius: '12px',
      color: '#ff6b6b',
      marginBottom: '24px',
      fontSize: '0.95rem'
    },
    submitBtn: (disabled) => ({
      width: '100%',
      padding: '18px',
      background: disabled
        ? 'rgba(100,100,100,0.3)'
        : 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
      border: 'none',
      color: disabled ? 'rgba(255,255,255,0.4)' : '#000',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '14px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      letterSpacing: '0.5px',
      boxShadow: disabled ? 'none' : '0 4px 20px rgba(212,175,55,0.25)'
    }),
    // Resultado exitoso
    exitoContainer: {
      textAlign: 'center',
      maxWidth: '500px',
      margin: '80px auto',
      padding: '0 24px'
    },
    exitoIcon: {
      width: '120px',
      height: '120px',
      margin: '0 auto 35px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: 'pulse 2s ease-in-out infinite'
    },
    exitoSymbol: {
      fontSize: '3.5rem',
      color: '#d4af37',
      filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.5))'
    },
    exitoTitle: {
      fontFamily: "'Cinzel', serif",
      color: '#d4af37',
      fontSize: '2rem',
      margin: '0 0 18px',
      letterSpacing: '2px',
      fontWeight: '400'
    },
    exitoMsg: {
      color: 'rgba(255,255,255,0.65)',
      fontSize: '1.05rem',
      lineHeight: '1.7',
      marginBottom: '35px'
    },
    infoEntrega: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap'
    },
    infoBox: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '22px 32px',
      borderRadius: '14px'
    },
    infoLabel: {
      display: 'block',
      fontSize: '0.8rem',
      color: 'rgba(255,255,255,0.4)',
      marginBottom: '6px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    infoValue: (gold) => ({
      display: 'block',
      fontSize: '1.5rem',
      color: gold ? '#d4af37' : '#fff',
      fontFamily: "'Cinzel', serif"
    }),
    acciones: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    btnPrimary: {
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
      border: 'none',
      color: '#000',
      fontWeight: '600',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '1rem'
    },
    btnSecondary: {
      padding: '16px 32px',
      background: 'transparent',
      border: '1px solid rgba(212,175,55,0.4)',
      color: '#d4af37',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '1rem'
    },
    // Historial
    historial: {
      padding: '0 24px 60px',
      maxWidth: '700px',
      margin: '0 auto'
    },
    loadingState: {
      textAlign: 'center',
      padding: '80px 20px'
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '2px solid rgba(255,255,255,0.1)',
      borderTopColor: '#d4af37',
      borderRadius: '50%',
      margin: '0 auto 24px',
      animation: 'spin 1s linear infinite'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px'
    },
    emptyIcon: {
      fontSize: '4rem',
      color: 'rgba(255,255,255,0.15)',
      marginBottom: '24px'
    },
    emptyText: {
      color: 'rgba(255,255,255,0.4)',
      marginBottom: '30px',
      fontSize: '1.05rem'
    },
    historialList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    },
    historialItem: (estado) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      padding: '20px 24px',
      borderRadius: '14px',
      transition: 'all 0.2s'
    }),
    histSymbol: {
      fontSize: '2rem',
      color: '#d4af37',
      opacity: 0.7
    },
    histInfo: {
      flex: 1
    },
    histTitle: {
      color: '#fff',
      fontSize: '1.05rem',
      margin: '0 0 5px',
      fontWeight: '500'
    },
    histDate: {
      fontSize: '0.85rem',
      color: 'rgba(255,255,255,0.4)'
    },
    status: (estado) => {
      const colors = {
        pendiente: { bg: 'rgba(255,152,0,0.12)', text: '#ff9800' },
        procesando: { bg: 'rgba(33,150,243,0.12)', text: '#2196F3' },
        listo: { bg: 'rgba(76,175,80,0.12)', text: '#4CAF50' },
        completado: { bg: 'rgba(147,112,219,0.12)', text: '#9370DB' }
      };
      const c = colors[estado] || colors.pendiente;
      return {
        fontSize: '0.8rem',
        padding: '8px 16px',
        borderRadius: '20px',
        background: c.bg,
        color: c.text,
        fontWeight: '500'
      };
    }
  };

  // CSS Keyframes (agregado como style tag)
  const keyframes = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.05); opacity: 0.6; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  // Resultado exitoso
  if (resultado?.success) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.exitoContainer}>
          <div style={styles.exitoIcon}>
            <span style={styles.exitoSymbol}>✧</span>
          </div>
          <h2 style={styles.exitoTitle}>Solicitud Recibida</h2>
          <p style={styles.exitoMsg}>{resultado.mensaje}</p>
          <div style={styles.infoEntrega}>
            <div style={styles.infoBox}>
              <span style={styles.infoLabel}>Tiempo estimado</span>
              <span style={styles.infoValue(false)}>{experienciaSeleccionada?.tiempoMinutos || '?'} min</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.infoLabel}>Runas restantes</span>
              <span style={styles.infoValue(true)}>ᚱ {resultado.solicitud?.runasRestantes}</span>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '35px' }}>Te notificaremos cuando esté lista.</p>
          <div style={styles.acciones}>
            <button style={styles.btnPrimary} onClick={volverACatalogo}>Explorar más</button>
            <button style={styles.btnSecondary} onClick={() => { volverACatalogo(); setVistaActiva('historial'); }}>Ver mis experiencias</button>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de experiencia
  if (experienciaSeleccionada) {
    const cat = CATEGORIAS[experienciaSeleccionada.categoria];
    const tieneAcceso = !experienciaSeleccionada.requiereGuardian || (usuario?.guardianes && usuario.guardianes.length > 0);

    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <button style={styles.backBtn} onClick={volverACatalogo}>
          <span style={{ fontSize: '1.3rem' }}>←</span> Volver
        </button>

        <div style={styles.detalleContainer}>
          <div style={styles.detalleHeader(cat?.color)}>
            <div style={styles.symbolLarge(cat?.color)}>
              {cat?.simbolo}
            </div>
            <div>
              <div style={styles.categoriaLabel(cat?.color)}>{cat?.nombre}</div>
              <h1 style={styles.detalleTitle}>{experienciaSeleccionada.nombre}</h1>
            </div>
          </div>

          <p style={styles.descripcionLarga}>{experienciaSeleccionada.descripcionLarga}</p>

          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Costo</span>
              <span style={styles.statValue(true)}>ᚱ {experienciaSeleccionada.runas}</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Tiempo</span>
              <span style={styles.statValue(false)}>{experienciaSeleccionada.tiempoMinutos} min</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Tus runas</span>
              <span style={styles.statValue(false)}>{usuario?.runas || 0}</span>
            </div>
          </div>

          {experienciaSeleccionada.requiereGuardian && !tieneAcceso && (
            <div style={styles.alertaGuardian}>
              <span style={{ fontSize: '1.8rem', color: '#9370DB' }}>⬡</span>
              <span>Esta experiencia requiere que tengas un guardián adoptado.</span>
            </div>
          )}

          <div style={styles.form}>
            <h3 style={styles.formTitle}>Personalizá tu experiencia</h3>

            {experienciaSeleccionada.campos.map(campo => (
              <div key={campo.id} style={styles.campo}>
                <label style={styles.label}>{campo.label}</label>

                {campo.tipo === 'text' && (
                  <input
                    type="text"
                    style={styles.input}
                    value={formulario[campo.id] || ''}
                    onChange={e => handleCampoChange(campo.id, e.target.value)}
                    placeholder={campo.placeholder}
                  />
                )}

                {campo.tipo === 'date' && (
                  <input
                    type="date"
                    style={styles.input}
                    value={formulario[campo.id] || ''}
                    onChange={e => handleCampoChange(campo.id, e.target.value)}
                  />
                )}

                {campo.tipo === 'textarea' && (
                  <textarea
                    style={styles.textarea}
                    value={formulario[campo.id] || ''}
                    onChange={e => handleCampoChange(campo.id, e.target.value)}
                    placeholder={campo.placeholder}
                    rows={3}
                  />
                )}

                {campo.tipo === 'select' && (
                  <select
                    style={styles.select}
                    value={formulario[campo.id] || ''}
                    onChange={e => handleCampoChange(campo.id, e.target.value)}
                  >
                    <option value="">Seleccioná una opción</option>
                    {campo.opciones.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {resultado && !resultado.success && (
              <div style={styles.errorMsg}>{resultado.mensaje}</div>
            )}

            <button
              style={styles.submitBtn(enviando || !tieneAcceso)}
              onClick={solicitarExperiencia}
              disabled={enviando || !tieneAcceso}
            >
              {enviando ? 'Procesando...' : <>Solicitar por <span style={{ color: 'inherit' }}>ᚱ {experienciaSeleccionada.runas}</span></>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal
  return (
    <div style={styles.container}>
      <style>{keyframes}</style>

      <div style={styles.header}>
        <h1 style={styles.title}>Experiencias Mágicas</h1>
        <p style={styles.subtitle}>Estudios personalizados, mensajes canalizados, guías para tu camino</p>

        <div style={styles.toggleContainer}>
          <button
            style={styles.toggleBtn(vistaActiva === 'catalogo')}
            onClick={() => setVistaActiva('catalogo')}
          >
            Catálogo
          </button>
          <button
            style={styles.toggleBtn(vistaActiva === 'historial')}
            onClick={() => setVistaActiva('historial')}
          >
            Mis Experiencias {misExperiencias.length > 0 && <span style={{
              background: '#d4af37',
              color: '#000',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              marginLeft: '8px',
              fontWeight: '600'
            }}>{misExperiencias.length}</span>}
          </button>
        </div>
      </div>

      {vistaActiva === 'historial' ? (
        <div style={styles.historial}>
          {cargandoHistorial ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner}></div>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Cargando...</p>
            </div>
          ) : misExperiencias.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>◇</div>
              <p style={styles.emptyText}>Aún no tenés experiencias solicitadas</p>
              <button style={styles.btnPrimary} onClick={() => setVistaActiva('catalogo')}>Explorar catálogo</button>
            </div>
          ) : (
            <div style={styles.historialList}>
              {misExperiencias.map(exp => (
                <div key={exp.id} style={styles.historialItem(exp.estado)}>
                  <div style={styles.histSymbol}>{CATEGORIAS[exp.categoria]?.simbolo || '◈'}</div>
                  <div style={styles.histInfo}>
                    <h4 style={styles.histTitle}>{exp.nombre}</h4>
                    <span style={styles.histDate}>{new Date(exp.fecha).toLocaleDateString('es-UY')}</span>
                  </div>
                  <div style={styles.status(exp.estado)}>
                    {exp.estado === 'pendiente' && 'En preparación'}
                    {exp.estado === 'procesando' && 'Generando'}
                    {exp.estado === 'listo' && 'Lista'}
                    {exp.estado === 'completado' && 'Completada'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={styles.categorias}>
            <button
              style={styles.catBtn(categoriaActiva === null, '#d4af37')}
              onClick={() => setCategoriaActiva(null)}
            >
              <span style={styles.catSymbol}>◎</span>
              <span>Todas</span>
            </button>
            {Object.values(CATEGORIAS).map(cat => (
              <button
                key={cat.id}
                style={styles.catBtn(categoriaActiva === cat.id, cat.color)}
                onClick={() => setCategoriaActiva(cat.id)}
              >
                <span style={styles.catSymbol}>{cat.simbolo}</span>
                <span>{cat.nombre}</span>
              </button>
            ))}
          </div>

          <div style={styles.grid}>
            {EXPERIENCIAS
              .filter(exp => !categoriaActiva || exp.categoria === categoriaActiva)
              .map(exp => {
                const cat = CATEGORIAS[exp.categoria];
                const tieneAcceso = !exp.requiereGuardian || (usuario?.guardianes && usuario.guardianes.length > 0);
                const tieneRunas = (usuario?.runas || 0) >= exp.runas;

                return (
                  <div
                    key={exp.id}
                    style={styles.card(cat?.color, !tieneAcceso)}
                    onClick={() => tieneAcceso && setExperienciaSeleccionada(exp)}
                    onMouseEnter={e => {
                      if (tieneAcceso) {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.borderColor = `${cat?.color}50`;
                        e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 40px ${cat?.color}15`;
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                    }}
                  >
                    <div style={styles.cardGlow(cat?.color)}></div>
                    <div style={styles.cardHeader}>
                      <span style={styles.cardSymbol(cat?.color)}>{cat?.simbolo}</span>
                      <span style={styles.cardPrice(tieneRunas)}>ᚱ {exp.runas}</span>
                    </div>
                    <h3 style={styles.cardTitle}>{exp.nombre}</h3>
                    <p style={styles.cardDesc}>{exp.descripcionCorta}</p>
                    <div style={styles.cardFooter}>
                      <span>{exp.tiempoMinutos} min</span>
                      {exp.requiereGuardian && <span style={styles.reqGuardian(cat?.color)}>Requiere guardián</span>}
                    </div>
                    {!tieneAcceso && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.95rem',
                        borderRadius: '20px',
                        backdropFilter: 'blur(3px)'
                      }}>
                        Necesitás un guardián
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

export default ExperienciasMagicas;

# PLAN API EXPERTO - Sistema de Generación de Conversiones

**Objetivo:** Transformar el API de "generar historias" a "generar conversiones"

---

## ARQUITECTURA NUEVA

```
/api/admin/historias/route.js  →  REESCRIBIR COMPLETO

Entrada:
{
  guardian: { nombre, especie, cm, categoria, accesorios },
  contexto: { temporada, fase_lunar, dia_semana, hora },
  perfil_objetivo: "vulnerable" | "esceptico" | "impulsivo" | null
}

Salida:
{
  historia: "...",
  hooks_alternativos: ["...", "...", "..."],
  cierres_por_perfil: {
    vulnerable: "...",
    esceptico: "...",
    impulsivo: "..."
  },
  score_conversion: {
    identificacion: 8,
    dolor: 7,
    solucion: 9,
    urgencia: 6,
    confianza: 8,
    total: 38
  },
  advertencias: []
}
```

---

## COMPONENTES A IMPLEMENTAR

### 1. BIBLIOTECA DE HOOKS (lib/hooks-conversion.js)

```javascript
export const hooks = {
  proteccion: [
    "Hay personas que cargan con todo y no piden nada.",
    "¿Cuántas veces dijiste que sí cuando querías decir que no?",
    "Algunas personas absorben todo lo que las rodea sin darse cuenta.",
    "Existe una diferencia entre estar sola y sentirse sola.",
    "Los que más dan son los que menos piden."
  ],
  abundancia: [
    "El dinero no es malo. Lo que te enseñaron sobre él, sí.",
    "¿Cuántas veces dejaste pasar oportunidades por no sentirte lista?",
    "Hay personas que trabajan el doble y ganan la mitad.",
    "Merecer no se negocia. Se decide.",
    "El bloqueo no está en el mundo. Está en lo que creés sobre vos."
  ],
  amor: [
    "Amás a todos menos a vos.",
    "¿Cuándo fue la última vez que alguien te preguntó cómo estás de verdad?",
    "Hay personas que buscan afuera lo que nunca se dieron adentro.",
    "El amor propio no es egoísmo. Es supervivencia.",
    "Dar sin recibir no es generosidad. Es costumbre."
  ],
  sanacion: [
    "Hay heridas que no sangran pero duelen todos los días.",
    "Soltar no es olvidar. Es dejar de cargar.",
    "El cuerpo guarda lo que la mente no procesa.",
    "Sanar no es volver a ser quien eras. Es convertirte en quien podés ser.",
    "No todo lo que duele tiene nombre. Pero existe."
  ],
  sabiduria: [
    "Sabés más de lo que te permiten recordar.",
    "La intuición habla. El ruido no te deja escucharla.",
    "¿Cuántas veces supiste algo y no le hiciste caso?",
    "La claridad no se busca. Se permite.",
    "Tu mente duda. Tu cuerpo sabe."
  ]
};

export const getRandomHook = (categoria) => {
  const lista = hooks[categoria.toLowerCase()] || hooks.proteccion;
  return lista[Math.floor(Math.random() * lista.length)];
};

export const getAllHooks = (categoria) => {
  return hooks[categoria.toLowerCase()] || hooks.proteccion;
};
```

---

### 2. BIBLIOTECA DE SINCRODESTINOS REALES (lib/sincrodestinos.js)

```javascript
export const sincrodestinos = [
  {
    texto: "Mientras la modelaba, el reloj del taller se detuvo. Cuando terminé, volvió a funcionar solo.",
    tipo: "tiempo",
    impacto: "alto"
  },
  {
    texto: "Sonó una canción que no escuchaba hace años, justo cuando elegía su cristal. Era la canción favorita de mi abuela.",
    tipo: "musica",
    impacto: "alto"
  },
  {
    texto: "El gato, que nunca entra al taller, se sentó a mirar todo el proceso sin moverse.",
    tipo: "animal",
    impacto: "medio"
  },
  {
    texto: "Se me cayó el pincel de la mano cuando iba a usar otro color. Entendí que ese no era el correcto.",
    tipo: "objeto",
    impacto: "medio"
  },
  {
    texto: "Esa noche soñé con su nombre antes de saber que existía.",
    tipo: "sueño",
    impacto: "alto"
  },
  {
    texto: "Empezó a llover exactamente cuando terminé de sellarla. Como un bautismo.",
    tipo: "clima",
    impacto: "medio"
  },
  {
    texto: "Las luces del taller titilaron tres veces. Solo pasa cuando algo importante está naciendo.",
    tipo: "electricidad",
    impacto: "medio"
  },
  {
    texto: "Encontré una pluma en la mesa del taller. No tenemos pájaros cerca.",
    tipo: "objeto",
    impacto: "alto"
  },
  {
    texto: "Mi hija entró al taller y dijo el nombre del guardián antes de que yo lo decidiera.",
    tipo: "persona",
    impacto: "muy_alto"
  },
  {
    texto: "El cristal que elegí se partió a la mitad. El que quedó era exactamente lo que necesitaba.",
    tipo: "objeto",
    impacto: "alto"
  }
];

export const getRandomSincrodestino = (usados = []) => {
  const disponibles = sincrodestinos.filter(s =>
    !usados.some(u => u.includes(s.texto.substring(0, 20)))
  );
  if (disponibles.length === 0) return sincrodestinos[0];
  return disponibles[Math.floor(Math.random() * disponibles.length)];
};
```

---

### 3. CIERRES POR PERFIL (lib/cierres-conversion.js)

```javascript
export const generarCierres = (nombreGuardian) => ({
  vulnerable: `Sé que estás cansada. Sé que das más de lo que recibís. ${nombreGuardian} no viene a pedirte nada. Viene a darte lo que nunca te diste: permiso para recibir.

Si estás leyendo esto con los ojos húmedos, no es casualidad. Es reconocimiento.`,

  esceptico: `No te pido que creas en nada. No necesito que confíes en mí ni en ${nombreGuardian}.

Solo te pido una cosa: observá qué sentiste mientras leías esto. Si algo se movió adentro tuyo, eso no lo inventé yo. Eso ya estaba ahí.`,

  impulsivo: `Hay momentos en que el cuerpo sabe antes que la mente. Si llegaste hasta acá, algo te trajo.

${nombreGuardian} no espera. Los guardianes únicos desaparecen cuando encuentran su hogar. Este es uno de esos momentos donde pensar demasiado es perder.`,

  coleccionista: `${nombreGuardian} no trabaja solo. Los guardianes se potencian entre sí. Si ya tenés otros, este viene a completar algo que falta.

Los que entienden esto no necesitan explicación. Ya saben cómo funciona.`,

  default: `Si algo de esto te hizo sentir algo, no lo ignores. El cuerpo reconoce antes que la mente.

${nombreGuardian} desaparece cuando encuentra su hogar verdadero. Una sola vez.`
});
```

---

### 4. ARCO EMOCIONAL (lib/arco-emocional.js)

```javascript
export const estructuraArco = {
  espejo: {
    porcentaje: "0-15%",
    objetivo: "El lector se reconoce",
    indicadores: ["personas que", "hay quienes", "algunos", "existe gente"]
  },
  herida: {
    porcentaje: "15-30%",
    objetivo: "Tocar el dolor sin nombrarlo",
    indicadores: ["carga", "peso", "agota", "drena", "cansa"]
  },
  validacion: {
    porcentaje: "30-40%",
    objetivo: "Lo que sentís es real",
    indicadores: ["es real", "no estás loca", "tiene sentido", "es válido"]
  },
  esperanza: {
    porcentaje: "40-55%",
    objetivo: "Existe una salida",
    indicadores: ["pero", "sin embargo", "existe", "hay otra forma"]
  },
  solucion: {
    porcentaje: "55-70%",
    objetivo: "Este guardián específico",
    indicadores: ["[nombre]", "este ser", "viene a", "su misión"]
  },
  prueba: {
    porcentaje: "70-85%",
    objetivo: "Sincrodestino",
    indicadores: ["mientras", "cuando", "justo", "exactamente"]
  },
  puente: {
    porcentaje: "85-95%",
    objetivo: "El guardián habla",
    indicadores: ["*", "primera persona", "vine", "llegué"]
  },
  decision: {
    porcentaje: "95-100%",
    objetivo: "El lector decide",
    indicadores: ["si sentiste", "si llegaste", "si algo"]
  }
};

export const validarArco = (historia) => {
  const resultados = {};
  let score = 0;

  Object.entries(estructuraArco).forEach(([fase, config]) => {
    const tiene = config.indicadores.some(ind =>
      historia.toLowerCase().includes(ind.toLowerCase())
    );
    resultados[fase] = tiene;
    if (tiene) score += 12.5; // 8 fases = 100%
  });

  return { resultados, score, completo: score >= 75 };
};
```

---

### 5. SCORING DE CONVERSIÓN (lib/scoring-conversion.js)

```javascript
export const calcularScore = (historia, datos) => {
  const score = {
    identificacion: 0,
    dolor: 0,
    solucion: 0,
    urgencia: 0,
    confianza: 0
  };

  // Identificación (0-10)
  const patronesIdentificacion = [
    /hay personas que/i, /hay quienes/i, /algunos/i, /existe gente/i,
    /¿cuántas veces/i, /¿sentís/i, /¿te pasó/i
  ];
  score.identificacion = Math.min(10, patronesIdentificacion.filter(p => p.test(historia)).length * 2);

  // Dolor (0-10)
  const patronesDolor = [
    /carga/i, /peso/i, /agota/i, /drena/i, /cansa/i,
    /dolor/i, /herida/i, /sufr/i, /difícil/i
  ];
  score.dolor = Math.min(10, patronesDolor.filter(p => p.test(historia)).length * 2);

  // Solución (0-10)
  const nombreMencionado = historia.includes(datos.nombre);
  const beneficiosClaros = /vas a|va a|viene a|puede/i.test(historia);
  const accionConcreta = /protege|ayuda|trabaja|activa/i.test(historia);
  score.solucion = (nombreMencionado ? 4 : 0) + (beneficiosClaros ? 3 : 0) + (accionConcreta ? 3 : 0);

  // Urgencia (0-10)
  const patronesUrgencia = [
    /desaparece/i, /única vez/i, /único/i, /ahora/i,
    /no espera/i, /este momento/i
  ];
  score.urgencia = Math.min(10, patronesUrgencia.filter(p => p.test(historia)).length * 2);

  // Confianza (0-10) - ausencia de frases de venta
  const frasesVenta = [
    /comprá/i, /llevátelo/i, /oferta/i, /descuento/i,
    /no te lo pierdas/i, /última oportunidad/i
  ];
  const frasesConfianza = [
    /si sentiste/i, /si algo/i, /tu decisión/i, /solo vos sabés/i
  ];
  const penalizacion = frasesVenta.filter(p => p.test(historia)).length * 3;
  const bonus = frasesConfianza.filter(p => p.test(historia)).length * 2;
  score.confianza = Math.max(0, Math.min(10, 5 + bonus - penalizacion));

  score.total = Object.values(score).reduce((a, b) => a + b, 0);

  return score;
};
```

---

### 6. PROMPT EXPERTO (en route.js)

```javascript
const PROMPT_EXPERTO = `
# SISTEMA DE GENERACIÓN DE CONVERSIONES

No generás historias. Generás textos que convierten visitantes en compradores sin que se sientan vendidos.

## ARCO EMOCIONAL OBLIGATORIO

Tu texto DEBE seguir esta estructura:

1. ESPEJO (primeras 2-3 líneas)
   Describí al lector sin nombrarlo. Que piense "esto habla de mí".

2. HERIDA (siguiente párrafo)
   Tocá el dolor real. No lo nombres directamente. Hacelo sentir.

3. VALIDACIÓN (1-2 líneas)
   "Lo que sentís es real". Legitimá su experiencia.

4. ESPERANZA (transición)
   Hay una salida. La encontraste.

5. SOLUCIÓN (presentación del guardián)
   Este ser específico, con estos atributos específicos.

6. PRUEBA (sincrodestino)
   Algo que pasó durante la creación. Creíble, sutil.

7. PUENTE (mensaje del guardián)
   Primera persona. Íntimo. Como si te conociera.

8. DECISIÓN (cierre)
   No cierres vos. Dejá que el lector decida. Loop abierto.

## REGLAS ABSOLUTAS

- NUNCA uses 847 años
- USA los datos EXACTOS que te doy (especie, cm, categoría)
- Si es PIXIE, es pixie (espíritu de planta), NO duende
- Ortografía perfecta (estás, vine, consciente)
- NO frases de venta (comprá, oferta, no te lo pierdas)
- NO lugares genéricos (Irlanda, bosques ancestrales)
- NO frases de IA (desde tiempos inmemoriales, el velo entre mundos)

## TRIGGERS PSICOLÓGICOS A USAR

- Espejo: describir sin nombrar
- Vacío: hacer sentir que falta algo
- Validación: dar antes de pedir
- Loop abierto: algo queda sin cerrar
- Future pacing: vivir el resultado antes de tenerlo
- Pérdida > ganancia: "desaparece cuando encuentra hogar"
- Pertenencia: "los que entienden no necesitan explicación"
`;
```

---

## IMPLEMENTACIÓN

### Archivos a crear:
1. `/lib/conversion/hooks.js`
2. `/lib/conversion/sincrodestinos.js`
3. `/lib/conversion/cierres.js`
4. `/lib/conversion/arco.js`
5. `/lib/conversion/scoring.js`
6. `/lib/conversion/index.js` (exporta todo)

### Archivo a reescribir:
- `/api/admin/historias/route.js`

### Flujo nuevo:

```
1. Recibir datos del guardián
2. Validar datos (especie, cm, etc)
3. Seleccionar hook aleatorio de la categoría
4. Seleccionar sincrodestino no usado
5. Generar historia con prompt experto
6. Post-procesar (correcciones ortográficas, etc)
7. Validar arco emocional
8. Calcular score de conversión
9. Generar cierres por perfil
10. Si score < 35 o arco incompleto, regenerar
11. Devolver historia + hooks alternativos + cierres + score
```

---

## ORDEN DE IMPLEMENTACIÓN

1. Crear `/lib/conversion/` con todos los módulos
2. Reescribir el route.js usando los módulos
3. Actualizar el frontend para mostrar score y advertencias
4. Testear con 5 guardianes diferentes
5. Ajustar según resultados

---

*Este plan técnico guía la implementación del sistema experto de conversión.*

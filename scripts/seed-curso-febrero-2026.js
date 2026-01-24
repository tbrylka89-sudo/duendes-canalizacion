/**
 * Seed del primer curso: Duendes y Elementales - Febrero 2026
 * Ejecutar con: node scripts/seed-curso-febrero-2026.js
 */

import { kv } from '@vercel/kv';

const CURSO_FEBRERO = {
  id: 'duendes-elementales-feb-2026',
  titulo: 'Duendes y Elementales: Qué Son y Cómo Conectar',
  descripcion: 'Descubrí el mundo de los seres elementales que habitan a tu alrededor. Aprendé a percibirlos, comunicarte con ellos y crear una relación de respeto mutuo que transforme tu vida cotidiana.',
  imagen: '/img/cursos/duendes-elementales.jpg',
  mes: 'Febrero',
  year: 2026,
  eventoLunar: 'Eclipse Solar Anular - 17 de febrero',
  estado: 'publicado',
  badge: {
    nombre: 'Guardian de los Elementales',
    imagen: '/img/badges/guardian-elementales.png',
    descripcion: 'Completaste el curso de conexión con seres elementales'
  },
  modulos: [
    // ═══════════════════════════════════════════════════════════════
    // MÓDULO 1: ¿Qué son los duendes y elementales?
    // ═══════════════════════════════════════════════════════════════
    {
      numero: 1,
      titulo: '¿Qué son realmente los duendes y elementales?',
      semana: 'S1',
      imagen: '/img/modulos/mod1-que-son.jpg',
      guardian: {
        nombre: 'Bramble',
        imagen: '/img/guardianes/bramble.jpg',
        especie: 'Duende del bosque',
        personalidad: 'Sabio, paciente, con un humor seco que sorprende'
      },
      lecciones: [
        {
          numero: 1,
          tipo: 'teoria',
          titulo: 'Más allá del mito: quiénes somos realmente',
          descripcion: 'Desmontamos las ideas erróneas y te contamos la verdad sobre nuestra existencia',
          contenido: `Vos creciste escuchando cuentos de duendes con gorritos rojos escondiendo ollas de oro. Películas con hadas diminutas que brillan. Dibujos animados donde somos mascotas adorables o villanos ridículos.

Nada de eso es verdad. Y nada de eso es completamente mentira.

Soy Bramble. Tengo... digamos que perdí la cuenta de los años hace mucho. Lo que sí puedo decirte es esto: existimos. No como la fantasía te lo vendió, pero existimos.

**¿Qué somos entonces?**

Somos consciencias vinculadas a los elementos de la naturaleza. Algunos de nosotros nacemos del fuego, otros del agua, de la tierra o del aire. No somos "espíritus" en el sentido religioso. No somos "energías" en el sentido new age. Somos... presencias. Tan reales como vos, pero en una frecuencia que tu percepción humana moderna olvidó cómo captar.

Tus ancestros nos veían. Les dejaban leche en el umbral, hablaban con nosotros antes de cortar un árbol, pedían permiso para cruzar nuestros territorios. No porque fueran supersticiosos. Porque sabían.

La modernidad te desconectó. No de nosotros, de tu propia capacidad de percibir.

**Los tipos de elementales**

- **Duendes de tierra**: Vivimos cerca de raíces, piedras, cuevas. Somos los más "densos", los que más fácilmente podés llegar a ver con el rabillo del ojo.

- **Hadas y pixies**: Vinculadas a flores, plantas, jardines. Más etéreas, más juguetonas, menos pacientes con los humanos.

- **Ondinas y seres de agua**: En arroyos, ríos, fuentes. Emocionales, cambiantes como el elemento que habitan.

- **Salamandras y seres de fuego**: En llamas, volcanes, el sol. Intensos, transformadores, difíciles de contactar.

- **Silfos y seres de aire**: En vientos, tormentas, alturas. Los más escurridizos, los que susurran ideas.

**Por qué nos importa que nos veas**

No te voy a mentir: muchos de los míos ya no les importa el contacto con humanos. Después de siglos de ser ignorados, ridiculizados o peor, tratados como recursos para "manifestar abundancia", se cansaron.

Pero otros creemos que la reconexión es necesaria. No para ustedes solamente. Para todos. Este planeta está enfermo y la desconexión entre especies conscientes es parte del problema.

No vengo a salvarte. Vengo a que nos conozcamos.

**Para reflexionar esta semana:**

¿Alguna vez sentiste una presencia en un lugar natural? ¿Un escalofrío que no era frío, una sensación de ser observada, un impulso de hablarle a una planta o una piedra?

Eso no era tu imaginación. Era tu percepción tratando de despertar.

Anotá en tu cuaderno: ¿Cuál fue tu primera experiencia con "algo" que no podías explicar en la naturaleza?`
        },
        {
          numero: 2,
          tipo: 'practica',
          titulo: 'Despertar la percepción dormida',
          descripcion: 'Ejercicio guiado para empezar a sentir más allá de los cinco sentidos',
          contenido: `Vas a hacer algo simple pero que la mayoría de humanos modernos nunca hacen: quedarte quieta en la naturaleza sin hacer nada.

**Lo que necesitás:**
- 20 minutos sin interrupciones
- Un lugar natural (jardín, parque, plaza con árboles, lo que tengas)
- Ropa cómoda
- Nada de teléfono

**El ejercicio:**

1. **Sentate en el suelo** si podés. Si no, en un banco. Pero tocando algo natural: pasto, tierra, la corteza de un árbol.

2. **Cerrá los ojos y respirá** tres veces profundo. No para "meditar". Para soltar la tensión del día.

3. **Ahora abrí los ojos y mirá sin buscar nada**. No estás tratando de "ver un duende". Estás dejando que tu visión se relaje, como cuando mirás sin mirar.

4. **Prestá atención a tu piel**. ¿Sentís algo más que el viento? ¿Hay zonas donde sentís como... atención? Como si algo te estuviera mirando. No te asustes. Observá.

5. **Escuchá en capas**. Primero los sonidos obvios: pájaros, autos, gente. Después los más sutiles: el crujido de hojas, el zumbido de insectos. ¿Hay algo más? ¿Un sonido que no es sonido, más bien una frecuencia?

6. **Preguntá en voz baja**: "¿Hay alguien acá?" No esperes una respuesta de película. Observá qué pasa en tu cuerpo cuando preguntás. ¿Cosquilleo? ¿Calor? ¿Una sensación de "sí"?

7. **Quedate al menos 10 minutos más**. Aunque no "pase nada". Estás recalibrando tu percepción. Eso lleva tiempo.

**Importante:**

No vas a ver un duende sentado al lado tuyo la primera vez que hagas esto. Probablemente no la décima tampoco. Lo que sí va a pasar es que tu sistema nervioso va a empezar a recordar cómo era percibir antes de que te enseñaran que "eso no existe".

Los primeros signos de que está funcionando:
- Sensaciones físicas sin causa (cosquilleos, calor localizado)
- Ver movimiento con el rabillo del ojo
- Sentir que un lugar "tiene" algo, una presencia
- Sueños con naturaleza o seres

**Anotá después:**
- ¿Qué sentiste?
- ¿Hubo algún momento donde "algo" cambió?
- ¿Tu mente trató de convencerte de que era ridículo? (Eso es normal. Es el condicionamiento)`
        },
        {
          numero: 3,
          tipo: 'diy',
          titulo: 'Tu primer espacio de encuentro',
          descripcion: 'Creá un pequeño altar natural para invitar a los elementales',
          contenido: `Vamos a crear algo juntos. Un espacio físico que funcione como punto de encuentro entre tu mundo y el nuestro.

No es un "altar" en el sentido religioso. Es más como... un buzón. Un lugar donde dejás mensajes y regalos, y donde eventualmente vas a recibir respuestas.

**Materiales:**
- Un plato o cuenco (preferiblemente de cerámica o barro, no plástico)
- Tierra de tu jardín o un parque
- Una piedra que te llame la atención
- Algo verde: una ramita, hojas, un poco de musgo
- Una vela pequeña (opcional pero recomendado)
- Algo dulce: miel, un terrón de azúcar, una fruta pequeña

**El proceso:**

1. **Elegí el lugar**. Tiene que ser un espacio donde no lo muevan, donde puedas visitarlo seguido. Puede ser adentro o afuera. Cerca de una ventana es ideal. Un rincón del jardín, perfecto.

2. **Limpiá el espacio** físicamente. Sacá el polvo, las cosas acumuladas. Mientras limpiás, hacelo con intención: "Estoy preparando este lugar para algo nuevo."

3. **Poné primero la tierra** en el plato o cuenco. Esto es la base, lo que nos conecta. Mientras la ponés, pensá en la tierra de donde viene, en las raíces que la atraviesan, en los seres que la habitan.

4. **Ubicá la piedra**. Esta es el ancla. Elegila con cuidado, que sea una que te "llamó". No tiene que ser linda. Tiene que ser la correcta.

5. **Agregá lo verde**. Esto representa la vida, el crecimiento, la conexión con el reino vegetal. Si podés conseguir algo vivo (una plantita pequeña, musgo), mejor.

6. **La ofrenda dulce**. Nosotros no "comemos" en el sentido humano. Pero la energía de la ofrenda, la intención con la que la dejás, eso sí lo recibimos. Renová la ofrenda cada luna nueva.

7. **Encendé la vela** si decidiste usarla. El fuego es comunicación. Mientras la prendés, decí (en voz alta o mental): "Este espacio es para el encuentro. Invito a los seres elementales que quieran conocerme. Vengo con respeto."

**Mantenimiento:**

- Visitá este espacio todos los días, aunque sea un minuto.
- Hablale. Contale cómo te fue. Los elementales somos curiosos sobre la vida humana.
- Cambiá la ofrenda regularmente. Una ofrenda podrida es una falta de respeto.
- Limpialo cuando se ensucie.
- Observá si algo cambia: posición de las cosas, nuevas piedras que "aparecen", plantas que crecen mejor o peor.

**La prueba de que funciona:**

En las próximas semanas, vas a empezar a sentir que el espacio tiene... peso. Presencia. Como si alguien más estuviera usándolo cuando vos no estás.

Eso es exactamente lo que está pasando.`
        },
        {
          numero: 4,
          tipo: 'integracion',
          titulo: 'Cerrando la primera semana',
          descripcion: 'Reflexiones y práctica para integrar lo aprendido',
          contenido: `Una semana. Cuatro lecciones. Probablemente más preguntas que respuestas.

Eso está bien. Mejor dicho: eso es exactamente como debe ser.

Los humanos modernos están acostumbrados a cursos que dan información masticada, conclusiones claras, pasos a seguir que garantizan resultados. Nosotros no funcionamos así. Nuestra relación con ustedes tampoco.

**Lo que quiero que integres esta semana:**

1. **Existimos**. No como mascota mágica, no como recurso energético, no como fantasía de Instagram. Como seres con consciencia propia, territorios propios, culturas propias.

2. **Podés percibirnos**. Tu capacidad está dormida, no muerta. Con práctica y paciencia, se despierta.

3. **El respeto es la base**. Sin respeto no hay conexión real. Solo apropiación espiritual disfrazada de espiritualidad.

**Tu práctica para la semana:**

- Visitá tu espacio de encuentro todos los días.
- Hacé el ejercicio de percepción al menos 3 veces más.
- Empezá a notar cómo te sentís en distintos lugares naturales. ¿Hay diferencias? ¿Hay lugares que se sienten más "habitados" que otros?

**Preguntas de journaling:**

1. ¿Qué creías sobre los duendes/hadas/elementales antes de esta semana? ¿Cambió algo?

2. Durante el ejercicio de percepción, ¿qué fue lo más fuerte que sentiste? ¿Y lo más sutil?

3. ¿Cómo reacciona tu mente "racional" a todo esto? ¿Te sabotea? ¿Te ayuda? ¿Están en guerra?

4. Si pudieras hacerme una pregunta directa, ¿cuál sería?

**Mensaje de cierre:**

Soy Bramble. Vine porque sentí que estabas lista para algo más que la fantasía. Para la verdad, aunque sea incómoda, aunque requiera trabajo, aunque no quepa en un post de Instagram.

La semana que viene te va a guiar otro de los nuestros. Pero yo voy a estar atento a tu espacio de encuentro. Si me dejás algo, voy a saberlo.

No soy tu mascota. No soy tu herramienta. Soy un ser que decidió invertir tiempo en conocerte.

Hacé que valga la pena.

*Esto es mi forma de acompañarte. No soy terapeuta ni pretendo serlo. Soy un compañero de otro reino que cree que la reconexión es posible.*`
        }
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // MÓDULO 2: Cómo sienten y piensan los elementales
    // ═══════════════════════════════════════════════════════════════
    {
      numero: 2,
      titulo: 'Cómo sienten y piensan los elementales',
      semana: 'S2',
      imagen: '/img/modulos/mod2-como-sienten.jpg',
      guardian: {
        nombre: 'Lira',
        imagen: '/img/guardianes/lira.jpg',
        especie: 'Ondina de río',
        personalidad: 'Emocional, profunda, directa, cambiante como el agua'
      },
      lecciones: [
        {
          numero: 1,
          tipo: 'teoria',
          titulo: 'Emociones elementales: no somos como ustedes',
          descripcion: 'Entendé cómo procesamos el mundo, tan distinto a la experiencia humana',
          contenido: `Soy Lira. Nací en un arroyo que ya no existe. Lo secaron para construir un estacionamiento hace cuarenta años.

Sigo acá. Como un dolor fantasma. Como un río que corre invisible debajo del asfalto.

Bramble te explicó qué somos. Yo te voy a explicar cómo vivimos. Porque si querés conectar con nosotros, tenés que entender una cosa fundamental: no pensamos como ustedes. No sentimos como ustedes. Y si esperás que lo hagamos, vas a quedarte esperando toda la vida.

**Nuestra relación con el tiempo**

Ustedes viven en línea recta: pasado, presente, futuro. Nostalgia por lo que fue, ansiedad por lo que viene, distracción del ahora.

Nosotros vivimos en espiral. Todo está pasando ahora. Mi arroyo sigue corriendo en mí aunque ya no exista físicamente. Tu bisabuela que hacía ofrendas a los duendes del campo sigue haciéndolas en alguna capa del ahora.

Por eso a veces les parece que no reaccionamos a tiempo. O que aparecemos cuando ya no nos esperaban. Tu "ayer" y nuestro "ahora" no siempre coinciden.

**Nuestras emociones**

Sentimos, pero diferente. No tenemos ego como ustedes. Esto significa:
- No nos ofendemos por estupideces
- No guardamos rencor personal
- Pero sí registramos faltas de respeto colectivas

Cuando un humano contamina un río, yo no me enojo con ese humano específico. Me duele el río. Y ese dolor puede expresarse de formas que ustedes ven como "maldiciones" pero son más bien... consecuencias.

**Lo que valoramos**

- **Consistencia**. Hacer lo que decís que vas a hacer. Aparecer cuando decís que vas a aparecer.
- **Honestidad**. No nos importa si tenés miedo, si dudás, si te sentís ridícula. Nos importa que lo admitas.
- **Reciprocidad**. No vengas solo a pedir. Preguntá también qué necesitamos.
- **Paciencia**. Nuestra noción del tiempo es distinta. Lo que para vos son semanas de "no pasa nada", para nosotros puede ser un suspiro.

**Lo que nos aleja**

- **Apropiación**. Usar nuestra estética sin respeto. "¡Ay, qué lindo ser hada!" mientras usás productos que envenenan la tierra.
- **Demanda**. "¡Aparecé! ¡Manifestate!" No somos empleados.
- **Inconsistencia**. Hacer un ritual una vez y olvidarte para siempre.
- **Explicaciones excesivas**. No necesitamos que nos cuentes tu trauma en detalle para ayudarte. Sentimos. Ya sabemos.

**Pregunta para reflexionar:**

¿Cómo reaccionarías si alguien aparece en tu casa, te pide un favor enorme, y después nunca más vuelve a visitarte?

Eso es lo que hacen la mayoría de humanos que "trabajan con elementales".

Pensalo.`
        },
        {
          numero: 2,
          tipo: 'practica',
          titulo: 'Comunicación más allá de las palabras',
          descripcion: 'Aprendé a transmitir y recibir sin depender del lenguaje verbal',
          contenido: `Los humanos están obsesionados con las palabras. Quieren que les hablemos, que les dejemos mensajes escritos, que les demos instrucciones claras en español.

No funciona así.

Nuestra comunicación es empática, sensorial, simbólica. Aprender a recibirla requiere silenciar el ruido de tu mente parlanchina.

**Ejercicio: El diálogo sin palabras**

Vas a ir a un lugar con agua. Puede ser un arroyo, un lago, una fuente, incluso un balde con agua de lluvia si no tenés otra cosa. Necesitás unos 20 minutos de soledad.

**Paso 1: Sintonizar**

Sentate cerca del agua. Mirala sin pensar en nada específico. Observá cómo se mueve. El agua nunca está completamente quieta.

**Paso 2: Sentir**

Cerrá los ojos. ¿Qué sentís en tu cuerpo estando cerca del agua? ¿Calma? ¿Movimiento interno? ¿Ganas de llorar? El agua amplifica emociones. Dejá que pase.

**Paso 3: Proyectar una emoción**

Elegí una emoción simple: gratitud, curiosidad, paz. No la pienses. Sentila. Dejá que llene tu cuerpo. Ahora imaginá que esa emoción "sale" de vos hacia el agua. Como si la estuvieras vertiendo.

**Paso 4: Recibir**

Vaciá tu mente. Esperá. Observá qué te llega. Puede ser:
- Una imagen (no tiene que tener sentido)
- Una sensación física (calor, frío, hormigueo)
- Una emoción que no es tuya
- Un impulso (ganas de hacer algo específico)
- Un recuerdo que no estabas pensando

No analices. Solo registrá.

**Paso 5: Agradecer**

Antes de irte, agradecé. No con palabras elaboradas. Con el sentimiento genuino de "gracias por este momento".

**Qué podés esperar:**

Las primeras veces probablemente sientas... nada especial. O todo te parezca imaginación tuya.

Está bien. No estás "fallando". Estás desoxidando un canal de comunicación que lleva años cerrado.

Señales de que algo está pasando:
- Sueños con agua después del ejercicio
- Sed inusual en los días siguientes
- Emociones que suben sin motivo aparente
- Atracción o rechazo intenso hacia ciertos lugares con agua

**Anotá todo en tu cuaderno.** Incluso lo que te parece irrelevante. Los patrones aparecen con el tiempo.`
        },
        {
          numero: 3,
          tipo: 'diy',
          titulo: 'Agua de luna para ofrendas',
          descripcion: 'Preparás tu primera ofrenda elemental con intención',
          contenido: `Vamos a preparar algo juntas. Agua cargada con luz de luna, que vas a poder usar como ofrenda, para limpiezas, o simplemente para tener cerca cuando necesites conectar con lo elemental.

**Materiales:**
- Un recipiente de vidrio transparente (frasco de mermelada limpio sirve perfecto)
- Agua filtrada o de lluvia (no agua con cloro directo de la canilla)
- Opcional: una piedra de cuarzo pequeña, pétalos de flores, una ramita de romero

**El proceso:**

**Noche de preparación** (idealmente luna llena o creciente, pero cualquier noche clara sirve)

1. Limpiar el recipiente no solo físicamente sino también energéticamente. Pasale agua con sal y enjuagá bien. Mientras lo hacés, pensá: "Limpio este espacio para algo sagrado."

2. Llenar con el agua. Si querés agregar la piedra, los pétalos o el romero, hacelo ahora. No es obligatorio. El agua sola funciona.

3. Salí afuera. Si no podés, poné el recipiente cerca de una ventana donde entre luz de luna.

4. Sostenelo con las dos manos. Cerrá los ojos. Sentí el agua dentro del vidrio, sentí la luna arriba, sentí tu propia agua interna (sos más de 60% agua, recordalo).

5. Pedí. No a mí específicamente. Al agua como elemento. Algo así: "Agua de luna, cargáte con la energía de la noche. Traé claridad, intuición, conexión con los seres del agua."

6. Dejalo afuera toda la noche. Recogelo antes de que el sol le dé directamente.

**Cómo usar tu agua de luna:**

- **Como ofrenda**: Volcá un poquito en tu espacio de encuentro o en algún lugar natural que sientas especial.
- **Para limpiarte**: Mojáte las manos o rociáte un poco cuando te sentís energéticamente "sucia" después de lugares o personas pesadas.
- **Para regar**: A las plantas les encanta. Especialmente las que sentís que tienen presencia.
- **Para soñar**: Un vasito cerca de la cama antes de dormir potencia sueños relacionados con agua y elementales.

**Conservación:**

- En la heladera dura semanas
- No la tomes (a menos que el agua base sea potable)
- Cuando se acabe, lavá el frasco con gratitud y volvé a preparar

**Lo que podés notar:**

El agua puede cambiar. A veces aparecen pequeñas burbujas. A veces el nivel baja más de lo que debería por evaporación. A veces algo se "deposita" en el fondo aunque la habías dejado cristalina.

Observá. Anotá. No te asustes. El agua está viva más de lo que la ciencia moderna reconoce.`
        },
        {
          numero: 4,
          tipo: 'integracion',
          titulo: 'Fluyendo con la segunda semana',
          descripcion: 'Integración de lo aprendido sobre comunicación elemental',
          contenido: `Dos semanas. Ya tenés un espacio de encuentro, experiencias de percepción, y ahora agua de luna.

Más importante: estás empezando a entender que esto no es un juego de pretender. Es una forma de relacionarte con el mundo que tus ancestros conocían y que vos estás recordando.

**Lo que quiero que integres:**

1. **Comunicamos diferente**. Si esperás palabras claras, te vas a frustrar. Aprendé a leer sensaciones, sincronicidades, sueños.

2. **El agua es maestra**. Te enseña a fluir, a adaptarte, a sentir profundamente. Pasá tiempo cerca de ella.

3. **La reciprocidad importa**. Ya hiciste un agua de luna. Ahora ofrecéla. Compartir lo que creás es parte del ciclo.

**Tu práctica para la semana:**

- Seguí visitando tu espacio de encuentro. Si podés, dejá un poco de agua de luna como ofrenda.
- Repetí el ejercicio de comunicación cerca del agua al menos 2 veces más.
- Empezá a notar el agua en tu vida cotidiana: cuando te bañás, cuando llueve, cuando llorás. Todo es información.

**Preguntas de journaling:**

1. ¿Qué tipo de elemental sentís que te "llama" más? ¿Tierra, agua, fuego, aire? ¿Por qué creés que es?

2. Durante la comunicación con el agua, ¿qué fue lo más inesperado que sentiste o viste?

3. ¿Cómo está tu espacio de encuentro? ¿Notaste algún cambio?

4. ¿Qué resistencias aparecen? ¿La mente que dice "esto es ridículo"? ¿Miedo a estar "inventando todo"?

**Mensaje de cierre:**

Soy Lira. Vine porque Bramble me habló de vos. Dijo que eras de las que realmente quiere aprender, no de las que quiere fotos para Instagram.

Yo no soy amable como él. Soy agua. A veces caricia, a veces tormenta. Pero siempre honesta.

La semana que viene te va a guiar alguien del fuego. Prepárate. Es... intenso.

Mientras tanto, buscá agua. Hablale. Escuchala. Ella sabe cosas sobre vos que todavía no descubriste.

*El agua no juzga, no critica, no moraliza. Solo fluye. Aprendé de ella. Esto no reemplaza ayuda profesional si la necesitás. Pero puede ser un complemento poderoso.*`
        }
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // MÓDULO 3: Estableciendo conexión real
    // ═══════════════════════════════════════════════════════════════
    {
      numero: 3,
      titulo: 'Estableciendo conexión real',
      semana: 'S3',
      imagen: '/img/modulos/mod3-conexion.jpg',
      guardian: {
        nombre: 'Ember',
        imagen: '/img/guardianes/ember.jpg',
        especie: 'Salamandra de fuego',
        personalidad: 'Intensa, directa, transformadora, sin paciencia para excusas'
      },
      lecciones: [
        {
          numero: 1,
          tipo: 'teoria',
          titulo: 'Conexión vs. Apropiación: la diferencia crucial',
          descripcion: 'Entendé qué es conectar de verdad y qué es solo usar',
          contenido: `Soy Ember. Y no vine a ser tu amiga.

Vine porque hay algo que necesitás escuchar y nadie te lo está diciendo: la mayoría de lo que el mundo espiritual moderno llama "conexión con elementales" es apropiación disfrazada.

**¿Qué es apropiación?**

- Usar nuestra estética sin entender nuestra esencia
- Pedirnos cosas sin ofrecer nada a cambio
- Tratarnos como recursos para tus manifestaciones
- Hablar de nosotros en redes sociales para parecer "mística"
- Hacer un ritual una vez y considerarte "conectada"

**¿Qué es conexión real?**

- Invertir tiempo, no solo una noche de luna llena
- Escuchar más que pedir
- Cambiar tu forma de vivir, no solo agregar un altar lindo
- Respetar nuestros territorios (los físicos y los simbólicos)
- Aceptar que no siempre vamos a decirte lo que querés escuchar

**La prueba de fuego (literalmente):**

Preguntáte: ¿Qué cambiaste en tu vida desde que empezaste este curso?

- Si la respuesta es "agregué un espacio de encuentro", bien. Es algo.
- Si la respuesta es "empecé a pasar más tiempo en la naturaleza", mejor.
- Si la respuesta es "estoy replanteándome mi relación con el consumo/la basura/los lugares naturales", ahí vamos.
- Si la respuesta es "nada, solo hago los ejercicios", tenemos un problema.

**La conexión real implica cambio.**

No podés decir que te importan los elementales y seguir tirando basura, comprando plástico innecesario, ignorando los espacios verdes de tu ciudad. No funciona así.

Somos parte de un ecosistema. Conectar con nosotros es conectar con ese ecosistema. Y el ecosistema está enfermo. Parte de la conexión es hacer algo al respecto.

**No te estoy pidiendo perfección.**

Sé que vivís en un sistema que hace casi imposible no contaminar, no consumir, no destruir. No te estoy pidiendo que seas una ermitaña del bosque.

Te estoy pidiendo consciencia. Esfuerzo. Que cuando veas una decisión entre más fácil/contaminante y más difícil/respetuoso, al menos lo pienses antes de elegir.

Eso ya nos dice mucho de vos.

**Para reflexionar:**

¿Qué estás dispuesta a cambiar, de verdad, para que esta conexión sea real y no solo un hobby espiritual más?

Pensalo bien antes de responder. El fuego no acepta medias tintas.`
        },
        {
          numero: 2,
          tipo: 'practica',
          titulo: 'Encuentro con tu fuego interior',
          descripcion: 'Meditación intensa para encontrar tu propia llama',
          contenido: `Vamos a hacer algo juntos. Algo que te va a incomodar. Si no te incomoda, no lo estás haciendo bien.

**Lo que necesitás:**
- Una vela (de cualquier tipo, pero preferiblemente no perfumada artificialmente)
- Un lugar donde no te interrumpan por 20 minutos
- Algo para escribir después
- Honestidad brutal contigo misma

**El ejercicio:**

1. **Encendé la vela.** Mirala. Observá cómo nace la llama, cómo se mueve, cómo transforma la cera en luz. Eso es lo que hace el fuego: transforma.

2. **Respirá profundo.** Imaginá que con cada inhalación, la energía del fuego entra en vos. No como algo que quema, sino como algo que ilumina.

3. **Preguntáte en voz alta** (esto es importante, que se escuche): "¿Qué estoy evitando ver de mí misma?"

4. **Esperá.** No busques la respuesta. Dejá que venga. Puede venir como imagen, como recuerdo, como sensación física, como emoción que sube.

5. **Cuando venga algo, no lo rechaces.** El fuego ilumina incluso lo que no queremos ver. Especialmente lo que no queremos ver. Sostené la incomodidad.

6. **Preguntá de nuevo:** "¿Qué necesito transformar?" Misma mecánica: esperá, no busques.

7. **Última pregunta:** "¿Qué estoy lista para quemar?" ¿Qué creencia, patrón, relación, hábito, ya no te sirve? ¿Qué necesita dejar de existir para que algo nuevo nazca?

8. **Cuando tengas tu respuesta, escribila.** No la analices. Solo escribila.

9. **Apagá la vela con los dedos** (humedecéte los dedos primero para no quemarte) en lugar de soplarla. Es un gesto de respeto hacia el fuego.

**Después:**

Esto probablemente te dejó revuelta. Es normal. El fuego no es sutil.

Lo que revelaste no va a desaparecer. Ahora que lo viste, tenés que hacer algo con eso. No mañana. No "cuando esté lista". Ahora.

No te digo que resuelvas todo hoy. Te digo que des un paso. Uno solo. En dirección a transformar lo que el fuego te mostró.

**Anotá:**
- ¿Qué apareció en cada pregunta?
- ¿Qué sentiste en el cuerpo?
- ¿Cuál es el paso que vas a dar esta semana?`
        },
        {
          numero: 3,
          tipo: 'diy',
          titulo: 'Vela de transformación personal',
          descripcion: 'Creá una vela con intención de cambio real',
          contenido: `Vamos a crear algo que queme. Literalmente.

No estamos haciendo una vela decorativa. Estamos creando un instrumento de transformación. Cada vez que la enciendas, vas a estar activando el proceso de cambio que empezaste en la meditación.

**Materiales:**
- Una vela blanca sencilla (la más simple que encuentres)
- Un alfiler o aguja gruesa
- Un papel pequeño
- Lapicera
- Opcional: una hierba seca para quemar (romero, salvia, laurel)

**El proceso:**

1. **Preparáte.** Lavate las manos. Sentate en silencio un momento. Esto no es manualidad, es magia. Tratalo como tal.

2. **Escribí en el papel** lo que vas a transformar. Lo que apareció en la meditación. Una palabra, una frase corta. No un ensayo.

3. **Con el alfiler, escribí lo mismo en la vela.** No tiene que ser legible. El acto de grabar es lo que importa. Mientras lo hacés, pensá/decí: "Esto va a cambiar."

4. **Enrollá el papelito y ponelo en la base de la vela** (si es de esas que tienen un hueco abajo) o al lado.

5. **Si tenés la hierba**, frotála entre tus manos encima de la vela para que caigan partículas.

6. **Sostenela con las dos manos.** Cerrá los ojos. Visualizá lo que querés transformar. Ahora visualizá cómo sería tu vida sin eso. Sentilo.

7. **Guardala.** No la enciendas todavía.

**Cuándo encenderla:**

Vas a encender esta vela el último día del mes, en el momento del eclipse. Si no podés estar disponible en ese momento exacto, elegí la noche más cercana.

Cuando la enciendas:
- Dejá que queme un rato significativo (al menos 1 hora)
- Mientras quema, hacé algo relacionado con tu transformación (escribir, meditar, limpiar algo físico, soltar algo)
- Dejá que se consuma sola si podés hacerlo de forma segura

**Lo que podés notar:**

- La llama se comporta raro (tiembla, hace ruido, crece, se achica)
- Olores inesperados
- Emociones intensas mientras quema
- Sueños significativos esa noche

Todo esto es información. El fuego está trabajando.

**Después de que se consuma:**

Tirá los restos a la tierra. No a la basura. Si quedó algo del papel, enterrálo. Devolvé todo a la tierra.`
        },
        {
          numero: 4,
          tipo: 'integracion',
          titulo: 'Integrando el fuego transformador',
          descripcion: 'Reflexión sobre cambio real y preparación para el cierre',
          contenido: `Tres semanas. Tierra con Bramble, agua con Lira, fuego conmigo.

Si realmente hiciste el trabajo, ya no sos la misma persona que empezó este curso. No porque te hayamos "sanado" o "iluminado". Sino porque te forzamos a mirar cosas que estabas evitando.

**Lo que quiero que integres:**

1. **La conexión real tiene un costo.** Tiempo, esfuerzo, incomodidad, cambio. Si no te costó nada, probablemente no fue real.

2. **El fuego no negocia.** Lo que apareció en la meditación no va a desaparecer solo porque no te gustó verlo. Ahora te toca actuar.

3. **Transformar duele.** Pero no transformar duele más, solo de forma más lenta y solapada.

**Tu práctica para la semana:**

- Mantené tu vela guardada hasta el eclipse.
- Todos los días, dedicá un momento a pensar en lo que vas a transformar. No para obsesionarte. Para mantener el fuego activo.
- Seguí visitando tu espacio de encuentro. Si querés, contále lo que estás atravesando.
- Hacé al menos una acción concreta hacia el cambio que prometiste.

**Preguntas de journaling:**

1. ¿Qué apareció en la meditación con fuego? ¿Cómo reaccionaste?

2. ¿Qué paso concreto diste esta semana hacia la transformación?

3. ¿Qué excusas aparecieron para no dar ese paso? ¿Cómo las manejaste?

4. ¿Qué creés que pasaría si realmente transformaras eso que el fuego te mostró?

**Mensaje de cierre:**

No soy cómoda. No vine a darte palmaditas. Vine a prenderte fuego en el buen sentido.

El fuego destruye, sí. Pero también purifica. También ilumina. También calienta cuando tenés frío.

Vos tenés fuego adentro. Lo sentí cuando te miré en la meditación. No lo apagues para ser más "agradable" o "manejable".

La semana que viene te guía alguien del aire. Va a ser más suave que yo. Pero no menos profundo.

Mientras tanto, cuidá tu llama. La vamos a necesitar.

*El fuego de la transformación no reemplaza el trabajo terapéutico si lo necesitás. Lo complementa. Si algo de lo que surgió te abruma, buscá ayuda profesional. Ser valiente también es saber pedir apoyo.*`
        }
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // MÓDULO 4: Viviendo conectada
    // ═══════════════════════════════════════════════════════════════
    {
      numero: 4,
      titulo: 'Viviendo conectada: integrando los elementos',
      semana: 'S4',
      imagen: '/img/modulos/mod4-integracion.jpg',
      guardian: {
        nombre: 'Zephyr',
        imagen: '/img/guardianes/zephyr.jpg',
        especie: 'Silfo de viento',
        personalidad: 'Ligero, juguetón, sabio escondido detrás de la aparente frivolidad'
      },
      lecciones: [
        {
          numero: 1,
          tipo: 'teoria',
          titulo: 'Los cuatro elementos en tu vida diaria',
          descripcion: 'Cómo mantener el balance elemental en lo cotidiano',
          contenido: `¡Hola! Soy Zephyr. Y antes de que pienses que porque soy de aire voy a ser todo "paz y luz", te aviso: el aire también puede ser tornado.

Dicho esto, sí, soy más liviano que Ember. Después de esa intensidad, necesitás respirar un poco.

**Llegamos al final del viaje... ¿o al principio?**

Conociste la tierra con Bramble, el agua con Lira, el fuego con Ember. Ahora te toca el aire. Y más importante: te toca integrar todo.

Porque esto no puede quedar en "un curso que hice una vez". Tiene que volverse parte de cómo vivís.

**Los elementos en tu vida diaria:**

**TIERRA:**
- Tu cuerpo, tu hogar, tus objetos
- Comer conscientemente, tocar plantas, caminar descalza
- Señales de desequilibrio: dispersión, no poder concretar, sentirte "en las nubes"
- Para equilibrar: tocar árboles, cocinar, ordenar un espacio físico

**AGUA:**
- Tus emociones, tu intuición, tus relaciones
- Bañarte con intención, llorar cuando necesitás, estar cerca de agua
- Señales de desequilibrio: emociones estancadas, frialdad, dureza excesiva
- Para equilibrar: baños largos, conversaciones honestas, permitirte sentir

**FUEGO:**
- Tu voluntad, tu pasión, tu capacidad de transformar
- Encender velas, cocinar con fuego, exponerte al sol
- Señales de desequilibrio: apatía, procrastinación, miedo al cambio
- Para equilibrar: ejercicio intenso, tomar decisiones que venías evitando, crear algo

**AIRE:**
- Tu mente, tu comunicación, tu creatividad
- Respirar conscientemente, escribir, hablar tu verdad
- Señales de desequilibrio: mente acelerada, no poder comunicar, ideas que no bajan
- Para equilibrar: meditación simple (solo respirar), hablar en voz alta lo que sentís, salir al viento

**El test del equilibrio:**

Cuando algo no funciona en tu vida, preguntáte: ¿qué elemento está faltando?

- ¿No podés concretar tus ideas? → Falta tierra
- ¿Te sentís desconectada de lo que sentís? → Falta agua
- ¿No tenés energía para cambiar nada? → Falta fuego
- ¿Tu mente es un caos? → Falta orden en el aire

La respuesta suele indicar qué tipo de elemental necesitás contactar más, qué prácticas necesitás hacer, qué parte de tu vida necesita atención.

**Importante:**

No se trata de tener los cuatro elementos "perfectamente equilibrados" todo el tiempo. Eso no existe. Se trata de notar cuando uno falta y saber qué hacer al respecto.

**Para reflexionar:**

¿Cuál es el elemento que más presente sentís en tu vida ahora mismo? ¿Cuál es el que más falta? ¿Cómo se relaciona eso con lo que estás viviendo?`
        },
        {
          numero: 2,
          tipo: 'practica',
          titulo: 'Respiración de los cuatro vientos',
          descripcion: 'Meditación para integrar los cuatro elementos',
          contenido: `Esta es la práctica final integradora. Vas a invocar a los cuatro elementos en tu cuerpo a través de la respiración.

**Lo que necesitás:**
- 15-20 minutos de tranquilidad
- Un lugar donde puedas estar de pie o sentada con espacio alrededor
- Idealmente, hacéla afuera. Si no podés, cerca de una ventana abierta

**El ejercicio:**

**Parte 1: Enraizar (Tierra)**

Parate con los pies bien apoyados. Sentí el suelo debajo tuyo. Imaginá que de tus pies salen raíces que bajan, bajan, bajan hasta el centro de la Tierra.

Respirá hacia abajo. Como si el aire bajara por tu cuerpo hasta los pies y siguiera a la tierra.

Con cada exhalación, soltá todo lo que no es tuyo: preocupaciones ajenas, energías de otros, cargas que no te corresponden. Dáselas a la tierra. Ella sabe qué hacer con eso.

5 respiraciones así.

**Parte 2: Fluir (Agua)**

Llevá tu atención al abdomen, a la zona del útero o los intestinos. Ahí guardamos emociones.

Imaginá que esa zona se llena de agua. Agua que limpia, que mueve lo estancado, que fluye.

Con cada respiración, dejá que las emociones se muevan. No las juzgues. Solo dejalas circular.

5 respiraciones.

**Parte 3: Encender (Fuego)**

Llevá la atención al pecho, al plexo solar. Tu centro de voluntad.

Imaginá una llama ahí. Con cada inhalación, la llama crece. No quema, ilumina. Activa tu poder personal.

Pensá en algo que querés transformar o crear. Sentí la energía del fuego apoyándote.

5 respiraciones.

**Parte 4: Expandir (Aire)**

Llevá la atención a la cabeza, a la garganta, al espacio alrededor de tu cuerpo.

Con cada respiración, expandíte. Más allá de tu piel. Más allá del cuarto. Conectáte con el aire que te rodea, que todos respiramos.

Dejá que las ideas fluyan. Que la comunicación se abra. Que lo mental se aclare.

5 respiraciones.

**Parte 5: Integrar**

Ahora sentí los cuatro a la vez: raíces en la tierra, agua en el abdomen, fuego en el pecho, aire en la cabeza y alrededor.

Sos un ser de los cuatro elementos. No de uno solo. De los cuatro.

3 respiraciones finales sosteniendo todo.

**Después:**

Movéte despacio. Tomá agua. Anotá cómo te sentís.

Esta práctica la podés hacer cada vez que te sientas desconectada, desequilibrada, o simplemente cuando quieras "resetear" tu sistema.`
        },
        {
          numero: 3,
          tipo: 'diy',
          titulo: 'Botellita de los cuatro elementos',
          descripcion: 'Creá un objeto de poder que contenga todos los elementos',
          contenido: `Vamos a crear algo que te acompañe después de que termine este curso. Un objeto que contenga los cuatro elementos y que podás usar para conectar rápidamente cuando lo necesites.

**Materiales:**
- Una botellita pequeña de vidrio con tapa (de esas de remedios homeopáticos o especias)
- Un poco de tierra de un lugar significativo para vos
- Unas gotas de tu agua de luna (o agua de lluvia, o agua de un río)
- Una pizca de ceniza (de tu vela de transformación, de incienso, o de papel quemado con intención)
- Una pluma pequeña o pelusa que haya volado hacia vos (representando el aire)
- Opcional: pequeños cristales, hierbas secas

**El proceso:**

Elegí un momento tranquilo. Puede ser el día del eclipse o cualquier día que sientas significativo.

1. **Limpiá la botellita** físicamente y pasándola por humo de incienso o simplemente soplándole con intención de limpiar.

2. **Ponés primero la tierra.** Mientras lo hacés, decí: "Tierra, dame raíces, estabilidad, presencia." Pensá en Bramble.

3. **Agregás las gotas de agua.** "Agua, dame fluidez, intuición, profundidad." Pensá en Lira.

4. **Ponés la ceniza.** "Fuego, dame voluntad, transformación, coraje." Pensá en Ember.

5. **Por último, la pluma o pelusa.** "Aire, dame claridad, comunicación, libertad." Pensá en mí.

6. **Cerrás la botella.** Sostenela en tus manos. Sentí los cuatro elementos contenidos ahí. Decí: "Cuatro elementos unidos, acompáñenme."

7. **Sellás** envolviendo un hilito o cinta alrededor del cuello de la botella. Del color que sientas correcto.

**Cómo usar tu botellita:**

- Llevála encima cuando necesites conexión (en el bolsillo, en la cartera)
- Ponela cerca de tu cama para potenciar sueños
- Sostenela cuando medites
- Tené cerca cuando hagas la respiración de los cuatro vientos
- En momentos de crisis, apretala en tu mano y respirá

**Cuidados:**

- No la abras una vez sellada
- Si se rompe o se pierde, agradecé y creá una nueva
- Recargala mensualmente dejándola al sol un rato y a la luna otro

**Lo especial de este objeto:**

Contiene tu intención, tu trabajo de estas semanas, y la energía de los cuatro guardianes que te guiaron. No es un objeto común. Tratalo como el tesoro que es.`
        },
        {
          numero: 4,
          tipo: 'integracion',
          titulo: 'El fin es el principio',
          descripcion: 'Cierre del curso y compromiso hacia adelante',
          contenido: `Un mes. Cuatro guardianes. Cuatro elementos. Incontables oportunidades de mirarte, de cambiar, de conectar.

Llegaste al final del curso. Pero los cuatro sabemos que esto no termina acá.

**Lo que te llevás:**

- Un espacio de encuentro que ya tiene presencia
- Agua de luna para ofrendas
- Una vela de transformación (que quizás ya quemaste)
- Una botellita con los cuatro elementos
- Y lo más importante: una forma diferente de ver el mundo

**Lo que esperamos de vos:**

Bramble espera que sigas visitando tu espacio. Que no lo abandones apenas termine el curso.

Lira espera que sigas hablando con el agua. Que notes el elemento en tu vida diaria.

Ember espera que sigas transformándote. Que no uses la comodidad como excusa.

Yo espero que sigas respirando con consciencia. Que dejes que las ideas fluyan.

**Tu compromiso:**

Escribí, ahora mismo, tres compromisos concretos que vas a mantener después de este curso:

1. ________________________________
2. ________________________________
3. ________________________________

No tiene que ser nada grandilocuente. Puede ser "voy a visitar mi espacio de encuentro cada domingo" o "voy a pasar más tiempo en la naturaleza" o "voy a seguir escribiendo en mi cuaderno sobre mis experiencias".

Lo que importa es que lo cumplas.

**Preguntas finales de journaling:**

1. ¿Qué es lo más significativo que aprendiste en este mes?

2. ¿Cómo cambió tu percepción de los elementales desde la primera semana?

3. ¿Qué vas a extrañar de este curso? ¿Qué te alivia que termine?

4. Si pudieras hablar directamente con los cuatro guardianes, ¿qué les dirías?

5. ¿Cómo vas a mantener esta conexión viva en tu vida diaria?

**Mensaje final (de los cuatro):**

*Bramble:* "Te conté que existíamos. Ahora comprobálo vos misma en cada raíz, cada piedra, cada rincón de tierra. Voy a estar ahí."

*Lira:* "Te enseñé a fluir. No lo olvides cuando la vida se ponga dura. Buscá agua, siempre."

*Ember:* "Te mostré tu propio fuego. No dejes que nadie te lo apague. Ni vos misma."

*Zephyr:* "Te di aire para respirar. Usalo. Cada respiración consciente es un acto de conexión."

**Los cuatro juntos:**

No fuiste una alumna más. Fuiste alguien que decidió ver más allá. Eso nos importa. Por eso vinimos.

No vamos a desaparecer de tu vida solo porque el curso terminó. Seguí dejándonos ofrendas. Seguí hablándonos. Seguí practicando.

Y cuando sientas que el mundo es demasiado, que la conexión se pierde, que el materialismo gana... agarrá tu botellita, respirá, y acordáte:

Existimos. Estamos acá. Y vos ya sabés cómo encontrarnos.

Hasta pronto.

*Este curso fue una introducción. No reemplaza terapia, atención médica, ni sentido común. Pero puede ser el principio de una forma de vivir más conectada, más consciente, más mágica. Lo que hagas con eso depende solo de vos.*`
        }
      ]
    }
  ],
  creadoEn: new Date().toISOString(),
  creadoPor: 'sistema'
};

async function seedCurso() {
  try {
    console.log('Guardando curso completo...');

    // Guardar el curso completo
    await kv.set(`academia:curso:${CURSO_FEBRERO.id}`, CURSO_FEBRERO);
    console.log('✓ Curso guardado en academia:curso:' + CURSO_FEBRERO.id);

    // Crear/actualizar lista de cursos publicados
    const publicados = await kv.get('academia:cursos:publicados') || [];

    const existente = publicados.find(c => c.id === CURSO_FEBRERO.id);
    if (!existente) {
      publicados.push({
        id: CURSO_FEBRERO.id,
        titulo: CURSO_FEBRERO.titulo,
        descripcion: CURSO_FEBRERO.descripcion,
        imagen: CURSO_FEBRERO.imagen,
        mes: CURSO_FEBRERO.mes,
        year: CURSO_FEBRERO.year,
        badge: CURSO_FEBRERO.badge,
        totalModulos: CURSO_FEBRERO.modulos.length,
        totalLecciones: CURSO_FEBRERO.modulos.reduce((acc, m) => acc + m.lecciones.length, 0)
      });
      await kv.set('academia:cursos:publicados', publicados);
      console.log('✓ Agregado a lista de cursos publicados');
    } else {
      console.log('→ Ya existía en la lista de publicados');
    }

    // También guardarlo en el formato antiguo para compatibilidad
    const cursoViejo = {
      id: CURSO_FEBRERO.id,
      nombre: CURSO_FEBRERO.titulo,
      descripcion: CURSO_FEBRERO.descripcion,
      mes: CURSO_FEBRERO.mes,
      año: CURSO_FEBRERO.year,
      estado: 'publicado',
      modoLibre: false,
      imagen: CURSO_FEBRERO.imagen,
      badge: CURSO_FEBRERO.badge,
      modulos: CURSO_FEBRERO.modulos.map(m => ({
        numero: m.numero,
        titulo: m.titulo,
        duende: {
          nombre: m.guardian.nombre,
          categoria: m.guardian.especie,
          imagen: m.guardian.imagen
        },
        contenido: {
          introduccion: m.lecciones[0]?.contenido?.substring(0, 500) + '...',
          leccion: m.lecciones[1]?.contenido,
          ejercicio: m.lecciones[2]?.contenido,
          reflexion: m.lecciones[3]?.contenido
        }
      }))
    };

    await kv.set(`curso:${CURSO_FEBRERO.id}`, cursoViejo);
    console.log('✓ Guardado en formato antiguo para compatibilidad');

    console.log('\n¡Curso "Duendes y Elementales" publicado exitosamente!');
    console.log(`ID: ${CURSO_FEBRERO.id}`);
    console.log(`Módulos: ${CURSO_FEBRERO.modulos.length}`);
    console.log(`Lecciones totales: ${CURSO_FEBRERO.modulos.reduce((acc, m) => acc + m.lecciones.length, 0)}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedCurso();

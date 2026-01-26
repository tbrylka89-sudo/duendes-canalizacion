// ═══════════════════════════════════════════════════════════════════════════
// TEST DEL GUARDIAN v2.0 - EMBUDO DE NEUROVENTA COMPLETO
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_test_guardian_neon');

function duendes_test_guardian_neon() {
    if (strpos($_SERVER['REQUEST_URI'], 'descubri') === false) return;
    $ajax_url = admin_url('admin-ajax.php');
    ?>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>
    #tg-app{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#050508;z-index:2147483647;font-family:'Cormorant Garamond',Georgia,serif;overflow-y:auto}
    #tg-app *{box-sizing:border-box;margin:0;padding:0}

    /* FONDO CINEMATOGRÁFICO */
    .tg-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}
    .tg-orb{position:absolute;border-radius:50%;filter:blur(80px);animation:tgFloat 18s ease-in-out infinite}
    .tg-orb1{width:700px;height:700px;background:radial-gradient(circle,rgba(0,255,255,0.9) 0%,rgba(0,200,200,0.5) 40%,transparent 70%);top:-250px;left:-250px;opacity:0.7}
    .tg-orb2{width:650px;height:650px;background:radial-gradient(circle,rgba(200,100,255,0.9) 0%,rgba(150,50,200,0.5) 40%,transparent 70%);bottom:-200px;right:-250px;animation-delay:-6s;opacity:0.7}
    .tg-orb3{width:500px;height:500px;background:radial-gradient(circle,rgba(255,200,50,0.9) 0%,rgba(212,175,55,0.5) 40%,transparent 70%);top:30%;left:50%;animation-delay:-12s;opacity:0.6}
    @keyframes tgFloat{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(60px,-70px) scale(1.2)}50%{transform:translate(-50px,60px) scale(0.85)}75%{transform:translate(70px,40px) scale(1.15)}}

    .tg-particles{position:absolute;inset:0;overflow:hidden}
    .tg-particle{position:absolute;width:2px;height:2px;background:rgba(212,175,55,0.6);border-radius:50%;animation:tgParticle 20s linear infinite}
    @keyframes tgParticle{0%{transform:translateY(100vh) scale(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-100vh) scale(1);opacity:0}}

    .tg-content{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px}
    .tg-screen{display:none;width:100%;max-width:700px;text-align:center}
    .tg-screen.active{display:flex;flex-direction:column;align-items:center}

    /* TIPOGRAFÍA */
    #tg-app .tg-title{font-family:'Cinzel',serif !important;color:#f5e6a3 !important;font-size:2.2rem !important;font-weight:700 !important;margin-bottom:20px !important;letter-spacing:3px !important;text-shadow:0 0 60px rgba(212,175,55,0.8),0 2px 4px rgba(0,0,0,0.8) !important;text-transform:uppercase !important}
    #tg-app .tg-sub{color:rgba(255,255,255,0.8) !important;font-size:1.2rem !important;margin-bottom:30px;font-style:italic;letter-spacing:1px}

    /* BOTONES */
    #tg-app .tg-btn{background:transparent !important;border:2px solid #d4af37 !important;color:#f5e6a3 !important;padding:18px 50px;font-family:'Cinzel',serif !important;font-size:1rem;font-weight:600;letter-spacing:2px;cursor:pointer;margin-top:30px;transition:all 0.4s ease;text-transform:uppercase;box-shadow:0 0 25px rgba(212,175,55,0.4)}
    #tg-app .tg-btn:hover{background:rgba(212,175,55,0.15) !important;box-shadow:0 0 50px rgba(212,175,55,0.6)}
    #tg-app .tg-skip{background:transparent !important;border:1px solid rgba(212,175,55,0.4) !important;color:#d4af37 !important;padding:12px 30px;font-family:'Cinzel',serif !important;font-size:0.85rem;cursor:pointer;margin-top:40px;transition:all 0.3s}

    /* RUNAS */
    .tg-runas{position:fixed;top:20px;left:50%;transform:translateX(-50%);display:flex;gap:12px;z-index:100}
    .tg-runa{width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,0.6);border:2px solid rgba(212,175,55,0.3);display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0);transition:all 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)}
    .tg-runa.visible{opacity:1;transform:scale(1)}
    .tg-runa svg{width:20px;height:20px;stroke:#d4af37;fill:none}
    .tg-runa.glow{animation:tgRunaGlow 2s ease-in-out infinite}
    @keyframes tgRunaGlow{0%,100%{box-shadow:0 0 10px rgba(212,175,55,0.3)}50%{box-shadow:0 0 25px rgba(212,175,55,0.7)}}

    /* PREGUNTAS */
    .tg-pregunta{text-align:center;margin-bottom:50px;min-height:100px}
    .tg-pregunta-num{color:rgba(212,175,55,0.5);font-family:'Cinzel',serif;font-size:0.8rem;letter-spacing:4px;margin-bottom:15px}
    .tg-pregunta-texto{color:#fff;font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-style:italic;line-height:1.5;max-width:600px;margin:0 auto}
    .tg-letra{display:inline-block;opacity:0;animation:tgLetraIn 0.4s ease forwards}
    @keyframes tgLetraIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

    /* BURBUJAS */
    .tg-burbujas{display:flex;flex-direction:column;align-items:center;gap:12px;max-width:500px;margin:0 auto}
    .tg-burbuja{background:#1a1a1a;border:none;color:#fff;padding:16px 28px;border-radius:20px;cursor:pointer;font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:500;opacity:0;transform:translateY(100px);transition:all 0.25s ease;box-shadow:0 6px 20px rgba(0,0,0,0.5);min-width:200px;text-align:center}
    .tg-burbuja.aparece{animation:tgBurbujaAparece 0.7s cubic-bezier(0.16,1,0.3,1) forwards}
    @keyframes tgBurbujaAparece{0%{opacity:0;transform:translateY(100px)}100%{opacity:1;transform:translateY(0)}}
    .tg-burbuja:hover{background:#252525;transform:scale(1.03)}
    .tg-burbuja.pop{animation:tgBurbujaPop 0.4s ease forwards}
    @keyframes tgBurbujaPop{0%{transform:scale(1)}30%{transform:scale(1.15)}100%{transform:scale(0);opacity:0}}

    /* FORMULARIO MÁGICO */
    .tg-form-magico{width:100%;max-width:450px;margin:0 auto}
    .tg-campo-magico{margin-bottom:35px;text-align:left}
    .tg-campo-magico label{display:block;color:#d4af37;font-family:'Cinzel',serif;font-size:0.9rem;letter-spacing:2px;margin-bottom:10px;text-transform:uppercase}
    .tg-campo-magico input{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(212,175,55,0.3);border-radius:8px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:1.2rem;padding:15px 20px;outline:none;transition:all 0.3s}
    .tg-campo-magico input:focus{border-color:#d4af37;box-shadow:0 0 20px rgba(212,175,55,0.2)}
    .tg-campo-magico .microcopy{color:rgba(255,255,255,0.5);font-size:0.9rem;font-style:italic;margin-top:8px;padding-left:5px}
    .tg-campo-magico input::placeholder{color:rgba(255,255,255,0.3)}
    .tg-row{display:flex;gap:20px}
    .tg-row .tg-campo-magico{flex:1}

    /* TEXTO LIBRE */
    .tg-texto-libre{width:100%;max-width:500px;margin:0 auto}
    .tg-texto-input{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(212,175,55,0.4);color:#fff;font-family:'Cormorant Garamond',serif;font-size:1.3rem;padding:15px 5px;text-align:center;outline:none}
    .tg-texto-input:focus{border-color:#d4af37}
    .tg-texto-input::placeholder{color:rgba(255,255,255,0.3)}

    /* ═══════════════════════════════════════════════════════════════════════
       RESULTADO CINEMATOGRÁFICO
       ═══════════════════════════════════════════════════════════════════════ */
    .tg-revelacion{text-align:center;padding:20px 0}
    .tg-impacto{font-family:'Cinzel',serif;color:#d4af37;font-size:1.8rem;font-weight:600;margin-bottom:25px;text-shadow:0 0 40px rgba(212,175,55,0.5)}
    .tg-espejo{background:rgba(255,255,255,0.03);border-radius:12px;padding:25px 30px;margin:25px 0;border:1px solid rgba(255,255,255,0.05)}
    .tg-espejo p{color:rgba(255,255,255,0.85);font-size:1.1rem;line-height:1.8;font-style:italic}
    .tg-espejo .dolor{color:#e75480}
    .tg-espejo .deseo{color:#56ab91}
    .tg-destino{color:rgba(212,175,55,0.9);font-family:'Cinzel',serif;font-size:1rem;letter-spacing:2px;margin:30px 0}

    /* DUENDE PRINCIPAL */
    .tg-duende-principal{background:linear-gradient(180deg,rgba(212,175,55,0.08) 0%,transparent 100%);border:2px solid rgba(212,175,55,0.4);border-radius:20px;padding:30px;margin:30px 0;max-width:400px}
    .tg-duende-principal img{width:100%;max-width:300px;height:300px;object-fit:cover;border-radius:15px;margin-bottom:20px;border:3px solid rgba(212,175,55,0.3)}
    .tg-duende-principal h3{font-family:'Cinzel',serif;color:#fff;font-size:1.4rem;margin-bottom:10px}
    .tg-duende-principal .precio{color:#d4af37;font-family:'Cinzel',serif;font-size:1.3rem;font-weight:600;margin:10px 0}
    .tg-duende-principal .historia{color:rgba(255,255,255,0.7);font-size:1rem;line-height:1.6;margin:15px 0}
    .tg-duende-principal .escasez{color:rgba(255,200,100,0.9);font-size:0.9rem;font-style:italic;margin:15px 0}
    .tg-duende-principal .cta-pacto{display:block;background:linear-gradient(135deg,#d4af37,#b8962e);color:#0a0a0a;padding:18px 30px;border-radius:10px;text-decoration:none;font-family:'Cinzel',serif;font-size:1rem;font-weight:700;letter-spacing:1px;margin-top:20px;transition:all 0.3s}
    .tg-duende-principal .cta-pacto:hover{box-shadow:0 10px 40px rgba(212,175,55,0.4);transform:translateY(-3px)}

    /* ALTERNATIVAS */
    .tg-alternativas{margin:40px 0}
    .tg-alternativas h4{color:rgba(255,255,255,0.6);font-family:'Cinzel',serif;font-size:0.85rem;letter-spacing:3px;margin-bottom:25px;text-transform:uppercase}
    .tg-alt-grid{display:flex;gap:20px;justify-content:center;flex-wrap:wrap}
    .tg-alt-card{width:180px;background:#0d0d0d;border:1px solid rgba(212,175,55,0.25);border-radius:12px;overflow:hidden;text-decoration:none;transition:all 0.3s}
    .tg-alt-card:hover{border-color:rgba(212,175,55,0.6);transform:translateY(-5px)}
    .tg-alt-card img{width:100%;height:180px;object-fit:cover}
    .tg-alt-card .info{padding:15px}
    .tg-alt-card h5{color:#fff;font-family:'Cinzel',serif;font-size:0.9rem;margin-bottom:5px}
    .tg-alt-card .precio{color:#d4af37;font-size:0.95rem;font-weight:600}

    /* RITUAL */
    .tg-ritual-box{background:linear-gradient(135deg,rgba(150,100,200,0.1) 0%,rgba(100,50,150,0.05) 100%);border:1px solid rgba(150,100,200,0.3);border-radius:15px;padding:30px;margin:30px 0;max-width:500px}
    .tg-ritual-box h4{color:rgba(180,140,220,1);font-family:'Cinzel',serif;font-size:1.1rem;margin-bottom:15px;display:flex;align-items:center;justify-content:center;gap:10px}
    .tg-ritual-box p{color:rgba(255,255,255,0.85);font-size:1.05rem;line-height:1.8}
    .tg-ritual-box .nombre-duende{color:#d4af37;font-weight:600}

    /* BOTÓN MÚSICA */
    .tg-music-btn{position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:transparent;border:1px solid rgba(212,175,55,0.4);border-radius:50%;cursor:pointer;display:none;z-index:10}
    .tg-music-btn svg{width:20px;height:20px;stroke:#d4af37;fill:none}
    .tg-music-btn.visible{display:flex;align-items:center;justify-content:center}

    .tg-restart{background:none;border:none;color:rgba(255,255,255,0.4);font-family:'Cormorant Garamond',serif;font-size:1rem;cursor:pointer;margin-top:30px}

    /* LOADING */
    .tg-loading{display:flex;flex-direction:column;align-items:center;gap:20px}
    .tg-loading-spinner{width:60px;height:60px;border:3px solid rgba(212,175,55,0.2);border-top-color:#d4af37;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .tg-loading p{color:rgba(255,255,255,0.7);font-style:italic}

    @media(max-width:600px){
        #tg-app .tg-title{font-size:1.5rem !important}
        .tg-pregunta-texto{font-size:1.4rem}
        .tg-duende-principal{padding:20px}
        .tg-alt-grid{flex-direction:column;align-items:center}
    }
    </style>

    <div id="tg-app">
        <div class="tg-bg">
            <div class="tg-orb tg-orb1"></div>
            <div class="tg-orb tg-orb2"></div>
            <div class="tg-orb tg-orb3"></div>
            <div class="tg-particles" id="tg-particles"></div>
        </div>
        <div class="tg-content">
            <!-- PANTALLA MÚSICA -->
            <div class="tg-screen active" id="tg-music">
                <p class="tg-sub">EXPERIENCIA INMERSIVA</p>
                <p style="color:rgba(212,175,55,0.7);font-size:1rem;margin-bottom:20px">Tocá el símbolo para activar el sonido</p>
                <div class="tg-activator" onclick="TG.activarMusica()" style="width:180px;height:180px;margin:40px auto;position:relative;cursor:pointer">
                    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
                        <svg viewBox="0 0 64 64" style="width:50px;height:50px;stroke:#d4af37;fill:none;stroke-width:1.5">
                            <circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="8" opacity="0.6"/>
                        </svg>
                    </div>
                </div>
                <button class="tg-skip" onclick="TG.saltarMusica()">Continuar en silencio</button>
            </div>

            <!-- PANTALLA INTRO -->
            <div class="tg-screen" id="tg-intro">
                <h1 class="tg-title">El Test del Guardián</h1>
                <p class="tg-sub">Descubrí qué energía necesita tu alma</p>
                <p style="color:rgba(255,255,255,0.6);margin:20px 0;line-height:1.7">Soy <strong style="color:#d4af37">Tito</strong>, el guardián de los portales.<br>Voy a guiarte en este viaje.</p>
                <button class="tg-btn" onclick="TG.iniciar()">COMENZAR</button>
                <p style="color:rgba(255,255,255,0.4);margin-top:20px;font-size:0.9rem">3 minutos · Resultado personalizado</p>
            </div>

            <!-- RUNAS -->
            <div class="tg-runas" id="tg-runas"></div>

            <!-- PANTALLA PREGUNTAS -->
            <div class="tg-screen" id="tg-preguntas">
                <div class="tg-pregunta">
                    <div class="tg-pregunta-num" id="tg-pregunta-num"></div>
                    <div class="tg-pregunta-texto" id="tg-pregunta-texto"></div>
                </div>
                <div class="tg-burbujas" id="tg-burbujas"></div>
                <div class="tg-texto-libre" id="tg-texto-libre" style="display:none">
                    <input type="text" class="tg-texto-input" id="tg-texto-input" placeholder="Escribí acá...">
                    <button class="tg-btn" onclick="TG.enviarTexto()" style="margin-top:30px">CONTINUAR</button>
                </div>
            </div>

            <!-- PANTALLA DATOS MÁGICOS -->
            <div class="tg-screen" id="tg-datos">
                <h2 class="tg-title" style="font-size:1.6rem !important">Un último paso...</h2>
                <p class="tg-sub">Para que tu guardián pueda encontrarte</p>
                <div class="tg-form-magico">
                    <div class="tg-campo-magico">
                        <label>Tu nombre</label>
                        <input type="text" id="tg-nombre" placeholder="Como te llaman...">
                        <p class="microcopy">Tu nombre es tu vibración. El guardián lo usará para conectar.</p>
                    </div>
                    <div class="tg-campo-magico">
                        <label>Fecha de nacimiento</label>
                        <input type="date" id="tg-nacimiento">
                        <p class="microcopy">Tu fecha es la llave del portal. Revela tu número de vida.</p>
                    </div>
                    <div class="tg-campo-magico">
                        <label>Email</label>
                        <input type="email" id="tg-email" placeholder="tu@email.com">
                        <p class="microcopy">Para enviarte tu revelación completa.</p>
                    </div>
                    <div class="tg-campo-magico">
                        <label>WhatsApp (opcional)</label>
                        <input type="tel" id="tg-celular" placeholder="+54 9 11...">
                        <p class="microcopy">Si querés recibir mensajes de tu guardián.</p>
                    </div>
                    <button class="tg-btn" onclick="TG.procesarResultado()">REVELAR MI GUARDIÁN</button>
                </div>
            </div>

            <!-- PANTALLA LOADING -->
            <div class="tg-screen" id="tg-loading">
                <div class="tg-loading">
                    <div class="tg-loading-spinner"></div>
                    <p>Consultando los portales...</p>
                    <p style="color:#d4af37">Tu guardián está siendo revelado</p>
                </div>
            </div>

            <!-- PANTALLA RESULTADO -->
            <div class="tg-screen" id="tg-result">
                <div class="tg-revelacion">
                    <h2 class="tg-impacto" id="tg-r-impacto"></h2>

                    <div class="tg-espejo" id="tg-r-espejo"></div>

                    <p class="tg-destino">No llegaste acá por casualidad. El universo te trajo.</p>

                    <!-- DUENDE PRINCIPAL -->
                    <div class="tg-duende-principal" id="tg-r-duende"></div>

                    <!-- RITUAL -->
                    <div class="tg-ritual-box" id="tg-r-ritual"></div>

                    <!-- ALTERNATIVAS -->
                    <div class="tg-alternativas">
                        <h4>También resuenan con vos</h4>
                        <div class="tg-alt-grid" id="tg-r-alternativas"></div>
                    </div>

                    <button class="tg-restart" onclick="TG.reiniciar()">Hacer el test de nuevo</button>
                </div>
            </div>
        </div>
        <button class="tg-music-btn" id="tg-music-btn" onclick="TG.toggleMusica()">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </button>
    </div>

    <audio id="tg-audio1" loop src="https://duendesuy.10web.cloud/wp-content/uploads/2025/12/Canal-de-Duendes-1.wav"></audio>
    <audio id="tg-audio2" loop src="https://duendesuy.10web.cloud/wp-content/uploads/2026/01/ES_Words-of-an-Angel-Kikoru.mp3"></audio>

    <script>
    var TG = {
        ajaxUrl: '<?php echo $ajax_url; ?>',
        audio: null,
        playing: false,
        pregunta: 0,
        esRegalo: false,
        respuestas: {},
        datos: {},
        productosReales: [],

        preguntas: [
            {id:0,tipo:'sel',msg:'¿Este guardián es para vos o para alguien especial?',opts:[
                {id:'propio',txt:'Es para mí'},
                {id:'regalo',txt:'Es un regalo'}
            ]},
            {id:1,tipo:'sel',msg:'¿Qué te trajo hasta acá hoy?',opts:[
                {id:'prot',txt:'Necesito sentirme protegida',arq:'victima',cat:'proteccion'},
                {id:'resp',txt:'Busco respuestas sobre mi vida',arq:'buscadora',cat:'sanacion'},
                {id:'cicl',txt:'Quiero romper patrones',arq:'repite',cat:'sanacion'},
                {id:'sana',txt:'Estoy sanando heridas',arq:'sanadora',cat:'sanacion'},
                {id:'amor',txt:'Quiero más amor en mi vida',arq:'busca_amor',cat:'amor'}
            ]},
            {id:2,tipo:'sel',msg:'¿Qué sentís cuando estás sola de noche?',opts:[
                {id:'pres',txt:'Una presencia que me cuida',elem:'tierra'},
                {id:'pens',txt:'Pensamientos que no paran',elem:'aire'},
                {id:'emoc',txt:'Emociones profundas que suben',elem:'agua'},
                {id:'ener',txt:'Energía inquieta, ganas de hacer',elem:'fuego'}
            ]},
            {id:3,tipo:'txt',msg:'¿Qué es lo que MÁS te duele en este momento de tu vida?',ph:'Escribí lo que sientas... no hay respuesta incorrecta'},
            {id:4,tipo:'txt',msg:'Si pudieras pedirle algo al universo, algo que cambiaría todo... ¿qué sería?',ph:'Tu deseo más profundo...'}
        ],

        arquetipos: {
            victima:{nom:'Alma en Busca de Refugio',msg:'Sentís que la vida te pone a prueba constantemente. No es debilidad buscar protección, es sabiduría.'},
            buscadora:{nom:'Eterna Buscadora',msg:'Probaste de todo. Leíste, meditaste, buscaste en mil lugares. Lo que buscás no está afuera.'},
            repite:{nom:'Rompedora de Ciclos',msg:'Los mismos errores, las mismas decepciones. No es mala suerte, es un mensaje que no terminaste de escuchar.'},
            sanadora:{nom:'Sanadora en Despertar',msg:'Curaste a tantos que olvidaste curarte a vos misma. Sos la fuerte, la que nunca puede caerse.'},
            busca_amor:{nom:'Corazón Abierto',msg:'Diste tanto amor que te quedaste vacía. El amor que buscás empieza cuando te mirás al espejo y te quedás.'}
        },

        elementos: {tierra:'Tierra',agua:'Agua',fuego:'Fuego',aire:'Aire'},

        rituales: {
            tierra: {
                proteccion: 'Tomá un puñado de tierra o sal gruesa. Cerrá los ojos, sostenela en tu mano izquierda, y decí: "{duende}, te pido que ancles mi energía y protejas mi espacio". Dejá la sal en la entrada de tu casa.',
                sanacion: 'Sentate con los pies descalzos en el piso. Poné una mano en tu corazón y la otra en el suelo. Respirá profundo y decí: "{duende}, ayudame a soltar lo que ya no sirve". Quedate así 3 minutos.',
                amor: 'Escribí en un papel lo que querés atraer. Enterralo en una maceta o en tierra, mientras decís: "{duende}, plantá en mi vida el amor que merezco".',
                abundancia: 'Juntá 7 monedas y ponelas en un plato. Pasá tus manos sobre ellas y decí: "{duende}, multiplicá lo que doy y lo que recibo". Dejá el plato cerca de la entrada.'
            },
            agua: {
                proteccion: 'Llená un vaso con agua. Sostenelo frente a vos y decí: "{duende}, limpiá todo lo que no me pertenece". Tirá el agua en el inodoro visualizando que se va lo pesado.',
                sanacion: 'La próxima vez que te bañes, antes de mojarte, decí: "{duende}, que el agua limpie mi cuerpo y mi alma". Visualizá que cada gota se lleva un dolor.',
                amor: 'Llená un recipiente con agua y agregá pétalos de rosa. Tocá el agua y decí: "{duende}, abrí el flujo del amor hacia mí". Usá esa agua para lavarte las manos durante 3 días.',
                abundancia: 'Poné un vaso con agua y una moneda adentro. Decí: "{duende}, que la abundancia fluya hacia mí como el agua". Dejalo toda la noche a la luz de la luna.'
            },
            fuego: {
                proteccion: 'Encendé una vela blanca. Mirá la llama y decí: "{duende}, quemá todo lo que me hace daño, visible e invisible". Dejá que la vela se consuma.',
                sanacion: 'Escribí en un papel lo que te duele. Encendé una vela y quemá el papel mientras decís: "{duende}, transformá mi dolor en fuerza". Dejá que las cenizas se las lleve el viento.',
                amor: 'Encendé una vela rosa o roja. Decí mirando la llama: "{duende}, encendé la pasión que merezco y el amor que busco". Dejá que arda 10 minutos mientras pensás en lo que querés.',
                abundancia: 'Encendé una vela dorada o amarilla. Escribí un número que represente tu meta. Poné el papel bajo la vela y decí: "{duende}, activa el fuego de mi prosperidad".'
            },
            aire: {
                proteccion: 'Abrí una ventana. Parate frente a ella, cerrá los ojos, y decí: "{duende}, que el viento se lleve todo lo que no me deja avanzar". Respirá profundo 7 veces.',
                sanacion: 'Salí al aire libre. Cerrá los ojos, levantá los brazos, y decí: "{duende}, llevate mis pensamientos pesados". Con cada exhalación, soltá un pensamiento que te atormenta.',
                amor: 'Escribí tu deseo de amor en un papel pequeño. Doblalo y llevalo contigo. Cuando sople el viento, sostenelo y decí: "{duende}, llevá mi mensaje al universo".',
                abundancia: 'Abrí las ventanas de tu casa. Caminá por cada habitación diciendo: "{duende}, que el aire renueve mi energía y traiga prosperidad". Dejá las ventanas abiertas 15 minutos.'
            }
        },

        runaSvgs: {
            proteccion: '<svg viewBox="0 0 24 24"><path d="M12 2L20 6v6c0 5.5-3.8 10-8 11-4.2-1-8-5.5-8-11V6l8-4z"/></svg>',
            amor: '<svg viewBox="0 0 24 24"><path d="M12 21s-8-6-8-11.5c0-3.1 2.4-5.5 5.5-5.5 1.7 0 3.4 1 4.5 2.5 1.1-1.5 2.8-2.5 4.5-2.5 3.1 0 5.5 2.4 5.5 5.5 0 5.5-8 11.5-8 11.5z"/></svg>',
            sanacion: '<svg viewBox="0 0 24 24"><path d="M12 2C8 6 4 12 8 18c2 3 6 4 8 0 4-6 0-12-4-16"/></svg>',
            tierra: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
            agua: '<svg viewBox="0 0 24 24"><path d="M12 2C8 8 4 14 12 22c8-8 4-14 0-20"/></svg>',
            fuego: '<svg viewBox="0 0 24 24"><path d="M12 2c-4 6 0 10 0 14 0 3 3 6 6 4-2-2-2-6 2-10-4 2-6-2-4-6-2 0-4 4-4 8"/></svg>',
            aire: '<svg viewBox="0 0 24 24"><path d="M4 8h12c2 0 4-2 2-4M4 12h16M4 16h10c2 0 3 2 1 4"/></svg>',
            default: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>'
        },

        calcularNumeroVida: function(fechaNac) {
            if (!fechaNac) return 9;
            var nums = fechaNac.replace(/-/g, '');
            var sum = 0;
            for (var i = 0; i < nums.length; i++) {
                sum += parseInt(nums[i]);
            }
            while (sum > 9 && sum !== 11 && sum !== 22) {
                var temp = 0;
                while (sum > 0) {
                    temp += sum % 10;
                    sum = Math.floor(sum / 10);
                }
                sum = temp;
            }
            return sum;
        },

        crearParticulas: function() {
            var container = document.getElementById('tg-particles');
            if (!container || container.children.length > 0) return;
            for (var i = 0; i < 25; i++) {
                var p = document.createElement('div');
                p.className = 'tg-particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDelay = Math.random() * 20 + 's';
                container.appendChild(p);
            }
        },

        show: function(id) {
            document.querySelectorAll('.tg-screen').forEach(function(s){s.classList.remove('active')});
            document.getElementById(id).classList.add('active');
        },

        activarMusica: function() {
            TG.crearParticulas();
            TG.audio = document.getElementById(Math.random()>0.5?'tg-audio1':'tg-audio2');
            TG.audio.volume = 0.4;
            TG.audio.play().then(function(){
                TG.playing = true;
                document.getElementById('tg-music-btn').classList.add('visible');
                TG.show('tg-intro');
            }).catch(function(){ TG.show('tg-intro'); });
        },

        saltarMusica: function() {
            TG.crearParticulas();
            TG.show('tg-intro');
        },

        toggleMusica: function() {
            if (!TG.audio) return;
            if (TG.playing) { TG.audio.pause(); TG.playing = false; }
            else { TG.audio.play(); TG.playing = true; }
        },

        iniciar: function() {
            TG.pregunta = 0;
            TG.respuestas = {};
            document.getElementById('tg-runas').innerHTML = '';
            TG.show('tg-preguntas');
            TG.mostrarPregunta();
        },

        animarTexto: function(texto, callback) {
            var container = document.getElementById('tg-pregunta-texto');
            container.innerHTML = '';
            var palabras = texto.split(' ');
            var delay = 0;
            palabras.forEach(function(palabra) {
                var span = document.createElement('span');
                span.style.display = 'inline-block';
                span.style.marginRight = '0.3em';
                palabra.split('').forEach(function(letra) {
                    var letraSpan = document.createElement('span');
                    letraSpan.className = 'tg-letra';
                    letraSpan.textContent = letra;
                    letraSpan.style.animationDelay = delay + 's';
                    span.appendChild(letraSpan);
                    delay += 0.025;
                });
                container.appendChild(span);
            });
            if (callback) setTimeout(callback, delay * 1000 + 200);
        },

        mostrarPregunta: function() {
            var p = TG.preguntas[TG.pregunta];
            document.getElementById('tg-pregunta-num').textContent = (TG.pregunta + 1) + ' / ' + TG.preguntas.length;

            var burbujas = document.getElementById('tg-burbujas');
            var textoLibre = document.getElementById('tg-texto-libre');
            burbujas.innerHTML = '';
            burbujas.style.display = 'none';
            textoLibre.style.display = 'none';

            TG.animarTexto(p.msg, function() {
                if (p.tipo === 'sel') {
                    burbujas.style.display = 'flex';
                    p.opts.forEach(function(o, i) {
                        var btn = document.createElement('button');
                        btn.className = 'tg-burbuja';
                        btn.textContent = o.txt;
                        btn.onclick = function() { TG.seleccionar(o, btn); };
                        burbujas.appendChild(btn);
                        setTimeout(function() { btn.classList.add('aparece'); }, i * 300);
                    });
                } else {
                    textoLibre.style.display = 'block';
                    var input = document.getElementById('tg-texto-input');
                    input.value = '';
                    input.placeholder = p.ph || 'Escribí acá...';
                    setTimeout(function() { input.focus(); }, 300);
                }
            });
        },

        agregarRuna: function(tipo) {
            var runas = document.getElementById('tg-runas');
            var runa = document.createElement('div');
            runa.className = 'tg-runa';
            runa.innerHTML = TG.runaSvgs[tipo] || TG.runaSvgs.default;
            runas.appendChild(runa);
            setTimeout(function() { runa.classList.add('visible', 'glow'); }, 100);
        },

        seleccionar: function(opt, btn) {
            var p = TG.preguntas[TG.pregunta];
            TG.respuestas[p.id] = opt;

            btn.classList.add('pop');
            document.querySelectorAll('.tg-burbuja').forEach(function(b) {
                if (b !== btn) b.style.opacity = '0';
            });

            var tipoRuna = opt.cat || opt.elem || 'default';
            TG.agregarRuna(tipoRuna);

            setTimeout(function() {
                TG.pregunta++;
                if (TG.pregunta < TG.preguntas.length) {
                    TG.mostrarPregunta();
                } else {
                    TG.show('tg-datos');
                }
            }, 500);
        },

        enviarTexto: function() {
            var input = document.getElementById('tg-texto-input');
            var txt = input.value.trim();
            if (!txt) return;

            var p = TG.preguntas[TG.pregunta];
            TG.respuestas[p.id] = {txt: txt};
            TG.agregarRuna('default');

            TG.pregunta++;
            if (TG.pregunta < TG.preguntas.length) {
                TG.mostrarPregunta();
            } else {
                TG.show('tg-datos');
            }
        },

        procesarResultado: function() {
            var nombre = document.getElementById('tg-nombre').value.trim();
            var email = document.getElementById('tg-email').value.trim();

            if (!nombre) {
                alert('Por favor ingresá tu nombre');
                return;
            }

            TG.datos = {
                nombre: nombre,
                nacimiento: document.getElementById('tg-nacimiento').value,
                email: email,
                celular: document.getElementById('tg-celular').value
            };

            TG.show('tg-loading');
            TG.cargarProductosYMostrar();
        },

        cargarProductosYMostrar: function() {
            // Determinar categoría
            var cat = 'sanacion';
            for (var k in TG.respuestas) {
                if (TG.respuestas[k].cat) cat = TG.respuestas[k].cat;
            }

            // Cargar productos reales via AJAX
            var formData = new FormData();
            formData.append('action', 'duendes_get_productos');
            formData.append('categoria', cat);
            formData.append('limite', 3);

            fetch(TG.ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.data.length > 0) {
                    TG.productosReales = data.data;
                } else {
                    // Fallback: intentar sin categoría
                    var fd2 = new FormData();
                    fd2.append('action', 'duendes_get_productos');
                    fd2.append('limite', 3);
                    return fetch(TG.ajaxUrl, {method:'POST', body:fd2}).then(function(r){return r.json();});
                }
            })
            .then(function(data) {
                if (data && data.success) TG.productosReales = data.data;
                TG.mostrarResultado();
            })
            .catch(function(e) {
                console.error('Error cargando productos:', e);
                TG.mostrarResultado();
            });
        },

        mostrarResultado: function() {
            // Calcular arquetipo y elemento
            var arq = 'buscadora', elem = 'agua', cat = 'sanacion';
            for (var k in TG.respuestas) {
                var r = TG.respuestas[k];
                if (r.arq) arq = r.arq;
                if (r.elem) elem = r.elem;
                if (r.cat) cat = r.cat;
            }

            var nombre = TG.datos.nombre.split(' ')[0]; // Solo primer nombre
            var numeroVida = TG.calcularNumeroVida(TG.datos.nacimiento);
            var dolor = TG.respuestas[3] ? TG.respuestas[3].txt : '';
            var deseo = TG.respuestas[4] ? TG.respuestas[4].txt : '';

            // IMPACTO
            document.getElementById('tg-r-impacto').textContent = nombre + ', tu guardián te encontró';

            // ESPEJO (dolor + deseo)
            var espejoHtml = '<p>';
            if (dolor) {
                espejoHtml += 'Dijiste que lo que más te duele es: <span class="dolor">"' + dolor + '"</span><br><br>';
            }
            if (deseo) {
                espejoHtml += 'Y que si pudieras pedir un deseo, pedirías: <span class="deseo">"' + deseo + '"</span>';
            }
            espejoHtml += '</p>';
            document.getElementById('tg-r-espejo').innerHTML = espejoHtml;

            // DUENDE PRINCIPAL
            var duendePrincipal = TG.productosReales[0];
            var duendeHtml = '';
            if (duendePrincipal) {
                duendeHtml = '<img src="' + duendePrincipal.imagen + '" alt="' + duendePrincipal.nombre + '">' +
                    '<h3>' + duendePrincipal.nombre + '</h3>' +
                    '<p class="precio">' + duendePrincipal.precio + '</p>' +
                    '<p class="historia">' + (duendePrincipal.descripcion || TG.arquetipos[arq].msg) + '</p>' +
                    '<p class="escasez">Pieza única. Si se adopta, no vuelve.</p>' +
                    '<a href="' + duendePrincipal.url + '" class="cta-pacto">Sellar mi pacto con ' + duendePrincipal.nombre.split(' ')[0] + '</a>';
            } else {
                duendeHtml = '<h3>' + TG.arquetipos[arq].nom + '</h3>' +
                    '<p class="historia">' + TG.arquetipos[arq].msg + '</p>' +
                    '<a href="/shop/" class="cta-pacto">Ver guardianes disponibles</a>';
            }
            document.getElementById('tg-r-duende').innerHTML = duendeHtml;

            // RITUAL PERSONALIZADO
            var nombreDuende = duendePrincipal ? duendePrincipal.nombre : 'tu guardián';
            var ritualBase = TG.rituales[elem] && TG.rituales[elem][cat] ? TG.rituales[elem][cat] : TG.rituales.agua.sanacion;
            var ritualPersonalizado = ritualBase.replace(/{duende}/g, nombreDuende);

            var ritualHtml = '<h4><svg style="width:20px;height:20px" viewBox="0 0 24 24" fill="none" stroke="#b48cdc" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg> Tu Ritual con ' + nombreDuende.split(' ')[0] + '</h4>' +
                '<p>' + ritualPersonalizado + '</p>';
            document.getElementById('tg-r-ritual').innerHTML = ritualHtml;

            // ALTERNATIVAS
            var altHtml = '';
            for (var i = 1; i < TG.productosReales.length; i++) {
                var alt = TG.productosReales[i];
                altHtml += '<a href="' + alt.url + '" class="tg-alt-card">' +
                    '<img src="' + alt.imagen + '" alt="' + alt.nombre + '">' +
                    '<div class="info">' +
                        '<h5>' + alt.nombre + '</h5>' +
                        '<span class="precio">' + alt.precio + '</span>' +
                    '</div>' +
                '</a>';
            }
            document.getElementById('tg-r-alternativas').innerHTML = altHtml || '<p style="color:rgba(255,255,255,0.5)">Explorá todos en la tienda</p>';

            // GUARDAR TEST
            var testData = {
                fecha: new Date().toISOString(),
                nombre: TG.datos.nombre,
                email: TG.datos.email,
                nacimiento: TG.datos.nacimiento,
                numeroVida: numeroVida,
                arquetipo: arq,
                elemento: elem,
                categoria: cat,
                dolor: dolor,
                deseo: deseo,
                duendeRecomendado: duendePrincipal ? duendePrincipal.nombre : null,
                respuestas: TG.respuestas
            };
            localStorage.setItem('duendes_test_guardian', JSON.stringify(testData));

            // Enviar a API
            if (TG.datos.email) {
                fetch('https://duendes-vercel.vercel.app/api/test-guardian', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email: TG.datos.email, nombre: TG.datos.nombre, respuestas: testData})
                }).catch(function(e){ console.log('Error guardando:', e); });
            }

            TG.show('tg-result');
        },

        reiniciar: function() {
            if (TG.audio) { TG.audio.pause(); TG.audio.currentTime = 0; }
            TG.playing = false;
            document.getElementById('tg-music-btn').classList.remove('visible');
            TG.show('tg-music');
        }
    };

    document.getElementById('tg-texto-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); TG.enviarTexto(); }
    });
    </script>
    <?php
}

add_shortcode('duendes_test_guardian', function(){return '';});
// FIN TEST DEL GUARDIAN v2.0

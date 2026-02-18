<?php
/**
 * Plugin Name: Duendes Homepage V4 Dark
 * Description: Homepage completa V4 con particles, video hero, toast notifications
 * Version: 4.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// Bypass de caché para homepage - ejecutar MUY temprano
add_action('init', function() {
    // Solo en la homepage (detectar por URL)
    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    $is_homepage = ($request_uri === '/' || $request_uri === '' || $request_uri === '/index.php');

    // También verificar si es la página principal por query string
    if (isset($_GET['page_id'])) {
        $front_page_id = get_option('page_on_front');
        if ($_GET['page_id'] == $front_page_id) {
            $is_homepage = true;
        }
    }

    if (!$is_homepage) return;

    // Deshabilitar caché para está request
    if (!defined('DONOTCACHEPAGE')) {
        define('DONOTCACHEPAGE', true);
    }

    // Headers para evitar caché
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');

}, 1);

class Duendes_Homepage_V4 {

    public function __construct() {
        // Solo en la homepage - prioridad MÁXIMA (antes que Elementor y todo)
        add_action('template_redirect', [$this, 'maybe_override_homepage'], -999999);
    }

    public function maybe_override_homepage() {
        // Detectar homepage por múltiples métodos
        $request_uri = $_SERVER['REQUEST_URI'] ?? '';
        $is_homepage = ($request_uri === '/' || $request_uri === '' || $request_uri === '/index.php');

        // Fallback a is_front_page() si WordPress ya cargó
        if (!$is_homepage && function_exists('is_front_page')) {
            $is_homepage = is_front_page();
        }

        if (!$is_homepage) return;

        // Renderizar nuestra homepage custom
        $this->render_homepage();
        exit;
    }

    public function render_homepage() {
        ?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Duendes del Uruguay — Guardianes Únicos Hechos a Mano</title>
<link rel="icon" href="<?php echo get_site_icon_url(); ?>" />
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
<?php wp_head(); ?>
</head>
<body class="duendes-homepage-v4">
<style id="homepage-v4-styles">
/* ═══════════════════════════════════════════════════════════════
   DUENDES DEL URUGUAY — HOMEPAGE V4 DARK
   Matching shop-v4-final palette & atmosphere
   ═══════════════════════════════════════════════════════════════ */
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#070906;--bg2:#0b0d09;--bg-card:#0f120d;--bg-alt:#0a0d08;
  --gold:#B8973A;--gold-dim:rgba(184,151,58,0.35);--gold-glow:rgba(184,151,58,0.12);--gold-bright:#d4b44a;--gold-soft:rgba(184,151,58,0.06);
  --text:#e8e0d0;--text-dim:rgba(232,224,208,0.7);--text-muted:rgba(232,224,208,0.85);--text-body:rgba(232,224,208,0.9);
  --forest:#2a3a1e;--moss:rgba(100,140,70,0.06);
  --danger:rgba(130,35,35,0.8);--green:#5eb85e;
  --font-display:'Cinzel Decorative','Cinzel',serif;
  --font-h:'Cinzel',serif;--font-b:'Cormorant Garamond',serif;
  --ease:cubic-bezier(0.22,1,0.36,1);
}
html{scroll-behavior:smooth}
body{background:var(--bg)!important;color:var(--text);font-family:var(--font-b);overflow-x:hidden;-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit}
img{max-width:100%;display:block}
.wrap{max-width:1100px;margin:0 auto;padding:0 24px}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.reveal.vis{opacity:1;transform:translateY(0)}
.gold-line{width:45px;height:1px;margin:16px auto;background:linear-gradient(90deg,transparent,var(--gold-dim),transparent)}

/* Ocultar elementos de WordPress/Elementor */
#wpadminbar{display:none!important}
.elementor-location-header,
.elementor-location-footer,
header.site-header,
footer.site-footer{display:none!important}

/* IMPORTANTE: Ocultar overlay de selector de país */
#dob-overlay{display:none!important}


/* ═══ PARTICLES ═══ */
#particles{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.5}
#cursor-glow{position:fixed;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(184,151,58,0.04) 0%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:left .2s ease-out,top .2s ease-out}

/* ═══════════════════════════════════════
   0. ANNOUNCEMENT BAR
   ═══════════════════════════════════════ */
.ann{background:linear-gradient(90deg,#0a0c08,rgba(184,151,58,0.06),#0a0c08)!important;border-bottom:1px solid rgba(184,151,58,0.05)!important;padding:9px 20px!important;text-align:center!important;position:fixed!important;top:65px!important;left:0!important;right:0!important;z-index:900!important;overflow:hidden!important;display:block!important;visibility:visible!important}
.ann-track{display:inline-flex!important;animation:annScroll 30s linear infinite!important;white-space:nowrap!important}
.ann-item{font-family:var(--font-h)!important;font-size:10px!important;letter-spacing:2.5px!important;color:var(--gold)!important;text-transform:uppercase!important;padding:0 30px!important;opacity:.7!important}
.ann-item::before{content:'✦'!important;margin-right:12px!important;opacity:.4!important}
@keyframes annScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ═══════════════════════════════════════
   1. VIDEO HERO
   ═══════════════════════════════════════ */
#hero{position:relative!important;height:100vh!important;min-height:600px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;z-index:1!important;margin-top:30px!important;padding-top:0!important}
#hero video,#hero .poster-fb{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
#hero video{filter:brightness(.5) saturate(1.1)}
#hero .poster-fb{background:url('https://duendesdeluruguay.com/wp-content/uploads/2025/12/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled-1.jpg') center/cover;filter:brightness(.4)}
#hero .vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 40%,var(--bg) 90%),linear-gradient(transparent 60%,var(--bg) 100%);z-index:1}
.hero-ring{position:absolute;border:1px solid var(--gold-dim);border-radius:50%;animation:ringP 4s ease-in-out infinite;opacity:.15;z-index:1}
.hero-ring:nth-child(1){width:300px;height:300px}
.hero-ring:nth-child(2){width:400px;height:400px;animation-delay:1.2s;border-color:rgba(184,151,58,0.1)}
@keyframes ringP{0%,100%{transform:scale(1);opacity:.1}50%{transform:scale(1.04);opacity:.3}}
#hero .content{position:relative;z-index:2;text-align:center;padding:0 20px}
#hero .hero-rune{font-family:var(--font-display);font-size:22px;color:var(--gold);opacity:.4;margin-bottom:20px;text-shadow:0 0 25px var(--gold-glow);animation:fU 1s ease .2s both}
#hero h1{font-family:var(--font-h);font-size:clamp(26px,5.5vw,52px);font-weight:400;letter-spacing:6px;color:#fff;line-height:1.3;margin-bottom:14px;text-shadow:0 2px 30px rgba(0,0,0,.6);animation:fU 1s ease .4s both}
#hero h1 em{font-style:normal;color:var(--gold)}
#hero .sub{font-family:var(--font-b);font-size:clamp(15px,2.5vw,21px);font-style:italic;color:var(--text-dim);max-width:500px;margin:0 auto 28px;animation:fU 1s ease .6s both}
.hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;animation:fU 1s ease .8s both}
/* Botones - super específicos para resistir cambios */
.hero-btns .btn-gold,
.hero-btns .btn-ghost,
a.btn-gold,
a.btn-ghost,
.btn-gold,
.btn-ghost{font-family:'Cinzel',serif!important;font-size:9px!important;letter-spacing:3px!important;color:#ffffff!important;background-color:#1a1a1a!important;padding:14px 32px!important;transition:all .3s!important;text-transform:uppercase!important;border:1px solid rgba(255,255,255,0.1)!important;text-decoration:none!important;display:inline-block!important;-webkit-text-fill-color:#ffffff!important}
.hero-btns .btn-gold:hover,
.hero-btns .btn-ghost:hover,
a.btn-gold:hover,
a.btn-ghost:hover,
.btn-gold:hover,
.btn-ghost:hover{background-color:#333333!important;color:#ffffff!important;-webkit-text-fill-color:#ffffff!important}
.hero-btns .btn-gold:active,
.hero-btns .btn-ghost:active,
.btn-gold:active,
.btn-ghost:active,
.hero-btns .btn-gold:focus,
.hero-btns .btn-ghost:focus,
.btn-gold:focus,
.btn-ghost:focus{background-color:#1a1a1a!important;color:#ffffff!important;-webkit-text-fill-color:#ffffff!important;outline:none!important}
#hero .scroll-ind{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);font-family:var(--font-h);font-size:8px;letter-spacing:3px;color:var(--text-dim);animation:bounce 2.5s ease infinite;z-index:2}
#hero .scroll-ind::after{content:'';display:block;width:1px;height:28px;background:linear-gradient(var(--gold-dim),transparent);margin:7px auto 0}
@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(7px)}}
@keyframes fU{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

/* ═══════════════════════════════════════
   2. GUARDIANES PREVIEW
   ═══════════════════════════════════════ */
#guardianes{padding:70px 0;position:relative;z-index:1}
.sec-head{text-align:center;margin-bottom:35px}
.sec-head h2{font-family:var(--font-h);font-size:clamp(18px,3vw,28px);font-weight:400;letter-spacing:4px;color:var(--text);margin-bottom:6px}
.sec-head h2 em{color:var(--gold);font-style:normal}
.sec-head p{font-family:var(--font-b);font-size:16px;color:var(--text);font-style:italic}

.prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.prod-card{position:relative;display:block;background:var(--bg-card);border:1px solid rgba(184,151,58,0.06);border-radius:3px;overflow:hidden;transition:all .5s var(--ease)}
.prod-card::before{content:'';position:absolute;inset:5px;border:1px solid rgba(184,151,58,0.06);border-radius:2px;z-index:3;pointer-events:none;transition:border-color .5s}
.prod-card:hover::before{border-color:rgba(184,151,58,0.18)}
.prod-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.3),0 0 30px rgba(184,151,58,0.03)}
.prod-card .img-w{position:relative;aspect-ratio:3/4;overflow:hidden}
.prod-card .img-w img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease),filter .4s;filter:brightness(.8) saturate(.9)}
.prod-card:hover .img-w img{transform:scale(1.04);filter:brightness(.95) saturate(1)}
.prod-card .img-w::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center bottom,rgba(184,151,58,0.25),transparent 55%);opacity:0;transition:opacity .5s;pointer-events:none}
.prod-card:hover .img-w::after{opacity:1}
.prod-card .b-size{position:absolute;top:9px;left:9px;font-family:var(--font-h);font-size:6px;letter-spacing:1.5px;color:var(--gold);background:rgba(7,9,6,0.7);backdrop-filter:blur(6px);padding:3px 7px;border:1px solid rgba(184,151,58,0.1);z-index:4;text-transform:uppercase}
.prod-card .b-cat{font-family:var(--font-h);font-size:6px;letter-spacing:2px;color:var(--gold);opacity:.4;text-transform:uppercase;margin-bottom:2px}
.prod-card .info{padding:10px 11px 13px;border-top:1px solid rgba(184,151,58,0.04)}
.prod-card .name{font-family:var(--font-h);font-size:12px;font-weight:400;color:var(--text);letter-spacing:1px;margin-bottom:2px}
.prod-card .row{display:flex;justify-content:space-between;align-items:baseline}
.prod-card .price{font-family:var(--font-b);font-size:14px;color:var(--gold);font-weight:500}
.prod-card .link{font-family:var(--font-h);font-size:6px;letter-spacing:1.5px;color:var(--text);text-transform:uppercase;margin-top:2px;transition:color .3s}
.prod-card:hover .link{color:var(--gold)}
.ver-todos{text-align:center;margin-top:30px}
.btn-outline{font-family:var(--font-h);font-size:9px;letter-spacing:3px;color:#fff;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);padding:13px 30px;transition:all .3s;text-transform:uppercase;display:inline-block}
.btn-outline:hover{background:#333}

/* ═══════════════════════════════════════
   3. SHOWCASE BANNER
   ═══════════════════════════════════════ */
#banner{position:relative;height:40vh;min-height:250px;max-height:420px;overflow:hidden;z-index:1}
#banner img{width:100%;height:100%;object-fit:cover;object-position:center 35%;filter:brightness(.4) saturate(1.1)}
#banner .ov{position:absolute;inset:0;background:linear-gradient(transparent 30%,var(--bg) 100%);display:flex;align-items:flex-end;justify-content:center;padding:0 24px 35px}
#banner .ov p{font-family:var(--font-b);font-size:clamp(16px,2.5vw,21px);color:var(--text);font-style:italic;text-align:center;text-shadow:0 2px 12px rgba(0,0,0,.6)}
#banner .ov p em{color:var(--gold);font-style:italic}

/* ═══════════════════════════════════════
   4. MIRROR — ¿Te pasa esto?
   ═══════════════════════════════════════ */
#mirror{padding:80px 0;position:relative;z-index:1;background:var(--bg-alt)}
.mirror-flex{display:flex;gap:40px;align-items:center;flex-wrap:wrap;justify-content:center}
.mirror-flex .img-col{flex-shrink:0;position:relative}
.mirror-flex .img-col img{width:200px;height:260px;object-fit:cover;object-position:center top;border-radius:3px;border:2px solid rgba(184,151,58,0.08);box-shadow:0 8px 28px rgba(0,0,0,.3)}
.mirror-flex .img-col .accent-img{position:absolute;bottom:-18px;right:-22px;width:90px;height:90px;object-fit:cover;border-radius:50%;border:3px solid var(--bg-alt);box-shadow:0 4px 16px rgba(0,0,0,.3)}
.mirror-text{flex:1;min-width:280px}
.mirror-text h2{font-family:var(--font-h);font-size:clamp(20px,2.5vw,28px);color:var(--text);font-weight:400;letter-spacing:2px;margin-bottom:22px}
.mirror-text .pain{font-family:var(--font-b);font-size:17px;color:var(--text);line-height:1.75;margin-bottom:12px;padding-left:16px;border-left:2px solid rgba(184,151,58,0.08);transition:border-color .4s}
.mirror-text .pain:hover{border-left-color:var(--gold)}
.mirror-bridge{margin-top:32px;padding:24px 28px;background:var(--gold-soft);border-left:3px solid var(--gold);border-radius:0 4px 4px 0}
.mirror-bridge p{font-family:var(--font-b);font-size:17px;color:var(--text);line-height:1.75;font-style:italic}
.mirror-bridge p strong{color:var(--gold);font-weight:500;font-style:normal}
.mirror-bridge .cta-link{display:inline-block;margin-top:14px;font-family:var(--font-h);font-size:8px;letter-spacing:2px;color:var(--gold);border-bottom:1px solid var(--gold-dim);padding-bottom:2px;transition:all .3s;text-transform:uppercase}
.mirror-bridge .cta-link:hover{border-bottom-color:var(--gold)}

/* ═══════════════════════════════════════
   5. REVIEWS
   ═══════════════════════════════════════ */
#reviews{padding:80px 0;position:relative;z-index:1}
.stats-row{display:flex;justify-content:center;gap:48px;flex-wrap:wrap;margin-bottom:36px}
.stat{text-align:center}
.stat .num{font-family:var(--font-display);font-size:26px;color:var(--gold);opacity:.7}
.stat .lbl{font-family:var(--font-h);font-size:7px;letter-spacing:2px;color:var(--text-dim);text-transform:uppercase;margin-top:3px}
.reviews-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.review-card{background:var(--bg-card);border:1px solid rgba(184,151,58,0.05);border-radius:3px;padding:24px 20px;display:flex;flex-direction:column;transition:transform .3s,box-shadow .3s}
.review-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.2)}
.review-card .stars{color:var(--gold);font-size:11px;letter-spacing:3px;margin-bottom:14px}
.review-card .quote{font-family:var(--font-b);font-size:16px;color:var(--text);line-height:1.72;font-style:italic;flex:1;margin-bottom:16px}
.review-card .footer{border-top:1px solid rgba(184,151,58,0.04);padding-top:12px;display:flex;justify-content:space-between;align-items:center}
.review-card .author{font-family:var(--font-h);font-size:9px;color:var(--text);letter-spacing:1px}
.review-card .from{font-family:var(--font-b);font-size:13px;color:var(--text)}
.review-card .type-badge{font-family:var(--font-h);font-size:6px;letter-spacing:2px;color:var(--gold);background:var(--gold-soft);padding:3px 9px;border-radius:2px}
.reviews-closer{text-align:center;margin-top:28px}
.reviews-closer p{font-family:var(--font-b);font-size:16px;color:var(--text);font-style:italic}
.reviews-closer em{color:var(--gold)}

/* ═══════════════════════════════════════
   6. UGC GALLERY
   ═══════════════════════════════════════ */
#ugc{padding:70px 0;background:var(--bg-alt);position:relative;z-index:1}
.ugc-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}
.ugc-item{position:relative;overflow:hidden;aspect-ratio:1;cursor:pointer}
.ugc-item img{width:100%;height:100%;object-fit:cover;transition:transform .6s var(--ease),filter .4s;filter:brightness(.8)}
.ugc-item:hover img{transform:scale(1.06);filter:brightness(1)}
.ugc-item .ugc-ov{position:absolute;inset:0;background:linear-gradient(transparent 50%,rgba(7,9,6,0.8));opacity:0;transition:opacity .4s;display:flex;align-items:flex-end;padding:12px}
.ugc-item:hover .ugc-ov{opacity:1}
.ugc-ov .ugc-name{font-family:var(--font-h);font-size:8px;letter-spacing:1px;color:var(--text)}
.ugc-ov .ugc-loc{font-family:var(--font-b);font-size:12px;color:var(--text-dim);font-style:italic}
.ugc-closer{text-align:center;margin-top:24px}
.ugc-closer p{font-family:var(--font-b);font-size:15px;color:var(--text);font-style:italic}
.ugc-closer em{color:var(--gold)}

/* ═══════════════════════════════════════
   7. QUIZ
   ═══════════════════════════════════════ */
#quiz{padding:75px 0;position:relative;overflow:hidden;z-index:1}
#quiz::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;background:radial-gradient(circle,rgba(184,151,58,0.04),transparent 60%);pointer-events:none}
#quiz .inner{max-width:700px;margin:0 auto;text-align:center;position:relative}
#quiz .rune{font-family:var(--font-display);font-size:32px;color:var(--gold);opacity:.3;margin-bottom:14px}
#quiz h2{font-family:var(--font-h);font-size:clamp(20px,3vw,30px);font-weight:400;letter-spacing:3px;color:var(--text);margin-bottom:12px}
#quiz h2 em{color:var(--gold);font-style:normal}
#quiz .desc{font-family:var(--font-b);font-size:17px;color:var(--text);font-style:italic;line-height:1.75;margin-bottom:24px}
.quiz-steps{display:flex;justify-content:center;gap:28px;margin-bottom:28px;flex-wrap:wrap}
.quiz-step{text-align:center}
.quiz-step .qs-num{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:1px solid var(--gold-dim);font-family:var(--font-h);font-size:10px;color:var(--gold);margin-bottom:8px}
.quiz-step .qs-label{font-family:var(--font-b);font-size:14px;color:var(--text)}

/* ═══════════════════════════════════════
   8. CÓMO FUNCIONA
   ═══════════════════════════════════════ */
#como{padding:80px 0;background:var(--bg-alt);position:relative;z-index:1}
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;position:relative}
.steps-grid::before{content:'';position:absolute;top:28px;left:16.6%;right:16.6%;height:1px;background:linear-gradient(90deg,transparent,var(--gold-dim),var(--gold-dim),transparent);opacity:.3}
.step{text-align:center;padding:0 12px;position:relative}
.step .num{display:inline-flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:50%;border:1px solid var(--gold-dim);background:var(--bg-alt);font-family:var(--font-h);font-size:12px;color:var(--gold);margin-bottom:16px;position:relative;z-index:2}
.step h3{font-family:var(--font-h);font-size:13px;color:var(--text);font-weight:400;letter-spacing:1px;margin-bottom:10px}
.step p{font-family:var(--font-b);font-size:15px;color:var(--text);line-height:1.72}
.bts-photos{display:flex;justify-content:center;gap:14px;margin-top:40px}
.bts-photos img{width:45%;max-width:280px;height:185px;object-fit:cover;border-radius:3px;border:1px solid rgba(184,151,58,0.06);box-shadow:0 6px 20px rgba(0,0,0,.3);filter:brightness(.85)}
.bts-caption{font-family:var(--font-b);font-size:14px;color:var(--text);font-style:italic;text-align:center;margin-top:12px}

/* ═══════════════════════════════════════
   9. FOUNDERS
   ═══════════════════════════════════════ */
#founders{overflow:hidden;position:relative;z-index:1;border-top:1px solid rgba(184,151,58,0.04);border-bottom:1px solid rgba(184,151,58,0.04)}
.founders-grid{display:grid;grid-template-columns:1fr 1fr;min-height:460px;max-width:1120px;margin:0 auto}
.founder{position:relative;overflow:hidden}
.founder img{width:100%;height:100%;object-fit:cover;object-position:center top;filter:brightness(.35);transition:filter .6s}
.founder:hover img{filter:brightness(.5)}
.founder .caption{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,var(--bg));padding:60px 28px 30px}
.founder .caption h3{font-family:var(--font-h);font-size:18px;color:var(--text);margin-bottom:8px;letter-spacing:1px}
.founder .caption p{font-family:var(--font-b);font-size:15px;color:var(--text);line-height:1.72}
.founders-quote{text-align:center;padding:40px 24px;background:var(--bg)}
.founders-quote p{font-family:var(--font-b);font-size:clamp(17px,2.5vw,22px);color:var(--text);font-style:italic;max-width:600px;margin:0 auto}
.founders-quote em{color:var(--gold);font-style:italic}

/* ═══════════════════════════════════════
   10. MENSAJE
   ═══════════════════════════════════════ */
#mensaje{padding:80px 0;position:relative;z-index:1;background:var(--bg-alt)}
.mensaje-flex{display:flex;gap:40px;align-items:center;justify-content:center;flex-wrap:wrap;max-width:900px;margin:0 auto}
.mensaje-img{flex:0 0 220px;border-radius:3px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.3);border:1px solid rgba(184,151,58,0.06)}
.mensaje-img img{width:220px;height:300px;object-fit:cover;filter:brightness(.85)}
.mensaje-content{flex:1;min-width:280px}
.mensaje-content h2{font-family:var(--font-h);font-size:clamp(18px,2.5vw,26px);font-weight:400;color:var(--text);letter-spacing:2px;margin-bottom:14px}
.mensaje-content p{font-family:var(--font-b);font-size:17px;color:var(--text);line-height:1.75;margin-bottom:12px}
.mensaje-content strong{color:var(--gold);font-weight:500}
.msg-box{margin-top:26px;padding:18px 24px;border:1px solid rgba(184,151,58,0.15);border-radius:3px;background:var(--gold-soft)}
.msg-box p{font-family:var(--font-h);font-size:11px;color:var(--gold);letter-spacing:1px}

/* ═══════════════════════════════════════
   11. PAGOS & ENVÍOS
   ═══════════════════════════════════════ */
#pagos{padding:60px 0;position:relative;z-index:1;border-top:1px solid rgba(184,151,58,0.04)}
.pagos-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:24px}
.pago-item{background:rgba(184,151,58,0.02);border:1px solid rgba(184,151,58,0.08);border-radius:3px;padding:24px 20px;text-align:center}
.pago-item .flag{font-size:24px;margin-bottom:8px}
.pago-item h3{font-family:var(--font-h);font-size:8px;letter-spacing:3px;color:var(--gold);margin-bottom:12px;text-transform:uppercase}
.pago-item .methods{font-family:var(--font-b);font-size:15px;color:var(--text);line-height:1.6;margin-bottom:12px}
.pago-item .shipping{font-family:var(--font-b);font-size:14px;color:var(--text);font-style:italic;margin-bottom:10px}
.pago-item .shipping strong{color:var(--gold);font-weight:500;font-style:normal}
.pago-item .free{display:inline-block;background:linear-gradient(135deg,var(--gold),#a68a1f);color:var(--bg);font-family:var(--font-h);font-size:7px;letter-spacing:1px;font-weight:600;padding:5px 12px;border-radius:2px}
.trust-strip{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;padding-top:22px;border-top:1px solid rgba(184,151,58,0.06)}
.trust-strip span{font-family:var(--font-b);font-size:13px;color:var(--text);display:flex;align-items:center;gap:5px}
.trust-strip .ti{font-size:14px;opacity:.5}

/* ═══════════════════════════════════════
   12. FAQ
   ═══════════════════════════════════════ */
#faq{padding:60px 0;background:var(--bg-alt);position:relative;z-index:1}
#faq .inner{max-width:720px;margin:0 auto}
.faq-item{border-bottom:1px solid rgba(184,151,58,0.05);overflow:hidden}
.faq-q{display:flex;justify-content:space-between;align-items:center;width:100%;background:none;border:none;font-family:var(--font-h);font-size:12px;letter-spacing:1px;color:var(--text);padding:17px 0;cursor:pointer;transition:color .3s;text-align:left}
.faq-q:hover{color:var(--gold)}
.faq-q::after{content:'+';font-size:16px;color:var(--gold);opacity:.4;transition:transform .3s;flex-shrink:0;margin-left:12px}
.faq-item.open .faq-q::after{transform:rotate(45deg)}
.faq-a{font-family:var(--font-b);font-size:15px;color:var(--text);line-height:1.72;max-height:0;overflow:hidden;transition:max-height .4s ease,padding .4s}
.faq-item.open .faq-a{max-height:250px;padding:0 0 16px}
.faq-a strong{color:var(--gold);font-weight:500}
.faq-more{text-align:center;margin-top:20px}
.faq-more a{font-family:var(--font-h);font-size:8px;letter-spacing:2px;color:var(--text);border-bottom:1px solid rgba(184,151,58,0.1);padding-bottom:2px;transition:all .3s;text-transform:uppercase}
.faq-more a:hover{color:var(--gold);border-bottom-color:var(--gold)}

/* ═══════════════════════════════════════
   13. CTA FINAL
   ═══════════════════════════════════════ */
#cta-final{padding:80px 0;text-align:center;position:relative;z-index:1;overflow:hidden}
#cta-final::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(184,151,58,0.03),transparent 55%)}
#cta-final h2{font-family:var(--font-h);font-size:clamp(20px,3.5vw,34px);font-weight:400;letter-spacing:4px;color:var(--text);margin-bottom:12px;position:relative}
#cta-final h2 em{color:var(--gold);font-style:normal}
#cta-final .sub{font-family:var(--font-b);font-size:17px;color:var(--text);font-style:italic;margin-bottom:28px}
.cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:24px}
.trust-row{display:flex;gap:24px;justify-content:center;flex-wrap:wrap}
.trust-row span{font-family:var(--font-b);font-size:13px;color:var(--text)}

/* ═══════════════════════════════════════
   TOAST & STICKY & WHATSAPP
   ═══════════════════════════════════════ */
#toast{position:fixed;bottom:80px;left:20px;z-index:998;background:#131812;border:1px solid rgba(184,151,58,0.08);border-radius:3px;padding:11px 15px;box-shadow:0 8px 30px rgba(0,0,0,.4);display:flex;align-items:center;gap:9px;max-width:310px;transform:translateX(-120%);transition:transform .5s var(--ease)}
#toast.show{transform:translateX(0)}
.toast-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0;animation:pls 2s infinite}
@keyframes pls{0%,100%{opacity:1}50%{opacity:.25}}
.toast-t{font-family:var(--font-b);font-size:13px;color:var(--text);line-height:1.3}
.toast-t strong{color:var(--gold)}
.toast-tm{font-size:11px;color:var(--text-dim);margin-top:1px}
.sticky-cta{display:none;position:fixed;bottom:0;left:0;right:0;z-index:999;background:rgba(7,9,6,0.95);backdrop-filter:blur(15px);border-top:1px solid rgba(184,151,58,0.08);padding:10px 16px;text-align:center}
.sticky-cta a{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-h);font-size:10px;letter-spacing:2px;color:var(--bg);background:var(--gold);padding:12px 28px;text-transform:uppercase;width:100%;justify-content:center}
.wa-float{position:fixed;bottom:24px;right:24px;z-index:998;width:52px;height:52px;border-radius:50%;background:#25d366;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 4px 20px rgba(37,211,102,0.3);transition:transform .3s}
.wa-float:hover{transform:scale(1.1)}

/* ═══ RESPONSIVE ═══ */
@media(max-width:1100px){.prod-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:768px){
  .prod-grid{grid-template-columns:repeat(2,1fr);gap:10px}
  #hero{height:70vh;min-height:400px}
  .mirror-flex .img-col{display:none}
  .founders-grid{grid-template-columns:1fr}
  .steps-grid{grid-template-columns:1fr;gap:24px}.steps-grid::before{display:none}
  .pagos-grid{grid-template-columns:1fr}
  .mensaje-flex{text-align:center}.mensaje-img{display:none}
  .ugc-grid{grid-template-columns:repeat(3,1fr)}
  #toast{left:8px;right:8px;max-width:none;bottom:70px}
  .sticky-cta{display:block}
  .wa-float{display:none}
  .bts-photos img{height:140px}
}
@media(max-width:480px){
  .prod-grid{gap:6px}
  .prod-card .b-size{font-size:5px;padding:2px 5px}
  .prod-card .name{font-size:10px}
  .ugc-grid{grid-template-columns:repeat(2,1fr)}
  .stats-row{gap:24px}
}
</style>

<canvas id="particles"></canvas>
<div id="cursor-glow"></div>

<!-- ═══ 0. ANNOUNCEMENT ═══ -->
<div class="ann"><div class="ann-track">
  <span class="ann-item">ENVÍOS A TODO EL MUNDO</span>
  <span class="ann-item">PIEZA ÚNICA HECHA A MANO</span>
  <span class="ann-item">PAGO 100% SEGURO</span>
  <span class="ann-item">ENVÍOS A TODO EL MUNDO</span>
  <span class="ann-item">PIEZA ÚNICA HECHA A MANO</span>
  <span class="ann-item">PAGO 100% SEGURO</span>
</div></div>

<!-- ═══ 1. VIDEO HERO ═══ -->
<section id="hero">
  <div class="poster-fb"></div>
  <video autoplay loop muted playsinline poster="https://duendesdeluruguay.com/wp-content/uploads/2025/12/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled-1.jpg">
    <source src="https://www.duendesdeluruguay.com/wp-content/uploads/2025/11/kling_20251129_Image_to_Video_Magical_fo_2162_0-1.mp4" type="video/mp4">
  </video>
  <div class="vig"></div>
  <div class="hero-ring"></div><div class="hero-ring"></div>
  <div class="content">
    <div class="hero-rune">&#10033;</div>
    <h1>NO LO ELEGÍS VOS.<br><em>ÉL TE ELIGE A VOS.</em></h1>
    <div class="gold-line"></div>
    <p class="sub">Guardianes únicos, hechos a mano en Piriápolis.<br>Más de 15.000 adoptados en 10 años. Cada uno existe una sola vez.</p>
    <div class="hero-btns">
      <a href="/shop/" class="btn-gold">VER GUARDIANES</a>
      <a href="/descubri-que-duende-te-elige/" class="btn-ghost">DESCUBRÍ CUÁL TE ELIGE</a>
    </div>
  </div>
  <div class="scroll-ind">EXPLORAR</div>
</section>

<!-- ═══ 2. GUARDIANES PREVIEW ═══ -->
<section id="guardianes">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2>Guardianes <em>Disponibles</em></h2>
      <p>Cuando uno encuentra hogar, desaparece para siempre</p>
    </div>
    <div class="prod-grid">
      <a href="/product/matheo/" class="prod-card reveal"><div class="img-w"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0deab3-67b4-6eb0-bba3-c35697d567a5_1_1_5edb8e87-1ab3-4349-b523-6640e0c86835-747x1024.png" alt="Matheo" loading="lazy"><span class="b-size">MINI - $70</span></div><div class="info"><div class="b-cat">ABUNDANCIA</div><div class="row"><span class="name">Matheo</span><span class="price">$70</span></div><span class="link">Conocer su historia &rarr;</span></div></a>
      <a href="/product/smith/" class="prod-card reveal"><div class="img-w"><img src="https://duendesdeluruguay.com/wp-content/uploads/2026/02/IMG_1552-747x1024.png" alt="Smith" loading="lazy"><span class="b-size">MEDIANO - $200</span></div><div class="info"><div class="b-cat">ABUNDANCIA</div><div class="row"><span class="name">Smith</span><span class="price">$200</span></div><span class="link">Conocer su historia &rarr;</span></div></a>
      <a href="/product/morgana/" class="prod-card reveal"><div class="img-w"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1e3-0eca-6d60-9507-79cfea2fa1f0_1_1_393e2885-238d-4cf3-993a-a509fcd2ef23-747x1024.png" alt="Morgana" loading="lazy"><span class="b-size">MEDIANO - $200</span></div><div class="info"><div class="b-cat">SABIDURIA</div><div class="row"><span class="name">Morgana</span><span class="price">$200</span></div><span class="link">Conocer su historia &rarr;</span></div></a>
      <a href="/product/merlin-2/" class="prod-card reveal"><div class="img-w"><img src="https://duendesdeluruguay.com/wp-content/uploads/2026/02/IMG_1732-747x1024.png" alt="Merlin Mini" loading="lazy"><span class="b-size">MINI ESPECIAL - $150</span></div><div class="info"><div class="b-cat">PROTECCION</div><div class="row"><span class="name">Merlin</span><span class="price">$150</span></div><span class="link">Conocer su historia &rarr;</span></div></a>
      <a href="/product/rosa-pixie/" class="prod-card reveal"><div class="img-w"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1da-dffa-6dd0-9e98-2c1c6bea5f72_0_0_0e2d07e0-1a37-4c94-9bcd-c5d5796a2132-747x1024.png" alt="Rosa" loading="lazy"><span class="b-size">PIXIE - $150</span></div><div class="info"><div class="b-cat">AMOR</div><div class="row"><span class="name">Rosa</span><span class="price">$150</span></div><span class="link">Conocer su historia &rarr;</span></div></a>
      <a href="/product/astrid/" class="prod-card reveal"><div class="img-w"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc61d-b324-6a90-a48f-2624a5bae62c_2_2_d1e8f843-befd-47be-ac8c-080b21f862db-1-640x1024.png" alt="Astrid" loading="lazy"><span class="b-size">MEDIANO - $200</span></div><div class="info"><div class="b-cat">PROTECCION</div><div class="row"><span class="name">Astrid</span><span class="price">$200</span></div><span class="link">Conocer su historia &rarr;</span></div></a>
      <a href="/product/cash/" class="prod-card reveal"><div class="img-w"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0deab7-d5a9-6e30-aad0-f8e8ecb9127a_2_2_8df0f164-d68c-4de2-b6cf-91cb9283f7e6-747x1024.png" alt="Cash" loading="lazy"><span class="b-size">MINI - $70</span></div><div class="info"><div class="b-cat">ABUNDANCIA</div><div class="row"><span class="name">Cash</span><span class="price">$70</span></div><span class="link">Conocer su historia &rarr;</span></div></a>
      <a href="/product/clavel-pixie/" class="prod-card reveal"><div class="img-w"><img src="https://duendesdeluruguay.com/wp-content/uploads/2026/01/tranquil_forest_portrait_1f0f0dff-9b83-6e60-ad4f-bdf824f6fbc8_0_0_9ff96b0a-0ac7-4daa-94d6-7e069e2e76b2-747x1024.png" alt="Clavel" loading="lazy"><span class="b-size">PIXIE - $150</span></div><div class="info"><div class="b-cat">SABIDURIA</div><div class="row"><span class="name">Clavel</span><span class="price">$150</span></div><span class="link">Conocer su historia &rarr;</span></div></a>
    </div>
    <div class="ver-todos reveal"><a href="/shop/" class="btn-outline">VER TODOS LOS GUARDIANES</a></div>
  </div>
</section>

<!-- ═══ 3. BANNER ═══ -->
<section id="banner">
  <img src="https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled.jpg" alt="Guardianes canalizados" loading="lazy">
  <div class="ov"><p>Cada uno nació de un momento irrepetible. <em>Ninguno volverá a existir.</em></p></div>
</section>

<!-- ═══ 4. MIRROR ═══ -->
<section id="mirror">
  <div class="wrap">
    <div class="mirror-flex reveal">
      <div class="img-col">
        <img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/gemini-image-2_A_cinematic_portrait_photograph_of_A_candid_cinematic_photograph_of_the_same_per-1_a2dc0315-e68f-46e1-8f08-d95ce881c14b-scaled.jpg" alt="">
        <img class="accent-img" src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled-1.jpg" alt="Guardian">
      </div>
      <div class="mirror-text">
        <h2>Te pasa esto?</h2>
        <p class="pain">Das todo por los demás y al final del día no queda nada para vos.</p>
        <p class="pain">Cargas emociones que no son tuyas y el cuerpo ya te lo está diciendo.</p>
        <p class="pain">Sentís que algo falta - tu vida no está mal, pero hay un vacío que vuelve.</p>
        <p class="pain">Tenés corazonadas que ignorás, y después se confirman.</p>
      </div>
    </div>
    <div class="mirror-bridge reveal">
      <p>No sos la primera que llega acá sintiendo eso. De hecho, todas describen lo mismo con palabras distintas. Y todas dicen lo mismo después: <strong>Algo cambió desde que llegó.</strong></p>
      <a href="/shop/" class="cta-link">ENCONTRAR MI GUARDIÁN &rarr;</a>
    </div>
  </div>
</section>

<!-- ═══ 5. REVIEWS ═══ -->
<section id="reviews">
  <div class="wrap">
    <div class="sec-head reveal"><h2>Lo que dicen quienes <em>ya lo sienten</em></h2></div>
    <div class="stats-row reveal">
      <div class="stat"><div class="num">15,000+</div><div class="lbl">ADOPTADOS</div></div>
      <div class="stat"><div class="num">177K</div><div class="lbl">COMUNIDAD</div></div>
      <div class="stat"><div class="num">10+</div><div class="lbl">AÑOS</div></div>
    </div>
    <div class="reviews-grid">
      <div class="review-card reveal"><div class="stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div><div class="quote">"Cuando lo vi, lo sentí. No se como explicarlo, pero sabía que era mio. Llegó con un mensaje que me hizo llorar."</div><div class="footer"><div><div class="author">Maria L.</div><div class="from">Buenos Aires</div></div><span class="type-badge">MEDIANO</span></div></div>
      <div class="review-card reveal"><div class="stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div><div class="quote">"Le regalé un duende a mi mamá que estaba pasando un momento difícil. Me dijo que cada vez que lo mira, siente paz."</div><div class="footer"><div><div class="author">Carolina M.</div><div class="from">Ciudad de Mexico</div></div><span class="type-badge">MINI</span></div></div>
      <div class="review-card reveal"><div class="stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div><div class="quote">"No creía en estás cosas, lo compré porque era lindo. Pero el mensaje que llegó... era exactamente lo que necesitaba escuchar."</div><div class="footer"><div><div class="author">Luciana R.</div><div class="from">Madrid</div></div><span class="type-badge">PIXIE</span></div></div>
    </div>
    <div class="reviews-closer reveal"><p>Más de 15,000 historias como estas. <em>La tuya puede ser la proxima.</em></p></div>
  </div>
</section>

<!-- ═══ 6. UGC ═══ -->
<section id="ugc">
  <div class="wrap">
    <div class="sec-head reveal"><h2>Guardianes en su <em>Nuevo Hogar</em></h2></div>
    <div class="ugc-grid">
      <div class="ugc-item reveal"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/11/Santino-image-2_A_cinematic_portrait_photograph_of_a_handcrafted_duende_figure_on_lush_green_mos-0-825x1024.jpg" alt="UGC" loading="lazy"><div class="ugc-ov"><div class="ugc-name">Maria</div><div class="ugc-loc">Buenos Aires</div></div></div>
      <div class="ugc-item reveal"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1e3-0eca-6d60-9507-79cfea2fa1f0_1_1_393e2885-238d-4cf3-993a-a509fcd2ef23-747x1024.png" alt="UGC" loading="lazy"><div class="ugc-ov"><div class="ugc-name">Carolina</div><div class="ugc-loc">Mexico</div></div></div>
      <div class="ugc-item reveal"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc61d-b324-6a90-a48f-2624a5bae62c_2_2_d1e8f843-befd-47be-ac8c-080b21f862db-1-640x1024.png" alt="UGC" loading="lazy"><div class="ugc-ov"><div class="ugc-name">Luciana</div><div class="ugc-loc">Madrid</div></div></div>
      <div class="ugc-item reveal"><img src="https://duendesdeluruguay.com/wp-content/uploads/2026/01/tranquil_forest_portrait_1f0f0dec-1950-6460-ae64-e7627e76c478_2_2_cd7834dd-5e9c-4ca9-9f01-a9cbb06dac0b-747x1024.png" alt="UGC" loading="lazy"><div class="ugc-ov"><div class="ugc-name">Gabriela</div><div class="ugc-loc">Santiago</div></div></div>
      <div class="ugc-item reveal"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc5e4-63b1-68c0-a223-14f05aac861e_1_1_8ba7ffb7-f78a-4d45-a0a8-241da7ab71d1-1-640x1024.png" alt="UGC" loading="lazy"><div class="ugc-ov"><div class="ugc-name">Florencia</div><div class="ugc-loc">Montevideo</div></div></div>
    </div>
    <div class="ugc-closer reveal"><p>Fotos reales de guardianes en su nuevo hogar. <em>El tuyo será el próximo?</em></p></div>
  </div>
</section>

<!-- ═══ 7. QUIZ ═══ -->
<section id="quiz">
  <div class="wrap">
    <div class="inner reveal">
      <div class="rune">&#10033;</div>
      <h2>No sabés <em>cuál es el tuyo</em>?</h2>
      <p class="desc">No todos saben cuál es su guardián a primera vista. Este test de 5 preguntas te conecta con el que fue canalizado para vos.</p>
      <div class="quiz-steps">
        <div class="quiz-step"><div class="qs-num">1</div><div class="qs-label">5 preguntas</div></div>
        <div class="quiz-step"><div class="qs-num">2</div><div class="qs-label">2 minutos</div></div>
        <div class="quiz-step"><div class="qs-num">3</div><div class="qs-label">Tu guardián revelado</div></div>
      </div>
      <a href="/descubri-que-duende-te-elige/" class="btn-gold">DESCUBRÍ CUÁL TE ELIGE</a>
    </div>
  </div>
</section>

<!-- ═══ 8. COMO FUNCIONA ═══ -->
<section id="como">
  <div class="wrap">
    <div class="sec-head reveal">
      <h2>Cómo <em>funciona</em></h2>
      <p>De nuestras manos al corazón de tu hogar</p>
    </div>
    <div class="steps-grid reveal">
      <div class="step"><div class="num">1</div><h3>Elegi</h3><p>Navega la tienda y deja que uno te llame. O hace el Test para que el te encuentre.</p></div>
      <div class="step"><div class="num">2</div><h3>Canalizamos</h3><p>Thibisay canaliza un mensaje personal que solo tiene sentido para vos.</p></div>
      <div class="step"><div class="num">3</div><h3>Llega</h3><p>Tu guardián viaja protegido a cualquier lugar del mundo, con su mensaje escrito a mano.</p></div>
    </div>
    <div class="bts-photos reveal">
      <img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled-1.jpg" alt="Taller" loading="lazy">
      <img src="https://duendesdeluruguay.com/wp-content/uploads/2025/11/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled.jpg" alt="Proceso" loading="lazy">
    </div>
    <p class="bts-caption reveal">Nuestro taller en Piriápolis, Uruguay - donde cada guardián cobra vida</p>
  </div>
</section>

<!-- ═══ 9. FOUNDERS ═══ -->
<section id="founders">
  <div class="founders-grid">
    <div class="founder"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/gemini-image-2_A_cinematic_portrait_photograph_of_A_candid_cinematic_photograph_of_the_same_per-1_a2dc0315-e68f-46e1-8f08-d95ce881c14b-scaled.jpg" alt="Thibisay" loading="lazy"><div class="caption"><h3>Thibisay</h3><p>Canalizadora y creadora de cada guardián. Su don: escuchar lo que los duendes quieren decirte.</p></div></div>
    <div class="founder"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/nano-banana-9ddf1407294d9cd26ee215b57d94fc06-1-scaled-1.jpg" alt="Gabriel" loading="lazy"><div class="caption"><h3>Gabriel</h3><p>Artesano y protector del taller. Cada detalle pasa por sus manos antes de llegar a las tuyas.</p></div></div>
  </div>
  <div class="founders-quote reveal"><p>"Cuando empezamos hace más de 10 años, hacíamos duendes porque nos nacía. Hoy, con más de 15.000 adoptados, seguimos con las mismás manos y <em>el mismo fuego.</em>"</p></div>
</section>

<!-- ═══ 10. MENSAJE ═══ -->
<section id="mensaje">
  <div class="wrap">
    <div class="mensaje-flex reveal">
      <div class="mensaje-img"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/11/Santino-image-2_A_cinematic_portrait_photograph_of_a_handcrafted_duende_figure_on_lush_green_mos-0-825x1024.jpg" alt="Mensaje canalizado" loading="lazy"></div>
      <div class="mensaje-content">
        <h2>El mensaje que viene <em>con cada guardián</em></h2>
        <p>No es una frase genérica. Es una carta canalizada que <strong>solo tiene sentido para vos</strong>. Cuando la leas, vas a entender por que este guardián te eligió.</p>
        <p>Cada mensaje se escribe a mano después de un proceso de canalización donde Thibisay conecta con la energía del guardián y la tuya.</p>
        <div class="msg-box"><p>Incluido con cada adopción - sin costo extra</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ 11. PAGOS ═══ -->
<section id="pagos">
  <div class="wrap">
    <div class="sec-head reveal"><h2>Pagos &amp; <em>Envíos</em></h2></div>
    <div class="pagos-grid reveal">
      <div class="pago-item"><div class="flag">&#127482;&#127486;</div><h3>URUGUAY</h3><div class="methods">Tarjetas - Transferencia - MercadoPago</div><div class="shipping">Envío por DAC: <strong>5 a 7 días</strong></div><div class="free">ENVIO GRATIS +$10.000</div></div>
      <div class="pago-item"><div class="flag">&#127758;</div><h3>RESTO DEL MUNDO</h3><div class="methods">Tarjetas internacionales - Wise</div><div class="shipping">DHL Express: <strong>5 a 10 días</strong>, puerta a puerta</div><div class="free">ENVIO GRATIS +$1.000 USD</div></div>
    </div>
    <div class="trust-strip reveal">
      <span><span class="ti">&#128274;</span>Pago encriptado</span>
      <span><span class="ti">&#128230;</span>Envío asegurado</span>
      <span><span class="ti">&#9995;</span>Hecho a mano</span>
      <span><span class="ti">&#128220;</span>Mensaje incluido</span>
    </div>
  </div>
</section>

<!-- ═══ 12. FAQ ═══ -->
<section id="faq">
  <div class="wrap">
    <div class="inner">
      <div class="sec-head reveal"><h2>Preguntas <em>Frecuentes</em></h2></div>
      <div class="faq-item reveal"><button class="faq-q">Cómo se cuál duende es para mi?</button><div class="faq-a"><p><strong>La persona no elige al duende. El duende la elige a ella.</strong> Cuando navegas por la tienda, hay uno que te va a llamar más la atención. Esa es la señal. Si no estás segura, <strong>hace el Test del Guardian</strong>.</p></div></div>
      <div class="faq-item reveal"><button class="faq-q">Que es la canalización personal?</button><div class="faq-a"><p>Cuando adoptas, te pedimos que compartas tu momento de vida. Con eso, Thibisay canaliza un mensaje que es <strong>solo para vos</strong>. No es genérico: es una carta personal de tu guardián.</p></div></div>
      <div class="faq-item reveal"><button class="faq-q">Cuánto tarda en llegar?</button><div class="faq-a"><p><strong>Uruguay:</strong> 5 a 7 días via DAC. <strong>Internacional:</strong> 5 a 10 días via DHL Express, puerta a puerta con seguimiento.</p></div></div>
      <div class="faq-item reveal"><button class="faq-q">Es seguro comprar en está web?</button><div class="faq-a"><p>Totalmente. <strong>Certificado SSL, pasarela certificada, cumplimiento PCI DSS.</strong> Tu información financiera nunca pasa por nosotros. Más de 15.000 clientes felices.</p></div></div>
      <div class="faq-item reveal"><button class="faq-q">Puedo regalarlo?</button><div class="faq-a"><p><strong>Si!</strong> Tenés dos opciones: <strong>Regalo NO sorpresa</strong> - le mandamos el formulario a la persona. <strong>Regalo sorpresa</strong> - vos completás un formulario especial.</p></div></div>
      <div class="faq-item reveal"><button class="faq-q">Por que ese precio?</button><div class="faq-a"><p>Cada guardián toma entre <strong>20 y 60 horas de trabajo manual</strong>: modelado, secado, pintado, detalles, cristales reales, preparación energética. Más la canalización personal.</p></div></div>
      <div class="faq-more reveal"><a href="/faq/">VER TODAS LAS PREGUNTAS &rarr;</a></div>
    </div>
  </div>
</section>

<!-- ═══ 13. CTA FINAL ═══ -->
<section id="cta-final">
  <div class="wrap">
    <h2 class="reveal">Cada guardián existe <em>una sola vez</em></h2>
    <p class="sub reveal">No hay reposición. No hay "después lo veo".<br>Cuando se adopta, desaparece para siempre.</p>
    <div class="cta-btns reveal">
      <a href="/shop/" class="btn-gold">ENCONTRAR MI GUARDIÁN</a>
      <a href="/descubri-que-duende-te-elige/" class="btn-outline">HACER EL TEST</a>
    </div>
    <div class="trust-row reveal">
      <span>Envíos a todo el mundo</span>
      <span>Pago 100% seguro</span>
      <span>Pieza única hecha a mano</span>
    </div>
  </div>
</section>

<!-- ═══ TOAST ═══ -->
<div id="toast"><div class="toast-dot"></div><div><div class="toast-t" id="tt"></div><div class="toast-tm" id="ttm"></div></div></div>

<!-- ═══ WHATSAPP ═══ -->
<a href="https://wa.me/59899123456" class="wa-float" title="WhatsApp">&#128172;</a>
<div class="sticky-cta"><a href="https://wa.me/59899123456">&#128172; ESCRIBINOS POR WHATSAPP</a></div>

<?php wp_footer(); ?>

<script>
// ═══ PARTICLES ═══
(function(){const c=document.getElementById('particles');if(!c)return;const x=c.getContext('2d');let W,H;function rz(){W=c.width=innerWidth;H=c.height=document.body.scrollHeight}rz();addEventListener('resize',rz);const ps=[];class P{constructor(){this.x=Math.random()*W;this.y=Math.random()*H;this.r=Math.random()*1.3+.3;this.s=Math.random()*.18+.04;this.d=(Math.random()-.5)*.14;this.a=Math.random()*.3+.08;this.p=Math.random()*Math.PI*2;this.g=Math.random()>.48}update(){this.y-=this.s;this.x+=this.d+Math.sin(this.p*.3)*.1;this.p+=.01;if(this.y<-10){this.y=H+10;this.x=Math.random()*W}}draw(){const a=this.a*(.5+.5*Math.sin(this.p));x.beginPath();x.arc(this.x,this.y,this.r,0,Math.PI*2);x.fillStyle=this.g?`rgba(184,151,58,${a})`:`rgba(140,170,100,${a*.3})`;x.fill();if(this.r>1&&this.g){x.beginPath();x.arc(this.x,this.y,this.r*3,0,Math.PI*2);x.fillStyle=`rgba(184,151,58,${a*.06})`;x.fill()}}}for(let i=0;i<55;i++)ps.push(new P());function an(){x.clearRect(0,0,W,H);ps.forEach(p=>{p.update();p.draw()});requestAnimationFrame(an)}an();let rt;addEventListener('scroll',()=>{clearTimeout(rt);rt=setTimeout(rz,200)})})();

// ═══ CURSOR GLOW ═══
const gl=document.getElementById('cursor-glow');
if(gl&&matchMedia('(hover:hover)').matches)document.addEventListener('mousemove',e=>{gl.style.left=e.clientX+'px';gl.style.top=e.clientY+'px'});

// ═══ SCROLL REVEAL ═══
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')})},{threshold:.06,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%8)*.05+'s';io.observe(el)});

// ═══ FAQ ═══
document.querySelectorAll('.faq-q').forEach(b=>{b.addEventListener('click',()=>{const it=b.parentElement;const was=it.classList.contains('open');document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));if(!was)it.classList.add('open')})});

// ═══ TOAST ═══
const toast=document.getElementById('toast'),tt=document.getElementById('tt'),ttm=document.getElementById('ttm');
const td=[
  {n:'Valentina',c:'Buenos Aires',p:'Ailin',t:'hace 2 min'},
  {n:'Sofia',c:'Madrid',p:'Theron',t:'hace 5 min'},
  {n:'Camila',c:'Ciudad de Mexico',p:'Nimue',t:'hace 9 min'},
  {n:'Lucia',c:'Santiago',p:'Oberon',t:'hace 14 min'},
  {n:'Florencia',c:'Montevideo',p:'Lysander',t:'hace 20 min'},
  {n:'Ana Paula',c:'Sao Paulo',p:'Cerridwen',t:'hace 26 min'},
];
let ti=0;
function showT(){const d=td[ti%td.length];tt.innerHTML='<strong>'+d.n+'</strong> de '+d.c+' adopto a <strong>'+d.p+'</strong>';ttm.textContent=d.t;toast.classList.add('show');setTimeout(()=>{toast.classList.remove('show');ti++},4200)}
setTimeout(()=>{showT();setInterval(()=>setTimeout(showT,Math.random()*10e3+16e3),24e3)},7e3);

// ═══ MOBILE MENU ═══
const menuToggle=document.getElementById('menuToggle');
const mobileMenu=document.getElementById('mobileMenu');
if(menuToggle&&mobileMenu){
  menuToggle.addEventListener('click',()=>{
    mobileMenu.classList.toggle('active');
    menuToggle.textContent=mobileMenu.classList.contains('active')?'✕':'☰';
  });
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mobileMenu.classList.remove('active');
    menuToggle.textContent='☰';
  }));
}

// ═══ VIDEO FALLBACK ═══
const vid=document.querySelector('#hero video');
const fb=document.querySelector('.poster-fb');
if(vid)vid.addEventListener('playing',()=>{if(fb)fb.style.opacity='0'});

// ═══ PARTICLES RESIZE ON SCROLL ═══
let prt;addEventListener('scroll',()=>{clearTimeout(prt);prt=setTimeout(()=>{const c=document.getElementById('particles');if(c){c.width=innerWidth;c.height=document.body.scrollHeight}},200)});

// ═══ OCULTAR OVERLAY DE PAÍS INMEDIATAMENTE ═══
(function(){
  var hideOverlay=function(){
    var o=document.getElementById('dob-overlay');
    if(o){o.style.display='none';o.style.visibility='hidden';o.style.opacity='0';o.remove();}
  };
  hideOverlay();
  document.addEventListener('DOMContentLoaded',hideOverlay);
  window.addEventListener('load',hideOverlay);
  setTimeout(hideOverlay,0);setTimeout(hideOverlay,50);setTimeout(hideOverlay,100);setTimeout(hideOverlay,500);
  // Observar por si se crea después
  var obs=new MutationObserver(function(m){
    m.forEach(function(mut){
      mut.addedNodes.forEach(function(n){
        if(n.id==='dob-overlay')n.remove();
      });
    });
  });
  if(document.body)obs.observe(document.body,{childList:true,subtree:true});
})();

// ═══ FORZAR ESTILOS DE BOTONES - resistir cambios externos ═══
function fixButtons(){
  document.querySelectorAll('.btn-gold, .btn-ghost, a.btn-gold, a.btn-ghost').forEach(btn=>{
    btn.style.setProperty('background-color','#1a1a1a','important');
    btn.style.setProperty('color','#ffffff','important');
    btn.style.setProperty('-webkit-text-fill-color','#ffffff','important');
    btn.style.setProperty('border','1px solid rgba(255,255,255,0.1)','important');
    btn.removeAttribute('data-elementor-lightbox');
    btn.classList.remove('elementor-animation-grow','elementor-button','e-transform');
  });
}
// Ejecutar inmediatamente
fixButtons();
// Ejecutar después de que todo cargue
window.addEventListener('load',()=>{fixButtons();setTimeout(fixButtons,100);setTimeout(fixButtons,500);setTimeout(fixButtons,1000)});
// Observar cambios en el DOM y re-aplicar
const btnObserver=new MutationObserver(()=>fixButtons());
document.querySelectorAll('.btn-gold, .btn-ghost').forEach(btn=>{
  btnObserver.observe(btn,{attributes:true,attributeFilter:['style','class']});
});
// También interceptar clicks para prevenir cambios
document.querySelectorAll('.btn-gold, .btn-ghost').forEach(btn=>{
  btn.addEventListener('mousedown',e=>{setTimeout(fixButtons,0);setTimeout(fixButtons,50)});
  btn.addEventListener('mouseup',e=>{setTimeout(fixButtons,0);setTimeout(fixButtons,50)});
  btn.addEventListener('focus',e=>{setTimeout(fixButtons,0)});
  btn.addEventListener('blur',e=>{setTimeout(fixButtons,0)});
});
</script>
<!-- Estilos finales para ganar sobre todo -->
<style id="btn-force-final">
.btn-gold,.btn-ghost,a.btn-gold,a.btn-ghost,.hero-btns .btn-gold,.hero-btns .btn-ghost,
.hero-btns a.btn-gold,.hero-btns a.btn-ghost,body .btn-gold,body .btn-ghost,
html body .btn-gold,html body .btn-ghost{
  background-color:#1a1a1a!important;
  background:#1a1a1a!important;
  color:#ffffff!important;
  -webkit-text-fill-color:#ffffff!important;
  border:1px solid rgba(255,255,255,0.1)!important;
}
.btn-gold:hover,.btn-ghost:hover,a.btn-gold:hover,a.btn-ghost:hover{
  background-color:#333333!important;
  background:#333333!important;
  color:#ffffff!important;
  -webkit-text-fill-color:#ffffff!important;
}
.btn-gold:active,.btn-ghost:active,.btn-gold:focus,.btn-ghost:focus,
a.btn-gold:active,a.btn-ghost:active,a.btn-gold:focus,a.btn-ghost:focus{
  background-color:#1a1a1a!important;
  background:#1a1a1a!important;
  color:#ffffff!important;
  -webkit-text-fill-color:#ffffff!important;
  outline:none!important;
  box-shadow:none!important;
}
</style>
</body>
</html>
        <?php
    }
}

// Inicializar siempre - este plugin tiene prioridad sobre Elementor
new Duendes_Homepage_V4();

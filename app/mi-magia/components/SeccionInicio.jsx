'use client';
import { WORDPRESS_URL, getRango, getSiguienteRango } from './constants';
import { SenalDelDia } from '../nuevas-funciones';
import TestGuardian from '../test-guardian';
import { DashboardGamificacion, ColeccionBadges, MisionesPanel, LeaderboardRachas } from '../gamificacion-components';
import { BadgeNivelAcceso, BannerUpgrade, BannerCompletarPerfil } from './AccesoRestringido';
import { BannerPromociones } from './BannerPromociones';
import CofreDiario from './CofreDiario';
import Referidos from '../referidos';

// ═══════════════════════════════════════════════════════════════
// INICIO
// ═══════════════════════════════════════════════════════════════

export default function SeccionInicio({ usuario, ir, token, setUsuario }) {
  const rango = getRango(usuario?.gastado);
  const siguiente = getSiguienteRango(usuario?.gastado);
  const progreso = siguiente ? ((usuario?.gastado || 0) / siguiente.min) * 100 : 100;

  // Frases de validación rotativas según intereses del usuario
  const validaciones = {
    'Me siento sola': 'Tu guardián siente tu soledad. No viniste a caminar sola.',
    'Nada me alcanza': 'La abundancia no es acumulación. Es flujo. Tu guardián te enseñará.',
    'Repito patrones': 'Los patrones que se repiten no son mala suerte. Son señales.',
    'Quiero sanar': 'No necesitás sanar sola. Tu guardián ya conoce tus heridas.',
    'Busco protección': 'Hay algo cuidándote desde antes de que supieras que existía.',
    'Necesito claridad': 'La claridad no llega pensando. Llega sintiendo. Dejate guiar.',
    'Quiero paz': 'La paz que buscás afuera ya existe adentro. Te ayudamos a encontrarla.',
    'Busco amor': 'El amor empieza cuando te reconocés. Tu guardián te ve.',
  };
  const interesUsuario = usuario?.intereses?.[0];
  const fraseValidacion = interesUsuario && validaciones[interesUsuario] ? validaciones[interesUsuario] : 'Tu guardián ya sabe que llegaste. Ahora solo falta que lo escuches.';

  return (
    <div className="sec">
      {/* HERO CON VALIDACIÓN EMOCIONAL */}
      <div className="banner banner-neuro">
        <div className="banner-glow"></div>
        <div className="banner-rango">
          <span className="rango-icono">{rango.icono}</span>
          <div className="rango-info">
            <span className="rango-nombre">{rango.nombre}</span>
            <span className="rango-ben">{rango.beneficio}</span>
          </div>
          <BadgeNivelAcceso usuario={usuario} />
        </div>
        <h1 className="hero-title">{usuario?.nombrePreferido}, te estaba esperando.</h1>
        <p className="hero-validation">{fraseValidacion}</p>
        {siguiente && (
          <div className="progreso-rango">
            <div className="progreso-bar"><div className="progreso-fill" style={{width: `${Math.min(progreso, 100)}%`}}></div></div>
            <small>${usuario?.gastado || 0} / ${siguiente.min} para {siguiente.icono} {siguiente.nombre}</small>
          </div>
        )}
      </div>

      {/* ══════ BANNER DE PROMOCIONES ══════ */}
      <BannerPromociones usuario={usuario} ubicacion="mi-magia-inicio" />

      {/* ══════ BANNER DE UPGRADE (si no es Círculo) ══════ */}
      <BannerUpgrade
        usuario={usuario}
        onActivarTrial={(data) => {
          if (setUsuario && data.usuario) {
            setUsuario(prev => ({
              ...prev,
              esCirculo: data.usuario.esCirculo,
              circuloExpira: data.usuario.circuloExpira,
              runas: data.usuario.runas
            }));
          }
        }}
      />

      {/* ══════ BANNER COMPLETAR PERFIL (si perfil incompleto) ══════ */}
      <BannerCompletarPerfil
        usuario={usuario}
        onCompletar={() => ir('completar_perfil')}
      />

      {/* SEÑAL DEL DÍA */}
      <SenalDelDia usuario={usuario} />

      {/* ══════ COFRE DIARIO - GAMIFICACIÓN ══════ */}
      <CofreDiario
        usuario={usuario}
        token={token}
        onRunasGanadas={(runas) => {
          if (setUsuario) {
            setUsuario(prev => ({
              ...prev,
              runas: (prev?.runas || 0) + runas
            }));
          }
        }}
      />

      {/* ══════ DASHBOARD DE GAMIFICACIÓN ══════ */}
      <div className="gamificacion-section">
        <h2 className="seccion-titulo">
          <span className="titulo-icono">⚔️</span>
          Tu Progreso Mágico
        </h2>
        <DashboardGamificacion usuario={usuario} token={token} />
      </div>

      {/* ══════ MISIONES ══════ */}
      <div className="gamificacion-section">
        <h2 className="seccion-titulo">
          <span className="titulo-icono">📜</span>
          Misiones
        </h2>
        <MisionesPanel token={token} />
      </div>

      {/* ══════ BADGES ══════ */}
      <div className="gamificacion-section">
        <h2 className="seccion-titulo">
          <span className="titulo-icono">🏆</span>
          Tu Colección de Badges
        </h2>
        <ColeccionBadges token={token} />
      </div>

      {/* ══════ LEADERBOARD ══════ */}
      <LeaderboardRachas token={token} />

      {/* ══════ SISTEMA DE REFERIDOS ══════ */}
      <Referidos usuario={usuario} token={token} />

      {/* ══════ TEST DEL GUARDIÁN - EMBEBIDO EN INICIO ══════ */}
      <div className="test-guardian-inicio-wrapper">
        <TestGuardian
          usuario={usuario}
          onComplete={(resultado) => {
            // Recargar usuario con nuevo testGuardian
            window.location.reload();
          }}
        />
      </div>

      {/* STATS CON SIGNIFICADO */}
      <div className="stats-g">
        <div className="stat-c" onClick={() => ir('canalizaciones')}><div className="stat-n">{(usuario?.guardianes?.length || 0) + (usuario?.lecturas?.length || 0)}</div><div className="stat-t">Conexiones</div></div>
        <div className="stat-c" onClick={() => ir('jardin')}><div className="stat-n">{usuario?.treboles || 0}</div><div className="stat-t">Tréboles</div></div>
        <div className="stat-c stat-runas" onClick={() => ir('tienda_runas')}><div className="stat-n">{usuario?.runas || 0}</div><div className="stat-t">Runas</div><div className="stat-plus">+</div></div>
        <div className="stat-c" onClick={() => ir('grimorio')}><div className="stat-n">{usuario?.diario?.length || 0}</div><div className="stat-t">Escritos</div></div>
      </div>

      {/* CATEGORÍAS POR DOLOR/NECESIDAD */}
      <div className="dolor-section">
        <h2 className="dolor-titulo">¿Qué necesitás sanar?</h2>
        <div className="dolor-cards">
          <a href={`${WORDPRESS_URL}/categoria-producto/amor/`} target="_blank" rel="noopener" className="dolor-card dolor-amor">
            <span className="dolor-icon">◈</span>
            <strong>Me siento sola</strong>
            <small>Guardianes de Conexión</small>
          </a>
          <a href={`${WORDPRESS_URL}/categoria-producto/abundancia/`} target="_blank" rel="noopener" className="dolor-card dolor-abundancia">
            <span className="dolor-icon">✦</span>
            <strong>Nada me alcanza</strong>
            <small>Guardianes de Abundancia</small>
          </a>
          <a href={`${WORDPRESS_URL}/categoria-producto/proteccion/`} target="_blank" rel="noopener" className="dolor-card dolor-proteccion">
            <span className="dolor-icon">◇</span>
            <strong>Tengo miedo</strong>
            <small>Guardianes Protectores</small>
          </a>
          <a href={`${WORDPRESS_URL}/categoria-producto/sanacion/`} target="_blank" rel="noopener" className="dolor-card dolor-sanacion">
            <span className="dolor-icon">❧</span>
            <strong>Quiero sanar</strong>
            <small>Guardianes Sanadores</small>
          </a>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS REESCRITOS */}
      <div className="accesos-g">
        <button className="acceso acceso-destacado" onClick={() => ir('experiencias')}><span>✦</span><strong>Experiencias Mágicas</strong><small>30+ lecturas, estudios y rituales</small></button>
        <button className="acceso acceso-runas" onClick={() => ir('experiencias_catalogo')}><span>ᚱ</span><strong>Tienda de Runas</strong><small>Obtené runas para tus lecturas</small></button>
        <button className="acceso acceso-circulo" onClick={() => ir('tienda_membresias')}><span>⭐</span><strong>Círculo de Duendes</strong><small>Membresía con beneficios exclusivos</small></button>
        <button className="acceso" onClick={() => ir('test_elemental')}><span>◈</span><strong>Descubrir quién me eligió</strong><small>Test de elemento y guardián</small></button>
        <button className="acceso" onClick={() => ir('regalos')}><span>❤</span><strong>Regalar magia a alguien</strong><small>Que otro sienta lo que vos sentiste</small></button>
      </div>

      {/* MICRO-VALIDACIÓN */}
      <div className="micro-validation">
        <p>Si llegaste hasta acá, no fue casualidad.</p>
        <p className="micro-highlight">El guardián te encuentra. No al revés.</p>
      </div>

      {!usuario?.esCirculo && (
        <a href="/mi-magia/circulo" className="banner-circ banner-circ-neuro">
          <span className="circ-glow"></span>
          <span>★</span>
          <div>
            <h3>349 elegidas ya son parte del Círculo</h3>
            <p>No es una membresía. Es una hermandad.</p>
          </div>
          <span className="badge badge-pulse">UNIRME</span>
        </a>
      )}

      {/* FOMO ESPIRITUAL */}
      <div className="fomo-box">
        <div className="fomo-content">
          <span className="fomo-icon">ᛉ</span>
          <div>
            <p className="fomo-main">Cada guardián existe una sola vez.</p>
            <p className="fomo-sub">Si se vende, no vuelve. No es marketing. Es canalización.</p>
          </div>
        </div>
        <a href={`${WORDPRESS_URL}/shop/`} target="_blank" rel="noopener" className="fomo-cta">Conocer a mi guardián</a>
      </div>

      {/* Banner Promociones */}
      <div className="banner-promo" onClick={() => ir('promociones')}>
        <span className="promo-icon-banner">✦</span>
        <div className="promo-banner-content">
          <h3>Oportunidades mágicas</h3>
          <p>Ofertas exclusivas que aparecen y desaparecen.</p>
        </div>
        <span className="promo-arrow">→</span>
      </div>

      <div className="info-box info-box-minimal">
        <h3>Tu espacio explicado</h3>
        <div className="info-grid">
          <div><span>☘</span><h4>Tréboles</h4><p>Se ganan comprando. Canjealos por descuentos, envíos gratis, regalos especiales.</p></div>
          <div><span>ᚱ</span><h4>Runas</h4><p>Moneda mágica para experiencias. Tiradas, lecturas, conexiones profundas.</p></div>
          <div><span>▣</span><h4>Grimorio</h4><p>Tu diario espiritual. Todo lo que recibís queda guardado para siempre.</p></div>
        </div>
      </div>
    </div>
  );
}

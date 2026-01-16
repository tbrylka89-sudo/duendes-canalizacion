'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING DEL CÍRCULO - Recopilación de datos del miembro
// 4 pasos para conocer mejor al miembro y personalizar su experiencia
// ═══════════════════════════════════════════════════════════════════════════════

export default function Onboarding({ email, nombreInicial, onComplete }) {
  const [paso, setPaso] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [datos, setDatos] = useState({
    nombrePreferido: nombreInicial || '',
    pronombres: '',
    fechaNacimiento: '',
    comoLlegaste: '',
    guardiansAdoptados: '',
    areasInteres: [],
    practicaEspiritual: '',
    coleccionCristales: '',
    cursosAnteriores: '',
    tipoContenido: [],
    objetivoPrincipal: ''
  });

  function handleChange(campo, valor) {
    setDatos(prev => ({ ...prev, [campo]: valor }));
  }

  function toggleArrayItem(campo, item) {
    setDatos(prev => {
      const arr = prev[campo] || [];
      if (arr.includes(item)) {
        return { ...prev, [campo]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [campo]: [...arr, item] };
      }
    });
  }

  async function handleFinalizar() {
    setGuardando(true);
    try {
      const res = await fetch('/api/circulo/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          perfil: {
            ...datos,
            onboardingCompletado: true,
            fechaOnboarding: new Date().toISOString()
          }
        })
      });
      const result = await res.json();
      if (result.success) {
        onComplete(datos);
      }
    } catch (error) {
      console.error('Error guardando perfil:', error);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="onboarding">
      <div className="contenedor">
        <div className="pasos-indicador">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`paso-dot ${paso >= num ? 'activo' : ''} ${paso === num ? 'actual' : ''}`}>
              {num}
            </div>
          ))}
        </div>

        {paso === 1 && (
          <div className="paso-contenido">
            <h2>Bienvenido/a al Círculo</h2>
            <p className="subtitulo">Antes de entrar, queremos conocerte mejor</p>

            <div className="campo">
              <label>¿Cómo te gustaría que te llamemos?</label>
              <input type="text" value={datos.nombrePreferido} onChange={e => handleChange('nombrePreferido', e.target.value)} placeholder="Tu nombre o apodo preferido" />
            </div>

            <div className="campo">
              <label>¿Con qué pronombres te sentís cómodo/a?</label>
              <div className="opciones-grupo">
                {[{ valor: 'ella', texto: 'Ella' }, { valor: 'el', texto: 'Él' }, { valor: 'elle', texto: 'Elle' }, { valor: 'no-decir', texto: 'Prefiero no decir' }].map(op => (
                  <button key={op.valor} type="button" className={`opcion ${datos.pronombres === op.valor ? 'seleccionada' : ''}`} onClick={() => handleChange('pronombres', op.valor)}>{op.texto}</button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>Fecha de nacimiento</label>
              <input type="date" value={datos.fechaNacimiento} onChange={e => handleChange('fechaNacimiento', e.target.value)} />
              <span className="campo-nota">Para calcular tu signo y número de vida</span>
            </div>

            <button className="btn-siguiente" onClick={() => setPaso(2)} disabled={!datos.nombrePreferido}>Siguiente</button>
          </div>
        )}

        {paso === 2 && (
          <div className="paso-contenido">
            <h2>Tu historia con los Duendes</h2>
            <p className="subtitulo">Nos encanta saber cómo llegaste hasta acá</p>

            <div className="campo">
              <label>¿Cómo llegaste a Duendes del Uruguay?</label>
              <div className="opciones-vertical">
                {[{ valor: 'instagram', texto: 'Por Instagram' }, { valor: 'recomendacion', texto: 'Me lo recomendó alguien' }, { valor: 'busqueda', texto: 'Buscando cristales o guardianes' }, { valor: 'feria', texto: 'En una feria o evento' }, { valor: 'otro', texto: 'De otra forma' }].map(op => (
                  <button key={op.valor} type="button" className={`opcion-vertical ${datos.comoLlegaste === op.valor ? 'seleccionada' : ''}`} onClick={() => handleChange('comoLlegaste', op.valor)}>{op.texto}</button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Cuántos guardianes tenés?</label>
              <div className="opciones-grupo">
                {[{ valor: '0', texto: 'Ninguno aún' }, { valor: '1-3', texto: '1 a 3' }, { valor: '4-10', texto: '4 a 10' }, { valor: 'mas-10', texto: 'Más de 10' }].map(op => (
                  <button key={op.valor} type="button" className={`opcion ${datos.guardiansAdoptados === op.valor ? 'seleccionada' : ''}`} onClick={() => handleChange('guardiansAdoptados', op.valor)}>{op.texto}</button>
                ))}
              </div>
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(1)}>Anterior</button>
              <button className="btn-siguiente" onClick={() => setPaso(3)}>Siguiente</button>
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="paso-contenido">
            <h2>Tus intereses mágicos</h2>
            <p className="subtitulo">Para mostrarte contenido que realmente te interese</p>

            <div className="campo">
              <label>¿Qué áreas te interesan más? (podés elegir varias)</label>
              <div className="opciones-grid">
                {[{ valor: 'abundancia', texto: 'Abundancia y prosperidad' }, { valor: 'proteccion', texto: 'Protección energética' }, { valor: 'amor', texto: 'Amor y relaciones' }, { valor: 'sanacion', texto: 'Sanación personal' }, { valor: 'intuicion', texto: 'Intuición y espiritualidad' }, { valor: 'naturaleza', texto: 'Conexión con la naturaleza' }].map(op => (
                  <button key={op.valor} type="button" className={`opcion-check ${datos.areasInteres.includes(op.valor) ? 'seleccionada' : ''}`} onClick={() => toggleArrayItem('areasInteres', op.valor)}>{op.texto}</button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Con qué frecuencia hacés alguna práctica espiritual?</label>
              <div className="opciones-vertical">
                {[{ valor: 'nunca', texto: 'Recién estoy empezando' }, { valor: 'ocasional', texto: 'De vez en cuando' }, { valor: 'regular', texto: 'Regularmente (semanal)' }, { valor: 'diario', texto: 'Todos los días' }].map(op => (
                  <button key={op.valor} type="button" className={`opcion-vertical ${datos.practicaEspiritual === op.valor ? 'seleccionada' : ''}`} onClick={() => handleChange('practicaEspiritual', op.valor)}>{op.texto}</button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Coleccionás cristales?</label>
              <div className="opciones-grupo">
                {[{ valor: 'no', texto: 'No' }, { valor: 'algunos', texto: 'Tengo algunos' }, { valor: 'coleccion', texto: 'Tengo varios' }, { valor: 'apasionado', texto: 'Me encantan' }].map(op => (
                  <button key={op.valor} type="button" className={`opcion ${datos.coleccionCristales === op.valor ? 'seleccionada' : ''}`} onClick={() => handleChange('coleccionCristales', op.valor)}>{op.texto}</button>
                ))}
              </div>
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(2)}>Anterior</button>
              <button className="btn-siguiente" onClick={() => setPaso(4)}>Siguiente</button>
            </div>
          </div>
        )}

        {paso === 4 && (
          <div className="paso-contenido">
            <h2>Un último paso</h2>
            <p className="subtitulo">Para personalizar tu experiencia en el Círculo</p>

            <div className="campo">
              <label>¿Hiciste algún curso o taller espiritual antes?</label>
              <div className="opciones-vertical">
                {[{ valor: 'no', texto: 'No, es mi primera vez' }, { valor: 'gratis', texto: 'Solo gratuitos online' }, { valor: 'pagos', texto: 'Sí, cursos online pagos' }, { valor: 'presencial', texto: 'Sí, talleres presenciales' }, { valor: 'varios', texto: 'Sí, varios de todo tipo' }].map(op => (
                  <button key={op.valor} type="button" className={`opcion-vertical ${datos.cursosAnteriores === op.valor ? 'seleccionada' : ''}`} onClick={() => handleChange('cursosAnteriores', op.valor)}>{op.texto}</button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Qué tipo de contenido te gusta más? (podés elegir varios)</label>
              <div className="opciones-grid">
                {[{ valor: 'lecturas', texto: 'Lecturas y textos' }, { valor: 'audios', texto: 'Audios y meditaciones' }, { valor: 'videos', texto: 'Videos' }, { valor: 'rituales', texto: 'Rituales prácticos' }, { valor: 'lives', texto: 'Lives en vivo' }].map(op => (
                  <button key={op.valor} type="button" className={`opcion-check ${datos.tipoContenido.includes(op.valor) ? 'seleccionada' : ''}`} onClick={() => toggleArrayItem('tipoContenido', op.valor)}>{op.texto}</button>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>¿Cuál es tu objetivo principal al unirte al Círculo?</label>
              <textarea value={datos.objetivoPrincipal} onChange={e => handleChange('objetivoPrincipal', e.target.value)} placeholder="Contanos qué buscás, qué esperás encontrar..." rows={3} />
            </div>

            <div className="navegacion">
              <button className="btn-anterior" onClick={() => setPaso(3)}>Anterior</button>
              <button className="btn-finalizar" onClick={handleFinalizar} disabled={guardando}>{guardando ? 'Guardando...' : 'Entrar al Círculo'}</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{\`
        .onboarding { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(ellipse at 30% 20%, rgba(107, 33, 168, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), linear-gradient(180deg, #050508 0%, #0a0a0a 100%); padding: 40px 20px; font-family: 'Cormorant Garamond', serif; }
        .contenedor { width: 100%; max-width: 600px; background: rgba(20, 20, 25, 0.95); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); }
        .pasos-indicador { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; }
        .paso-dot { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.3); transition: all 0.3s ease; }
        .paso-dot.activo { background: rgba(212, 175, 55, 0.2); color: #d4af37; }
        .paso-dot.actual { background: linear-gradient(135deg, #d4af37, #b8972e); color: #0a0a0a; box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
        .paso-contenido h2 { font-family: 'Tangerine', cursive; font-size: 48px; color: #d4af37; text-align: center; margin-bottom: 10px; }
        .subtitulo { text-align: center; color: rgba(255, 255, 255, 0.6); font-size: 16px; margin-bottom: 35px; }
        .campo { margin-bottom: 25px; }
        .campo label { display: block; color: #ffffff; font-size: 16px; margin-bottom: 12px; }
        .campo input[type="text"], .campo input[type="date"], .campo textarea { width: 100%; padding: 15px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; color: #ffffff; font-size: 16px; font-family: 'Cormorant Garamond', serif; transition: all 0.3s ease; box-sizing: border-box; }
        .campo input:focus, .campo textarea:focus { outline: none; border-color: #d4af37; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
        .campo-nota { display: block; font-size: 13px; color: rgba(255, 255, 255, 0.4); margin-top: 8px; }
        .opciones-grupo { display: flex; flex-wrap: wrap; gap: 10px; }
        .opcion { padding: 12px 20px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 25px; color: rgba(255, 255, 255, 0.7); font-size: 14px; font-family: 'Cormorant Garamond', serif; cursor: pointer; transition: all 0.3s ease; }
        .opcion:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); }
        .opcion.seleccionada { background: linear-gradient(135deg, #d4af37, #b8972e); color: #0a0a0a; border-color: #d4af37; font-weight: 600; }
        .opciones-vertical { display: flex; flex-direction: column; gap: 10px; }
        .opcion-vertical { padding: 15px 20px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; color: rgba(255, 255, 255, 0.7); font-size: 15px; font-family: 'Cormorant Garamond', serif; cursor: pointer; transition: all 0.3s ease; text-align: left; }
        .opcion-vertical:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); }
        .opcion-vertical.seleccionada { background: rgba(212, 175, 55, 0.15); border-color: #d4af37; color: #d4af37; }
        .opciones-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        @media (max-width: 500px) { .opciones-grid { grid-template-columns: 1fr; } }
        .opcion-check { padding: 15px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; color: rgba(255, 255, 255, 0.7); font-size: 14px; font-family: 'Cormorant Garamond', serif; cursor: pointer; transition: all 0.3s ease; text-align: center; }
        .opcion-check:hover { background: rgba(255, 255, 255, 0.1); }
        .opcion-check.seleccionada { background: rgba(212, 175, 55, 0.2); border-color: #d4af37; color: #d4af37; }
        .navegacion { display: flex; justify-content: space-between; margin-top: 30px; gap: 15px; }
        .btn-anterior { padding: 15px 30px; background: transparent; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 25px; color: rgba(255, 255, 255, 0.7); font-size: 14px; font-family: 'Cinzel', serif; cursor: pointer; transition: all 0.3s ease; }
        .btn-anterior:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.5); }
        .btn-siguiente, .btn-finalizar { flex: 1; padding: 15px 30px; background: linear-gradient(135deg, #d4af37, #b8972e); border: none; border-radius: 25px; color: #0a0a0a; font-size: 14px; font-family: 'Cinzel', serif; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease; }
        .btn-siguiente:disabled, .btn-finalizar:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-siguiente:not(:disabled):hover, .btn-finalizar:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3); }
        @media (max-width: 600px) { .contenedor { padding: 30px 20px; } .paso-contenido h2 { font-size: 38px; } .pasos-indicador { gap: 15px; } .paso-dot { width: 35px; height: 35px; font-size: 14px; } }
      \`}</style>
    </div>
  );
}

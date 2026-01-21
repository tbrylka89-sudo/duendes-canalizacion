import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ═══════════════════════════════════════════════════════════════════════════════
// API: VERIFICAR TODAS LAS CONEXIONES
// Comprueba WordPress, Anthropic, OpenAI, Replicate, Gemini, Vercel KV
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function GET() {
  const resultados = {
    timestamp: new Date().toISOString(),
    conexiones: {}
  };

  // 1. Verificar Vercel KV
  try {
    await kv.set('test:ping', Date.now());
    const ping = await kv.get('test:ping');
    await kv.del('test:ping');
    resultados.conexiones.vercelKV = {
      estado: 'ok',
      mensaje: 'Conexión activa'
    };
  } catch (error) {
    resultados.conexiones.vercelKV = {
      estado: 'error',
      mensaje: error.message
    };
  }

  // 2. Verificar WordPress/WooCommerce
  const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
  const WOO_KEY = process.env.WC_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    resultados.conexiones.wordpress = {
      estado: 'no_configurado',
      mensaje: 'Credenciales WC_CONSUMER_KEY y/o WC_CONSUMER_SECRET no configuradas',
      url: WOO_URL
    };
  } else {
    try {
      const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
      const res = await fetch(`${WOO_URL}/wp-json/wc/v3/system_status`, {
        headers: { 'Authorization': `Basic ${auth}` },
        signal: AbortSignal.timeout(10000)
      });

      if (res.ok) {
        const status = await res.json();
        resultados.conexiones.wordpress = {
          estado: 'ok',
          mensaje: 'Conexión activa',
          version: status.environment?.wp_version,
          woocommerce: status.environment?.version,
          url: WOO_URL
        };
      } else {
        resultados.conexiones.wordpress = {
          estado: 'error',
          mensaje: `WordPress respondió ${res.status}`,
          url: WOO_URL
        };
      }
    } catch (error) {
      resultados.conexiones.wordpress = {
        estado: 'error',
        mensaje: error.message,
        url: WOO_URL
      };
    }
  }

  // 3. Verificar WordPress Media API
  const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;
  if (!WP_APP_PASSWORD) {
    resultados.conexiones.wordpressMedia = {
      estado: 'no_configurado',
      mensaje: 'WP_APP_PASSWORD no configurada (opcional, necesaria para subir archivos)'
    };
  } else {
    try {
      const auth = Buffer.from(`${process.env.WP_USER || 'admin'}:${WP_APP_PASSWORD}`).toString('base64');
      const res = await fetch(`${WOO_URL}/wp-json/wp/v2/media?per_page=1`, {
        headers: { 'Authorization': `Basic ${auth}` },
        signal: AbortSignal.timeout(10000)
      });

      if (res.ok) {
        resultados.conexiones.wordpressMedia = {
          estado: 'ok',
          mensaje: 'Acceso a Media Library activo'
        };
      } else {
        resultados.conexiones.wordpressMedia = {
          estado: 'error',
          mensaje: `WordPress Media respondió ${res.status}`
        };
      }
    } catch (error) {
      resultados.conexiones.wordpressMedia = {
        estado: 'error',
        mensaje: error.message
      };
    }
  }

  // 4. Verificar Anthropic (Claude)
  if (!process.env.ANTHROPIC_API_KEY) {
    resultados.conexiones.anthropic = {
      estado: 'no_configurado',
      mensaje: 'ANTHROPIC_API_KEY no configurada'
    };
  } else {
    try {
      const anthropic = new Anthropic();
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Di "ok"' }]
      });

      if (response.content?.[0]?.text) {
        resultados.conexiones.anthropic = {
          estado: 'ok',
          mensaje: 'API de Claude funcionando',
          modelo: 'claude-sonnet-4-20250514'
        };
      }
    } catch (error) {
      resultados.conexiones.anthropic = {
        estado: 'error',
        mensaje: error.message
      };
    }
  }

  // 5. Verificar OpenAI (DALL-E)
  if (!process.env.OPENAI_API_KEY) {
    resultados.conexiones.openai = {
      estado: 'no_configurado',
      mensaje: 'OPENAI_API_KEY no configurada (opcional, para generación de imágenes)'
    };
  } else {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.models.list();

      if (response.data) {
        const tieneDalle = response.data.some(m => m.id.includes('dall-e'));
        resultados.conexiones.openai = {
          estado: 'ok',
          mensaje: 'API de OpenAI funcionando',
          dalle: tieneDalle ? 'disponible' : 'no encontrado'
        };
      }
    } catch (error) {
      resultados.conexiones.openai = {
        estado: 'error',
        mensaje: error.message
      };
    }
  }

  // 6. Verificar Replicate
  if (!process.env.REPLICATE_API_TOKEN) {
    resultados.conexiones.replicate = {
      estado: 'no_configurado',
      mensaje: 'REPLICATE_API_TOKEN no configurada (opcional, para modelos de imagen avanzados)'
    };
  } else {
    try {
      const res = await fetch('https://api.replicate.com/v1/account', {
        headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` },
        signal: AbortSignal.timeout(10000)
      });

      if (res.ok) {
        const account = await res.json();
        resultados.conexiones.replicate = {
          estado: 'ok',
          mensaje: 'API de Replicate funcionando',
          usuario: account.username || 'conectado'
        };
      } else {
        resultados.conexiones.replicate = {
          estado: 'error',
          mensaje: `Replicate respondió ${res.status}`
        };
      }
    } catch (error) {
      resultados.conexiones.replicate = {
        estado: 'error',
        mensaje: error.message
      };
    }
  }

  // 7. Verificar Gemini (Google AI)
  if (!process.env.GEMINI_API_KEY) {
    resultados.conexiones.gemini = {
      estado: 'no_configurado',
      mensaje: 'GEMINI_API_KEY no configurada (opcional, para Nano Banana y texto)'
    };
  } else {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Probar con gemini-pro primero, luego gemini-1.5-pro
      let model;
      let modeloUsado = 'gemini-2.0-flash-exp';
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent('Di "ok"');
        result.response.text();
      } catch {
        // Fallback a gemini-pro
        modeloUsado = 'gemini-pro';
        model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Di "ok"');
        result.response.text();
      }

      resultados.conexiones.gemini = {
        estado: 'ok',
        mensaje: 'API de Gemini funcionando',
        modelo: modeloUsado
      };
    } catch (error) {
      resultados.conexiones.gemini = {
        estado: 'error',
        mensaje: error.message
      };
    }
  }

  // Resumen general
  const estados = Object.values(resultados.conexiones).map(c => c.estado);
  resultados.resumen = {
    total: estados.length,
    ok: estados.filter(e => e === 'ok').length,
    errores: estados.filter(e => e === 'error').length,
    noConfigurado: estados.filter(e => e === 'no_configurado').length,
    todoBien: estados.every(e => e === 'ok' || e === 'no_configurado')
  };

  return Response.json({
    success: true,
    ...resultados
  });
}

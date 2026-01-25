import { kv } from '@vercel/kv';

async function ver() {
  // Ver contenido del duende de semana 4
  const duendeSemana = await kv.get('circulo:duende-semana:2026:1:4');
  console.log('=== Duende Semana 4 ===');
  console.log(JSON.stringify(duendeSemana, null, 2));

  // Ver contenidos de días 22-31 (semana 4)
  console.log('\n=== Contenidos días 22-31 ===');
  for (let dia = 22; dia <= 31; dia++) {
    const contenido = await kv.get(`circulo:contenido:2026:1:${dia}`);
    if (contenido) {
      console.log(`\nDía ${dia}:`);
      console.log(`  Título: ${contenido.titulo || 'sin título'}`);
      console.log(`  Tipo: ${contenido.tipo || 'sin tipo'}`);
      console.log(`  Imagen: ${contenido.imagen ? contenido.imagen.substring(0, 60) + '...' : 'SIN IMAGEN'}`);
    }
  }

  // Ver también duende-semana:2026-01-S4
  const duendeSemana2 = await kv.get('duende-semana:2026-01-S4');
  console.log('\n=== duende-semana:2026-01-S4 ===');
  console.log(JSON.stringify(duendeSemana2, null, 2));
}

ver().catch(console.error);

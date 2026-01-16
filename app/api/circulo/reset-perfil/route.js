import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// Endpoint temporal para resetear perfil (solo desarrollo)
export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    
    // Borrar perfil
    await kv.del(`circulo:perfil:${emailLower}`);
    
    // También resetear el flag en circulo:{email}
    const circuloData = await kv.get(`circulo:${emailLower}`);
    if (circuloData) {
      await kv.set(`circulo:${emailLower}`, {
        ...circuloData,
        onboardingCompletado: false
      });
    }

    return Response.json({ 
      success: true, 
      message: `Perfil de ${email} reseteado` 
    });

  } catch (error) {
    console.error('Error reseteando perfil:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

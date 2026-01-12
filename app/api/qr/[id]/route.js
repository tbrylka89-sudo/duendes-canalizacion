import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;

  // URL del certificado
  const url = `https://duendes-vercel.vercel.app/certificado/${id}`;

  // Usar API de QR gratuita
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&bgcolor=0a0a0a&color=C6A962`;

  // Redirigir a la imagen del QR
  return NextResponse.redirect(qrUrl);
}

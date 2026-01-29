import { NextResponse } from 'next/server';

export function middleware(request) {
  const hostname = request.headers.get('host') || '';

  // Subdomain magia → rewrite to /mi-magia
  if (hostname.startsWith('magia.')) {
    const url = request.nextUrl.clone();
    const path = url.pathname;
    // Don't rewrite _next, api, or already /mi-magia paths
    if (!path.startsWith('/_next') && !path.startsWith('/api') && !path.startsWith('/mi-magia')) {
      url.pathname = '/mi-magia' + path;
      return NextResponse.rewrite(url);
    }
  }

  // Handle CORS preflight requests for GI API
  if (request.nextUrl.pathname.startsWith('/api/guardian-intelligence')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-|og-).*)'],
};

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from 'next-auth/middleware'

// Rotas que precisam de assinatura ativa
const subscriptionRoutes = ['/videos', '/playlists']

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.nextauth?.token

    // Verifica se a rota requer assinatura
    if (subscriptionRoutes.some(route => pathname.startsWith(route))) {
      // Verifica se o usuário é admin (admins têm acesso total)
      if (token?.isAdmin) {
        return NextResponse.next()
      }

      // Verifica se o usuário tem uma assinatura ativa
      const hasActiveSubscription = token?.hasActiveSubscription

      // Verifica se o usuário está na lista de espera aprovada
      const isApprovedWaitlist = token?.isApprovedWaitlist

      if (!hasActiveSubscription && !isApprovedWaitlist) {
        return NextResponse.redirect(new URL('/planos', request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/videos/:path*',
    '/api/videos/:path*',
    '/config/:path*',
    '/playlists/:path*'
  ]
}
import { FastifyRequest, FastifyReply } from 'fastify'
import prisma from '../config/prisma'

export async function checkSubscription(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Verifica se o usuário está autenticado
    await request.jwtVerify()

    // Verifica se o usuário é admin (admins têm acesso total)
    if (request.user.isAdmin) {
      return
    }

    // Verifica se o usuário está na lista de espera aprovada
    const waitlistEntry = await prisma.waitlist.findFirst({
      where: {
        userId: request.user.id,
        status: 'approved'
      }
    })

    if (waitlistEntry) {
      return // Usuários aprovados na lista de espera têm acesso
    }

    // Verifica se o usuário tem uma assinatura ativa
    const subscription = await prisma.subscription.findUnique({
      where: { userId: request.user.id }
    })

    const hasActiveSubscription = subscription?.status === 'active' && 
                                 (subscription.endDate ? new Date(subscription.endDate) > new Date() : true)

    if (!hasActiveSubscription) {
      return reply.code(403).send({
        error: 'Assinatura necessária para acessar este recurso'
      })
    }
  } catch (error) {
    return reply.code(401).send({
      error: 'Não autorizado'
    })
  }
}

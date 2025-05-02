import { FastifyInstance } from 'fastify'
import prisma from '../config/prisma'
import { createWaitlistSchema, updateWaitlistSchema } from '../types/waitlist'

export async function waitlistRoutes(app: FastifyInstance) {
  // Rota pública para entrar na lista de espera
  app.post('/join', async (request, reply) => {
    try {
      const data = createWaitlistSchema.parse(request.body)

      // Verificar se o email já está na lista de espera
      const existingEntry = await prisma.waitlist.findUnique({
        where: { email: data.email }
      })

      if (existingEntry) {
        return reply.code(400).send({
          error: 'Este e-mail já está na lista de espera'
        })
      }

      // Criar entrada na lista de espera
      const waitlistEntry = await prisma.waitlist.create({
        data
      })

      // Calcular posição na lista de espera
      const position = await getWaitlistPosition(waitlistEntry.id)

      return reply.code(201).send({
        message: 'Você foi adicionado à lista de espera com sucesso!',
        position
      })
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao entrar na lista de espera'
      })
    }
  })

  // Rota pública para verificar status na lista de espera
  app.get('/status', async (request, reply) => {
    try {
      const { email } = request.query as { email: string }

      if (!email) {
        return reply.code(400).send({
          error: 'E-mail é obrigatório'
        })
      }

      const waitlistEntry = await prisma.waitlist.findUnique({
        where: { email }
      })

      if (!waitlistEntry) {
        return reply.code(404).send({
          error: 'E-mail não encontrado na lista de espera'
        })
      }

      const position = await getWaitlistPosition(waitlistEntry.id)

      return reply.send({
        status: waitlistEntry.status,
        position: waitlistEntry.status === 'pending' ? position : null,
        createdAt: waitlistEntry.createdAt
      })
    } catch (error: any) {
      return reply.code(500).send({
        error: error.message || 'Erro ao verificar status na lista de espera'
      })
    }
  })

  // Rotas administrativas (requerem autenticação e permissão de admin)
  app.register(async (adminRoutes) => {
    // Middleware para verificar autenticação e permissão de admin
    adminRoutes.addHook('onRequest', async (request, reply) => {
      try {
        await request.jwtVerify()

        // Verificar se o usuário é admin
        const user = await prisma.user.findUnique({
          where: { id: request.user.id }
        })

        if (!user?.isAdmin) {
          return reply.code(403).send({
            error: 'Acesso não autorizado'
          })
        }
      } catch (error) {
        return reply.code(401).send({
          error: 'Não autorizado'
        })
      }
    })

    // Rota para listar todas as entradas da lista de espera
    adminRoutes.get('/', async (request, reply) => {
      try {
        const waitlist = await prisma.waitlist.findMany({
          orderBy: {
            createdAt: 'asc'
          }
        })

        return reply.send(waitlist)
      } catch (error: any) {
        return reply.code(500).send({
          error: error.message || 'Erro ao listar entradas da lista de espera'
        })
      }
    })

    // Rota para atualizar uma entrada na lista de espera
    adminRoutes.put('/:id', async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const data = updateWaitlistSchema.parse(request.body)

        const waitlistEntry = await prisma.waitlist.findUnique({
          where: { id }
        })

        if (!waitlistEntry) {
          return reply.code(404).send({
            error: 'Entrada na lista de espera não encontrada'
          })
        }

        const updatedEntry = await prisma.waitlist.update({
          where: { id },
          data
        })

        return reply.send(updatedEntry)
      } catch (error: any) {
        return reply.code(400).send({
          error: error.message || 'Erro ao atualizar entrada na lista de espera'
        })
      }
    })

    // Rota para aprovar uma entrada na lista de espera
    adminRoutes.post('/:id/approve', async (request, reply) => {
      try {
        const { id } = request.params as { id: string }

        const waitlistEntry = await prisma.waitlist.findUnique({
          where: { id }
        })

        if (!waitlistEntry) {
          return reply.code(404).send({
            error: 'Entrada na lista de espera não encontrada'
          })
        }

        // Aprovar entrada na lista de espera
        await prisma.waitlist.update({
          where: { id },
          data: {
            status: 'approved'
          }
        })

        return reply.send({ message: 'Entrada aprovada com sucesso' })
      } catch (error: any) {
        return reply.code(500).send({
          error: error.message || 'Erro ao aprovar entrada na lista de espera'
        })
      }
    })

    // Rota para rejeitar uma entrada na lista de espera
    adminRoutes.post('/:id/reject', async (request, reply) => {
      try {
        const { id } = request.params as { id: string }

        const waitlistEntry = await prisma.waitlist.findUnique({
          where: { id }
        })

        if (!waitlistEntry) {
          return reply.code(404).send({
            error: 'Entrada na lista de espera não encontrada'
          })
        }

        // Rejeitar entrada na lista de espera
        await prisma.waitlist.update({
          where: { id },
          data: {
            status: 'rejected'
          }
        })

        return reply.send({ message: 'Entrada rejeitada com sucesso' })
      } catch (error: any) {
        return reply.code(500).send({
          error: error.message || 'Erro ao rejeitar entrada na lista de espera'
        })
      }
    })
  })
}

// Função auxiliar para obter a posição na lista de espera
async function getWaitlistPosition(id: string): Promise<number> {
  const waitlistEntries = await prisma.waitlist.findMany({
    where: {
      status: 'pending'
    },
    orderBy: {
      createdAt: 'asc'
    },
    select: {
      id: true
    }
  })

  const position = waitlistEntries.findIndex(entry => entry.id === id) + 1
  return position > 0 ? position : 0
}

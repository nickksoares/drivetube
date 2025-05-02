import { FastifyInstance } from 'fastify'
import prisma from '../config/prisma'
import { createPlanSchema, updatePlanSchema } from '../types/subscription'

export async function planRoutes(app: FastifyInstance) {
  // Middleware para verificar autenticação
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      return reply.code(401).send({
        error: 'Não autorizado'
      })
    }
  })

  // Rota para listar todos os planos
  app.get('/', async (request, reply) => {
    try {
      const plans = await prisma.plan.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          price: 'asc'
        }
      })

      return reply.send(plans)
    } catch (error: any) {
      return reply.code(500).send({
        error: error.message || 'Erro ao listar planos'
      })
    }
  })

  // Rota para obter um plano específico
  app.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const plan = await prisma.plan.findUnique({
        where: { id }
      })

      if (!plan) {
        return reply.code(404).send({
          error: 'Plano não encontrado'
        })
      }

      return reply.send(plan)
    } catch (error: any) {
      return reply.code(500).send({
        error: error.message || 'Erro ao buscar plano'
      })
    }
  })

  // Rota para criar um plano (apenas admin)
  app.post('/', async (request, reply) => {
    try {
      // Verificar se o usuário é admin
      const user = await prisma.user.findUnique({
        where: { id: request.user.id }
      })

      if (!user?.isAdmin) {
        return reply.code(403).send({
          error: 'Acesso não autorizado'
        })
      }

      const data = createPlanSchema.parse(request.body)

      const plan = await prisma.plan.create({
        data
      })

      return reply.code(201).send(plan)
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao criar plano'
      })
    }
  })

  // Rota para atualizar um plano (apenas admin)
  app.put('/:id', async (request, reply) => {
    try {
      // Verificar se o usuário é admin
      const user = await prisma.user.findUnique({
        where: { id: request.user.id }
      })

      if (!user?.isAdmin) {
        return reply.code(403).send({
          error: 'Acesso não autorizado'
        })
      }

      const { id } = request.params as { id: string }
      const data = updatePlanSchema.parse(request.body)

      const plan = await prisma.plan.findUnique({
        where: { id }
      })

      if (!plan) {
        return reply.code(404).send({
          error: 'Plano não encontrado'
        })
      }

      const updatedPlan = await prisma.plan.update({
        where: { id },
        data
      })

      return reply.send(updatedPlan)
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao atualizar plano'
      })
    }
  })

  // Rota para desativar um plano (apenas admin)
  app.delete('/:id', async (request, reply) => {
    try {
      // Verificar se o usuário é admin
      const user = await prisma.user.findUnique({
        where: { id: request.user.id }
      })

      if (!user?.isAdmin) {
        return reply.code(403).send({
          error: 'Acesso não autorizado'
        })
      }

      const { id } = request.params as { id: string }

      const plan = await prisma.plan.findUnique({
        where: { id }
      })

      if (!plan) {
        return reply.code(404).send({
          error: 'Plano não encontrado'
        })
      }

      // Em vez de excluir, apenas desativa o plano
      await prisma.plan.update({
        where: { id },
        data: {
          isActive: false
        }
      })

      return reply.code(204).send()
    } catch (error: any) {
      return reply.code(400).send({
        error: error.message || 'Erro ao desativar plano'
      })
    }
  })
}

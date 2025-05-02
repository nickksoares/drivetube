import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import prisma from '../config/prisma'
import { createPlanSchema, updatePlanSchema } from '../types/subscription'

export class PlansController {
  async list(request: FastifyRequest, reply: FastifyReply) {
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
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao listar planos' })
    }
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    try {
      const { id } = paramsSchema.parse(request.params)

      const plan = await prisma.plan.findUnique({
        where: { id }
      })

      if (!plan) {
        return reply.status(404).send({ error: 'Plano não encontrado' })
      }

      return reply.send(plan)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao buscar plano' })
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Verificar se o usuário é admin
      if (!request.user.isAdmin) {
        return reply.status(403).send({ error: 'Acesso não autorizado' })
      }

      const data = createPlanSchema.parse(request.body)

      const plan = await prisma.plan.create({
        data
      })

      return reply.status(201).send(plan)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao criar plano' })
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    try {
      // Verificar se o usuário é admin
      if (!request.user.isAdmin) {
        return reply.status(403).send({ error: 'Acesso não autorizado' })
      }

      const { id } = paramsSchema.parse(request.params)
      const data = updatePlanSchema.parse(request.body)

      const plan = await prisma.plan.findUnique({
        where: { id }
      })

      if (!plan) {
        return reply.status(404).send({ error: 'Plano não encontrado' })
      }

      const updatedPlan = await prisma.plan.update({
        where: { id },
        data
      })

      return reply.send(updatedPlan)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao atualizar plano' })
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    try {
      // Verificar se o usuário é admin
      if (!request.user.isAdmin) {
        return reply.status(403).send({ error: 'Acesso não autorizado' })
      }

      const { id } = paramsSchema.parse(request.params)

      const plan = await prisma.plan.findUnique({
        where: { id }
      })

      if (!plan) {
        return reply.status(404).send({ error: 'Plano não encontrado' })
      }

      // Em vez de excluir, apenas desativa o plano
      await prisma.plan.update({
        where: { id },
        data: {
          isActive: false
        }
      })

      return reply.status(204).send()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao excluir plano' })
    }
  }
}

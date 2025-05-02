import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import prisma from '../config/prisma'
import { createWaitlistSchema, updateWaitlistSchema } from '../types/waitlist'

export class WaitlistController {
  async join(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createWaitlistSchema.parse(request.body)

      // Verificar se o email já está na lista de espera
      const existingEntry = await prisma.waitlist.findUnique({
        where: { email: data.email }
      })

      if (existingEntry) {
        return reply.status(400).send({ error: 'Este e-mail já está na lista de espera' })
      }

      // Criar entrada na lista de espera
      const waitlistEntry = await prisma.waitlist.create({
        data
      })

      return reply.status(201).send({
        message: 'Você foi adicionado à lista de espera com sucesso!',
        position: await this.getWaitlistPosition(waitlistEntry.id)
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao entrar na lista de espera' })
    }
  }

  async getStatus(request: FastifyRequest, reply: FastifyReply) {
    const querySchema = z.object({
      email: z.string().email()
    })

    try {
      const { email } = querySchema.parse(request.query)

      const waitlistEntry = await prisma.waitlist.findUnique({
        where: { email }
      })

      if (!waitlistEntry) {
        return reply.status(404).send({ error: 'E-mail não encontrado na lista de espera' })
      }

      const position = await this.getWaitlistPosition(waitlistEntry.id)

      return reply.send({
        status: waitlistEntry.status,
        position: waitlistEntry.status === 'pending' ? position : null,
        createdAt: waitlistEntry.createdAt
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao verificar status na lista de espera' })
    }
  }

  // Métodos administrativos (requerem permissão de admin)

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Verificar se o usuário é admin
      if (!request.user.isAdmin) {
        return reply.status(403).send({ error: 'Acesso não autorizado' })
      }

      const waitlist = await prisma.waitlist.findMany({
        orderBy: {
          createdAt: 'asc'
        }
      })

      return reply.send(waitlist)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao listar entradas da lista de espera' })
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
      const data = updateWaitlistSchema.parse(request.body)

      const waitlistEntry = await prisma.waitlist.findUnique({
        where: { id }
      })

      if (!waitlistEntry) {
        return reply.status(404).send({ error: 'Entrada na lista de espera não encontrada' })
      }

      const updatedEntry = await prisma.waitlist.update({
        where: { id },
        data
      })

      return reply.send(updatedEntry)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao atualizar entrada na lista de espera' })
    }
  }

  async approve(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    try {
      // Verificar se o usuário é admin
      if (!request.user.isAdmin) {
        return reply.status(403).send({ error: 'Acesso não autorizado' })
      }

      const { id } = paramsSchema.parse(request.params)

      const waitlistEntry = await prisma.waitlist.findUnique({
        where: { id }
      })

      if (!waitlistEntry) {
        return reply.status(404).send({ error: 'Entrada na lista de espera não encontrada' })
      }

      // Aprovar entrada na lista de espera
      await prisma.waitlist.update({
        where: { id },
        data: {
          status: 'approved'
        }
      })

      return reply.send({ message: 'Entrada aprovada com sucesso' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao aprovar entrada na lista de espera' })
    }
  }

  // Método auxiliar para obter a posição na lista de espera
  private async getWaitlistPosition(id: string): Promise<number> {
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
}

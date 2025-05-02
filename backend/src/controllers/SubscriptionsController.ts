import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import prisma from '../config/prisma'
import { createSubscriptionSchema, updateSubscriptionSchema } from '../types/subscription'

export class SubscriptionsController {
  async getUserSubscription(request: FastifyRequest, reply: FastifyReply) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: {
          userId: request.user.id
        },
        include: {
          plan: true,
          payments: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 5
          }
        }
      })

      if (!subscription) {
        return reply.status(404).send({ error: 'Assinatura não encontrada' })
      }

      return reply.send(subscription)
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao buscar assinatura' })
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createSubscriptionSchema.parse(request.body)

      // Verificar se o plano existe
      const plan = await prisma.plan.findUnique({
        where: { id: data.planId }
      })

      if (!plan || !plan.isActive) {
        return reply.status(404).send({ error: 'Plano não encontrado ou inativo' })
      }

      // Verificar se o usuário já tem uma assinatura
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId: request.user.id }
      })

      if (existingSubscription) {
        return reply.status(400).send({ error: 'Usuário já possui uma assinatura ativa' })
      }

      // Calcular data de término com base no intervalo do plano
      let endDate = new Date(data.startDate)
      if (plan.interval === 'month') {
        endDate.setMonth(endDate.getMonth() + 1)
      } else if (plan.interval === 'year') {
        endDate.setFullYear(endDate.getFullYear() + 1)
      }

      // Criar a assinatura
      const subscription = await prisma.subscription.create({
        data: {
          ...data,
          userId: request.user.id,
          endDate
        },
        include: {
          plan: true
        }
      })

      // Criar um pagamento pendente
      const payment = await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: plan.price,
          paymentMethod: 'pix',
          status: 'pending',
          pixExpiration: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
        }
      })

      // Gerar código PIX (simulado)
      const pixCode = `PIX${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: { pixCode }
      })

      return reply.status(201).send({
        subscription,
        payment: {
          ...payment,
          pixCode
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao criar assinatura' })
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = updateSubscriptionSchema.parse(request.body)

      // Buscar a assinatura do usuário
      const subscription = await prisma.subscription.findUnique({
        where: { userId: request.user.id }
      })

      if (!subscription) {
        return reply.status(404).send({ error: 'Assinatura não encontrada' })
      }

      // Atualizar a assinatura
      const updatedSubscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data,
        include: {
          plan: true
        }
      })

      return reply.send(updatedSubscription)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao atualizar assinatura' })
    }
  }

  async cancel(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Buscar a assinatura do usuário
      const subscription = await prisma.subscription.findUnique({
        where: { userId: request.user.id }
      })

      if (!subscription) {
        return reply.status(404).send({ error: 'Assinatura não encontrada' })
      }

      // Cancelar a assinatura
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'canceled'
        }
      })

      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao cancelar assinatura' })
    }
  }

  // Método para processar pagamentos (simulado)
  async processPayment(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      paymentId: z.string().uuid()
    })

    try {
      const { paymentId } = bodySchema.parse(request.body)

      // Buscar o pagamento
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          subscription: true
        }
      })

      if (!payment) {
        return reply.status(404).send({ error: 'Pagamento não encontrado' })
      }

      // Verificar se o pagamento pertence ao usuário
      if (payment.subscription.userId !== request.user.id) {
        return reply.status(403).send({ error: 'Acesso não autorizado' })
      }

      // Atualizar o status do pagamento
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'completed'
        }
      })

      // Atualizar a assinatura
      await prisma.subscription.update({
        where: { id: payment.subscription.id },
        data: {
          status: 'active',
          lastPaymentId: paymentId
        }
      })

      return reply.send({ message: 'Pagamento processado com sucesso' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors })
      }

      return reply.status(500).send({ error: 'Erro ao processar pagamento' })
    }
  }
}

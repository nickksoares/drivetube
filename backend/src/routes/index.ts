import { FastifyInstance } from 'fastify'
import { videoRoutes } from './videos'
import { authRoutes } from './auth'
import { configRoutes } from './config'
import { planRoutes } from './plans'
import { subscriptionRoutes } from './subscriptions'
import { waitlistRoutes } from './waitlist'

export async function registerRoutes(app: FastifyInstance) {
  // Rotas de vídeos
  app.register(videoRoutes, { prefix: '/api/videos' })

  // Rotas de autenticação
  app.register(authRoutes, { prefix: '/api/auth' })

  // Rotas de configuração
  app.register(configRoutes, { prefix: '/api/config' })

  // Rotas de planos
  app.register(planRoutes, { prefix: '/api/plans' })

  // Rotas de assinaturas
  app.register(subscriptionRoutes, { prefix: '/api/subscriptions' })

  // Rotas de lista de espera
  app.register(waitlistRoutes, { prefix: '/api/waitlist' })
}
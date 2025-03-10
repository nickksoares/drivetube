import { FastifyInstance } from 'fastify'
import { videoRoutes } from './videos'
import { authRoutes } from './auth'
import { configRoutes } from './config'

export async function registerRoutes(app: FastifyInstance) {
  // Rotas de vídeos
  app.register(videoRoutes, { prefix: '/api/videos' })

  // Rotas de autenticação
  app.register(authRoutes, { prefix: '/api/auth' })

  // Rotas de configuração
  app.register(configRoutes, { prefix: '/api/config' })
} 
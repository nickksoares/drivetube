import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { videoRoutes } from './routes/videos'
import { authRoutes } from './routes/auth'
import fastify from 'fastify'
import { config } from './config'

export async function createServer(): Promise<FastifyInstance> {
  const app = fastify({ logger: true })

  await app.register(cors, {
    origin: config.frontendUrl,
    credentials: true
  })

  console.log('📦 Registrando rotas...')

  // Rotas
  app.register(videoRoutes, { prefix: '/api/videos' })
  app.register(authRoutes, { prefix: '/api/auth' })


  return app
}
import { z } from 'zod'

export interface Plan {
  id: string
  name: string
  description?: string
  price: number
  interval: 'month' | 'year'
  features?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'expired'
  startDate: Date
  endDate?: Date
  lastPaymentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  subscriptionId: string
  amount: number
  paymentMethod: 'pix'
  status: 'pending' | 'completed' | 'failed'
  pixCode?: string
  pixExpiration?: Date
  createdAt: Date
  updatedAt: Date
}

export const createPlanSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  price: z.number().positive('O preço deve ser um valor positivo'),
  interval: z.enum(['month', 'year']),
  features: z.string().optional(),
  isActive: z.boolean().default(true)
})

export const updatePlanSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
  description: z.string().optional(),
  price: z.number().positive('O preço deve ser um valor positivo').optional(),
  interval: z.enum(['month', 'year']).optional(),
  features: z.string().optional(),
  isActive: z.boolean().optional()
})

export const createSubscriptionSchema = z.object({
  planId: z.string().uuid('ID do plano inválido'),
  status: z.enum(['active', 'canceled', 'expired']).default('active'),
  startDate: z.date().default(() => new Date()),
  endDate: z.date().optional()
})

export const updateSubscriptionSchema = z.object({
  planId: z.string().uuid('ID do plano inválido').optional(),
  status: z.enum(['active', 'canceled', 'expired']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  lastPaymentId: z.string().optional()
})

export const createPaymentSchema = z.object({
  subscriptionId: z.string().uuid('ID da assinatura inválido'),
  amount: z.number().positive('O valor deve ser positivo'),
  paymentMethod: z.enum(['pix']).default('pix'),
  status: z.enum(['pending', 'completed', 'failed']).default('pending'),
  pixCode: z.string().optional(),
  pixExpiration: z.date().optional()
})

export const updatePaymentSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  pixCode: z.string().optional(),
  pixExpiration: z.date().optional()
})

export type CreatePlanData = z.infer<typeof createPlanSchema>
export type UpdatePlanData = z.infer<typeof updatePlanSchema>
export type CreateSubscriptionData = z.infer<typeof createSubscriptionSchema>
export type UpdateSubscriptionData = z.infer<typeof updateSubscriptionSchema>
export type CreatePaymentData = z.infer<typeof createPaymentSchema>
export type UpdatePaymentData = z.infer<typeof updatePaymentSchema>

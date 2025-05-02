import { z } from 'zod'

export interface Waitlist {
  id: string
  userId?: string
  email: string
  name?: string
  createdAt: Date
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
}

export const createWaitlistSchema = z.object({
  email: z.string().email('E-mail inválido'),
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres').optional()
})

export const updateWaitlistSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  notes: z.string().optional(),
  userId: z.string().uuid('ID de usuário inválido').optional()
})

export type CreateWaitlistData = z.infer<typeof createWaitlistSchema>
export type UpdateWaitlistData = z.infer<typeof updateWaitlistSchema>

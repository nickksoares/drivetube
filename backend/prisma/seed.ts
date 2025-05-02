import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Criar planos
  const plans = [
    {
      name: 'Básico',
      description: 'Perfeito para começar',
      price: 29.90,
      interval: 'month',
      features: JSON.stringify([
        'Acesso a todos os vídeos',
        'Visualização em HD',
        'Suporte por email',
        'Acesso pelo computador e celular'
      ]),
      isActive: true
    },
    {
      name: 'Premium',
      description: 'Para quem quer mais',
      price: 49.90,
      interval: 'month',
      features: JSON.stringify([
        'Todos os recursos do plano Básico',
        'Visualização em Full HD',
        'Download de vídeos',
        'Suporte prioritário',
        'Acesso antecipado a novos cursos'
      ]),
      isActive: true
    },
    {
      name: 'Empresarial',
      description: 'Ideal para equipes',
      price: 99.90,
      interval: 'month',
      features: JSON.stringify([
        'Todos os recursos do plano Premium',
        'Visualização em 4K',
        'Múltiplos usuários',
        'Relatórios de progresso',
        'Treinamento personalizado',
        'Suporte 24/7'
      ]),
      isActive: true
    },
    {
      name: 'Básico Anual',
      description: 'Perfeito para começar',
      price: 299.90,
      interval: 'year',
      features: JSON.stringify([
        'Acesso a todos os vídeos',
        'Visualização em HD',
        'Suporte por email',
        'Acesso pelo computador e celular'
      ]),
      isActive: true
    },
    {
      name: 'Premium Anual',
      description: 'Para quem quer mais',
      price: 499.90,
      interval: 'year',
      features: JSON.stringify([
        'Todos os recursos do plano Básico',
        'Visualização em Full HD',
        'Download de vídeos',
        'Suporte prioritário',
        'Acesso antecipado a novos cursos'
      ]),
      isActive: true
    },
    {
      name: 'Empresarial Anual',
      description: 'Ideal para equipes',
      price: 999.90,
      interval: 'year',
      features: JSON.stringify([
        'Todos os recursos do plano Premium',
        'Visualização em 4K',
        'Múltiplos usuários',
        'Relatórios de progresso',
        'Treinamento personalizado',
        'Suporte 24/7'
      ]),
      isActive: true
    }
  ]

  for (const plan of plans) {
    const existingPlan = await prisma.plan.findUnique({
      where: { name: plan.name }
    })

    if (!existingPlan) {
      await prisma.plan.create({
        data: plan
      })
      console.log(`✅ Plano ${plan.name} criado`)
    } else {
      console.log(`⏩ Plano ${plan.name} já existe, pulando...`)
    }
  }

  // Criar usuário admin
  const adminEmail = 'admin@drivetube.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: await hash('admin123', 10),
        isAdmin: true
      }
    })
    console.log(`✅ Usuário admin criado: ${admin.email}`)
  } else {
    console.log(`⏩ Usuário admin já existe, pulando...`)
  }

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

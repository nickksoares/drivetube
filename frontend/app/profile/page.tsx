'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { API_URL } from '../config/api'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated' && session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
    }
  }, [status, session, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Em uma implementação real, você enviaria uma requisição para a API
      // const response = await axios.put(`${API_URL}/api/auth/profile`, {
      //   name
      // })
      
      // Simulando atualização
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualizar a sessão
      await update({
        ...session,
        user: {
          ...session?.user,
          name
        }
      })
      
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    
    setIsPasswordLoading(true)

    try {
      // Em uma implementação real, você enviaria uma requisição para a API
      // await axios.put(`${API_URL}/api/auth/password`, {
      //   currentPassword,
      //   newPassword
      // })
      
      // Simulando atualização
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Senha alterada com sucesso!')
    } catch (error) {
      toast.error('Erro ao alterar senha')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      return
    }
    
    setIsDeleteLoading(true)

    try {
      // Em uma implementação real, você enviaria uma requisição para a API
      // await axios.delete(`${API_URL}/api/auth/account`)
      
      // Simulando exclusão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await signOut({ callbackUrl: '/' })
      toast.success('Conta excluída com sucesso')
    } catch (error) {
      toast.error('Erro ao excluir conta')
      setIsDeleteLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna de informações do perfil */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'Avatar'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{session?.user?.name}</h2>
              <p className="text-gray-500 mt-1">{session?.user?.email}</p>
              
              {session?.user?.hasActiveSubscription ? (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Assinante
                </div>
              ) : (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Plano Gratuito
                </div>
              )}
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vídeos</span>
                  <span className="font-medium text-gray-800">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Playlists</span>
                  <span className="font-medium text-gray-800">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favoritos</span>
                  <span className="font-medium text-gray-800">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Membro desde</span>
                  <span className="font-medium text-gray-800">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Assinatura</h3>
              {session?.user?.hasActiveSubscription ? (
                <div>
                  <p className="text-gray-600 mb-2">
                    Plano: <span className="font-medium text-gray-800">{session?.user?.plan?.name || 'Premium'}</span>
                  </p>
                  <button
                    className="mt-2 w-full px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium"
                    onClick={() => router.push('/planos')}
                  >
                    Gerenciar Assinatura
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Você ainda não possui uma assinatura ativa. Assine agora para acessar todos os recursos.
                  </p>
                  <button
                    className="w-full px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium"
                    onClick={() => router.push('/planos')}
                  >
                    Ver Planos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna de formulários */}
        <div className="md:col-span-2">
          {/* Formulário de atualização de perfil */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Informações Pessoais</h2>
            
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado.</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>

          {/* Formulário de alteração de senha */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Alterar Senha</h2>
            
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium disabled:opacity-50"
                >
                  {isPasswordLoading ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </div>
            </form>
          </div>

          {/* Seção de exclusão de conta */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Excluir Conta</h2>
            <p className="text-gray-600 mb-6">
              Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleteLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
            >
              {isDeleteLoading ? 'Excluindo...' : 'Excluir Minha Conta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

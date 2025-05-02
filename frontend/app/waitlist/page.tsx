'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { API_ROUTES } from '../config/api'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [position, setPosition] = useState<number | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await axios.post(`${API_ROUTES.WAITLIST}/join`, {
        email,
        name
      })

      setSuccess(true)
      setPosition(response.data.position)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocorreu um erro ao entrar na lista de espera')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckStatus = async () => {
    if (!email) {
      setError('Por favor, informe seu e-mail')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await axios.get(`${API_ROUTES.WAITLIST}/status?email=${encodeURIComponent(email)}`)
      
      setSuccess(true)
      setPosition(response.data.status === 'pending' ? response.data.position : null)
      
      if (response.data.status === 'approved') {
        setSuccess(true)
        setPosition(null)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'E-mail não encontrado na lista de espera')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center">
              <div className="relative w-12 h-12 mr-3">
                <Image
                  src="/images/drivetube-logo.png"
                  alt="drivetube Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">drivetube</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Lista de Espera
            </h1>
            <p className="mt-4 text-lg text-gray-600 text-center">
              Os primeiros 500 usuários terão acesso gratuito ao drivetube!
            </p>

            {success ? (
              <div className="mt-8 p-6 bg-yellow-50 rounded-xl">
                <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
                  Você está na lista de espera!
                </h3>
                {position ? (
                  <p className="mt-2 text-gray-600 text-center">
                    Sua posição atual é: <span className="font-semibold">{position}</span>
                  </p>
                ) : (
                  <p className="mt-2 text-gray-600 text-center">
                    Sua inscrição foi aprovada! Você pode fazer login agora.
                  </p>
                )}
                <p className="mt-4 text-gray-600 text-center">
                  Entre em contato pelo Telegram para mais informações: <a href="https://t.me/trydrivetube" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">t.me/trydrivetube</a>
                </p>
                <div className="mt-6 flex justify-center">
                  <Link 
                    href="/" 
                    className="px-6 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Voltar para a página inicial
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <div className="flex justify-center space-x-4 mb-8">
                  <button
                    type="button"
                    onClick={() => document.getElementById('joinForm')?.classList.remove('hidden')}
                    className="px-6 py-2 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Entrar na lista
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('checkForm')?.classList.remove('hidden')}
                    className="px-6 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Verificar status
                  </button>
                </div>

                <form id="joinForm" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-xl shadow-md hover:bg-yellow-500 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Enviando...' : 'Entrar na lista de espera'}
                  </button>

                  <p className="text-sm text-gray-600 text-center">
                    Ao se inscrever, você concorda em receber atualizações sobre o drivetube.
                  </p>
                </form>

                <form id="checkForm" className="hidden space-y-4">
                  <div>
                    <label htmlFor="checkEmail" className="block text-sm font-medium text-gray-700">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="checkEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-md">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleCheckStatus}
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-xl shadow-md hover:bg-yellow-500 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Verificando...' : 'Verificar status'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Já tem uma conta? <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-medium">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

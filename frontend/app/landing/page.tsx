'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { API_ROUTES } from '../config/api'

export default function LandingPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-10 pb-8 md:pt-16 md:pb-20 lg:pt-20 lg:pb-28 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Assista seus vídeos do Drive com uma experiência incrível
              </h1>
              <p className="mt-4 md:mt-6 text-xl text-gray-600 max-w-3xl">
                O drivetube transforma seus vídeos do Google Drive em uma plataforma de streaming profissional. Organize, assista e compartilhe seus conteúdos com facilidade.
              </p>
              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/waitlist"
                  className="px-8 py-3 bg-yellow-400 text-gray-900 font-medium rounded-xl shadow-md hover:bg-yellow-500 transition-colors"
                >
                  Entrar na lista de espera
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white text-gray-900 font-medium rounded-xl shadow-md hover:bg-gray-50 transition-colors"
                >
                  Fazer login
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/drivetube-preview.png"
                  alt="drivetube Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Por que escolher o drivetube?
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Uma experiência completa para seus vídeos do Google Drive
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-yellow-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Player Profissional
              </h3>
              <p className="text-gray-600">
                Interface intuitiva com controles avançados, qualidade automática e suporte a diversos formatos.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Organização Inteligente
              </h3>
              <p className="text-gray-600">
                Crie playlists, categorize seus vídeos e encontre rapidamente o que procura.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Segurança Total
              </h3>
              <p className="text-gray-600">
                Seus vídeos permanecem no Google Drive, mantendo todas as permissões e configurações de segurança.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Section */}
      <div className="py-16 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Entre na lista de espera
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Os primeiros 500 usuários terão acesso gratuito ao drivetube!
            </p>

            {success ? (
              <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
                <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Você está na lista de espera!
                </h3>
                <p className="mt-2 text-gray-600">
                  {position ? `Sua posição atual é: ${position}` : 'Entraremos em contato quando sua vez chegar.'}
                </p>
                <p className="mt-4 text-gray-600">
                  Entre em contato pelo Telegram para mais informações: <a href="https://t.me/trydrivetube" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">t.me/trydrivetube</a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-xl shadow-md">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-left text-sm font-medium text-gray-700">
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
                    <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700">
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
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-xl shadow-md hover:bg-yellow-500 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Enviando...' : 'Entrar na lista de espera'}
                </button>

                <p className="mt-4 text-sm text-gray-600">
                  Ao se inscrever, você concorda em receber atualizações sobre o drivetube.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="relative w-10 h-10 mr-3">
                <Image
                  src="/images/drivetube-logo.png"
                  alt="drivetube Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">drivetube</span>
            </div>
            <div className="mt-6 md:mt-0">
              <p className="text-gray-600">
                &copy; {new Date().getFullYear()} drivetube. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

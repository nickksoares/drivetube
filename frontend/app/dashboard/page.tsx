'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { API_URL } from '../config/api'
import { toast } from 'react-hot-toast'

interface DashboardStats {
  totalVideos: number
  totalPlaylists: number
  totalFavorites: number
  recentVideos: {
    id: string
    name: string
    thumbnailLink?: string
  }[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Simulando dados do dashboard
      // Em uma implementação real, você buscaria esses dados da API
      setTimeout(() => {
        setStats({
          totalVideos: 24,
          totalPlaylists: 5,
          totalFavorites: 12,
          recentVideos: [
            {
              id: '1',
              name: 'Introdução ao JavaScript',
              thumbnailLink: 'https://via.placeholder.com/320x180?text=JavaScript'
            },
            {
              id: '2',
              name: 'React Hooks Avançados',
              thumbnailLink: 'https://via.placeholder.com/320x180?text=React'
            },
            {
              id: '3',
              name: 'Tailwind CSS na Prática',
              thumbnailLink: 'https://via.placeholder.com/320x180?text=Tailwind'
            },
            {
              id: '4',
              name: 'TypeScript para Iniciantes',
              thumbnailLink: 'https://via.placeholder.com/320x180?text=TypeScript'
            }
          ]
        })
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard')
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo de volta, {session?.user?.name}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total de Vídeos</p>
              <p className="text-2xl font-semibold text-gray-800">{stats?.totalVideos || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/videos" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
              Ver todos os vídeos →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Playlists</p>
              <p className="text-2xl font-semibold text-gray-800">{stats?.totalPlaylists || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/playlists" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Gerenciar playlists →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Favoritos</p>
              <p className="text-2xl font-semibold text-gray-800">{stats?.totalFavorites || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/favorites" className="text-sm text-red-600 hover:text-red-700 font-medium">
              Ver favoritos →
            </Link>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Status da Assinatura</h2>
        <div className="flex items-center">
          {session?.user?.hasActiveSubscription ? (
            <>
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Assinatura Ativa</p>
                <p className="text-gray-500 text-sm">
                  Plano: {session?.user?.plan?.name || 'Premium'}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Sem Assinatura Ativa</p>
                <p className="text-gray-500 text-sm">
                  Acesso limitado às funcionalidades
                </p>
              </div>
            </>
          )}
          <div className="ml-auto">
            <Link href="/planos" className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium text-sm">
              {session?.user?.hasActiveSubscription ? 'Gerenciar Assinatura' : 'Assinar Agora'}
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Vídeos Recentes</h2>
          <Link href="/videos" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
            Ver todos →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.recentVideos.map((video) => (
            <Link key={video.id} href={`/videos/${video.id}`} className="block group">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                {video.thumbnailLink ? (
                  <Image
                    src={video.thumbnailLink}
                    alt={video.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-gray-800 font-medium group-hover:text-yellow-600 transition-colors">{video.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

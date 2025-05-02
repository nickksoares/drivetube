'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { API_URL } from '../config/api'
import { toast } from 'react-hot-toast'

interface FavoriteVideo {
  id: string
  name: string
  thumbnailLink?: string
  createdAt: string
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated') {
      fetchFavorites()
    }
  }, [status, router])

  const fetchFavorites = async () => {
    setIsLoading(true)
    try {
      // Em uma implementação real, você buscaria esses dados da API
      // const response = await axios.get(`${API_URL}/api/favorites`)
      // setFavorites(response.data)
      
      // Simulando dados dos favoritos
      setTimeout(() => {
        setFavorites([
          {
            id: '1',
            name: 'Introdução ao JavaScript',
            thumbnailLink: 'https://via.placeholder.com/320x180?text=JavaScript',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'React Hooks Avançados',
            thumbnailLink: 'https://via.placeholder.com/320x180?text=React',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Tailwind CSS na Prática',
            thumbnailLink: 'https://via.placeholder.com/320x180?text=Tailwind',
            createdAt: new Date().toISOString()
          },
          {
            id: '4',
            name: 'TypeScript para Iniciantes',
            thumbnailLink: 'https://via.placeholder.com/320x180?text=TypeScript',
            createdAt: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Node.js: Criando uma API REST',
            thumbnailLink: 'https://via.placeholder.com/320x180?text=Node.js',
            createdAt: new Date().toISOString()
          },
          {
            id: '6',
            name: 'MongoDB: Primeiros passos',
            thumbnailLink: 'https://via.placeholder.com/320x180?text=MongoDB',
            createdAt: new Date().toISOString()
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      toast.error('Erro ao carregar favoritos')
      setIsLoading(false)
    }
  }

  const handleRemoveFavorite = async (id: string) => {
    try {
      // Em uma implementação real, você enviaria uma requisição para a API
      // await axios.delete(`${API_URL}/api/favorites/${id}`)
      
      // Simulando remoção
      setFavorites(favorites.filter(fav => fav.id !== id))
      toast.success('Vídeo removido dos favoritos')
    } catch (error) {
      toast.error('Erro ao remover dos favoritos')
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Favoritos</h1>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhum favorito encontrado</h2>
          <p className="text-gray-600 mb-6">Você ainda não adicionou nenhum vídeo aos favoritos.</p>
          <Link href="/videos" className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium">
            Explorar Vídeos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden group">
              <Link href={`/videos/${video.id}`}>
                <div className="relative aspect-video">
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
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <Link href={`/videos/${video.id}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">{video.name}</h3>
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(video.id)}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                    aria-label="Remover dos favoritos"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Adicionado em {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

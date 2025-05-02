'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { toast } from 'react-hot-toast'

interface Video {
  id: string
  name: string
  description?: string
  embedLink: string
  thumbnailLink?: string
  createdAt: string
  updatedAt: string
  isFavorite?: boolean
}

interface VideoPageProps {
  params: {
    id: string
  }
}

export default function VideoPage({ params }: VideoPageProps) {
  const { data: session, status } = useSession()
  const [video, setVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated' && params.id) {
      fetchVideo(params.id)
    }
  }, [status, params.id, router])

  const fetchVideo = async (id: string) => {
    setIsLoading(true)
    try {
      // Em uma implementação real, você buscaria esses dados da API
      // const response = await axios.get(`${API_URL}/api/videos/${id}`)
      // setVideo(response.data)
      // setIsFavorite(response.data.isFavorite)
      
      // Simulando dados do vídeo
      setTimeout(() => {
        setVideo({
          id,
          name: 'Como usar o drivetube',
          description: 'Neste vídeo, você aprenderá como usar todas as funcionalidades do drivetube para organizar e assistir seus vídeos do Google Drive.',
          embedLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnailLink: 'https://via.placeholder.com/1280x720?text=Video+Thumbnail',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFavorite: false
        })
        setIsFavorite(false)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      toast.error('Erro ao carregar o vídeo')
      setIsLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!video) return

    try {
      setIsFavorite(!isFavorite)
      
      // Em uma implementação real, você enviaria uma requisição para a API
      // if (isFavorite) {
      //   await axios.delete(`${API_URL}/api/videos/${video.id}/favorite`)
      // } else {
      //   await axios.post(`${API_URL}/api/videos/${video.id}/favorite`)
      // }
      
      toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
    } catch (error) {
      setIsFavorite(isFavorite) // Reverte o estado em caso de erro
      toast.error('Erro ao atualizar favoritos')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vídeo não encontrado</h1>
          <p className="text-gray-600 mb-6">O vídeo que você está procurando não existe ou foi removido.</p>
          <Link href="/videos" className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium">
            Voltar para a biblioteca
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/videos" className="text-yellow-600 hover:text-yellow-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar para a biblioteca
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="aspect-video w-full">
          <iframe
            src={video.embedLink}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{video.name}</h1>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="mt-4 text-gray-600">
            {video.description}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartilhar
            </button>
            
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar à Playlist
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Vídeo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Adicionado em</p>
            <p className="text-gray-800">{new Date(video.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Última atualização</p>
            <p className="text-gray-800">{new Date(video.updatedAt).toLocaleDateString()}</p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-gray-500 text-sm">ID do vídeo</p>
            <p className="text-gray-800 font-mono text-sm">{video.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

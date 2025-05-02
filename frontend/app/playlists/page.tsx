'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { API_URL } from '../config/api'
import { toast } from 'react-hot-toast'

interface Playlist {
  id: string
  name: string
  description?: string
  videoCount: number
  thumbnailLink?: string
  createdAt: string
}

export default function PlaylistsPage() {
  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated') {
      fetchPlaylists()
    }
  }, [status, router])

  const fetchPlaylists = async () => {
    setIsLoading(true)
    try {
      // Em uma implementação real, você buscaria esses dados da API
      // const response = await axios.get(`${API_URL}/api/playlists`)
      // setPlaylists(response.data)
      
      // Simulando dados das playlists
      setTimeout(() => {
        setPlaylists([
          {
            id: '1',
            name: 'JavaScript Essentials',
            description: 'Fundamentos de JavaScript para iniciantes',
            videoCount: 12,
            thumbnailLink: 'https://via.placeholder.com/320x180?text=JavaScript',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'React Avançado',
            description: 'Técnicas avançadas de React e padrões de projeto',
            videoCount: 8,
            thumbnailLink: 'https://via.placeholder.com/320x180?text=React',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Node.js do Zero',
            description: 'Aprenda Node.js do básico ao avançado',
            videoCount: 15,
            thumbnailLink: 'https://via.placeholder.com/320x180?text=Node.js',
            createdAt: new Date().toISOString()
          },
          {
            id: '4',
            name: 'TypeScript na Prática',
            description: 'Aplicações reais com TypeScript',
            videoCount: 10,
            thumbnailLink: 'https://via.placeholder.com/320x180?text=TypeScript',
            createdAt: new Date().toISOString()
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      toast.error('Erro ao carregar playlists')
      setIsLoading(false)
    }
  }

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPlaylistName.trim()) {
      toast.error('O nome da playlist é obrigatório')
      return
    }
    
    try {
      // Em uma implementação real, você enviaria uma requisição para a API
      // const response = await axios.post(`${API_URL}/api/playlists`, {
      //   name: newPlaylistName,
      //   description: newPlaylistDescription
      // })
      
      // Simulando criação de playlist
      const newPlaylist: Playlist = {
        id: Math.random().toString(36).substring(2, 9),
        name: newPlaylistName,
        description: newPlaylistDescription,
        videoCount: 0,
        thumbnailLink: 'https://via.placeholder.com/320x180?text=Nova+Playlist',
        createdAt: new Date().toISOString()
      }
      
      setPlaylists([newPlaylist, ...playlists])
      setShowCreateModal(false)
      setNewPlaylistName('')
      setNewPlaylistDescription('')
      toast.success('Playlist criada com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar playlist')
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Playlists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma playlist encontrada</h2>
          <p className="text-gray-600 mb-6">Você ainda não criou nenhuma playlist. Comece organizando seus vídeos agora!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium"
          >
            Criar Primeira Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Link key={playlist.id} href={`/playlists/${playlist.id}`} className="block group">
              <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-video">
                  {playlist.thumbnailLink ? (
                    <Image
                      src={playlist.thumbnailLink}
                      alt={playlist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 text-sm">
                    {playlist.videoCount} vídeos
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">{playlist.name}</h3>
                  {playlist.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{playlist.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">
                    Criada em {new Date(playlist.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal de criação de playlist */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Nova Playlist</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreatePlaylist}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Playlist *
                </label>
                <input
                  type="text"
                  id="name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Ex: JavaScript Avançado"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  id="description"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Descreva o conteúdo desta playlist"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium"
                >
                  Criar Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

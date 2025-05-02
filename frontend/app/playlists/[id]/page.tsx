'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { toast } from 'react-hot-toast'

interface PlaylistVideo {
  id: string
  name: string
  thumbnailLink?: string
  duration?: string
  position: number
}

interface Playlist {
  id: string
  name: string
  description?: string
  videos: PlaylistVideo[]
  createdAt: string
  updatedAt: string
}

interface PlaylistPageProps {
  params: {
    id: string
  }
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  const { data: session, status } = useSession()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentVideo, setCurrentVideo] = useState<PlaylistVideo | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated' && params.id) {
      fetchPlaylist(params.id)
    }
  }, [status, params.id, router])

  const fetchPlaylist = async (id: string) => {
    setIsLoading(true)
    try {
      // Em uma implementação real, você buscaria esses dados da API
      // const response = await axios.get(`${API_URL}/api/playlists/${id}`)
      // setPlaylist(response.data)
      // if (response.data.videos.length > 0) {
      //   setCurrentVideo(response.data.videos[0])
      // }
      
      // Simulando dados da playlist
      setTimeout(() => {
        const mockPlaylist: Playlist = {
          id,
          name: 'JavaScript Essentials',
          description: 'Fundamentos de JavaScript para iniciantes. Esta playlist contém todos os conceitos básicos que você precisa saber para começar a programar em JavaScript.',
          videos: [
            {
              id: '1',
              name: 'Introdução ao JavaScript',
              thumbnailLink: 'https://via.placeholder.com/320x180?text=Intro+JS',
              duration: '12:34',
              position: 1
            },
            {
              id: '2',
              name: 'Variáveis e Tipos de Dados',
              thumbnailLink: 'https://via.placeholder.com/320x180?text=Variaveis',
              duration: '15:21',
              position: 2
            },
            {
              id: '3',
              name: 'Funções e Escopo',
              thumbnailLink: 'https://via.placeholder.com/320x180?text=Funcoes',
              duration: '18:45',
              position: 3
            },
            {
              id: '4',
              name: 'Arrays e Objetos',
              thumbnailLink: 'https://via.placeholder.com/320x180?text=Arrays',
              duration: '22:10',
              position: 4
            },
            {
              id: '5',
              name: 'Manipulação do DOM',
              thumbnailLink: 'https://via.placeholder.com/320x180?text=DOM',
              duration: '25:33',
              position: 5
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        setPlaylist(mockPlaylist)
        if (mockPlaylist.videos.length > 0) {
          setCurrentVideo(mockPlaylist.videos[0])
        }
        setIsLoading(false)
        setEditName(mockPlaylist.name)
        setEditDescription(mockPlaylist.description || '')
      }, 1000)
    } catch (error) {
      toast.error('Erro ao carregar playlist')
      setIsLoading(false)
    }
  }

  const handleVideoSelect = (video: PlaylistVideo) => {
    setCurrentVideo(video)
    // Scroll para o topo em dispositivos móveis
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleUpdatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editName.trim()) {
      toast.error('O nome da playlist é obrigatório')
      return
    }
    
    try {
      // Em uma implementação real, você enviaria uma requisição para a API
      // await axios.put(`${API_URL}/api/playlists/${playlist?.id}`, {
      //   name: editName,
      //   description: editDescription
      // })
      
      // Simulando atualização
      if (playlist) {
        setPlaylist({
          ...playlist,
          name: editName,
          description: editDescription,
          updatedAt: new Date().toISOString()
        })
      }
      
      setShowEditModal(false)
      toast.success('Playlist atualizada com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar playlist')
    }
  }

  const handleDeletePlaylist = async () => {
    if (!confirm('Tem certeza que deseja excluir esta playlist? Esta ação não pode ser desfeita.')) {
      return
    }
    
    try {
      // Em uma implementação real, você enviaria uma requisição para a API
      // await axios.delete(`${API_URL}/api/playlists/${playlist?.id}`)
      
      toast.success('Playlist excluída com sucesso!')
      router.push('/playlists')
    } catch (error) {
      toast.error('Erro ao excluir playlist')
    }
  }

  const handleRemoveVideo = async (videoId: string) => {
    if (!confirm('Tem certeza que deseja remover este vídeo da playlist?')) {
      return
    }
    
    try {
      // Em uma implementação real, você enviaria uma requisição para a API
      // await axios.delete(`${API_URL}/api/playlists/${playlist?.id}/videos/${videoId}`)
      
      // Simulando remoção
      if (playlist) {
        const updatedVideos = playlist.videos.filter(v => v.id !== videoId)
        
        // Se o vídeo atual foi removido, selecione o primeiro da lista
        if (currentVideo?.id === videoId && updatedVideos.length > 0) {
          setCurrentVideo(updatedVideos[0])
        } else if (updatedVideos.length === 0) {
          setCurrentVideo(null)
        }
        
        setPlaylist({
          ...playlist,
          videos: updatedVideos,
          updatedAt: new Date().toISOString()
        })
        
        toast.success('Vídeo removido da playlist')
      }
    } catch (error) {
      toast.error('Erro ao remover vídeo')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Playlist não encontrada</h1>
          <p className="text-gray-600 mb-6">A playlist que você está procurando não existe ou foi removida.</p>
          <Link href="/playlists" className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium">
            Voltar para playlists
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/playlists" className="text-yellow-600 hover:text-yellow-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar para playlists
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Coluna do player */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {currentVideo ? (
              <>
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0`} // Placeholder
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900">{currentVideo.name}</h2>
                  <p className="text-gray-500 mt-1">Vídeo {currentVideo.position} de {playlist.videos.length}</p>
                </div>
              </>
            ) : (
              <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum vídeo na playlist</h3>
                  <p className="text-gray-600">Adicione vídeos à sua playlist para começar a assistir.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{playlist.name}</h1>
                <p className="text-gray-500 mt-1">{playlist.videos.length} vídeos</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                  aria-label="Editar playlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDeletePlaylist}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label="Excluir playlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {playlist.description && (
              <p className="text-gray-600 mb-4">{playlist.description}</p>
            )}

            <div className="text-sm text-gray-500">
              <p>Criada em {new Date(playlist.createdAt).toLocaleDateString()}</p>
              <p>Última atualização em {new Date(playlist.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Coluna da lista de vídeos */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Vídeos na Playlist</h2>
            </div>
            
            {playlist.videos.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600">Nenhum vídeo nesta playlist.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {playlist.videos.map((video) => (
                  <div
                    key={video.id}
                    className={`p-3 flex cursor-pointer hover:bg-gray-50 transition-colors ${currentVideo?.id === video.id ? 'bg-yellow-50' : ''}`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="relative w-24 h-16 flex-shrink-0">
                      {video.thumbnailLink ? (
                        <Image
                          src={video.thumbnailLink}
                          alt={video.name}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {video.duration && (
                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{video.name}</p>
                      <p className="text-xs text-gray-500">Vídeo {video.position}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveVideo(video.id)
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remover vídeo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="p-4 border-t border-gray-200">
              <button
                className="w-full px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Vídeos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edição */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Editar Playlist</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdatePlaylist}>
              <div className="mb-4">
                <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Playlist *
                </label>
                <input
                  type="text"
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Ex: JavaScript Avançado"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Descreva o conteúdo desta playlist"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors font-medium"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

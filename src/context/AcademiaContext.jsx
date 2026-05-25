import { createContext, useContext, useState, useEffect } from 'react'
import { MODULES } from '../data/modules'

const AcademiaContext = createContext()

export function AcademiaProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('majho_user')
    return saved ? JSON.parse(saved) : null
  })

  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('majho_progress')
    return saved ? JSON.parse(saved) : {}
  })

  const [communityPosts, setCommunityPosts] = useState(() => {
    const saved = localStorage.getItem('majho_posts')
    if (saved) return JSON.parse(saved)
    return [
      {
        id: 1,
        author: 'María González',
        avatar: 'MG',
        avatarColor: '#7B5EA7',
        role: 'Mamá de Sofía (7 años)',
        content: 'Increíble el módulo de PNL Infantil 🌟 Hoy apliqué el ancla del "poder" con mi hija antes de su presentación en el colegio y llegó a casa contando que fue la mejor de todas. Las lágrimas de alegría no pararon 💜',
        likes: 24,
        comments: 8,
        time: 'Hace 2 horas',
        liked: false
      },
      {
        id: 2,
        author: 'Carolina Méndez',
        avatar: 'CM',
        avatarColor: '#5C8A6E',
        role: 'Educadora de Primera Infancia',
        content: 'El módulo de Neurociencia Infantil cambió completamente mi perspectiva como maestra. Ahora entiendo por qué mis estudiantes reaccionan de cierta manera y puedo acompañarlos mucho mejor. ¡Gracias Academia MAJHO! ✨',
        likes: 31,
        comments: 12,
        time: 'Hace 5 horas',
        liked: false
      },
      {
        id: 3,
        author: 'Andrea Torres',
        avatar: 'AT',
        avatarColor: '#C9A84C',
        role: 'Papá de gemelos',
        content: 'Compartiendo el ritual de los 4 elementos que creamos en familia este fin de semana 🌿🔥💧🌬️ Mis hijos de 5 años están totalmente conectados con la naturaleza ahora. El módulo de Sabiduría Ancestral es MÁGICO.',
        likes: 45,
        comments: 18,
        time: 'Hace 1 día',
        liked: false
      },
      {
        id: 4,
        author: 'Valentina Ruiz',
        avatar: 'VR',
        avatarColor: '#F2C4CE',
        role: 'Terapeuta Infantil',
        content: '¡Acabo de recibir mi certificado digital! 🏆 Después de 9 módulos de aprendizaje profundo, me siento completamente transformada. Recomiendo este curso a todas las personas que trabajan con niños de alta vibración. El Método MAJHO es revolucionario.',
        likes: 67,
        comments: 23,
        time: 'Hace 2 días',
        liked: false
      }
    ]
  })

  useEffect(() => {
    if (user) localStorage.setItem('majho_user', JSON.stringify(user))
    else localStorage.removeItem('majho_user')
  }, [user])

  useEffect(() => {
    localStorage.setItem('majho_progress', JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    localStorage.setItem('majho_posts', JSON.stringify(communityPosts))
  }, [communityPosts])

  const login = (userData) => {
    const fullUser = { ...userData, joinedAt: new Date().toISOString() }
    setUser(fullUser)
  }

  const logout = () => {
    setUser(null)
  }

  const markVideoWatched = (moduleId) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], videoWatched: true }
    }))
  }

  const markPdfDownloaded = (moduleId) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], pdfDownloaded: true }
    }))
  }

  const markExerciseCompleted = (moduleId, answers) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], exerciseCompleted: true, exerciseAnswers: answers }
    }))
  }

  const getModuleProgress = (moduleId) => {
    const p = progress[moduleId] || {}
    const steps = [p.videoWatched, p.pdfDownloaded, p.exerciseCompleted]
    return Math.round((steps.filter(Boolean).length / 3) * 100)
  }

  const isModuleComplete = (moduleId) => {
    const p = progress[moduleId] || {}
    return p.videoWatched && p.pdfDownloaded && p.exerciseCompleted
  }

  const completedModules = MODULES.filter(m => isModuleComplete(m.id)).length
  const allCompleted = completedModules === MODULES.length

  const likePost = (postId) => {
    setCommunityPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
        : post
    ))
  }

  const addPost = (content) => {
    const newPost = {
      id: Date.now(),
      author: user?.name || 'Estudiante MAJHO',
      avatar: (user?.name || 'SM').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      avatarColor: '#7B5EA7',
      role: user?.role || 'Estudiante',
      content,
      likes: 0,
      comments: 0,
      time: 'Ahora mismo',
      liked: false
    }
    setCommunityPosts(prev => [newPost, ...prev])
  }

  return (
    <AcademiaContext.Provider value={{
      user, login, logout,
      progress, markVideoWatched, markPdfDownloaded, markExerciseCompleted,
      getModuleProgress, isModuleComplete, completedModules, allCompleted,
      communityPosts, likePost, addPost
    }}>
      {children}
    </AcademiaContext.Provider>
  )
}

export const useAcademia = () => useContext(AcademiaContext)

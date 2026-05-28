import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { MODULES } from '../data/modules'
 
const AcademiaContext = createContext()
 
export function AcademiaProvider({ children }) {
  const [user, setUser] = useState(null)
  const [progress, setProgress] = useState({})
  const [loadingAuth, setLoadingAuth] = useState(true)
 
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
 
  // ── Escucha la sesión activa de Supabase al cargar la app ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || '',
          role: session.user.user_metadata?.role || ''
        })
        loadProgress(session.user.id)
      }
      setLoadingAuth(false)
    })
 
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || '',
          role: session.user.user_metadata?.role || ''
        })
        loadProgress(session.user.id)
      } else {
        setUser(null)
        setProgress({})
      }
    })
 
    return () => listener.subscription.unsubscribe()
  }, [])
 
  // ── Carga el progreso desde Supabase ──
  const loadProgress = async (userId) => {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
 
    if (!error && data) {
      const progressMap = {}
      data.forEach(row => {
        progressMap[row.module_id] = {
          videoWatched: row.video_watched,
          pdfDownloaded: row.pdf_downloaded,
          exerciseCompleted: row.exercise_completed,
          exerciseAnswers: row.exercise_answers
        }
      })
      setProgress(progressMap)
    }
  }
 
  // ── Guarda/actualiza progreso en Supabase ──
  const saveProgress = async (moduleId, updates) => {
    if (!user?.id) return
    const { error } = await supabase
      .from('progress')
      .upsert({
        user_id: user.id,
        module_id: moduleId,
        ...updates,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,module_id' })
 
    if (!error) {
      setProgress(prev => ({
        ...prev,
        [moduleId]: { ...prev[moduleId], ...updates }
      }))
    }
  }
 
  // ── Login con Supabase ──
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }
 
  // ── Registro con Supabase ──
  const register = async ({ name, email, role, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } }
    })
    if (error) throw error
    return data
  }
 
  // ── Logout ──
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProgress({})
  }
 
  const markVideoWatched = (moduleId) => {
    const current = progress[moduleId] || {}
    saveProgress(moduleId, {
      video_watched: true,
      pdf_downloaded: current.pdfDownloaded || false,
      exercise_completed: current.exerciseCompleted || false,
      exercise_answers: current.exerciseAnswers || null
    })
  }
 
  const markPdfDownloaded = (moduleId) => {
    const current = progress[moduleId] || {}
    saveProgress(moduleId, {
      video_watched: current.videoWatched || false,
      pdf_downloaded: true,
      exercise_completed: current.exerciseCompleted || false,
      exercise_answers: current.exerciseAnswers || null
    })
  }
 
  const markExerciseCompleted = (moduleId, answers) => {
    const current = progress[moduleId] || {}
    saveProgress(moduleId, {
      video_watched: current.videoWatched || false,
      pdf_downloaded: current.pdfDownloaded || false,
      exercise_completed: true,
      exercise_answers: answers
    })
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
 
  useEffect(() => {
    localStorage.setItem('majho_posts', JSON.stringify(communityPosts))
  }, [communityPosts])
 
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
 
  if (loadingAuth) return null
 
  return (
    <AcademiaContext.Provider value={{
      user, login, logout, register,
      progress, markVideoWatched, markPdfDownloaded, markExerciseCompleted,
      getModuleProgress, isModuleComplete, completedModules, allCompleted,
      communityPosts, likePost, addPost
    }}>
      {children}
    </AcademiaContext.Provider>
  )
}
 
export const useAcademia = () => useContext(AcademiaContext)

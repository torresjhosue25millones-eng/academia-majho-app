import { useState } from 'react'
import { useAcademia } from '../context/AcademiaContext'
import Navbar from '../components/Navbar'
import { Heart, MessageCircle, Send, Users, Star, PenLine } from 'lucide-react'
import styles from './CommunityPage.module.css'

function PostCard({ post, onLike }) {
  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar} style={{ background: post.avatarColor }}>
          {post.avatar}
        </div>
        <div className={styles.postMeta}>
          <strong>{post.author}</strong>
          <span>{post.role}</span>
        </div>
        <span className={styles.postTime}>{post.time}</span>
      </div>

      <p className={styles.postContent}>{post.content}</p>

      <div className={styles.postActions}>
        <button
          className={`${styles.actionBtn} ${post.liked ? styles.liked : ''}`}
          onClick={() => onLike(post.id)}
        >
          <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />
          {post.likes}
        </button>
        <button className={styles.actionBtn}>
          <MessageCircle size={16} />
          {post.comments} comentarios
        </button>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const { user, communityPosts, likePost, addPost } = useAcademia()
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [filter, setFilter] = useState('recent')

  const handlePost = async (e) => {
    e.preventDefault()
    if (!newPost.trim()) return
    setPosting(true)
    await new Promise(r => setTimeout(r, 600))
    addPost(newPost.trim())
    setNewPost('')
    setPosting(false)
  }

  const sortedPosts = [...communityPosts].sort((a, b) => {
    if (filter === 'popular') return b.likes - a.likes
    return b.id - a.id
  })

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.layout}>

            {/* Main feed */}
            <div className={styles.feed}>
              <div className={styles.feedHeader}>
                <h1 className={styles.feedTitle}>Comunidad Privada</h1>
                <p className={styles.feedSubtitle}>Comparte tu experiencia, avances e inspiración con otras guías del Método MAJHO.</p>
              </div>

              {/* New post */}
              <div className={styles.newPost}>
                <div className={styles.postAvatar} style={{ background: 'var(--violet)' }}>
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <form onSubmit={handlePost} className={styles.newPostForm}>
                  <textarea
                    placeholder="Comparte tu experiencia, reflexión o pregunta con la comunidad MAJHO... ✨"
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    rows={3}
                  />
                  <div className={styles.newPostFooter}>
                    <span className={styles.newPostHint}>
                      <PenLine size={14} /> Comparte desde el corazón
                    </span>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={!newPost.trim() || posting}
                    >
                      {posting ? <span className={styles.spinner} /> : <Send size={15} />}
                      {posting ? 'Publicando...' : 'Publicar'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Filter tabs */}
              <div className={styles.filterTabs}>
                <button
                  className={`${styles.filterTab} ${filter === 'recent' ? styles.filterActive : ''}`}
                  onClick={() => setFilter('recent')}
                >
                  Más recientes
                </button>
                <button
                  className={`${styles.filterTab} ${filter === 'popular' ? styles.filterActive : ''}`}
                  onClick={() => setFilter('popular')}
                >
                  <Star size={13} /> Más populares
                </button>
              </div>

              {/* Posts */}
              <div className={styles.posts}>
                {sortedPosts.map(post => (
                  <PostCard key={post.id} post={post} onLike={likePost} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.sideCard}>
                <h3><Users size={16} /> La comunidad</h3>
                <div className={styles.sideStats}>
                  <div className={styles.sideStat}>
                    <strong>+500</strong>
                    <span>Guías activas</span>
                  </div>
                  <div className={styles.sideStat}>
                    <strong>+2.4k</strong>
                    <span>Publicaciones</span>
                  </div>
                </div>
              </div>

              <div className={styles.sideCard}>
                <h3>🌟 Tu perfil en la comunidad</h3>
                <div className={styles.profilePreview}>
                  <div className={styles.profileAvatar} style={{ background: 'var(--violet)' }}>
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{user?.name || 'Guía MAJHO'}</strong>
                    <span>{user?.role || 'Estudiante'}</span>
                  </div>
                </div>
              </div>

              <div className={styles.sideCard}>
                <h3>✦ Normas de la comunidad</h3>
                <ul className={styles.normas}>
                  <li>💜 Comparte desde el amor y el respeto</li>
                  <li>🌿 Celebra los logros de todos</li>
                  <li>✨ Usa lenguaje positivo y elevado</li>
                  <li>🔒 Lo que se comparte aquí, permanece aquí</li>
                  <li>🙏 Honra la diversidad de caminos</li>
                </ul>
              </div>

              <div className={`${styles.sideCard} ${styles.sideCardHighlight}`}>
                <h3>🏆 Guías del mes</h3>
                <div className={styles.topGuides}>
                  {[
                    { name: 'Valentina R.', points: 234, color: '#7B5EA7' },
                    { name: 'Carolina M.', points: 189, color: '#5C8A6E' },
                    { name: 'María G.', points: 156, color: '#C9A84C' },
                  ].map((guide, i) => (
                    <div key={guide.name} className={styles.guideRow}>
                      <span className={styles.guideRank}>{i + 1}</span>
                      <div className={styles.guideAvatar} style={{ background: guide.color }}>
                        {guide.name.charAt(0)}
                      </div>
                      <span className={styles.guideName}>{guide.name}</span>
                      <span className={styles.guidePoints}>{guide.points} ✦</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

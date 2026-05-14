import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAcademia } from '../context/AcademiaContext'
import { MODULES } from '../data/modules'
import Navbar from '../components/Navbar'
import { PlayCircle, FileText, PenLine, ChevronLeft, ChevronRight, CheckCircle, Download, Send } from 'lucide-react'
import styles from './ModulePage.module.css'

function VideoTab({ module, watched, onWatch }) {
  const [playing, setPlaying] = useState(false)

  const handleWatch = () => {
    setPlaying(true)
    if (!watched) setTimeout(onWatch, 3000)
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.videoSection}>
        <h2 className={styles.tabTitle}>Video del Módulo</h2>
        <p className={styles.tabDesc}>{module.description}</p>
        <div className={styles.videoWrapper}>
          {!playing ? (
            <div className={styles.videoThumb} onClick={handleWatch}>
              <div className={styles.videoOverlay}>
                <div className={styles.playBtn}>
                  <PlayCircle size={64} />
                </div>
                <div className={styles.videoInfo}>
                  <span>{module.icon} {module.title}</span>
                  <span>{module.duration}</span>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={`${module.videoUrl}?autoplay=1&rel=0`}
              title={module.title}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </div>
        {watched && (
          <div className={styles.doneAlert}>
            <CheckCircle size={18} />
            Video marcado como visto ✦
          </div>
        )}
        {!watched && !playing && (
          <button className="btn-primary" onClick={handleWatch}>
            <PlayCircle size={18} /> Ver video ahora
          </button>
        )}
      </div>
    </div>
  )
}

function PdfTab({ module, downloaded, onDownload }) {
  const handleDownload = () => {
    onDownload()
    const link = document.createElement('a')
    link.href = '#'
    link.download = module.pdfName
    alert(`📄 Descargando: ${module.pdfName}\n\n(En producción este archivo estaría disponible para descarga real)`)
  }

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Material PDF</h2>
      <p className={styles.tabDesc}>Descarga el material de apoyo de este módulo para reforzar tu aprendizaje y tener una guía de referencia rápida.</p>

      <div className={styles.pdfCard}>
        <div className={styles.pdfIcon}>📄</div>
        <div className={styles.pdfInfo}>
          <h3>{module.pdfName.replace(/_/g, ' ').replace('.pdf', '')}</h3>
          <p>Módulo {module.id} · Guía de referencia completa · PDF</p>
        </div>
        <button className="btn-primary" onClick={handleDownload}>
          <Download size={16} /> Descargar PDF
        </button>
      </div>

      <div className={styles.pdfContents}>
        <h3>Contenido del material:</h3>
        <ul>
          <li>✦ Resumen ejecutivo del módulo</li>
          <li>✦ Conceptos clave y definiciones</li>
          <li>✦ Técnicas y ejercicios detallados</li>
          <li>✦ Referencias y bibliografía</li>
          <li>✦ Tabla de actividades prácticas</li>
        </ul>
      </div>

      {downloaded && (
        <div className={styles.doneAlert}>
          <CheckCircle size={18} />
          Material descargado ✦
        </div>
      )}
    </div>
  )
}

function ExerciseTab({ module, completed, onComplete, savedAnswers }) {
  const [answers, setAnswers] = useState(savedAnswers || {})
  const [submitted, setSubmitted] = useState(completed)

  const setAnswer = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const allAnswered = module.exercise.questions.every(q => answers[q.id])
    if (!allAnswered) {
      alert('Por favor responde todas las preguntas antes de enviar.')
      return
    }
    setSubmitted(true)
    onComplete(answers)
  }

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>{module.exercise.title}</h2>
      <p className={styles.tabDesc}>{module.exercise.description}</p>

      {submitted ? (
        <div className={styles.exerciseDone}>
          <div className={styles.exerciseDoneIcon}>🌟</div>
          <h3>¡Ejercicio completado!</h3>
          <p>Has reflexionado profundamente sobre este módulo. Tu aprendizaje queda guardado.</p>
          <div className={styles.savedAnswers}>
            {module.exercise.questions.map(q => (
              <div key={q.id} className={styles.savedAnswer}>
                <strong>{q.label}</strong>
                <span>{Array.isArray(answers[q.id]) ? answers[q.id].join(', ') : answers[q.id]}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.exerciseForm}>
          {module.exercise.questions.map((q, i) => (
            <div key={q.id} className={styles.exerciseQuestion}>
              <label>
                <span className={styles.qNum}>{i + 1}</span>
                {q.label}
              </label>

              {q.type === 'textarea' && (
                <textarea
                  rows={4}
                  placeholder="Escribe tu respuesta aquí..."
                  value={answers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)}
                />
              )}

              {q.type === 'select' && (
                <select
                  value={answers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)}
                >
                  <option value="" disabled>Selecciona una opción</option>
                  {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}

              {q.type === 'checkbox' && (
                <div className={styles.checkboxGroup}>
                  {q.options.map(opt => (
                    <label key={opt} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={(answers[q.id] || []).includes(opt)}
                        onChange={e => {
                          const current = answers[q.id] || []
                          setAnswer(q.id, e.target.checked ? [...current, opt] : current.filter(v => v !== opt))
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
            <Send size={16} /> Enviar ejercicio
          </button>
        </form>
      )}
    </div>
  )
}

export default function ModulePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const moduleId = parseInt(id)
  const module = MODULES.find(m => m.id === moduleId)
  const { progress, markVideoWatched, markPdfDownloaded, markExerciseCompleted, isModuleComplete } = useAcademia()

  const [activeTab, setActiveTab] = useState('video')

  if (!module) {
    navigate('/dashboard')
    return null
  }

  const mp = progress[moduleId] || {}
  const prevModule = MODULES.find(m => m.id === moduleId - 1)
  const nextModule = MODULES.find(m => m.id === moduleId + 1)
  const complete = isModuleComplete(moduleId)

  const completedSteps = [mp.videoWatched, mp.pdfDownloaded, mp.exerciseCompleted].filter(Boolean).length

  const TABS = [
    { id: 'video', label: 'Video', icon: <PlayCircle size={16} />, done: mp.videoWatched },
    { id: 'pdf', label: 'Material PDF', icon: <FileText size={16} />, done: mp.pdfDownloaded },
    { id: 'ejercicio', label: 'Ejercicio', icon: <PenLine size={16} />, done: mp.exerciseCompleted },
  ]

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">

          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link to="/dashboard">← Mis módulos</Link>
            <span>/</span>
            <span>Módulo {moduleId}</span>
          </div>

          {/* Module header */}
          <div className={styles.moduleHeader} style={{ borderLeft: `4px solid ${module.color}` }}>
            <div className={styles.moduleHeaderLeft}>
              <div className={styles.moduleNum} style={{ background: module.color + '20', color: module.color }}>
                Módulo {String(moduleId).padStart(2, '0')}
              </div>
              <span className={styles.moduleIcon}>{module.icon}</span>
              <div>
                <h1 className={styles.moduleTitle}>{module.title}</h1>
                <p className={styles.moduleSubtitle}>{module.subtitle}</p>
              </div>
            </div>
            <div className={styles.moduleHeaderRight}>
              <div className={styles.stepsProgress}>
                {TABS.map(tab => (
                  <div key={tab.id} className={`${styles.step} ${tab.done ? styles.stepDone : ''}`}>
                    {tab.done ? <CheckCircle size={14} /> : <span />}
                    {tab.label}
                  </div>
                ))}
              </div>
              <div className={styles.stepsBar}>
                <div className={styles.stepsFill} style={{ width: `${(completedSteps / 3) * 100}%`, background: module.color }} />
              </div>
              <p className={styles.stepsLabel}>{completedSteps}/3 pasos completados</p>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''} ${tab.done ? styles.tabDone : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? { borderBottomColor: module.color, color: module.color } : {}}
              >
                {tab.icon}
                {tab.label}
                {tab.done && <CheckCircle size={13} className={styles.tabCheck} />}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={styles.content}>
            {activeTab === 'video' && (
              <VideoTab module={module} watched={mp.videoWatched} onWatch={() => markVideoWatched(moduleId)} />
            )}
            {activeTab === 'pdf' && (
              <PdfTab module={module} downloaded={mp.pdfDownloaded} onDownload={() => markPdfDownloaded(moduleId)} />
            )}
            {activeTab === 'ejercicio' && (
              <ExerciseTab
                module={module}
                completed={mp.exerciseCompleted}
                savedAnswers={mp.exerciseAnswers}
                onComplete={(answers) => markExerciseCompleted(moduleId, answers)}
              />
            )}
          </div>

          {/* Module complete banner */}
          {complete && (
            <div className={styles.completeBanner} style={{ background: `linear-gradient(135deg, ${module.color}22, ${module.color}08)`, borderColor: module.color + '40' }}>
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <div>
                <strong>¡Módulo completado!</strong>
                <p>Has completado todos los pasos de este módulo. ¡Sigue adelante!</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.navigation}>
            {prevModule ? (
              <Link to={`/modulo/${prevModule.id}`} className={styles.navBtn}>
                <ChevronLeft size={16} />
                <div>
                  <span>Anterior</span>
                  <strong>{prevModule.title}</strong>
                </div>
              </Link>
            ) : <div />}

            {nextModule ? (
              <Link to={`/modulo/${nextModule.id}`} className={`${styles.navBtn} ${styles.navBtnRight}`}>
                <div>
                  <span>Siguiente</span>
                  <strong>{nextModule.title}</strong>
                </div>
                <ChevronRight size={16} />
              </Link>
            ) : (
              <Link to="/dashboard" className={`${styles.navBtn} ${styles.navBtnRight}`}>
                <div>
                  <span>Finalizar</span>
                  <strong>Volver al dashboard</strong>
                </div>
                <ChevronRight size={16} />
              </Link>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

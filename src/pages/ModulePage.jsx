import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAcademia } from '../context/AcademiaContext'
import { MODULES } from '../data/modules'
import Navbar from '../components/Navbar'
import { PlayCircle, FileText, PenLine, ChevronLeft, ChevronRight, CheckCircle, Send, Download } from 'lucide-react'
import styles from './ModulePage.module.css'

function VideoTab({ module, watched, onWatch }) {
  const handleWatch = () => {
    if (!watched) onWatch()
  }

  const welcomeSubtitles = {
    1: '¡Bienvenida al curso premium de crianza consciente!',
    2: 'El cerebro de tu hijo es un universo por descubrir',
    3: 'Reprograma, ancla y co-crea con tu hijo',
    4: 'La sabiduría de los ancestros vive en ti',
    5: 'La quietud es el lenguaje del alma infantil',
    6: 'El vínculo que sana y transforma',
    7: 'Tu hijo llegó con un mapa cósmico único',
    8: 'Cada niño vibra con una luz única',
    9: 'Eres ahora una Guía MAJHO certificada',
  }

  const bgGradients = {
    1: 'linear-gradient(135deg, #4a7c5e 0%, #2d5a3d 50%, #1a3d28 100%)',
    2: 'linear-gradient(135deg, #4a7c5e 0%, #3d6b52 50%, #2a4f3a 100%)',
    3: 'linear-gradient(135deg, #5c6b4a 0%, #4a5a3a 50%, #3a4a2d 100%)',
    4: 'linear-gradient(135deg, #7a6a3a 0%, #6b5a2d 50%, #5a4a1e 100%)',
    5: 'linear-gradient(135deg, #3d6b4a 0%, #2d5a3a 50%, #1e4a2a 100%)',
    6: 'linear-gradient(135deg, #4a5c7a 0%, #3a4a6b 50%, #2a3a5a 100%)',
    7: 'linear-gradient(135deg, #6b5a3a 0%, #5a4a2d 50%, #4a3a1e 100%)',
    8: 'linear-gradient(135deg, #6b4a5a 0%, #5a3a4a 50%, #4a2d3a 100%)',
    9: 'linear-gradient(135deg, #4a6b3a 0%, #3a5a2d 50%, #2d4a1e 100%)',
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.videoSection}>
        <h2 className={styles.tabTitle}>Módulo {module.id}</h2>
        <p className={styles.tabDesc}>{module.description}</p>

        <div className={styles.videoWrapper}>
          <div
            className={styles.videoPlaceholder}
            style={{ background: bgGradients[module.id] || bgGradients[1] }}
            onClick={handleWatch}
          >
            <div className={styles.placeholderPattern} />

            <div className={styles.placeholderContent}>
              <div className={styles.placeholderIcon}>{module.icon}</div>
              <div className={styles.placeholderLogo}>MAJHO</div>
              <h3 className={styles.placeholderTitle}>{module.title}</h3>
              <p className={styles.placeholderSubtitle}>
                {welcomeSubtitles[module.id]}
              </p>
              <div className={styles.placeholderDivider} />
              <p className={styles.placeholderTag}>Academia MAJHO · Crianza Consciente & Espiritualidad Familiar</p>
            </div>

            <div className={styles.placeholderPlayBtn}>
              <PlayCircle size={52} color="rgba(255,255,255,0.85)" />
              <span>Video próximamente</span>
            </div>
          </div>
        </div>

        {watched && (
          <div className={styles.doneAlert}>
            <CheckCircle size={18} />
            Módulo marcado como visto ✓
          </div>
        )}
        {!watched && (
          <button className="btn-primary" onClick={handleWatch}>
            <CheckCircle size={18} /> Marcar como visto
          </button>
        )}
      </div>
    </div>
  )
}

function PdfTab({ module, downloaded, onDownload }) {
  const pdfUrl = `/pdfs/${module.pdfName}`

  const handleMark = () => {
    if (!downloaded) onDownload()
  }

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>Material del Módulo</h2>
      <p className={styles.tabDesc}>
        Lee el material completo de este módulo directamente aquí, o descárgalo para conservarlo. Son aproximadamente 18–20 páginas de contenido profundo y transformador.
      </p>

      <a
        href={pdfUrl}
        download={module.pdfName}
        className="btn-primary"
        style={{ marginBottom: '1rem', display: 'inline-flex' }}
      >
        <Download size={18} /> Descargar PDF
      </a>

      <div className={styles.pdfViewerWrapper}>
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          className={styles.pdfViewer}
          title={`Material Módulo ${module.id}`}
        />
      </div>

      {downloaded && (
        <div className={styles.doneAlert}>
          <CheckCircle size={18} />
          Material completado ✓
        </div>
      )}
      {!downloaded && (
        <button className="btn-primary" onClick={handleMark} style={{ marginTop: '1rem' }}>
          <CheckCircle size={18} /> Marcar material como leído
        </button>
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
          <div className={styles.exerciseDoneIcon}>🎯</div>
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

          <div className={styles.breadcrumb}>
            <Link to="/dashboard">← Mis módulos</Link>
            <span>/</span>
            <span>Módulo {moduleId}</span>
          </div>

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

          {complete && (
            <div className={styles.completeBanner} style={{ background: `linear-gradient(135deg, ${module.color}22, ${module.color}08)`, borderColor: module.color + '40' }}>
              <span style={{ fontSize: '2rem' }}>🏆</span>
              <div>
                <strong>¡Módulo completado!</strong>
                <p>Has completado todos los pasos de este módulo. ¡Sigue adelante!</p>
              </div>
            </div>
          )}

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

import { Link } from 'react-router-dom'
import { useAcademia } from '../context/AcademiaContext'
import { MODULES } from '../data/modules'
import Navbar from '../components/Navbar'
import { CheckCircle, Lock, PlayCircle, Award, Users, ChevronRight } from 'lucide-react'
import styles from './Dashboard.module.css'

function ModuleCard({ module, isUnlocked, isComplete, progress }) {
  return (
    <Link
      to={isUnlocked ? `/modulo/${module.id}` : '#'}
      className={`${styles.moduleCard} ${isComplete ? styles.complete : ''} ${!isUnlocked ? styles.locked : ''}`}
    >
      <div className={styles.cardTop} style={{ background: isComplete ? `${module.color}18` : isUnlocked ? 'white' : '#f5f5f5' }}>
        <div className={styles.moduleNum} style={{ background: isComplete ? module.color : isUnlocked ? `${module.color}25` : '#e0e0e0', color: isComplete ? 'white' : isUnlocked ? module.color : '#aaa' }}>
          {isComplete ? <CheckCircle size={16} /> : String(module.id).padStart(2, '0')}
        </div>
        <span className={styles.moduleIcon}>{module.icon}</span>
        {!isUnlocked && <Lock size={16} className={styles.lockIcon} />}
        {isComplete && <span className={styles.completeBadge}>Completado</span>}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.moduleTitle}>{module.title}</h3>
        <p className={styles.moduleSubtitle}>{module.subtitle}</p>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%`, background: module.color }} />
        </div>
        <div className={styles.progressMeta}>
          <span>{progress}% completado</span>
          <span>{module.lessons} lecciones · {module.duration}</span>
        </div>

        {isUnlocked && (
          <div className={styles.cardAction}>
            <span>{isComplete ? 'Revisar módulo' : progress > 0 ? 'Continuar' : 'Comenzar'}</span>
            <ChevronRight size={16} />
          </div>
        )}
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { user, getModuleProgress, isModuleComplete, completedModules, allCompleted } = useAcademia()
  const totalProgress = Math.round((completedModules / MODULES.length) * 100)

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">

          {/* Welcome */}
          <div className={styles.welcome}>
            <div className={styles.welcomeLeft}>
              <p className={styles.welcomeGreeting}>✦ Bienvenida/o de vuelta</p>
              <h1 className={styles.welcomeName}>{user?.name?.split(' ')[0] || 'Estudiante'}</h1>
              <p className={styles.welcomeRole}>{user?.role || 'Guía MAJHO en formación'}</p>
            </div>
            <div className={styles.welcomeRight}>
              <div className={styles.overallProgress}>
                <svg viewBox="0 0 120 120" className={styles.progressRing}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="var(--gold)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - totalProgress / 100)}`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                  <text x="60" y="56" textAnchor="middle" fill="var(--text-dark)" fontSize="20" fontWeight="700" fontFamily="Cormorant Garamond, serif">{totalProgress}%</text>
                  <text x="60" y="72" textAnchor="middle" fill="var(--text-light)" fontSize="9" fontFamily="Montserrat, sans-serif">completado</text>
                </svg>
                <div>
                  <p className={styles.progressStat}><strong>{completedModules}</strong> de 9 módulos</p>
                  <p className={styles.progressNote}>completados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alert certificado */}
          {allCompleted && (
            <Link to="/certificado" className={styles.certBanner}>
              <Award size={24} />
              <div>
                <strong>¡Felicitaciones! Completaste todos los módulos</strong>
                <span>Tu certificado digital está listo. Haz clic para descargarlo.</span>
              </div>
              <ChevronRight size={20} />
            </Link>
          )}

          {/* Quick links */}
          <div className={styles.quickLinks}>
            <Link to="/comunidad" className={styles.quickCard}>
              <Users size={20} />
              <span>Comunidad Privada</span>
              <ChevronRight size={14} />
            </Link>
            {allCompleted && (
              <Link to="/certificado" className={`${styles.quickCard} ${styles.quickCardGold}`}>
                <Award size={20} />
                <span>Mi Certificado</span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>

          {/* Modules grid */}
          <div className={styles.modulesHeader}>
            <h2>Tus Módulos</h2>
            <span>{completedModules}/9 completados</span>
          </div>

          <div className={styles.modulesGrid}>
            {MODULES.map((module, idx) => (
              <ModuleCard
                key={module.id}
                module={module}
                isUnlocked={idx === 0 || isModuleComplete(MODULES[idx - 1].id)}
                isComplete={isModuleComplete(module.id)}
                progress={getModuleProgress(module.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

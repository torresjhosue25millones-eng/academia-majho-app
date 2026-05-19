import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAcademia } from '../context/AcademiaContext'
import { MODULES } from '../data/modules'
import { Star, CheckCircle, Users, Award, BookOpen, Heart } from 'lucide-react'
import styles from './Landing.module.css'

function LogoImg({ className = 'h-10 w-auto', fallbackClass = '' }) {
  const [failed, setFailed] = useState(false)
  if (failed) return (
    <div className={fallbackClass} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>✦</span>
      <span className={styles.logoText}>Academia <em>MAJHO</em></span>
    </div>
  )
  return <img src="/assets/logo-majho.png" alt="Academia MAJHO" style={{ height: 70, width: 'auto' }} onError={() => setFailed(true)} />
}

const PILLARS = [
  { icon: '🧠', title: 'Neurociencia', desc: 'Basado en la ciencia del desarrollo cerebral infantil' },
  { icon: '💜', title: 'Consciencia', desc: 'Psicología y emociones desde el amor incondicional' },
  { icon: '✨', title: 'Espiritualidad', desc: 'Sabiduría ancestral y conexión con el universo' },
  { icon: '🌿', title: 'Integración', desc: 'Herramientas prácticas para la vida cotidiana' },
]

const TESTIMONIALS = [
  { name: 'Daniela Mora', role: 'Mamá y Educadora', text: 'El Método MAJHO transformó completamente mi relación con mi hija. Ahora entiendo su mundo interior y sé cómo acompañarla.', stars: 5, avatar: 'DM', color: '#7B5EA7' },
  { name: 'Roberto Silva', role: 'Padre de 3 hijos', text: 'Nunca imaginé que la numerología y la neurociencia pudieran combinarse tan perfectamente. Una formación única y poderosa.', stars: 5, avatar: 'RS', color: '#5C8A6E' },
  { name: 'Luciana Paz', role: 'Psicóloga Infantil', text: 'Como profesional de la salud mental, este curso amplió mi perspectiva de manera extraordinaria. Totalmente recomendado.', stars: 5, avatar: 'LP', color: '#C9A84C' },
]

export default function Landing() {
  const { user } = useAcademia()

  return (
    <div className={styles.page}>
      {/* ── Navbar simple ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <LogoImg />
          </div>
          <div className={styles.headerActions}>
            {user ? (
              <Link to="/dashboard" className="btn-primary">Ir al Curso</Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline">Iniciar Sesión</Link>
                <Link to="/register" className="btn-primary">Inscribirme Ahora</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContent}`}>
          <span className="badge badge-gold">✦ Curso Premium Certificado</span>
          <h1 className={styles.heroTitle}>
            Despierta el <em>potencial infinito</em><br />de los niños de alta vibración
          </h1>
          <p className={styles.heroSubtitle}>
            Una formación única que une neurociencia, psicología consciente, PNL infantil
            y sabiduría ancestral para guiar a los niños extraordinarios de hoy.
          </p>
          <div className={styles.heroCta}>
            <Link to={user ? '/dashboard' : '/register'} className="btn-primary">
              Comenzar mi transformación ✨
            </Link>
            <div className={styles.heroStats}>
              <span><strong>9</strong> módulos</span>
              <span>·</span>
              <span><strong>+30h</strong> de contenido</span>
              <span>·</span>
              <span><strong>Certificado</strong> digital</span>
            </div>
          </div>
        </div>
        <div className={styles.heroOrbs}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>
      </section>

      {/* ── Quién es para ── */}
      <section className={styles.forWhom}>
        <div className="container">
          <p className={styles.forWhomLabel}>Diseñado para</p>
          <div className={styles.forWhomGrid}>
            {['Mamás', 'Papás', 'Educadores', 'Terapeutas', 'Psicólogos', 'Cualquier persona que trabaje con niños'].map(item => (
              <span key={item} className={styles.forWhomTag}><CheckCircle size={14} /> {item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 Pilares ── */}
      <section className={styles.pillars}>
        <div className="container">
          <h2 className="section-title">Los 4 Pilares del Método MAJHO</h2>
          <div className="divider" />
          <p className="section-subtitle">Una metodología integral que aborda al niño en todas sus dimensiones: científica, emocional, espiritual y práctica.</p>
          <div className={styles.pillarsGrid}>
            {PILLARS.map(p => (
              <div key={p.title} className={styles.pillarCard}>
                <span className={styles.pillarIcon}>{p.icon}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Módulos ── */}
      <section className={styles.modulesSection}>
        <div className="container">
          <h2 className="section-title">9 Módulos Transformadores</h2>
          <div className="divider" />
          <p className="section-subtitle">Un viaje profundo de aprendizaje que te llevará desde los fundamentos científicos hasta las herramientas espirituales más poderosas.</p>
          <div className={styles.modulesGrid}>
            {MODULES.map(mod => (
              <div key={mod.id} className={styles.moduleCard}>
                <div className={styles.moduleNum} style={{ background: mod.color + '20', color: mod.color }}>
                  {String(mod.id).padStart(2, '0')}
                </div>
                <span className={styles.moduleIcon}>{mod.icon}</span>
                <div>
                  <h4 className={styles.moduleTitle}>{mod.title}</h4>
                  <p className={styles.moduleSubtitle}>{mod.subtitle}</p>
                </div>
                <div className={styles.moduleMeta}>
                  <span><BookOpen size={12} /> {mod.lessons} lecciones</span>
                  <span>⏱ {mod.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Incluye ── */}
      <section className={styles.includes}>
        <div className="container">
          <div className={styles.includesCard}>
            <div className={styles.includesLeft}>
              <h2>Todo lo que incluye<br /><em>tu inscripción</em></h2>
              <div className="divider" style={{ margin: '16px 0' }} />
              <ul className={styles.includesList}>
                {[
                  '9 módulos con video HD de alta calidad',
                  'Material PDF descargable por cada módulo',
                  'Ejercicios prácticos guiados',
                  'Acceso a comunidad privada exclusiva',
                  'Certificado digital automático al finalizar',
                  'Acceso de por vida al contenido',
                  'Actualizaciones incluidas sin costo',
                ].map(item => (
                  <li key={item}><CheckCircle size={16} color="var(--green)" /> {item}</li>
                ))}
              </ul>
              <Link to={user ? '/dashboard' : '/register'} className="btn-secondary" style={{ marginTop: '32px' }}>
                Quiero inscribirme ✦
              </Link>
            </div>
            <div className={styles.includesRight}>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}><span className={styles.statNum}>+500</span><span>Familias transformadas</span></div>
                <div className={styles.statBox}><span className={styles.statNum}>9</span><span>Módulos de formación</span></div>
                <div className={styles.statBox}><span className={styles.statNum}>4.9★</span><span>Calificación promedio</span></div>
                <div className={styles.statBox}><span className={styles.statNum}>100%</span><span>Online y flexible</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimoniales ── */}
      <section className={styles.testimonials}>
        <div className="container">
          <h2 className="section-title">Familias que ya se transformaron</h2>
          <div className="divider" />
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.stars}>{Array.from({ length: t.stars }, (_, i) => <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />)}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar} style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaOrb} />
            <h2>Comienza hoy tu viaje<br /><em>como Guía MAJHO</em></h2>
            <p>Únete a cientos de familias y educadores que ya están acompañando a los niños de alta vibración con consciencia, amor y sabiduría.</p>
            <Link to={user ? '/dashboard' : '/register'} className="btn-secondary">
              <Award size={18} /> Inscribirme y comenzar
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerLogo}>
            <LogoImg />
          </div>
          <p>Formación Espiritual y Científica para Acompañar Niños de Alta Vibración</p>
          <p style={{ marginTop: 8, fontSize: '0.8rem', opacity: 0.5 }}>© 2024 Academia MAJHO · Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  )
}

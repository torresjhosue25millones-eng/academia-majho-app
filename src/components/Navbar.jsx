import { useState, useCallback } from 'react'

function LogoImg() {
  const [failed, setFailed] = useState(false)
  const onErr = useCallback(() => setFailed(true), [])
  if (failed) return (
    <>
      <span style={{ color: 'var(--gold)', fontSize: '1.3rem' }}>✦</span>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '1.2rem', color: 'var(--text-dark)' }}>
        Academia <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>MAJHO</em>
      </span>
    </>
  )
  return <img src="/assets/logo-majho.png" alt="Academia MAJHO" style={{ height: 40, width: 'auto' }} onError={onErr} />
}
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAcademia } from '../context/AcademiaContext'
import { Menu, X, LogOut, Award, Users, LayoutDashboard } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout, completedModules, allCompleted } = useAcademia()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Mi Curso', icon: <LayoutDashboard size={16} /> },
    { to: '/comunidad', label: 'Comunidad', icon: <Users size={16} /> },
    ...(allCompleted ? [{ to: '/certificado', label: 'Certificado', icon: <Award size={16} /> }] : []),
  ]

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.logo}>
          <LogoImg />
        </Link>

        <div className={styles.links}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.link} ${location.pathname === link.to ? styles.active : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.right}>
          <div className={styles.progressChip}>
            <span className={styles.progressDots}>
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} className={`${styles.dot} ${i < completedModules ? styles.dotDone : ''}`} />
              ))}
            </span>
            <span className={styles.progressLabel}>{completedModules}/9</span>
          </div>
          <div className={styles.avatar}>
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Cerrar sesión">
            <LogOut size={18} />
          </button>
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className={styles.mobileLogout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  )
}

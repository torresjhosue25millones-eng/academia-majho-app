import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAcademia } from '../context/AcademiaContext'
import { Eye, EyeOff, Mail, Lock, User, Briefcase } from 'lucide-react'
import styles from './Auth.module.css'

const ROLES = [
  'Mamá / Papá',
  'Educador/a',
  'Psicólogo/a Infantil',
  'Terapeuta',
  'Otro profesional',
]

export default function Register() {
  const { login } = useAcademia()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', role: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.role || !form.password || !form.confirm) {
      setError('Por favor completa todos los campos.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const userData = { name: form.name, email: form.email, role: form.role, password: form.password }
    localStorage.setItem('majho_registered_' + form.email, JSON.stringify(userData))
    login(userData)
    navigate('/dashboard')
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.logo}>
            <Link to="/">
              <span style={{ color: 'var(--gold)' }}>✦</span> Academia <em>MAJHO</em>
            </Link>
          </div>
          <h2 className={styles.leftTitle}>
            "Ser guía de un niño<br />de alta vibración es<br />el mayor honor del alma."
          </h2>
          <p className={styles.leftSubtitle}>Únete a más de 500 familias transformadas</p>
          <div className={styles.leftOrbs}>
            <div className={styles.leftOrb1} />
            <div className={styles.leftOrb2} />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Crea tu cuenta</h1>
          <p className={styles.formSubtitle}>Comienza tu formación como Guía MAJHO</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Nombre completo</label>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.inputIcon} />
                <input type="text" placeholder="Tu nombre" value={form.name} onChange={set('name')} />
              </div>
            </div>

            <div className={styles.field}>
              <label>Correo electrónico</label>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input type="email" placeholder="tu@correo.com" value={form.email} onChange={set('email')} />
              </div>
            </div>

            <div className={styles.field}>
              <label>¿Cuál es tu rol?</label>
              <div className={styles.inputWrap}>
                <Briefcase size={16} className={styles.inputIcon} />
                <select
                  value={form.role}
                  onChange={set('role')}
                  style={{ width: '100%', background: 'white', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)', padding: '13px 16px 13px 42px', fontSize: '0.92rem', color: form.role ? 'var(--text-dark)' : 'var(--text-light)', cursor: 'pointer' }}
                >
                  <option value="" disabled>Selecciona tu rol</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>Contraseña</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={set('password')}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label>Confirmar contraseña</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={form.confirm}
                  onChange={set('confirm')}
                />
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : null}
              {loading ? 'Creando tu cuenta...' : 'Comenzar mi formación ✦'}
            </button>
          </form>

          <p className={styles.switch}>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

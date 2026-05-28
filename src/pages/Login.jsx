import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAcademia } from '../context/AcademiaContext'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import styles from './Auth.module.css'
 
export default function Login() {
  const { login } = useAcademia()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos.')
      return
    }
    setLoading(true)
    try {
      await login({ email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      if (err.message?.includes('Invalid login credentials')) {
        setError('Correo o contraseña incorrectos. Verifica tus datos.')
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Debes confirmar tu correo electrónico antes de ingresar. Revisa tu bandeja de entrada.')
      } else {
        setError('No pudimos iniciar sesión. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }
 
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
            "Cada niño es un maestro<br />disfrazado de estudiante."
          </h2>
          <p className={styles.leftSubtitle}>Método MAJHO · Formación Espiritual y Científica</p>
          <div className={styles.leftOrbs}>
            <div className={styles.leftOrb1} />
            <div className={styles.leftOrb2} />
          </div>
        </div>
      </div>
 
      <div className={styles.right}>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Bienvenida/o de vuelta</h1>
          <p className={styles.formSubtitle}>Ingresa a tu espacio de aprendizaje</p>
 
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Correo electrónico</label>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
 
            <div className={styles.field}>
              <label>Contraseña</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
 
            {error && <div className={styles.error}>{error}</div>}
 
            <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : null}
              {loading ? 'Ingresando...' : 'Ingresar al curso ✦'}
            </button>
          </form>
 
          <p className={styles.switch}>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
  )
}

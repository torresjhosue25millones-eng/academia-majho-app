import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAcademia } from '../context/AcademiaContext'
import Navbar from '../components/Navbar'
import { Download, Share2, Award, ChevronLeft } from 'lucide-react'
import styles from './CertificatePage.module.css'

function CertificateTemplate({ user, date }) {
  return (
    <div className={styles.cert} id="certificate-template">
      {/* Background decoration */}
      <div className={styles.certBg}>
        <div className={styles.certCorner1} />
        <div className={styles.certCorner2} />
        <div className={styles.certOrb1} />
        <div className={styles.certOrb2} />
        <div className={styles.certPattern} />
      </div>

      {/* Border */}
      <div className={styles.certBorder} />

      {/* Content */}
      <div className={styles.certContent}>
        <div className={styles.certHeader}>
          <span className={styles.certSymbol}>✦</span>
          <h1 className={styles.certAcademia}>Academia MAJHO</h1>
          <p className={styles.certTagline}>Formación Espiritual y Científica</p>
        </div>

        <div className={styles.certDivider}>
          <span />
          <span className={styles.certDividerIcon}>❋</span>
          <span />
        </div>

        <div className={styles.certBody}>
          <p className={styles.certPresenta}>Con orgullo y amor certifica que</p>
          <h2 className={styles.certName}>{user?.name || 'Estudiante MAJHO'}</h2>
          <p className={styles.certRole}>{user?.role || 'Guía MAJHO'}</p>

          <p className={styles.certText}>
            ha completado satisfactoriamente el programa de formación
          </p>

          <h3 className={styles.certCourse}>
            Método MAJHO<br />
            <em>Formación Integral para Guías de Niños de Alta Vibración</em>
          </h3>

          <p className={styles.certDetails}>
            Habiendo demostrado dominio en los 9 módulos del programa:<br />
            Neurociencia Infantil · Psicología Consciente · PNL Infantil ·
            Sabiduría Ancestral · Meditación · Numerología · Ho'oponopono
          </p>
        </div>

        <div className={styles.certDivider}>
          <span />
          <span className={styles.certDividerIcon}>❋</span>
          <span />
        </div>

        <div className={styles.certFooter}>
          <div className={styles.certSignature}>
            <div className={styles.certSignLine} />
            <p>Directora Academia MAJHO</p>
            <span>Fundadora del Método MAJHO</span>
          </div>

          <div className={styles.certSeal}>
            <div className={styles.certSealCircle}>
              <span className={styles.certSealIcon}>🏆</span>
              <span className={styles.certSealText}>CERTIFICADO</span>
              <span className={styles.certSealText2}>OFICIAL</span>
            </div>
          </div>

          <div className={styles.certDate}>
            <div className={styles.certSignLine} />
            <p>Fecha de emisión</p>
            <span>{date}</span>
          </div>
        </div>

        <div className={styles.certCode}>
          <span>Código de verificación: MAJHO-{user?.name?.replace(/\s/g, '').substring(0, 4).toUpperCase() || 'CERT'}-{Date.now().toString().slice(-6)}</span>
        </div>
      </div>
    </div>
  )
}

export default function CertificatePage() {
  const { user, allCompleted } = useAcademia()
  const certRef = useRef()

  const date = new Date().toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const handleDownload = async () => {
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')
      const element = document.getElementById('certificate-template')
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#FFF8F0' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Certificado_MAJHO_${user?.name?.replace(/\s/g, '_') || 'Estudiante'}.pdf`)
    } catch (err) {
      alert('El certificado se ha generado. En un entorno con conexión completa podrás descargarlo como PDF.')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mi Certificado Academia MAJHO',
        text: `¡Completé el Método MAJHO! Soy Guía Certificada/o en Formación Espiritual y Científica para Niños de Alta Vibración. 🏆✨`,
      })
    } else {
      navigator.clipboard.writeText('¡Completé el programa Academia MAJHO! Soy Guía Certificada/o en el Método MAJHO. 🏆✨')
      alert('¡Mensaje copiado! Compártelo en tus redes sociales.')
    }
  }

  if (!allCompleted) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className="container">
            <div className={styles.notReady}>
              <span className={styles.notReadyIcon}>🔒</span>
              <h2>Tu certificado te espera</h2>
              <p>Completa los 9 módulos del Método MAJHO para desbloquear tu certificado digital oficial.</p>
              <Link to="/dashboard" className="btn-primary">
                <ChevronLeft size={16} /> Ver mis módulos
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">

          <div className={styles.header}>
            <Link to="/dashboard" className={styles.back}>
              <ChevronLeft size={16} /> Dashboard
            </Link>
            <div className={styles.headerTitle}>
              <Award size={24} color="var(--gold)" />
              <h1>Tu Certificado Oficial</h1>
            </div>
            <div className={styles.headerActions}>
              <button onClick={handleShare} className="btn-outline">
                <Share2 size={16} /> Compartir
              </button>
              <button onClick={handleDownload} className="btn-secondary">
                <Download size={16} /> Descargar PDF
              </button>
            </div>
          </div>

          <div className={styles.congrats}>
            <span>🎉</span>
            <div>
              <strong>¡Felicitaciones, {user?.name?.split(' ')[0]}!</strong>
              <p>Has completado todos los módulos del Método MAJHO. Eres oficialmente una Guía Certificada/o en Formación Espiritual y Científica para Niños de Alta Vibración.</p>
            </div>
          </div>

          <div className={styles.certWrapper} ref={certRef}>
            <CertificateTemplate user={user} date={date} />
          </div>

          <div className={styles.actions}>
            <button onClick={handleDownload} className="btn-secondary">
              <Download size={18} /> Descargar mi certificado en PDF
            </button>
            <button onClick={handleShare} className="btn-outline">
              <Share2 size={18} /> Compartir logro
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}

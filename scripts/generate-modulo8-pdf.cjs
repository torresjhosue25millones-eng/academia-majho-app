const { jsPDF } = require('jspdf')
const path = require('path')

const GOLD = [201, 168, 76]
const PURPLE = [123, 94, 167]
const PURPLE_LIGHT = [237, 232, 246]
const GOLD_LIGHT = [250, 240, 217]
const TEXT = [40, 40, 40]
const WHITE = [255, 255, 255]
const INDIGO = [58, 49, 110]
const BLUE = [86, 145, 184]
const GREEN = [92, 138, 110]
const PINK = [200, 150, 170]

const PAGE_W = 210
const MARGIN = 20
const CONTENT_W = PAGE_W - MARGIN * 2

const doc = new jsPDF({ unit: 'mm', format: 'a4' })

function footer() {
  doc.setDrawColor(...PURPLE)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, 280, PAGE_W - MARGIN, 280)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...PURPLE)
  doc.text('ACADEMIA MAJHO · Crianza Consciente & Espiritualidad Familiar', PAGE_W / 2, 286, { align: 'center' })
}

function sectionHeading(num, title, y) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...PURPLE)
  const lines = doc.splitTextToSize(`${num}. ${title}`, CONTENT_W)
  doc.text(lines, MARGIN, y)
  const endY = y + (lines.length - 1) * 6.5
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.6)
  doc.line(MARGIN, endY + 3, PAGE_W - MARGIN, endY + 3)
  return endY + 13
}

function paragraph(text, y, opts = {}) {
  const size = opts.size || 10.5
  doc.setFont('helvetica', opts.italic ? 'italic' : 'normal')
  doc.setFontSize(size)
  doc.setTextColor(...(opts.color || TEXT))
  const lines = doc.splitTextToSize(text, opts.width || CONTENT_W)
  doc.text(lines, MARGIN, y)
  return y + lines.length * (size / 2.2) + (opts.gap ?? 4)
}

function quoteLine(text, y) {
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(10.5)
  doc.setTextColor(...PURPLE)
  const lines = doc.splitTextToSize(text, 150)
  doc.text(lines, PAGE_W / 2, y, { align: 'center' })
  return y + lines.length * 5 + 6
}

function table(headers, rows, y, colWidths, headColor = PURPLE) {
  const rowH = 8
  const totalW = colWidths.reduce((a, b) => a + b, 0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  const headerCellLines = headers.map((h, i) => doc.splitTextToSize(h, colWidths[i] - 4))
  const headRowH = Math.max(rowH, Math.max(...headerCellLines.map(l => l.length)) * 4 + 3)
  doc.setFillColor(...headColor)
  doc.rect(MARGIN, y, totalW, headRowH, 'F')
  doc.setTextColor(...WHITE)
  let x = MARGIN
  headerCellLines.forEach((hLines, i) => {
    doc.text(hLines, x + 2, y + 5.5)
    x += colWidths[i]
  })
  y += headRowH
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  rows.forEach((row, ri) => {
    const cellLines = row.map((cell, i) => doc.splitTextToSize(cell, colWidths[i] - 4))
    const lineCount = Math.max(...cellLines.map(l => l.length))
    const h = Math.max(rowH, lineCount * 4 + 3)
    doc.setFillColor(...(ri % 2 === 0 ? PURPLE_LIGHT : WHITE))
    doc.rect(MARGIN, y, totalW, h, 'F')
    x = MARGIN
    row.forEach((cell, i) => {
      doc.setFont('helvetica', i === 0 ? 'bold' : 'normal')
      doc.setTextColor(...(i === 0 ? PURPLE : TEXT))
      doc.text(cellLines[i], x + 2, y + 5)
      x += colWidths[i]
    })
    y += h
  })
  return y + 6
}

function threeColTable(headers, rows, y, colWidths, headColor) {
  const rowH = 7
  const totalW = colWidths.reduce((a, b) => a + b, 0)
  doc.setFillColor(...headColor)
  doc.rect(MARGIN, y, totalW, rowH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...WHITE)
  let x = MARGIN
  headers.forEach((h, i) => {
    doc.text(h, x + 2, y + 5)
    x += colWidths[i]
  })
  y += rowH
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...TEXT)
  const cellLines = headers.map((_, i) => doc.splitTextToSize(rows[i], colWidths[i] - 4))
  const lineCount = Math.max(...cellLines.map(l => l.length))
  const h = lineCount * 4 + 4
  x = MARGIN
  rows.forEach((cell, i) => {
    doc.setFillColor(245, 245, 245)
    doc.rect(x, y, colWidths[i], h, 'F')
    doc.text(cellLines[i], x + 2, y + 5)
    x += colWidths[i]
  })
  return y + h + 4
}

function infoBox(title, text, y, height) {
  doc.setFillColor(...GOLD_LIGHT)
  doc.rect(MARGIN, y, CONTENT_W, height, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(150, 110, 30)
  const titleLines = doc.splitTextToSize(title, CONTENT_W - 8)
  doc.text(titleLines, MARGIN + 4, y + 6)
  doc.setFont('helvetica', 'normal')
  const bodyLines = doc.splitTextToSize(text, CONTENT_W - 8)
  doc.text(bodyLines, MARGIN + 4, y + 6 + titleLines.length * 4.2)
  return y + height + 6
}

// ── PÁGINA 1: Portada ──
doc.setFont('helvetica', 'bold')
doc.setFontSize(26)
doc.setTextColor(...GOLD)
doc.text('MÉTODO MAJHO', PAGE_W / 2, 60, { align: 'center' })
doc.setFontSize(18)
doc.setTextColor(...PURPLE)
doc.text('MÓDULO 8', PAGE_W / 2, 72, { align: 'center' })
doc.setDrawColor(...GOLD)
doc.setLineWidth(0.6)
doc.line(MARGIN, 80, PAGE_W - MARGIN, 80)

doc.setFont('helvetica', 'normal')
doc.setFontSize(13)
doc.setTextColor(...PURPLE)
doc.text('Tipos de Vibración: Índigo · Cristal · Arcoíris · Diamante', PAGE_W / 2, 96, { align: 'center', maxWidth: 160 })
doc.setFontSize(10.5)
doc.setTextColor(...TEXT)
const sub = doc.splitTextToSize('Identificación, características, desafíos, dones y protocolos de acompañamiento para cada tipo de niño de la nueva tierra.', 160)
doc.text(sub, PAGE_W / 2, 108, { align: 'center' })

doc.setFontSize(10.5)
const introP1 = doc.splitTextToSize(
  'Los niños de la nueva tierra llegan con estructuras energéticas, neurológicas y espirituales diferentes a las de generaciones anteriores. No son "mejores" ni "más evolucionados" que otros niños: son almas con características específicas que requieren formas de acompañamiento específicas. Comprender el tipo del niño o niña a tu cargo es la clave para acompañarlo/a sin intentar cambiarlo/a.',
  CONTENT_W
)
doc.text(introP1, MARGIN, 132)
footer()

// ── PÁGINA 2: Contenido del Módulo ──
doc.addPage()
doc.setFont('helvetica', 'bold')
doc.setFontSize(18)
doc.setTextColor(...PURPLE)
doc.text('Contenido del Módulo', MARGIN, 30)
doc.setDrawColor(...GOLD)
doc.line(MARGIN, 34, PAGE_W - MARGIN, 34)

const indice = [
  '1. Marco conceptual: niños de la nueva tierra',
  '2. Historia y evolución de los tipos de vibración',
  '3. Niños Índigo: los guerreros del alma',
  '4. Niños Cristal: los mensajeros del amor',
  '5. Niños Arcoíris: los sanadores de la tierra',
  '6. Niños Diamante: la nueva consciencia',
  '7. Solapamientos y casos mixtos',
  '8. El sistema educativo y desafíos comunes',
  '9. Las etiquetas que la sociedad les pone',
  '10. Protocolos de acompañamiento específicos',
  '11. La comunidad educativa del niño de nueva tierra',
  '12. Herramientas prácticas por tipo',
]
let iy = 48
doc.setFont('helvetica', 'normal')
doc.setFontSize(10.5)
doc.setTextColor(...TEXT)
indice.forEach(item => {
  const lines = doc.splitTextToSize(`•  ${item}`, CONTENT_W)
  doc.text(lines, MARGIN, iy)
  iy += 8 + (lines.length - 1) * 5
})
footer()

// ── SECCIÓN 1-2: Marco conceptual ──
doc.addPage()
let y = sectionHeading('1-2', 'Marco Conceptual: Niños de la Nueva Tierra', 30)
y = paragraph('El concepto de niños índigo fue popularizado en los años 80 por la sensitiva Nancy Ann Tappe, quien describió que comenzaba a ver un nuevo color (índigo) en los campos áuricos de los niños nacidos a partir de los años 70. Desde entonces, el concepto se ha expandido con nuevos tipos que describen las oleadas sucesivas de almas que llegan al planeta.', y)
y = paragraph('Desde una perspectiva espiritual, estos niños son considerados almas que han venido con una misión específica relacionada con la transformación de la consciencia humana. Desde una perspectiva psicológica-neurológica, muchos de estos rasgos coinciden con lo que la ciencia describe como alta sensibilidad, sobredotación emocional y diferentes estilos de procesamiento neurológico.', y)
y = quoteLine('"Estos niños no necesitan ser arreglados. Necesitan ser comprendidos."', y)
footer()

function tipoNinoPage(num, titulo, subtitulo, color, caracteristicas, desafios, acompanamiento) {
  doc.addPage()
  let y = sectionHeading(num, titulo, 30)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9.5)
  doc.setTextColor(...color)
  const subLines = doc.splitTextToSize(subtitulo, CONTENT_W)
  doc.text(subLines, MARGIN, y)
  y += subLines.length * 4.5 + 6

  y = table(
    ['Características principales', 'Desafíos típicos', 'Cómo acompañarlos'],
    [[caracteristicas, desafios, acompanamiento]],
    y,
    [50, 55, 65],
    color
  )
  footer()
}

tipoNinoPage(
  3, 'Niños Índigo: Los Guerreros del Alma',
  'Principalmente nacidos entre 1970-2000 (aunque siguen llegando). Son los cuestionadores, los que vinieron a romper estructuras caducas.',
  INDIGO,
  'Fuerte sentido de propósito personal desde pequeños. No toleran la autoridad sin justificación lógica. Altamente intuitivos. Detectan la hipocresía de los adultos. Alta inteligencia y creatividad, frecuentemente diagnosticados con TDAH. Sentido de misión: vinieron a cambiar el mundo.',
  'Impulsividad y dificultad con las normas. Frustración intensa cuando no son escuchados. Posible diagnóstico de TDAH, oposicionismo, hipersensibilidad. Relaciones conflictivas con figuras de autoridad.',
  'Explica siempre el "por qué" de las reglas. Dales roles de liderazgo real. Valida su percepción. Entornos educativos flexibles y creativos. Actividad física como válvula de energía.'
)

tipoNinoPage(
  4, 'Niños Cristal: Los Mensajeros del Amor',
  'Principalmente nacidos entre 1995-2010. Son los sanadores empáticos, los que vinieron a elevar la vibración del amor.',
  BLUE,
  'Ojos grandes y penetrantes, con mirada "adulta". Desarrollan el habla más tarde. Profundamente empáticos: sienten el dolor ajeno como propio. Conectados con la naturaleza. Capacidades telepáticas y clarividentes frecuentes. Necesitan mucha quietud.',
  'Posibles diagnósticos de autismo. Sobrecarga sensorial en ambientes ruidosos o caóticos. Dificultad para establecer límites con las emociones ajenas. Retraimiento social si no se sienten seguros.',
  'Ambientes tranquilos y armoniosos. Tiempo en la naturaleza diariamente. Validación de su capacidad empática. Herramientas de protección energética. Evitar multitudes y exceso de estímulos.'
)

tipoNinoPage(
  5, 'Niños Arcoíris: Los Sanadores de la Tierra',
  'Principalmente nacidos desde 2005 en adelante. Son las almas más nuevas, sin karma acumulado, pura alegría y amor.',
  GREEN,
  'Energía extremadamente alta y gozosa. Vienen sin traumas kármicos previos. Capacidad innata de sanar con su presencia. Sin miedo innato: confían absolutamente en el amor. Atraen amor y armonía donde van.',
  'Pueden ser percibidos como "demasiado buenos" o "irreales". Sorpresa ante la densidad del mundo. Necesitan aprender sobre el dolor y los límites. Pueden ser muy intensos (agotadores para el adulto).',
  'Honrar su naturaleza gozosa sin endurecerla. Darles herramientas para cuando encuentren el dolor del mundo. Nutrir su capacidad sanadora. Rodearlo/a de belleza, música, arte y naturaleza.'
)

tipoNinoPage(
  6, 'Niños Diamante: La Nueva Consciencia',
  'Los más recientes, nacidos principalmente desde 2012-2015. Son la expresión más completa de la nueva consciencia humana.',
  PURPLE,
  'Combinan y superan los dones de todos los tipos anteriores. Conexión directa y constante con la fuente. Capacidades cognitivas y espirituales excepcionales desde el nacimiento. Profundamente serenos. Saben quiénes son y para qué están aquí.',
  'El mundo aún no está preparado para recibirlos plenamente. Pueden experimentar profunda soledad si no encuentran su tribu. El sistema escolar convencional los frustra enormemente.',
  'Hablarles como iguales desde el principio. Educarlos en ambientes que honren su inteligencia multidimensional. Crear comunidad con familias similares. No intentar "normalizarlos".'
)

// ── SECCIÓN 7: Solapamientos ──
doc.addPage()
y = sectionHeading(7, 'Solapamientos y Casos Mixtos', 30)
y = paragraph('En la práctica, es frecuente encontrar niños que muestran características de más de un tipo. Esto es normal y esperado: las categorías son orientativas, no absolutas. Un niño puede ser principalmente Índigo con fuertes rasgos Cristal, o Arcoíris con características Diamante.', y)
y = paragraph('El criterio más importante no es la categoría sino las necesidades específicas de ese niño o niña. Usa los tipos como guías de orientación, no como etiquetas definitivas. El alma del niño o niña a tu cargo es única e irrepetible.', y)
footer()

// ── SECCIÓN 8: Sistema educativo y desafíos comunes ──
doc.addPage()
y = sectionHeading(8, 'El Sistema Educativo y Desafíos Comunes', 30)
y = paragraph('El mayor desafío de los niños de nueva tierra no es su naturaleza: es el choque entre esa naturaleza y un sistema educativo diseñado hace más de 200 años para una realidad completamente diferente.', y)
y = table(
  ['Desafío', 'Descripción'],
  [
    ['Diagnósticos incorrectos', 'TDAH, trastorno oposicionista, ansiedad generalizada son frecuentemente diagnósticos incorrectos para lo que es en realidad hipersensibilidad espiritual y neurológica.'],
    ['Medicación innecesaria', 'La medicación que suprime los síntomas también suprime los dones. Explorar alternativas holísticas antes de recurrir a la farmacología.'],
    ['Exclusión social', 'La sensibilidad y percepción diferente puede causar exclusión o acoso. Necesitan comunidad y tribu.'],
    ['Aburrimiento crónico', 'Sus cerebros procesan más rápido de lo que el sistema ofrece. Proponer retos adicionales y autonomía marca la diferencia.'],
  ],
  y,
  [48, 122]
)
footer()

// ── SECCIÓN 9: Las etiquetas que la sociedad les pone — NUEVO ──
doc.addPage()
y = sectionHeading(9, 'Las Etiquetas que la Sociedad les Pone', 30)
y = paragraph('La sociedad actual no tiene el marco de los tipos de vibración, así que cuando un niño de alta vibración muestra sus rasgos naturales, el sistema (escuela, sistema de salud, a veces la propia familia) recurre al único lenguaje que conoce: el diagnóstico clínico. El resultado es que un mismo rasgo espiritual puede terminar nombrado como un trastorno.', y)
y = table(
  ['Etiqueta común', 'Lo que el sistema ve', 'Tipo de vibración asociado', 'Reencuadre MAJHO'],
  [
    ['TDAH', 'Impulsividad, dificultad para concentrarse, movimiento constante', 'Índigo · Arcoíris', 'Energía vital y propósito que el aula tradicional no logra canalizar'],
    ['Trastorno oposicionista desafiante', 'Rechazo a la autoridad, cuestionamiento constante de reglas', 'Índigo', 'Sentido de justicia y rechazo legítimo a la incoherencia del adulto'],
    ['Espectro autista', 'Sensibilidad sensorial extrema, habla tardía, necesidad de rutina', 'Cristal', 'Empatía profunda y sobrecarga por percibir más de lo habitual'],
    ['Ansiedad generalizada', 'Preocupación constante, miedo a lo desconocido, somatización', 'Cristal · Diamante', 'Percepción aguda de la densidad emocional del entorno'],
    ['Altas capacidades / sobredotación', 'Aburrimiento, desconexión escolar, preguntas "fuera de lugar"', 'Diamante', 'Procesamiento cognitivo y espiritual más rápido que el sistema'],
  ],
  y,
  [38, 50, 36, 46]
)
y = infoBox(
  'IMPORTANTE: esto no es negar el diagnóstico',
  'Este reencuadre no significa que los diagnósticos clínicos sean falsos ni que deban ignorarse. Muchos niños necesitan genuinamente evaluación y apoyo profesional, y negárselo sería un daño real. El reencuadre MAJHO es una capa adicional de comprensión —el "para qué" espiritual junto al "qué" clínico— nunca un sustituto de la atención médica o psicológica cuando esta es necesaria.',
  y, 26
)
footer()

// ── SECCIÓN 10: Protocolos de acompañamiento ──
doc.addPage()
y = sectionHeading(10, 'Protocolos de Acompañamiento Específicos', 30)
y = paragraph('El/la educador/a o docente consciente puede convertirse en el puente entre el sistema y el alma del niño o niña, adaptando estrategias dentro del aula y orientando a las familias.', y)
y = paragraph('Antes de aceptar una etiqueta como definitiva, observa: ¿el comportamiento aparece en todos los contextos, o solo en ambientes rígidos y poco estimulantes? ¿Hay un patrón de dones específicos (intuición, empatía, liderazgo, creatividad) acompañando el "síntoma"? Esa observación cuidadosa es el primer protocolo, antes de cualquier herramienta específica.', y)
footer()

// ── SECCIÓN 11: Comunidad educativa ──
doc.addPage()
y = sectionHeading(11, 'La Comunidad Educativa del Niño de Nueva Tierra', 30)
y = paragraph('Ningún educador/a o cuidador/a acompaña solo/a a estos niños. La tribu que rodea al niño o niña —docentes, familias, terapeutas, comunidad— es parte esencial del ecosistema de acompañamiento. Crear redes entre educadores/as que trabajan con niños de nueva tierra multiplica exponencialmente el impacto del acompañamiento consciente.', y)
y = paragraph('Como educador/a formado/a en el Método MAJHO, tu rol es también orientar y acompañar a las familias para que el hogar y el aula hablen el mismo idioma energético.', y)
footer()

// ── SECCIÓN 12: Herramientas prácticas ──
doc.addPage()
y = sectionHeading(12, 'Herramientas Prácticas por Tipo', 30)
y = table(
  ['Tipo', 'Herramientas Clave para el Educador/a'],
  [
    ['Índigo', 'Karate, debates, roles de liderazgo, límites con explicación clara, deporte competitivo, espacios de diálogo horizontal'],
    ['Cristal', 'Música, naturaleza, arte, yoga, límites suaves, tiempo de quietud diario, grupos pequeños'],
    ['Arcoíris', 'Juego libre, celebración constante, creatividad, comunidad, aventura, proyectos colaborativos'],
    ['Diamante', 'Aprendizaje autodidacta, meditación, contacto con comunidades diversas, educación holística, mentoría individualizada'],
  ],
  y,
  [35, 135]
)
doc.setFont('helvetica', 'normal')
doc.setFontSize(9)
doc.setTextColor(...PURPLE)
doc.text('Has completado el Módulo 8 · Tipos de Vibración · Método MAJHO · Academia de Crianza Consciente & Espiritualidad Familiar', PAGE_W / 2, y, { align: 'center', maxWidth: CONTENT_W })
y += 14
quoteLine('"Estos niños no llegaron para adaptarse a nuestro mundo. Llegaron para recordarnos cómo debería ser."', y)
footer()

const outPath = path.join(__dirname, '..', 'public', 'pdfs', 'MAJHO_Modulo8_Tipos_Vibracion.pdf')
doc.save(outPath)
console.log('PDF generado en:', outPath)

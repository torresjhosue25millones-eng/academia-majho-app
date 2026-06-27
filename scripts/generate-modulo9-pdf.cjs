const { jsPDF } = require('jspdf')
const path = require('path')

const GOLD = [201, 168, 76]
const PURPLE = [123, 94, 167]
const PURPLE_LIGHT = [237, 232, 246]
const GOLD_LIGHT = [250, 240, 217]
const RED_LIGHT = [250, 235, 230]
const TEXT = [40, 40, 40]
const WHITE = [255, 255, 255]

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

function bulletList(items, y) {
  doc.setFontSize(10.5)
  items.forEach(([lead, rest]) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...PURPLE)
    const leadText = `•  ${lead}`
    doc.text(leadText, MARGIN, y)
    const leadWidth = doc.getTextWidth(leadText) + 1.5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...TEXT)
    const restLines = doc.splitTextToSize(rest, CONTENT_W - leadWidth)
    doc.text(restLines, MARGIN + leadWidth, y)
    const extraLines = Math.max(0, restLines.length - 1)
    y += 6 + extraLines * 4.6
  })
  return y + 2
}

function table(headers, rows, y, colWidths) {
  const rowH = 8
  const totalW = colWidths.reduce((a, b) => a + b, 0)
  doc.setFillColor(...PURPLE)
  doc.rect(MARGIN, y, totalW, rowH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...WHITE)
  let x = MARGIN
  headers.forEach((h, i) => {
    doc.text(h, x + 2, y + 5.5)
    x += colWidths[i]
  })
  y += rowH
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  rows.forEach((row, ri) => {
    const cellLines = row.map((cell, i) => doc.splitTextToSize(cell, colWidths[i] - 4))
    const lineCount = Math.max(...cellLines.map(l => l.length))
    const h = Math.max(rowH, lineCount * 4.2 + 3)
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

function infoBox(title, text, y, height, color = GOLD_LIGHT, titleColor = [150, 110, 30]) {
  doc.setFillColor(...color)
  doc.rect(MARGIN, y, CONTENT_W, height, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...titleColor)
  const titleLines = doc.splitTextToSize(title, CONTENT_W - 8)
  doc.text(titleLines, MARGIN + 4, y + 6)
  doc.setFont('helvetica', 'normal')
  const bodyLines = doc.splitTextToSize(text, CONTENT_W - 8)
  doc.text(bodyLines, MARGIN + 4, y + 6 + titleLines.length * 4.2)
  return y + height + 6
}

function colorBoxList(items, y) {
  items.forEach(([title, desc], i) => {
    const h = 16
    doc.setFillColor(...PURPLE)
    doc.rect(MARGIN, y, CONTENT_W, h, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(...WHITE)
    doc.text(title, MARGIN + 4, y + 6)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(desc, CONTENT_W - 8)
    doc.text(lines, MARGIN + 4, y + 11)
    y += h + 4
  })
  return y + 2
}

// ── PÁGINA 1: Portada ──
doc.setFont('helvetica', 'bold')
doc.setFontSize(26)
doc.setTextColor(...GOLD)
doc.text('MÉTODO MAJHO', PAGE_W / 2, 60, { align: 'center' })
doc.setFontSize(18)
doc.setTextColor(...PURPLE)
doc.text('MÓDULO 9', PAGE_W / 2, 72, { align: 'center' })
doc.setDrawColor(...GOLD)
doc.setLineWidth(0.6)
doc.line(MARGIN, 80, PAGE_W - MARGIN, 80)

doc.setFont('helvetica', 'normal')
doc.setFontSize(13)
doc.setTextColor(...PURPLE)
doc.text('Integración & Tu Práctica Profesional', PAGE_W / 2, 96, { align: 'center' })
doc.setFontSize(10.5)
doc.setTextColor(...TEXT)
const sub = doc.splitTextToSize('Cómo aplicar el Método MAJHO en consultas, talleres, grupos o tu entorno educativo. Ética, casos prácticos y certificación.', 160)
doc.text(sub, PAGE_W / 2, 105, { align: 'center' })

doc.setFontSize(10.5)
const introP1 = doc.splitTextToSize(
  'Has llegado al módulo de integración y lanzamiento. Todo lo que has aprendido en los módulos anteriores confluye aquí en una práctica profesional coherente, ética y transformadora. Este módulo te da las herramientas para llevar el Método MAJHO al mundo: en consultorio, talleres, retiros, grupos de crianza consciente, aulas o espacios educativos.',
  CONTENT_W
)
doc.text(introP1, MARGIN, 130)
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
  '1. Revisión integradora del Método MAJHO',
  '2. Tu identidad como facilitador/a MAJHO',
  '3. Ética en el acompañamiento educativo y espiritual',
  '4. La sesión de consulta MAJHO: estructura y flujo',
  '5. El diagnóstico desde la consciencia',
  '6. Diseño de talleres y programas grupales',
  '7. Casos prácticos y supervisión',
  '8. Marketing consciente y expansión profesional',
  '9. Autocuidado del facilitador/a: no puedes dar lo que no tienes',
  '10. Comunidad MAJHO: tu red de soporte',
  '11. Certificación y niveles de práctica',
  '12. Tu plan de lanzamiento profesional',
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

// ── SECCIÓN 1: Revisión Integradora — CORREGIDO ──
doc.addPage()
let y = sectionHeading(1, 'Revisión Integradora del Método MAJHO', 30)
y = paragraph('El Método MAJHO no es un conjunto de técnicas aisladas: es un sistema integrado que aborda al niño/a y su entorno desde todas sus dimensiones. Cada módulo representa una dimensión del ser familiar y educativo:', y)
y = table(
  ['Módulo', 'Dimensión'],
  [
    ['Módulo 1 · Bienvenida', 'La base: comprendiendo el método y los tipos de niños/as'],
    ['Módulo 2 · Neurociencia', 'El cerebro: la arquitectura biológica del desarrollo'],
    ['Módulo 3 · PNL', 'La mente: reprogramando los patrones inconscientes de comunicación'],
    ['Módulo 4 · Sabiduría Ancestral', 'Las raíces: conectando con la memoria colectiva y la tierra'],
    ['Módulo 5 · Meditación', 'El cuerpo energético: elevando la vibración y creando coherencia'],
    ['Módulo 6 · Psicología Infantil', 'El vínculo: apego, emociones y límites con amor'],
    ['Módulo 7 · Numerología y Astrología', 'El alma: leyendo el mapa sagrado del ser encarnado'],
    ['Módulo 8 · Tipos de Vibración', 'La esencia: comprendiendo la naturaleza única de cada niño/a'],
    ['Módulo 9 · Integración Profesional', 'La expresión: llevando todo al mundo con servicio y excelencia'],
  ],
  y,
  [62, 108]
)
footer()

// ── SECCIÓN 2: Identidad del Facilitador ──
doc.addPage()
y = sectionHeading(2, 'Tu Identidad Como Facilitador/a MAJHO', 30)
y = paragraph('Ser facilitador/a MAJHO no es solo un título: es una forma de ser en el mundo. Antes de llevar este método a otros entornos educativos y familias, tienes que haberlo encarnado tú mismo/a.', y)
y = quoteLine('"No puedes llevar a alguien a un lugar donde tú mismo/a no has estado."', y)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('Las Cinco Cualidades del Facilitador/a MAJHO', MARGIN, y)
y += 8
y = table(
  ['Cualidad', 'Descripción'],
  [
    ['Presencia', 'La capacidad de estar completamente presente con el niño/a, la familia o el grupo, sin agenda, sin juicio.'],
    ['Humildad', 'Reconocer que no tienes todas las respuestas; tu función es crear condiciones para que emerjan desde el interior.'],
    ['Congruencia', 'Lo que enseñas debe ser lo que vives. Tu mayor credibilidad es tu propio ejemplo.'],
    ['Compasión sin rescate', 'Amar profundamente sin sobreidentificarte. La compasión sana; el rescate crea dependencia.'],
    ['Apertura al misterio', 'El alma humana es más grande que cualquier método. Mantén la apertura a que el proceso te enseñe.'],
  ],
  y,
  [40, 130]
)
footer()

// ── SECCIÓN 3: Ética ──
doc.addPage()
y = sectionHeading(3, 'Ética en el Acompañamiento Educativo y Espiritual', 30)
y = paragraph('La ética no es una lista de restricciones: es el código de honor del facilitador/a consciente. Trabajar con niños/as, familias y comunidades educativas en sus momentos más vulnerables es un privilegio sagrado.', y)
y = bulletList([
  ['Consentimiento informado', 'toda intervención requiere el consentimiento claro de los adultos involucrados.'],
  ['Confidencialidad', 'lo compartido en consulta o taller es sagrado. Nunca uses casos sin permiso explícito y anonimizado.'],
  ['Límites claros', 'el/la facilitador/a no es amigo/a, terapeuta, gurú ni figura parental del consultante.'],
  ['Reconocimiento de los límites de la práctica', 'el Método MAJHO no reemplaza la atención médica o psicológica cuando es necesaria.'],
  ['No crear dependencia', 'el objetivo es la autonomía del consultante, nunca la dependencia del facilitador/a.'],
  ['Cuidado propio como obligación ética', 'un/a facilitador/a agotado/a no puede hacer trabajo de calidad.'],
], y)
footer()

// ── SECCIÓN 4: Sesión de consulta — CORREGIDO (Intervención) ──
doc.addPage()
y = sectionHeading(4, 'La Sesión de Consulta MAJHO: Estructura y Flujo', 30)
y = paragraph('Una sesión MAJHO no sigue un protocolo rígido. Sin embargo, hay una estructura básica que garantiza profundidad, seguridad y efectividad:', y)
y = table(
  ['Fase', 'Contenido'],
  [
    ['Apertura (5-10 min)', 'Crear el campo sagrado, bienvenida y rapport, establecer la intención de la sesión.'],
    ['Exploración (20-30 min)', '¿Qué está viviendo el niño/a, la familia o el grupo? Calibración del estado emocional, identificación del tema central.'],
    ['Intervención (30-40 min)', 'Aplicar las herramientas MAJHO pertinentes: PNL, mapa numero-astral, sabiduría ancestral, prácticas energéticas. Trabajo con el sistema familiar completo cuando sea posible.'],
    ['Integración (10-15 min)', '¿Qué llegó? ¿Qué se movió? Prácticas para llevar al hogar o al aula, compromisos, rituales.'],
    ['Cierre (5 min)', 'Gratitud, próximos pasos, cierre del espacio sagrado.'],
  ],
  y,
  [42, 128]
)
footer()

// ── SECCIÓN 5: Diagnóstico — CORREGIDO (pregunta 5) ──
doc.addPage()
y = sectionHeading(5, 'El Diagnóstico Desde la Consciencia', 30)
y = paragraph('El diagnóstico en el Método MAJHO no es patologizante: es un mapa de comprensión. Buscamos dónde está bloqueada la energía, qué dimensión necesita nutrición y qué recursos ya existen pero no están siendo activados.', y)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('Las 7 Preguntas Diagnósticas MAJHO', MARGIN, y)
y += 8
const preguntas = [
  '¿Cuál es el nivel de conexión entre los miembros del grupo o la familia? (Rapport y coherencia)',
  '¿Qué patrones ancestrales están activos y visibles en la dinámica familiar o educativa?',
  '¿Cuál es el estado energético del hogar o el aula? ¿Qué elementos están en desequilibrio?',
  '¿Cuál es el mapa del alma de los niños/as y están siendo acompañados/as según su naturaleza?',
  '¿Qué patrones de comunicación o creencias limitantes (PNL) mantienen atrapado al sistema en un ciclo repetitivo?',
  '¿Los niños/as son reconocidos/as por su tipo de vibración?',
  '¿Qué recursos y fortalezas espirituales tiene esta familia o comunidad educativa que aún no están siendo usados?',
]
doc.setFont('helvetica', 'normal')
doc.setFontSize(10)
doc.setTextColor(...TEXT)
preguntas.forEach((q, i) => {
  const lines = doc.splitTextToSize(`${i + 1}. ${q}`, CONTENT_W)
  doc.text(lines, MARGIN, y)
  y += lines.length * 5 + 3
})
footer()

// ── SECCIÓN 6: Diseño de talleres ──
doc.addPage()
y = sectionHeading(6, 'Diseño de Talleres y Programas Grupales', 30)
y = paragraph('Los talleres grupales son una de las formas más impactantes y escalables de llevar el Método MAJHO al mundo. La energía del grupo multiplica la efectividad de las herramientas y crea comunidad.', y)
y = table(
  ['Formato', 'Descripción'],
  [
    ['Taller de 1 día (6-8 hrs)', 'Ideal para introducir el método a equipos docentes o grupos de familias. Formato intensivo de alto impacto.'],
    ['Programa de 4-8 semanas', 'Un módulo por semana. Integración gradual y seguimiento. Formato más transformador a largo plazo.'],
    ['Retiro residencial (2-5 días)', 'La experiencia más profunda. Separación del ambiente cotidiano, inmersión en prácticas.'],
    ['Círculos mensuales', 'Reuniones regulares donde se profundiza en temas específicos. Formato sostenible.'],
    ['Programa online + comunidad', 'Acceso masivo. Módulos pregrabados + sesiones en vivo. El formato de esta academia.'],
  ],
  y,
  [50, 120]
)
footer()

// ── SECCIÓN 7: Casos prácticos — CORREGIDO ──
doc.addPage()
y = sectionHeading(7, 'Casos Prácticos y Supervisión', 30)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('Caso A: Educadora agotada con dos niños de nueva energía', MARGIN, y)
y += 7
y = paragraph('Elena, docente y cuidadora de dos niños Índigo (9) y Cristal (6), llega agotada y culpándose. El sistema escolar lleva meses presionando para medicación. Ella rechaza pero no sabe qué hacer.', y)
y = paragraph('Intervención MAJHO: Sesión de reconocimiento del tipo de cada niño/a. Trabajo con la culpa desde el reencuadre PNL. Diseño de rutinas adaptadas a cada tipo. Círculo de apoyo con otros/as educadores/as.', y)
y = paragraph('Resultado: En 6 semanas, Elena tiene estrategias concretas, la culpa se ha transformado en comprensión y el niño mayor ha mejorado su rendimiento escolar sin medicación.', y, { gap: 8 })

doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('Caso B: Familia con dolor ancestral activo', MARGIN, y)
y += 7
y = paragraph('Los tutores de Lucía (12 años) acuden porque su hija tiene ansiedad severa y se autolesiona. En la exploración emerge que la abuela materna también vivió esto y la bisabuela murió por ello.', y)
y = paragraph('Intervención MAJHO: Terapia familiar sistémica integrada con rituales de sanación ancestral (Módulo 4). Trabajo con la niña en meditación y visualización de protección. Derivación a psiquiatra pediátrico para soporte farmacológico temporal.', y)
y = infoBox(
  'IMPORTANTE',
  'Este caso ilustra cuándo el trabajo MAJHO se complementa con —no reemplaza— la atención psiquiátrica especializada. El/la facilitador/a MAJHO siempre deriva cuando la situación lo requiere.',
  y, 20, RED_LIGHT, [140, 70, 40]
)
footer()

// ── SECCIÓN 8: Marketing consciente ──
doc.addPage()
y = sectionHeading(8, 'Marketing Consciente y Expansión Profesional', 30)
y = paragraph('El marketing consciente no es vender: es servir con visibilidad. Es hacer que las familias y comunidades educativas que te necesitan puedan encontrarte.', y)
y = bulletList([
  ['Testimonios auténticos', 'la mejor publicidad es la transformación real de las familias que acompañas.'],
  ['Contenido educativo gratuito', 'comparte valor: posts, vídeos cortos, lives. La generosidad crea confianza.'],
  ['Tu historia personal', 'la razón por la que llegaste a este camino es tu mayor argumento.'],
  ['Comunidad online', 'crea un grupo donde educadores/as y familias mantengan conexión y apoyo mutuo.'],
  ['Colaboraciones', 'alianzas con pedagogos/as, psicólogos/as y pediatras holísticos amplían tu alcance.'],
], y)
footer()

// ── SECCIÓN 9: Autocuidado ──
doc.addPage()
y = sectionHeading(9, 'Autocuidado del Facilitador/a', 30)
y = paragraph('El autocuidado no es un lujo: es un requisito ético. Cuando no te cuidas, terminas tomando las energías de tus consultantes o proyectando tus propios procesos en ellos.', y)
y = bulletList([
  ['Práctica personal de meditación diaria', 'no opcional.'],
  ['Supervisión regular', 'con otro/a profesional o compañero/a de confianza.'],
  ['Ritual de limpieza energética', 'después de cada sesión.'],
  ['Vacaciones reales', 'y tiempo sin pantallas ni consultas.'],
  ['Grupo de pares', 'colegas que también hacen este trabajo.'],
  ['Establecer horarios claros', 'y respetar tu propio descanso.'],
], y)
footer()

// ── SECCIÓN 10: Comunidad MAJHO ──
doc.addPage()
y = sectionHeading(10, 'Comunidad MAJHO y Recursos de Soporte', 30)
y = paragraph('Al completar esta certificación formas parte de la comunidad MAJHO: una red de facilitadores/as, educadores/as y familias comprometidos con la transformación consciente.', y)
y = paragraph('Aquí encontrarás colegas que trabajan en aulas, consultorios, centros de crianza y espacios comunitarios. La diversidad de contextos enriquece la práctica de todos/as.', y)
footer()

// ── SECCIÓN 11-12: Certificación y Plan de Lanzamiento ──
doc.addPage()
y = sectionHeading('11-12', 'Certificación y Plan de Lanzamiento', 30)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('Requisitos de Certificación MAJHO', MARGIN, y)
y += 8
const requisitos = [
  'Completar los 9 módulos del programa con participación activa',
  'Realizar al menos 3 casos de práctica supervisados',
  'Entregar un proyecto de aplicación práctica (taller, programa o consulta)',
  'Demostrar congruencia entre el método y la práctica personal',
  'Participar en al menos una sesión de supervisión grupal',
]
doc.setFont('helvetica', 'normal')
doc.setFontSize(10)
doc.setTextColor(...TEXT)
requisitos.forEach((r, i) => {
  const lines = doc.splitTextToSize(`${i + 1}. ${r}`, CONTENT_W)
  doc.text(lines, MARGIN, y)
  y += lines.length * 5 + 3
})
y += 4
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('Tu Plan de Lanzamiento en 30 Días', MARGIN, y)
y += 8
y = table(
  ['Días', 'Acción'],
  [
    ['1-7: Preparación', 'Define tu nicho. Diseña tu primera oferta. Crea tu espacio de consulta.'],
    ['8-14: Visibilidad', 'Crea 3-5 piezas de contenido gratuito. Comparte en redes. Anuncia tu primera oferta.'],
    ['15-21: Primeros clientes', 'Ofrece sesiones de práctica a bajo costo. Recoge testimonios. Ajusta según feedback.'],
    ['22-30: Expansión', 'Lanza oficialmente tu servicio. Establece precio justo. Construye tu comunidad.'],
  ],
  y,
  [45, 125]
)

doc.setFont('helvetica', 'normal')
doc.setFontSize(9)
doc.setTextColor(...PURPLE)
doc.text('Has completado el Módulo 9 · Integración & Tu Práctica Profesional · Método MAJHO · Academia de Crianza Consciente & Espiritualidad Familiar', PAGE_W / 2, y, { align: 'center', maxWidth: CONTENT_W })
y += 14
y = quoteLine('"El mundo necesita exactamente lo que tú traes. No lo guardes. No lo perfecciones indefinidamente. Compártelo."', y)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(...PURPLE)
doc.text('¡Felicidades por completar el Método MAJHO! Eres parte del cambio que el mundo necesita.', PAGE_W / 2, y, { align: 'center', maxWidth: CONTENT_W })
footer()

const outPath = path.join(__dirname, '..', 'public', 'pdfs', 'MAJHO_Modulo9_Integracion_Practica_Profesional.pdf')
doc.save(outPath)
console.log('PDF generado en:', outPath)

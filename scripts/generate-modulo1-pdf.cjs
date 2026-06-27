const { jsPDF } = require('jspdf')
const path = require('path')

const GOLD = [201, 168, 76]
const PURPLE = [123, 94, 167]
const PURPLE_LIGHT = [237, 232, 246]
const GOLD_LIGHT = [250, 240, 217]
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

function numberedCircleList(items, y) {
  items.forEach(([num, title, desc]) => {
    doc.setFillColor(...PURPLE)
    doc.circle(MARGIN + 4, y + 2, 4, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...WHITE)
    doc.text(String(num), MARGIN + 4, y + 3.2, { align: 'center' })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(...GOLD.map ? PURPLE : PURPLE)
    doc.setTextColor(160, 130, 40)
    doc.text(title, MARGIN + 12, y + 1)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(...TEXT)
    const lines = doc.splitTextToSize(desc, CONTENT_W - 14)
    doc.text(lines, MARGIN + 12, y + 6)
    y += 8 + lines.length * 4.4
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

function pillarTable(rows, y) {
  rows.forEach(([num, name, desc]) => {
    const h = 22
    doc.setFillColor(...GOLD)
    doc.rect(MARGIN, y, 32, h, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...WHITE)
    doc.text(`PILAR ${num}`, MARGIN + 16, y + 8, { align: 'center' })
    const nameLines = doc.splitTextToSize(name, 28)
    doc.text(nameLines, MARGIN + 16, y + 14, { align: 'center' })
    doc.setFillColor(245, 245, 245)
    doc.rect(MARGIN + 32, y, CONTENT_W - 32, h, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(...TEXT)
    const descLines = doc.splitTextToSize(desc, CONTENT_W - 38)
    doc.text(descLines, MARGIN + 36, y + 7)
    y += h + 4
  })
  return y + 4
}

function infoBox(title, text, y, height) {
  doc.setFillColor(...GOLD_LIGHT)
  doc.rect(MARGIN, y, CONTENT_W, height, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(150, 110, 30)
  doc.text(title, MARGIN + 4, y + 6)
  doc.setFont('helvetica', 'normal')
  const bodyLines = doc.splitTextToSize(text, CONTENT_W - 8)
  doc.text(bodyLines, MARGIN + 4, y + 11)
  return y + height + 6
}

// ── PÁGINA 1: Portada ──
doc.setFont('helvetica', 'bold')
doc.setFontSize(26)
doc.setTextColor(...GOLD)
doc.text('MÉTODO MAJHO', PAGE_W / 2, 60, { align: 'center' })
doc.setFontSize(18)
doc.setTextColor(...PURPLE)
doc.text('MÓDULO 1', PAGE_W / 2, 72, { align: 'center' })
doc.setDrawColor(...GOLD)
doc.setLineWidth(0.6)
doc.line(MARGIN, 80, PAGE_W - MARGIN, 80)

doc.setFont('helvetica', 'normal')
doc.setFontSize(13)
doc.setTextColor(...PURPLE)
doc.text('Bienvenida al Método MAJHO', PAGE_W / 2, 96, { align: 'center' })
doc.setFontSize(10.5)
doc.setTextColor(...TEXT)
doc.text('Tipos de niños y los 4 pilares de la crianza consciente.', PAGE_W / 2, 105, { align: 'center' })

doc.setFontSize(10.5)
const introP1 = doc.splitTextToSize(
  'Bienvenida/o a este espacio sagrado de transformación. El Método MAJHO nació de la convergencia entre la ciencia del desarrollo humano, la psicología consciente y la sabiduría espiritual más profunda de la humanidad. Este primer módulo te entrega el mapa completo del camino que vas a recorrer y las herramientas para comprender quién es el niño que acompañas, quién eres tú como guía, y qué tipo de entorno consciente quieres co-crear.',
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
  '1. ¿Qué es el Método MAJHO y para quién es?',
  '2. La crisis de la crianza moderna',
  '3. Los 4 pilares del Método MAJHO',
  '4. Pilar 1: Neurociencia — El cerebro como base del desarrollo',
  '5. Pilar 2: PNL — Reprogramación y comunicación consciente',
  '6. Pilar 3: Psicología Infantil — Apego, emociones y límites con amor',
  '7. Pilar 4: Sabiduría Ancestral — Raíces, ritual y propósito',
  '8. Tipos de niños: el mapa de los 5 arquetipos',
  '9. El niño sensible y el niño de alta energía',
  '10. El rol del adulto en el Método MAJHO',
  '11. Tu historia como punto de partida',
  '12. Declaración de intención y contrato sagrado',
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

// ── SECCIÓN 1 (parte A): ¿Qué es el Método MAJHO? ──
doc.addPage()
let y = sectionHeading(1, '¿Qué es el Método MAJHO y Para Quién Es?', 30)
y = paragraph('MAJHO es un acrónimo que condensa la esencia del método: Mindfulness, Amor incondicional, Júbilo, Hogar sagrado y Origen espiritual. Cada letra representa una dimensión del ser que este método cultiva de forma integrada.', y)
y = paragraph('El Método MAJHO está diseñado para educadores, maestros, facilitadores, madres, padres y cuidadores que sienten que los modelos convencionales de crianza y educación no responden a la profundidad de lo que son los niños de hoy.', y)
y = quoteLine('"El niño no llegó para ser domesticado. Llegó para ser acompañado en el despliegue de su alma."', y)
y = paragraph('¿Para quién NO es el Método MAJHO? No es para quien busca recetas mágicas de obediencia instantánea, ni para quien quiere controlar la experiencia del niño sin cuestionarse a sí mismo. Requiere disposición al cambio personal, porque la transformación del entorno siempre empieza por el adulto.', y, { gap: 6 })
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(...PURPLE)
doc.text('Las 5 Letras del Método', MARGIN, y)
y += 8
y = numberedCircleList([
  [1, 'M · Mindfulness', 'Presencia plena en el momento con el niño. Sin distracciones, sin agenda, sin el pasado ni el futuro.'],
  [2, 'A · Amor incondicional', 'Un amor que no depende del comportamiento del niño. El amor que sana los programas más profundos.'],
  [3, 'J · Júbilo', 'La ligereza y el juego como vehículos de conexión y aprendizaje genuino.'],
  [4, 'H · Hogar/Aula sagrada', 'El espacio físico y energético donde se desarrolla el niño: un templo de crecimiento.'],
], y)
footer()

// ── SECCIÓN 1 (parte B): Letra O ──
doc.addPage()
y = numberedCircleList([
  [5, 'O · Origen espiritual', 'El reconocimiento de que cada niño es un alma con historia, misión y propósito. La crianza y la educación como práctica espiritual del más alto orden.'],
], 30)
footer()

// ── SECCIÓN 2: La crisis de la crianza moderna ──
doc.addPage()
y = sectionHeading(2, 'La Crisis de la Crianza Moderna', 30)
y = paragraph('Vivimos en la era con más información sobre crianza y educación infantil que jamás ha existido. Y paradójicamente, con más adultos cuidadores agotados, culpables y desconectados que nunca.', y)
y = table(
  ['Síntoma', 'Descripción'],
  [
    ['Agotamiento crónico', 'La desaparición de la tribu comunitaria ha dejado a educadores y cuidadores solos ante una tarea que requería un pueblo entero.'],
    ['Patologización de la infancia', 'Los diagnósticos se multiplican mientras nos preguntamos si el problema está en los niños o en el sistema que los recibe.'],
    ['La pantalla como sustituto del vínculo', 'Niños hiperconectados digitalmente e hipoconectados emocionalmente, justo cuando más necesitan contacto humano real.'],
    ['Desconexión espiritual', 'Hemos reducido la crianza a una gestión logística, olvidando que acompañamos almas, no gestionamos recursos.'],
    ['Transmisión inconsciente del trauma', 'Sin trabajo personal, transmitimos automáticamente los patrones de dolor que recibimos. El Método MAJHO rompe esa cadena.'],
  ],
  y,
  [65, 105]
)
footer()

// ── SECCIÓN 3: Los 4 Pilares (overview) — CORREGIDO ──
doc.addPage()
y = sectionHeading(3, 'Los 4 Pilares del Método MAJHO', 30)
y = paragraph('El Método MAJHO se sostiene sobre cuatro pilares fundamentales: cuatro disciplinas que se exploran en profundidad a lo largo de todo el programa. Cada uno es indispensable; juntos crean una estructura que sostiene el florecimiento de todos sus miembros.', y)
y = pillarTable([
  [1, 'NEUROCIENCIA', 'La comprensión científica del desarrollo cerebral infantil y la neuroplasticidad como base de todo cambio posible. Se profundiza en el Módulo 2.'],
  [2, 'PNL', 'Programación Neurolingüística: herramientas de reprogramación, anclaje y reencuadre que transforman creencias limitantes en recursos. Se profundiza en el Módulo 3.'],
  [3, 'PSICOLOGÍA INFANTIL', 'La construcción del apego seguro, la gestión consciente de las emociones y los límites con amor. Se profundiza en el Módulo 6.'],
  [4, 'SABIDURÍA ANCESTRAL', 'Tradiciones, rituales y saberes de los pueblos originarios que conectan al niño con su raíz, su comunidad y su propósito espiritual. Se profundiza en el Módulo 4.'],
], y)
footer()

// ── SECCIÓN 4: Pilar 1 Neurociencia — CORREGIDO ──
doc.addPage()
y = sectionHeading(4, 'Pilar 1: Neurociencia — El Cerebro Como Base del Desarrollo', 30)
y = paragraph('El cerebro de un niño no es un cerebro de adulto en miniatura: es un órgano en plena construcción, exquisitamente sensible a cada experiencia, cada palabra, cada vínculo. La neurociencia nos muestra que los primeros años son la ventana de mayor neuroplasticidad de toda la vida humana.', y)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('¿Por qué es fundamental?', MARGIN, y)
y += 7
y = paragraph('Porque cada intervención educativa o de crianza que no considere cómo funciona realmente el cerebro infantil corre el riesgo de exigir al niño algo que su desarrollo neurológico aún no sostiene.', y)
y = infoBox(
  'Lo explorarás en profundidad en el Módulo 2: Neurociencia Infantil',
  'Desarrollo cerebral por etapas, la neuroplasticidad como herramienta de cambio, y cómo diseñar entornos que potencien —en lugar de saturar— el cerebro en desarrollo.',
  y, 20
)
footer()

// ── SECCIÓN 5: Pilar 2 PNL — CORREGIDO ──
doc.addPage()
y = sectionHeading(5, 'Pilar 2: PNL — Reprogramación y Comunicación Consciente', 30)
y = paragraph('La Programación Neurolingüística estudia cómo el lenguaje, las creencias y los estados internos se programan, y se pueden reprogramar. Aplicada a la crianza y la educación, es una caja de herramientas práctica para transformar patrones limitantes en recursos.', y)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('¿Por qué es fundamental?', MARGIN, y)
y += 7
y = paragraph('Porque tanto el niño como el adulto que lo acompaña cargan creencias heredadas, muchas inconscientes, que determinan cómo reaccionan, se comunican y se relacionan.', y)
y = infoBox(
  'Lo explorarás en profundidad en el Módulo 3: PNL para Familias Despiertas',
  'Anclas de estados positivos, reencuadre de creencias limitantes, y comunicación que programa el éxito en lugar del miedo.',
  y, 20
)
footer()

// ── SECCIÓN 6: Pilar 3 Psicología Infantil — CORREGIDO ──
doc.addPage()
y = sectionHeading(6, 'Pilar 3: Psicología Infantil — Apego, Emociones y Límites con Amor', 30)
y = paragraph('La psicología infantil consciente estudia cómo se construye el vínculo de apego seguro, cómo se desarrolla la regulación emocional, y cómo los límites amorosos —lejos de ser una restricción— son los que dan al niño la seguridad para crecer con autonomía.', y)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('¿Por qué es fundamental?', MARGIN, y)
y += 7
y = paragraph('Porque la calidad del vínculo y la gestión emocional en la infancia moldean, literalmente, la arquitectura del cerebro y la forma en que esa persona se relacionará durante toda su vida.', y)
y = infoBox(
  'Lo explorarás en profundidad en el Módulo 6: Psicología Infantil Consciente',
  'Tipos de apego, regulación emocional con amor, y el arte de poner límites que fortalecen en lugar de herir.',
  y, 20
)
footer()

// ── SECCIÓN 7: Pilar 4 Sabiduría Ancestral — CORREGIDO ──
doc.addPage()
y = sectionHeading(7, 'Pilar 4: Sabiduría Ancestral — Raíces, Ritual y Propósito', 30)
y = paragraph('Mucho antes de la psicología y la neurociencia modernas, los pueblos originarios del mundo acompañaron a sus niños con una sabiduría nacida de la observación profunda de la naturaleza y la memoria viva de generaciones. Esa sabiduría no es pasado: es una raíz que sostiene.', y)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('¿Por qué es fundamental?', MARGIN, y)
y += 7
y = paragraph('Porque la ciencia explica el cómo, pero la sabiduría ancestral devuelve el para qué: el sentido, el ritual, la pertenencia y la conexión espiritual que ningún dato por sí solo puede ofrecer.', y)
y = infoBox(
  'Lo explorarás en profundidad en el Módulo 4: Sabiduría Ancestral Aplicada',
  'Rituales de bienvenida, la magia de los cuatro elementos, y el Protocolo de Acompañamiento Ancestral MAJHO.',
  y, 20
)
footer()

// ── SECCIÓN 8 (parte A): Tipos de niños ──
doc.addPage()
y = sectionHeading(8, 'Tipos de Niños: El Mapa de los 5 Arquetipos', 30)
y = paragraph('Más allá de los tipos de vibración energética (Índigo, Cristal, Arcoíris, Diamante) que exploraremos en el Módulo 8, el Método MAJHO reconoce 5 arquetipos funcionales que describen la forma en que cada niño se relaciona con el mundo, aprende y necesita ser acompañado.', y)
y = bulletList([
  ['El Explorador', 'curiosidad insaciable y necesidad de movimiento constante. Necesita aventura, naturaleza y proyectos reales.'],
  ['El Guardián', 'fuerte sentido de la justicia y la responsabilidad. Necesita orden emocional y que se vea su contribución.'],
  ['El Creador', 'vive en su mundo interior lleno de imágenes e ideas. Necesita tiempo libre no estructurado y materiales creativos.'],
  ['El Conector', 'profundamente empático y orientado a las relaciones. Necesita armonía en el entorno y validación de su sensibilidad.'],
], y)
footer()

// ── SECCIÓN 8 (parte B): El Sabio ──
doc.addPage()
y = bulletList([
  ['El Sabio', 'pensamiento profundo y preguntas existenciales desde temprana edad. Necesita conversaciones genuinas y aprendizaje autodidacta. Riesgo: puede sentirse profundamente incomprendido si no encuentra su tribu.'],
], 30)
footer()

// ── SECCIÓN 9 (parte A): Niño sensible / alta energía ──
doc.addPage()
y = sectionHeading(9, 'El Niño Sensible y el Niño de Alta Energía', 30)
y = paragraph('Dos de los perfiles más frecuentes que llegan a consulta y talleres MAJHO merecen atención especial.', y)
y = table(
  ['Niño Altamente Sensible (PAS)', ''],
  [
    ['¿Qué es?', 'El 15-20% de la población nace con un sistema nervioso que procesa la información con mayor profundidad. No es un trastorno: es un rasgo evolutivo.'],
    ['Dones', 'Profundidad emocional, empatía excepcional, conciencia artística, intuición muy desarrollada.'],
    ['Cómo acompañarlo', 'Ambientes tranquilos y predecibles, tiempo de recuperación, validación de su sensibilidad como un don.'],
  ],
  y,
  [55, 115]
)
footer()

// ── SECCIÓN 9 (parte B): Niño de alta energía ──
doc.addPage()
y = table(
  ['Niño de Alta Energía', ''],
  [
    ['¿Qué es?', 'Niveles de energía, intensidad emocional y necesidad de movimiento muy superiores a la media. Frecuentemente mal diagnosticado como TDAH.'],
    ['Dones', 'Entusiasmo contagioso, iniciativa, creatividad, liderazgo natural.'],
    ['Cómo acompañarlo', 'Movimiento físico diario abundante, proyectos que canalicen su energía, límites claros con espacio para la expresión.'],
  ],
  30,
  [55, 115]
)
y = infoBox(
  'Una nota sobre las etiquetas',
  'TDAH, trastorno oposicionista, espectro autista, ansiedad generalizada: la sociedad suele nombrar con diagnósticos clínicos lo que en estos niños es, muchas veces, sensibilidad e intensidad natural. Esto no invalida los diagnósticos reales ni reemplaza la atención profesional cuando es necesaria. En el Módulo 8 profundizamos esta relación entre etiquetas sociales y tipos de vibración.',
  y, 24
)
footer()

// ── SECCIÓN 10: Rol del adulto ──
doc.addPage()
y = sectionHeading(10, 'El Rol del Adulto en el Método MAJHO', 30)
y = paragraph('El adulto en el Método MAJHO no es un experto que sabe todo sobre el niño. Es un guía que camina adelante con una antorcha, iluminando el camino sin cargar al niño ni empujarlo.', y)
y = quoteLine('"Antes de guiar al niño, mira tu propia historia. El trabajo personal no es opcional."', y)
y = bulletList([
  ['Guía, no jefe', 'la guía ofrece dirección con amor; el jefe ordena con autoridad.'],
  ['Espejo, no proyector', 'el espejo refleja la realidad del niño tal como es; el trabajo personal limpia el proyector.'],
  ['Raíz, no ancla', 'la raíz da nutrición y sostén mientras el niño crece; el ancla lo mantiene fijo.'],
  ['Compañero de viaje', 'el adulto consciente reconoce que el niño también le enseña.'],
], y)
footer()

// ── SECCIÓN 11: Tu historia ──
doc.addPage()
y = sectionHeading(11, 'Tu Historia Como Punto de Partida', 30)
y = paragraph('Antes de trabajar con los niños, el Método MAJHO te invita a mirarte a ti mismo/a. No para culpar a nadie, sino para elegir conscientemente qué queremos repetir y qué queremos transformar.', y)
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(160, 130, 40)
doc.text('Ejercicio de Reflexión: El Inventario Personal', MARGIN, y)
y += 8
const inventario = [
  '¿Cómo expresaban el amor en mi entorno de origen?',
  '¿Cómo se manejaban los conflictos y las emociones intensas en los entornos donde crecí?',
  '¿Qué mensajes recibí sobre quién soy, qué merezco, cuánto valgo?',
  '¿Qué comportamientos de mis figuras de referencia juré no repetir? ¿Los estoy repitiendo de todas formas?',
  '¿Qué heridas de mi propia historia se activan con más fuerza cuando interactúo con los niños?',
  '¿Qué dones recibí de mis figuras de referencia que quiero conscientemente transmitir?',
  '¿Qué tipo de entorno quiero ser para los niños que acompaño?',
]
doc.setFont('helvetica', 'normal')
doc.setFontSize(10)
doc.setTextColor(...TEXT)
inventario.forEach((q, i) => {
  const lines = doc.splitTextToSize(`${i + 1}. ${q}`, CONTENT_W)
  doc.text(lines, MARGIN, y)
  y += lines.length * 5 + 3
})
footer()

// ── SECCIÓN 12: Declaración de intención ──
doc.addPage()
y = sectionHeading(12, 'Declaración de Intención y Contrato Sagrado', 30)
y = paragraph('Toda transformación comienza con una declaración de intención. Nombrar lo que queremos activa en nosotros los recursos necesarios para lograrlo.', y)

const boxY = y
const boxH = 95
doc.setDrawColor(...GOLD)
doc.setLineWidth(0.8)
doc.setFillColor(250, 247, 240)
doc.rect(MARGIN, boxY, CONTENT_W, boxH, 'FD')
doc.setFont('helvetica', 'bold')
doc.setFontSize(11)
doc.setTextColor(...PURPLE)
doc.text('CONTRATO SAGRADO MAJHO', PAGE_W / 2, boxY + 12, { align: 'center' })
doc.setFont('helvetica', 'normal')
doc.setFontSize(9.5)
doc.setTextColor(...TEXT)
const contrato = [
  'Yo, _________________________, declaro mi intención de recorrer este camino de',
  'acompañamiento consciente con honestidad, apertura y amor.',
  '',
  'Me comprometo a mirarme con honestidad, a trabajar mis propios patrones antes de',
  'exigir cambios a los niños que acompaño.',
  '',
  'Me comprometo a ver a cada niño/a como el alma sagrada y completa que es.',
  '',
  'Me comprometo a ser consistente en la práctica y a pedir ayuda cuando la necesite.',
  '',
  'Firmado con amor, _________________________      Fecha: _________________',
]
let cy = boxY + 24
contrato.forEach(line => {
  doc.text(line, PAGE_W / 2, cy, { align: 'center' })
  cy += 7
})
y = boxY + boxH + 10

doc.setFont('helvetica', 'normal')
doc.setFontSize(9)
doc.setTextColor(...PURPLE)
doc.text('Has completado el Módulo 1 · Método MAJHO · Academia de Crianza Consciente & Espiritualidad Familiar', PAGE_W / 2, y, { align: 'center', maxWidth: CONTENT_W })
y += 14
quoteLine('"El viaje de mil millas comienza con el primer paso consciente. Este es ese paso. Bienvenida/o al Método MAJHO."', y)

const outPath = path.join(__dirname, '..', 'public', 'pdfs', 'MAJHO_Modulo1_Bienvenida_Metodo_MAJHO.pdf')
doc.save(outPath)
console.log('PDF generado en:', outPath)

const { jsPDF } = require('jspdf')
const path = require('path')

// Paleta de marca MAJHO (igual a los PDFs existentes)
const GOLD = [201, 168, 76]
const PURPLE = [123, 94, 167]
const PURPLE_LIGHT = [237, 232, 246]
const GOLD_LIGHT = [250, 240, 217]
const GREEN = [92, 138, 110]
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
  doc.text(`${num}. ${title}`, MARGIN, y)
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.6)
  doc.line(MARGIN, y + 3, PAGE_W - MARGIN, y + 3)
  return y + 13
}

function paragraph(text, y, opts = {}) {
  const size = opts.size || 10.5
  const italic = opts.italic || false
  doc.setFont('helvetica', italic ? 'italic' : 'normal')
  doc.setFontSize(size)
  doc.setTextColor(...(opts.color || TEXT))
  const lines = doc.splitTextToSize(text, opts.width || CONTENT_W)
  doc.text(lines, opts.align === 'center' ? PAGE_W / 2 : MARGIN, y, { align: opts.align || 'left' })
  return y + lines.length * (size / 2.2) + (opts.gap ?? 4)
}

function bulletList(items, y, opts = {}) {
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
  // header
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
  // rows
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  rows.forEach((row, ri) => {
    const cellLines = row.map((cell, i) => doc.splitTextToSize(cell, colWidths[i] - 4))
    const lineCount = Math.max(...cellLines.map(l => l.length))
    const h = Math.max(rowH, lineCount * 4.2 + 3)
    doc.setFillColor(...(ri % 2 === 0 ? PURPLE_LIGHT : WHITE))
    doc.rect(MARGIN, y, totalW, h, 'F')
    x = MARGIN
    doc.setTextColor(...TEXT)
    row.forEach((cell, i) => {
      if (i === 0) {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...PURPLE)
      } else {
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...TEXT)
      }
      doc.text(cellLines[i], x + 2, y + 5)
      x += colWidths[i]
    })
    y += h
  })
  return y + 6
}

function infoBox(title, text, y, height) {
  doc.setFillColor(...GOLD_LIGHT)
  doc.rect(MARGIN, y, CONTENT_W, height, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...[150, 110, 30])
  const titleLines = doc.splitTextToSize(title, CONTENT_W - 8)
  doc.text(titleLines, MARGIN + 4, y + 6)
  doc.setFont('helvetica', 'normal')
  const bodyLines = doc.splitTextToSize(text, CONTENT_W - 8)
  doc.text(bodyLines, MARGIN + 4, y + 6 + titleLines.length * 4.2)
  return y + height + 6
}

function quoteLine(text, y) {
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(10.5)
  doc.setTextColor(...PURPLE)
  doc.text(text, PAGE_W / 2, y, { align: 'center' })
  return y + 10
}

// ── PÁGINA 1: Portada ──
doc.setFont('helvetica', 'bold')
doc.setFontSize(26)
doc.setTextColor(...GOLD)
doc.text('MÉTODO MAJHO', PAGE_W / 2, 60, { align: 'center' })
doc.setFontSize(18)
doc.setTextColor(...PURPLE)
doc.text('MÓDULO 7', PAGE_W / 2, 72, { align: 'center' })
doc.setDrawColor(...GOLD)
doc.setLineWidth(0.6)
doc.line(MARGIN, 80, PAGE_W - MARGIN, 80)

doc.setFont('helvetica', 'normal')
doc.setFontSize(13)
doc.setTextColor(...PURPLE)
doc.text('Numerología y Astrología Infantil', PAGE_W / 2, 96, { align: 'center' })
doc.setFontSize(10.5)
doc.setTextColor(...TEXT)
const sub = doc.splitTextToSize('Descifrando el propósito del alma de cada niño a través del número de su nacimiento y el mapa de las estrellas.', 150)
doc.text(sub, PAGE_W / 2, 105, { align: 'center' })

doc.setFontSize(10.5)
const introP1 = doc.splitTextToSize(
  'Desde Babilonia hasta los Andes, desde Pitágoras hasta los sabios védicos, las civilizaciones del mundo han mirado los números y las estrellas para comprender la naturaleza única de cada ser. La numerología y la astrología no predicen un destino fijo: ofrecen un lenguaje simbólico para nombrar lo que el niño trae al nacer, sus dones, sus desafíos y el ritmo particular de su alma. Este módulo te entrega ese lenguaje, como complemento espiritual a la neurociencia y la psicología que ya conoces, para acompañar a cada niño desde su esencia más singular.',
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
  '1. Los números y las estrellas como lenguaje del alma',
  '2. Fundamentos de la numerología: el código de la fecha de nacimiento',
  '3. El Número de Camino de Vida: la misión del niño',
  '4. El Número de Personalidad y el Número del Alma',
  '5. Astrología infantil: la carta natal como mapa de nacimiento',
  '6. Los 12 signos solares y su expresión en la niñez',
  '7. La Luna natal: el mundo emocional del niño',
  '8. Los elementos astrológicos en el temperamento infantil',
  '9. Casas astrológicas clave para el acompañamiento',
  '10. Ciclos numerológicos: los años personales del niño',
  '11. Integración práctica: el Mapa MAJHO del niño',
  '12. Protocolo de Acompañamiento Numero-Astral MAJHO',
]
let iy = 48
doc.setFont('helvetica', 'normal')
doc.setFontSize(11)
doc.setTextColor(...TEXT)
indice.forEach(item => {
  doc.text(`•  ${item}`, MARGIN, iy)
  iy += 9
})
footer()

// ── SECCIÓN 1 ──
doc.addPage()
let y = sectionHeading(1, 'Los Números y las Estrellas como Lenguaje del Alma', 30)
y = paragraph('Mucho antes de la psicología y la neurociencia modernas, las civilizaciones antiguas ya observaban patrones: el momento exacto del nacimiento, la posición de las estrellas, la vibración de cada número. No lo hacían para predecir un destino cerrado, sino para entregar a cada familia un mapa simbólico que ayudara a comprender la naturaleza única del niño que llegaba.', y)
y = quoteLine('"Los números gobiernan el universo." — Pitágoras', y)
y = bulletList([
  ['Un lenguaje simbólico', 'para nombrar lo que el niño aún no puede explicar con palabras.'],
  ['Un mapa de tendencias, no un destino fijo', 'el libre albedrío del niño siempre prevalece sobre cualquier número o signo.'],
  ['Una puerta de conexión', 'preguntas curiosas que abren diálogo entre padres e hijos, nunca etiquetas que encierran.'],
  ['Un complemento espiritual', 'a la neurociencia y la psicología infantil, jamás un sustituto de la evaluación profesional.'],
], y)
footer()

// ── SECCIÓN 2 ──
doc.addPage()
y = sectionHeading(2, 'Fundamentos de la Numerología', 30)
y = paragraph('La numerología reduce los números de la fecha de nacimiento a una vibración esencial, del 1 al 9 (con excepción de los números maestros 11, 22 y 33). Cada número porta un arquetipo: una energía con dones y desafíos propios que se expresan desde la primera infancia.', y)
y = table(
  ['Número', 'Arquetipo', 'Energía en la niñez'],
  [
    ['1', 'El Pionero', 'Liderazgo natural, independencia temprana, necesidad de decidir por sí mismo'],
    ['2', 'El Armonizador', 'Sensibilidad alta, necesidad de paz y vínculo, mediador entre hermanos'],
    ['3', 'El Creativo', 'Expresión y alegría, necesidad de ser escuchado y aplaudido'],
    ['4', 'El Constructor', 'Orden y rutina, seguridad en lo predecible'],
    ['5', 'El Explorador', 'Curiosidad sin límites, necesidad de movimiento y libertad'],
    ['6', 'El Cuidador', 'Empatía y responsabilidad temprana, tendencia a cuidar a otros'],
    ['7', 'El Buscador', 'Introspección, necesidad de soledad, preguntas profundas'],
    ['8', 'El Realizador', 'Determinación, necesidad de ver resultados de su esfuerzo'],
    ['9', 'El Alma Vieja', 'Compasión universal, sensibilidad a la injusticia'],
  ],
  y,
  [18, 35, 117]
)
infoBox(
  'IMPORTANTE',
  'Este módulo ofrece un marco simbólico y reflexivo de autoconocimiento. No determina el destino del niño ni sustituye una evaluación psicológica profesional: es una herramienta más para mirar con curiosidad y amor.',
  y, 18
)
footer()

// ── SECCIÓN 3 ──
doc.addPage()
y = sectionHeading(3, 'El Número de Camino de Vida: la Misión del Niño', 30)
y = paragraph('El Camino de Vida se calcula sumando todos los dígitos de la fecha de nacimiento hasta reducirlos a un solo número (salvo los números maestros 11, 22 y 33). Revela la lección central que el niño viene a aprender y su necesidad más profunda.', y)
y = infoBox(
  'Ejemplo de cálculo',
  'Fecha: 14 / 03 / 2018  ->  1+4+0+3+2+0+1+8 = 19  ->  1+9 = 10  ->  1+0 = 1.  Camino de Vida: 1 (El Pionero).',
  y, 14
)
y = bulletList([
  ['Observa si el entorno diario honra', 'la necesidad central de ese número, en vez de exigirle ser distinto.'],
  ['No fuerces rutinas rígidas', 'a un Camino 5 que necesita movimiento, ni expongas a estímulo constante a un Camino 7 que necesita quietud.'],
  ['Usa el número como pregunta', '¿qué necesita hoy este niño según su naturaleza?, nunca como excusa para etiquetarlo.'],
], y)
footer()

// ── SECCIÓN 4 ──
doc.addPage()
y = sectionHeading(4, 'El Número de Personalidad y el Número del Alma', 30)
y = paragraph('Además de la fecha de nacimiento, el nombre completo del niño revela dos números complementarios usando la tabla pitagórica (cada letra equivale a un número del 1 al 9). Las consonantes del nombre forman el Número de Personalidad —cómo el mundo percibe al niño—; las vocales forman el Número del Alma —su anhelo más íntimo, muchas veces invisible para los demás—.', y)
y = table(
  ['Letras', 'A,J,S', 'B,K,T', 'C,L,U', 'D,M,V', 'E,N,W', 'F,O,X', 'G,P,Y', 'H,Q,Z', 'I,R'],
  [['Valor', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
  y,
  [16, 13.6, 13.6, 13.6, 13.6, 13.6, 13.6, 13.6, 13.6, 13.6]
)
y = bulletList([
  ['Personalidad y Alma son distintos', 'un niño puede mostrarse extrovertido (Personalidad) mientras su anhelo interior es de calma y soledad (Alma).'],
  ['La brecha entre ambos números', 'suele explicar tensiones internas que el niño no sabe nombrar: acompáñalo a integrar ambas caras.'],
], y)
footer()

// ── SECCIÓN 5 ──
doc.addPage()
y = sectionHeading(5, 'Astrología Infantil: la Carta Natal como Mapa de Nacimiento', 30)
y = paragraph('La carta natal es una fotografía del cielo en el instante y lugar exacto del nacimiento. Para el acompañamiento infantil, basta con conocer tres puntos esenciales: el Sol, la Luna y el Ascendente.', y)
y = quoteLine('"El Sol es quien serás, la Luna es quien ya eres, el Ascendente es cómo el mundo te conoce."', y)
y = bulletList([
  ['El Sol', 'la identidad consciente que el niño irá construyendo: su signo solar clásico.'],
  ['La Luna', 'el mundo emocional inmediato, lo que el niño necesita para sentirse seguro y contenido.'],
  ['El Ascendente', 'la forma instintiva en que el niño reacciona y se presenta ante lo nuevo.'],
], y)
footer()

// ── SECCIÓN 6 ──
doc.addPage()
y = sectionHeading(6, 'Los 12 Signos Solares y su Expresión en la Niñez', 30)
y = table(
  ['Signo', 'Expresión en la niñez', 'Clave de acompañamiento'],
  [
    ['Aries', 'Impulsivo, valiente, necesita movimiento', 'Canaliza su energía en logros cortos y deporte'],
    ['Tauro', 'Tranquilo, sensorial, necesita rutina', 'Honra su ritmo lento, evita apresurarlo'],
    ['Gémini', 'Curioso, hablador, necesita variedad', 'Ofrece múltiples intereses, evita el aburrimiento'],
    ['Cáncer', 'Sensible, apegado al hogar', 'Valida sus emociones sin minimizarlas'],
    ['Leo', 'Expresivo, orgulloso, busca reconocimiento', 'Celebra sus logros sin sobre-halagar'],
    ['Virgo', 'Meticuloso, servicial, necesita orden', 'Dale tareas con un propósito claro'],
    ['Libra', 'Sociable, armonizador, busca equilibrio', 'Enséñale a poner límites sin culpa'],
    ['Escorpio', 'Intenso, intuitivo, necesita privacidad', 'Respeta su mundo interior, no lo invadas'],
    ['Sagitario', 'Aventurero, optimista, necesita libertad', 'Permite explorar, evita reglas excesivas'],
    ['Capricornio', 'Responsable, ambicioso, busca estructura', 'Reconoce su esfuerzo, no solo el resultado'],
    ['Acuario', 'Original, independiente, distinto a su grupo', 'Celebra su rareza, no la corrijas'],
    ['Piscis', 'Soñador, empático, sensible al ambiente', 'Protege su sensibilidad del mundo duro'],
  ],
  y,
  [25, 75, 70]
)
footer()

// ── SECCIÓN 7 ──
doc.addPage()
y = sectionHeading(7, 'La Luna Natal: el Mundo Emocional del Niño', 30)
y = paragraph('Mientras el signo solar se construye con el tiempo, la Luna natal ya está activa desde el nacimiento: es el lenguaje emocional inmediato del niño, lo que lo calma y lo que lo desborda. En la primera infancia, suele ser más reveladora día a día que el propio signo solar.', y)
y = bulletList([
  ['Luna en signos de Fuego', 'necesita expresar la emoción de inmediato, con movimiento o voz; reprimirla la intensifica.'],
  ['Luna en signos de Tierra', 'se calma con rutina, contacto físico y previsibilidad; los cambios repentinos la desestabilizan.'],
  ['Luna en signos de Aire', 'necesita poner en palabras lo que siente; hablarlo es, para ella, lo que para otros es llorar.'],
  ['Luna en signos de Agua', 'absorbe el clima emocional del hogar como una esponja; cuidar el ambiente familiar es cuidarla a ella.'],
], y)
footer()

// ── SECCIÓN 8 ──
doc.addPage()
y = sectionHeading(8, 'Los Elementos Astrológicos en el Temperamento Infantil', 30)
y = paragraph('Cada signo pertenece a uno de los cuatro elementos clásicos. Observar el elemento dominante en la carta del niño —no solo su signo solar— ofrece una lectura más completa de su temperamento general.', y)

const elements = [
  ['FUEGO', GOLD, 'Aries · Leo · Sagitario', 'Entusiasmo, espontaneidad, necesidad de acción y desafío inmediato.'],
  ['TIERRA', GREEN, 'Tauro · Virgo · Capricornio', 'Practicidad, constancia, necesidad de resultados tangibles y estabilidad.'],
  ['AIRE', PURPLE, 'Gémini · Libra · Acuario', 'Curiosidad, sociabilidad, necesidad de ideas, palabras y vínculos.'],
  ['AGUA', [90, 130, 170], 'Cáncer · Escorpio · Piscis', 'Sensibilidad, intuición, necesidad de profundidad emocional y contención.'],
]
elements.forEach(([name, color, signs, desc]) => {
  const boxH = 18
  doc.setFillColor(...color)
  doc.rect(MARGIN, y, 28, boxH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...WHITE)
  doc.text(name, MARGIN + 14, y + 10, { align: 'center' })
  doc.setFillColor(245, 245, 245)
  doc.rect(MARGIN + 28, y, CONTENT_W - 28, boxH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...TEXT)
  doc.text(signs, MARGIN + 32, y + 6)
  doc.setFont('helvetica', 'normal')
  const descLines = doc.splitTextToSize(desc, CONTENT_W - 36)
  doc.text(descLines, MARGIN + 32, y + 12)
  y += boxH + 4
})
footer()

// ── SECCIÓN 9 ──
doc.addPage()
y = sectionHeading(9, 'Casas Astrológicas Clave para el Acompañamiento', 30)
y = paragraph('La carta natal completa tiene 12 casas. Para el acompañamiento infantil, cuatro son especialmente útiles de observar.', y)
y = table(
  ['Casa', 'Tema', 'Pregunta de observación'],
  [
    ['Casa 1', 'Identidad e instinto', '¿Cómo reacciona el niño en automático ante lo nuevo?'],
    ['Casa 4', 'Hogar y raíces familiares', '¿Qué necesita sentir en casa para estar en calma?'],
    ['Casa 5', 'Creatividad y juego', '¿En qué actividad pierde la noción del tiempo?'],
    ['Casa 10', 'Vocación futura', '¿Qué admira el niño y a quién le gustaría parecerse?'],
  ],
  y,
  [22, 50, 98]
)
footer()

// ── SECCIÓN 10 ──
doc.addPage()
y = sectionHeading(10, 'Ciclos Numerológicos: los Años Personales del Niño', 30)
y = paragraph('Así como el Camino de Vida es fijo, el Año Personal cambia cada año (se calcula sumando el día y mes de nacimiento con el año en curso) y se repite en ciclos del 1 al 9. Cada año personal trae un tema de desarrollo distinto.', y)
y = table(
  ['Año', 'Tema del ciclo'],
  [
    ['1', 'Comienzos: nuevos intereses, primeras decisiones propias'],
    ['2', 'Vínculos: cooperación, amistades, sensibilidad a la pertenencia'],
    ['3', 'Expresión: creatividad, juego, comunicación abierta'],
    ['4', 'Estructura: hábitos, esfuerzo sostenido, sentido del deber'],
    ['5', 'Cambio: movimiento, curiosidad, necesidad de variedad'],
    ['6', 'Cuidado: responsabilidad afectiva, vínculos familiares'],
    ['7', 'Introspección: más silencio, preguntas internas, soledad buscada'],
    ['8', 'Logro: metas concretas, orgullo por resultados propios'],
    ['9', 'Cierre: soltar etapas, prepararse para un nuevo ciclo'],
  ],
  y,
  [18, 152]
)
footer()

// ── SECCIÓN 11 ──
doc.addPage()
y = sectionHeading(11, 'Integración Práctica: el Mapa MAJHO del Niño', 30)
y = paragraph('No necesitas ser astrólogo ni numerólogo profesional para usar estas herramientas con sentido común y amor. Basta con construir un perfil simple del niño y volver a él como referencia, nunca como sentencia.', y)
y = bulletList([
  ['Calcula su Camino de Vida', 'y anótalo junto a su necesidad central de aprendizaje.'],
  ['Identifica su signo solar y lunar', 'usando cualquier calculadora de carta natal gratuita con fecha, hora y lugar de nacimiento.'],
  ['Observa su elemento dominante', 'y ajusta el entorno (rutina, estímulo, vínculo o profundidad) según corresponda.'],
  ['Conversa, no concluyas', 'usa el mapa como punto de partida para preguntas curiosas, nunca como etiqueta cerrada.'],
  ['Revisa el Año Personal en cada cumpleaños', 'para anticipar el tipo de acompañamiento que ese ciclo pedirá.'],
], y)
footer()

// ── SECCIÓN 12: Protocolo (página de cierre con acróstico) ──
doc.addPage()
y = sectionHeading(12, 'Protocolo de Acompañamiento Numero-Astral MAJHO', 30)
y = paragraph('El Protocolo MAJHO integra los saberes de este módulo en una práctica viva y adaptable a cualquier familia o comunidad educativa.', y)

const acrostic = [
  ['M', 'MAPA', 'Traza el mapa numero-astral del niño como punto de partida para conocerlo, nunca como un destino cerrado.'],
  ['A', 'ARQUETIPO', 'Reconoce el arquetipo de su número y su signo como una semilla de potencial, no como una etiqueta limitante.'],
  ['J', 'JUSTICIA', 'Honra el ritmo único de cada niño: cada número y signo florece a su propio tiempo, no al ritmo del grupo.'],
  ['H', 'HISTORIA', 'Lee la fecha de nacimiento como una historia cósmica que el niño trae a vivir, y celébrasela con curiosidad.'],
  ['O', 'OBSERVACIÓN', 'Observa cómo el niño expresa su número y su signo en el día a día, y ajusta tu acompañamiento en consecuencia.'],
]
acrostic.forEach(([letter, label, desc]) => {
  const boxH = 17
  doc.setFillColor(...GOLD)
  doc.rect(MARGIN, y, 14, boxH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...WHITE)
  doc.text(letter, MARGIN + 7, y + 11, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...PURPLE)
  doc.text(label, MARGIN + 18, y + 6)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...TEXT)
  const descLines = doc.splitTextToSize(desc, CONTENT_W - 22)
  doc.text(descLines, MARGIN + 18, y + 11)
  y += boxH + 3
})

y += 6
doc.setDrawColor(...PURPLE)
doc.line(MARGIN, y, PAGE_W - MARGIN, y)
y += 7
doc.setFont('helvetica', 'normal')
doc.setFontSize(9)
doc.setTextColor(...PURPLE)
doc.text('Has completado el Módulo 7 · Numerología y Astrología Infantil · Método MAJHO · Academia de Crianza Consciente & Espiritualidad Familiar', PAGE_W / 2, y, { align: 'center', maxWidth: CONTENT_W })
y += 14
quoteLine('"No le diste un nombre al nacer: leíste el que ya traía escrito en los números y en las estrellas."', y)

const outPath = path.join(__dirname, '..', 'public', 'pdfs', 'MAJHO_Modulo7_Numerologia_Astrologia.pdf')
doc.save(outPath)
console.log('PDF generado en:', outPath)

# Academia MAJHO ✦

> Curso premium de formación espiritual y científica para guías de niños de alta vibración.

## Descripción

Plataforma web de aprendizaje online que integra neurociencia infantil, psicología consciente, PNL, sabiduría ancestral y espiritualidad en 9 módulos transformadores. Al completar todos los módulos se genera un **certificado digital automático**.

## Funcionalidades

- 9 módulos con video, material PDF descargable y ejercicio práctico interactivo
- Sistema de progreso por módulo (módulos se desbloquean en orden)
- Certificado digital generado automáticamente (descargable en PDF)
- Comunidad privada con posts y sistema de likes
- Autenticación con persistencia en localStorage
- Diseño completamente responsivo

## Stack

- **React 19** + Vite 8
- **React Router v7** — navegación SPA
- **CSS Modules** — estilos encapsulados
- **html2canvas + jsPDF** — generación del certificado PDF
- **lucide-react** — iconografía
- **serve** — servidor estático para producción

## Desarrollo local

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build de producción

```bash
npm run build
npm run start   # sirve la carpeta dist en el puerto 3000
```

---

## Deploy en Railway

### Opción A — desde GitHub (recomendado)

1. Sube el repositorio a GitHub
2. Entra a [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Selecciona el repositorio `academia-majho-app`
4. Railway detecta automáticamente el `railway.json` y configura:
   - **Build:** `npm run build`
   - **Start:** `npm run start`
5. Haz clic en **Deploy** — listo en ~2 minutos

### Opción B — Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Variables de entorno en Railway

No se requieren variables obligatorias. Railway inyecta `PORT` automáticamente.

---

## Estructura del proyecto

```
src/
├── context/
│   └── AcademiaContext.jsx   # Estado global (progreso, usuario, comunidad)
├── data/
│   └── modules.js            # Definición de los 9 módulos
├── components/
│   ├── Navbar.jsx
│   └── Navbar.module.css
└── pages/
    ├── Landing.jsx            # Página de inicio pública
    ├── Login.jsx
    ├── Register.jsx
    ├── Dashboard.jsx          # Panel principal con progreso
    ├── ModulePage.jsx         # Video + PDF + Ejercicio
    ├── CertificatePage.jsx    # Certificado digital descargable
    └── CommunityPage.jsx      # Comunidad privada
```

## Paleta de colores

| Variable | Hex | Uso |
|---|---|---|
| Beige | `#F5EFE0` | Fondo principal |
| Verde | `#5C8A6E` | Acentos naturales |
| Dorado | `#C9A84C` | CTA y logros |
| Violeta | `#7B5EA7` | Color primario / marca |
| Rosado | `#F2C4CE` | Detalles suaves |

**Tipografía:** Cormorant Garamond (títulos) + Montserrat (cuerpo)

---

*Academia MAJHO © 2024 — Todos los derechos reservados*

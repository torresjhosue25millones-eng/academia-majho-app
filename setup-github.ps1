# setup-github.ps1
# Ejecuta este script desde PowerShell dentro de la carpeta academia-majho-app
# DESPUES de instalar Git y crear el repositorio en GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubRepo
)

Write-Host ""
Write-Host "=== Academia MAJHO — Configuracion Git ===" -ForegroundColor Magenta
Write-Host ""

# Verificar Git
try {
    $gitVersion = git --version
    Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git no esta instalado. Descargalo desde https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Inicializar repositorio
Write-Host ""
Write-Host "Inicializando repositorio..." -ForegroundColor Cyan
git init
git config user.email "torresjhosue25millones@gmail.com"
git config user.name "MAJHO"

# Agregar todos los archivos
Write-Host "Agregando archivos..." -ForegroundColor Cyan
git add .

# Primer commit
Write-Host "Creando primer commit..." -ForegroundColor Cyan
git commit -m "feat: Academia MAJHO inicial - 9 modulos, certificado digital, comunidad"

# Renombrar rama principal
git branch -M main

# Conectar con GitHub
Write-Host "Conectando con GitHub: $GitHubRepo" -ForegroundColor Cyan
git remote add origin $GitHubRepo

# Subir el codigo
Write-Host "Subiendo codigo a GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "=== LISTO! Codigo subido a GitHub ===" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos para Railway:" -ForegroundColor Yellow
Write-Host "  1. Ve a https://railway.app" -ForegroundColor White
Write-Host "  2. New Project -> Deploy from GitHub repo" -ForegroundColor White
Write-Host "  3. Selecciona: academia-majho-app" -ForegroundColor White
Write-Host "  4. Railway detecta railway.json automaticamente" -ForegroundColor White
Write-Host "  5. Haz clic en Deploy" -ForegroundColor White
Write-Host ""

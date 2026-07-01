<#
.SYNOPSIS
    Crea o sincroniza las labels del repositorio segun las plantillas .github/ISSUE_TEMPLATE.

.DESCRIPTION
    Lee las plantillas en .github/ISSUE_TEMPLATE/*.yml y asegura que cada label
    definida exista en el repositorio con un color y descripcion coherentes.

    Modos:
      - dry-run : solo muestra lo que haria (por defecto)
      - apply   : aplica los cambios con 'gh label create' (crea o actualiza)

.PARAMETER Mode
    'dry-run' (por defecto) o 'apply'.

.PARAMETER Repo
    Repositorio destino.

.EXAMPLE
    .\scripts\sync-labels.ps1
    .\scripts\sync-labels.ps1 -Mode apply
#>

[CmdletBinding()]
param(
    [ValidateSet('dry-run', 'apply')]
    [string]$Mode = 'dry-run',

    [string]$Repo = 'rogarces85/validador-deis-sso'
)

$ErrorActionPreference = 'Stop'

$labels = @(
    @{ name = 'bug';                color = 'd73a4a'; description = 'Algo no esta funcionando correctamente.' },
    @{ name = 'enhancement';        color = 'a2eeef'; description = 'Nueva funcionalidad o mejora.' },
    @{ name = 'documentation';      color = '0075ca'; description = 'Mejoras o adiciones a la documentacion.' },
    @{ name = 'refactor';           color = 'cfd3d7'; description = 'Cambio de codigo que no corrige bug ni agrega funcionalidad.' },
    @{ name = 'infrastructure';     color = '5319e7'; description = 'Cambios a infraestructura, build, CI.' },
    @{ name = 'testing';            color = 'fbca04'; description = 'Trabajo relacionado con pruebas y cobertura.' },
    @{ name = 'rule';               color = '0e8a16'; description = 'Nueva regla de validacion del motor.' },
    @{ name = 'serie-a';            color = '1d76db'; description = 'Aplica a la Serie A.' },
    @{ name = 'serie-p';            color = 'bfd4f2'; description = 'Aplica a la Serie P.' },
    @{ name = 'validador-rem';      color = 'c5def5'; description = 'Componente validador REM en general.' },
    @{ name = 'needs-triage';       color = 'ededed'; description = 'Requiere revision del equipo.' },
    @{ name = 'duplicate';          color = 'cfd3d7'; description = 'Este issue o PR duplica a otro existente.' },
    @{ name = 'wontfix';            color = 'ffffff'; description = 'No se corregira ni trabajara.' },
    @{ name = 'question';           color = 'd876e3'; description = 'Requiere mas informacion del autor.' }
)

function Write-Section {
    param([string]$Title)
    Write-Host ''
    Write-Host '============================================================' -ForegroundColor Cyan
    Write-Host " $Title" -ForegroundColor Cyan
    Write-Host '============================================================' -ForegroundColor Cyan
}

function Test-Gh {
    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $gh) {
        Write-Host '[X] gh no esta instalado.' -ForegroundColor Red
        return $false
    }
    try {
        $null = gh auth status 2>&1
        if ($LASTEXITCODE -ne 0) { return $false }
    }
    catch { return $false }
    return $true
}

Write-Section "Sync labels - Modo: $Mode - Repo: $Repo"
Write-Host ''
Write-Host "Labels a sincronizar: $($labels.Count)" -ForegroundColor Green

if ($Mode -eq 'apply') {
    if (-not (Test-Gh)) {
        Write-Host '[X] gh no disponible o sin autenticacion. No se aplica nada.' -ForegroundColor Red
        Write-Host '    Instala gh y ejecuta: gh auth login' -ForegroundColor Yellow
        exit 1
    }
}

foreach ($l in $labels) {
    $cmd = "gh label create --repo $Repo --color $($l.color) --description `"$($l.description)`" `"$($l.name)`" --force"
    if ($Mode -eq 'dry-run') {
        Write-Host "  [dry-run] $cmd" -ForegroundColor Gray
    }
    else {
        Write-Host "  -> Aplicando: $($l.name)" -ForegroundColor Cyan
        & gh label create --repo $Repo --color $l.color --description $l.description $l.name --force 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "    [!] Fallo: $($l.name)" -ForegroundColor Red
        }
    }
}

Write-Section 'Resumen'
Write-Host "  Modo    : $Mode"
Write-Host "  Labels  : $($labels.Count)"
if ($Mode -eq 'dry-run') {
    Write-Host ''
    Write-Host 'Para aplicar:' -ForegroundColor Yellow
    Write-Host '  .\scripts\sync-labels.ps1 -Mode apply' -ForegroundColor Yellow
}
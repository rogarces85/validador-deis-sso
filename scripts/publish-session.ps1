<#
.SYNOPSIS
    Crea los issues y Gist de la sesion OpenCode Serie P en GitHub.

.DESCRIPTION
    Script que automatiza la creacion de issues y un Gist a partir de los
    artefactos generados en docs/sesiones/.

    Si 'gh' no esta instalado, el script funciona en modo dry-run y muestra
    los comandos que deberias ejecutar manualmente.

.PARAMETER Mode
    'auto'   - Ejecuta los comandos con 'gh' (requiere autenticacion).
    'dry-run'- Solo muestra los comandos que se ejecutarian. Por defecto.
    'gist'   - Solo crea el Gist.
    'issues' - Solo crea los issues.

.PARAMETER Repo
    Repositorio destino. Por defecto: rogarces85/validador-deis-sso

.EXAMPLE
    .\scripts\publish-session.ps1
    .\scripts\publish-session.ps1 -Mode auto
    .\scripts\publish-session.ps1 -Mode issues
    .\scripts\publish-session.ps1 -Mode gist

.NOTES
    Autor: OpenCode / Serie P
    Fecha: 2026-06-26
#>

[CmdletBinding()]
param(
    [ValidateSet('auto', 'dry-run', 'gist', 'issues')]
    [string]$Mode = 'dry-run',

    [string]$Repo = 'rogarces85/validador-deis-sso',

    [string]$IssuesFile = 'docs/sesiones/github-issues-preparados.md',

    [string[]]$GistFiles = @(
        'docs/sesiones/gist-README.md',
        'docs/sesiones/gist-commits.md',
        'docs/sesiones/gist-resultados-pipeline.md'
    ),

    [string]$GistDescription = 'Resumen OpenCode - Serie P Validador REM (2026-06-26)'
)

$ErrorActionPreference = 'Stop'

function Write-Section {
    param([string]$Title)
    Write-Host ''
    Write-Host '============================================================' -ForegroundColor Cyan
    Write-Host " $Title" -ForegroundColor Cyan
    Write-Host '============================================================' -ForegroundColor Cyan
}

function Test-GhInstalled {
    $gh = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $gh) {
        Write-Host '[X] gh no esta instalado en este equipo.' -ForegroundColor Red
        Write-Host '    Descargalo desde: https://cli.github.com/' -ForegroundColor Yellow
        return $false
    }
    Write-Host "[OK] gh detectado en: $($gh.Source)" -ForegroundColor Green
    return $true
}

function Test-GhAuthenticated {
    try {
        $null = gh auth status 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host '[X] gh no esta autenticado. Ejecuta: gh auth login' -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host '[X] Error al verificar autenticacion de gh.' -ForegroundColor Red
        return $false
    }
    Write-Host '[OK] gh autenticado correctamente.' -ForegroundColor Green
    return $true
}

function Split-IssuesFile {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "No se encontro el archivo de issues: $Path"
    }

    $content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    $blocks = $content -split '(?m)^---$'

    $issues = @()
    foreach ($block in $blocks) {
        $titleMatch = [regex]::Match($block, '(?m)^##\s+Issue\s+(\d+):\s*(.+?)\s*$')
        if ($titleMatch.Success) {
            $num = $titleMatch.Groups[1].Value
            $title = $titleMatch.Groups[2].Value.Trim()

            $bodyMatch = [regex]::Match($block, '(?s)###\s+Descripci[oó]n\s*:\s*\r?\n(.*?)(?:\r?\n###\s+|\r?\n---|\z)')
            $body = if ($bodyMatch.Success) { $bodyMatch.Groups[1].Value.Trim() } else { '' }

            if (-not $body) {
                $bodyMatch2 = [regex]::Match($block, '(?s)\*\*Descripci[oó]n:\*\*\s*\r?\n(.*?)(?:\r?\n###\s+|\r?\n---|\z)')
                $body = if ($bodyMatch2.Success) { $bodyMatch2.Groups[1].Value.Trim() } else { '' }
            }

            if (-not $body) {
                $bodyMatch3 = [regex]::Match($block, '(?s)###\s+Objetivo\s*\r?\n(.*?)(?:\z)')
                $body = if ($bodyMatch3.Success) { "### Objetivo`n" + $bodyMatch3.Groups[1].Value.Trim() } else { '' }
            }

            $labelsMatch = [regex]::Match($block, '(?m)^\*\*Labels:\*\*\s*(.+?)$')
            $labels = if ($labelsMatch.Success) { $labelsMatch.Groups[1].Value.Trim() -split '\s*,\s*' } else { @() }

            $milestoneMatch = [regex]::Match($block, '(?m)^\*\*Milestone:\*\*\s*(.+?)$')
            $milestone = if ($milestoneMatch.Success) { $milestoneMatch.Groups[1].Value.Trim() } else { '' }

            $issues += [PSCustomObject]@{
                Number    = [int]$num
                Title     = $title
                Body      = $body
                Labels    = $labels
                Milestone = $milestone
            }
        }
    }
    return $issues
}

function Show-IssuePlan {
    param($Issue)
    Write-Host ''
    Write-Host "  Issue #$($Issue.Number): $($Issue.Title)" -ForegroundColor White
    if ($Issue.Labels.Count -gt 0) {
        Write-Host "    Labels    : $($Issue.Labels -join ', ')" -ForegroundColor DarkGray
    }
    if ($Issue.Milestone) {
        Write-Host "    Milestone : $($Issue.Milestone)" -ForegroundColor DarkGray
    }
    $preview = ($Issue.Body -split "`n")[0..2] -join ' '
    if ($preview.Length -gt 100) { $preview = $preview.Substring(0, 100) + '...' }
    Write-Host "    Preview   : $preview" -ForegroundColor DarkGray
}

function Invoke-IssuesAuto {
    param($Issues, [string]$Repo)

    $tmpDir = New-Item -ItemType Directory -Path (Join-Path $env:TEMP "gh-issues-$([guid]::NewGuid())") -Force
    try {
        foreach ($issue in $Issues) {
            $tmpFile = Join-Path $tmpDir.FullName "issue-$($issue.Number).md"
            $issue.Body | Out-File -FilePath $tmpFile -Encoding UTF8 -NoNewline

            $labelArgs = @()
            foreach ($l in $issue.Labels) {
                $labelArgs += '--label'
                $labelArgs += $l
            }

            Write-Host "  -> Creando issue: $($issue.Title)" -ForegroundColor Cyan
            $args = @(
                'issue', 'create',
                '--repo', $Repo,
                '--title', $issue.Title,
                '--body-file', $tmpFile
            ) + $labelArgs

            if ($issue.Milestone) {
                $args += '--milestone'
                $args += $issue.Milestone
            }

            & gh @args
            if ($LASTEXITCODE -ne 0) {
                Write-Host "  [!] Fallo al crear issue: $($issue.Title)" -ForegroundColor Red
            }
        }
    }
    finally {
        Remove-Item -LiteralPath $tmpDir.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
}

function Show-IssuesDryRun {
    param($Issues, [string]$Repo)

    Write-Host ''
    Write-Host '[Dry-run] Comandos que se ejecutarian:' -ForegroundColor Yellow
    foreach ($issue in $Issues) {
        $labelArgs = ''
        foreach ($l in $issue.Labels) {
            $labelArgs += " --label `"$l`""
        }
        $milestoneArg = ''
        if ($issue.Milestone) {
            $milestoneArg = " --milestone `"$($issue.Milestone)`""
        }
        Write-Host ''
        Write-Host "  gh issue create --repo $Repo --title `"$($issue.Title)`"$labelArgs$milestoneArg --body-file <cuerpo.md>" -ForegroundColor Gray
    }
}

function Show-GistPlan {
    param([string[]]$Files, [string]$Description)
    Write-Host ''
    Write-Host "  Descripcion: $Description" -ForegroundColor White
    foreach ($f in $Files) {
        if (Test-Path -LiteralPath $f) {
            $lines = (Get-Content -LiteralPath $f).Count
            Write-Host "    + $f ($lines lineas)" -ForegroundColor Green
        }
        else {
            Write-Host "    X $f (no existe)" -ForegroundColor Red
        }
    }
}

function Invoke-GistAuto {
    param([string[]]$Files, [string]$Description)

    $validFiles = @()
    foreach ($f in $Files) {
        if (Test-Path -LiteralPath $f) {
            $validFiles += $f
        }
        else {
            Write-Host "  [!] Archivo no encontrado, se omite: $f" -ForegroundColor Yellow
        }
    }

    if ($validFiles.Count -eq 0) {
        Write-Host '[X] No hay archivos validos para el Gist.' -ForegroundColor Red
        return
    }

    Write-Host "  -> Creando Gist con $($validFiles.Count) archivos..." -ForegroundColor Cyan
    & gh gist create --desc $Description @validFiles
    if ($LASTEXITCODE -ne 0) {
        Write-Host '  [!] Fallo al crear el Gist.' -ForegroundColor Red
    }
}

function Show-GistDryRun {
    param([string[]]$Files, [string]$Description)
    Write-Host ''
    Write-Host '[Dry-run] Comando que se ejecutaria:' -ForegroundColor Yellow
    $fileArgs = ($Files | ForEach-Object { "`"$_`"" }) -join ' '
    Write-Host "  gh gist create --desc `"$Description`" $fileArgs" -ForegroundColor Gray
}

# ============================================================
# FLUJO PRINCIPAL
# ============================================================

$root = (Get-Location).Path
Set-Location -LiteralPath (Split-Path $PSScriptRoot -Parent)

Write-Section "Publicacion de sesion OpenCode - Modo: $Mode"
Write-Host "  Repo destino : $Repo"
Write-Host "  Working dir  : $((Get-Location).Path)"

$ghAvailable = Test-GhInstalled
$ghAuth = $false
if ($ghAvailable -and $Mode -eq 'auto') {
    $ghAuth = Test-GhAuthenticated
}

$runIssues = $Mode -in @('auto', 'dry-run', 'issues')
$runGist = $Mode -in @('auto', 'dry-run', 'gist')

if ($runIssues) {
    Write-Section 'Issues a crear'
    $issues = Split-IssuesFile -Path $IssuesFile
    if ($issues.Count -eq 0) {
        Write-Host '[X] No se encontraron issues en el archivo.' -ForegroundColor Red
    }
    else {
        Write-Host "  Se detectaron $($issues.Count) issues." -ForegroundColor Green
        foreach ($issue in $issues) { Show-IssuePlan -Issue $issue }

        if ($Mode -eq 'auto' -and $ghAvailable -and $ghAuth) {
            Invoke-IssuesAuto -Issues $issues -Repo $Repo
        }
        else {
            Show-IssuesDryRun -Issues $issues -Repo $Repo
        }
    }
}

if ($runGist) {
    Write-Section 'Gist a crear'
    Show-GistPlan -Files $GistFiles -Description $GistDescription

    if ($Mode -eq 'auto' -and $ghAvailable -and $ghAuth) {
        Invoke-GistAuto -Files $GistFiles -Description $GistDescription
    }
    else {
        Show-GistDryRun -Files $GistFiles -Description $GistDescription
    }
}

Write-Section 'Resumen'
Write-Host "  Modo          : $Mode"
Write-Host "  gh instalado  : $(if($ghAvailable){'Si'}else{'No'})"
if ($Mode -eq 'auto') {
    Write-Host "  gh auth       : $(if($ghAuth){'Si'}else{'No'})"
}
Write-Host "  Issues        : $(if($runIssues){'Si'}else{'No'})"
Write-Host "  Gist          : $(if($runGist){'Si'}else{'No'})"
Write-Host ''
Write-Host 'Para ejecutar en modo real (requiere gh autenticado):' -ForegroundColor Yellow
Write-Host '  .\scripts\publish-session.ps1 -Mode auto' -ForegroundColor Yellow

Set-Location -LiteralPath $root
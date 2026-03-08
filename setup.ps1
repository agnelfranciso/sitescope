# SiteScope Setup (Premium Installer Logic)
# Run via INSTALL_SITESCOPE.bat for auto-elevation.

# Safe ASCII Header (No special characters that crash PS)
Write-Host "   _____ _ _         _____                      " -ForegroundColor Cyan
Write-Host "  / ___/(_) |_ ___  / ___/_________  ____  ___ " -ForegroundColor Cyan
Write-Host "  \__ \/ / __/ _ \ \__ \/ ___/ __ \/ __ \/ _ \" -ForegroundColor Cyan
Write-Host " ___/ / / /_/  __/ ___/ / /__/ /_/ / /_/ /  __/" -ForegroundColor Cyan
Write-Host "/____/_/\__/\___/ /____/\___/\____/ .___/\___/ " -ForegroundColor Cyan
Write-Host "                                 /_/            " -ForegroundColor Cyan
Write-Host "       >> S E E  C L E A R L Y  <<      " -ForegroundColor Gray
Write-Host "--------------------------------------------------"

$CurrentDir = Get-Location
$ProjectDir = Join-Path $CurrentDir "sitescope"

# 0. Version Compatibility Check
Write-Host "[0/4] Checking current installation..." -ForegroundColor Yellow
try {
    if (Test-Path "$ProjectDir\package.json") {
        $PackageJson = Get-Content "$ProjectDir\package.json" -Raw | ConvertFrom-Json
        $NewVersion = $PackageJson.version
        $IsInstalled = Get-Command sitescope -ErrorAction SilentlyContinue

        if ($IsInstalled) {
            $CurrentVersion = $(sitescope --version 2>$null).Trim()
            if ($CurrentVersion -eq $NewVersion) {
                Write-Host "   -> SiteScope v$CurrentVersion is already installed." -ForegroundColor Green
                $Choice = Read-Host "      Would you like to REINSTALL v$CurrentVersion? (y/N)"
                if ($Choice -ne "y") { exit 0 }
            }
            else {
                Write-Host "   -> NEW UPDATE AVAILABLE!" -ForegroundColor Cyan
                Write-Host "      Currently: v$CurrentVersion -> Update to: v$NewVersion" -ForegroundColor Green
                $Choice = Read-Host "`n      Would you like to install the NEW update? (Y/n)"
                if ($Choice -eq "n") { exit 0 }
            }
        }
    }
}
catch {
    Write-Host "   -> Fresh installation detected." -ForegroundColor Gray
}

# 1. Nav into project
Write-Host "`n[ STEP 1/4 ] Project Directory Validation" -ForegroundColor Yellow
if (Test-Path $ProjectDir) {
    Set-Location $ProjectDir
    Write-Host "[v] Project folder found: $ProjectDir" -ForegroundColor Green
}
else {
    Write-Host "[X] ERROR: Project folder 'sitescope' not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# 2. Dependency Management
Write-Host "`n[ STEP 2/4 ] Installing Core Packages..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] NPM Install Failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# 3. Browser Engine Installation
Write-Host "`n[ STEP 3/4 ] Installing Browser Engine..." -ForegroundColor Yellow
npx playwright install chromium --with-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Playwright Install Failed! Skipping browser engine setup." -ForegroundColor Red
}

# 4. Command Registration
Write-Host "`n[ STEP 4/4 ] Global Command Registration" -ForegroundColor Yellow
npm link
Write-Host "[v] Command 'sitescope' registered globally." -ForegroundColor Green

# 5. Success Screen
Write-Host "`n=======================================================" -ForegroundColor Green
Write-Host "      SITESCOPE - INSTALLED SUCCESSFULLY!      " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "                                                       "
Write-Host "   Type 'sitescope' anywhere to start a scan.          " -ForegroundColor Cyan
Write-Host "                                                       "
Write-Host " >> FEED SCREENSHOTS TO YOUR AI FOR VIBECODING <<      " -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Green
Read-Host "Setup complete. Press Enter to close"

@echo off
SETLOCAL EnableDelayedExpansion
title SiteScope Installer

:: Check for Administrator privileges
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo.
    echo [!] Requesting administrative privileges...
    goto :getAdmin
) else (
    goto :gotAdmin
)

:getAdmin
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%~dp0"
    cls

:: Simple Banner Check
echo.
echo ==================================================
echo         SiteScope One-Click Installation          
echo ==================================================
echo.

:: 1. Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    powershell -NoProfile -Command "Write-Host '[X] Node.js is NOT installed!' -ForegroundColor Red"
    echo Please install Node.js from https://nodejs.org/ before continuing.
    pause
    exit /b
)
powershell -NoProfile -Command "Write-Host '[v] Node.js detected' -ForegroundColor Green"

:: 2. Launch PowerShell Internal Setup
echo.
echo [!] Starting full setup in PowerShell...
echo.

:: Use short relative path and bypass profile to avoid crashes
powershell -NoProfile -ExecutionPolicy Bypass -File "./setup.ps1"

if %errorlevel% neq 0 (
    echo.
    powershell -NoProfile -Command "Write-Host '--------------------------------------------------' -ForegroundColor White"
    powershell -NoProfile -Command "Write-Host 'ERROR: Installation failed with code %errorlevel%.' -ForegroundColor Red"
    echo Check the output above. If it's a path error, try moving the folder to C:\
    echo.
    pause
    exit /b
)

echo Done.
exit /b

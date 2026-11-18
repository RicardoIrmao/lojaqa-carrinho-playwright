@echo off
title Playwright UI - ViaCEP API
cd /d "%~dp0"
echo ==========================================
echo PLAYWRIGHT TEST UI - VIACEP API
echo ==========================================
if not exist "package.json" (
  echo ERRO: este arquivo precisa ficar na pasta raiz do projeto LojaQA, junto do package.json.
  pause
  exit /b 1
)
if not exist "node_modules\@playwright" (
  echo Dependencias nao encontradas. Instalando...
  call npm install
  if errorlevel 1 goto erro
)
call npx playwright test tests/api/viacep.spec.ts --ui
goto fim
:erro
echo Falha ao instalar dependencias.
pause
exit /b 1
:fim
echo.
echo Playwright Test UI encerrado.
pause

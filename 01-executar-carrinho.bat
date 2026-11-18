@echo off
title Playwright UI - E2E Carrinho LojaQA
cd /d "%~dp0"
echo ==========================================
echo PLAYWRIGHT TEST UI - E2E CARRINHO LOJAQA
echo ==========================================
call :verificar
if errorlevel 1 exit /b 1
call npx playwright test tests/e2e/carrinho-lojaqa.spec.ts --ui
goto fim
:verificar
if not exist "package.json" (
  echo ERRO: este arquivo precisa ficar na pasta raiz do projeto LojaQA, junto do package.json.
  pause
  exit /b 1
)
if not exist "node_modules\@playwright" (
  echo Dependencias nao encontradas. Instalando...
  call npm install
  if errorlevel 1 (
    echo Falha ao instalar dependencias.
    pause
    exit /b 1
  )
)
exit /b 0
:fim
echo.
echo Playwright Test UI encerrado.
pause

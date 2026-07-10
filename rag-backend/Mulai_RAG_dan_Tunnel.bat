@echo off
TITLE RAG Backend + Tunnel (Arsitektur 1 - chatbot-uniska-mab)
COLOR 0A

echo ===============================================================================
echo   MEMULAI SERVER FASTAPI RAG & TUNNEL PUBLIK (ARSITEKTUR 1)
echo   Skripsi: Pelayanan Akademik UNISKA MAB (LLM Lokal Ollama Qwen 2.5)
echo ===============================================================================
echo.

echo [1/2] Menyalakan Server FastAPI RAG di Port 8001...
start "FastAPI RAG Server (Port 8001)" /MIN cmd /k "python -m uvicorn app:app --host 0.0.0.0 --port 8001"

timeout /t 3 /nobreak > nul

echo [2/2] Membuka Tunnel ke internet publik dengan nama KUSTOM yang rapi...
echo.
echo ===============================================================================
echo   Link URL RAG Anda adalah: https://chatbot-uniska-mab.loca.lt
echo   (Masukkan ke Railway: https://chatbot-uniska-mab.loca.lt/chat)
echo ===============================================================================
echo.

npx -y localtunnel --port 8001 --subdomain chatbot-uniska-mab
pause

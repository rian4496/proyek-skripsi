@echo off
TITLE RAG Backend + Tunnel (Arsitektur 1 - chatbot-uniska-mab)
COLOR 0A

echo ===============================================================================
echo   MEMULAI SERVER FASTAPI RAG & TUNNEL PUBLIK (ARSITEKTUR 1)
echo   Skripsi: Pelayanan Akademik UNISKA MAB (LLM Lokal Ollama Qwen 2.5)
echo ===============================================================================
echo.

echo [1/2] Menyalakan Server FastAPI RAG di Port 8001 (Auto-Restart Mode)...
start "FastAPI RAG Server (Port 8001)" cmd /c "cd /d "%~dp0" && _start_fastapi.bat"

timeout /t 3 /nobreak > nul

echo [2/2] Membuka Tunnel ke internet publik (Auto-Reconnect Mode)...
echo.
echo ===============================================================================
echo   Link URL RAG Anda adalah: https://chatbot-uniska-mab.loca.lt
echo   (Masukkan ke Railway: https://chatbot-uniska-mab.loca.lt/chat)
echo   PENTING: JANGAN TUTUP JENDELA INI SELAMA PENGUJIAN BERLANGSUNG!
echo   Jika koneksi internet sempat putus, script akan otomatis menghubungkan ulang.
echo ===============================================================================
echo.

:TUNNEL_LOOP
echo [%time%] Menghubungkan Tunnel ke https://chatbot-uniska-mab.loca.lt ...
npx -y localtunnel --port 8001 --subdomain chatbot-uniska-mab
echo [%time%] Tunnel terputus sementara. Menghubungkan ulang dalam 3 detik...
timeout /t 3 /nobreak > nul
goto TUNNEL_LOOP

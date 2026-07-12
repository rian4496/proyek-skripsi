@echo off
TITLE FastAPI RAG Server (Port 8001)
COLOR 0B
cd /d "%~dp0"

:LOOP
echo [%time%] Menyalakan Uvicorn Port 8001...
python -m uvicorn app:app --host 0.0.0.0 --port 8001
echo [%time%] Server terputus atau berhenti, restart otomatis dalam 3 detik...
timeout /t 3 /nobreak > nul
goto LOOP

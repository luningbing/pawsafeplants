taskkill /F /IM node.exe 2>nul || echo No node processes
timeout /t 3 /nobreak
cd /d E:\paws\pawsafeplants
start "PawSafePlants Dev Server" cmd /c "npm run dev"
echo Dev server started
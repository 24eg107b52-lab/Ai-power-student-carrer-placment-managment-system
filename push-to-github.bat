@echo off
set "PATH=%LOCALAPPDATA%\MinGit\cmd;%PATH%"
cd /d "%~dp0"

echo ======================================================================
echo   AI-POWERED STUDENT CAREER & PLACEMENT MANAGEMENT SYSTEM
echo   Pushing to GitHub: viveksambale/Ai-power-student-carrer-placment-managment-system
echo ======================================================================
echo.

git status
echo.
echo Pushing commits to GitHub main branch...
echo (If prompted, enter your GitHub Username and Personal Access Token or authenticate)
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ======================================================================
    echo   [SUCCESS] Code pushed to GitHub successfully!
    echo   Render and Vercel will now automatically trigger their builds.
    echo ======================================================================
) else (
    echo ======================================================================
    echo   [INFO] Push failed or authentication was cancelled.
    echo ======================================================================
)

pause

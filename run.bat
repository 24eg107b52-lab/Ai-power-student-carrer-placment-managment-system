@echo off
title AI-Powered Student Career & Placement Management System
echo =========================================================================
echo    AI-Powered Student Career & Placement Management System
echo    Department of Computer Science & Engineering
echo =========================================================================
echo.
echo Starting Spring Boot Application on http://localhost:8080 ...
echo.

if exist "target\ai-placement-system-1.0.0.jar" (
    java -jar target\ai-placement-system-1.0.0.jar
) else (
    mvn spring-boot:run
)

pause

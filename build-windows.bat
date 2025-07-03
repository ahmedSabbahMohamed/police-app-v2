@echo off
echo Building Police App for Windows...
echo.

echo Step 1: Installing dependencies...
npm install

echo.
echo Step 2: Building Next.js application...
npm run build

echo.
echo Step 3: Building Windows executable...
npm run electron:dist-win

echo.
echo Build completed! Check the dist/ folder for the executable.
pause 
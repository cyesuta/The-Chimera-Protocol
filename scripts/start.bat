@echo off
chcp 65001 > nul
title The Chimera Protocol 控制面板服務器

echo =====================================
echo    🔥 THE CHIMERA PROTOCOL 服務器啟動     
echo =====================================
echo.

REM 檢查 Python 是否安裝
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 錯誤: 未找到 Python
    echo 💡 請先安裝 Python 3.x
    echo 🔗 下載地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM 檢查是否在正確目錄
if not exist "index.html" (
    echo ❌ 錯誤: 找不到 index.html
    echo 💡 請在 The Chimera Protocol 項目目錄中運行此腳本
    pause
    exit /b 1
)

echo ✅ Python 檢查通過
echo 🚀 正在啟動服務器...
echo.

REM 啟動 Python 服務器
python scripts/server.py

echo.
echo 👋 服務器已停止
pause
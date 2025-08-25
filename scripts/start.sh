#!/bin/bash

# The Chimera Protocol 控制面板服務器啟動腳本 (Linux/Mac)

echo "====================================="
echo "   🔥 THE CHIMERA PROTOCOL 服務器啟動     "
echo "====================================="
echo

# 檢查 Python 是否安裝
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ 錯誤: 未找到 Python"
        echo "💡 請先安裝 Python 3.x"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# 檢查是否在正確目錄
if [ ! -f "index.html" ]; then
    echo "❌ 錯誤: 找不到 index.html"
    echo "💡 請在 The Chimera Protocol 項目目錄中運行此腳本"
    exit 1
fi

echo "✅ Python 檢查通過"
echo "🚀 正在啟動服務器..."
echo

# 啟動 Python 服務器
$PYTHON_CMD scripts/server.py

echo
echo "👋 服務器已停止"
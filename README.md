# The Chimera Protocol Personal Control Panel | 奇美拉個人儀表板

A modular personal control panel system for managing various resources and services.
模組化個人控制面板系統，用於管理各種資源和服務。

## 🚀 Features | 功能特色

- 🌐 **Domain Management** - Monitor domain expiration and registrar information  
  **域名管理** - 域名到期監控、註冊商管理
- 🌍 **Website Management** - Track personal websites and hosting providers  
  **網站管理** - 個人網站資訊、託管商監控
- ⚙️ **Hardware Monitoring** - Computer hardware inventory and maintenance records  
  **硬體監控** - 電腦硬體清單、維護記錄
- 💾 **Backup Management** - Backup strategies and disaster recovery plans  
  **備份管理** - 備份策略、災難恢復計畫
- 📡 **Network Services** - Network configuration and service listings  
  **網路服務** - 網路設定、服務清單
- 📁 **File Management** - Disk management and file classification systems  
  **檔案管理** - 磁碟管理、檔案分類系統

## 🧩 Modular Design | 模組化設計

The system uses a modular architecture where modules are displayed only when their corresponding data files exist in the `computer-data-structure/` directory:  
系統採用模組化設計，只有在 `computer-data-structure/` 目錄中存在對應檔案的模塊才會顯示：

- `domains.json` → Enables Domain Management module | 啟用域名管理模組
- `websites-servers.json` → Enables Website Management module | 啟用網站管理模組
- `computer-hardware.json` → Enables Hardware Monitoring module | 啟用硬體監控模組
- `backup-management.md` → Enables Backup Management module | 啟用備份管理模組
- `network-services.md` → Enables Network Services module | 啟用網路服務模組
- `file-management.md` → Enables File Management module | 啟用檔案管理模組

## 📁 Project Structure | 專案結構

```
The-Chimera-Protocol/
├── README.md                    # Project documentation | 專案說明文件
├── index.html                   # Main interface | 主頁面
├── styles.css                   # Stylesheet | 樣式文件
├── script.js                    # Frontend JavaScript | 前端腳本
├── scripts/                     # Server startup files | 伺服器啟動相關
│   ├── server.py                # Python server | Python 伺服器
│   ├── start.bat                # Windows startup script | Windows 啟動腳本
│   └── start.sh                 # Linux/Mac startup script | Linux/Mac 啟動腳本
└── computer-data-structure/     # Modular configuration data | 模組化配置資料
    ├── domains.json             # Domain management data | 域名管理數據
    ├── websites-servers.json    # Websites and servers data | 網站與伺服器數據
    ├── computer-hardware.json   # Computer hardware inventory | 電腦硬件清單
    ├── backup-management.md     # Backup management records | 備份管理記錄
    ├── network-services.md      # Network services records | 網路服務記錄
    └── file-management.md       # File management records | 檔案管理記錄
```

## 🛠️ Quick Start | 快速開始

### Prerequisites | 系統需求

- Python 3.x installed on your system | 系統需安裝 Python 3.x

### Installation & Usage | 安裝與使用

1. **Clone the repository | 複製儲存庫**

   ```bash
   git clone https://github.com/cyesuta/The-Chimera-Protocol.git
   cd The-Chimera-Protocol
   ```
2. **Start the server | 啟動伺服器**

   - **Windows**: Double-click `scripts/start.bat` or run `python scripts/server.py`  
     **Windows**: 雙擊 `scripts/start.bat` 或執行 `python scripts/server.py`
   - **Linux/Mac**: Run `./scripts/start.sh` or run `python scripts/server.py`  
     **Linux/Mac**: 執行 `./scripts/start.sh` 或執行 `python scripts/server.py`
3. **Access the control panel | 進入控制面板**

   - The browser will automatically open to `http://localhost:8008`瀏覽器會自動開啟並導向 `http://localhost:8008`
   - Or manually navigate to the URL in your browser
     或手動在瀏覽器中輸入此網址

### Module Configuration | 模組配置

To enable modules, place the corresponding data files in the `computer-data-structure/` directory:將所需的資料文件放入 `computer-data-structure/` 目錄以啟用模組：

- The system automatically detects file presence and enables corresponding modules系統會自動檢測文件存在並啟用對應模組
- Reload the page to see newly added modules
  重新載入頁面即可看到新增的模組

## 🎨 Interface | 介面特色

- **Dark cyberpunk theme** with Matrix-style rain background**深色賽博龐克主題** 配上駭客帝國風格的雨滴背景
- **Responsive design** that works on desktop and mobile devices**響應式設計** 支援桌面和行動裝置
- **Smooth animations** powered by GSAP**流暢動畫** 由 GSAP 驅動
- **Modular navigation** that adapts to available data
  **模組化導航** 根據可用資料自動調整

## 🔧 Technical Details | 技術規格

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), GSAP animations**前端技術**: HTML5, CSS3, JavaScript (ES6+), GSAP 動畫
- **Backend**: Python HTTP server with custom request handlers**後端技術**: Python HTTP 伺服器配合自訂請求處理器
- **Architecture**: Modular design with file-based module detection**架構設計**: 基於檔案檢測的模組化設計
- **Port**: Default 8008 (configurable via command line)
  **連接埠**: 預設 8008 (可透過命令列參數配置)

## 📝 Data Files Format | 資料檔案格式

The system supports both JSON and Markdown data files:系統支援 JSON 和 Markdown 兩種資料檔案格式：

- **JSON files**: For structured data (domains, websites, hardware)**JSON 檔案**: 用於結構化資料 (域名、網站、硬體)
- **Markdown files**: For documentation and records (backup, network, files)
  **Markdown 檔案**: 用於文檔和記錄 (備份、網路、檔案)

## 🚦 Development | 開發說明

The project uses a simple Python HTTP server for local development. All static files are served directly, with API endpoints for dynamic module loading.
專案使用簡單的 Python HTTP 伺服器進行本地開發。所有靜態檔案直接提供服務，並透過 API 端點實現動態模組載入。

### API Endpoints | API 端點

- `/api/status` - Server status information | 伺服器狀態資訊
- `/api/modules` - Available modules detection | 可用模組檢測
- `/api/domains` - Domain management data | 域名管理資料
- `/api/websites` - Website management data | 網站管理資料
- `/api/hardware` - Computer hardware inventory | 電腦硬體清單
- `/api/backup` - Backup management records | 備份管理記錄
- `/api/network` - Network services records | 網路服務記錄
- `/api/files` - File management records | 檔案管理記錄

## 📄 License | 授權條款

This project is intended for personal use. Feel free to fork and modify for your own needs.
此專案主要供個人使用。歡迎 fork 並根據您的需求進行修改。

## 🤝 Contributing | 貢獻

This is a personal control panel project, but suggestions and improvements are welcome through issues and pull requests.
這是個人控制面板專案，但歡迎透過 issues 和 pull requests 提供建議和改進。

---

**The Chimera Protocol** - A modular approach to personal resource management.
**奇美拉協議** - 模組化個人資源管理方案。

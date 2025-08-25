// ========== GLOBAL VARIABLES ==========
let domains = [];
let filteredDomains = [];
let websites = [];
let filteredWebsites = [];
let lastUpdateTime = null;
let websiteLastUpdateTime = null;
let availableModules = {};

// ========== UTILITY FUNCTIONS ==========
function calculateDaysUntilExpiry(expirationDate) {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// ========== DATA LOADING FUNCTIONS ==========
async function loadDomainData() {
    try {
        console.log('Loading domain data from API...');
        const response = await fetch('/api/domains');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('Raw domain data loaded:', rawData);
        
        // Process the domain data
        domains = rawData.map(domain => {
            const daysUntilExpiry = calculateDaysUntilExpiry(domain.expirationDate);
            const status = daysUntilExpiry <= 90 ? 'expiring' : 'active';
            
            return {
                domain: domain.domain,
                registrar: domain.registrar,
                registrarAccount: domain.registrarAccount,
                expirationDate: domain.expirationDate,
                autoRenew: domain.autoRenew,
                estimatedValue: domain.estimatedValue,
                cost: domain.cost ? (typeof domain.cost.annual === 'number' ? `$${domain.cost.annual}/year` : 'Free') : null,
                transferLock: domain.transferLock,
                status: status,
                daysUntilExpiry: daysUntilExpiry,
                autoRenewDate: domain.autoRenewDate
            };
        });
        
        console.log('Processed domain data:', domains);
        lastUpdateTime = new Date();
        
        return domains;
    } catch (error) {
        console.error('Error loading domain data:', error);
        // 如果 API 失敗，使用備用資料
        return loadFallbackData();
    }
}

// ========== WEBSITE DATA LOADING ==========
async function loadWebsiteData() {
    try {
        console.log('Loading website data from API...');
        const response = await fetch('/api/websites');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('Raw website data loaded:', rawData);
        
        // Process the website data
        websites = rawData.map(website => {
            return {
                name: website.name,
                domain: website.domain,
                status: website.status,
                hostingProvider: website.hostingProvider,
                hostingAccount: website.hostingAccount,
                hostingPlan: website.hostingPlan,
                server: website.server,
                parentDomain: website.parentDomain,
                traffic: website.traffic || 0,
                trafficPercentage: website.trafficPercentage,
                phpVersion: website.phpVersion,
                emailAccounts: website.emailAccounts || 0,
                purpose: website.purpose,
                techStack: website.techStack,
                sslStatus: website.sslStatus,
                addons: website.addons || [],
                notes: website.notes,
                domainExpiry: website.domainExpiry,
                autoRenew: website.autoRenew
            };
        });
        
        console.log('Processed website data:', websites);
        websiteLastUpdateTime = new Date();
        
        return websites;
    } catch (error) {
        console.error('Error loading website data:', error);
        return [];
    }
}

async function refreshWebsiteData() {
    console.log('Refreshing website data...');
    showRefreshAnimation('refresh-websites-btn');
    
    try {
        await loadWebsiteData();
        updateWebsiteGrid();
        updateWebsiteStats();
        updateWebsiteLastUpdateTime();
        console.log('Website data refreshed successfully');
    } catch (error) {
        console.error('Error refreshing website data:', error);
    } finally {
        hideRefreshAnimation('refresh-websites-btn');
    }
}

function loadFallbackData() {
    console.log('Using fallback domain data...');
    // 備用資料 (簡化版)
    return [
        {
            domain: "cyesuta.com",
            registrar: "GoDaddy",
            registrarAccount: "Customer #24918959",
            expirationDate: "2026-02-28",
            autoRenew: true,
            estimatedValue: "$1,768",
            status: "active",
            daysUntilExpiry: calculateDaysUntilExpiry("2026-02-28")
        },
        {
            domain: "cyesuta.org",
            registrar: "DreamHost",
            registrarAccount: "ID#284880 cyesuta",
            expirationDate: "2026-03-02",
            autoRenew: true,
            cost: "$19.99/year",
            transferLock: true,
            status: "active",
            daysUntilExpiry: calculateDaysUntilExpiry("2026-03-02")
        }
    ];
}

async function refreshDomainData() {
    console.log('Refreshing domain data...');
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = '正在更新數據...';
    }
    
    await loadDomainData();
    updateDomainStats();
    renderDomainGrid();
    
    console.log('Domain data refreshed successfully');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('datetime').textContent = dateTimeString;
}

// ========== MATRIX RAIN EFFECT ==========
function initMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff0040';
        ctx.font = fontSize + 'px courier';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========== LOADING SCREEN ==========
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    const mainContainer = document.getElementById('main-container');
    
    const loadingSteps = [
        "正在初始化系統...",
        "載入域名數據...",
        "建立安全連接...",
        "驗證用戶權限...",
        "啟動監控模組...",
        "系統準備完成..."
    ];
    
    let currentStep = 0;
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
            progress = 100;
            loadingProgress.style.width = progress + '%';
            loadingText.textContent = loadingSteps[loadingSteps.length - 1];
            
            setTimeout(() => {
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loadingScreen.style.display = 'none';
                        mainContainer.classList.remove('hidden');
                        
                        // Animate main container
                        gsap.fromTo(mainContainer, 
                            { opacity: 0, y: 50 },
                            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
                        );
                    }
                });
            }, 500);
            
            clearInterval(loadingInterval);
        } else {
            loadingProgress.style.width = progress + '%';
            
            const stepIndex = Math.floor((progress / 100) * loadingSteps.length);
            if (stepIndex !== currentStep && stepIndex < loadingSteps.length) {
                currentStep = stepIndex;
                loadingText.textContent = loadingSteps[currentStep];
            }
        }
    }, 200);
}

// ========== MODULE LOADING ==========
async function loadAvailableModules() {
    try {
        console.log('Loading available modules...');
        const response = await fetch('/api/modules');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        availableModules = await response.json();
        console.log('Available modules:', availableModules);
        
        updateNavigation();
        return availableModules;
    } catch (error) {
        console.error('Error loading modules:', error);
        return {};
    }
}

function updateNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const panelType = item.getAttribute('data-panel');
        const module = availableModules[panelType];
        
        if (module && !module.available) {
            // 隱藏不可用的模塊
            item.style.display = 'none';
        } else {
            // 顯示可用的模塊
            item.style.display = 'flex';
        }
    });
    
    // 找到第一個可用的模塊並設為活躍
    const firstAvailableItem = Array.from(navItems).find(item => {
        const panelType = item.getAttribute('data-panel');
        const module = availableModules[panelType];
        return item.style.display !== 'none' && (module ? module.available : true);
    });
    
    if (firstAvailableItem) {
        // 移除所有活躍狀態
        navItems.forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
        
        // 設置第一個可用項目為活躍
        firstAvailableItem.classList.add('active');
        const targetPanel = firstAvailableItem.getAttribute('data-panel');
        document.getElementById(targetPanel + '-panel').classList.add('active');
    }
}

// ========== NAVIGATION ==========
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const panels = document.querySelectorAll('.panel');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPanel = item.getAttribute('data-panel');
            
            // 檢查模塊是否可用
            const module = availableModules[targetPanel];
            if (module && !module.available) {
                console.warn(`Module ${targetPanel} is not available`);
                return;
            }
            
            // Remove active class from all nav items and panels
            navItems.forEach(nav => nav.classList.remove('active'));
            panels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding panel
            item.classList.add('active');
            document.getElementById(targetPanel + '-panel').classList.add('active');
            
            // Load data based on panel type
            loadPanelData(targetPanel);
            
            // Animate panel transition
            gsap.fromTo(`#${targetPanel}-panel`, 
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
            );
        });
    });
}

function loadPanelData(panelType) {
    switch(panelType) {
        case 'websites':
            if (websites.length === 0) {
                loadWebsiteData().then(() => {
                    updateWebsiteStats();
                    updateWebsiteGrid();
                    updateWebsiteLastUpdateTime();
                });
            }
            break;
        case 'hardware':
            loadHardwareData();
            break;
        case 'backup':
            loadBackupData();
            break;
        case 'network':
            loadNetworkData();
            break;
        case 'security':
            loadSecurityData();
            break;
    }
}

// ========== 新模塊數據加載函數 ==========
async function loadHardwareData() {
    // 實現硬件數據加載邏輯
    console.log('Loading hardware data...');
}

async function loadBackupData() {
    // 實現備份數據加載邏輯
    console.log('Loading backup data...');
}

async function loadNetworkData() {
    // 實現網路數據加載邏輯
    console.log('Loading network data...');
}

async function loadSecurityData() {
    // 實現安全數據加載邏輯
    console.log('Loading security data...');
}

// ========== DOMAIN MANAGEMENT ==========
function updateDomainStats() {
    const totalDomains = domains.length;
    const expiringDomains = domains.filter(d => d.status === 'expiring').length;
    const autoRenewDomains = domains.filter(d => d.autoRenew).length;
    
    document.getElementById('total-domains').textContent = totalDomains;
    document.getElementById('expiring-domains').textContent = expiringDomains;
    document.getElementById('auto-renew-domains').textContent = autoRenewDomains;
    
    // Animate stat numbers
    gsap.fromTo('.stat-value', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }
    );
}

// ========== WEBSITE STATS & RENDERING ==========
function updateWebsiteStats() {
    const totalWebsites = websites.length;
    const activeWebsites = websites.filter(w => w.status === 'active').length;
    const highTrafficSites = websites.filter(w => w.traffic > 1000).length;
    
    document.getElementById('total-websites').textContent = totalWebsites;
    document.getElementById('active-websites').textContent = activeWebsites;
    document.getElementById('high-traffic-sites').textContent = highTrafficSites;
    
    // Animate stat numbers
    gsap.fromTo('.stat-value', 
        { scale: 1.2, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.3, stagger: 0.1 }
    );
}

function createWebsiteCard(website) {
    const hostingProviderClass = website.hostingProvider.toLowerCase()
        .replace('dreamhost', 'dreamhost')
        .replace('お名前.com', 'onamae')
        .replace('xserver', 'xserver')
        .replace('ムームードメイン', 'muu-muu');

    const trafficClass = website.traffic > 10000 ? 'traffic-high' : 
                         website.traffic > 1000 ? 'traffic-medium' : 'traffic-low';
    
    const statusClass = `status-${website.status.replace('_', '-')}`;
    
    const parentDomainText = website.parentDomain ? 
        `<div class="website-row"><span class="website-label">父域名:</span><span class="website-value">${website.parentDomain}</span></div>` : '';

    return `
        <div class="website-card" data-website='${JSON.stringify(website)}'>
            <div class="website-header">
                <div>
                    <div class="website-name">${website.name}</div>
                    <div class="website-domain">${website.domain}</div>
                </div>
                <div class="website-status ${statusClass}">${getStatusText(website.status)}</div>
            </div>
            
            <div class="website-info">
                <div class="website-row">
                    <span class="website-label">託管商:</span>
                    <span class="website-value">
                        <span class="hosting-badge ${hostingProviderClass}">${getHostingShort(website.hostingProvider)}</span>
                    </span>
                </div>
                ${parentDomainText}
                <div class="website-row">
                    <span class="website-label">流量:</span>
                    <span class="website-value">
                        <div class="traffic-indicator">
                            <span>${website.traffic.toLocaleString()}</span>
                            <div class="traffic-bar">
                                <div class="traffic-fill ${trafficClass}"></div>
                            </div>
                        </div>
                    </span>
                </div>
                <div class="website-row">
                    <span class="website-label">PHP:</span>
                    <span class="website-value">
                        <span class="php-version">${website.phpVersion || 'N/A'}</span>
                    </span>
                </div>
                <div class="website-row">
                    <span class="website-label">Email:</span>
                    <span class="website-value">
                        <span class="email-count">${website.emailAccounts}</span>
                    </span>
                </div>
            </div>
        </div>
    `;
}

function getStatusText(status) {
    const statusMap = {
        'active': '活躍',
        'dns-only': 'DNS',
        'transfer-needed': '需轉移',
        'domain-needed': '需域名'
    };
    return statusMap[status] || status.toUpperCase();
}

function getHostingShort(provider) {
    const providerMap = {
        'DreamHost': 'DH',
        'お名前.com': 'お名前',
        'Xserver': 'XS',
        'ムームードメイン': 'ムームー'
    };
    return providerMap[provider] || provider.substring(0, 3);
}

function updateWebsiteGrid() {
    const websiteGrid = document.getElementById('website-grid');
    if (!websiteGrid) return;
    
    filteredWebsites = [...websites];
    
    if (filteredWebsites.length === 0) {
        websiteGrid.innerHTML = '<div class="no-results">沒有找到網站資料</div>';
        return;
    }
    
    const websiteCards = filteredWebsites.map(website => createWebsiteCard(website)).join('');
    websiteGrid.innerHTML = websiteCards;
    
    // Add click event listeners to website cards
    const cards = websiteGrid.querySelectorAll('.website-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const websiteData = JSON.parse(card.getAttribute('data-website'));
            showWebsiteModal(websiteData);
        });
    });
    
    // Animate website cards
    gsap.fromTo('.website-card', 
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05 }
    );
}

function updateWebsiteLastUpdateTime() {
    if (websiteLastUpdateTime) {
        document.getElementById('websites-last-update').textContent = 
            `最後更新: ${websiteLastUpdateTime.toLocaleString('zh-TW')}`;
    }
}

function createDomainCard(domain) {
    const card = document.createElement('div');
    card.className = `domain-card ${domain.status}`;
    card.setAttribute('data-domain', domain.domain);
    
    // 判斷是否為代管域名 (autoRenew 開啟表示有代管服務)
    const isManagedDomain = domain.autoRenew;
    const managedIcon = isManagedDomain ? 
        '<span class="managed-icon" title="代管服務">🛡️</span>' : 
        '<span class="unmanaged-icon" title="未代管">⚪</span>';
    
    // 狀態顯示
    const statusText = domain.status === 'expiring' ? 
        `⚠️ ${domain.daysUntilExpiry}天後到期` : 
        `${domain.daysUntilExpiry}天後到期`;
    
    // 註冊商簡化顯示
    const registrarShort = domain.registrar === 'GoDaddy' ? 'GD' : 
                          domain.registrar === 'DreamHost' ? 'DH' : 
                          domain.registrar === 'お名前.com' ? 'お名前' :
                          domain.registrar === 'Zenlogic' ? 'ZL' :
                          domain.registrar === 'ムームードメイン' ? 'ムームー' :
                          domain.registrar.substring(0, 2);
    
    card.innerHTML = `
        <div class="domain-card-header">
            <div class="domain-name">${domain.domain}</div>
            <div class="domain-managed">${managedIcon}</div>
        </div>
        <div class="domain-card-body">
            <div class="domain-status ${domain.status}">
                <span class="status-text">${statusText}</span>
            </div>
            <div class="domain-meta">
                <div class="domain-expiry">
                    <span class="meta-label">到期</span>
                    <span class="meta-value">${formatDate(domain.expirationDate)}</span>
                </div>
                <div class="domain-registrar">
                    <span class="registrar-badge" title="${domain.registrar}">${registrarShort}</span>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showDomainDetails(domain));
    
    return card;
}

function renderDomainGrid(domainsToRender = domains) {
    const grid = document.getElementById('domain-grid');
    grid.innerHTML = '';
    
    domainsToRender.forEach((domain, index) => {
        const card = createDomainCard(domain);
        grid.appendChild(card);
        
        // Animate card entrance
        gsap.fromTo(card, 
            { opacity: 0, y: 30, scale: 0.8 },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "back.out(1.7)" 
            }
        );
    });
}

function showDomainDetails(domain) {
    const modal = document.getElementById('domain-modal');
    const modalTitle = document.getElementById('modal-domain-name');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = domain.domain;
    
    modalBody.innerHTML = `
        <div class="domain-detail-grid">
            <div class="detail-section">
                <h4>基本資訊</h4>
                <div class="detail-item">
                    <span class="detail-label">域名:</span>
                    <span class="detail-value">${domain.domain}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">註冊商:</span>
                    <span class="detail-value">${domain.registrar}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">賬號:</span>
                    <span class="detail-value">${domain.registrarAccount}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">到期日期:</span>
                    <span class="detail-value">${formatDate(domain.expirationDate)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">剩餘天數:</span>
                    <span class="detail-value ${domain.status === 'expiring' ? 'warning' : ''}">${domain.daysUntilExpiry} 天</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>設定狀態</h4>
                <div class="detail-item">
                    <span class="detail-label">自動續約:</span>
                    <span class="detail-value ${domain.autoRenew ? 'success' : 'warning'}">${domain.autoRenew ? '已啟用' : '未啟用'}</span>
                </div>
                ${domain.transferLock ? `
                <div class="detail-item">
                    <span class="detail-label">傳輸鎖定:</span>
                    <span class="detail-value success">已啟用</span>
                </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">狀態:</span>
                    <span class="detail-value ${domain.status === 'expiring' ? 'warning' : 'success'}">${domain.status === 'expiring' ? '即將到期' : '正常'}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>費用資訊</h4>
                ${domain.estimatedValue ? `
                <div class="detail-item">
                    <span class="detail-label">預估價值:</span>
                    <span class="detail-value">${domain.estimatedValue}</span>
                </div>
                ` : ''}
                ${domain.cost ? `
                <div class="detail-item">
                    <span class="detail-label">年費:</span>
                    <span class="detail-value">${domain.cost}</span>
                </div>
                ` : ''}
            </div>
        </div>
        
        <style>
            .domain-detail-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .detail-section h4 {
                color: var(--primary-red);
                font-size: 1.1em;
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 1px solid var(--border-color);
                text-shadow: 0 0 5px var(--neon-red);
            }
            
            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--dark-gray);
            }
            
            .detail-item:last-child {
                border-bottom: none;
            }
            
            .detail-label {
                color: var(--text-gray);
                font-size: 13px;
            }
            
            .detail-value {
                color: var(--text-white);
                font-family: 'Courier New', monospace;
                font-size: 13px;
            }
            
            .detail-value.warning {
                color: var(--warning-orange);
                text-shadow: 0 0 5px var(--warning-orange);
            }
            
            .detail-value.success {
                color: var(--neon-green);
                text-shadow: 0 0 5px var(--neon-green);
            }
        </style>
    `;
    
    modal.style.display = 'block';
    
    // Animate modal
    gsap.fromTo('.modal-content', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
}

function initDomainFilters() {
    const registrarFilter = document.getElementById('registrar-filter');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('domain-search');
    
    function filterDomains() {
        let filtered = domains;
        
        // Filter by registrar
        if (registrarFilter.value !== 'all') {
            filtered = filtered.filter(d => d.registrar === registrarFilter.value);
        }
        
        // Filter by status
        if (statusFilter.value !== 'all') {
            filtered = filtered.filter(d => d.status === statusFilter.value);
        }
        
        // Filter by search term
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(d => 
                d.domain.toLowerCase().includes(searchTerm)
            );
        }
        
        renderDomainGrid(filtered);
    }
    
    registrarFilter.addEventListener('change', filterDomains);
    statusFilter.addEventListener('change', filterDomains);
    searchInput.addEventListener('input', filterDomains);
}

// ========== MODAL ==========
function initModal() {
    const domainModal = document.getElementById('domain-modal');
    const websiteModal = document.getElementById('website-modal');
    const domainCloseBtn = document.querySelector('.modal-close');
    const websiteCloseBtn = document.querySelector('.website-modal-close');
    
    // Domain modal close
    if (domainCloseBtn) {
        domainCloseBtn.addEventListener('click', () => {
            gsap.to('#domain-modal .modal-content', {
                scale: 0.8,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    domainModal.style.display = 'none';
                }
            });
        });
    }
    
    // Website modal close
    if (websiteCloseBtn) {
        websiteCloseBtn.addEventListener('click', () => {
            gsap.to('#website-modal .modal-content', {
                scale: 0.8,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    websiteModal.style.display = 'none';
                }
            });
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === domainModal) {
            gsap.to('#domain-modal .modal-content', {
                scale: 0.8,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    domainModal.style.display = 'none';
                }
            });
        }
        if (e.target === websiteModal) {
            gsap.to('#website-modal .modal-content', {
                scale: 0.8,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    websiteModal.style.display = 'none';
                }
            });
        }
    });
}

// ========== WEBSITE MODAL ==========
function showWebsiteModal(website) {
    const modal = document.getElementById('website-modal');
    const modalName = document.getElementById('modal-website-name');
    const modalBody = document.getElementById('website-modal-body');
    
    modalName.textContent = website.name;
    
    const addonsHtml = website.addons && website.addons.length > 0 ? 
        `<p><strong>附加服務:</strong> ${website.addons.join(', ')}</p>` : '';
    
    const techStackHtml = website.techStack ? 
        `<div class="tech-stack">
            <p><strong>技術棧:</strong></p>
            <ul>
                ${website.techStack.frontend ? `<li>前端: ${website.techStack.frontend}</li>` : ''}
                ${website.techStack.backend ? `<li>後端: ${website.techStack.backend}</li>` : ''}
                ${website.techStack.database ? `<li>資料庫: ${website.techStack.database}</li>` : ''}
                ${website.techStack.cms ? `<li>CMS: ${website.techStack.cms}</li>` : ''}
            </ul>
        </div>` : '';

    const expiryInfo = website.domainExpiry ? 
        `<p><strong>域名到期:</strong> ${website.domainExpiry} ${website.autoRenew ? '(自動續約)' : ''}</p>` : '';
    
    modalBody.innerHTML = `
        <div class="modal-info">
            <p><strong>域名:</strong> <code>${website.domain}</code></p>
            ${website.parentDomain ? `<p><strong>父域名:</strong> <code>${website.parentDomain}</code></p>` : ''}
            <p><strong>狀態:</strong> <span class="status-badge status-${website.status.replace('_', '-')}">${getStatusText(website.status)}</span></p>
            <p><strong>託管商:</strong> ${website.hostingProvider}</p>
            <p><strong>託管帳號:</strong> ${website.hostingAccount || 'N/A'}</p>
            ${website.hostingPlan ? `<p><strong>託管方案:</strong> ${website.hostingPlan}</p>` : ''}
            ${website.server ? `<p><strong>伺服器:</strong> ${website.server}</p>` : ''}
            <p><strong>流量:</strong> ${website.traffic.toLocaleString()} ${website.trafficPercentage ? `(${website.trafficPercentage})` : ''}</p>
            <p><strong>PHP 版本:</strong> ${website.phpVersion || 'N/A'}</p>
            <p><strong>Email 帳號:</strong> ${website.emailAccounts}</p>
            <p><strong>SSL 狀態:</strong> ${website.sslStatus}</p>
            ${expiryInfo}
            ${addonsHtml}
            <p><strong>用途:</strong> ${website.purpose}</p>
            ${techStackHtml}
            ${website.notes ? `<p><strong>備註:</strong> ${website.notes}</p>` : ''}
        </div>
    `;
    
    modal.style.display = 'flex';
    gsap.fromTo('#website-modal .modal-content', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
}

// ========== REFRESH FUNCTIONS ==========
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateTime && lastUpdateElement) {
        const timeString = lastUpdateTime.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        lastUpdateElement.textContent = `最後更新: ${timeString}`;
    }
}

function initRefreshButton() {
    const refreshBtn = document.getElementById('refresh-btn');
    const refreshWebsitesBtn = document.getElementById('refresh-websites-btn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;
            
            try {
                await refreshDomainData();
                updateLastUpdateTime();
            } catch (error) {
                console.error('Domain refresh failed:', error);
            }
            
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
        });
    }
    
    if (refreshWebsitesBtn) {
        refreshWebsitesBtn.addEventListener('click', async () => {
            refreshWebsitesBtn.classList.add('loading');
            refreshWebsitesBtn.disabled = true;
            
            try {
                await refreshWebsiteData();
                updateWebsiteLastUpdateTime();
            } catch (error) {
                console.error('Website refresh failed:', error);
            }
            
            refreshWebsitesBtn.classList.remove('loading');
            refreshWebsitesBtn.disabled = false;
        });
    }
}

function showRefreshAnimation(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('loading');
        button.disabled = true;
        const icon = button.querySelector('.refresh-icon');
        if (icon) {
            gsap.to(icon, { rotation: 360, duration: 1, repeat: -1, ease: "none" });
        }
    }
}

function hideRefreshAnimation(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.remove('loading');
        button.disabled = false;
        const icon = button.querySelector('.refresh-icon');
        if (icon) {
            gsap.killTweensOf(icon);
            gsap.set(icon, { rotation: 0 });
        }
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize matrix rain effect
    initMatrixRain();
    
    // Start loading screen
    initLoadingScreen();
    
    // Update date/time every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initialize all components after loading
    setTimeout(async () => {
        // Load available modules first
        await loadAvailableModules();
        
        initNavigation();
        initModal();
        initRefreshButton();
        
        // Load domain data if available
        if (availableModules.domains && availableModules.domains.available) {
            await loadDomainData();
            updateDomainStats();
            renderDomainGrid();
            initDomainFilters();
            updateLastUpdateTime();
        }
        
        // Add some initial animations
        gsap.fromTo('.nav-item', 
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.5 }
        );
        
        gsap.fromTo('.panel-header', 
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.8 }
        );
        
        // Auto refresh every 5 minutes
        setInterval(async () => {
            console.log('Auto-refreshing domain data...');
            await refreshDomainData();
            updateLastUpdateTime();
        }, 5 * 60 * 1000);
        
    }, 2000);
    
    // Console easter egg
    console.log(`
    ██████╗██╗   ██╗███████╗███████╗██╗   ██╗████████╗ █████╗ 
    ██╔════╝╚██╗ ██╔╝██╔════╝██╔════╝██║   ██║╚══██╔══╝██╔══██╗
    ██║      ╚████╔╝ █████╗  ███████╗██║   ██║   ██║   ███████║
    ██║       ╚██╔╝  ██╔══╝  ╚════██║██║   ██║   ██║   ██╔══██║
    ╚██████╗   ██║   ███████╗███████║╚██████╔╝   ██║   ██║  ██║
     ╚═════╝   ╚═╝   ╚══════╝╚══════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝
                                                                
     █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
    ██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
    ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
    ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
    ██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
    ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝
    
    歡迎來到 The Chimera Protocol 控制面板
    版本: 1.0.0
    狀態: 系統在線
    API 模式: 動態讀取 JSON 數據
    `);
});
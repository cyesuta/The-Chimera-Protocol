#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
The Chimera Protocol 本地服務器
在 8008 端口提供 HTTP 服務
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import signal
import json
from datetime import datetime

class ChimeraHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定義 HTTP 請求處理器"""
    
    def end_headers(self):
        """添加自定義 HTTP 頭"""
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        """自定義日誌格式"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")
    
    def do_GET(self):
        """處理 GET 請求"""
        # 如果請求根路徑，重定向到 index.html
        if self.path == '/':
            self.path = '/index.html'
        
        # 處理 API 請求
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            # 處理靜態文件
            super().do_GET()
    
    def handle_api_request(self):
        """處理 API 請求"""
        if self.path == '/api/status':
            self.send_api_response({
                'status': 'online',
                'timestamp': datetime.now().isoformat(),
                'server': 'The Chimera Protocol',
                'version': '1.0.0'
            })
        elif self.path == '/api/domains':
            # 讀取域名數據
            try:
                with open('computer-data-structure/domains.json', 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self.send_api_response(data.get('domainManagement', []))
            except Exception as e:
                self.send_api_response({'error': str(e)}, 500)
        elif self.path == '/api/websites':
            # 讀取網站數據
            try:
                with open('computer-data-structure/websites-servers.json', 'r', encoding='utf-8') as f:
                    data = json.load(f)
                websites = data.get('personalWebsites', [])
                self.send_api_response(websites)
            except Exception as e:
                self.send_api_response({'error': str(e)}, 500)
        elif self.path == '/api/modules':
            # 檢測可用模塊
            available_modules = self.check_available_modules()
            self.send_api_response(available_modules)
        else:
            self.send_api_response({'error': 'API endpoint not found'}, 404)
    
    def send_api_response(self, data, status=200):
        """發送 API 響應"""
        self.send_response(status)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.end_headers()
        
        response = json.dumps(data, ensure_ascii=False, indent=2)
        self.wfile.write(response.encode('utf-8'))
    
    def check_available_modules(self):
        """檢查可用的模塊"""
        modules = {
            'domains': {'available': False, 'source': 'domains.json'},
            'websites': {'available': False, 'source': 'websites-servers.json'},
            'hardware': {'available': False, 'source': 'computer-hardware.json'},
            'backup': {'available': False, 'source': 'backup-management.md'},
            'network': {'available': False, 'source': 'network-services.md'},
            'files': {'available': False, 'source': 'file-management.md'}
        }
        
        data_dir = 'computer-data-structure'
        
        # 檢查所有模塊文件是否存在
        for module_name, module_info in modules.items():
            file_path = os.path.join(data_dir, module_info['source'])
            if os.path.exists(file_path):
                modules[module_name]['available'] = True
        
        return modules

class ChimeraServer:
    """The Chimera Protocol 服務器"""
    
    def __init__(self, port=8008, host='localhost'):
        self.port = port
        self.host = host
        self.server = None
        self.running = False
    
    def start(self):
        """啟動服務器"""
        try:
            # 切換到項目根目錄
            script_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(script_dir)  # 上一級目錄
            os.chdir(project_root)
            
            # 創建服務器
            Handler = ChimeraHTTPRequestHandler
            with socketserver.TCPServer((self.host, self.port), Handler) as httpd:
                self.server = httpd
                self.running = True
                
                print("=" * 60)
                print("THE CHIMERA PROTOCOL - Control Panel Server Started")
                print("=" * 60)
                print(f"Server URL: http://{self.host}:{self.port}")
                print(f"Working Directory: {os.getcwd()}")
                print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                print("=" * 60)
                print("Server is running...")
                print("Press Ctrl+C to stop server")
                print("=" * 60)
                
                # Auto open browser
                try:
                    webbrowser.open(f'http://{self.host}:{self.port}')
                    print("Browser opened automatically")
                except:
                    print("Please manually open browser to visit the address above")
                
                # 設置信號處理
                signal.signal(signal.SIGINT, self.signal_handler)
                
                # 啟動服務器
                httpd.serve_forever()
                
        except OSError as e:
            if e.errno == 10048:  # Windows: Address already in use
                print(f"ERROR: Port {self.port} is already in use")
                print(f"Try using different port: python server.py --port 8009")
            elif e.errno == 98:  # Linux: Address already in use
                print(f"ERROR: Port {self.port} is already in use")
                print(f"Try using different port: python server.py --port 8009")
            else:
                print(f"Server startup failed: {e}")
        except KeyboardInterrupt:
            self.stop()
        except Exception as e:
            print(f"Unexpected error: {e}")
    
    def stop(self):
        """Stop server"""
        if self.running:
            print("\n" + "=" * 60)
            print("Stopping server...")
            self.running = False
            if self.server:
                self.server.shutdown()
            print("Server stopped")
            print("Thank you for using The Chimera Protocol")
            print("=" * 60)
    
    def signal_handler(self, signum, frame):
        """信號處理器"""
        self.stop()
        sys.exit(0)

def main():
    """主函數"""
    import argparse
    
    parser = argparse.ArgumentParser(description='The Chimera Protocol 控制面板服務器')
    parser.add_argument('--port', '-p', type=int, default=8008, 
                       help='服務器端口 (預設: 8008)')
    parser.add_argument('--host', '-H', default='localhost', 
                       help='服務器主機 (預設: localhost)')
    parser.add_argument('--open', '-o', action='store_true',
                       help='啟動後自動打開瀏覽器')
    
    args = parser.parse_args()
    
    # Check if in correct directory
    if not os.path.exists('index.html'):
        print("ERROR: Cannot find index.html")
        print("Please run this script in The Chimera Protocol project directory")
        return 1
    
    # 創建並啟動服務器
    server = ChimeraServer(port=args.port, host=args.host)
    server.start()
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
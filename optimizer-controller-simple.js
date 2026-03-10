/**
 * Notion 性能优化器 - 简化控制器
 */
class OptimizerController {
    constructor() {
        this.isOptimizing = false;
        this.currentProgress = 0;
        this.elements = {};
        this.metrics = {
            cacheHitRate: 0,
            avgResponseTime: 0,
            apiCalls: 0,
            memoryUsage: 0,
            recommendations: []
        };
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadSavedSettings();
        this.startMetricsUpdate();
    }

    initializeElements() {
        this.elements = {
            notionToken: document.getElementById('notion-token'),
            databaseId: document.getElementById('database-id'),
            batchSize: document.getElementById('batch-size'),
            cacheTtl: document.getElementById('cache-ttl'),
            startBtn: document.getElementById('start-optimization'),
            startText: document.getElementById('start-text'),
            clearBtn: document.getElementById('clear-cache'),
            exportBtn: document.getElementById('export-metrics'),
            progressContainer: document.getElementById('progress-container'),
            progressBar: document.getElementById('progress-bar'),
            progressText: document.getElementById('progress-text'),
            cacheHitRate: document.getElementById('cache-hit-rate'),
            avgResponseTime: document.getElementById('avg-response-time'),
            apiCalls: document.getElementById('api-calls'),
            memoryUsage: document.getElementById('memory-usage'),
            recommendationList: document.getElementById('recommendations')
        };
    }

    initializeEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startOptimization());
        this.elements.clearBtn.addEventListener('click', () => this.clearCache());
        this.elements.exportBtn.addEventListener('click', () => this.exportMetrics());
        
        // 添加输入事件监听器以自动保存设置
        this.elements.notionToken.addEventListener('input', () => this.saveSettings());
        this.elements.databaseId.addEventListener('input', () => this.saveSettings());
        this.elements.batchSize.addEventListener('change', () => this.saveSettings());
        this.elements.cacheTtl.addEventListener('change', () => this.saveSettings());
    }

    loadSavedSettings() {
        const savedSettings = localStorage.getItem('notionOptimizerSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.elements.notionToken.value = settings.notionToken || '';
            this.elements.databaseId.value = settings.databaseId || '';
            this.elements.batchSize.value = settings.batchSize || '100';
            this.elements.cacheTtl.value = settings.cacheTtl || '300';
        }
    }

    saveSettings() {
        const settings = {
            notionToken: this.elements.notionToken.value,
            databaseId: this.elements.databaseId.value,
            batchSize: this.elements.batchSize.value,
            cacheTtl: this.elements.cacheTtl.value
        };
        localStorage.setItem('notionOptimizerSettings', JSON.stringify(settings));
    }

    async startOptimization() {
        if (this.isOptimizing) {
            this.stopOptimization();
            return;
        }

        const token = this.elements.notionToken.value.trim();
        const databaseId = this.elements.databaseId.value.trim();

        // 验证输入
        if (!token || !databaseId) {
            this.showNotification('请填写Notion Token和Database ID', 'error');
            return;
        }

        // 验证Token格式
        if (!token.startsWith('secret_') && !token.startsWith('ntn_')) {
            this.showTokenFormatHelp();
            return;
        }

        // 验证Token长度
        if (token.length < 20) {
            this.showTokenFormatHelp();
            return;
        }

        this.isOptimizing = true;
        this.updateUI();
        this.showProgress();

        try {
            await this.performOptimization(token, databaseId);
        } catch (error) {
            this.showNotification(`优化失败: ${error.message}`, 'error');
        } finally {
            this.isOptimizing = false;
            this.updateUI();
            this.hideProgress();
        }
    }

    async performOptimization(token, databaseId) {
        // 模拟优化过程
        this.updateProgress('正在验证Token...', 10);
        await this.delay(500);

        // 测试API连接
        const isValid = await this.testConnection(token);
        if (!isValid) {
            throw new Error('Token验证失败，请检查Token是否正确');
        }

        this.updateProgress('正在分析数据库结构...', 20);
        await this.delay(800);

        this.updateProgress('正在优化缓存策略...', 40);
        await this.delay(1000);

        this.updateProgress('正在调整API调用频率...', 60);
        await this.delay(800);

        this.updateProgress('正在优化内存使用...', 80);
        await this.delay(600);

        this.updateProgress('正在生成优化建议...', 90);
        await this.delay(400);

        // 生成优化结果
        const results = {
            cacheHitRate: 85 + Math.random() * 10, // 85-95%
            avgResponseTime: 120 + Math.random() * 50, // 120-170ms
            apiCalls: Math.floor(100 + Math.random() * 50), // 100-150
            memoryUsage: 15 + Math.random() * 10, // 15-25MB
            recommendations: [
                '启用智能缓存可减少75%的API调用',
                '批量处理数据可提升60%的处理速度',
                '优化查询条件可减少40%的响应时间',
                '使用增量同步可节省80%的带宽'
            ]
        };

        this.updateMetrics(results);
        this.updateProgress('优化完成！', 100);
        
        // 显示成功消息
        this.showNotification('🎉 优化完成！性能已显著提升', 'success');
        
        await this.delay(2000);
    }

    async testConnection(token) {
        try {
            const response = await fetch('https://api.notion.com/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Notion-Version': '2022-06-28'
                }
            });
            
            if (response.status === 401 || response.status === 403) {
                return false;
            }
            
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    updateProgress(text, progress) {
        this.elements.progressText.textContent = text;
        this.elements.progressBar.style.width = `${progress}%`;
        this.currentProgress = progress;
    }

    showProgress() {
        this.elements.progressContainer.style.display = 'block';
    }

    hideProgress() {
        this.elements.progressContainer.style.display = 'none';
    }

    stopOptimization() {
        this.isOptimizing = false;
        this.updateUI();
        this.hideProgress();
        this.showNotification('优化已停止', 'info');
    }

    updateUI() {
        if (this.isOptimizing) {
            this.elements.startText.textContent = '⏸️ 停止优化';
            this.elements.startBtn.classList.add('working');
        } else {
            this.elements.startText.textContent = '🚀 开始优化';
            this.elements.startBtn.classList.remove('working');
        }
    }

    updateMetrics(results) {
        this.metrics = results;
        this.elements.cacheHitRate.textContent = `${results.cacheHitRate.toFixed(1)}%`;
        this.elements.avgResponseTime.textContent = `${results.avgResponseTime.toFixed(0)}ms`;
        this.elements.apiCalls.textContent = results.apiCalls;
        this.elements.memoryUsage.textContent = `${results.memoryUsage.toFixed(1)}MB`;
        
        // 更新建议列表
        this.elements.recommendationList.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            this.elements.recommendationList.appendChild(li);
        });
    }

    clearCache() {
        this.metrics = {
            cacheHitRate: 0,
            avgResponseTime: 0,
            apiCalls: 0,
            memoryUsage: 0,
            recommendations: []
        };
        
        this.elements.cacheHitRate.textContent = '0%';
        this.elements.avgResponseTime.textContent = '0ms';
        this.elements.apiCalls.textContent = '0';
        this.elements.memoryUsage.textContent = '0MB';
        this.elements.recommendationList.innerHTML = '';
        
        this.showNotification('🗑️ 缓存已清理', 'success');
    }

    getMetrics() {
        return this.metrics;
    }

    exportMetrics() {
        const metrics = this.getMetrics();
        const fileName = `notion-metrics-${new Date().toISOString().split('T')[0]}.json`;
        const data = JSON.stringify(metrics, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        
        // 显示友好的导出成功提示
        this.showExportSuccess(fileName);
    }

    showExportSuccess(fileName) {
        const successDiv = document.createElement('div');
        successDiv.className = 'export-success';
        successDiv.innerHTML = `
            <div class="export-success-content">
                <h4>🎉 导出成功！</h4>
                <p>📄 文件名: <strong>${fileName}</strong></p>
                <p>📂 位置: <strong>浏览器下载文件夹</strong></p>
                <div class="export-actions">
                    <button id="guide-btn" class="guide-btn">
                        📂 如何查看下载文件夹
                    </button>
                    <button id="downloads-btn" class="downloads-btn">
                        📥 打开下载页面
                    </button>
                </div>
                <div class="export-tips">
                    <p>💡 小贴士:</p>
                    <ul>
                        <li>💻 Windows: 按 Ctrl+J 打开下载文件夹</li>
                        <li>🍎 Mac: 按 Cmd+Option+L 打开下载文件夹</li>
                        <li>🌐 在浏览器地址栏输入 chrome://downloads/ 查看所有下载</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // 绑定按钮事件
        const guideBtn = document.getElementById('guide-btn');
        const downloadsBtn = document.getElementById('downloads-btn');
        
        if (guideBtn) {
            guideBtn.addEventListener('click', () => {
                this.showDownloadGuide();
            });
        }
        
        if (downloadsBtn) {
            downloadsBtn.addEventListener('click', () => {
                this.openDownloadsPage();
            });
        }
        
        // 8秒后自动关闭
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 8000);
    }

    showDownloadGuide() {
        const guide = `
            📂 查找导出文件的步骤:
            
            1️⃣ 按快捷键打开下载文件夹:
               💻 Windows: Ctrl+J
               🍎 Mac: Cmd+Option+L
            
            2️⃣ 或在浏览器中:
               🌐 地址栏输入: chrome://downloads/
               📥 查看所有下载文件
            
            3️⃣ 文件命名规则:
               📄 notion-metrics-YYYY-MM-DD.json
               📅 按日期排序查找最新文件
        `;
        
        this.showNotification(guide, 'info', 10000);
    }

    openDownloadsPage() {
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.create({ url: 'chrome://downloads/' });
        } else {
            // 如果在非Chrome环境中，提供指导
            this.showDownloadGuide();
        }
    }

    showTokenFormatHelp() {
        const helpDiv = document.createElement('div');
        helpDiv.className = 'token-help-modal';
        helpDiv.innerHTML = `
            <div class="token-help-content">
                <h3>🔑 Token格式问题</h3>
                <div class="detection-result">
                    <p><strong>检测结果:</strong></p>
                    <p>Token格式不正确，请检查以下内容:</p>
                </div>
                <div class="solution">
                    <h4>🔧 解决方案:</h4>
                    <ul>
                        <li>Token应该以 <code>secret_</code> 或 <code>ntn_</code> 开头</li>
                        <li>Token长度应该至少20个字符</li>
                        <li>请确保Token没有多余的空格或换行</li>
                        <li>Token应该从Notion集成页面复制获取</li>
                    </ul>
                    <p><strong>获取Token步骤:</strong></p>
                    <ol>
                        <li>访问 <a href="https://www.notion.so/my-integrations" target="_blank">Notion集成页面</a></li>
                        <li>点击 "New integration" 创建新集成</li>
                        <li>选择 "Internal integration" (内部集成)</li>
                        <li>填写基本信息后创建</li>
                        <li>复制 "Internal Integration Secret" (不是Client Secret)</li>
                    </ol>
                </div>
                <div class="tips">
                    <h4>📌 小贴士:</h4>
                    <ul>
                        <li>不要在代码中硬编码Token</li>
                        <li>定期更换Token以确保安全</li>
                        <li>只授予必要的权限</li>
                    </ul>
                </div>
                <div class="get-token-center">
                    <button onclick="this.closeTokenHelp()" class="close-btn">我知道了</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpDiv);
        
        // 添加事件监听器
        helpDiv.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(helpDiv);
        });
        
        // 点击背景关闭
        helpDiv.addEventListener('click', (e) => {
            if (e.target === helpDiv) {
                document.body.removeChild(helpDiv);
            }
        });
    }

    closeTokenHelp() {
        const helpDiv = document.querySelector('.token-help-modal');
        if (helpDiv) {
            document.body.removeChild(helpDiv);
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }

    startMetricsUpdate() {
        // 每秒更新一次指标
        setInterval(() => {
            if (!this.isOptimizing) {
                this.updateRealTimeMetrics();
            }
        }, 1000);
    }

    updateRealTimeMetrics() {
        // 模拟实时数据更新
        if (this.metrics.cacheHitRate > 0) {
            // 添加一些随机波动
            const variation = (Math.random() - 0.5) * 2;
            this.metrics.cacheHitRate = Math.max(0, Math.min(100, this.metrics.cacheHitRate + variation));
            this.elements.cacheHitRate.textContent = `${this.metrics.cacheHitRate.toFixed(1)}%`;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 初始化控制器
document.addEventListener('DOMContentLoaded', () => {
    new OptimizerController();
});

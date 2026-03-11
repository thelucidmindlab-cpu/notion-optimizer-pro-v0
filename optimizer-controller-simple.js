class OptimizerController {
    constructor() {
        this.init();
        this.load();
        this.checkDailyLimit();
    }

    // 6. 新增：每天免费 5 次限额检查
    checkDailyLimit() {
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem('last_use_date');
        
        if (lastDate !== today) {
            localStorage.setItem('last_use_date', today);
            localStorage.setItem('daily_usage_count', '0');
        }
        this.dailyCount = parseInt(localStorage.getItem('daily_usage_count') || '0');
    }

    init() {
        this.btn = document.getElementById('start-optimization');
        this.exportBtn = document.getElementById('export-btn');
        this.clearBtn = document.getElementById('clear-cache-btn');
        this.manualBtn = document.getElementById('open-guide-manually');
        this.closeGuideBtn = document.getElementById('close-guide');
        this.overlay = document.getElementById('guide-overlay');
        this.vipOverlay = document.getElementById('vip-overlay');
        this.tokenInput = document.getElementById('notion-token');
        this.dbInput = document.getElementById('database-id');

        if (this.btn) this.btn.onclick = () => this.start();
        if (this.exportBtn) this.exportBtn.onclick = () => this.doExport();
        if (this.manualBtn) this.manualBtn.onclick = () => { this.overlay.style.display = 'flex'; };
        if (this.closeGuideBtn) this.closeGuideBtn.onclick = () => { this.overlay.style.display = 'none'; };
        if (this.clearBtn) this.clearBtn.onclick = () => {
            if(confirm("确定清理缓存吗？")) { localStorage.clear(); location.reload(); }
        };
    }

    async start() {
        const token = this.tokenInput.value.trim();
        const dbId = this.dbInput.value.trim();

        // 基础验证
        if (!token.startsWith('ntn_') && !token.startsWith('secret_') || dbId.length < 32) {
            this.overlay.style.display = 'flex';
            return;
        }

        // 6. 检查限额
        if (this.dailyCount >= 5) {
            alert("⚠️ 您今日的 5 次免费提速额度已用完，请明天再来或升级 VIP 解锁无限次加速！");
            // 这里可以触发弹出 VIP 弹窗
            return;
        }

        this.btn.disabled = true;
        document.getElementById('status').innerText = "⚡ 正在建立高速连接...";
        await new Promise(r => setTimeout(r, 1000));

        document.getElementById('status').innerText = "✅ 加速已完成";
        document.getElementById('metrics-view').style.display = 'block';
        document.getElementById('finish-time').innerText = "最后更新: " + new Date().toLocaleString();
        this.exportBtn.style.display = 'block';
        this.btn.disabled = false;

        // 增加使用次数
        this.dailyCount++;
        localStorage.setItem('daily_usage_count', this.dailyCount.toString());
        
        localStorage.setItem('d_token', token);
        localStorage.setItem('d_dbid', dbId);
    }

    // doExport, load 逻辑同前 ...
}
window.onload = () => new OptimizerController();
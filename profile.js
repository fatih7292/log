// ===== WAVE ANIMATION (как на основной) =====
const waveCanvas = document.getElementById('waveCanvas');
const waveCtx = waveCanvas.getContext('2d');

function resizeWaveCanvas() {
    waveCanvas.width = waveCanvas.offsetWidth;
    waveCanvas.height = waveCanvas.offsetHeight;
}
resizeWaveCanvas();
window.addEventListener('resize', resizeWaveCanvas);

let waveOffset = 0;
function drawWaves() {
    waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
    
    const waves = [
        { amplitude: 8, frequency: 0.02, speed: 0.02, color: 'rgba(255,255,255,0.3)' },
        { amplitude: 6, frequency: 0.03, speed: 0.03, color: 'rgba(255,255,255,0.2)' },
        { amplitude: 4, frequency: 0.04, speed: 0.015, color: 'rgba(255,255,255,0.15)' }
    ];
    
    waves.forEach(wave => {
        waveCtx.beginPath();
        waveCtx.moveTo(0, waveCanvas.height);
        
        for (let x = 0; x <= waveCanvas.width; x++) {
            const y = waveCanvas.height / 2 + 
                     Math.sin(x * wave.frequency + waveOffset * wave.speed) * wave.amplitude;
            waveCtx.lineTo(x, y);
        }
        
        waveCtx.lineTo(waveCanvas.width, waveCanvas.height);
        waveCtx.closePath();
        waveCtx.fillStyle = wave.color;
        waveCtx.fill();
    });
    
    waveOffset += 1;
    requestAnimationFrame(drawWaves);
}
drawWaves();

// ===== COPY FUNCTION =====
function copyText(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value || element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = element.parentElement.querySelector('.copy-btn');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            Скопировано!
        `;
        btn.classList.add('copied');
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
        
        showToast('Текст скопирован в буфер обмена', 'success');
    }).catch(() => {
        // Fallback для старых браузеров
        element.select();
        document.execCommand('copy');
        showToast('Текст скопирован', 'success');
    });
}

// ===== TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
        info: '●',
        error: '●',
        success: '●'
    };
    
    const colors = {
        info: 'var(--primary)',
        error: 'var(--error)',
        success: 'var(--success)'
    };
    
    toast.style.borderLeftColor = colors[type] || colors.info;
    
    toast.innerHTML = `
        <span style="color:${colors[type] || colors.info};font-size:1.2rem;font-weight:900">${icons[type]}</span>
        <div>
            <div style="font-weight:700;font-size:0.95rem">LOG</div>
            <div style="font-size:0.9rem;color:var(--text-light)">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// ===== PERSONAL LOG DATA (Berik Lyubovsky only) =====
 const personalLogData = [
    { time: '13:28:15', platform: 'instagram', action: 'Отправил личное сообщение',}]
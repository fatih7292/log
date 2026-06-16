// ===== WAVE ANIMATION (как на основной странице) =====
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

// ===== TOGGLE PASSWORD =====
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
});

// ===== TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
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

// ===== LOGIN FORM =====
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const accessLevel = document.getElementById('accessLevel').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!username || !password || !accessLevel) {
        showToast('Заполните все поля', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Пароль должен быть не менее 6 символов', 'error');
        return;
    }
    
    loginBtn.classList.add('loading');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const validCredentials = {
        'analyst': { pass: 'analyst2026', redirect: 'index.html' },
        'operator': { pass: 'operator2026', redirect: 'index.html' },
        'admin': { pass: 'admin2026', redirect: 'index.html' }
    };
    
    const level = validCredentials[accessLevel];
    
    if (level && password === level.pass) {
        if (rememberMe) {
            localStorage.setItem('log_session', JSON.stringify({
                username,
                accessLevel,
                loginTime: new Date().toISOString()
            }));
        } else {
            sessionStorage.setItem('log_session', JSON.stringify({
                username,
                accessLevel,
                loginTime: new Date().toISOString()
            }));
        }
        
        showToast(`Добро пожаловать, ${username}`, 'success');
        
        setTimeout(() => {
            window.location.href = level.redirect;
        }, 1500);
    } else {
        loginBtn.classList.remove('loading');
        showToast('Неверные учетные данные', 'error');
        
        loginForm.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
    }
});

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// ===== CHECK SESSION =====
window.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('log_session') || sessionStorage.getItem('log_session');
    if (session) {
        const data = JSON.parse(session);
        const loginTime = new Date(data.loginTime);
        const hoursSince = (new Date() - loginTime) / (1000 * 60 * 60);
        
        if (hoursSince < 24) {
            showToast(`Восстановление сессии: ${data.username}`, 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            localStorage.removeItem('log_session');
            sessionStorage.removeItem('log_session');
        }
    }
});

// ===== FORGOT PASSWORD =====
document.querySelector('.forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Обратитесь к администратору системы', 'info');
});
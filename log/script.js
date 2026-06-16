// ===== TARGET PERSONS DATA =====
const targets = [
    { id: 'usr_4821', name: 'Berik Lyubovsky', status: 'online', platforms: ['instagram', 'telegram', 'whatsapp'] },
    { id: 'usr_9153', name: 'Dmitry K.', status: 'recent', platforms: ['tiktok', 'instagram'] },
    { id: 'usr_3387', name: 'Elena V.', status: 'online', platforms: ['telegram', 'whatsapp'] },
    { id: 'usr_7721', name: 'Artem P.', status: 'offline', platforms: ['instagram', 'tiktok'] },
];

let activeTarget = null;

// ===== RENDER TARGETS =====
function renderTargets() {
    const grid = document.getElementById('targetsGrid');
    grid.innerHTML = '';
    
    targets.forEach(target => {
        const card = document.createElement('a');
        card.href = 'profile.html';
        card.className = `target-card ${activeTarget === target.id ? 'active' : ''}`;
        
        // БЕЗ АВАТАРКИ — только текст и статус
        card.innerHTML = `
            <div class="target-info">
                <div class="target-name">${target.name}</div>
                <div class="target-id">ID: ${target.id}</div>
            </div>
            <span class="target-status ${target.status}"></span>
        `;
        
        card.addEventListener('click', (e) => {
            // Сохраняем выбранный объект в sessionStorage для profile.html
            sessionStorage.setItem('selected_target', JSON.stringify(target));
        });
        
        grid.appendChild(card);
    });
}

// ===== WAVE ANIMATION =====
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

// ===== ANIMATED COUNTERS =====
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(progress * (end - start) + start).toLocaleString('ru');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.querySelectorAll('.stat-value').forEach(counter => {
                if (counter.dataset.count) {
                    animateValue(counter, 0, parseInt(counter.dataset.count), 2000);
                }
            });
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ===== LOG DATA =====
const logData = [
    { time: '13:28:15', targetId: 'usr_4821', targetName: 'Berik Lyubovsky', platform: 'instagram', action: 'Отправил личное сообщение', content: 'Привет! Когда встретимся?', status: 'captured' },
    { time: '13:27:42', targetId: 'usr_9153', targetName: 'Dmitry K.', platform: 'tiktok', action: 'Поставил лайк на видео', content: 'Танцевальный челлендж #dance', status: 'captured' },
    { time: '13:26:18', targetId: 'usr_3387', targetName: 'Elena V.', platform: 'telegram', action: 'Переслала сообщение', content: 'Ссылка на новостной канал', status: 'encrypted' },
    { time: '13:25:55', targetId: 'usr_4821', targetName: 'Berik Lyubovsky', platform: 'whatsapp', action: 'Просмотрел статус', content: 'Статус от Контакта #3', status: 'captured' },
    { time: '13:24:30', targetId: 'usr_7721', targetName: 'Artem P.', platform: 'instagram', action: 'Подписался на аккаунт', content: '@travel_blog', status: 'captured' },
    { time: '13:23:12', targetId: 'usr_9153', targetName: 'Dmitry K.', platform: 'tiktok', action: 'Оставил комментарий', content: 'Круто!', status: 'captured' },
    { time: '13:22:48', targetId: 'usr_3387', targetName: 'Elena V.', platform: 'whatsapp', action: 'Голосовое сообщение', content: 'Длительность: 0:42', status: 'pending' },
    { time: '13:21:33', targetId: 'usr_4821', targetName: 'Berik Lyubovsky', platform: 'telegram', action: 'Вошёл в групповой чат', content: 'Чат: "Друзья"', status: 'captured' },
    { time: '13:20:05', targetId: 'usr_7721', targetName: 'Artem P.', platform: 'instagram', action: 'Опубликовал stories', content: 'Фото с геолокацией', status: 'captured' },
    { time: '13:18:47', targetId: 'usr_9153', targetName: 'Dmitry K.', platform: 'whatsapp', action: 'Позвонил (аудио)', content: 'Длительность: 3:15', status: 'captured' },
];

const platformClasses = {
    instagram: 'instagram',
    telegram: 'telegram',
    tiktok: 'tiktok',
    whatsapp: 'whatsapp'
};

const platformIcons = {
    instagram: '📷',
    telegram: '✈️',
    tiktok: '🎵',
    whatsapp: '💬'
};

const statusClasses = {
    captured: 'captured',
    pending: 'pending',
    encrypted: 'encrypted'
};

function renderTable(data) {
    const tbody = document.getElementById('logTableBody');
    tbody.innerHTML = '';
    
    data.forEach(row => {
        const tr = document.createElement('tr');
        // БЕЗ АВАТАРКИ — только текст
        tr.innerHTML = `
            <td class="time-cell">${row.time}</td>
            <td class="target-cell">
                <span class="target-cell-name">${row.targetName}</span>
                <span class="target-cell-id">${row.targetId}</span>
            </td>
            <td><span class="platform-badge ${platformClasses[row.platform]}">${platformIcons[row.platform]} ${row.platform}</span></td>
            <td class="action-cell">${row.action}</td>
            <td class="content-preview">${row.content}</td>
            <td><span class="status-badge ${statusClasses[row.status]}">${row.status}</span></td>
        `;
        tr.addEventListener('click', () => showDetailModal(row));
        tbody.appendChild(tr);
    });
}

renderTable(logData);
renderTargets();

// ===== FILTER FUNCTIONALITY =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        let filtered = filter === 'all' ? logData : logData.filter(d => d.platform === filter);
        
        if (activeTarget) {
            filtered = filtered.filter(d => d.targetId === activeTarget);
        }
        
        renderTable(filtered);
    });
});

// ===== SEARCH =====
document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) {
        renderTable(logData);
        return;
    }
    
    const filtered = logData.filter(d => 
        d.action.toLowerCase().includes(query) || 
        d.content.toLowerCase().includes(query) ||
        d.targetName.toLowerCase().includes(query)
    );
    renderTable(filtered);
    showToast(`Найдено ${filtered.length} записей`, 'info');
}

// ===== MODAL =====
const modal = document.getElementById('detailModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

document.querySelector('.modal-close').addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

function showDetailModal(row) {
    modalTitle.textContent = `Детали: ${row.action}`;
    modalBody.innerHTML = `
        <div class="modal-field">
            <div class="modal-field-label">Объект наблюдения</div>
            <div class="modal-field-value">${row.targetName} (${row.targetId})</div>
        </div>
        <div class="modal-field">
            <div class="modal-field-label">Платформа</div>
            <div class="modal-field-value">${platformIcons[row.platform]} ${row.platform.toUpperCase()}</div>
        </div>
        <div class="modal-field">
            <div class="modal-field-label">Время фиксации</div>
            <div class="modal-field-value">${row.time}</div>
        </div>
        <div class="modal-field">
            <div class="modal-field-label">Действие</div>
            <div class="modal-field-value">${row.action}</div>
        </div>
        <div class="modal-field">
            <div class="modal-field-label">Контент / Детали</div>
            <div class="modal-field-value">${row.content}</div>
        </div>
        <div class="modal-field">
            <div class="modal-field-label">Статус записи</div>
            <div class="modal-field-value">
                <span class="status-badge ${statusClasses[row.status]}">${row.status.toUpperCase()}</span>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

// ===== TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
        info: '📡',
        warning: '⚠️',
        error: '🚫',
        success: '✅'
    };
    
    toast.innerHTML = `
        <span style="font-size:1.3rem">${icons[type] || '📡'}</span>
        <div>
            <div style="font-weight:700;font-size:0.95rem">LOG Monitor</div>
            <div style="font-size:0.9rem;color:var(--text-light)">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

// ===== ACTIVITY CHART =====
const chartCanvas = document.getElementById('activityChart');
const chartCtx = chartCanvas.getContext('2d');

function resizeChart() {
    const container = chartCanvas.parentElement;
    chartCanvas.width = container.offsetWidth;
    chartCanvas.height = container.offsetHeight;
}
resizeChart();
window.addEventListener('resize', resizeChart);

const chartData = {
    instagram: [15, 22, 18, 30, 25, 35, 28, 40, 32, 45, 38, 50],
    telegram: [20, 18, 25, 22, 30, 28, 35, 32, 40, 38, 45, 42],
    tiktok: [10, 15, 12, 20, 18, 25, 22, 30, 28, 35, 32, 40],
    whatsapp: [25, 20, 28, 24, 32, 30, 38, 35, 42, 40, 48, 45]
};
const labels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

const platformColors = {
    instagram: '#E4405F',
    telegram: '#0088cc',
    tiktok: '#000000',
    whatsapp: '#25D366'
};

function drawChart() {
    const w = chartCanvas.width;
    const h = chartCanvas.height;
    const padding = 50;
    
    chartCtx.clearRect(0, 0, w, h);
    
    const allValues = Object.values(chartData).flat();
    const maxVal = Math.max(...allValues) * 1.2;
    const stepX = (w - padding * 2) / (labels.length - 1);
    const stepY = (h - padding * 2) / maxVal;
    
    chartCtx.strokeStyle = 'rgba(138, 158, 158, 0.15)';
    chartCtx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (h - padding * 2) * i / 5;
        chartCtx.beginPath();
        chartCtx.moveTo(padding, y);
        chartCtx.lineTo(w - padding, y);
        chartCtx.stroke();
    }
    
    Object.entries(chartData).forEach(([platform, data]) => {
        chartCtx.beginPath();
        chartCtx.strokeStyle = platformColors[platform];
        chartCtx.lineWidth = 2.5;
        chartCtx.lineCap = 'round';
        chartCtx.lineJoin = 'round';
        
        data.forEach((val, i) => {
            const x = padding + i * stepX;
            const y = h - padding - val * stepY;
            if (i === 0) chartCtx.moveTo(x, y);
            else chartCtx.lineTo(x, y);
        });
        chartCtx.stroke();
        
        data.forEach((val, i) => {
            const x = padding + i * stepX;
            const y = h - padding - val * stepY;
            chartCtx.beginPath();
            chartCtx.arc(x, y, 4, 0, Math.PI * 2);
            chartCtx.fillStyle = '#fff';
            chartCtx.fill();
            chartCtx.strokeStyle = platformColors[platform];
            chartCtx.lineWidth = 2;
            chartCtx.stroke();
        });
    });
    
    chartCtx.fillStyle = '#5a6e6e';
    chartCtx.font = '12px Segoe UI';
    chartCtx.textAlign = 'center';
    labels.forEach((label, i) => {
        const x = padding + i * stepX;
        chartCtx.fillText(label, x, h - 15);
    });
}

drawChart();

// ===== LIVE UPDATES =====
const actionTemplates = [
    { action: 'Отправил(а) личное сообщение', contents: ['Привет!', 'Как дела?', 'До встречи!', 'Спасибо ❤️'] },
    { action: 'Поставил(а) лайк', contents: ['Фото в ленте', 'Stories', 'Reels видео', 'Комментарий'] },
    { action: 'Подписался(ась)', contents: ['@new_account', '@travel_blog', '@foodie', '@fitness'] },
    { action: 'Просмотрел(а) stories', contents: ['Stories от @user1', 'Stories от @user2', 'Рекламный контент'] },
    { action: 'Переслал(а) сообщение', contents: ['Мем', 'Новость', 'Ссылка', 'Фото'] },
    { action: 'Вошёл(ла) в групповой чат', contents: ['"Работа"', '"Друзья"', '"Семья"', '"Хобби"'] },
    { action: 'Опубликовал(а) stories', contents: ['Фото', 'Видео', 'Опрос', 'Геолокация'] },
    { action: 'Позвонил(а)', contents: ['Аудиозвонок', 'Видеозвонок'] },
    { action: 'Оставил(а) комментарий', contents: ['Круто!', 'Согласен', '👍', 'Интересно'] },
    { action: 'Просмотрел(а) видео', contents: ['Reels', 'TikTok видео', 'YouTube Shorts'] },
];

const platforms = ['instagram', 'telegram', 'tiktok', 'whatsapp'];

function generateNewLogEntry() {
    const target = targets[Math.floor(Math.random() * targets.length)];
    const platform = target.platforms[Math.floor(Math.random() * target.platforms.length)];
    const template = actionTemplates[Math.floor(Math.random() * actionTemplates.length)];
    const content = template.contents[Math.floor(Math.random() * template.contents.length)];
    
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    
    return {
        time,
        targetId: target.id,
        targetName: target.name,
        platform,
        action: template.action,
        content,
        status: Math.random() > 0.2 ? 'captured' : (Math.random() > 0.5 ? 'pending' : 'encrypted')
    };
}

setInterval(() => {
    const newEntry = generateNewLogEntry();
    logData.unshift(newEntry);
    if (logData.length > 20) logData.pop();
    
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    let filtered = activeFilter === 'all' ? logData : logData.filter(d => d.platform === activeFilter);
    if (activeTarget) filtered = filtered.filter(d => d.targetId === activeTarget);
    
    renderTable(filtered);
    
    const platformCard = document.querySelector(`[data-platform="${newEntry.platform}"]`);
    if (platformCard) {
        const statValue = platformCard.querySelector('.stat-value');
        if (statValue) {
            const current = parseInt(statValue.textContent.replace(/\s/g, '')) || 0;
            statValue.textContent = (current + 1).toLocaleString('ru');
        }
    }
    
    showToast(`${newEntry.targetName}: ${newEntry.action} (${newEntry.platform})`, 'info');
}, 10000);

setTimeout(() => {
    showToast('Система мониторинга активна. 4 объекта на наблюдении.', 'success');
}, 800);

document.querySelector('.admin-profile').addEventListener('click', () => {
    showToast('Панель оператора • Уровень доступа: Аналитик', 'info');
});
function logout() {
    localStorage.removeItem('log_session');
    sessionStorage.removeItem('log_session');
    window.location.href = 'login.html?logout=1';
}
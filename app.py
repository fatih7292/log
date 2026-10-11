"""
LOG ANALYTICS — веб-интерфейс на Streamlit.

Неделя 9 плана: каркас веб-интерфейса.
- Сайдбар с фильтрами (период, перевозчик, регион).
- Карточки с ключевыми верхнеуровневыми метриками.
- Блок "терминального" вывода — тот же текст, что печатает costs.py
  при запуске из консоли (summary_report), только внутри веб-страницы.

Внешний вид скопирован со стилистики index.html из проекта "LOG":
тот же хедер с логотипом и профилем оператора, та же цветовая палитра
(--primary: #8a9e9e) и те же карточки с верхней цветной полосой.

Запуск:
    pip install streamlit pandas plotly
    streamlit run app.py
"""

import base64
from pathlib import Path

import pandas as pd
import plotly.express as px
import streamlit as st

import costs

# ------------------------------------------------------------------
# Базовая настройка страницы
# ------------------------------------------------------------------

st.set_page_config(
    page_title="LOG ANALYTICS",
    page_icon="🚚",
    layout="wide",
)

BASE_DIR = Path(__file__).parent
AVATAR_PATH = BASE_DIR / "photo_5291985963577973198_w.jpg"


def img_to_base64(path: Path) -> str:
    if not path.exists():
        return ""
    return base64.b64encode(path.read_bytes()).decode()


AVATAR_B64 = img_to_base64(AVATAR_PATH)


# ------------------------------------------------------------------
# CSS — палитра и компоненты, перенесённые из style.css (index.html)
# ------------------------------------------------------------------

st.markdown(
    """
    <style>
    :root {
        --primary: #8a9e9e;
        --primary-dark: #6b7d7d;
        --primary-light: #a8b8b8;
        --bg: #f0f3f3;
        --card-bg: #ffffff;
        --text: #1a2e2e;
        --text-light: #4a5e5e;
        --border: #c8d0d0;
        --success: #4caf50;
        --warning: #ff9800;
        --error: #f44336;
        --shadow: 0 4px 20px rgba(0,0,0,0.08);
        --shadow-hover: 0 8px 30px rgba(0,0,0,0.12);
    }

    /* Скрываем стандартные отступы Streamlit сверху, чтобы хедер шёл вплотную */
    .block-container { padding-top: 1rem; padding-bottom: 2rem; max-width: 1400px; }
    body, .stApp { background: var(--bg); }

    /* ===== HEADER (как в index.html) ===== */
    .log-header {
        position: relative;
        background: var(--primary);
        border-radius: 18px;
        padding: 24px 40px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .log-logo-block { display: flex; flex-direction: column; }
    .log-logo {
        font-size: 3rem;
        font-weight: 900;
        color: #000;
        letter-spacing: -2px;
        text-transform: uppercase;
        line-height: 1;
        margin: 0;
    }
    .log-logo-sub-strong {
        font-size: 1rem;
        font-weight: 700;
        color: #10251f;
        letter-spacing: 2px;
        margin-top: 2px;
    }
    .log-logo-subtitle {
        font-size: 0.85rem;
        color: rgba(0,0,0,0.6);
        font-weight: 500;
        letter-spacing: 1px;
        margin-top: 6px;
    }
    .log-admin-profile {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 8px 16px;
        border-radius: 12px;
    }
    .log-avatar-wrapper { position: relative; width: 56px; height: 56px; }
    .log-avatar {
        width: 100%; height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .log-status-indicator {
        position: absolute; bottom: 2px; right: 2px;
        width: 14px; height: 14px;
        background: var(--success);
        border-radius: 50%;
        border: 2px solid #fff;
    }
    .log-admin-info { display: flex; flex-direction: column; }
    .log-admin-name { font-size: 1.05rem; font-weight: 700; color: #000; }
    .log-admin-role { font-size: 0.8rem; color: rgba(0,0,0,0.6); }

    /* ===== KPI-карточки (как .platform-card) ===== */
    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    .kpi-card {
        background: var(--card-bg);
        border-radius: 16px;
        padding: 22px 24px;
        box-shadow: var(--shadow);
        border-top: 4px solid var(--primary);
        transition: all 0.25s ease;
    }
    .kpi-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
    .kpi-card.warning { border-top-color: var(--warning); }
    .kpi-card.error { border-top-color: var(--error); }
    .kpi-label {
        font-size: 0.8rem;
        color: var(--text-light);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }
    .kpi-value {
        font-size: 1.9rem;
        font-weight: 800;
        color: var(--text);
        line-height: 1.1;
    }

    .section-title {
        font-size: 1.3rem;
        font-weight: 700;
        margin: 6px 0 16px 0;
        color: var(--text);
    }

    /* ===== Терминальный вывод ===== */
    .terminal-box {
        background: #10251f;
        color: #7CFC9A;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 0.92rem;
        border-radius: 14px;
        padding: 22px 26px;
        box-shadow: var(--shadow);
        white-space: pre-wrap;
        line-height: 1.5;
        margin-bottom: 30px;
    }
    .terminal-box .prompt { color: #8a9e9e; }
    </style>
    """,
    unsafe_allow_html=True,
)


# ------------------------------------------------------------------
# HEADER
# ------------------------------------------------------------------

avatar_html = (
    f'<img src="data:image/jpeg;base64,{AVATAR_B64}" class="log-avatar">'
    if AVATAR_B64
    else '<div class="log-avatar" style="background:#ccc;"></div>'
)

st.markdown(
    f"""
    <div class="log-header">
        <div class="log-logo-block">
            <h1 class="log-logo">LOG</h1>
            <div class="log-logo-sub-strong">ANALYTICS</div>
            <span class="log-logo-subtitle">Анализ логистических затрат и транспортных маршрутов</span>
        </div>
        <div class="log-admin-profile">
            <div class="log-avatar-wrapper">
                {avatar_html}
                <span class="log-status-indicator"></span>
            </div>
            <div class="log-admin-info">
                <span class="log-admin-name">Оператор</span>
                <span class="log-admin-role">Аналитик</span>
            </div>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)


# ------------------------------------------------------------------
# Загрузка данных
# ------------------------------------------------------------------

@st.cache_data
def get_data() -> pd.DataFrame:
    df = costs.load_data()
    df = costs.add_kpi_columns(df)
    return df


try:
    raw_df = get_data()
except FileNotFoundError as e:
    st.error(f"Не найден файл с данными: {e}")
    st.stop()


# ------------------------------------------------------------------
# Сайдбар — фильтры
# ------------------------------------------------------------------

st.sidebar.header("Фильтры")

min_date, max_date = raw_df["Дата"].min(), raw_df["Дата"].max()
date_range = st.sidebar.date_input(
    "Период",
    value=(min_date.date(), max_date.date()),
    min_value=min_date.date(),
    max_value=max_date.date(),
)

carriers = sorted(raw_df["Перевозчик"].unique())
selected_carriers = st.sidebar.multiselect("Перевозчик", carriers, default=carriers)

regions = sorted(set(raw_df["Регион_отправления"]) | set(raw_df["Регион_назначения"]))
selected_regions = st.sidebar.multiselect("Регион (отправления или назначения)", regions, default=[])

threshold = st.sidebar.slider("Порог аномалии тарифа, %", 5, 50, 15)

# Применяем фильтры
df = raw_df.copy()

if isinstance(date_range, tuple) and len(date_range) == 2:
    start, end = date_range
    df = df[(df["Дата"].dt.date >= start) & (df["Дата"].dt.date <= end)]

if selected_carriers:
    df = df[df["Перевозчик"].isin(selected_carriers)]

if selected_regions:
    df = df[
        df["Регион_отправления"].isin(selected_regions)
        | df["Регион_назначения"].isin(selected_regions)
    ]

if df.empty:
    st.warning("Нет рейсов по выбранным фильтрам.")
    st.stop()


# ------------------------------------------------------------------
# KPI-карточки
# ------------------------------------------------------------------

total_cost = df["Стоимость_тенге"].sum()
total_ton_km = df["Грузооборот_ткм"].sum()
avg_rate = df["Стоимость_за_ткм"].mean()
n_trips = len(df)
n_overpriced = (df["Отклонение_от_среднего_%"] > threshold).sum()

st.markdown('<div class="section-title">Ключевые показатели</div>', unsafe_allow_html=True)
st.markdown(
    f"""
    <div class="kpi-grid">
        <div class="kpi-card">
            <div class="kpi-label">Суммарные затраты</div>
            <div class="kpi-value">{total_cost:,.0f} ₸</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Грузооборот</div>
            <div class="kpi-value">{total_ton_km:,.0f} т·км</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Средний тариф</div>
            <div class="kpi-value">{avg_rate:,.2f} ₸/т·км</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Всего рейсов</div>
            <div class="kpi-value">{n_trips:,}</div>
        </div>
        <div class="kpi-card warning">
            <div class="kpi-label">Рейсов с завышенным тарифом (&gt;{threshold}%)</div>
            <div class="kpi-value">{n_overpriced}</div>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)


# ------------------------------------------------------------------
# "Терминальный" вывод — тот же текст, что печатает costs.py в консоли
# ------------------------------------------------------------------

st.markdown('<div class="section-title">Вывод программы (как в консоли)</div>', unsafe_allow_html=True)

report_text = costs.summary_report(df)
overpriced = costs.find_overpriced_trips(df, threshold_pct=threshold)

terminal_text = (
    "<span class='prompt'>$ python costs.py</span>\n\n"
    + report_text
    + f"\n=== Топ-10 рейсов с превышением тарифа (>{threshold}%) ===\n"
    + overpriced.head(10).to_string(index=False)
)

st.markdown(f'<div class="terminal-box">{terminal_text}</div>', unsafe_allow_html=True)


# ------------------------------------------------------------------
# Таблицы и графики
# ------------------------------------------------------------------

col1, col2 = st.columns(2)

with col1:
    st.markdown('<div class="section-title">Затраты по перевозчикам</div>', unsafe_allow_html=True)
    by_carrier = costs.costs_by_carrier(df)
    st.dataframe(by_carrier, use_container_width=True)

    fig_carrier = px.bar(
        by_carrier.reset_index(),
        x="Перевозчик",
        y="Общая_стоимость_тенге",
        color="Перевозчик",
        title="Затраты по перевозчикам, тенге",
    )
    fig_carrier.update_layout(showlegend=False, plot_bgcolor="white")
    st.plotly_chart(fig_carrier, use_container_width=True)

with col2:
    st.markdown('<div class="section-title">Затраты по виду транспорта</div>', unsafe_allow_html=True)
    by_transport = costs.costs_by_transport_type(df)
    st.dataframe(by_transport, use_container_width=True)

    fig_transport = px.pie(
        by_transport.reset_index(),
        names="Вид_транспорта",
        values="Общая_стоимость_тенге",
        title="Доля затрат по виду транспорта",
    )
    st.plotly_chart(fig_transport, use_container_width=True)

st.markdown('<div class="section-title">Динамика затрат по месяцам</div>', unsafe_allow_html=True)
by_month = costs.costs_by_month(df).reset_index()
fig_month = px.line(
    by_month, x="Месяц", y="Общая_стоимость_тенге", markers=True,
    title="Суммарные затраты по месяцам, тенге",
)
fig_month.update_layout(plot_bgcolor="white")
st.plotly_chart(fig_month, use_container_width=True)

st.markdown('<div class="section-title">Рейсы с завышенным тарифом</div>', unsafe_allow_html=True)
st.dataframe(overpriced, use_container_width=True)

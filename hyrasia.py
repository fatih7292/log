import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Фиксация случайных чисел для воспроизводимости
np.random.seed(42)

# Количество записей в датасете (можно поставить 50000 или 100000)
N_SAMPLES = 10000 

# 1. Справочники локаций и маршрутов Hyrasia One
locations = [
    'Промзона Курык (Hyrasia HQ)',
    'ВИЭ-Кластер Абай (Мангистау)',
    'ВИЭ-Кластер Рахым (Мангистау)',
    'Порт Актау',
    'Жанаозен',
    'Атырау (Нефтемаш)',
    'Астана (Логистический хаб)',
    'Порт Баку (Азербайджан)',
    'Порт Роттердам (Нидерланды)'
]

carriers = [
    'KazMano-Trans LLC',
    'Caspian Sea Logistics',
    'Mangystau Cargo Express',
    'Svevind Global Transport',
    'SilkWay Heavy Haulage',
    'Kuryk Port Logistics'
]

cargo_types = [
    'Компоненты ветротурбин (Лопасти/Башни)',
    'Солнечные панели и инверторы',
    'Модули электролизеров (Водород)',
    'Оборудование опреснения воды',
    'Зеленый аммиак (ЖД цистерны)',
    'Спецтехника и металлоконструкции'
]

transport_modes = ['Автотранспорт (Трал)', 'Автотранспорт (Контейнеровоз)', 'Ж/Д транспорт', 'Морской фрахт']

# 2. Генерация базовых полей
start_date = datetime(2025, 1, 1)

flight_ids = [f"HYR-{20250000 + i}" for i in range(1, N_SAMPLES + 1)]
dates = [start_date + timedelta(minutes=int(np.random.randint(0, 525600))) for _ in range(N_SAMPLES)]

orig = np.random.choice(locations, N_SAMPLES)
dest = np.random.choice(locations, N_SAMPLES)

# Убираем совпадающие точки отправления и назначения
for i in range(N_SAMPLES):
    while dest[i] == orig[i]:
        dest[i] = np.random.choice(locations)

cargo = np.random.choice(cargo_types, N_SAMPLES)
carrier_list = np.random.choice(carriers, N_SAMPLES)
t_mode = np.random.choice(transport_modes, N_SAMPLES)

# Дистанция зависит от типа маршрута (внутри региона vs экспорт/импорт)
distances = []
for o, d in zip(orig, dest):
    if 'Роттердам' in o or 'Роттердам' in d:
        distances.append(np.random.randint(3500, 4500))
    elif 'Баку' in o or 'Баку' in d:
        distances.append(np.random.randint(400, 800))
    elif 'Астана' in o or 'Астана' in d:
        distances.append(np.random.randint(1700, 2400))
    else:
        distances.append(np.random.randint(40, 450)) # Локальные рейсы по Мангистау

weights = np.round(np.random.uniform(5.0, 65.0, N_SAMPLES), 2) # Вес в тоннах

# 3. Расчет финансовой модели и внедрение аномалий
# Базовая ставка за 1 т*км в тенге (зависит от типа груза)
base_rates = np.random.uniform(30.0, 55.0, N_SAMPLES)

# Создаем маску аномалий (10% рейсов имеют искусственный перерасход +20%..+60%)
anomaly_mask = np.random.choice([True, False], N_SAMPLES, p=[0.10, 0.90])
rate_modifiers = np.where(anomaly_mask, np.random.uniform(1.20, 1.60, N_SAMPLES), 1.0)

final_rates = base_rates * rate_modifiers
costs = np.round(weights * distances * final_rates, -2) # Итоговая стоимость рейса в KZT

# 4. Сборка DataFrame
df = pd.DataFrame({
    'ID_рейса': flight_ids,
    'Дата': [d.strftime('%Y-%m-%d %H:%M') for d in dates],
    'Регион_отправления': orig,
    'Регион_назначения': dest,
    'Тип_груза': cargo,
    'Вид_транспорта': t_mode,
    'Перевозчик': carrier_list,
    'Вес_тонн': weights,
    'Расстояние_км': distances,
    'Стоимость_тенге': costs
})

# Сохранение в директорию проекта
df.to_csv('data/logistics_data.csv', index=False, encoding='utf-8-sig')

print(f"Успешно сгенерировано {len(df)} записей для проекта Hyrasia One!")
print(f"Файл сохранен по пути: data/logistics_data.csv")
print(df.head())

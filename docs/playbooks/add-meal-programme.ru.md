---
title: Добавление новой программы питания в учреждение OpenEMIS
description: Этот плейбук OpenEMIS объясняет, как создать новую программу питания в учреждении с помощью инструментов записи школьной информационной системы.
keywords:
  - OpenEMIS
  - школьная информационная система
  - управление образованием
---

# Добавление новой программы питания в учреждение OpenEMIS

**Домен:** Питание  
**Аудитория:** администратор, бухгалтер, диетолог  
**ID руководства:** `add-meal-programme`

## Описание

Создайте новое определение программы питания и назначьте её учреждению. Процесс состоит из двух шагов: сначала создайте глобальную запись программы (`meal-programmes`), затем зафиксируйте назначение на уровне учреждения (`institution-meal-programmes`). Плагин workflow не задействован — обе операции записи выполняются напрямую и немедленно. При необходимости свяжите целевые показатели по питанию и зачислите конкретных студентов.

> ⚠️ **Ловушка с псевдонимами внешних ключей:** Поля `type` и `targeting` в `meal-programmes` являются **значениями строкового перечисления (enum)**, а не числовыми ID. Передавайте строку (например, `"Lunch"`, `"All Students"`) — не ID из справочника.  
> ⚠️ **Имя внешнего ключа во множественном числе:** Внешний ключ на `meal-programmes` в таблицах `institution-meal-programmes` и `meal-nutritional-records` называется **`meal_programmes_id`** (с буквой `s` на конце) — не `meal_programme_id`. Использование формы в единственном числе приводит к тихому сбою или ошибке 422.

---

## Вопросы для предварительного уточнения

| Вопрос | Поле | Ресурс | Примечания |
|---|---|---|---|
| Название программы? | `name` | meal-programmes | Например, "Государственная программа обедов 2025" |
| Короткий код? | `code` | meal-programmes | Уникальный, например `GLP-2025` |
| Тип питания? (Завтрак / Обед / Перекус / Ужин) | `type` | meal-programmes | Строковое значение — получите допустимые варианты из `meal-programme-types` |
| Кто получает? (Все студенты / Уязвимые / Начальные классы…) | `targeting` | meal-programmes | Строковое значение — получите допустимые варианты из `meal-target-types` |
| Дата начала? | `start_date` | meal-programmes | ГГГГ-ММ-ДД |
| Дата окончания? | `end_date` | meal-programmes | ГГГГ-ММ-ДД, должна быть ≥ даты начала |
| Учебный период? | `academic_period_id` | meal-programmes | Определите через `academic-periods` |
| Дата поставки в эту школу? | `date_received` | institution-meal-programmes | ГГГГ-ММ-ДД — когда программа впервые поступает в школу |
| Ожидаемое количество / число студентов? | `quantity_received` | institution-meal-programmes | Целое число |

---

## Используемые ресурсы

| Ресурс | Назначение |
|---|---|
| `academic-periods` | Справочник: ID активного учебного периода |
| `meal-programme-types` | Справочник: допустимые строковые значения для поля `type` |
| `meal-target-types` | Справочник: допустимые строковые значения для поля `targeting` |
| `meal-implementers` | Справочник: название исполнителя → ID (для `institution-meal-programmes`) |
| `meal-programmes` | Запись: создание глобального определения программы |
| `institution-meal-programmes` | Запись: назначение / фиксация поставки в учреждении |
| `meal-nutritional-records` | Запись (опционально): связывание целевых показателей по питанию с программой |

---

## Шаги

| Шаг | Действие | Ресурс | Назначение |
|---|---|---|---|
| 1 | `openemis_get` | `academic-periods` | Определение активного `academic_period_id` |
| 2 | `openemis_get` | `meal-programme-types` | Получение списка допустимых строковых значений `type` |
| 3 | `openemis_get` | `meal-target-types` | Получение списка допустимых строковых значений `targeting` |
| 4 | `openemis_create` | `meal-programmes` | Создание глобальной записи программы |
| 5 | `openemis_create` | `institution-meal-programmes` | Назначение / фиксация поставки в этом учреждении |
| 6 | `openemis_create` (опционально) | `meal-nutritional-records` | Связывание каждого целевого показателя по питанию |

---

## Примечания к шагам

**Шаги 1–3 — Справочники**  
Получите учебный период, отфильтровав по `current = 1`, или выберите по названию. Для `meal-programme-types` и `meal-target-types` получите список всех значений — отобразите пользователю строки `name` и используйте выбранную строку в теле POST-запроса (не ID).

**Шаг 4 — Создание глобальной программы**

```json
POST /api/v5/meal-programmes
{
  "academic_period_id": 12,
  "name":               "Government Lunch Programme 2025",
  "code":               "GLP-2025",
  "type":               "Lunch",
  "targeting":          "All Students",
  "start_date":         "2025-01-06",
  "end_date":           "2025-11-28"
}
```

Ответ: содержит `id`, который будет использоваться как `meal_programmes_id` на следующем шаге.

**Шаг 5 — Назначение учреждению**

```json
POST /api/v5/institution-meal-programmes
{
  "academic_period_id":  12,
  "meal_programmes_id":  1047,
  "institution_id":      6,
  "date_received":       "2025-01-06",
  "quantity_received":   420
}
```

> ⚠️ Уникальное ограничение на `(institution_id, date_received, meal_programmes_id)` — повторные поставки для одной школы + даты + программы возвращают ошибку 409 Conflict.

**Шаг 6 — Связывание целевых показателей по питанию (Опционально)**

```json
POST /api/v5/meal-nutritional-records
{
  "meal_programmes_id":     1047,
  "nutritional_content_id": 10
}
```

Повторите для каждого компонента питания. Определите `nutritional_content_id` через `GET /api/v5/meal-nutritions`.

---

## Ключевые подводные камни

- **`type` и `targeting` являются строковыми значениями**, а не числовыми ID — используйте строку названия из `meal-programme-types` / `meal-target-types`, а не `id` из справочной таблицы.
- **`meal_programmes_id` с буквой `s` на конце** — имя поля внешнего ключа в `institution-meal-programmes` и `meal-nutritional-records`. Использование `meal_programme_id` (без `s`) приводит к тихому сбою или возвращает ошибку 422.
- **`nutritional_content_id`** (не `meal_nutrition_id` или `nutrition_id`) — подтверждённая ловушка с внешним ключом из руководства по чтению, проверено в интерфейсе записи.
- **`meal-implementers` имеет поля FieldOption** (`visible`, `order`, `default`) — включайте их в PUT-запрос, чтобы избежать сброса в null.
- **Нет плагина workflow** — операции записи по питанию выполняются напрямую и не требуют утверждения или шагов workflow.
- **409 при дублировании поставки** — уникальное ограничение — `(institution_id, date_received, meal_programmes_id)`, а не на основе периода.

---

## Пример запроса

> *"Добавить государственную программу обедов для всех студентов в начальной школе Avory, начиная с января 2025 года, код GLP-2025."*

1. `openemis_get { resource: "academic-periods", params: { current: 1 } }` → id: 12
2. `openemis_get { resource: "meal-programme-types" }` → "Breakfast", "Lunch", "Snack"
3. `openemis_get { resource: "meal-target-types" }` → "All Students", "Vulnerable", "Primary"
4. `openemis_create { resource: "meal-programmes", body: { academic_period_id: 12, name: "Government Lunch Programme 2025", code: "GLP-2025", type: "Lunch", targeting: "All Students", start_date: "2025-01-06", end_date: "2025-11-28" } }` → id: 1047
5. `openemis_create { resource: "institution-meal-programmes", body: { academic_period_id: 12, meal_programmes_id: 1047, institution_id: 6, date_received: "2025-01-06", quantity_received: 420 } }`
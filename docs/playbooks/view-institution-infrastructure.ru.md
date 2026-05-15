---
title: Просмотр инфраструктуры учреждения в OpenEMIS
description: Этот плейбук OpenEMIS объясняет, как получить данные о земельных участках, зданиях, коммунальных услугах и WASH учреждения из школьной информационной системы.
keywords:
  - OpenEMIS
  - школьная информационная система
  - управление образованием
---

# Просмотр инфраструктуры учреждения в OpenEMIS (земля, здания, коммунальные услуги, WASH)

**Домен:** Учреждение  
**Аудитория:** администратор, службы эксплуатации  
**ID сценария:** `view-institution-infrastructure`

## Описание

Просмотр физической инфраструктуры учреждения: земельные участки, здания на каждом участке, коммунальные услуги (электричество) и записи WASH (водоснабжение и санитария). **Земля и здания НЕ привязаны к `academic_period_id`** — это поле было удалено в POCOR-8037. Коммунальные услуги и WASH ПРИВЯЗАНЫ к `academic_period_id`.

---

## Используемые ресурсы

| Ресурс | Назначение |
|---|---|
| `institution-lands` | Земельные участки, зарегистрированные за учреждением (без привязки к учебному периоду) |
| `institution-buildings` | Здания, вложенные в каждый земельный участок (без привязки к учебному периоду) |
| `infrastructure-statuses` | Глобальный справочник: коды статусов IN_USE, END_OF_USAGE, CHANGE_IN_TYPE |
| `infrastructure-conditions` | Глобальный справочник: метки состояния (Хорошее, Удовлетворительное, Плохое и т.д.) |
| `land-types` | Глобальный справочник: типы земельных участков |
| `building-types` | Глобальный справочник: типы зданий |
| `infrastructure-utility-electricities` | Записи о коммунальной услуге "электричество" (привязаны к учреждению + учебный период) |
| `infrastructure-wash-waters` | Записи о водоснабжении и качестве воды (привязаны к учреждению + учебный период) |
| `infrastructure-wash-sanitations` | Количество санитарных объектов по полу и функциональности |

---

## Шаги

| Шаг | Действие | Ресурс | Назначение |
|---|---|---|---|
| 1 | `openemis_get` | `institution-lands` | Список активных земельных участков |
| 2 | `openemis_get` | `institution-buildings` | Список зданий на каждом земельном участке |
| 3 | `openemis_get` | `infrastructure-statuses` + справочники | Разрешение ID состояния, статуса, типа (параллельно) |
| 4 | `openemis_get` | `infrastructure-utility-electricities` | Записи о коммунальной услуге "электричество" |
| 5 | `openemis_get` | `infrastructure-wash-waters` | Записи WASH по воде |
| 6 | `openemis_get` | `infrastructure-wash-sanitations` | Количественные данные WASH по санитарии |

---

## Примечания к шагам

**Шаг 1 — Активные земельные участки**  
Фильтруйте по `institution_id`. **НЕ** передавайте `academic_period_id` — это поле было удалено из данного ресурса в POCOR-8037, и его передача либо не даст эффекта, либо вызовет ошибки. Чтобы получить только активные участки, также фильтруйте `land_status_id` по коду `IN_USE` из `infrastructure-statuses`. `land_type_id` и `infrastructure_condition_id` каждой записи разрешаются на шаге 3.

**Шаг 2 — Здания на участке**  
Фильтруйте по `institution_id` (все здания) или `institution_land_id` (здания одного участка). То же правило: **без `academic_period_id`**. Фильтруйте по `building_status_id` для записей со статусом `IN_USE`. `building_type_id` и `infrastructure_condition_id` каждого здания разрешаются на шаге 3. Площадь здания должна быть меньше площади родительского земельного участка (проверяется API).

**Шаг 3 — Разрешение справочных таблиц** *(можно выполнять параллельно)*  
Получите `infrastructure-statuses`, `infrastructure-conditions`, `land-types` и `building-types` одновременно — все они являются глобальными справочными списками без фильтров `institution_id` или `academic_period_id`.

> ⚠️ **Имена внешних ключей статуса зависят от уровня:** `land_status_id` для участков, `building_status_id` для зданий — оба указывают на одну и ту же таблицу `infrastructure_statuses`. Не путайте эти имена внешних ключей.

**Шаг 4 — Коммунальная услуга "Электричество"**  
Фильтруйте по `institution_id` И `academic_period_id` (оба обязательны — в отличие от земли/зданий, коммунальные услуги привязаны к периоду). Также фильтруйте `is_current=1`, чтобы исключить мягко удалённые записи (флаг добавлен в POCOR-9475). Разрешите `utility_electricity_type_id` через `/api/v5/utility-electricity-types`.

**Шаг 5 — WASH Вода**  
Фильтруйте по `institution_id` И `academic_period_id`. Все столбцы внешних ключей следуют шаблону `infrastructure_wash_water_*_id` (тип, функциональность, близость, количество, качество, доступность). Разрешите каждый через соответствующий справочный эндпоинт `/api/v5/infrastructure-wash-water-*`.

**Шаг 6 — WASH Санитария**  
Фильтруйте по `institution_id` И `academic_period_id`. Поля для подсчёта: `infrastructure_wash_sanitation_{gender}_{status}` — например, `male_functional`, `female_nonfunctional`, `mixed_functional`. Столбцы `total_male`, `total_female`, `total_mixed` **автоматически вычисляются бэкендом** в `beforeSave` — НЕ пытайтесь записывать в них. Шаги 4–6 можно выполнять параллельно, как только известны `institution_id` и `academic_period_id`.

---

## Ключевые подводные камни

- **`institution-lands` и `institution-buildings` НЕ имеют фильтра `academic_period_id`** — удалён в POCOR-8037. Никогда не передавайте его для этих двух ресурсов.
- **Внешний ключ статуса различается по уровню:** `land_status_id` для участков, `building_status_id` для зданий — одна таблица `infrastructure_statuses`, разные имена столбцов.
- **`infrastructure_ownership_id`** — правильное имя внешнего ключа как для земли, так и для зданий (не `ownership_id`).
- **Для коммунальных услуг и WASH требуется `academic_period_id`** — в отличие от основной инфраструктуры.
- **Итоговые показатели по санитарии доступны только для чтения** — они рассчитываются автоматически бэкендом.

---

## Пример запроса

> *"Покажите мне физическую инфраструктуру начальной школы Avory — землю, здания, электричество и воду."*

1. `openemis_get { resource: "institution-lands", params: { institution_id: 6 } }` → 2 земельных участка (land_status_id → IN_USE)
2. `openemis_get { resource: "institution-buildings", params: { institution_id: 6 } }` → 4 здания
3. Получите `infrastructure-statuses`, `infrastructure-conditions`, `land-types`, `building-types` параллельно → разрешите все ID
4. `openemis_get { resource: "infrastructure-utility-electricities", params: { institution_id: 6, academic_period_id: 1, is_current: 1 } }` → сетевое электричество, хорошее состояние
5. `openemis_get { resource: "infrastructure-wash-waters", params: { institution_id: 6, academic_period_id: 1 } }` → водопроводная вода, функционирует
6. `openemis_get { resource: "infrastructure-wash-sanitations", params: { institution_id: 6, academic_period_id: 1 } }` → 4 мужских, 4 женских туалета функционируют
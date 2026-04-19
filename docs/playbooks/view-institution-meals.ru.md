# Просмотр программ питания учреждения и участия студентов

**Домен:** Учреждение  
**Аудитория:** администратор, диетолог, родитель  
**ID руководства:** `view-institution-meals`

## Описание

Просмотр программ питания, которые проводит учреждение, их пищевой ценности и списка зачисленных студентов. Область действия ограничена `institution_id` и `academic_period_id`. Ключевая особенность: в `meal-nutritional-records` внешний ключ к таблице `meal_nutritions` — это `nutritional_content_id`, **а не** `meal_nutrition_id`.

---

## Используемые ресурсы

| Ресурс | Назначение |
|---|---|
| `institution-meal-programmes` | Программы питания, которые проводит учреждение в текущем академическом периоде |
| `meal-programme-types` | Глобальный справочник: названия типов программ |
| `meal-implementers` | Глобальный справочник: организации-исполнители |
| `meal-nutritional-records` | Связующая таблица, соединяющая программы с данными о пищевой ценности |
| `meal-benefits` | Глобальный справочник: названия типов льгот |
| `institution-meal-students` | Записи об участии студентов в питании по дням |

---

## Шаги

| Шаг | Действие | Ресурс | Назначение |
|---|---|---|---|
| 1 | `openemis_get` | `institution-meal-programmes` | Список активных программ питания для данного учреждения/периода |
| 2 | `openemis_get` | `meal-programme-types` + справочники | Разрешение ID типа, исполнителя, льготы (параллельно) |
| 3 | `openemis_get` | `meal-nutritional-records` | Получение данных о пищевой ценности для каждой программы |
| 4 | `openemis_get` | `institution-meal-students` | Список записей об участии студентов |

---

## Примечания к шагам

**Шаг 1 — Программы питания учреждения**  
Фильтруйте по `institution_id` И `academic_period_id`. Базовая таблица — `meal_institution_programmes` (не `institution_meal_programmes`). Каждая запись ссылается на `meal_programme_id` — сохраните это для шага 3.

> ⚠️ **Нестандартные псевдонимы внешних ключей:** Связи для типа программы, целевой группы и исполнителя в ответах API могут отображаться как `type`, `targeting` и `implementer`, а не с обычными суффиксами `_type_id`. Проверьте фактические ключи ответа перед построением дальнейших фильтров.

**Шаг 2 — Разрешение справочных таблиц** *(выполняется параллельно)*  
Получите `meal-programme-types`, `meal-implementers` и `meal-benefits` одновременно — все они являются глобальными справочными списками.  
> Примечание: `meal-implementers` **не** использует поведение FieldOption. У него есть только `id` и `name` — полей `visible`, `order` или `default` нет.

**Шаг 3 — Записи о пищевой ценности**  
Фильтруйте по `meal_programme_id` (из шага 1).

> ⚠️ **Критическая ловушка с внешним ключом:** Внешний ключ к таблице `meal_nutritions` в этом ресурсе — это `nutritional_content_id`, **НЕ** `meal_nutrition_id`. Использование неправильного имени будет молча возвращать пустые результаты. Разрешите `nutritional_content_id` через `/api/v5/meal-nutritions` для получения названия питательного вещества (например, Белки, Углеводы, Калории, Жиры).

`meal-nutritional-records` действует как связующая таблица (belongsToMany между программами и питательными веществами). У неё может быть составной первичный ключ (`meal_programme_id` + `nutritional_content_id`) без отдельного целочисленного `id` — не запрашивайте её по простому числовому id.

**Шаг 4 — Участие студентов**  
Ресурс API `institution-meal-students` соответствует таблице `student_meal_marked_records` — это записи об участии в питании **по дням**, а не статический список зачисления. Фильтруйте по `institution_id`, `academic_period_id` и, при необходимости, по `institution_class_id` или `meal_programme_id`. Поле `date` фиксирует конкретную дату участия. `meal_benefit_id` указывает тип льготы — разрешите его через `meal-benefits` из шага 2.

---

## Ключевые особенности

- **`nutritional_content_id`** — это внешний ключ к `meal_nutritions` в `meal-nutritional-records`, а не `meal_nutrition_id`. Это самая распространённая ловушка, ведущая к молчаливому сбою.
- **`institution-meal-students` содержит данные по дням**, а не список зачисления. Фильтруйте по `date` для получения количества участников за конкретный день.
- **`meal-implementers` не имеет полей FieldOption** (полей `visible`, `order`, `default` в этом ресурсе не существует).
- **Неоднозначность псевдонимов внешних ключей** в `institution-meal-programmes`: связи типа программы, цели и исполнителя могут использовать короткие ключи-псевдонимы (`type`, `targeting`, `implementer`) вместо суффиксов `_type_id` в ответах API.
- И `institution_id`, и `academic_period_id` обязательны для `institution-meal-programmes` и `institution-meal-students`.

---

## Пример запроса

> *"Какие программы питания проводит начальная школа Avory в этом году и какова их пищевая ценность?"*

1. `openemis_get { resource: "institution-meal-programmes", params: { institution_id: 6, academic_period_id: 1 } }` → 2 программы (школьное питание, дополнительное)
2. Получите `meal-programme-types`, `meal-implementers`, `meal-benefits` параллельно → разрешите названия
3. `openemis_get { resource: "meal-nutritional-records", params: { meal_programme_id: 3 } }` → белки 15г, углеводы 45г, калории 280ккал (используя nutritional_content_id для разрешения названий)
4. `openemis_get { resource: "institution-meal-students", params: { institution_id: 6, academic_period_id: 1, meal_programme_id: 3 } }` → 312 записей об участии студентов за этот семестр
# Просмотр полного профиля сотрудника


**Domain:** Staff  
**Audience:** admin, hr  
**Playbook ID:** `view-staff-profile`

## Description

Просмотр текущих и исторических профилей должности сотрудника, истории отпусков, прошлых должностей и прямых контактных данных. Объединяет четыре ресурса, используя правильные ключи фильтра для каждого из них — необходимо различать два отдельных поля идентификации сотрудника (`staff_id` и `institution_staff_id`).

---

## Resources Used

| Resource | Purpose |
|---|---|
| `institution-staff-position-profiles` | Полная занятость (FTE), статус и история назначения на должность в учреждении |
| `institution-staff-leave` | Записи об отпусках (утвержденные или ожидающие) в порядке убывания по дате |
| `historical-staff-positions` | Архивные данные об истории должностей в прошлых учреждениях |
| `user-contacts` | Номера телефонов и адреса электронной почты (глобальная таблица пользователей) |

---

## Steps

| Step | Action | Resource | Purpose |
|---|---|---|---|
| 1 | `openemis_get` | `institution-staff-position-profiles` | Получить текущие и прошлые профили должности |
| 2 | `openemis_get` | `institution-staff-leave` | Получить историю отпусков |
| 3 | `openemis_get` | `historical-staff-positions` | Получить исторические названия должностей |
| 4 | `openemis_get` | `user-contacts` | Получить контактные данные (телефон/электронная почта) |

---

## Step Notes

**Step 1 — Профили должности**  
Фильтруйте по `institution_staff_id` (ID назначения, специфичный для школы, **НЕ** глобальный `staff_id`). Чтобы найти активную запись, также отфильтруйте `status_id=1` и проверьте наличие `end_date=null`. Сортируйте по `start_date desc`.  
> ⚠️ Поле `FTE` имеет **заглавные буквы** в ответе API (`FTE`, а не `fte`). Разбирайте как число с плавающей запятой: `parseFloat(row.FTE)`. `end_date=null` означает, что сотрудник в настоящее время активен — рассматривайте `null` как «текущий», а не как пустую строку.

**Step 2 — История отпусков**  
Фильтруйте по `staff_id` — это **глобальный идентификатор человека** (внешний ключ к `security_users`), а не `institution_staff_id`. Использование `institution_staff_id` здесь вернет пустые результаты. Добавьте `?orderby=date_from&order=desc`.  
> ⚠️ `institution-staff-leave` **контролируется рабочим процессом** (status_id → WorkflowSteps). GET безопасен; операции CREATE/UPDATE/DELETE должны проходить через официальное приложение.

**Step 3 — Исторические должности**  
Фильтруйте по `institution_id`, чтобы ограничить поиск историей текущего учреждения. `historical-staff-positions` отслеживает должностные названия в прошлых учреждениях; он отличается от `institution-staff-position-profiles`, который отслеживает изменения FTE/статуса.

**Step 4 — Контактные данные**  
Фильтруйте по `security_user_id` — это глобальный идентификатор пользователя сотрудника (тот же внешний ключ, что и в шаге 2, как `staff_id`). НЕ фильтруйте по `institution_staff_id` — `user-contacts` является глобальной таблицей пользователей, не ограниченной учреждением. Разрешите `contact_type_id` относительно `/api/v5/contact-types`, чтобы отобразить понятные для человека метки (например, "Мобильный", "Email").

---

## Key Gotchas

- **Два поля идентификации сотрудника:**
  - `staff_id` = глобальный человек во всех школах (внешний ключ к `security_users`) — используйте для отпусков (шаг 2) и контактов (шаг 4).
  - `institution_staff_id` = назначение этого человека в конкретной школе — используйте для профилей должности (шаг 1).
- **`FTE` в верхнем регистре** в ответе API: `row.FTE`, а не `row.fte`. Преобразуйте в число с плавающей запятой перед отображением или вычислением.
- **`institution-staff-leave` контролируется рабочим процессом.** GET всегда безопасен. Для операций CREATE/UPDATE/DELETE направляйте пользователя в официальное приложение OpenEMIS.
- **`user-contacts` охватывает как телефон, так и электронную почту** в одном эндпоинте. `contact_type_id` должен быть разрешен через `/api/v5/contact-types`, чтобы получить понятные для человека метки.

---

## Example Query

> *"Покажите мне все о учителе Саре Ли — ее должность, отпуск за этот год и как с ней связаться."*

1. `openemis_get { resource: "institution-staff-position-profiles", params: { institution_staff_id: 15, status_id: 1 } }` → FTE 1.0, Грейд учителя 3
2. `openemis_get { resource: "institution-staff-leave", params: { staff_id: 88, orderby: "date_from", order: "desc" } }` → 3 записи об отпуске
3. `openemis_get { resource: "historical-staff-positions", params: { institution_id: 6 } }` → 2 прошлые должности
4. `openemis_get { resource: "user-contacts", params: { security_user_id: 88 } }` → мобильный +60-12-345-6789
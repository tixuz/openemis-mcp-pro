# Просмотр полного профиля класса

**Домен:** Студент  
**Аудитория:** учитель, администратор  
**ID руководства:** `view-class-profile`

## Описание

Просмотр профиля класса: назначение уровня обучения, список зачисленных студентов, активные предметы, сводка посещаемости за месяц и полный список преподавателей (классный руководитель + второстепенные + предметные учителя). Ресурс посещаемости использует составной первичный ключ — целочисленного поля `id` нет; всегда используйте фильтры в стиле списка для его получения. Список преподавателей распределён по трём таблицам и требует фан-аута и дедупликации.

---

## Используемые ресурсы

| Ресурс | Назначение |
|---|---|
| `institution-classes` | Сама запись класса — содержит `staff_id` (внешний ключ на классного руководителя) |
| `institution-class-grades` | Определение, к какому уровню образования относится этот класс |
| `institution-class-students` | Все студенты, зачисленные в класс на данный момент |
| `institution-class-subjects` | Предметы, активно преподаваемые в этом классе |
| `institution-subjects` | Получение названий предметов по `institution_subject_id` |
| `institution-class-attendance-records` | Сводка посещаемости за месяц (количество присутствующих студентов по дням) |
| `institution-classes-secondary-staff` | Совместно преподающие учителя / второстепенный персонал, назначенный на класс |
| `institution-subject-staff` | Предметные учителя — одна запись на пару (предмет, сотрудник) |

---

## Шаги

| Шаг | Действие | Ресурс | Назначение |
|---|---|---|---|
| 1 | `openemis_get` | `institution-class-grades` | Определить уровень обучения для этого класса |
| 2 | `openemis_get` | `institution-class-students` | Получить список зачисленных студентов |
| 3 | `openemis_get` | `institution-class-subjects` | Получить список активных предметов |
| 4 | `openemis_get` | `institution-class-attendance-records` | Получить сводку посещаемости за месяц |
| 5 | `openemis_get` × 3 | `institution-classes` · `institution-classes-secondary-staff` · `institution-subject-staff` | Список преподавателей (фан-аут, объединение, дедупликация по `staff_id`) |

---

## Примечания к шагам

**Шаг 1 — Назначение уровня класса**  
Фильтруйте по `institution_class_id`. Возвращает `education_grade_id` — таблица соответствия (класс ↔ уровень). Обычно одна запись на класс, но допустимы конфигурации с несколькими уровнями.

**Шаг 2 — Зачисленные студенты**  
Фильтруйте по `institution_class_id` и `academic_period_id`. Установите `student_status_id=1`, чтобы вернуть только студентов, зачисленных в данный момент. Это таблица связей — поле `id` здесь является идентификатором записи о зачислении, а не идентификатором студента. `student_id` — это внешний ключ на `security_users`.

**Шаг 3 — Активные предметы**  
Фильтруйте по `institution_class_id` и `status=1`, чтобы вернуть только активные предметы. Названия предметов не включены — только внешний ключ `institution_subject_id`. При необходимости получайте названия отдельно через `institution-subjects`.

**Шаг 4 — Сводка посещаемости за месяц**  
> ⚠️ **ВАЖНО:** У `institution-class-attendance-records` **НЕТ целочисленного поля `id`**. Его первичный ключ составной: `(institution_class_id, academic_period_id, year, month)`. **НИКОГДА** не передавайте параметр `id=` — это вернёт пустой результат или ошибку.

Используйте только фильтры списка:
```
?institution_class_id={id}&academic_period_id={period}&year={year}&month={month}
```
Или используйте путь с составным ключом:
```
GET /institution-class-attendance-records/institution_class_id/{X}/academic_period_id/{Y}/year/{Z}/month/{M}
```
Поля `day_1` через `day_31` содержат количество присутствующих за день; `null` означает, что данные о посещаемости за этот день ещё не внесены.

**Шаг 5 — Список преподавателей**  
Нет единого эндпоинта, возвращающего полный список преподавателей для класса. Выполните фан-аут по трём таблицам и объедините по `staff_id`:

**(a) Классный руководитель** — находится в самой записи класса:
```
openemis_get { resource: "institution-classes", id: 42 }
→ row.staff_id  (один внешний ключ на security_users; может быть null)
```

**(b) Второстепенные / совместно преподающие учителя** — специальная таблица связей (составной первичный ключ, нет целочисленного `id`):
```
openemis_get { resource: "institution-classes-secondary-staff",
               params: { institution_class_id: 42 } }
→ записи с secondary_staff_id (внешний ключ на security_users)
```

**(c) Предметные учителя** — одна запись на пару (предмет, сотрудник). НЕ фильтруется напрямую по `institution_class_id`; выполните фан-аут по списку `institution_subject_id` из шага 3:
```
для каждого institution_subject_id из шага 3:
  openemis_get { resource: "institution-subject-staff",
                 params: { institution_subject_id: subjId } }
→ записи с staff_id
```

**Дедупликация + получение имён.** Один человек может фигурировать в нескольких списках (классный руководитель часто также преподаёт предмет). Объедините по `staff_id`, затем получите имена одним запросом:
```
openemis_get { resource: "security-users",
               params: { ids: "13,42,99" } }
```

---

## Ключевые подводные камни

- **Составной первичный ключ — нет целочисленного id.** Первичный ключ `institution-class-attendance-records` — `(institution_class_id, academic_period_id, year, month)`. Любой вызов с использованием простого числового фильтра `id=` завершится ошибкой или вернёт неверные данные.
- **Только месячные агрегаты.** Этот ресурс содержит количество присутствующих по дням. Это НЕ журнал отсутствий по студентам — для индивидуальных пропусков используйте `student-attendance-marked-records`.
- **Поля `day_X` со значением `null` ≠ нулю.** Поля `day_X` возвращают `null` для дней, по которым данные о посещаемости не внесены — трактуйте это как `Ожидает`, а не как `0 отсутствующих`.
- **Список преподавателей фрагментирован.** Классный руководитель находится в `institution-classes.staff_id`, совместно преподающие — в `institution-classes-secondary-staff`, предметные учителя — в `institution-subject-staff`. Нет единого эндпоинта, который их объединяет — выполните фан-аут и дедупликацию.
- **Составной первичный ключ `institution-classes-secondary-staff`.** `(institution_class_id, secondary_staff_id)`. Используйте фильтры списка — не передавайте числовой `id=`.
- **`institution-subject-staff` не фильтруется по классу.** Фильтруйте только по `institution_subject_id`; перебирайте идентификаторы предметов класса из шага 3.
- **Видимость на основе ролей на сегодня является задачей клиента.** Директора, заместители и администраторы должны видеть *все* классы в своём учреждении, но API пока не предоставляет эндпоинт «классы, которые я могу просматривать». Обратный запрос («какие классы может видеть этот `staff_id`?») требует того же фан-аута по трём таблицам плюс проверку роли — выделенный базовый эндпоинт находится в планах разработки OpenEMIS.

---

## Пример запроса

> *«Покажите мне профиль класса 8А для текущего учебного периода.»*

1. `openemis_get { resource: "institution-class-grades", params: { institution_class_id: 42 } }` → 8-й уровень
2. `openemis_get { resource: "institution-class-students", params: { institution_class_id: 42, academic_period_id: 1, student_status_id: 1 } }` → 28 студентов
3. `openemis_get { resource: "institution-class-subjects", params: { institution_class_id: 42, status: 1 } }` → 7 предметов (ID `[101, 102, …, 107]`)
4. `openemis_get { resource: "institution-class-attendance-records", params: { institution_class_id: 42, academic_period_id: 1, year: 2024, month: 3 } }` → количество присутствующих за март 2024
5. Список преподавателей:
   - `openemis_get { resource: "institution-classes", id: 42 }` → классный руководитель `staff_id=7`
   - `openemis_get { resource: "institution-classes-secondary-staff", params: { institution_class_id: 42 } }` → совместно преподающие `[12, 19]`
   - `openemis_get { resource: "institution-subject-staff", params: { institution_subject_id: 101 } }` × 7 → предметные учителя `[7, 23, 41, 58, …]`
   - Объединение + дедупликация → `{7, 12, 19, 23, 41, 58, …}`
   - `openemis_get { resource: "security-users", params: { ids: "7,12,19,23,41,58" } }` → имена одним запросом
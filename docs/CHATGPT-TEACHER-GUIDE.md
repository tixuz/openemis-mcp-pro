---
title: Using ChatGPT to Mark Student Attendance and Manage School Records via OpenEMIS
description: Step-by-step guide for setting up a ChatGPT Custom GPT connected to openemis-mcp-pro, letting teachers mark student attendance and query school management data.
keywords:
  - OpenEMIS
  - student attendance
  - school management system
  - ChatGPT Custom GPT
  - education management
  - MCP
---

# Using ChatGPT to Mark Student Attendance and Manage School Records via OpenEMIS

This guide explains how to connect a ChatGPT Custom GPT to your OpenEMIS school management system through openemis-mcp-pro. It is in two parts:

- **Part A — IT setup (do once):** Create a shared school GPT that teachers can open.
- **Part B — Teacher use:** How to chat with it every day.

---

## Part A — IT Admin Setup

### What you need

| Item | Where to get it |
|---|---|
| ChatGPT Team or Plus plan | [chatgpt.com](https://chatgpt.com) — at least one staff member needs this |
| Server URL | The URL of your openemis-mcp-pro installation, e.g. `http://203.0.113.10:3000` |
| Auth token | The value you set in `OPENEMIS_AUTH_TOKEN` in your server's `.env` |

---

### Step 1 — Open GPT Builder

1. Go to [chatgpt.com](https://chatgpt.com) and log in.
2. Click your profile picture (top right) → **My GPTs** → **Create a GPT**.

---

### Step 2 — Configure the GPT

Click **Configure** (top tab).

| Field | What to enter |
|---|---|
| **Name** | School Assistant — OpenEMIS |
| **Description** | Mark attendance, look up student records, manage school data |
| **Instructions** | Paste the block below |

**Instructions to paste:**

```
You are a school management assistant connected to OpenEMIS, the school's information system.

Your job:
- Help teachers mark attendance, look up students, check grades, and manage school records.
- Always use the getPlaybook action first when you are not sure how to do a task.
- Always confirm with the teacher before writing or changing any data.
- Speak in plain, friendly language. Never show raw JSON to the teacher.

When marking attendance:
1. Ask the teacher for their class name if they haven't given it.
2. Ask for today's date if it is unclear.
3. Ask them to name any absent or late students; everyone not mentioned is present.
4. Show a summary and ask "Shall I mark this now?" before submitting.
5. After submitting, confirm with "Done — [X] students marked."

Important rules:
- Only mark students for the teacher's own class.
- If a name matches more than one student, ask the teacher to clarify.
- Never invent student names or IDs — always look them up first.
```

---

### Step 3 — Add the Action

1. Scroll down to **Actions** → click **Create new action**.
2. Fill in:

| Field | Value |
|---|---|
| **Authentication** | API Key |
| **API Key** | Paste your `OPENEMIS_AUTH_TOKEN` value |
| **Auth type** | Bearer |
| **Schema** | Click **Import from URL** → enter `http://YOUR-SERVER:3000/openapi.json` |

3. Click **Import**. ChatGPT reads the schema and shows the available actions.
4. Click **Save** (top right of GPT Builder).

> 💡 The `/openapi.json` URL is public (no auth required) so ChatGPT can import it. All other endpoints require the Bearer token you set above.

---

### Step 4 — Share with teachers

1. In the GPT Builder, set **Access** to **Anyone with the link** (or **Only me** for testing first).
2. Copy the link and send it to teachers via email or your school messaging app.
3. Teachers open the link — no installation, no accounts beyond their own ChatGPT login.

> Teachers need at least **ChatGPT Free** to use a shared GPT. Free plan supports GPT usage in chat.

---

## Part B — Teacher's Daily Use

### Opening the assistant

Open the link your IT admin sent you. It opens a chat window — just type naturally.

---

### Marking attendance

**Say:**
> "Mark attendance for Class 7A today. Everyone is present except Ahmed — he's unexcused absent. Fatima is late."

The assistant will show you a summary:

> "I'll mark Ahmed as unexcused absent and Fatima as late in Class 7A for [today's date]. Everyone else is present. Shall I submit this?"

Reply **"Yes"** and it's done.

---

### More things you can ask

| Task | What to say |
|---|---|
| Check who was absent yesterday | "Who was absent in Class 7A yesterday?" |
| Mark a whole class present | "Everyone was present in 7B today." |
| Record an excused absence with reason | "Mark Lena absent today — excused, family emergency." |
| Look up a student | "Show me Omar Hassan's attendance this month." |
| Check today's roll call status | "Has today's attendance been taken for Class 8B?" |
| See a student's report card marks | "What are Maria's grades for this term?" |
| Record a behaviour incident | "Record a behaviour incident for James in 7A — disruptive in class." |

---

### Tips

- **You can speak casually.** The assistant understands "everyone's here except Tom and he's sick" just as well as formal language.
- **The assistant always asks before saving.** You will see a summary before anything is written to the system.
- **If a name is ambiguous,** the assistant will ask "Did you mean Ahmed Al-Rashid or Ahmed Karimi?" — just clarify.
- **If something goes wrong,** say "Cancel that" or "Start over" and the assistant will discard the action.
- **Dates:** If you don't say a date, the assistant assumes today. Say "yesterday" or "last Monday" for past dates.

---

### What the assistant cannot do

- It cannot give you the admin password or any other teacher's data.
- It cannot mark attendance for a class you are not assigned to (the system enforces this).
- It cannot process photos or PDFs — describe the situation in text.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "I couldn't connect to the school system" | Ask your IT admin to check the server is running (`/health` probe). |
| "I don't know that class" | The class name might be slightly different in the system. Ask your admin for the exact name. |
| "422 validation error" | A required field is missing — tell the assistant what's missing and it will retry. |
| The assistant responds in English but teachers speak another language | Ask it: "Please respond in [Arabic / Spanish / Hindi / Russian]." |

---

---

**Related docs:** [Glossary](GLOSSARY.md) · [FAQ](FAQ.md) · [Mark Student Attendance playbook](playbooks/mark-student-attendance.md) · [Resource Reference](resources.md)

*Generated by openemis-mcp-pro — [github.com/tixuz/openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro)*

#!/usr/bin/env python3
"""
Translate openemis-mcp docs into ru/ar/hi/es using DeepSeek (deepseek-chat).
Skips files that already exist. Safe to re-run.

Requires: DEEPSEEK_API_KEY in environment (set in ~/.zshrc)
Model:    deepseek-chat  (DeepSeek-V3, large context, fast, cheap)
"""
import json, os, sys, urllib.request, urllib.error
from pathlib import Path

API_URL  = "https://api.deepseek.com/chat/completions"
MODEL    = "deepseek-chat"
BASE     = Path(__file__).resolve().parent.parent
LANGS    = [
    ("ru", "Russian"),
    ("es", "Spanish"),
    ("hi", "Hindi"),
    ("ar", "Arabic"),
]

# ── Prompt templates ──────────────────────────────────────────────────────────

SYSTEM_BASE = (
    "You are a professional technical translator for an education management system (OpenEMIS). "
    "Translate the following Markdown document faithfully into {lang_name}.\n\n"
    "UNIVERSAL RULES (apply to all languages):\n"
    "- Keep ALL Markdown formatting, table structure, heading levels, bold, italic exactly as-is.\n"
    "- NEVER translate anything inside backticks (`like_this`) or code blocks (``` blocks).\n"
    "- NEVER translate: resource slugs (institution-lands, openemis_get, etc), field names "
    "(institution_id, academic_period_id), URLs, file paths, or JSON keys.\n"
    "- Preserve all emoji callouts (⚠️ 📌 ✅) unchanged.\n"
    "- Preserve bold emphasis (**text**) and WARNING-STYLE CAPS in the target language.\n\n"
    "LANGUAGE-SPECIFIC RULES:\n"
    "{lang_rules}\n\n"
    "Output ONLY the translated Markdown — no explanation, no preamble, no commentary."
)

LANG_RULES = {
    "Russian": (
        "Register: formal. Use ВЫ (вы) throughout. Imperative mood for instructions "
        "(«Передайте», «Используйте», «Не передавайте»). "
        "Translate conceptual nouns: 'resource' → 'ресурс', 'endpoint' → 'эндпоинт'. "
        "Translate UI menu paths: 'Administration → System Configuration → Student' → "
        "'Администрирование → Конфигурация системы → Студент'."
    ),
    "Arabic": (
        "Register: formal Modern Standard Arabic (فصحى). Address form: أنتم (plural formal) for instructions. "
        "Translate conceptual terms: 'resource' → 'مورد', 'endpoint' → 'نقطة نهاية'. "
        "Text flows RTL but code blocks remain LTR — do not change code block direction. "
        "Translate UI menu labels into Arabic; keep English in parentheses on first use if space allows."
    ),
    "Hindi": (
        "Register: formal, respectful. Use आप (aap). Mix Hindi with English technical loan words naturally. "
        "Translate: 'resource' → 'संसाधन', 'endpoint' → 'एंडपॉइंट' (loan word acceptable). "
        "Translate UI menu paths: 'Administration → System Configuration → Student' → "
        "'प्रशासन → सिस्टम कॉन्फ़िगरेशन → छात्र'."
    ),
    "Spanish": (
        "Register: formal. Use USTED (usted) for singular instructions throughout. "
        "Latin America variant preferred for wider reach. "
        "Translate: 'resource' → 'recurso', 'endpoint' → 'endpoint' (accepted in tech Spanish). "
        "Translate UI menu paths: 'Administration → System Configuration → Student' → "
        "'Administración → Configuración del sistema → Estudiante'."
    ),
}

# ── API call ──────────────────────────────────────────────────────────────────

def call_deepy(text: str, lang_name: str) -> str:
    """
    Primary translator: DeepSeek-V3 (fast, cheap).
    Fallback chain if quota exhausted (HTTP 402/429):
      1. Coddy subagent (GPT-5 via ChatGPT subscription)
      2. Gemmy via LM Studio — run old Gemma version at localhost:1234
    """
    api_key = os.environ.get("DEEPSEEK_API_KEY", "")
    if not api_key:
        raise EnvironmentError("DEEPSEEK_API_KEY not set. Run: source ~/.zshrc")

    system_prompt = SYSTEM_BASE.format(
        lang_name=lang_name,
        lang_rules=LANG_RULES[lang_name],
    )
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": text},
        ],
        "temperature": 0.1,
        "max_tokens":  8192,
    }).encode("utf-8")

    req = urllib.request.Request(
        API_URL,
        data=payload,
        headers={
            "Content-Type":  "application/json",
            "Authorization": f"Bearer {api_key}",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {body}") from e

    return data["choices"][0]["message"]["content"]

# ── File translation ──────────────────────────────────────────────────────────

def translate_file(src: Path, lang_code: str, lang_name: str) -> Path:
    dst = src.with_suffix(f".{lang_code}.md")
    if dst.exists():
        print(f"  skip (exists): {dst.name}")
        return dst

    content = src.read_text(encoding="utf-8")

    # DeepSeek-V3 supports 64k context — no chunking needed for normal docs.
    # Chunk only for very large files (resources.md, README) over 24k chars.
    MAX_CHARS = 24_000
    if len(content) > MAX_CHARS:
        chunks = [content[i:i+MAX_CHARS] for i in range(0, len(content), MAX_CHARS)]
        translated_parts = []
        for idx, chunk in enumerate(chunks):
            print(f"    chunk {idx+1}/{len(chunks)}...", end=" ", flush=True)
            translated_parts.append(call_deepy(chunk, lang_name))
            print("done")
        translated = "\n".join(translated_parts)
    else:
        translated = call_deepy(content, lang_name)

    dst.write_text(translated, encoding="utf-8")
    return dst

# ── Main ──────────────────────────────────────────────────────────────────────

FILES = (
    [BASE / "README.md"] +
    sorted((BASE / "docs/playbooks").glob("*.md")) +
    [BASE / "docs/resources.md"]
)
# skip already-translated files
FILES = [f for f in FILES if not any(f.name.endswith(f".{lc}.md") for lc, _ in LANGS)]

total  = len(FILES) * len(LANGS)
done   = 0
errors = []

print(f"DeepSeek translator — {len(FILES)} source files × {len(LANGS)} languages = {total} jobs")

for lang_code, lang_name in LANGS:
    print(f"\n{'='*60}")
    print(f"Language: {lang_name} ({lang_code})")
    print(f"{'='*60}")
    for src in FILES:
        print(f"  {src.relative_to(BASE)}  →  {lang_code}...", end=" ", flush=True)
        try:
            dst = translate_file(src, lang_code, lang_name)
            size = dst.stat().st_size
            print(f"✅  {size:,} bytes")
            done += 1
        except Exception as e:
            print(f"❌  {e}")
            errors.append((src.name, lang_code, str(e)))

print(f"\n{'='*60}")
print(f"Done: {done}/{total}   Errors: {len(errors)}")
for f, lc, err in errors:
    print(f"  ERROR {f} [{lc}]: {err}")

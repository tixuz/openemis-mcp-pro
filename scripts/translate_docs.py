#!/usr/bin/env python3
"""
Translate openemis-mcp docs into ru/ar/hi/es using Gemma 4e4b via LM Studio.
Skips files that already exist. Safe to re-run.
"""
import json, subprocess, sys, time
from pathlib import Path

MODEL    = "google/gemma-4-e4b"
BASE     = Path(__file__).resolve().parent.parent
LANGS    = [
    ("ru", "Russian"),
    ("es", "Spanish"),
    ("hi", "Hindi"),
    ("ar", "Arabic"),
]

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

FILES = (
    [BASE / "README.md"] +
    sorted((BASE / "docs/playbooks").glob("*.md")) +
    [BASE / "docs/resources.md"]
)
# skip already-translated files
FILES = [f for f in FILES if not any(f.name.endswith(f".{lc}.md") for lc,_ in LANGS)]

def call_gemma(text: str, lang_name: str) -> str:
    system_prompt = SYSTEM_BASE.format(
        lang_name=lang_name,
        lang_rules=LANG_RULES[lang_name],
    )
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": text},
        ],
        "temperature": 0.1,
        "max_tokens":  3000,
    }
    r = subprocess.run(
        ["curl", "-s", "http://localhost:1234/v1/chat/completions",
         "-H", "Content-Type: application/json",
         "-d", json.dumps(payload)],
        capture_output=True, text=True, timeout=300,
    )
    data = json.loads(r.stdout)
    return data["choices"][0]["message"]["content"]

def translate_file(src: Path, lang_code: str, lang_name: str) -> Path:
    # For README and resources.md → same dir; for playbooks → same dir
    dst = src.with_suffix(f".{lang_code}.md")
    if dst.exists():
        print(f"  skip (exists): {dst.name}")
        return dst

    content = src.read_text(encoding="utf-8")

    # Chunk if very large (>6000 chars) to stay in Gemma's context
    MAX_CHARS = 6000
    if len(content) > MAX_CHARS:
        chunks = [content[i:i+MAX_CHARS] for i in range(0, len(content), MAX_CHARS)]
        translated_parts = []
        for idx, chunk in enumerate(chunks):
            print(f"    chunk {idx+1}/{len(chunks)}...", end=" ", flush=True)
            translated_parts.append(call_gemma(chunk, lang_name))
            print("done")
        translated = "\n".join(translated_parts)
    else:
        translated = call_gemma(content, lang_name)

    dst.write_text(translated, encoding="utf-8")
    return dst

total = len(FILES) * len(LANGS)
done  = 0
errors = []

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
print(f"Done: {done}/{total}  Errors: {len(errors)}")
for f, lc, err in errors:
    print(f"  ERROR {f} [{lc}]: {err}")

#!/usr/bin/env python3
"""
Translate the free-repo README.md into ru/es/hi/ar using DeepSeek (deepseek-chat).
Output written to /Users/khindol/webstore/utils/openemis-mcp/README.{lang}.md
"""
import json, os, urllib.request, urllib.error
from pathlib import Path

API_URL  = "https://api.deepseek.com/chat/completions"
MODEL    = "deepseek-chat"
FREE_ROOT = Path("/Users/khindol/webstore/utils/openemis-mcp")
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
    "- Preserve all emoji callouts (⚠️ 📌 ✅ 🌐 ✏️) unchanged.\n"
    "- Preserve bold emphasis (**text**) and WARNING-STYLE CAPS in the target language.\n\n"
    "LANGUAGE-SPECIFIC RULES:\n"
    "{lang_rules}\n\n"
    "Output ONLY the translated Markdown — no explanation, no preamble, no commentary."
)

LANG_RULES = {
    "Russian": (
        "Register: formal. Use ВЫ (вы) throughout. Imperative mood for instructions. "
        "Translate conceptual nouns: 'resource' → 'ресурс', 'endpoint' → 'эндпоинт'. "
        "Translate UI menu paths and section headings naturally."
    ),
    "Arabic": (
        "Register: formal Modern Standard Arabic (فصحى). Address form: أنتم for instructions. "
        "Translate conceptual terms: 'resource' → 'مورد', 'endpoint' → 'نقطة نهاية'. "
        "Text flows RTL but code blocks remain LTR."
    ),
    "Hindi": (
        "Register: formal, respectful. Use आप (aap). Mix Hindi with English technical loan words naturally. "
        "Translate: 'resource' → 'संसाधन', 'endpoint' → 'एंडपॉइंट' (loan word acceptable)."
    ),
    "Spanish": (
        "Register: formal. Use USTED (usted) for singular instructions throughout. "
        "Latin America variant preferred. "
        "Translate: 'resource' → 'recurso', 'endpoint' → 'endpoint' (accepted in tech Spanish)."
    ),
}

def call_deepy(text: str, lang_name: str) -> str:
    api_key = os.environ.get("DEEPSEEK_API_KEY", "")
    if not api_key:
        raise EnvironmentError("DEEPSEEK_API_KEY not set.")
    system_prompt = SYSTEM_BASE.format(lang_name=lang_name, lang_rules=LANG_RULES[lang_name])
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": text},
        ],
        "temperature": 0.1,
        "max_tokens": 8192,
    }).encode("utf-8")
    req = urllib.request.Request(
        API_URL, data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {body}") from e
    return data["choices"][0]["message"]["content"]

src = FREE_ROOT / "README.md"
content = src.read_text(encoding="utf-8")
print(f"Free README: {len(content):,} chars  →  {len(LANGS)} languages")

for lang_code, lang_name in LANGS:
    dst = FREE_ROOT / f"README.{lang_code}.md"
    if dst.exists():
        print(f"  skip (exists): {dst.name}")
        continue
    print(f"  translating → {lang_name}...", end=" ", flush=True)
    try:
        translated = call_deepy(content, lang_name)
        dst.write_text(translated, encoding="utf-8")
        print(f"✅  {dst.stat().st_size:,} bytes")
    except Exception as e:
        print(f"❌  {e}")

print("Done.")

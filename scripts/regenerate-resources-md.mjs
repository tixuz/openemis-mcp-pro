#!/usr/bin/env node
/**
 * Regenerate docs/resources.md (and translated variants) from data/grouped-manifest.json.
 *
 * Output shape:
 *   - Header: total resources, total endpoints, version banner.
 *   - Legend: ✅ available · 🔒 workflow-only · — not available.
 *   - Table: one row per resource, grouped by family prefix, showing
 *     GET / POST / PUT / DELETE availability and a write-status column.
 *
 * Variants:
 *   --variant=free  : write column says "— (pro)" when POST/PUT/DELETE would be exposed
 *   --variant=pro   : write column says "✅ v1.0.0 live" for any non-workflow row
 *
 * Languages (output path):
 *   --lang=en   → docs/resources.md         (default)
 *   --lang=ru   → docs/resources.ru.md
 *   --lang=es   → docs/resources.es.md
 *   --lang=hi   → docs/resources.hi.md
 *   --lang=ar   → docs/resources.ar.md
 *
 * Usage:
 *   node scripts/regenerate-resources-md.mjs --variant=pro --lang=ru [--write]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, "..");

const args = process.argv.slice(2);
const variant = args.find((a) => a.startsWith("--variant="))?.split("=")[1] ?? "free";
if (!["free", "pro"].includes(variant)) {
  console.error(`ERROR: --variant must be 'free' or 'pro' (got '${variant}')`);
  process.exit(2);
}
const lang = args.find((a) => a.startsWith("--lang="))?.split("=")[1] ?? "en";
if (!["en", "ru", "es", "hi", "ar"].includes(lang)) {
  console.error(`ERROR: --lang must be one of en/ru/es/hi/ar (got '${lang}')`);
  process.exit(2);
}
const WRITE = args.includes("--write");

const groupedPath = resolve(PKG_ROOT, "data/grouped-manifest.json");
const outFilename = lang === "en" ? "resources.md" : `resources.${lang}.md`;
const outPath = resolve(PKG_ROOT, "docs", outFilename);
if (!existsSync(groupedPath)) {
  console.error(`ERROR: grouped manifest not found at ${groupedPath}`);
  process.exit(2);
}

const g = JSON.parse(readFileSync(groupedPath, "utf-8"));
const version = "v1.1.0";

// Workflow-controlled resources (writes blocked; reads safe).
const WORKFLOW_BLOCKED = new Set([
  "InstitutionStaffLeave",
  "InstitutionStudentAdmission",
  "InstitutionStudentEnrolment",
  "ScholarshipApplications",
  "InstitutionStaffTransferRequests",
  "InstitutionStudentTransferRequests",
  "StaffLeaveRequests",
  "StaffPositionTitles",
]);

// Per-language strings. Domain prefixes (PascalCase) are kept as-is.
const I18N = {
  en: {
    title: "OpenEMIS MCP — Resource Reference",
    bannerResources: (n) => `**${n} resources**`,
    bannerEndpoints: (n) => `**${n} endpoints**`,
    coreLine: "OpenEMIS Core 5.10.0",
    distroFree: "the FREE distribution — read-only. Writes (POST/PUT/DELETE) live in [openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro).",
    distroPro: "the PRO distribution — read + write. Workflow-controlled resources are blocked at the tool layer (🔒); use the appropriate playbook instead.",
    contextLine1: "The MCP does **not** load this table into AI context. It uses a compact",
    contextLine2: "`grouped-manifest.json` (~210 KB) with domain buckets + playbooks.",
    contextLine3: "The agent navigates by domain/playbook and pulls endpoint details on demand.",
    legendHeading: "Legend",
    legendSymbol: "Symbol",
    legendMeaning: "Meaning",
    legendAvailable: "Available",
    legendWorkflow: "Workflow-only — use the appropriate playbook, not a direct write",
    legendNot: "Not available for this resource",
    resourcesHeading: "Resources",
    colResource: "Resource",
    colDomain: "Domain",
    colWrite: "Write Status",
    singletons: "singletons",
    statusLive: "✅ v1.0.0 live",
    statusWorkflow: "🔒 workflow",
    statusReadOnly: "— (read-only)",
    statusProOnly: "— (pro)",
    statusNone: "—",
  },
  ru: {
    title: "OpenEMIS MCP — Справочник ресурсов",
    bannerResources: (n) => `**${n} ресурсов**`,
    bannerEndpoints: (n) => `**${n} эндпоинтов**`,
    coreLine: "OpenEMIS Core 5.10.0",
    distroFree: "БЕСПЛАТНЫЙ дистрибутив — только чтение. Запись (POST/PUT/DELETE) живёт в [openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro).",
    distroPro: "PRO-дистрибутив — чтение + запись. Ресурсы, управляемые workflow, заблокированы на уровне инструмента (🔒); используйте соответствующий playbook вместо прямой записи.",
    contextLine1: "MCP **не** загружает эту таблицу в контекст ИИ. Он использует компактный",
    contextLine2: "`grouped-manifest.json` (~210 KB) с доменными корзинами и playbooks.",
    contextLine3: "Агент перемещается по доменам и playbooks, подтягивая детали эндпоинтов по запросу.",
    legendHeading: "Легенда",
    legendSymbol: "Символ",
    legendMeaning: "Значение",
    legendAvailable: "Доступно",
    legendWorkflow: "Только через workflow — используйте соответствующий playbook, не прямую запись",
    legendNot: "Недоступно для этого ресурса",
    resourcesHeading: "Ресурсы",
    colResource: "Ресурс",
    colDomain: "Домен",
    colWrite: "Статус записи",
    singletons: "одиночные",
    statusLive: "✅ v1.0.0 live",
    statusWorkflow: "🔒 workflow",
    statusReadOnly: "— (только чтение)",
    statusProOnly: "— (pro)",
    statusNone: "—",
  },
  es: {
    title: "OpenEMIS MCP — Referencia de Recursos",
    bannerResources: (n) => `**${n} recursos**`,
    bannerEndpoints: (n) => `**${n} endpoints**`,
    coreLine: "OpenEMIS Core 5.10.0",
    distroFree: "la distribución GRATUITA — solo lectura. Las escrituras (POST/PUT/DELETE) viven en [openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro).",
    distroPro: "la distribución PRO — lectura + escritura. Los recursos controlados por workflow están bloqueados en la capa de herramienta (🔒); usa el playbook correspondiente en lugar de escritura directa.",
    contextLine1: "El MCP **no** carga esta tabla en el contexto de la IA. Utiliza un",
    contextLine2: "`grouped-manifest.json` compacto (~210 KB) con dominios y playbooks.",
    contextLine3: "El agente navega por dominio/playbook y obtiene los detalles del endpoint bajo demanda.",
    legendHeading: "Leyenda",
    legendSymbol: "Símbolo",
    legendMeaning: "Significado",
    legendAvailable: "Disponible",
    legendWorkflow: "Solo workflow — usa el playbook apropiado, no escritura directa",
    legendNot: "No disponible para este recurso",
    resourcesHeading: "Recursos",
    colResource: "Recurso",
    colDomain: "Dominio",
    colWrite: "Estado de Escritura",
    singletons: "singletons",
    statusLive: "✅ v1.0.0 en vivo",
    statusWorkflow: "🔒 workflow",
    statusReadOnly: "— (solo lectura)",
    statusProOnly: "— (pro)",
    statusNone: "—",
  },
  hi: {
    title: "OpenEMIS MCP — संसाधन संदर्भ",
    bannerResources: (n) => `**${n} संसाधन**`,
    bannerEndpoints: (n) => `**${n} एंडपॉइंट**`,
    coreLine: "OpenEMIS Core 5.10.0",
    distroFree: "मुफ़्त वितरण — केवल पठन। लेखन (POST/PUT/DELETE) [openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro) में रहता है।",
    distroPro: "PRO वितरण — पठन + लेखन। वर्कफ़्लो-नियंत्रित संसाधन टूल परत पर अवरुद्ध हैं (🔒); सीधे लेखन के बजाय उपयुक्त playbook का उपयोग करें।",
    contextLine1: "MCP यह तालिका AI संदर्भ में **नहीं** लोड करता है। यह डोमेन बकेट + playbooks के साथ एक कॉम्पैक्ट",
    contextLine2: "`grouped-manifest.json` (~210 KB) का उपयोग करता है।",
    contextLine3: "एजेंट डोमेन/playbook द्वारा नेविगेट करता है और मांग पर एंडपॉइंट विवरण खींचता है।",
    legendHeading: "कुंजी",
    legendSymbol: "प्रतीक",
    legendMeaning: "अर्थ",
    legendAvailable: "उपलब्ध",
    legendWorkflow: "केवल वर्कफ़्लो — सीधे लेखन के बजाय उपयुक्त playbook का उपयोग करें",
    legendNot: "इस संसाधन के लिए उपलब्ध नहीं",
    resourcesHeading: "संसाधन",
    colResource: "संसाधन",
    colDomain: "डोमेन",
    colWrite: "लेखन स्थिति",
    singletons: "singletons",
    statusLive: "✅ v1.0.0 लाइव",
    statusWorkflow: "🔒 workflow",
    statusReadOnly: "— (केवल पठन)",
    statusProOnly: "— (pro)",
    statusNone: "—",
  },
  ar: {
    title: "OpenEMIS MCP — مرجع الموارد",
    bannerResources: (n) => `**${n} موردًا**`,
    bannerEndpoints: (n) => `**${n} نقطة نهاية**`,
    coreLine: "OpenEMIS Core 5.10.0",
    distroFree: "التوزيع المجاني — للقراءة فقط. عمليات الكتابة (POST/PUT/DELETE) متاحة في [openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro).",
    distroPro: "التوزيع الاحترافي — قراءة + كتابة. الموارد التي يتحكم بها workflow محظورة على طبقة الأداة (🔒)؛ استخدم playbook المناسب بدلاً من الكتابة المباشرة.",
    contextLine1: "لا يقوم MCP بتحميل هذا الجدول إلى سياق الذكاء الاصطناعي. بل يستخدم ملفًا مضغوطًا",
    contextLine2: "`grouped-manifest.json` (~210 KB) مع حزم المجالات و playbooks.",
    contextLine3: "ينتقل الوكيل عبر المجال/الـ playbook ويسحب تفاصيل نقطة النهاية عند الطلب.",
    legendHeading: "وسائل الإيضاح",
    legendSymbol: "الرمز",
    legendMeaning: "المعنى",
    legendAvailable: "متاح",
    legendWorkflow: "workflow فقط — استخدم الـ playbook المناسب، وليس الكتابة المباشرة",
    legendNot: "غير متاح لهذا المورد",
    resourcesHeading: "الموارد",
    colResource: "المورد",
    colDomain: "المجال",
    colWrite: "حالة الكتابة",
    singletons: "موارد فردية",
    statusLive: "✅ v1.0.0 مباشر",
    statusWorkflow: "🔒 workflow",
    statusReadOnly: "— (للقراءة فقط)",
    statusProOnly: "— (pro)",
    statusNone: "—",
  },
};
const t = I18N[lang];

function pascalToKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function writeStatusFor(name, hasWrites) {
  if (variant === "free") {
    if (!hasWrites) return t.statusNone;
    return t.statusProOnly;
  }
  // pro
  if (WORKFLOW_BLOCKED.has(name)) return t.statusWorkflow;
  if (!hasWrites) return t.statusReadOnly;
  return t.statusLive;
}

function methodCell(present, isWorkflowWrite) {
  if (!present) return "—";
  if (isWorkflowWrite) return "🔒";
  return "✅";
}

function rowFor(r) {
  const kebab = pascalToKebab(r.name);
  const kinds = r.kinds || {};
  const hasList = !!kinds.LIST;
  const hasGet = !!kinds.GET;
  const hasCreate = !!kinds.CREATE;
  const hasUpdate = !!kinds.UPDATE;
  const hasDelete = !!kinds.DELETE;
  const isWorkflow = WORKFLOW_BLOCKED.has(r.name);
  const writeBlockedInFree = variant === "free";

  const get = (hasList || hasGet) ? "✅" : "—";
  const post = methodCell(hasCreate && !writeBlockedInFree, isWorkflow);
  const put = methodCell(hasUpdate && !writeBlockedInFree, isWorkflow);
  const del = methodCell(hasDelete && !writeBlockedInFree, isWorkflow);

  const status = writeStatusFor(r.name, hasCreate || hasUpdate || hasDelete);

  return `| \`${kebab}\` | ${getDomainOf(r.name)} | ${get} | ${post} | ${put} | ${del} | ${status} |`;
}

// Build a name → domain map. Families have a prefix like "Institution*"; we use that.
const nameToDomain = new Map();
for (const f of g.families) {
  for (const r of f.resources) nameToDomain.set(r.name, f.prefix);
}
for (const r of g.orphans) nameToDomain.set(r.name, "—");
function getDomainOf(name) { return nameToDomain.get(name) ?? "—"; }

// Header
const distroLabel = variant === "free" ? t.distroFree : t.distroPro;

const header = `# ${t.title}

> ${t.bannerResources(g.total_resources)} · ${t.bannerEndpoints(g.total_endpoints)} · ${version} · ${t.coreLine}
>
> ${distroLabel}
>
> ${t.contextLine1}
> ${t.contextLine2}
> ${t.contextLine3}

## ${t.legendHeading}

| ${t.legendSymbol} | ${t.legendMeaning} |
|---|---|
| ✅ | ${t.legendAvailable} |
| 🔒 | ${t.legendWorkflow} |
| — | ${t.legendNot} |

## ${t.resourcesHeading}
`;

const rows = [];
rows.push(`| ${t.colResource} | ${t.colDomain} | GET | POST | PUT | DELETE | ${t.colWrite} |`);
rows.push(`|---|---|:---:|:---:|:---:|:---:|---|`);

// Emit families in order of size (existing convention from the previous file).
for (const f of g.families) {
  rows.push(`| **── ${f.prefix} ──** | | | | | | |`);
  for (const r of f.resources) rows.push(rowFor(r));
}
rows.push(`| **── ${t.singletons} ──** | | | | | | |`);
for (const r of g.orphans) rows.push(rowFor(r));

const out = header + rows.join("\n") + "\n";

console.log(`Variant     : ${variant}`);
console.log(`Language    : ${lang}`);
console.log(`Source      : ${groupedPath}`);
console.log(`Output      : ${outPath}`);
console.log(`Resources   : ${g.total_resources}`);
console.log(`Endpoints   : ${g.total_endpoints}`);
console.log(`Lines       : ${out.split("\n").length}`);

if (WRITE) {
  writeFileSync(outPath, out);
  console.log(`✅  wrote ${outPath}`);
} else {
  console.log("(dry run — pass --write to overwrite)");
}

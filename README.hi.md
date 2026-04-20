<p align="center">
  <img src="assets/logo.png" alt="openemis-mcp logo" width="320">
</p>

# openemis-mcp

**MCP-सक्षम एजेंटों (Claude, Codex, Cursor, आदि) और किसी भी OpenEMIS इंस्टेंस के बीच एक प्राकृतिक-भाषा पुल।**

प्रकाशित **OpenEMIS Core API** (संदर्भ दस्तावेज़ [api.openemis.org/core](https://api.openemis.org/core) पर) के ऊपर निर्मित और **वास्तविक क्रेडेंशियल्स, वास्तविक डेटा, वास्तविक राउंड-ट्रिप के साथ सार्वजनिक डेमो [demo.openemis.org/core](https://demo.openemis.org/core) पर एंड-टू-एंड सत्यापित।**

अंग्रेजी में पूछें:

> *"Avory Primary में कितने वर्तमान छात्र हैं?"*

एजेंट कॉल्स की योजना बनाता है, यह MCP डेटा पहुंचाता है, और आपको उत्तर मिलता है:

> *"Avory Primary School (कोड P1002) में 553 वर्तमान में नामांकित छात्र हैं।"*

आप एक भी लाइन कोड नहीं लिखते। आप JSON नहीं देखते। आप बस पूछते हैं।

> **स्थिति:** v0.3.0 — गैर-वर्कफ़्लो संसाधनों के लिए **पूर्ण CRUD**। पढ़ने वाले क्वेरीज़ हर OpenEMIS v5 संसाधन के खिलाफ काम करती हैं। लिखने वाले टूल (create/update/delete) उन सभी संसाधनों के लिए लाइव हैं जो CakePHP Workflow प्लगइन से होकर नहीं गुजरते। वर्कफ़्लो-नियंत्रित संसाधन (उपस्थिति, स्टाफ अवकाश) टूल स्तर पर ब्लॉक किए गए हैं और उचित प्लेबुक पर रीडायरेक्ट करते हैं।

---

## यह क्यों मौजूद है

OpenEMIS Core REST API बड़ी है — केवल v5 सतह ही लगभग **~670 संसाधनों में ~1,350 एंडपॉइंट्स** एक्सपोज़ करती है। कोई भी AI एजेंट उसे कॉन्टेक्स्ट में नहीं रख सकता, और कच्ची Swagger-शैली की आत्मनिरीक्षण उस शोर से बातचीत को भर देती है जिसका उपयोगकर्ता के वास्तविक प्रश्न से कोई लेना-देना नहीं है।

यह MCP इसे दो तरीकों से हल करता है:

1.  **डोमेन-स्कोप्ड डिस्कवरी।** पूरे API को एजेंट के कॉन्टेक्स्ट में डंप करने के बजाय, `openemis_discover(topic)` टूल उन ~20–30 एंडपॉइंट्स तक सीमित हो जाता है जो उपयोगकर्ता वास्तव में पूछ रहा है ("उपस्थिति", "छात्र", "मूल्यांकन") — `Domain-*.md` नोट्स के एक छोटे क्यूरेटेड ज्ञान पैक द्वारा संचालित।
2.  **एक एकल, संयोजन योग्य गेटर।** एक `openemis_get` टूल सूची + सिंगलटन + फ़िल्टर्ड खोज को हर संसाधन में कवर करता है। एजेंट `resource` + वैकल्पिक `id` + वैकल्पिक `params` (`_fields`, `_conditions`, `orderby`, `page`, `limit`) प्रदान करता है और OpenEMIS CakePHP-शैली क्वेरी DSL का बाकी हिस्सा सीधे मैप हो जाता है।

नेट प्रभाव: एजेंट प्राकृतिक-भाषा प्रश्नों का उत्तर 2–4 टूल कॉल में देते हैं, 30 में नहीं।

---

## टूल्स

| टूल | के बाद से | यह क्या करता है |
|---|---|---|
| `openemis_health` | v0.1 | कॉन्फ़िगर किए गए इंस्टेंस को पिंग करता है और पहुंच योग्यता रिपोर्ट करता है। एक वास्तविक लॉगिन राउंड-ट्रिप करता है — यदि यह पास हो जाता है, तो CRUD काम करेगा। |
| `openemis_list_domains` | v0.1 | क्यूरेटेड OpenEMIS डोमेन्स की सूची देता है — उपस्थिति, मूल्यांकन, स्टाफ, छात्र, संस्थान, अनुसूची, परीक्षा, रिपोर्ट — प्रत्येक एक-लाइन सारांश के साथ। एजेंट इसका उपयोग यह पता लगाने के लिए करता है कि एक प्रश्न *कहाँ* रहता है। |
| `openemis_discover` | v0.1 | इनपुट: एक टॉपिक स्ट्रिंग। आउटपुट: उस टॉपिक से संबंधित 30 तक एंडपॉइंट्स, डोमेन ज्ञान पैक और प्रति-इंस्टेंस मेनिफेस्ट से लिए गए। अंतर्निहित API कितना भी बड़ा क्यों न हो, बातचीत को छोटा रखता है। |
| `openemis_list_playbooks` | v0.2 | सभी 27 क्यूरेटेड वर्कफ़्लो प्लेबुक्स की सूची id, शीर्षक, डोमेन और दर्शकों के साथ देता है। एजेंट इसका उपयोग उपयोगकर्ता-स्तरीय कार्य के लिए सही चरण-दर-चरण गाइड खोजने के लिए करता है। |
| `openemis_get_playbook` | v0.2 | इनपुट: एक प्लेबुक id। आउटपुट: पूरा प्लेबुक — संसाधन, क्रमबद्ध चरण, मार्गदर्शन नोट्स, और उदाहरण क्वेरीज़। |
| `openemis_get` | v0.1 | एकीकृत पढ़ने का टूल। `{ resource, id?, params? }` — यदि `id` मौजूद है, तो सिंगलटन फ़ेच करता है; अन्यथा `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`, और किसी भी एड-हॉक फ़िल्टर कुंजी के किसी भी संयोजन के साथ सूची देता है। |
| `openemis_create` | v0.3.0 | एक नया रिकॉर्ड बनाएं। `{ resource, body }` — केवल गैर-वर्कफ़्लो संसाधन। वर्कफ़्लो-नियंत्रित संसाधन (जैसे institution-staff-leave) ब्लॉक किए जाते हैं और उचित प्लेबुक पर रीडायरेक्ट करेंगे। |
| `openemis_update` | v0.3.0 | id द्वारा एक मौजूदा रिकॉर्ड अपडेट करें। `{ resource, id, body }` — केवल गैर-वर्कफ़्लो संसाधन। |
| `openemis_delete` | v0.3.0 | id द्वारा एक रिकॉर्ड हटाएं। `{ resource, id }` — केवल गैर-वर्कफ़्लो संसाधन। |

एक प्रतिनिधि प्राकृतिक-भाषा प्रश्न जैसे *"Avory Primary में कितने शिक्षक हैं, कितनी रिक्त पद हैं?"* तीन `openemis_get` कॉल्स में हल होता है — एजेंट द्वारा चेन किया गया, `_conditions` द्वारा संकीर्ण किया गया, एक एकल अंग्रेजी उत्तर के रूप में वापस दिया गया। एक लिखने का अनुरोध जैसे *"एक नए छात्र का नामांकन करें"* चरण-दर-चरण गाइड लोड करने के लिए `openemis_get_playbook` का उपयोग करता है, फिर प्रत्येक लिखने के चरण के लिए `openemis_create` का उपयोग करता है।

---

## demo.openemis.org के खिलाफ सत्यापित

इस README में हर दावा लिखे जाने से पहले सार्वजनिक डेमो इंस्टेंस के खिलाफ सिद्ध किया गया था:

- `POST /api/v5/login` के साथ `{ username, password, api_key }` → JWT कैश्ड, 331 वर्ण
- `GET /api/v5/institutions?limit=200&_fields=id,name,code` → 24 संस्थान `"Avory Primary School" (id=6, code P1002)` सहित
- `GET /api/v5/institution-students?institution_id=6&student_status_id=1&limit=1` → पेजिनेशन रिपोर्ट करता है `last_page: 553` → **553 वर्तमान में नामांकित छात्र**
- `GET /api/v5/academic-periods` → वास्तविक शैक्षणिक-वर्ष डेटा के 7 पृष्ठ
- `GET /api/v5/absence-types` → `EXCUSED`, `UNEXCUSED`, `LATE`, आदि।

इस रेपो के साथ शिप किया गया नमूना `scripts/smoke-login.mjs` लॉगिन टेस्ट को चरण-दर-चरण करता है ताकि आप इसे Claude Code में वायर करने से पहले अपने स्वयं के इंस्टेंस के खिलाफ पहुंच योग्यता की पुष्टि कर सकें।

---

## संगत एजेंट

openemis-mcp **Model Context Protocol** को stdio पर बोलता है — कोई भी MCP-संगत क्लाइंट काम करता है:

**Stdio मोड (स्थानीय मशीन)** — एक सबप्रोसेस के रूप में कनेक्ट होता है:

| एजेंट | कैसे कनेक्ट करें |
|---|---|
| **Claude Code** (`claude` CLI) | `claude mcp add` — प्राथमिक परीक्षण किया गया क्लाइंट, सभी 9 टूल उपलब्ध |
| **Cursor** | `.cursor/mcp.json` में जोड़ें — पूर्ण टूल एक्सेस |
| **Cline / Continue** (VS Code) | MCP सेटिंग्स में सर्वर जोड़ें |
| **Codex** | [gemmy-and-qwenny](https://github.com/tixuz/gemmy-and-qwenny) ब्रिज के माध्यम से |
| **कोई भी MCP क्लाइंट** | env वेरिएबल्स सेट के साथ `node dist/server.js` पर इंगित करें |

**HTTP सर्वर मोड** (`OPENEMIS_TRANSPORT=http`, Oracle/VPS पर एक बार इंस्टॉल करें) — URL द्वारा कनेक्ट होता है:

| क्लाइंट | कैसे कनेक्ट करें |
|---|---|
| **Claude Code** (रिमोट) | `claude mcp add --transport http --url http://your-server:3000/mcp --header "Authorization: Bearer <token>"` |
| **Cursor / Cline** | सेटिंग्स में रिमोट MCP URL जोड़ें |
| **ChatGPT** (कस्टम GPT) | `http://your-server:3000/openapi.json` से स्कीमा इम्पोर्ट करें → Actions → Bearer टोकन |
| **कोई भी HTTP क्लाइंट** | `/api/*` पर REST API — [शिक्षक गाइड](docs/CHATGPT-TEACHER-GUIDE.md) देखें |

---

## इंस्टॉल करें

आवश्यकता है **Node 22+** (अंतर्निहित `fetch` और `AbortController` के लिए) और **Python 3.10+** (`mcp-openemis-gen/` में मेनिफेस्ट बिल्डर और प्लेबुक जनरेटर स्क्रिप्ट्स के लिए)। MCP सर्वर स्वयं केवल Node है; Python केवल तभी आवश्यक है जब आप स्रोत से मेनिफेस्ट रीबिल्ड करते हैं।

### GitHub से

```bash
git clone https://github.com/tixuz/openemis-mcp.git
cd openemis-mcp

npm install
npm run build

cp .env.example .env
$EDITOR .env
```

### कॉन्फ़िगर करें

`.env.example` हर वेरिएबल को दस्तावेज़ करता है। न्यूनतम रूप से आपको उन तीन क्रेडेंशियल्स की आवश्यकता है जो आपका OpenEMIS व्यवस्थापक जारी करता है:

```env
OPENEMIS_BASE_URL=https://demo.openemis.org/core   # या आपका अपना इंस्टेंस
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

# वैकल्पिक
OPENEMIS_TIMEOUT_MS=30000
OPENEMIS_VAULT_PATH=/absolute/path/to/domain-notes
OPENEMIS_MANIFEST_PATH=/absolute/path/to/manifest.jsonl
```

सर्वर पहले प्रमाणित टूल कॉल पर आलसी रूप से लॉग इन करता है, `/api/v5/login` पर POST करता है, `data.token` से JWT पार्स करता है, और इसे मेमोरी में कैश करता है। 401 पर यह दोबारा लॉग इन करता है और एक बार रिट्राई करता है।

`OPENEMIS_VAULT_PATH` उस फ़ोल्डर की ओर इंगित करता है जिसमें `openemis_discover` द्वारा उपयोग किए गए क्यूरेटेड `Domain-*.md` नोट्स होते हैं। यदि गायब है, तो डिस्कवरी मेनिफेस्ट के खिलाफ कीवर्ड मिलान तक सुचारू रूप से गिरावट आती है।

`OPENEMIS_MANIFEST_PATH` `../mcp-openemis-gen/` में साथी बिल्डर के JSONL आउटपुट की ओर इंगित करता है। यदि अनुपस्थित है, तो डिस्कवरी टूल एक मित्रवत "मेनिफेस्ट अभी तक निर्मित नहीं हुआ है" संकेत देते हैं — वे क्रैश नहीं करते।

### पहुंच योग्यता का धुआँ-परीक्षण करें

```bash
set -a && source .env && set +a
node scripts/smoke-login.mjs
```

अपेक्षित:

```
[Test] Loading config...
[OK] Config loaded: baseUrl=https://demo.openemis.org/core
[Test] Creating client...
[OK] Client created
[Test] Attempting login...
[OpenEMIS] Login successful; cached JWT (331 chars)
[OK] Login successful
```

### Claude Code के साथ पंजीकरण करें

```bash
claude mcp add openemis \
  --env OPENEMIS_BASE_URL="https://your-openemis/core" \
  --env OPENEMIS_USERNAME="…" \
  --env OPENEMIS_PASSWORD="…" \
  --env OPENEMIS_API_KEY="…" \
  --env OPENEMIS_VAULT_PATH="/absolute/path/to/vault" \
  -- node "$(pwd)/dist/server.js"

# सत्यापित करें
claude mcp list | grep openemis
# अपेक्षित: openemis: node /…/dist/server.js - ✓ Connected
```

इस प्रोजेक्ट में कोई भी नया Claude Code सत्र स्वचालित रूप से सभी नौ टूल्स देखेगा।

---

### सर्वर मोड (Oracle Always Free / कोई भी VPS)

स्थानीय सबप्रोसेस के बजाय एक स्थायी HTTP सर्वर के रूप में चलाने के लिए `OPENEMIS_TRANSPORT=http` सेट करें। अपने सर्वर पर एक बार इंस्टॉल करें; हर MCP-संगत क्लाइंट (Claude Code, Cursor, Cline, Windsurf) URL द्वारा कनेक्ट होता है।

**आपके सर्वर पर:**

```bash
git clone https://github.com/tixuz/openemis-mcp-pro.git
cd openemis-mcp-pro
npm install && npm run build
cp .env.example .env
$EDITOR .env          # क्रेडेंशियल्स + OPENEMIS_TRANSPORT=http + OPENEMIS_AUTH_TOKEN सेट करें
node dist/server.js
```

**सर्वर मोड के लिए .env:**

```env
OPENEMIS_BASE_URL=https://your-openemis/core
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

OPENEMIS_TRANSPORT=http
OPENEMIS_PORT=3000

# जनरेट करें: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
OPENEMIS_AUTH_TOKEN=your-secret-token-here
```

**Claude Code (रिमोट) से कनेक्ट करें:**

```bash
claude mcp add openemis-remote \
  --transport http \
  --url "http://your-server:3000/mcp" \
  --header "Authorization: Bearer your-secret-token-here"
```

**स्वास्थ्य जांच** (मॉनिटरिंग / अपटाइम चेक):

```bash
curl http://your-server:3000/health
# {"ok":true,"transport":"http","baseUrl":"https://your-openemis/core"}
```

> ⚠️ **हमेशा `OPENEMIS_AUTH_TOKEN` सेट करें** पोर्ट को सार्वजनिक रूप से एक्सपोज़ करने से पहले। इसके बिना एंडपॉइंट उस किसी के लिए खुला है जो आपके IP तक पहुंच सकता है।

---

## आर्किटेक्चर

```
┌────────────────────────┐
│  एजेंट (Claude / …)    │     "Avory में कितने वर्तमान छात्र हैं?"
└───────────┬────────────┘
            │ MCP stdio (JSON-RPC)
┌───────────▼────────────┐
│  openemis-mcp          │  ← नौ टाइप्ड टूल्स, ZodRawShape स्कीमास
│  • openemis_health     │
│  • openemis_list_dom…  │  ← वॉल्ट से Domain-*.md पढ़ता है
│  • openemis_discover   │  ← टॉपिक → ≤30 स्कोप्ड एंडपॉइंट्स
│  • openemis_list_play… │  ← सभी 16 वर्कफ़्लो प्लेबुक्स की सूची देता है
│  • openemis_get_playbk │  ← id द्वारा एक प्लेबुक लोड करता है
│  • openemis_get / _create / _update / _delete   │
└───────────┬────────────┘
            │ HTTPS + Bearer JWT (कैश्ड, 401 पर ऑटो-रिफ्रेश)
┌───────────▼────────────┐
│  OpenEMIS Core API     │  api.openemis.org/core  (संदर्भ)
│  /api/v5/{resource}    │  demo.openemis.org/core (परीक्षण किया गया)
└────────────────────────┘
```

डिज़ाइन सिद्धांत, कोड की पहली पंक्ति से:

1.  **डोमेन-स्कोप्ड, कभी फायरहोज़ नहीं।** मेनिफेस्ट हजारों एंडपॉइंट्स तक बढ़ सकता है; एजेंट का कॉन्टेक्स्ट नहीं बढ़ेगा। `openemis_discover(topic)` फ़नल है — हर बातचीत केवल उस स्लाइस को देखती है जिसकी उसे आवश्यकता है।
2.  **v0.3.0 में लिखने के टूल।** `openemis_create` / `openemis_update` / `openemis_delete` सभी गैर-वर्कफ़्लो संसाधनों के लिए लाइव हैं। वर्कफ़्लो-नियंत्रित संसाधन (उपस्थिति, स्टाफ-उपस्थिति) टूल स्तर पर ब्लॉक किए जाते हैं और उचित प्लेबुक पर रीडायरेक्ट करते हैं।
3.  **कॉल्स के बीच स्टेटलेस।** केवल JWT मेमोरी में कैश किया जाता है। कोई डिस्क दृढ़ता नहीं, कोई एनालिटिक्स नहीं, कुछ भी घर नहीं फोन करता।
4.  **वास्तविक API पर पतला।** यह ब्रिज नई अवधारणाओं का आविष्कार नहीं करता — `resource` नाम केबकेस-केस v5 पथ हैं, क्वेरी पैरामीटर्स मूल `_conditions` / `_fields` DSL हैं। जो आप curl में लिखेंगे वह 1:1 अनुवाद करता है।

---

## दस्तावेज़ीकरण

- [संसाधन संदर्भ](docs/resources.md) — HTTP विधि उपलब्धता और लिखने की स्थिति के साथ सभी 645 संसाधन
- [प्लेबुक्स](docs/playbooks/) — 27 क्यूरेटेड वर्कफ़्लो गाइड्स (24 पढ़ें · 3 लिखें)
- [ChatGPT शिक्षक गाइड](docs/CHATGPT-TEACHER-GUIDE.md) — शिक्षकों को ChatGPT कस्टम GPT के माध्यम से उपस्थिति चिह्नित करने की अनुमति कैसे दें
- [प्लेबुक लेखन दिनचर्या](docs/PLAYBOOK-ROUTINE.md) — नए प्लेबुक्स जोड़ने के लिए 4-चरण प्रक्रिया

### प्लेबुक्स

| # | प्लेबुक | डोमेन | दर्शक | अनुवाद |
|---|---|---|---|---|
| 1 | [रिक्त पदों की गिनती करें](docs/playbooks/count-vacant-positions.md) | स्टाफ | व्यवस्थापक, एचआर | [RU](docs/playbooks/count-vacant-positions.ru.md) · [ES](docs/playbooks/count-vacant-positions.es.md) · [HI](docs/playbooks/count-vacant-positions.hi.md) · [AR](docs/playbooks/count-vacant-positions.ar.md) |
| 2 | [छात्र उपस्थिति चिह्नित करें](docs/playbooks/mark-student-attendance.md) | उपस्थिति | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/mark-student-attendance.ru.md) · [ES](docs/playbooks/mark-student-attendance.es.md) · [HI](docs/playbooks/mark-student-attendance.hi.md) · [AR](docs/playbooks/mark-student-attendance.ar.md) |
| 3 | [स्टाफ उपस्थिति चिह्नित करें](docs/playbooks/mark-staff-attendance.md) | स्टाफ | व्यवस्थापक, एचआर, शिक्षक | [RU](docs/playbooks/mark-staff-attendance.ru.md) · [ES](docs/playbooks/mark-staff-attendance.es.md) · [HI](docs/playbooks/mark-staff-attendance.hi.md) · [AR](docs/playbooks/mark-staff-attendance.ar.md) |
| 4 | [छात्र समय सारिणी देखें](docs/playbooks/view-student-timetable.md) | अनुसूची | अभिभावक, छात्र | [RU](docs/playbooks/view-student-timetable.ru.md) · [ES](docs/playbooks/view-student-timetable.es.md) · [HI](docs/playbooks/view-student-timetable.hi.md) · [AR](docs/playbooks/view-student-timetable.ar.md) |
| 5 | [छात्र डैशबोर्ड](docs/playbooks/student-dashboard.md) | छात्र | अभिभावक, छात्र | [RU](docs/playbooks/student-dashboard.ru.md) · [ES](docs/playbooks/student-dashboard.es.md) · [HI](docs/playbooks/student-dashboard.hi.md) · [AR](docs/playbooks/student-dashboard.ar.md) |
| 6 | [छात्र रिपोर्ट कार्ड PDF जनरेट करें](docs/playbooks/generate-student-report-card-pdf.md) | रिपोर्ट | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/generate-student-report-card-pdf.ru.md) · [ES](docs/playbooks/generate-student-report-card-pdf.es.md) · [HI](docs/playbooks/generate-student-report-card-pdf.hi.md) · [AR](docs/playbooks/generate-student-report-card-pdf.ar.md) |
| 7 | [एक नए छात्र का नामांकन करें](docs/playbooks/enroll-new-student.md) | छात्र | व्यवस्थापक, रजिस्ट्रार | [RU](docs/playbooks/enroll-new-student.ru.md) · [ES](docs/playbooks/enroll-new-student.es.md) · [HI](docs/playbooks/enroll-new-student.hi.md) · [AR](docs/playbooks/enroll-new-student.ar.md) |
| 8 | [एक व्यवहार घटना दर्ज करें](docs/playbooks/record-behavior-incident.md) | छात्र | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/record-behavior-incident.ru.md) · [ES](docs/playbooks/record-behavior-incident.es.md) · [HI](docs/playbooks/record-behavior-incident.hi.md) · [AR](docs/playbooks/record-behavior-incident.ar.md) |
| 9 | [परीक्षा अंक जमा करें](docs/playbooks/submit-exam-marks.md) | मूल्यांकन | शिक्षक | [RU](docs/playbooks/submit-exam-marks.ru.md) · [ES](docs/playbooks/submit-exam-marks.es.md) · [HI](docs/playbooks/submit-exam-marks.hi.md) · [AR](docs/playbooks/submit-exam-marks.ar.md) |
| 10 | [संस्थान सारांश](docs/playbooks/institution-summary.md) | संस्थान | व्यवस्थापक, अभिभावक | [RU](docs/playbooks/institution-summary.ru.md) · [ES](docs/playbooks/institution-summary.es.md) · [HI](docs/playbooks/institution-summary.hi.md) · [AR](docs/playbooks/institution-summary.ar.md) |
| 11 | [संस्थान सांख्यिकी PDF जनरेट करें](docs/playbooks/generate-institution-statistics-pdf.md) | रिपोर्ट | व्यवस्थापक | [RU](docs/playbooks/generate-institution-statistics-pdf.ru.md) · [ES](docs/playbooks/generate-institution-statistics-pdf.es.md) · [HI](docs/playbooks/generate-institution-statistics-pdf.hi.md) · [AR](docs/playbooks/generate-institution-statistics-pdf.ar.md) |
| 12 | [नवीनतम उपस्थिति देखें](docs/playbooks/view-latest-attendance.md) | उपस्थिति | शिक्षक, व्यवस्थापक, अभिभावक | [RU](docs/playbooks/view-latest-attendance.ru.md) · [ES](docs/playbooks/view-latest-attendance.es.md) · [HI](docs/playbooks/view-latest-attendance.hi.md) · [AR](docs/playbooks/view-latest-attendance.ar.md) |
| 13 | [छात्र प्रोफ़ाइल देखें](docs/playbooks/view-student-profile.md) | छात्र | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/view-student-profile.ru.md) · [ES](docs/playbooks/view-student-profile.es.md) · [HI](docs/playbooks/view-student-profile.hi.md) · [AR](docs/playbooks/view-student-profile.ar.md) |
| 14 | [छात्र अंक देखें](docs/playbooks/view-student-marks.md) | मूल्यांकन | शिक्षक, व्यवस्थापक, अभिभावक | [RU](docs/playbooks/view-student-marks.ru.md) · [ES](docs/playbooks/view-student-marks.es.md) · [HI](docs/playbooks/view-student-marks.hi.md) · [AR](docs/playbooks/view-student-marks.ar.md) |
| 15 | [कक्षा रिपोर्ट देखें](docs/playbooks/view-class-report.md) | रिपोर्ट | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/view-class-report.ru.md) · [ES](docs/playbooks/view-class-report.es.md) · [HI](docs/playbooks/view-class-report.hi.md) · [AR](docs/playbooks/view-class-report.ar.md) |
| 16 | [समय सारिणी देखें](docs/playbooks/view-timetable.md) | अनुसूची | शिक्षक, व्यवस्थापक, छात्र | [RU](docs/playbooks/view-timetable.ru.md) · [ES](docs/playbooks/view-timetable.es.md) · [HI](docs/playbooks/view-timetable.hi.md) · [AR](docs/playbooks/view-timetable.ar.md) |
| 17 | [पूर्ण संस्थान प्रोफ़ाइल देखें](docs/playbooks/view-institution-profile.md) | संस्थान | व्यवस्थापक, अभिभावक, सार्वजनिक | [RU](docs/playbooks/view-institution-profile.ru.md) · [ES](docs/playbooks/view-institution-profile.es.md) · [HI](docs/playbooks/view-institution-profile.hi.md) · [AR](docs/playbooks/view-institution-profile.ar.md) |
| 18 | [पूर्ण कक्षा प्रोफ़ाइल देखें](docs/playbooks/view-class-profile.md) | छात्र | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/view-class-profile.ru.md) · [ES](docs/playbooks/view-class-profile.es.md) · [HI](docs/playbooks/view-class-profile.hi.md) · [AR](docs/playbooks/view-class-profile.ar.md) |
| 19 | [एक स्टाफ सदस्य की पूर्ण प्रोफ़ाइल देखें](docs/playbooks/view-staff-profile.md) | स्टाफ | व्यवस्थापक, एचआर | [RU](docs/playbooks/view-staff-profile.ru.md) · [ES](docs/playbooks/view-staff-profile.es.md) · [HI](docs/playbooks/view-staff-profile.hi.md)
| सुविधा | मुफ्त | स्टार्टर | प्रो | एंटरप्राइज़ |
| :--- | :---: | :---: | :---: | :---: |
| **कोर** — सभी संसाधनों के लिए पूर्ण CRUD | ✅ | ✅ | ✅ | ✅ |
| **प्रश्न** — फ़िल्टर, सॉर्ट, पेजिनेशन | ✅ | ✅ | ✅ | ✅ |
| **स्कीमा** — स्वचालित प्रलेखन | ✅ | ✅ | ✅ | ✅ |
| **प्रमाणीकरण** — OAuth2, बुनियादी | ✅ | ✅ | ✅ | ✅ |
| **लॉगिंग** — स्टडआउट / फ़ाइल | ✅ | ✅ | ✅ | ✅ |
| **कॉन्फ़िगरेशन** — YAML फ़ाइलें | ✅ | ✅ | ✅ | ✅ |
| **प्लेबुक** — संरचित निर्देश | ✅ | ✅ | ✅ | ✅ |
| संरचित प्लेबुक + अनुवाद | ✅ | ✅ | ✅ | ✅ |
| stdio मोड (Claude Code, Cursor, Cline) | ✅ | ✅ | ✅ | ✅ |
| **HTTP सर्वर मोड** (Oracle / VPS इंस्टॉल) | — | ✅ | ✅ | ✅ |
| **OpenAPI एडाप्टर** (ChatGPT Custom GPT, कोई भी REST क्लाइंट) | — | ✅ | ✅ | ✅ |
| प्रत्यक्ष लेखन — एकल रिकॉर्ड | — | ✅ | ✅ | ✅ |
| संस्थान ऑडिट ट्रेल | — | — | ✅ | ✅ |
| वर्कफ़्लो रूट निष्पादन | — | — | ✅ | ✅ |
| संस्थान-प्रशासक अनुमोदन गेट | — | — | ✅ | ✅ |
| एक संस्थान के भीतर बैच ऑपरेशन | — | — | ✅ | ✅ |
| बहु-संस्थान बैच ऑपरेशन | — | — | — | ✅ |
| मंत्रालय अनुमोदन गेट | — | — | — | ✅ |
| क्रॉस-संस्थान पर्यवेक्षण | — | — | — | ✅ |
| आंशिक विफलता पर रोल-बैक | — | — | — | ✅ |

→ **मूल्य निर्धारण और पहुंच:** khindol.madraimov@gmail.com

---

## लाइसेंस

[MIT](LICENSE.md) — © 2026 खिंडोल मदराइमोव

---

## आभार

मानव निर्देशन के तहत समन्वित एआई एजेंटों की एक टीम द्वारा निर्मित — पूरी टीम के लिए [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) देखें: सलाहकार अरस्तू, मार्शल सनी, समुराई हाइकू, ज़ेफिरिन ज़िर्डल, कैप्टन नीमो, कोडी (GPT-5), मिनिक्वेनको (Qwen 2.5 Coder 7B), मिनिक्वेन (Qwen 3.5 9B), और जेमी (Gemma 4e4b) — प्रत्येक वास्तुकला, कोड, विश्लेषण और बहुभाषी अनुवाद में अलग-अलग भूमिकाओं के साथ।

---

*OpenEMIS या इसके रखरखावकर्ताओं से संबद्ध नहीं। यह एक तृतीय-पक्ष ब्रिज है जो सार्वजनिक Core API का उपयोग करता है। आपकी क्रेडेंशियल्स और डेटा आपके मशीन पर ही रहते हैं।*
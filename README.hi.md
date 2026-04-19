# openemis-mcp

**MCP-सक्षम एजेंटों (Claude, Codex, Cursor, आदि) और किसी भी OpenEMIS इंस्टेंस के बीच एक प्राकृतिक-भाषा पुल।**

प्रकाशित **OpenEMIS Core API** (संदर्भ दस्तावेज़ [api.openemis.org/core](https://api.openemis.org/core) पर) के ऊपर निर्मित और **वास्तविक क्रेडेंशियल्स, वास्तविक डेटा, वास्तविक राउंड-ट्रिप के साथ सार्वजनिक डेमो [demo.openemis.org/core](https://demo.openemis.org/core) पर एंड-टू-एंड सत्यापित**।

अंग्रेजी में पूछें:

> *"Avory Primary में कितने वर्तमान छात्र हैं?"*

एजेंट कॉल्स की योजना बनाता है, यह MCP डेटा पहुंचाता है, और आपको उत्तर मिलता है:

> *"Avory Primary School (कोड P1002) में 553 वर्तमान में नामांकित छात्र हैं।"*

आप एक भी लाइन कोड नहीं लिखते। आप JSON नहीं देखते। आप बस पूछते हैं।

> **स्थिति:** v0.3.0 — **गैर-वर्कफ़्लो संसाधनों के लिए पूर्ण CRUD**। पढ़ने वाले क्वेरीज़ हर OpenEMIS v5 संसाधन के खिलाफ काम करती हैं। लिखने वाले टूल (create/update/delete) उन सभी संसाधनों के लिए लाइव हैं जो CakePHP Workflow प्लगइन से होकर नहीं गुजरते। वर्कफ़्लो-नियंत्रित संसाधन (उपस्थिति, स्टाफ अवकाश) टूल स्तर पर ब्लॉक किए गए हैं और उपयुक्त प्लेबुक पर रीडायरेक्ट करते हैं।

---

## यह क्यों मौजूद है

OpenEMIS Core REST API बड़ी है — केवल v5 सतह लगभग **~670 संसाधनों में ~1,350 एंडपॉइंट्स** एक्सपोज़ करती है। कोई भी AI एजेंट उसे कॉन्टेक्स्ट में नहीं रख सकता, और कच्ची Swagger-शैली की आत्मनिरीक्षण उस शोर से बातचीत को भर देती है जिसका उपयोगकर्ता के वास्तविक प्रश्न से कोई लेना-देना नहीं है।

यह MCP इसे दो तरीकों से हल करता है:

1.  **डोमेन-स्कोप्ड डिस्कवरी।** पूरे API को एजेंट के कॉन्टेक्स्ट में डंप करने के बजाय, `openemis_discover(topic)` टूल उन ~20–30 एंडपॉइंट्स तक सीमित हो जाता है जो उपयोगकर्ता वास्तव में पूछ रहा है ("उपस्थिति", "छात्र", "मूल्यांकन") — `Domain-*.md` नोट्स के एक छोटे क्यूरेटेड ज्ञान पैक द्वारा संचालित।
2.  **एक एकल, संयोजन योग्य गेटर।** एक `openemis_get` टूल हर संसाधन में सूची + सिंगलटन + फ़िल्टर्ड खोज को कवर करता है। एजेंट `resource` + वैकल्पिक `id` + वैकल्पिक `params` (`_fields`, `_conditions`, `orderby`, `page`, `limit`) प्रदान करता है और OpenEMIS CakePHP-शैली क्वेरी DSL का बाकी हिस्सा सीधे मैप हो जाता है।

नेट प्रभाव: एजेंट प्राकृतिक-भाषा प्रश्नों का उत्तर 2–4 टूल कॉल में देते हैं, 30 में नहीं।

---

## टूल्स

| टूल | जब से | यह क्या करता है |
|---|---|---|
| `openemis_health` | v0.1 | कॉन्फ़िगर किए गए इंस्टेंस को पिंग करता है और पहुंच योग्यता रिपोर्ट करता है। एक वास्तविक लॉगिन राउंड-ट्रिप करता है — यदि यह पास हो जाता है, तो CRUD काम करेगा। |
| `openemis_list_domains` | v0.1 | क्यूरेटेड OpenEMIS डोमेन सूचीबद्ध करता है — उपस्थिति, मूल्यांकन, स्टाफ, छात्र, संस्थान, अनुसूची, परीक्षा, रिपोर्ट — प्रत्येक एक-लाइन सारांश के साथ। एजेंट इसका उपयोग यह पता लगाने के लिए करता है कि एक प्रश्न *कहाँ* रहता है। |
| `openemis_discover` | v0.1 | इनपुट: एक टॉपिक स्ट्रिंग। आउटपुट: उस टॉपिक से प्रासंगिक 30 तक एंडपॉइंट्स, डोमेन ज्ञान पैक और प्रति-इंस्टेंस मेनिफेस्ट से लिए गए। अंतर्निहित API कितना भी बड़ा हो, बातचीत को छोटा रखता है। |
| `openemis_list_playbooks` | v0.2 | सभी 27 क्यूरेटेड वर्कफ़्लो प्लेबुक्स को id, शीर्षक, डोमेन और दर्शकों के साथ सूचीबद्ध करता है। एजेंट इसका उपयोग उपयोगकर्ता-स्तरीय कार्य के लिए सही चरण-दर-चरण मार्गदर्शिका खोजने के लिए करता है। |
| `openemis_get_playbook` | v0.2 | इनपुट: एक प्लेबुक id। आउटपुट: पूरा प्लेबुक — संसाधन, क्रमबद्ध चरण, मार्गदर्शन नोट्स, और उदाहरण क्वेरीज़। |
| `openemis_get` | v0.1 | एकीकृत पढ़ने का टूल। `{ resource, id?, params? }` — यदि `id` मौजूद है, तो सिंगलटन फ़ेच करता है; अन्यथा `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`, और किसी भी एड-हॉक फ़िल्टर कुंजी के किसी भी संयोजन के साथ सूचीबद्ध करता है। |
| `openemis_create` | v0.3.0 | एक नया रिकॉर्ड बनाएं। `{ resource, body }` — केवल गैर-वर्कफ़्लो संसाधन। वर्कफ़्लो-नियंत्रित संसाधन (जैसे institution-staff-leave) ब्लॉक किए गए हैं और उपयुक्त प्लेबुक पर रीडायरेक्ट करेंगे। |
| `openemis_update` | v0.3.0 | id द्वारा एक मौजूदा रिकॉर्ड अपडेट करें। `{ resource, id, body }` — केवल गैर-वर्कफ़्लो संसाधन। |
| `openemis_delete` | v0.3.0 | id द्वारा एक रिकॉर्ड हटाएं। `{ resource, id }` — केवल गैर-वर्कफ़्लो संसाधन। |

एक प्रतिनिधि प्राकृतिक-भाषा प्रश्न जैसे *"Avory Primary में कितने शिक्षक हैं, कितनी रिक्त पद हैं?"* तीन `openemis_get` कॉल में हल हो जाता है — एजेंट द्वारा चेन किया गया, `_conditions` द्वारा संकीर्ण किया गया, एक एकल अंग्रेजी उत्तर के रूप में वापस दिया गया। एक लिखने का अनुरोध जैसे *"एक नए छात्र का नामांकन करें"* चरण-दर-चरण मार्गदर्शिका लोड करने के लिए `openemis_get_playbook` का उपयोग करता है, फिर प्रत्येक लिखने के चरण के लिए `openemis_create` का उपयोग करता है।

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

| एजेंट | कैसे कनेक्ट करें |
|---|---|
| **Claude Code** (`claude` CLI) | `claude mcp add` — प्राथमिक परीक्षण किया गया क्लाइंट, सभी 9 टूल उपलब्ध |
| **Cursor** | `.cursor/mcp.json` में जोड़ें — पूर्ण टूल एक्सेस |
| **Cline / Continue** (VS Code) | MCP सेटिंग्स में सर्वर जोड़ें |
| **Codex** | [gemmy-and-qwenny](https://github.com/tixuz/gemmy-and-qwenny) ब्रिज के माध्यम से |
| **कोई भी MCP क्लाइंट** | env वेरिएबल्स सेट के साथ `node dist/server.js` पर इंगित करें |

---

## इंस्टॉल करें

आवश्यकता है **Node 22+** (अंतर्निहित `fetch` और `AbortController` के लिए) और **Python 3.10+** (`mcp-openemis-gen/` में मेनिफेस्ट बिल्डर और प्लेबुक जनरेटर स्क्रिप्ट्स के लिए)। MCP सर्वर स्वयं केवल Node है; Python केवल तभी आवश्यक है जब आप स्रोत से मेनिफेस्ट को पुनः बनाते हैं।

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

`.env.example` हर वेरिएबल को दस्तावेज़ करता है। न्यूनतम रूप से आपको तीन क्रेडेंशियल्स की आवश्यकता है जो आपका OpenEMIS व्यवस्थापक जारी करता है:

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

सर्वर पहले प्रमाणित टूल कॉल पर आलसी ढंग से लॉग इन करता है, `/api/v5/login` पर POST करता है, JWT को `data.token` से पार्स करता है, और इसे मेमोरी में कैश करता है। 401 पर यह दोबारा लॉग इन करता है और एक बार पुनः प्रयास करता है।

`OPENEMIS_VAULT_PATH` उस फ़ोल्डर की ओर इंगित करता है जिसमें `openemis_discover` द्वारा उपयोग किए जाने वाले क्यूरेटेड `Domain-*.md` नोट्स होते हैं। यदि गायब है, तो डिस्कवरी मेनिफेस्ट के खिलाफ कीवर्ड मिलान तक सुचारू रूप से गिरावट आती है।

`OPENEMIS_MANIFEST_PATH` `../mcp-openemis-gen/` में साथी बिल्डर के JSONL आउटपुट की ओर इंगित करता है। यदि अनुपस्थित है, तो डिस्कवरी टूल एक मैत्रीपूर्ण "मेनिफेस्ट अभी तक निर्मित नहीं हुआ है" संकेत देते हैं — वे क्रैश नहीं करते।

### पहुंच योग्यता का धुआं-परीक्षण करें

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

### Claude Code के साथ पंजीकृत करें

```bash
claude mcp add openemis \
  --env OPENEMIS_BASE_URL="https://your-openemis/core" \
  --env OPENEMIS_USERNAME="…" \
  --env OPENEMIS_PASSWORD="…" \
  --env OPENEMIS_API_KEY="…" \
  --env OPENEMIS_VAULT_PATH="/absolute/path/to/vault" \
  -- node "$(pwd)/dist/server.js"

# Verify
claude mcp list | grep openemis
# Expected: openemis: node /…/dist/server.js - ✓ Connected
```

इस प्रोजेक्ट में कोई भी नया Claude Code सत्र स्वचालित रूप से सभी नौ टूल देखेगा।

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
│  • openemis_list_play… │  ← सभी 16 वर्कफ़्लो प्लेबुक्स सूचीबद्ध करता है
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

1.  **डोमेन-स्कोप्ड, कभी फायरहोज़ नहीं।** मेनिफेस्ट हजारों एंडपॉइंट्स तक बढ़ सकता है; एजेंट का कॉन्टेक्स्ट नहीं जा रहा है। `openemis_discover(topic)` कीप है — हर बातचीत केवल उस स्लाइस को देखती है जिसकी उसे आवश्यकता है।
2.  **v0.3.0 में टूल लिखें।** `openemis_create` / `openemis_update` / `openemis_delete` सभी गैर-वर्कफ़्लो संसाधनों के लिए लाइव हैं। वर्कफ़्लो-नियंत्रित संसाधन (उपस्थिति, स्टाफ-उपस्थिति) टूल स्तर पर ब्लॉक किए गए हैं और उपयुक्त प्लेबुक पर रीडायरेक्ट करते हैं।
3.  **कॉल्स के बीच स्टेटलेस।** केवल JWT मेमोरी में कैश किया जाता है। कोई डिस्क दृढ़ता नहीं, कोई एनालिटिक्स नहीं, कुछ भी घर नहीं फोन करता।
4.  **वास्तविक API पर पतला।** यह ब्रिज नई अवधारणाओं का आविष्कार नहीं करता — `resource` नाम केबकेस-केस v5 पथ हैं, क्वेरी पैरामीटर्स मूल `_conditions` / `_fields` DSL हैं। जो आप curl में लिखेंगे वह 1:1 अनुवाद करता है।

---

## प्रलेखन

- [संसाधन संदर्भ](docs/resources.md) — HTTP विधि उपलब्धता और लिखने की स्थिति के साथ सभी 645 संसाधन
- [प्लेबुक्स](docs/playbooks/) — 27 क्यूरेटेड वर्कफ़्लो मार्गदर्शिकाएँ (24 पढ़ें · 3 लिखें)

### प्लेबुक्स

| # | प्लेबुक | डोमेन | दर्शक | अनुवाद |
|---|---|---|---|---|
| 1 | [रिक्त पदों की गिनती करें](docs/playbooks/count-vacant-positions.md) | स्टाफ | व्यवस्थापक, एचआर | [RU](docs/playbooks/count-vacant-positions.ru.md) · [ES](docs/playbooks/count-vacant-positions.es.md) |
| 2 | [छात्र उपस्थिति अंकित करें](docs/playbooks/mark-student-attendance.md) | उपस्थिति | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/mark-student-attendance.ru.md) · [ES](docs/playbooks/mark-student-attendance.es.md) |
| 3 | [स्टाफ उपस्थिति अंकित करें](docs/playbooks/mark-staff-attendance.md) | स्टाफ | व्यवस्थापक, एचआर, शिक्षक | [RU](docs/playbooks/mark-staff-attendance.ru.md) · [ES](docs/playbooks/mark-staff-attendance.es.md) |
| 4 | [छात्र समय सारिणी देखें](docs/playbooks/view-student-timetable.md) | अनुसूची | अभिभावक, छात्र | [RU](docs/playbooks/view-student-timetable.ru.md) |
| 5 | [छात्र डैशबोर्ड](docs/playbooks/student-dashboard.md) | छात्र | अभिभावक, छात्र | [RU](docs/playbooks/student-dashboard.ru.md) |
| 6 | [छात्र रिपोर्ट कार्ड PDF जनरेट करें](docs/playbooks/generate-student-report-card-pdf.md) | रिपोर्ट | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/generate-student-report-card-pdf.ru.md) · [ES](docs/playbooks/generate-student-report-card-pdf.es.md) |
| 7 | [एक नए छात्र का नामांकन करें](docs/playbooks/enroll-new-student.md) | छात्र | व्यवस्थापक, रजिस्ट्रार | [RU](docs/playbooks/enroll-new-student.ru.md) · [ES](docs/playbooks/enroll-new-student.es.md) |
| 8 | [एक व्यवहार घटना दर्ज करें](docs/playbooks/record-behavior-incident.md) | छात्र | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/record-behavior-incident.ru.md) · [ES](docs/playbooks/record-behavior-incident.es.md) |
| 9 | [परीक्षा अंक जमा करें](docs/playbooks/submit-exam-marks.md) | मूल्यांकन | शिक्षक | [RU](docs/playbooks/submit-exam-marks.ru.md) |
| 10 | [संस्थान सारांश](docs/playbooks/institution-summary.md) | संस्थान | व्यवस्थापक, अभिभावक | [RU](docs/playbooks/institution-summary.ru.md) |
| 11 | [संस्थान सांख्यिकी PDF जनरेट करें](docs/playbooks/generate-institution-statistics-pdf.md) | रिपोर्ट | व्यवस्थापक | [RU](docs/playbooks/generate-institution-statistics-pdf.ru.md) · [ES](docs/playbooks/generate-institution-statistics-pdf.es.md) |
| 12 | [नवीनतम उपस्थिति देखें](docs/playbooks/view-latest-attendance.md) | उपस्थिति | शिक्षक, व्यवस्थापक, अभिभावक | |
| 13 | [छात्र प्रोफ़ाइल देखें](docs/playbooks/view-student-profile.md) | छात्र | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/view-student-profile.ru.md) |
| 14 | [छात्र अंक देखें](docs/playbooks/view-student-marks.md) | मूल्यांकन | शिक्षक, व्यवस्थापक, अभिभावक | [RU](docs/playbooks/view-student-marks.ru.md) |
| 15 | [कक्षा रिपोर्ट देखें](docs/playbooks/view-class-report.md) | रिपोर्ट | शिक्षक, व्यवस्थापक | [RU](docs/playbooks/view-class-report.ru.md) |
| 16 | [समय सारिणी देखें](docs/playbooks/view-timetable.md) | अनुसूची | शिक्षक, व्यवस्थापक, छात्र | [RU](docs/playbooks/view-timetable.ru.md) |
| 17 | [पूर्ण संस्थान प्रोफ़ाइल देखें](docs/playbooks/view-institution-profile.md) | संस्थान | व्यवस्थापक, अभिभावक, सार्वजनिक | |
| 18 | [पूर्ण कक्षा प्रोफ़ाइल देखें](docs/playbooks/view-class-profile.md) | छात्र | शिक्षक, व्यवस्थापक | |
| 19 | [एक स्टाफ सदस्य की पूर्ण प्रोफ़ाइल देखें](docs/playbooks/view-staff-profile.md) | स्टाफ | व्यवस्थापक, एचआर | [RU](docs/playbooks/view-staff-profile.ru.md) |
| 20 | [छात्र प्रोफ़ाइल बढ़ाएँ](docs/playbooks/enhance-student-profile.md) | छात्र | शिक्षक, व्यवस्थापक, काउंसलर | [ES](docs/playbooks/enhance-student-profile.es.md) |
| 21 | [संस्थान अवसंरचना देखें](docs/playbooks/view-institution-infrastructure.md) | संस्थान | व्यवस्थापक, सुविधाएँ | |
| 22 | [संस्थान भोजन देखें](docs/playbooks/view-institution-meals.md) | संस्थान | व्यवस्थापक, पोषण विशेषज्ञ, अभिभावक | |
| 23 | [छात्र जोखिम प्रोफ़ाइल देखें](docs/playbooks/view-student-risks.md) | छात्र | व्यवस्थापक, काउंसलर, शिक्षक | |
| 24 | [संस्थान जोखिम सारांश देखें](docs/playbooks/view-institution-risks.md) | संस्थान | व्यवस्थापक, मंत्रालय | |
| 25 | [उपकरण या संपत्ति जोड़ें](docs/playbooks/add-institution-asset.md) ✏️ | अवसंरचना | व्यवस्थापक, लेखाकार, सुविधाएँ | |
| 26 | [एक अवसंरचना मरम्मत दर्ज करें](docs/playbooks/record-infrastructure-repair.md) ✏️ | अवसंरचना | व्यवस्थापक, लेखाकार, सुविधाएँ | |
| 27 | [एक नया भोजन कार्यक्रम जोड़ें](docs/playbooks/add-meal-programme.md) ✏️ | भोजन | व्यवस्थापक, लेखाकार, पोषण विशेषज्ञ | |

---

## रोडमैप

### v0.4.0 — ब्राउज़र प्रमाणीकरण (योजनाबद्ध)

आज, क्रेडेंशियल्स के लिए OpenEMIS व्यवस्थापक से मैन्युअल रूप से जारी किए गए `api_key` की आवश्यकता होती है। v0.4.0 एक वैकल्पिक `openemis_browser_auth` टूल जोड़ेगा जो सभी मैन्युअल क्रेडेंशियल कॉन्फ़िगरेशन को समाप्त करता है:

1.  टूल एक स्थानीय Playwright ब्राउज़र लॉन्च करता है — **पूर्व-आवश्यकता के रूप में कोई लक्ष्य URL आवश्यक नहीं**।
2.  उपयोगकर्ता अपने OpenEMIS इंस्टेंस पर नेविगेट करता है और सामान्य रूप से लॉग इन करता है।
3.  Playwright सभी नेटवर्क ट्रैफ़िक देखता है। जब यह **`POST */api/v5/login`** या **`POST */api/v4/login`** (दोनों समान JWT लौटाते हैं) की प्रतिक्रिया देखता है:
    - **बेस URL** स्वचालित रूप से अनुरोध URL से निकाला जाता है (जैसे `https://dev-demo.openemis.org/core/api/v5/login` → बेस `https://dev-demo.openemis.org/core`) — `OPENEMIS_BASE_URL` को पूर्व-कॉन्फ़िगर करने की आवश्यकता नहीं है।
    - **JWT** प्रतिक्रिया बॉडी से निकाला जाता है।
4.  दोनों को मेमोरी में कैश किया जाता है और सभी बाद की CRUD कॉल के लिए उपयोग किया जाता है।

यह `OPENEMIS_BASE_URL`, `OPENEMIS_USERNAME`, `OPENEMIS_PASSWORD`, और `OPENEMIS_API_KEY` को आवश्यकताओं के रूप में हटा देता है — उपयोगकर्ता बस एक ब्राउज़र खोलता है और लॉग इन करता है। किसी भी OpenEMIS इंस्टेंस, किसी भी डोमेन, किसी भी सबडोमेन के साथ काम करता है, जिसमें किसी भी पुनः कॉन्फ़िगरेशन के बिना डेव, स्टेजिंग और प्रोडक्शन वातावरण शामिल हैं।

**`.env`-आधारित क्रेडेंशियल्स पूरी तरह से समर्थित रहते हैं** — मौजूदा सेटअप अपरिवर्तित हैं। ब्राउज़र प्रमाणीकरण नए टूल के माध्यम से ऑप्ट-इन है।

### v0.5.0 — जोखिम डैशबोर्ड ✅

`view-student-risks` और `view-institution-risks` — शिप किया गया। जोखिम स्कोर, प्रति-मानदंड विवरण, कल्याण मामले, अलर्ट नियम, और डिलीवरी लॉग।

### v0.6.0 — वर्कफ़्लो रूट्स *(संस्थान प्रो + देश प्रो)*

वर्तमान लिखने वाले टूल (`openemis_create`, `openemis_update`, `openemis_delete`) एक समय में एक ऑपरेशन निष्पादित करते हैं। वर्कफ़्लो रूट्स इसे आगे ले जाते हैं: MCP **स्वचालित रूप से एक पूर्ण बहु-चरण प्लेबुक को ऑर्केस्ट्रेट करता है**, प्रत्येक चरण में राज्य ले जाता है और प्रत्येक चरण में प्री-कमिट सत्यापन लागू करता है।

**नया टूल:** `openemis_run_workflow { playbook_id, params, dry_run? }` — एक प्लेबुक ID और संरचित इनपुट पैरामीटर्स स्वीकार करता है, अनुक्रम में सभी चरण निष्पादित करता है, एक संरचित रन लॉग लौटाता है। ड्राई-रन मोड में, बिना कुछ लिखे क्या बदलेगा, इसकी रिपोर्ट करता है।

वर्कफ़्लो रूट्स व्यक्तिगत प्रो के ऊपर गेटेड हैं क्योंकि संस्थान या राष्ट्रीय पैमाने पर बल्क AI लेखन को निगरानी की आवश्यकता होती है। 30 छात्रों को अंकित करने वाले शिक्षक को गति की आवश्य
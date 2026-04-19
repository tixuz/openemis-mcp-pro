# संस्था अवसंरचना देखें (भूमि, भवन, उपयोगिताएँ, WASH)

**डोमेन:** संस्था  
**दर्शक:** प्रशासक, सुविधाएँ  
**प्लेबुक ID:** `view-institution-infrastructure`

## विवरण

किसी संस्था की भौतिक अवसंरचना देखें: भूमि खंड, प्रति भूमि भवन, उपयोगिताएँ (बिजली), और WASH रिकॉर्ड (पानी और स्वच्छता)। **भूमि और भवन `academic_period_id` द्वारा स्कोप नहीं हैं** — यह फ़ील्ड POCOR-8037 में हटा दी गई थी। उपयोगिताएँ और WASH `academic_period_id` द्वारा स्कोप हैं।

---

## उपयोग किए गए संसाधन

| संसाधन | उद्देश्य |
|---|---|
| `institution-lands` | संस्था में पंजीकृत भूमि खंड (कोई शैक्षणिक अवधि स्कोप नहीं) |
| `institution-buildings` | प्रत्येक भूमि खंड के अंतर्गत नेस्टेड भवन (कोई शैक्षणिक अवधि स्कोप नहीं) |
| `infrastructure-statuses` | वैश्विक लुकअप: IN_USE, END_OF_USAGE, CHANGE_IN_TYPE स्टेटस कोड |
| `infrastructure-conditions` | वैश्विक लुकअप: स्थिति लेबल (अच्छा, मध्यम, खराब, आदि) |
| `land-types` | वैश्विक लुकअप: भूमि प्रकार लेबल |
| `building-types` | वैश्विक लुकअप: भवन प्रकार लेबल |
| `infrastructure-utility-electricities` | बिजली उपयोगिता रिकॉर्ड (संस्था + शैक्षणिक अवधि द्वारा स्कोप) |
| `infrastructure-wash-waters` | जल आपूर्ति और गुणवत्ता रिकॉर्ड (संस्था + शैक्षणिक अवधि द्वारा स्कोप) |
| `infrastructure-wash-sanitations` | लिंग और कार्यक्षमता के अनुसार स्वच्छता सुविधा गणना |

---

## चरण

| चरण | क्रिया | संसाधन | उद्देश्य |
|---|---|---|---|
| 1 | `openemis_get` | `institution-lands` | सक्रिय भूमि खंड सूचीबद्ध करें |
| 2 | `openemis_get` | `institution-buildings` | प्रति भूमि खंड भवन सूचीबद्ध करें |
| 3 | `openemis_get` | `infrastructure-statuses` + लुकअप | स्थिति, स्टेटस, प्रकार ID हल करें (समानांतर) |
| 4 | `openemis_get` | `infrastructure-utility-electricities` | बिजली उपयोगिता रिकॉर्ड |
| 5 | `openemis_get` | `infrastructure-wash-waters` | WASH जल रिकॉर्ड |
| 6 | `openemis_get` | `infrastructure-wash-sanitations` | WASH स्वच्छता गणना |

---

## चरण नोट्स

**चरण 1 — सक्रिय भूमि खंड**  
`institution_id` द्वारा फ़िल्टर करें। **`academic_period_id` पास न करें** — इसे POCOR-8037 में इस संसाधन से हटा दिया गया था और यह चुपचाप कुछ नहीं करेगा या त्रुटियाँ उत्पन्न करेगा। केवल सक्रिय खंड प्राप्त करने के लिए, `land_status_id` को `infrastructure-statuses` से `IN_USE` कोड से मिलान करते हुए भी फ़िल्टर करें। प्रत्येक रिकॉर्ड का `land_type_id` और `infrastructure_condition_id` चरण 3 में हल किया जाता है।

**चरण 2 — भूमि प्रति भवन**  
`institution_id` (सभी भवन) या `institution_land_id` (एक भूमि के भवन) द्वारा फ़िल्टर करें। समान नियम: **कोई `academic_period_id` नहीं**। `IN_USE` रिकॉर्ड के लिए `building_status_id` द्वारा फ़िल्टर करें। प्रत्येक भवन का `building_type_id` और `infrastructure_condition_id` चरण 3 में हल किया जाता है। भवन क्षेत्र मूल भूमि क्षेत्र से कम होना चाहिए (API द्वारा लागू)।

**चरण 3 — लुकअप टेबल हल करें** *(समानांतर में चलाया जा सकता है)*  
`infrastructure-statuses`, `infrastructure-conditions`, `land-types`, और `building-types` एक साथ प्राप्त करें — सभी वैश्विक संदर्भ सूचियाँ हैं जिनमें कोई `institution_id` या `academic_period_id` फ़िल्टर नहीं है।

> ⚠️ **स्टेटस FK नामकरण स्तर-विशिष्ट है:** भूमि के लिए `land_status_id`, भवनों के लिए `building_status_id` — दोनों एक ही `infrastructure_statuses` टेबल की ओर इशारा करते हैं। इन FK नामों को मिलाएं नहीं।

**चरण 4 — बिजली उपयोगिता**  
`institution_id` और `academic_period_id` द्वारा फ़िल्टर करें (दोनों आवश्यक — भूमि/भवनों के विपरीत, उपयोगिताएँ अवधि द्वारा स्कोप हैं)। साथ ही `is_current=1` द्वारा फ़िल्टर करें ताकि सॉफ्ट-डिलीट रिकॉर्ड बाहर हों (POCOR-9475 में जोड़ा गया फ़्लैग)। `utility_electricity_type_id` को `/api/v5/utility-electricity-types` के माध्यम से हल करें।

**चरण 5 — WASH जल**  
`institution_id` और `academic_period_id` द्वारा फ़िल्टर करें। सभी FK कॉलम पैटर्न `infrastructure_wash_water_*_id` (प्रकार, कार्यक्षमता, निकटता, मात्रा, गुणवत्ता, पहुँच) का अनुसरण करते हैं। प्रत्येक को मिलान वाले `/api/v5/infrastructure-wash-water-*` संदर्भ एंडपॉइंट के माध्यम से हल करें।

**चरण 6 — WASH स्वच्छता**  
`institution_id` और `academic_period_id` द्वारा फ़िल्टर करें। गणना फ़ील्ड: `infrastructure_wash_sanitation_{gender}_{status}` — जैसे `male_functional`, `female_nonfunctional`, `mixed_functional`। `total_male`, `total_female`, `total_mixed` कॉलम **बैकएंड द्वारा `beforeSave` में स्वचालित रूप से गणना किए जाते हैं** — इनमें लिखने का प्रयास न करें। चरण 4–6 को समानांतर में प्राप्त किया जा सकता है एक बार `institution_id` और `academic_period_id` ज्ञात हो जाने पर।

---

## प्रमुख सावधानियाँ

- **`institution-lands` और `institution-buildings` में कोई `academic_period_id` फ़िल्टर नहीं है** — POCOR-8037 में हटा दिया गया। इन दो संसाधनों के लिए इसे कभी पास न करें।
- **स्टेटस FK स्तर के अनुसार भिन्न होता है:** भूमि के लिए `land_status_id`, भवनों के लिए `building_status_id` — एक ही `infrastructure_statuses` टेबल, अलग कॉलम नाम।
- **`infrastructure_ownership_id`** भूमि और भवन दोनों पर सही FK नाम है (`ownership_id` नहीं)।
- **उपयोगिताएँ और WASH के लिए `academic_period_id` आवश्यक है** — मूल अवसंरचना के विपरीत।
- **स्वच्छता कुल केवल पढ़ने योग्य हैं** — ये बैकएंड द्वारा स्वचालित रूप से गणना किए जाते हैं।

---

## उदाहरण क्वेरी

> *"मुझे एवरी प्राइमरी स्कूल की भौतिक अवसंरचना दिखाएँ — भूमि, भवन, बिजली, और पानी।"*

1. `openemis_get { resource: "institution-lands", params: { institution_id: 6 } }` → 2 भूमि खंड (land_status_id → IN_USE)
2. `openemis_get { resource: "institution-buildings", params: { institution_id: 6 } }` → 4 भवन
3. `infrastructure-statuses`, `infrastructure-conditions`, `land-types`, `building-types` समानांतर में प्राप्त करें → सभी ID हल करें
4. `openemis_get { resource: "infrastructure-utility-electricities", params: { institution_id: 6, academic_period_id: 1, is_current: 1 } }` → ग्रिड बिजली, अच्छी स्थिति
5. `openemis_get { resource: "infrastructure-wash-waters", params: { institution_id: 6, academic_period_id: 1 } }` → पाइपलाइन पानी, कार्यात्मक
6. `openemis_get { resource: "infrastructure-wash-sanitations", params: { institution_id: 6, academic_period_id: 1 } }` → 4 पुरुष, 4 महिला शौचालय कार्यात्मक
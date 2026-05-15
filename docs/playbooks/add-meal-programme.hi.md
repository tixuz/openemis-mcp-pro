---
title: OpenEMIS में किसी संस्थान में एक नया भोजन कार्यक्रम जोड़ें
description: यह OpenEMIS प्लेबुक बताता है कि स्कूल प्रबंधन प्रणाली के लेखन टूल का उपयोग करके किसी संस्थान में नया भोजन कार्यक्रम कैसे बनाएं।
keywords:
  - OpenEMIS
  - स्कूल प्रबंधन प्रणाली
  - शिक्षा प्रबंधन
---

# OpenEMIS में किसी संस्थान में एक नया भोजन कार्यक्रम जोड़ें

**डोमेन:** भोजन  
**दर्शक:** प्रशासक, लेखाकार, पोषण विशेषज्ञ  
**प्लेबुक ID:** `add-meal-programme`

## विवरण

एक नई भोजन कार्यक्रम परिभाषा बनाएं और इसे किसी संस्थान को सौंपें। प्रवाह दो-चरणीय है: पहले वैश्विक कार्यक्रम रिकॉर्ड (`meal-programmes`) बनाएं, फिर संस्थान-स्तरीय वितरण असाइनमेंट (`institution-meal-programmes`) लॉग करें। कोई वर्कफ़्लो प्लगइन शामिल नहीं है — दोनों लेखन सीधे और तत्काल हैं। वैकल्पिक रूप से पोषण लक्ष्यों को लिंक करें और विशिष्ट छात्रों को नामांकित करें।

> ⚠️ **FK एलियास ट्रैप:** `meal-programmes` पर `type` और `targeting` **स्ट्रिंग एनम मान** हैं, पूर्णांक ID नहीं। स्ट्रिंग भेजें (जैसे `"Lunch"`, `"All Students"`) — लुकअप से ID नहीं।  
> ⚠️ **बहुवचन FK नाम:** `institution-meal-programmes` और `meal-nutritional-records` दोनों में `meal-programmes` की FK **`meal_programmes_id`** है (अंत में `s` के साथ) — `meal_programme_id` नहीं। एकवचन रूप का उपयोग करने से साइलेंट फेल्योर या 422 होता है।

---

## पहले पूछने के प्रश्न

| प्रश्न | फ़ील्ड | संसाधन | नोट्स |
|---|---|---|---|
| कार्यक्रम का नाम? | `name` | meal-programmes | उदा. "सरकारी लंच कार्यक्रम 2025" |
| शॉर्ट कोड? | `code` | meal-programmes | अद्वितीय, उदा. `GLP-2025` |
| भोजन प्रकार? (नाश्ता / लंच / स्नैक / डिनर) | `type` | meal-programmes | स्ट्रिंग मान — वैध विकल्प देखने के लिए `meal-programme-types` से फ़ेच करें |
| इसे कौन प्राप्त करता है? (सभी छात्र / कमजोर / प्राथमिक ग्रेड…) | `targeting` | meal-programmes | स्ट्रिंग मान — वैध विकल्प देखने के लिए `meal-target-types` से फ़ेच करें |
| प्रारंभ तिथि? | `start_date` | meal-programmes | YYYY-MM-DD |
| समाप्ति तिथि? | `end_date` | meal-programmes | YYYY-MM-DD, `start_date` से ≥ होनी चाहिए |
| शैक्षणिक अवधि? | `academic_period_id` | meal-programmes | `academic-periods` के माध्यम से रिज़ॉल्व करें |
| इस स्कूल में वितरण तिथि? | `date_received` | institution-meal-programmes | YYYY-MM-DD — जब कार्यक्रम पहली बार स्कूल तक पहुँचता है |
| अपेक्षित मात्रा / छात्र संख्या? | `quantity_received` | institution-meal-programmes | पूर्णांक |

---

## उपयोग किए गए संसाधन

| संसाधन | उद्देश्य |
|---|---|
| `academic-periods` | लुकअप: सक्रिय शैक्षणिक अवधि ID |
| `meal-programme-types` | लुकअप: `type` फ़ील्ड के लिए वैध स्ट्रिंग मान |
| `meal-target-types` | लुकअप: `targeting` फ़ील्ड के लिए वैध स्ट्रिंग मान |
| `meal-implementers` | लुकअप: कार्यान्वयक नाम → ID (`institution-meal-programmes` के लिए) |
| `meal-programmes` | लेखन: वैश्विक कार्यक्रम परिभाषा बनाएं |
| `institution-meal-programmes` | लेखन: संस्थान पर असाइनमेंट / वितरण लॉग करें |
| `meal-nutritional-records` | लेखन (वैकल्पिक): पोषण लक्ष्यों को कार्यक्रम से लिंक करें |

---

## चरण

| चरण | क्रिया | संसाधन | उद्देश्य |
|---|---|---|---|
| 1 | `openemis_get` | `academic-periods` | सक्रिय `academic_period_id` रिज़ॉल्व करें |
| 2 | `openemis_get` | `meal-programme-types` | वैध `type` स्ट्रिंग मानों की सूची बनाएं |
| 3 | `openemis_get` | `meal-target-types` | वैध `targeting` स्ट्रिंग मानों की सूची बनाएं |
| 4 | `openemis_create` | `meal-programmes` | वैश्विक कार्यक्रम रिकॉर्ड बनाएं |
| 5 | `openemis_create` | `institution-meal-programmes` | इस संस्थान पर असाइन / वितरण लॉग करें |
| 6 | `openemis_create` (वैकल्पिक) | `meal-nutritional-records` | प्रत्येक पोषण लक्ष्य को लिंक करें |

---

## चरण नोट्स

**चरण 1–3 — लुकअप्स**  
`current = 1` से फ़िल्टर करके या नाम से चुनकर शैक्षणिक अवधि फ़ेच करें। `meal-programme-types` और `meal-target-types` के लिए, सभी मानों की सूची बनाएं — उपयोगकर्ता को `name` स्ट्रिंग्स दिखाएं और चयनित स्ट्रिंग को POST बॉडी में उपयोग करें (ID नहीं)।

**चरण 4 — वैश्विक कार्यक्रम बनाएं**

```json
POST /api/v5/meal-programmes
{
  "academic_period_id": 12,
  "name":               "Government Lunch Programme 2025",
  "code":               "GLP-2025",
  "type":               "Lunch",
  "targeting":          "All Students",
  "start_date":         "2025-01-06",
  "end_date":           "2025-11-28"
}
```

प्रतिक्रिया: अगले चरण के लिए `id` को `meal_programmes_id` के रूप में कैप्चर करती है।

**चरण 5 — संस्थान को असाइन करें**

```json
POST /api/v5/institution-meal-programmes
{
  "academic_period_id":  12,
  "meal_programmes_id":  1047,
  "institution_id":      6,
  "date_received":       "2025-01-06",
  "quantity_received":   420
}
```

> ⚠️ `(institution_id, date_received, meal_programmes_id)` पर अद्वितीय कंस्ट्रेंट — एक ही स्कूल + तिथि + कार्यक्रम के लिए डुप्लिकेट डिलीवरी 409 Conflict लौटाती है।

**चरण 6 — पोषण लक्ष्य लिंक करें (वैकल्पिक)**

```json
POST /api/v5/meal-nutritional-records
{
  "meal_programmes_id":     1047,
  "nutritional_content_id": 10
}
```

प्रत्येक पोषण घटक के लिए दोहराएं। `nutritional_content_id` को `GET /api/v5/meal-nutritions` के माध्यम से रिज़ॉल्व करें।

---

## प्रमुख गोटचाज़

- **`type` और `targeting` स्ट्रिंग मान हैं**, पूर्णांक ID नहीं — `meal-programme-types` / `meal-target-types` से नाम स्ट्रिंग का उपयोग करें, लुकअप टेबल की `id` का नहीं।
- **`meal_programmes_id` अंत में `s` के साथ** — `institution-meal-programmes` और `meal-nutritional-records` में FK फ़ील्ड नाम। `meal_programme_id` (बिना `s` के) का उपयोग करने से साइलेंट फेल्योर या 422 लौटता है।
- **`nutritional_content_id`** (`meal_nutrition_id` या `nutrition_id` नहीं) — रीड प्लेबुक से पुष्टि किया गया FK ट्रैप, राइट सरफेस में सत्यापित।
- **`meal-implementers` में FieldOption फ़ील्ड्स हैं** (`visible`, `order`, `default`) — NULL रीसेट से बचने के लिए PUT पर इन्हें शामिल करें।
- **कोई वर्कफ़्लो प्लगइन नहीं** — भोजन लेखन सीधे हैं और अनुमोदन या वर्कफ़्लो चरणों की आवश्यकता नहीं है।
- **डुप्लिकेट डिलीवरी पर 409** — अद्वितीय कंस्ट्रेंट `(institution_id, date_received, meal_programmes_id)` है, अवधि-आधारित नहीं।

---

## उदाहरण क्वेरी

> *"एवरी प्राइमरी में सभी छात्रों के लिए जनवरी 2025 से शुरू होने वाला, कोड GLP-2025 वाला एक सरकारी लंच कार्यक्रम जोड़ें।"*

1. `openemis_get { resource: "academic-periods", params: { current: 1 } }` → id: 12
2. `openemis_get { resource: "meal-programme-types" }` → "Breakfast", "Lunch", "Snack"
3. `openemis_get { resource: "meal-target-types" }` → "All Students", "Vulnerable", "Primary"
4. `openemis_create { resource: "meal-programmes", body: { academic_period_id: 12, name: "Government Lunch Programme 2025", code: "GLP-2025", type: "Lunch", targeting: "All Students", start_date: "2025-01-06", end_date: "2025-11-28" } }` → id: 1047
5. `openemis_create { resource: "institution-meal-programmes", body: { academic_period_id: 12, meal_programmes_id: 1047, institution_id: 6, date_received: "2025-01-06", quantity_received: 420 } }`
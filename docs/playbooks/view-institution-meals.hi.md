---
title: OpenEMIS में संस्थान भोजन कार्यक्रम देखें
description: यह OpenEMIS प्लेबुक बताता है कि स्कूल प्रबंधन प्रणाली से किसी संस्थान के भोजन कार्यक्रमों और छात्र भागीदारी की जानकारी कैसे प्राप्त करें।
keywords:
  - OpenEMIS
  - स्कूल प्रबंधन प्रणाली
  - शिक्षा प्रबंधन
---

# OpenEMIS में संस्थान भोजन कार्यक्रम और छात्र भागीदारी देखें

**डोमेन:** संस्थान  
**दर्शक:** प्रशासक, पोषण विशेषज्ञ, अभिभावक  
**प्लेबुक आईडी:** `view-institution-meals`

## विवरण

किसी संस्थान द्वारा चलाए जा रहे भोजन कार्यक्रम, उनकी पोषण सामग्री और कौन से छात्र नामांकित हैं, देखें। `institution_id` और `academic_period_id` द्वारा स्कोप किया गया। मुख्य ध्यान देने योग्य बात: `meal-nutritional-records` में `meal_nutritions` टेबल के लिए FK `nutritional_content_id` है — **न कि** `meal_nutrition_id`।

---

## उपयोग किए गए संसाधन

| संसाधन | उद्देश्य |
|---|---|
| `institution-meal-programmes` | वर्तमान शैक्षणिक अवधि में संस्थान द्वारा चलाए जाने वाले भोजन कार्यक्रम |
| `meal-programme-types` | वैश्विक लुकअप: कार्यक्रम प्रकार लेबल |
| `meal-implementers` | वैश्विक लुकअप: कार्यान्वयन संगठन |
| `meal-nutritional-records` | कार्यक्रमों को पोषण सामग्री से जोड़ने वाली जॉइन टेबल |
| `meal-benefits` | वैश्विक लुकअप: लाभ प्रकार लेबल |
| `institution-meal-students` | प्रति-दिन छात्र भोजन भागीदारी रिकॉर्ड |

---

## चरण

| चरण | क्रिया | संसाधन | उद्देश्य |
|---|---|---|---|
| 1 | `openemis_get` | `institution-meal-programmes` | इस संस्थान/अवधि के लिए सक्रिय भोजन कार्यक्रमों की सूची बनाएं |
| 2 | `openemis_get` | `meal-programme-types` + लुकअप | प्रकार, कार्यान्वयक, लाभ आईडी रिज़ॉल्व करें (समानांतर) |
| 3 | `openemis_get` | `meal-nutritional-records` | प्रति कार्यक्रम पोषण सामग्री प्राप्त करें |
| 4 | `openemis_get` | `institution-meal-students` | छात्र भागीदारी रिकॉर्ड की सूची बनाएं |

---

## चरण नोट्स

**चरण 1 — संस्थान भोजन कार्यक्रम**  
`institution_id` और `academic_period_id` द्वारा फ़िल्टर करें। अंतर्निहित टेबल `meal_institution_programmes` है (न कि `institution_meal_programmes`)। प्रत्येक रिकॉर्ड एक `meal_programme_id` से लिंक होता है — इसे चरण 3 के लिए कैप्चर करें।

> ⚠️ **गैर-मानक FK उपनाम:** कार्यक्रम प्रकार, लक्ष्य समूह और कार्यान्वयक के लिए एसोसिएशन API प्रतिक्रियाओं में सामान्य `_type_id` प्रत्यय के बजाय `type`, `targeting`, और `implementer` के रूप में दिखाई दे सकते हैं। आगे के फ़िल्टर बनाने से पहले वास्तविक प्रतिक्रिया कुंजियों का निरीक्षण करें।

**चरण 2 — लुकअप टेबल रिज़ॉल्व करें** *(समानांतर में चलाएं)*  
`meal-programme-types`, `meal-implementers`, और `meal-benefits` को एक साथ प्राप्त करें — ये सभी वैश्विक संदर्भ सूचियाँ हैं।  
> नोट: `meal-implementers` **FieldOption व्यवहार का उपयोग नहीं करता**। इसमें केवल `id` और `name` हैं — `visible`, `order`, या `default` फ़ील्ड नहीं हैं।

**चरण 3 — पोषण संबंधी रिकॉर्ड**  
`meal_programme_id` (चरण 1 से) द्वारा फ़िल्टर करें।

> ⚠️ **महत्वपूर्ण FK ट्रैप:** इस संसाधन पर `meal_nutritions` टेबल के लिए FK `nutritional_content_id` है — **न कि** `meal_nutrition_id`। गलत नाम का उपयोग करने से चुपचाप खाली परिणाम लौटेंगे। पोषक तत्व नाम (जैसे प्रोटीन, कार्बोहाइड्रेट, कैलोरी, वसा) के लिए `nutritional_content_id` को `/api/v5/meal-nutritions` के माध्यम से रिज़ॉल्व करें।

`meal-nutritional-records` एक जॉइन टेबल के रूप में कार्य करता है (कार्यक्रमों और पोषण के बीच belongsToMany)। इसका एक कंपोजिट PK (`meal_programme_id` + `nutritional_content_id`) हो सकता है जिसमें कोई स्टैंडअलोन पूर्णांक `id` नहीं है — इसे एक नग्न संख्यात्मक id द्वारा क्वेरी न करें।

**चरण 4 — छात्र भागीदारी**  
API संसाधन `institution-meal-students` `student_meal_marked_records` टेबल से मैप होता है — ये **प्रति-दिन** भोजन उपस्थिति रिकॉर्ड हैं, कोई स्थिर नामांकन सूची नहीं। `institution_id`, `academic_period_id`, और वैकल्पिक रूप से `institution_class_id` या `meal_programme_id` द्वारा फ़िल्टर करें। `date` फ़ील्ड विशिष्ट भागीदारी तिथि रिकॉर्ड करती है। `meal_benefit_id` लाभ के प्रकार को इंगित करता है — इसे चरण 2 से `meal-benefits` के माध्यम से रिज़ॉल्व करें।

---

## मुख्य ध्यान देने योग्य बातें

- **`nutritional_content_id`** `meal-nutritional-records` में `meal_nutritions` के लिए FK है — न कि `meal_nutrition_id`। यह सबसे आम साइलेंट-फेल्योर ट्रैप है।
- **`institution-meal-students` प्रति-दिन डेटा है**, कोई नामांकन सूची नहीं। किसी विशिष्ट दिन की भागीदारी गणना के लिए `date` द्वारा फ़िल्टर करें।
- **`meal-implementers` में कोई FieldOption फ़ील्ड नहीं हैं** (`visible`, `order`, `default` इस संसाधन पर मौजूद नहीं हैं)।
- **`institution-meal-programmes` में FK उपनाम अस्पष्टता:** कार्यक्रम प्रकार, लक्ष्य और कार्यान्वयक एसोसिएशन API प्रतिक्रियाओं में `_type_id` प्रत्यय के बजाय छोटी उपनाम कुंजियों (`type`, `targeting`, `implementer`) का उपयोग कर सकते हैं।
- `institution-meal-programmes` और `institution-meal-students` दोनों के लिए `institution_id` और `academic_period_id` आवश्यक हैं।

---

## उदाहरण क्वेरी

> *"एवरी प्राइमरी इस वर्ष कौन से भोजन कार्यक्रम चलाती है, और वे क्या पोषण सामग्री प्रदान करते हैं?"*

1. `openemis_get { resource: "institution-meal-programmes", params: { institution_id: 6, academic_period_id: 1 } }` → 2 कार्यक्रम (स्कूल फीडिंग, सप्लीमेंटरी)
2. `meal-programme-types`, `meal-implementers`, `meal-benefits` को समानांतर में प्राप्त करें → लेबल रिज़ॉल्व करें
3. `openemis_get { resource: "meal-nutritional-records", params: { meal_programme_id: 3 } }` → प्रोटीन 15g, कार्ब्स 45g, कैलोरी 280kcal (नाम रिज़ॉल्व करने के लिए nutritional_content_id का उपयोग करके)
4. `openemis_get { resource: "institution-meal-students", params: { institution_id: 6, academic_period_id: 1, meal_programme_id: 3 } }` → इस टर्म में 312 छात्र-दिन रिकॉर्ड
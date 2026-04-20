# पूरी कक्षा प्रोफ़ाइल देखें

**डोमेन:** छात्र  
**दर्शक:** शिक्षक, प्रशासक  
**प्लेबुक आईडी:** `view-class-profile`

## विवरण

एक कक्षा प्रोफ़ाइल देखें: ग्रेड स्तर असाइनमेंट, नामांकित छात्रों की सूची, सक्रिय विषय, मासिक उपस्थिति सारांश, और पूरी शिक्षक सूची (होमरूम + माध्यमिक + विषय शिक्षक)। उपस्थिति संसाधन एक समग्र प्राथमिक कुंजी का उपयोग करता है — कोई पूर्णांक `id` फ़ील्ड नहीं है; इसे प्राप्त करने के लिए हमेशा सूची-शैली फ़िल्टर का उपयोग करें। शिक्षक सूची तीन टेबलों में फैली हुई है और इसे प्राप्त करने के लिए फैन-आउट + डीड्यूप की आवश्यकता होती है।

---

## उपयोग किए गए संसाधन

| संसाधन | उद्देश्य |
|---|---|
| `institution-classes` | कक्षा की पंक्ति स्वयं — इसमें `staff_id` (होमरूम शिक्षक FK) होता है |
| `institution-class-grades` | यह निर्धारित करें कि यह कक्षा किस शिक्षा ग्रेड स्तर से संबंधित है |
| `institution-class-students` | कक्षा में वर्तमान में नामांकित सभी छात्र |
| `institution-class-subjects` | इस कक्षा में सक्रिय रूप से पढ़ाए जाने वाले विषय |
| `institution-subjects` | `institution_subject_id` से विषय नामों को हल करें |
| `institution-class-attendance-records` | मासिक उपस्थिति सारांश (दैनिक उपस्थित छात्र गणना) |
| `institution-classes-secondary-staff` | कक्षा को सौंपे गए सह-शिक्षक / माध्यमिक कर्मचारी |
| `institution-subject-staff` | विषय शिक्षक — प्रति (विषय, कर्मचारी) जोड़ी एक पंक्ति |

---

## चरण

| चरण | क्रिया | संसाधन | उद्देश्य |
|---|---|---|---|
| 1 | `openemis_get` | `institution-class-grades` | इस कक्षा के लिए ग्रेड स्तर हल करें |
| 2 | `openemis_get` | `institution-class-students` | नामांकित छात्रों की सूची बनाएं |
| 3 | `openemis_get` | `institution-class-subjects` | सक्रिय विषयों की सूची बनाएं |
| 4 | `openemis_get` | `institution-class-attendance-records` | मासिक उपस्थिति सारांश |
| 5 | `openemis_get` × 3 | `institution-classes` · `institution-classes-secondary-staff` · `institution-subject-staff` | शिक्षक सूची (फैन आउट, यूनियन, `staff_id` द्वारा डीड्यूप) |

---

## चरण नोट्स

**चरण 1 — कक्षा ग्रेड असाइनमेंट**  
`institution_class_id` द्वारा फ़िल्टर करें। `education_grade_id` लौटाता है — एक मैपिंग टेबल (कक्षा ↔ ग्रेड)। आमतौर पर प्रति कक्षा एक पंक्ति, लेकिन मल्टी-ग्रेड कॉन्फ़िगरेशन मान्य हैं।

**चरण 2 — नामांकित छात्र**  
`institution_class_id` और `academic_period_id` द्वारा फ़िल्टर करें। केवल वर्तमान में नामांकित छात्रों को लौटाने के लिए `student_status_id=1` सेट करें। यह एक जॉइन टेबल है — यहाँ `id` फ़ील्ड नामांकन रिकॉर्ड आईडी है, छात्र आईडी नहीं। `student_id` `security_users` की FK है।

**चरण 3 — सक्रिय विषय**  
केवल सक्रिय विषयों को लौटाने के लिए `institution_class_id` और `status=1` द्वारा फ़िल्टर करें। विषय नाम शामिल नहीं हैं — केवल `institution_subject_id` FK। यदि आवश्यक हो तो `institution-subjects` के माध्यम से अलग से नाम हल करें।

**चरण 4 — मासिक उपस्थिति सारांश**  
> ⚠️ **महत्वपूर्ण:** `institution-class-attendance-records` में **कोई पूर्णांक `id` फ़ील्ड नहीं है**। इसकी प्राथमिक कुंजी समग्र है: `(institution_class_id, academic_period_id, year, month)`। **कभी भी** `id=` पैरामीटर पास न करें — यह खाली लौटाएगा या त्रुटि देगा।

केवल सूची फ़िल्टर का उपयोग करें:
```
?institution_class_id={id}&academic_period_id={period}&year={year}&month={month}
```
वैकल्पिक रूप से समग्र-कुंजी पथ का उपयोग करें:
```
GET /institution-class-attendance-records/institution_class_id/{X}/academic_period_id/{Y}/year/{Z}/month/{M}
```
`day_1` से `day_31` फ़ील्ड्स दैनिक उपस्थिति गणना रखती हैं; `null` का मतलब है कि उस दिन के लिए उपस्थिति अभी तक जमा नहीं की गई है।

**चरण 5 — शिक्षक सूची**  
कोई एकल एंडपॉइंट कक्षा के लिए पूरी शिक्षक सूची नहीं लौटाता है। तीन टेबलों में फैलाएं और `staff_id` द्वारा यूनियन करें:

**(a) होमरूम शिक्षक** — कक्षा पंक्ति पर स्वयं:
```
openemis_get { resource: "institution-classes", id: 42 }
→ row.staff_id  (एकल security_users FK; null हो सकता है)
```

**(b) माध्यमिक / सह-शिक्षक** — समर्पित जॉइन टेबल (समग्र PK, कोई पूर्णांक `id` नहीं):
```
openemis_get { resource: "institution-classes-secondary-staff",
               params: { institution_class_id: 42 } }
→ secondary_staff_id वाली पंक्तियाँ (security_users की FK)
```

**(c) विषय शिक्षक** — प्रति (विषय, कर्मचारी) जोड़ी एक पंक्ति। सीधे `institution_class_id` द्वारा फ़िल्टर करने योग्य नहीं; चरण 3 से `institution_subject_id` सूची पर फैलाएं:
```
step 3 में प्रत्येक institution_subject_id के लिए:
  openemis_get { resource: "institution-subject-staff",
                 params: { institution_subject_id: subjId } }
→ staff_id वाली पंक्तियाँ
```

**डीड्यूप + नाम हल करना।** एक व्यक्ति कई सूचियों में दिखाई दे सकता है (होमरूम शिक्षक अक्सर एक विषय भी पढ़ाता है)। `staff_id` द्वारा यूनियन करें, फिर एक कॉल में नाम हल करें:
```
openemis_get { resource: "security-users",
               params: { ids: "13,42,99" } }
```

---

## प्रमुख सावधानियाँ

- **समग्र PK — कोई पूर्णांक id नहीं।** `institution-class-attendance-records` की प्राथमिक कुंजी `(institution_class_id, academic_period_id, year, month)` है। कोई भी कॉल जो एक सादा संख्यात्मक `id=` फ़िल्टर का उपयोग करती है, चुपचाप विफल हो जाएगी या गलत डेटा लौटाएगी।
- **केवल मासिक समुच्चय।** यह संसाधन प्रति दिन उपस्थिति-गणना रखता है। यह प्रति-छात्र अनुपस्थिति लॉग नहीं है — व्यक्तिगत अनुपस्थिति के लिए `student-attendance-marked-records` का उपयोग करें।
- **`null` दिन फ़ील्ड ≠ शून्य।** `day_X` फ़ील्ड्स उन दिनों के लिए `null` लौटाती हैं जब उपस्थिति जमा नहीं की गई थी — इसे `लंबित` के रूप में मानें, `0 अनुपस्थित` के रूप में नहीं।
- **शिक्षक सूची खंडित है।** होमरूम `institution-classes.staff_id` पर रहता है, सह-शिक्षक `institution-classes-secondary-staff` पर, विषय शिक्षक `institution-subject-staff` पर। कोई एकल एंडपॉइंट नहीं है जो उन्हें यूनियन करता हो — फैलाएं और डीड्यूप करें।
- **`institution-classes-secondary-staff` समग्र PK।** `(institution_class_id, secondary_staff_id)`। सूची फ़िल्टर का उपयोग करें — संख्यात्मक `id=` पास न करें।
- **`institution-subject-staff` कक्षा-फ़िल्टर करने योग्य नहीं है।** केवल `institution_subject_id` द्वारा फ़िल्टर करें; चरण 3 से कक्षा के विषय आईडी पर पुनरावृति करें।
- **भूमिका-आधारित दृश्यता आज एक क्लाइंट चिंता का विषय है।** प्रधानाचार्य, वीपी और प्रशासकों को अपने संस्थान में *सभी* कक्षाएं देखने की आवश्यकता है, लेकिन एपीआई अभी तक कोई "कक्षाएं जिन्हें मैं देख सकता हूं" एंडपॉइंट प्रदान नहीं करता है। रिवर्स क्वेरी ("यह `staff_id` किन कक्षाओं को देख सकता है?") के लिए समान 3-टेबल फैन-आउट प्लस एक भूमिका जांच की आवश्यकता होती है — एक समर्पित कोर एंडपॉइंट OpenEMIS रोडमैप पर है।

---

## उदाहरण क्वेरी

> *"मुझे वर्तमान शैक्षणिक अवधि के लिए कक्षा 8A की प्रोफ़ाइल दिखाएं।"*

1. `openemis_get { resource: "institution-class-grades", params: { institution_class_id: 42 } }` → ग्रेड 8
2. `openemis_get { resource: "institution-class-students", params: { institution_class_id: 42, academic_period_id: 1, student_status_id: 1 } }` → 28 छात्र
3. `openemis_get { resource: "institution-class-subjects", params: { institution_class_id: 42, status: 1 } }` → 7 विषय (आईडी `[101, 102, …, 107]`)
4. `openemis_get { resource: "institution-class-attendance-records", params: { institution_class_id: 42, academic_period_id: 1, year: 2024, month: 3 } }` → मार्च 2024 दैनिक गणना
5. शिक्षक सूची:
   - `openemis_get { resource: "institution-classes", id: 42 }` → होमरूम `staff_id=7`
   - `openemis_get { resource: "institution-classes-secondary-staff", params: { institution_class_id: 42 } }` → सह-शिक्षक `[12, 19]`
   - `openemis_get { resource: "institution-subject-staff", params: { institution_subject_id: 101 } }` × 7 → विषय शिक्षक `[7, 23, 41, 58, …]`
   - यूनियन + डीड्यूप → `{7, 12, 19, 23, 41, 58, …}`
   - `openemis_get { resource: "security-users", params: { ids: "7,12,19,23,41,58" } }` → एक कॉल में नाम
# पूरी कक्षा प्रोफ़ाइल देखें

**डोमेन:** छात्र  
**दर्शक:** शिक्षक, प्रशासक  
**प्लेबुक आईडी:** `view-class-profile`

## विवरण

एक कक्षा प्रोफ़ाइल देखें: ग्रेड स्तर असाइनमेंट, नामांकित छात्र रोस्टर, सक्रिय विषय, और मासिक उपस्थिति सारांश। उपस्थिति संसाधन एक समग्र प्राथमिक कुंजी का उपयोग करता है — कोई पूर्णांक `id` फ़ील्ड नहीं है; इसे प्राप्त करने के लिए हमेशा सूची-शैली फ़िल्टर का उपयोग करें।

---

## उपयोग किए गए संसाधन

| संसाधन | उद्देश्य |
|---|---|
| `institution-class-grades` | यह निर्धारित करें कि यह कक्षा किस शिक्षा ग्रेड स्तर से संबंधित है |
| `institution-class-students` | कक्षा में वर्तमान में नामांकित सभी छात्र |
| `institution-class-subjects` | इस कक्षा में सक्रिय रूप से पढ़ाए जाने वाले विषय |
| `institution-class-attendance-records` | मासिक उपस्थिति सारांश (दैनिक उपस्थित छात्र गणना) |

---

## चरण

| चरण | क्रिया | संसाधन | उद्देश्य |
|---|---|---|---|
| 1 | `openemis_get` | `institution-class-grades` | इस कक्षा के लिए ग्रेड स्तर निर्धारित करें |
| 2 | `openemis_get` | `institution-class-students` | नामांकित छात्रों की सूची बनाएं |
| 3 | `openemis_get` | `institution-class-subjects` | सक्रिय विषयों की सूची बनाएं |
| 4 | `openemis_get` | `institution-class-attendance-records` | मासिक उपस्थिति सारांश |

---

## चरण नोट्स

**चरण 1 — कक्षा ग्रेड असाइनमेंट**  
`institution_class_id` द्वारा फ़िल्टर करें। `education_grade_id` लौटाता है — एक मैपिंग टेबल (कक्षा ↔ ग्रेड)। आमतौर पर प्रति कक्षा एक पंक्ति, लेकिन बहु-ग्रेड कॉन्फ़िगरेशन मान्य हैं।

**चरण 2 — नामांकित छात्र**  
`institution_class_id` और `academic_period_id` द्वारा फ़िल्टर करें। केवल वर्तमान में नामांकित छात्रों को लौटाने के लिए `student_status_id=1` सेट करें। यह एक जॉइन टेबल है — यहाँ `id` फ़ील्ड नामांकन रिकॉर्ड आईडी है, छात्र आईडी नहीं। `student_id` `security_users` की FK है।

**चरण 3 — सक्रिय विषय**  
केवल सक्रिय विषयों को लौटाने के लिए `institution_class_id` और `status=1` द्वारा फ़िल्टर करें। विषय नाम शामिल नहीं हैं — केवल `institution_subject_id` FK। यदि आवश्यक हो तो `institution-subjects` के माध्यम से नाम अलग से निर्धारित करें।

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
`day_1` से `day_31` फ़ील्ड्स दैनिक उपस्थित गणना रखती हैं; `null` का मतलब है कि उस दिन के लिए उपस्थिति अभी तक जमा नहीं की गई थी।

---

## प्रमुख सावधानियाँ

- **समग्र PK — कोई पूर्णांक id नहीं।** `institution-class-attendance-records` की प्राथमिक कुंजी `(institution_class_id, academic_period_id, year, month)` है। कोई भी कॉल जो एक सादे संख्यात्मक `id=` फ़िल्टर का उपयोग करती है, चुपचाप विफल हो जाएगी या गलत डेटा लौटाएगी।
- **केवल मासिक समुच्चय।** यह संसाधन प्रति दिन उपस्थिति-गणना रखता है। यह प्रति-छात्र अनुपस्थिति लॉग नहीं है — व्यक्तिगत अनुपस्थिति के लिए `student-attendance-marked-records` का उपयोग करें।
- **`null` दिन फ़ील्ड ≠ शून्य।** `day_X` फ़ील्ड्स उन दिनों के लिए `null` लौटाती हैं जब उपस्थिति जमा नहीं की गई थी — इसे `लंबित` के रूप में मानें, `0 अनुपस्थित` के रूप में नहीं।

---

## उदाहरण क्वेरी

> *"मुझे वर्तमान शैक्षणिक अवधि के लिए कक्षा 8A की प्रोफ़ाइल दिखाएं।"*

1. `openemis_get { resource: "institution-class-grades", params: { institution_class_id: 42 } }` → ग्रेड 8
2. `openemis_get { resource: "institution-class-students", params: { institution_class_id: 42, academic_period_id: 1, student_status_id: 1 } }` → 28 छात्र
3. `openemis_get { resource: "institution-class-subjects", params: { institution_class_id: 42, status: 1 } }` → 7 विषय
4. `openemis_get { resource: "institution-class-attendance-records", params: { institution_class_id: 42, academic_period_id: 1, year: 2024, month: 3 } }` → मार्च 2024 दैनिक गणना
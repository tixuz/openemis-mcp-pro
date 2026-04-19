# छात्र प्रोफ़ाइल को संपर्क, राष्ट्रीयता और विशेष आवश्यकताओं के साथ बढ़ाएँ

**डोमेन:** छात्र  
**दर्शक:** शिक्षक, प्रशासक, काउंसलर  
**प्लेबुक आईडी:** `enhance-student-profile`

## विवरण

मौजूदा छात्र प्रोफ़ाइल दृश्य को सीधे संपर्क विवरण, राष्ट्रीयता असाइनमेंट, विशेष-आवश्यकता आकलन और विशेष-आवश्यकता योजनाएँ प्राप्त करके बढ़ाएँ। सभी चार वृद्धि संसाधन `security_user_id` (छात्र का `security_users` से वैश्विक उपयोगकर्ता आईडी) द्वारा फ़िल्टर करते हैं, **न कि** `student_id` (नामांकन FK) द्वारा। विशेष-आवश्यकताओं के लिए खाली परिणाम वैध हैं — अधिकांश छात्रों के कोई रिकॉर्ड नहीं होते।

---

## उपयोग किए गए संसाधन

| संसाधन | उद्देश्य |
|---|---|
| `institution-students` | सक्रिय नामांकन की पुष्टि करें और `security_user_id` प्राप्त करें |
| `user-contacts` | फ़ोन नंबर और ईमेल पते |
| `user-nationalities` | राष्ट्रीयता असाइनमेंट (दोहरी नागरिकता का समर्थन करता है) |
| `user-special-needs-assessments` | विशेष शैक्षिक आवश्यकता (SEN) आकलन |
| `user-special-needs-plans` | व्यक्तिगत शिक्षा योजनाएँ (IEPs) या समान योजनाएँ |

---

## चरण

| चरण | क्रिया | संसाधन | उद्देश्य |
|---|---|---|---|
| 1 | `openemis_get` | `institution-students` | सक्रिय नामांकन की पुष्टि करें; `security_user_id` कैप्चर करें |
| 2 | `openemis_get` | `user-contacts` | फ़ोन/ईमेल संपर्क विवरण प्राप्त करें |
| 3 | `openemis_get` | `user-nationalities` | राष्ट्रीयता असाइनमेंट प्राप्त करें |
| 4 | `openemis_get` | `user-special-needs-assessments` | SEN आकलन प्राप्त करें |
| 5 | `openemis_get` | `user-special-needs-plans` | SEN योजनाएँ / IEPs प्राप्त करें |

---

## चरण नोट्स

**चरण 1 — नामांकन की पुष्टि करें और `security_user_id` प्राप्त करें**  
`student_id` और `student_status_id=1` द्वारा फ़िल्टर करें। `institution-students` पर `student_id` फ़ील्ड **है** `security_user_id` (`security_users` का FK)। इसे कैप्चर करें — चरण 2 से 5 सभी `security_user_id` द्वारा फ़िल्टर करते हैं।

**चरण 2 — संपर्क विवरण**  
`security_user_id` द्वारा फ़िल्टर करें — चरण 1 से वैश्विक उपयोगकर्ता आईडी। केवल `student_id` द्वारा फ़िल्टर न करें — `user-contacts` एक वैश्विक उपयोगकर्ता तालिका है और FK `security_user_id` है। मानव-पठनीय लेबल (जैसे "मोबाइल", "ईमेल") के लिए `contact_type_id` को `/api/v5/contact-types` के माध्यम से रिज़ॉल्व करें। `preferred=true/1` प्रत्येक प्रकार के प्राथमिक संपर्क को चिह्नित करता है।

**चरण 3 — राष्ट्रीयता असाइनमेंट**  
`security_user_id` द्वारा फ़िल्टर करें। एकाधिक पंक्तियाँ वैध हैं (दोहरी नागरिकता)। प्राथमिक राष्ट्रीयता की पहचान करने के लिए `preferred=true` का उपयोग करें। देश के नाम के लिए `nationality_id` को `/api/v5/nationalities` के माध्यम से रिज़ॉल्व करें।

**चरण 4 — SEN आकलन**  
`security_user_id` द्वारा फ़िल्टर करें। एक **खाली परिणाम वैध और सामान्य है** — अधिकांश छात्रों के कोई SEN आकलन नहीं होते। मानव-पठनीय लेबल के लिए `special_need_type_id` को `/api/v5/special-need-types` के माध्यम से और `special_need_difficulty_id` को `/api/v5/special-need-difficulties` के माध्यम से रिज़ॉल्व करें। सूची प्रतिक्रियाओं में `file_content` हमेशा `null` होता है — यदि फ़ाइल की आवश्यकता है तो `GET /{id}` कॉल करें।

**चरण 5 — SEN योजनाएँ**  
`security_user_id` और वैकल्पिक रूप से `academic_period_id` द्वारा फ़िल्टर करें।  
> ⚠️ **वर्तनी:** इस संसाधन पर FK फ़ील्ड `special_needs_plan_types_id` (बहुवचन "needs") है — **न कि** `special_need_plan_type_id` (एकवचन)। गलत वर्तनी का उपयोग करने से चुपचाप विफल हो जाएगा। एक खाली परिणाम वैध है — अधिकांश छात्रों के कोई योजनाएँ नहीं होतीं। सूची प्रतिक्रियाओं में `file_content` हमेशा `null` होता है।

---

## प्रमुख सावधानियाँ

- **सभी चार वृद्धि संसाधन फ़िल्टर कुंजी के रूप में `security_user_id` का उपयोग करते हैं** — छात्र का `security_users` का वैश्विक FK। `institution-students.student_id` कॉलम वही `security_user_id` है।
- **विशेष-आवश्यकता संसाधनों के लिए खाली परिणाम अपेक्षित और वैध हैं।** खाली सरणी को त्रुटि के रूप में न समझें — अधिकांश छात्रों के कोई SEN आकलन या योजनाएँ नहीं होतीं।
- **`user-special-needs-plans` FK वर्तनी:** `special_needs_plan_types_id` (बहुवचन)। `/api/v5/special-needs-plan-types` के माध्यम से रिज़ॉल्व करें।
- **दोनों SEN संसाधनों के लिए सूची प्रतिक्रियाओं में `file_content` हमेशा `null` होता है** — बैंडविड्थ बचाने के लिए। बेस64 फ़ाइल पुनर्प्राप्त करने के लिए किसी विशिष्ट रिकॉर्ड पर `GET /{id}` कॉल करें।
- **चरण 2–5 को समानांतर में प्राप्त किया जा सकता है** एक बार चरण 1 से `security_user_id` ज्ञात हो जाने पर।

---

## उदाहरण क्वेरी

> *"मुझे छात्र अहमद के लिए पूरा प्रोफ़ाइल दें — संपर्क, राष्ट्रीयता, और कोई भी विशेष आवश्यकता रिकॉर्ड।"*

1. `openemis_get { resource: "institution-students", params: { student_id: 102, student_status_id: 1 } }` → security_user_id=102
2. `openemis_get { resource: "user-contacts", params: { security_user_id: 102 } }` → mobile +60-11-222-3333
3. `openemis_get { resource: "user-nationalities", params: { security_user_id: 102 } }` → Malaysian (preferred)
4. `openemis_get { resource: "user-special-needs-assessments", params: { security_user_id: 102 } }` → [] (none)
5. `openemis_get { resource: "user-special-needs-plans", params: { security_user_id: 102 } }` → [] (none)
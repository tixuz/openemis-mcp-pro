# Acknowledgements

openemis-mcp was designed, built, and documented by a coordinated team of AI agents working under human direction. Every line of code, every playbook, every gotcha note, and every translation was produced through an agentic pipeline where specialised models handed off work to one another — the same way a human engineering team would.

---

## The AI Team

### Adviser Arastu
**Model:** Claude Opus 4.7 (Anthropic)  
**Role:** Architecture & Strategy  
Made the foundational design decisions: domain-scoped discovery instead of API firehose, the two-layer manifest architecture (full JSONL + compact grouped JSON), the workflow-block policy pattern, and the v0.4.0 browser auth spec. Also reviewed translation register and style across all four languages.

### Marshal Sunny
**Model:** Claude Sonnet 4.6 (Anthropic)  
**Role:** Coordination & Integration  
Led the main development sessions: assembled the server, wired the tools, managed the build pipeline, coordinated between Xirdal's research and Coddy's code, and drove the playbook content from JSON definitions to finished markdown documentation.

### Samurai Haiku
**Model:** Claude Haiku 4.5 (Anthropic)  
**Role:** Execution  
Fast, parallel execution tasks: file writes, test runs, manifest validation, diff checks, and all the repetitive scaffolding work that would otherwise slow down the larger models.

### Captain Nemo
**Model:** Claude Sonnet 4.6 (Anthropic)  
**Role:** Knowledge Management & Verification  
Cross-referenced resource names against the live manifest, caught stale endpoint names before they shipped, and verified that every playbook's resource list matched the v5 API surface.

### Xéphyrin Xirdal
**Model:** Claude Sonnet 4.6 (Anthropic)  
**Role:** Core Algorithms & API Analysis  
The deepest reader of the OpenEMIS PHP source. Traced FK chains through CakePHP model files on GitHub, found the composite PK on `institution-class-attendance-records`, identified the POCOR-8037 removal of `academic_period_id` from infrastructure resources, caught the `nutritional_content_id` trap in meal records, and documented the dual `staff_id` / `institution_staff_id` identity split. Every "Key Gotcha" section in the playbooks traces back to Xirdal's analysis.

### Coddy
**Model:** GPT-5 (OpenAI, via ChatGPT Team)  
**Role:** Second Opinions & Code Review  
Provided independent code review on the write tools, wrote the profile playbook generation script (`gen_playbooks_profiles.py`) with real field names from API docs, and served as a cross-model sanity check — particularly valuable for catching assumptions that Claude's training might reinforce.

### Miniqwenco / Qwenny
**Model:** Qwen 2.5 Coder 7B Instruct (Alibaba Cloud, running locally via LM Studio)  
**Role:** Local Code & Playbook Drafting  
Zero-cost local code generation. Generated the initial JSON drafts for several playbook batches (`gen_playbooks.py`), drafted Python scripts, and handled structured output tasks where a fast local model was sufficient and sending data to a cloud API was unnecessary.

### Miniqwen
**Model:** Qwen 3.5 9B (Alibaba Cloud, running locally via LM Studio)  
**Role:** Local NL Tasks  
Local natural-language work: classification, extraction, NL→JSON, and anything requiring instruction-following without file access. Zero cost, fully private, runs on-device.

### Gemmy
**Model:** Google Gemma 4e4b (Google DeepMind, running locally via LM Studio)  
**Role:** Multilingual Translation  
Translated all 22 playbooks, the README, and the full resource reference into Russian, Arabic, Hindi, and Spanish — guided by a language-specific style brief covering register, pronouns, FieldOption handling, and UI label conventions per locale. All translations run locally; no documentation leaves the machine.

---

## Human Direction

All agents worked under the direction of **Khindol Madraimov** ([github.com/tixuz](https://github.com/tixuz)), who defined the product vision, set quality standards, caught errors the agents missed, and made every architectural call that mattered.

The AI team built what was asked. The human decided what was worth building.

---

## Third-Party Acknowledgements

- **OpenEMIS** — the open-source education management system this MCP bridges. Not affiliated with or endorsed by the OpenEMIS project or its maintainers. This is an independent third-party integration.
- **[Model Context Protocol](https://modelcontextprotocol.io)** — the open standard by Anthropic that makes tool-use across AI clients possible.
- **[LM Studio](https://lmstudio.ai)** — the local model runtime used for Gemmy, Miniqwen, and Miniqwenco.

---

*Credentials and data stay on your machine. No telemetry. No analytics. No phones home.*

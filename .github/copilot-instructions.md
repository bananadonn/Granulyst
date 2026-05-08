# Capstone Project Context

## Project
- **Name:** Granulyst
- **Tagline:** "We analyze the granular threats you can't catch"
- **What it does:** Granulyst is a 24/7 AI security analyst that continuously 
monitors CVE databases and RSS security feeds to find new vulnerabilities 
relevant to a user's registered tech stack. It classifies severity, extracts 
affected technologies, stores all findings in Airtable, and automatically 
escalates critical threats via Slack notification.
- **Project type:** AI-powered threat intelligence monitoring system
- **Scope:** Single user, backend pipeline (frontend/multi-user planned for later)
- **Repo:** https://github.com/bananadonn/Granulyst

## Architecture
- **Ingestion:** n8n polls NVD API and security RSS feeds on a schedule, 
parses raw CVE data, writes new records to the Vulnerabilities table in Airtable
- **AI Core:** Flowise LLM chains (via Groq) classify severity, extract affected 
technologies from CVE descriptions, and analyze threat indicators — writes 
analysis back to Vulnerabilities table and creates Relevant Findings records 
when tech stack matches are found
- **Specialist:** n8n workflow reads Relevant Findings, compares affected 
technologies against user's registered Tech Stack table, determines relevance, 
updates status and creates Alert records for CRITICAL and HIGH severity matches
- **Integration:** n8n sends Slack notifications for escalated alerts, logs 
all activity to Airtable, updates record statuses throughout the pipeline

## Tech Stack
- n8n Cloud (workflow automation — ingestion, specialist logic, integrations)
- Flowise Cloud (LLM chains — severity classification, tech extraction, analysis)
- Groq API (LLM inference — llama-3.3-70b-versatile)
- Airtable (shared database — 4 tables)
- Slack (notifications for critical alerts)
- GitHub (repo, documentation, portfolio)
- NVD API (National Vulnerability Database — primary CVE source)
- Security RSS feeds (supplementary threat intelligence)

## Airtable Schema

### Vulnerabilities
| Field | Type | Written By | Notes |
|-------|------|------------|-------|
| cve_id | Text | Ingestion | e.g. CVE-2024-1234 |
| title | Text | Ingestion | Short description |
| raw_description | Long Text | Ingestion | Full CVE description |
| severity | Single Select | AI Core | CRITICAL, HIGH, MEDIUM, LOW, INFO |
| affected_technologies | Text | AI Core | Extracted by Flowise chain |
| cvss_score | Number | Ingestion | 0-10 |
| source_url | URL | Ingestion | Origin of the CVE |
| ai_analysis | Long Text | AI Core | Full Flowise chain output |
| ingested_at | Date | Ingestion | When n8n pulled it |
| status | Single Select | AI Core | new, analyzed, dismissed |

### Relevant Findings
| Field | Type | Written By | Notes |
|-------|------|------------|-------|
| vulnerability | Link | Specialist | Links to Vulnerabilities table |
| matched_technologies | Text | Specialist | Which stack items matched |
| relevance_reason | Long Text | AI Core | AI explanation of why relevant |
| severity | Single Select | Specialist | Copied from vulnerability |
| found_at | Date | Specialist | When match was identified |
| status | Single Select | Integration | new, reviewed, escalated, dismissed |

### Alerts
| Field | Type | Written By | Notes |
|-------|------|------------|-------|
| finding | Link | Specialist | Links to Relevant Findings |
| notification_channel | Single Select | Integration | slack, email |
| message_sent | Long Text | Integration | What was sent |
| sent_at | Date | Integration | When notification fired |
| acknowledged | Checkbox | Manual | User confirmed they saw it |

### Tech Stack
| Field | Type | Written By | Notes |
|-------|------|------------|-------|
| technology | Text | Manual | e.g. React, PostgreSQL, AWS |
| version | Text | Manual | Optional, e.g. 18.2 |
| added_at | Date | Manual | When added |

## Conventions
- Field names: snake_case
- Status values: lowercase
- Date fields end in _at
- Boolean fields use is_ prefix
- All LLM responses must be valid JSON — no markdown formatting
- Severity levels: CRITICAL, HIGH, MEDIUM, LOW, INFO (consistent across all tables)

## Current State
- **What's working:** 
  - Three Flowise LLM chains built and tested (classify, analyze, recommend)
  - n8n → Flowise HTTP connection working
  - Airtable schema designed and tables created
- **What's in progress:** 
  - n8n ingestion workflow (NVD API polling)
  - AI Core pipeline wiring
- **What's not started yet:** 
  - Specialist tech stack matching logic
  - Slack integration
  - Full end-to-end pipeline test
- **Known issues:** None yet — fresh start
- **Next milestone:** Checkpoint 2 (Week 9) — one CVE flows through all 
four components end-to-end without manual intervention

## Repository Structure
granulyst/
├── .github/
│   └── copilot-instructions.md
├── docs/
│   └── checkpoint2-audit.md
├── screenshots/
├── components/
│   ├── ingestion/
│   ├── ai-core/
│   ├── specialist/
│   └── integration/
└── prompt-log-don.md

## Pipeline Flow
NVD API / RSS Feeds
↓
n8n (Ingestion) → Airtable: Vulnerabilities [status: new]
↓
Flowise AI Core → Airtable: Vulnerabilities [status: analyzed]
→ Airtable: Relevant Findings [if tech stack match]
↓
n8n (Specialist) → Airtable: Alerts [if CRITICAL or HIGH]
↓
n8n (Integration) → Slack notification

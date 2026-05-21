# Granulyst — Ingestion Component

## What It Does
The Ingestion component is the entry point of the Granulyst pipeline. It runs 
on a schedule via n8n, polling the National Vulnerability Database (NVD) API 
and security RSS feeds for new CVEs and threat advisories. For each new 
vulnerability found, it parses the raw data and writes a structured record to 
the Airtable Vulnerabilities table with status: new, triggering the AI Core 
component to begin analysis.

## How It Connects to Other Components
- **Input:** NVD API (https://services.nvd.nist.gov/rest/json/cves/2.0) 
and security RSS feeds
- **Output:** Writes to Airtable Vulnerabilities table with status: new
- **Triggers:** AI Core monitors for Vulnerabilities records with status: new 
and picks up automatically when Ingestion writes a new record

## Setup Instructions

### Accounts & Keys Required
- n8n Cloud account (cloud.n8n.io)
- Airtable account with Granulyst base created
- Airtable API key (find at airtable.com/create/tokens)
- NVD API key — optional but recommended to avoid rate limits 
(register free at nvd.nist.gov/developers/request-an-api-key)

### n8n Configuration
1. Create a new workflow called "Granulyst — Ingestion"
2. Add a **Schedule Trigger** node — set to run every 6 hours (or your 
preferred interval)
3. Add an **HTTP Request** node to call the NVD API:
   - Method: GET
   - URL: https://services.nvd.nist.gov/rest/json/cves/2.0
   - Parameters: 
     - pubStartDate: (last run timestamp)
     - pubEndDate: (current timestamp)
     - resultsPerPage: 20
4. Add a **Split In Batches** node to process each CVE individually
5. Add an **Airtable** node to write each record:
   - Operation: Create Record
   - Table: Vulnerabilities
   - Map fields: cve_id, title, raw_description, cvss_score, 
   source_url, ingested_at, status (hardcode to "new")

### Field Mapping from NVD API Response
| Airtable Field | NVD API Path |
|---------------|--------------|
| cve_id | vulnerabilities[].cve.id |
| title | vulnerabilities[].cve.descriptions[0].value |
| raw_description | vulnerabilities[].cve.descriptions[0].value |
| cvss_score | vulnerabilities[].cve.metrics.cvssMetricV31[0].cvssData.baseScore |
| source_url | https://nvd.nist.gov/vuln/detail/ + cve_id |
| ingested_at | Current timestamp |
| status | "new" (hardcoded) |

## How to Test It
1. Add 3-5 technologies to your Tech Stack table in Airtable first
2. In n8n, open the Ingestion workflow and click **Test Workflow**
3. Check your Airtable Vulnerabilities table — you should see new records 
appearing with status: new
4. Verify all fields are populated correctly, especially cvss_score and cve_id
5. Run it twice and confirm duplicate CVEs are not being created 
(add a deduplication check on cve_id)

## Known Limitations
- NVD API has rate limits — without an API key you are limited to 5 requests 
per 30 seconds
- CVEs published before the last run timestamp may be missed if the schedule 
trigger has downtime — consider a small overlap window when setting date ranges
- Some CVEs may not have a CVSS score yet if they were recently published — 
handle null values in the cvss_score field gracefully
- RSS feeds vary in format — each feed source may need its own parsing logic 
in n8n
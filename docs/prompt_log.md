# Prompt Log — Don Reith

**Project:** Granulyst
**Team:** Solo — just me (Don), so I own all four components
**My Component:** Ingestion / AI Core / Specialist / Integration (all of them)
**AI Tools Used:** GitHub Copilot (setup + in-editor), Claude (used as the
permitted alternative for the audit and artifact work)

---

## How to Use This Log

Add an entry for each significant AI interaction:
- Chat conversations where I asked it to generate, explain, or debug something
- Moments where the AI was wrong and I had to fix it (these are the most valuable)
- Cases where I refined a prompt to get a better result

Don't log: every autocomplete of a bracket or variable name.

---

## [2026-05-20] — Getting AI to fix my docs to match what I actually built

**Context:** My capstone repo was open. The problem I was trying to solve: my
documentation had drifted hard. I built Granulyst kind of out of order — I just
built whatever made sense to me at the time — and then earlier I'd filled in my
`copilot-instructions.md` and a first audit using AI *before the project was
finished*. So my docs described a project that no longer existed. I had four
working n8n workflows (Ingestion, AI core, Alert, plus a Sign up workflow behind
my Vercel frontend) but the docs still said most of it wasn't built and described
the wrong Airtable schema. I wanted the AI to read my actual project and make
everything line up before I submit the Week 8 lab.

**Prompt:**
> "Update my `copilot-instructions.md` to reflect my actual capstone. Read my
> existing files, my n8n exports, and my Airtable schema, and fill in the Part 2.2
> template. Be specific, not generic. Ask me for anything you can't infer (team
> names, current state, known issues). Then run the Part 2.3 audit on me."

**Result:** Before I handed over my n8n workflow exports, the AI tried to infer my
Airtable schema from my older docs plus my signup frontend. It did a decent job of
*noticing* there had to be a Users table (my frontend posts name/email/tech_list),
but then it **guessed the details wrong** — it proposed a Users table with
`slack_id` and `is_active` fields and assumed I had 4 tables total. When I exported
my real workflows and gave it the JSON, the truth came out: I actually have **5
tables**, my Users table only has `name`, `email`, `date` and some link fields, and
there's **no `slack_id` anywhere** — which is the whole reason my Slack alerts are
still hardcoded to DM me instead of the matched user. A bunch of field names were
off too (`affected_tech` not `affected_technologies`, `matching_tech` not
`matched_technologies`, every date field is just `date`, etc.).

**Evaluation:** Mixed, and that's the useful part. The AI was genuinely good once
it had my real workflow JSON — it caught real bugs I'd half-forgotten (my Relevant
Findings and Alerts both upsert on `vulnerability` only, so two users with the same
tech overwrite each other; and nothing marks a CVE as "already alerted," so the
Alert workflow re-fires Slack every 10 minutes). But everything it produced
*before* I gave it the actual source was confident and wrong. It wasn't lying — it
was filling gaps with plausible guesses, exactly like my earlier AI-written docs
did. Same failure mode that got me into this mess in the first place.

**What I changed:** I rejected the guessed Users schema (the `slack_id`/`is_active`
stuff) and replaced it with the real fields from my export. I also had it correct
the "single user / backend only" framing — my project is multi-user now, the
frontend is live. I kept all the bug findings; those were accurate. Decision: I'm
documenting every bug honestly in the audit and Known Issues but not fixing them
yet, since the lab grades the audit on honest gap analysis, not on a bug-free
product, and Checkpoint 2 only needs one record end-to-end (which works for me as
the single user).

**What I learned:** Don't ask AI to *infer* my schema — give it the source of
truth. The minute I pasted my actual n8n workflow JSON, the quality jumped, because
now it was reading what the system does instead of guessing from stale prose. This
is literally the lesson from Part 1: better context in → better output out. My
takeaway for next time: keep `copilot-instructions.md` updated *as I build*, not
after, so it's never describing a project that doesn't exist. Stale context is
worse than no context — it makes the AI confidently wrong.

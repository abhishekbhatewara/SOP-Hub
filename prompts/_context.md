# RBDPL context block

Paste this into every run. It carries facts that change the answer materially and
that a model will otherwise assume away. **Verify each line before a run** —
systems change, and a stale constraint is worse than none.

Last verified: 10 September 2026.

## Entity

Rohan Builders (RBDPL). Residential real-estate development, Pune and Bangalore.
Process documentation: 42 SOPs across 17 departments, held in the SOP Hub
(realestate-sop-hub.up.railway.app) alongside gap analysis, an AI agent library,
an audit programme and a report format library.

## Systems actually in use

| System | Used for | Known state |
|---|---|---|
| Highrise ERP | Engineering, contracting, purchase, sales, accounts | See constraints below |
| Progress App | Daily task/progress updation on site | Mandated daily at monthly review |
| MS Project / Primavera | Master schedule, baseline, critical path | Named in the Planning role description |
| Zoho CRM | Sales pipeline, site visits, conversion | |
| ZOHO / Unnati | Channel partner activity | |
| MRF Portal | FM snagging and customer complaints | |
| Darwinbox | HR | Is Docebo underneath for learning |
| WhatsApp | De facto issue-resolution channel on sites | Named in PL-02's own text as where "a lot of issue resolution happens" — leaves no auditable record |
| Email + Excel | Reporting, targets, delay analysis, MOMs | The default for anything not in a system |

## ERP constraints — these dominate the data architecture answer

The Highrise ERP has five readable databases (engineering, contracting, purchase,
sales, accounts). Established facts:

- **No foreign keys anywhere.** Joins are by convention, not constraint.
- **Accounts holds no project number.** Cost centres are matched by *name*, so
  finance data cannot be reliably joined to project data without a mapping layer.
- **Progress data exists only in contracting.** The obvious progress fields in
  other modules are empty.
- **`Trial_Balance` is a report cache**, not a source table.
- **No issue log exists** in the ERP.

Any data architecture that assumes a clean relational ERP with referential
integrity will be fiction. The realistic question is what the golden source
should be *given* this, and what has to sit outside it.

## Binding IT standard — affects build-vs-buy

RBD's frontend standard (full document in Dropbox `RBD Corporate/Systems/AI/CLAUDE.md`)
mandates HTML5 + CSS3 + Bootstrap 5 + JavaScript + jQuery, no build pipeline, no
monorepos, no secrets in client JS, a centralised `api.js`. React, Next, Vue,
Tailwind, TypeScript on the frontend and Vite are banned. Backend and database are
free but need a .NET / IIS handover path.

This constrains "build" options and should be stated in any build-vs-buy
recommendation rather than discovered later.

## Known structural gaps in the process set

From the cross-SOP interface run across all 42 SOPs — 91 handoff references,
18 of them orphaned:

- **"Launch project"** is named as an upstream or downstream process by eight SOPs
  across Execution, Marketing, Sales, Design and Legal. No SOP owns it.
- **"Project closure and lessons learnt"** is named downstream by three SOPs.
  No SOP owns it.
- **Document numbering does not identify documents.** Both Planning SOPs are
  `RBD-SOP-PL-R0`; all four Accounts SOPs share a number; both Design (post) SOPs
  share one.
- **No SOP release authority.** The Document Release Authorization block is blank
  in the SOPs reviewed so far — no name, designation, signature or date.
- **No owner for SOP governance.** RBDPL has no equivalent of a project controls
  and governance function to own adherence, audit or review cadence.

## Reporting reality

Planning's report set — daily, weekly, fortnightly, monthly, delay analysis,
finishing/billing advice, material and contract advices — is produced in Excel and
circulated by email. Several records the SOPs require are registered nowhere and
have no template at all. Report preparation and consolidation is a substantial
part of what the function actually spends its time on.

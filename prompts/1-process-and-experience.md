# Part 1 · Process & Experience

**Scope:** one function, all of its SOPs together.
**Run:** once per function, after that function's SOP review closes.
**Produces:** process map, touchpoint inventory, data-capture design, embedded
controls, in-scope automations, future-state user journeys.
**Deliberately excludes:** technology stack, data architecture, analytics
architecture, agentic architecture, roadmap. Those are Part 2, and answering them
from one function produces one architecture per function.

## Input required — do not run without these

1. The **full verbatim text of every SOP in the function**, not a summary. A
   function is usually several SOPs describing one process split across documents;
   analyse them together.
2. The **gap register** for the function, if the SOP review has produced one.
3. The **audit programme** and **report format library** for the function, if built.
   The format library is the single most useful input to sections C and D — it
   already states, field by field, where every figure comes from.
4. **Real evidence of practice** — emails, minutes, the formats actually in use.
   The SOP says what should happen; these say what does.
5. `_context.md` from this folder.

If any of 1–3 are missing, say so and scope the output accordingly rather than
inventing detail.

---

## Prompt

You are an expert in enterprise process transformation, workflow automation, user
experience design, and frontline operations.

Act as a combination of Business Process Architect, UX / Frontline Workflow
Designer, and Automation Engineer.

Redesign the function described below from the ground up, assuming we can build the
ideal tools, forms, and automation for it. **Do not design the enterprise technology
stack or data platform** — that is handled separately. Stay inside this function and
its immediate interfaces.

Your objectives:

- Make data entry as effortless as possible across sites, departments and roles.
- Make compliance with the SOP the *easiest* path, not a matter of remembering it.
- Minimise duplicate entry, manual handoffs, chasing emails and spreadsheets.
- Capture structured data as a by-product of people doing their work.
- Automate repetitive operational, administrative and reporting activity.

Design around one principle:

**Do not ask a user to enter information that can be automatically captured,
inferred, retrieved, scanned, sensed, integrated, or pre-populated.**

Where manual input is genuinely required, recommend the lowest-friction interface
for the actual situation — mobile, responsive web, tablet/kiosk, barcode or QR,
RFID/NFC, OCR, voice, photo/video, IoT sensor, GPS/timestamp, controlled
vocabularies, pre-populated forms, system-generated events, API, conversational
interface, email ingestion, approval buttons, or exception-only workflows.

Do not simply digitise the existing forms. Redesign the workflow where the current
shape exists only because paper and email made it necessary.

### Sequence

**1. Map the current process.** Trigger, stages, activities, roles, systems,
decisions, approvals, handoffs, documents and data created, exceptions, final
outputs. Identify bottlenecks, duplication, manual work and control weaknesses.
Where the SOP and observed practice differ, map what actually happens and mark the
divergence.

**2. Touchpoint inventory.** Every point where a person, machine, system, document,
department, vendor, customer or external party interacts with the process.

| Touchpoint | Stage | Role | Location / Context | Data Required | Data Generated | Current Friction | SOP / Control Requirement |

Include frontline, supervisory, management, finance, quality, compliance, vendor
and customer touchpoints.

**3. Frictionless data capture.** For each touchpoint:

| Touchpoint | What Must Be Captured | Best Capture Method | What Can Be Auto-Captured | What User Must Enter | Validation / Controls | Offline Requirement | Recommended Interface |

Look explicitly for chances to pre-populate, reuse master data, scan rather than
type, capture once and reuse downstream, use timestamp/GPS/identity/device context
automatically, auto-calculate, derive from other data, trigger forms only when
needed, and replace routine confirmations with exception-only entry.

Offline capability is not optional on construction sites — state it per touchpoint.

**4. Embed the SOP into the workflow.** How does technology make the correct
procedure the path of least resistance? Consider contextual checklists, mandatory
sequence controls, dynamic and conditional forms, automated validation, approval
routing, digital signatures, escalation, timers and SLAs, evidence capture,
role-based instructions, in-app guidance, automated compliance checks, exception
alerts.

State for each control whether it is **preventative** or **detective**, and say
which currently-detective controls should become preventative.

**5. Automation opportunities inside this function.** Classify each as rule-based
workflow, API/system integration, RPA, event-driven, document automation, IoT, or
AI-assisted.

| Automation | Trigger | Inputs | Action | Output | Systems Involved | Human Review Needed? | Expected Benefit |

Target especially: duplicate entry, manual reconciliation, status chasing, reminder
emails, report preparation, data consolidation, manual validation, routine
approvals, repetitive communications.

Where an automation depends on a system or integration that does not exist yet,
say so and flag it for Part 2 rather than assuming it.

**6. Future-state user journey.** For each major persona in this function, describe
a working day after the redesign — concretely, in the second person, naming what
they see and touch.

**7. Quantify.** Where information allows, estimate impact on manual data-entry
time, cycle time, error rate, rework, SOP compliance, reporting effort, number of
handoffs, and number of screens a user must touch. Give ranges with stated
assumptions rather than invented precision.

### Output format

- **A. Executive summary** — the future-state vision for this function and the
  5–10 highest-impact changes.
- **B. End-to-end process map**
- **C. Touchpoint inventory**
- **D. Frictionless data capture design**
- **E. SOP and control automation**
- **F. In-function automation opportunities**
- **G. Future-state user journey by persona**
- **H. Estimated benefits**
- **I. Dependencies flagged for the architecture stage** — anything you could not
  resolve inside this function, stated as a question Part 2 must answer.
- **J. Top 10 actions to start with**

### Rules

- Challenge steps rather than assuming every current activity must survive. Say
  plainly when an activity should be **eliminated**, not just automated.
- Where information is missing, state the assumption and say what additional
  information would materially change the recommendation.
- Recommend systems by **capability category**, not vendor. Vendor choice is Part 2.
- Be specific. Not "create a digital inspection form" but: scan the equipment QR,
  auto-identify asset/site/operator/shift/last inspection, present only the
  questions relevant to that equipment type, timestamp and geotag automatically,
  allow photo or voice for defects, auto-close if all checks pass, and on a defect
  raise a maintenance ticket with the evidence attached and track it to closure.

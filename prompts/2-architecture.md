# Part 2 · Architecture

**Scope:** whole organisation.
**Run:** once, when five functions spanning the value chain have completed Part 1.
Revisit as further functions land, but do not re-run from scratch.
**Produces:** technology architecture, data architecture, analytics architecture,
agentic architecture, prioritised roadmap, governance.

## Readiness gate

Do not run this on one function. It asks for master-data golden sources and a
system of record, and a single function cannot answer either.

Required — five functions through Part 1, chosen to span master data, not to
maximise count:

- [ ] Planning — Project, WBS, schedule, milestone
- [ ] Execution — site progress, DPR
- [ ] Purchase + Stores — Vendor, Material, PO, inventory
- [ ] Accounts — money, RERA, cost centres
- [ ] CRM — Customer, Unit/Flat, demand, collections

## Input required

1. The **Part 1 output for every completed function**, including each one's
   section I (dependencies flagged for the architecture stage). Those flagged
   questions are the real agenda for this run.
2. `_context.md` — in particular the ERP constraints, which dominate the answer.
3. The **cross-SOP interface run** — the handoff map across all 42 SOPs.
4. The current application estate, if a list exists.

---

## Prompt

You are an expert in enterprise systems architecture, data architecture, analytics
and automation.

Act as a combination of Enterprise Systems Architect, Data Architect, Analytics
Architect and Automation Engineer.

You are given the process and experience designs for several functions of a
residential real-estate developer, each produced independently. Design the single
future-state technology, data and analytics architecture that serves all of them —
and the roadmap to get there.

Your first job is to find where the independent designs **conflict, duplicate or
assume incompatible things**, and resolve those explicitly. A function-by-function
design will have proposed the same capability several times under different names.

### Sequence

**1. Reconcile the function designs.** Before designing anything, produce a
consolidation: every capability requested across the functions, how many functions
asked for it, and where two functions asked for the same thing in incompatible
ways. Answer every question raised in the functions' "dependencies flagged for the
architecture stage" sections, or say why it stays open.

**2. Future-state technology architecture.**

| Capability | Purpose | Primary Users | Key Features | Build vs Buy | Example Tools / Platforms |

Name explicitly the proposed **system of engagement**, **system of workflow**,
**system of record**, **integration layer**, **document repository**,
**notification layer**, **analytics layer** and **AI layer** — and explain how
they interact. Recommend by capability category first, then give example products.

Build-vs-buy must respect the binding frontend standard in `_context.md`. Where the
standard rules out an otherwise-obvious build, say so.

**3. Cross-function automations.** The automations no single function could own —
integrations, reconciliations and event flows that cross departmental boundaries.

| Automation | Trigger | Inputs | Action | Output | Systems Involved | Human Review Needed? | Expected Benefit |

**4. Data architecture.** Cover operational data (transactional, master, reference,
workflow/event, user activity, documents and images, sensor data where relevant);
integration method (API, event stream, CDC, batch); and the platform layering:

```
Source Systems → Integration / Event Layer → Raw → Curated / Standardised
→ Business Data Models → Semantic / Metrics Layer → BI / Analytics / AI / Agents
```

State whether a warehouse, lakehouse, lake or combination fits, and why — for an
organisation of this size, not in the abstract.

**Master data is the crux.** Identify every master-data domain and name where the
golden source should live. Do this against the ERP constraints in `_context.md`,
not against an idealised ERP: there are no foreign keys, Accounts carries no
project number and matches cost centres by name, and progress data exists in only
one module. Say what has to sit outside the ERP and what mapping layer is needed
to join finance to project data at all.

Governance: data ownership, quality controls, catalogue and metadata, lineage,
role-based access, audit trails, retention, privacy and security.

**5. Analytics architecture and KPI framework.** Organise into real-time
operational dashboards, daily/weekly management reporting, KPI dashboards,
compliance monitoring, exception reporting, root-cause analysis, forecasting,
predictive analytics and optimisation.

| KPI | Definition | Source Data | Calculation | Granularity | Refresh | Primary User | Action Triggered |

Every KPI must have an action attached. If nobody would do anything differently
because of it, cut it. Reconcile against the KPIs already defined in each SOP's
Measures of Performance table rather than inventing a parallel set.

**6. Agentic architecture.** The safe operating environment for AI agents —
orchestration layer, retrieval from SOPs and policies, API and tool access,
identity and permissions, agent memory where warranted, human-in-the-loop
approvals, logging and auditability, evaluation and monitoring, guardrails,
structured outputs, agent-to-agent coordination.

Design the *environment*, not the agent portfolio — that is Part 3.

Prefer deterministic automation for predictable rules; reserve agents for tasks
needing interpretation, reasoning, unstructured input or adaptive judgement.

**7. Prioritise.** Score on business impact, UX improvement, time saved, data
quality, compliance, implementation complexity, integration complexity, feasibility
and risk. Group into:

- **Quick wins** (0–3 months)
- **Foundation** (3–6 months) — workflow, integration, master data, data platform
- **Transformation** (6–12 months)
- **Autonomous operations** (12+ months)

**8. Risks, dependencies and governance.** Including what happens if the master-data
problem is not solved first, and what the organisation must own that no vendor can.

### Output format

- **A. Executive summary** — the architecture in one page, and the 5–10 decisions
  that matter most.
- **B. Reconciliation of the function designs**
- **C. Recommended systems and applications**
- **D. Cross-function automation opportunities**
- **E. Data architecture** (include a text/ASCII diagram)
- **F. Master data and golden sources**
- **G. Analytics architecture and KPI framework**
- **H. Agentic AI architecture** (include a text/ASCII diagram showing agents,
  tools, enterprise systems, data and human approvals)
- **I. Prioritised implementation roadmap**
- **J. Risks, dependencies and governance requirements**
- **K. Top 10 actions to start with**

### Rules

- Do not recommend a platform the organisation cannot staff or operate. Size the
  recommendation to a mid-size developer, not an enterprise.
- Where a recommendation depends on a decision nobody has taken yet — a governance
  owner, a master-data owner — name the decision and who must take it.
- State assumptions explicitly, and say which additional information would
  materially change the recommendation.
- Prefer fewer systems doing more over a best-of-breed sprawl that nobody
  integrates.

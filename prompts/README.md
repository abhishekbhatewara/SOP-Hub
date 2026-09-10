# Process Transformation Prompt — split into three parts

The original single prompt (`Process Digitization, Automation, Data Architecture &
AI Agent Analysis Prompt.md`, in Dropbox Downloads) fuses two exercises that become
ready at different times, plus a third that must never be run from a blank page.
Running it whole, per SOP, would produce one technology architecture per SOP.

| Part | Scope | Run | Readiness gate |
|---|---|---|---|
| **1 · Process & Experience** | One *function* (all its SOPs together) | Once per function | The function has been through the SOP review |
| **2 · Architecture** | Whole organisation | Once, then revisit | Five functions spanning the value chain are done |
| **3 · Agent Reconciliation** | Whole organisation | After Part 2 | Part 2 complete |

## Why split this way

Sections B–E, G and L need deep knowledge of one process; cross-SOP knowledge adds
little. Sections F, H, I, K and M are inherently org-wide — nobody buys a workflow
platform for Planning, and section H asks for master-data golden sources, which no
single function can answer.

Section J is different again: the SOP Hub already carries an agent library designed
org-wide. Running J fresh would fragment it, so Part 3 reconciles instead.

## The five-function gate for Part 2

Part 2 needs five functions, chosen to span every master-data domain rather than
to maximise count:

1. **Planning** — Project, WBS, schedule, milestone
2. **Execution** — site progress, the DPR, the Planning counterparty
3. **Purchase + Stores** — Vendor, Material, PO, inventory
4. **Accounts** — money, RERA, cost centres
5. **CRM** — Customer, Unit/Flat, demand, collections

Between them these name every master-data domain the architecture must resolve.
Quality, Safety, Marketing, FM, Channel Sales and Legal & BD will refine the
answer but are unlikely to change it — waiting for all sixteen defers the
architecture decision by roughly a year, during which it gets made by default.

## Status

- Part 1 · Planning — READY TO RUN (review closed at 60 findings, Round 5 issued)
- Part 1 · all other functions — blocked on their SOP review
- Part 2 — blocked: 1 of 5 gate functions complete
- Part 3 — blocked on Part 2

## Before any run

Re-read `_context.md` and verify the system facts are still true. It carries
constraints — particularly the ERP ones — that change the answer materially and
that a model will otherwise assume away.

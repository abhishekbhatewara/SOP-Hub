# Part 3 · Agent Reconciliation

**Scope:** whole organisation.
**Run:** after Part 2, when the agentic architecture exists to host the agents.
**Produces:** a reconciled AI agent portfolio.

## Why this is a reconciliation, not a design

The SOP Hub already carries an agent library designed org-wide — agents grouped
into deployment phases, each with an objective, trigger, inputs, workflow,
escalation path, integrations and metrics, attached to the SOPs it serves.

Running a blank-page agent design would produce a second, conflicting portfolio and
fragment something already coherent. This part starts from what exists and asks
what should change.

## Input required

1. The **existing agent library** from the SOP Hub — every agent with its phase,
   department, SOP attachment, objective, trigger, inputs, workflow, escalation,
   integrations and metrics.
2. The **Part 1 output for every completed function**, particularly the automation
   opportunities classified as AI-assisted.
3. The **Part 2 agentic architecture** — the environment these agents must run in.
4. The **audit programme** across functions. Controls flagged as having no
   self-check in the process are strong candidates for a monitoring agent.
5. `_context.md`.

---

## Prompt

You are an AI Agent Architect.

An organisation has an existing AI agent portfolio, designed before its processes
were analysed in depth. It now has detailed process designs for several functions
and a defined agentic architecture. Reconcile the two.

Do not produce a generic list of agents. Do not propose a chatbot.

### Sequence

**1. Assess what exists.** For each agent already in the library:

| Agent | Still Valid? | Why | Change Needed |

Classify each as **keep as designed**, **redefine** (right idea, wrong scope or
trigger), **merge** (duplicates another agent), **defer** (depends on a system that
does not exist yet), or **drop** (the process analysis showed the underlying work
should be eliminated rather than automated).

Be willing to drop. An agent that automates a step which should not exist is worse
than no agent.

**2. Identify what is missing.** From the function designs and the audit programme,
find work that warrants an agent and has none. Pay particular attention to:

- Controls the audit programme flagged as having **no self-check in the process** —
  these are invisible until something breaks downstream, and are the strongest
  candidates for continuous monitoring.
- Reconciliation, consolidation and report preparation surfaced repeatedly across
  functions.
- Handoffs between functions where the current mechanism is email or WhatsApp.

**3. Specify each agent in the reconciled portfolio.**

| AI Agent | Objective | Trigger | Inputs / Data Access | Tools / Systems | Actions It Can Take | Human Approval | Output | Guardrails |

**4. Assign an autonomy level to each, and justify it.**

1. **Copilot** — recommends, a human acts.
2. **Agent with approval** — prepares and executes after human approval.
3. **Autonomous** — executes within predefined authority limits.

Autonomy must be earned by the reversibility and blast radius of the action, not by
the sophistication of the task. Anything that reaches a customer, a regulator, a
contractor payment or a statutory filing stays at level 1 or 2 regardless of how
well the agent performs. State the authority limit explicitly for every level-3
agent — the value, volume or scope beyond which it must escalate.

**5. Sequence the portfolio.** Which agents can run on the systems that exist
today, and which depend on Part 2's foundation. Group into deployment waves, and
say what each wave requires before it can start.

**6. Define the failure modes.** For each agent: what does it look like when this
agent is quietly wrong, who would notice, and how long would it take? An agent
whose failure is silent and slow to detect needs a lower autonomy level than its
task alone would suggest.

### Output format

- **A. Executive summary** — what changed against the existing portfolio and why.
- **B. Assessment of the existing agent library** (keep / redefine / merge / defer / drop)
- **C. Gaps — work that warrants an agent and has none**
- **D. The reconciled agent portfolio**
- **E. Autonomy levels and authority limits**
- **F. Deployment waves and dependencies**
- **G. Failure modes and detection**
- **H. What to build first**

### Rules

- Prefer deterministic automation wherever the rule is predictable. Reserve agents
  for interpretation, reasoning, unstructured information and adaptive judgement.
  If a rule engine would do it, say so and do not propose an agent.
- Every agent needs a named human owner, not just an approver.
- An agent that cannot be audited should not be deployed. State how each one's
  actions are logged and reviewed.
- Where the existing library and the process analysis disagree, say which is right
  and why — do not split the difference.

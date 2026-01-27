---
id: 3
title: Create Backend Task Model Plan
stage: plan
date_iso: 2026-01-25
surface: agent
model: Qwen
feature: backend-task-model
branch: 003-backend-task-model
user: huzai
command: /sp.plan
labels:
  - plan
  - backend
  - task-model
  - todo-app
links:
  spec: /specs/backend-task-model/
  ticket: null
  adr: null
  pr: null
files_yaml:
  - specs/backend-task-model/plan.md
  - specs/backend-task-model/research.md
  - specs/backend-task-model/data-model.md
  - specs/backend-task-model/contracts/task-model-api.yaml
  - specs/backend-task-model/quickstart.md
tests_yaml: []
---

# Create Backend Task Model Plan

## PROMPT_TEXT

```
---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
handoffs: 
  - label: Create Tasks
    agent: sp.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: sp.checklist
    prompt: Create a checklist for the following domain...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/powershell/setup-plan.ps1 -Json` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied).

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template to:
   - Fill Technical Context (mark unknowns as "NEEDS CLARIFICATION")
   - Fill Constitution Check section from constitution
   - Evaluate gates (ERROR if violations unjustified)
   - Phase 0: Generate research.md (resolve all NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Phase 1: Update agent context by running the agent script
   - Re-evaluate Constitution Check post-design

4. **Stop and report**: Command ends after Phase 2 planning. Report branch, IMPL_PLAN path, and generated artifacts.

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Agent context update**:
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType qwen`
   - These scripts detect which AI agent is in use
   - Update the appropriate agent-specific context file
   - Add only new technology from current plan
   - Preserve manual additions between markers

**Output**: data-model.md, /contracts/*, quickstart.md, agent-specific file

## Key rules

- Use absolute paths
- ERROR on gate failures or unresolved clarifications

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.


/sp.plan # Task: Backend - Create Task model in SQLModel

Instructions:
- Define Task model with fields: id (int, primary key), title (str, max 200), description (str, optional), completed (bool, default=False), created_at (datetime, default now)
- Use SQLModel
- Ensure table can work with Neon PostgreSQL
- Output only Python code
```

## RESPONSE_TEXT

I have successfully executed the implementation planning workflow for the Backend Task Model feature. The following design artifacts have been generated:

1. **plan.md**: Implementation plan with technical context, constitution check, and project structure
2. **research.md**: Research findings and technical decisions about SQLModel implementation
3. **data-model.md**: Data model definition with entities, fields, and validation rules for the Task entity
4. **task-model-api.yaml**: API contract specification in OpenAPI format for Task model endpoints
5. **quickstart.md**: Quickstart guide for implementing and testing the backend Task model

All artifacts align with the project constitution principles including Spec-Driven Development, Clean Code, Security, and Architecture-First Design. The plan includes proper technical context with specific technologies (Python, SQLModel, PostgreSQL) and follows the required architecture for backend model implementation.

## OUTCOME

Successfully completed the implementation planning workflow for the Backend Task Model. All required design artifacts have been created following the constitution principles and technical requirements. The plan is ready for task breakdown and implementation.

## EVALUATION

The planning workflow was completed successfully with all required artifacts generated:
- Implementation plan with technical context
- Research document resolving all unknowns
- Data model with entities and relationships
- API contracts in OpenAPI format
- Quickstart guide for implementation
- Constitution check passed with all principles satisfied
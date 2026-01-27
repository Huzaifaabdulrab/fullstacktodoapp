---
id: 1
title: Update Project Constitution
stage: constitution
date_iso: 2026-01-25
surface: agent
model: Qwen
feature: none
branch: main
user: huzai
command: /sp.constitution
labels:
  - constitution
  - todo-app
  - hackathon
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - .specify/memory/constitution.md
tests_yaml: []
---

# Update Project Constitution

## PROMPT_TEXT

```
---
description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync.
handoffs: 
  - label: Build Specification
    agent: sp.specify
    prompt: Implement the feature specification based on the updated constitution. I want to build...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

Follow this execution flow:

1. Load the existing constitution template at `.specify/memory/constitution.md`.
   - Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`.
   **IMPORTANT**: The user might require less or more principles than the ones used in the template. If a number is specified, respect that - follow the general template. You will update the doc accordingly.

2. Collect/derive values for placeholders:
   - If user input (conversation) supplies a value, use it.
   - Otherwise infer from existing repo context (README, docs, prior constitution versions if embedded).
   - For governance dates: `RATIFICATION_DATE` is the original adoption date (if unknown ask or mark TODO), `LAST_AMENDED_DATE` is today if changes are made, otherwise keep previous.
   - `CONSTITUTION_VERSION` must increment according to semantic versioning rules:
     - MAJOR: Backward incompatible governance/principle removals or redefinitions.
     - MINOR: New principle/section added or materially expanded guidance.
     - PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
   - If version bump type ambiguous, propose reasoning before finalizing.

3. Draft the updated constitution content:
   - Replace every placeholder with concrete text (no bracketed tokens left except intentionally retained template slots that the project has chosen not to define yet—explicitly justify any left).
   - Preserve heading hierarchy and comments can be removed once replaced unless they still add clarifying guidance.
   - Ensure each Principle section: succinct name line, paragraph (or bullet list) capturing non‑negotiable rules, explicit rationale if not obvious.
   - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.

4. Consistency propagation checklist (convert prior checklist into active validations):
   - Read `.specify/templates/plan-template.md` and ensure any "Constitution Check" or rules align with updated principles.
   - Read `.specify/templates/spec-template.md` for scope/requirements alignment—update if constitution adds/removes mandatory sections or constraints.
   - Read `.specify/templates/tasks-template.md` and ensure task categorization reflects new or removed principle-driven task types (e.g., observability, versioning, testing discipline).
   - Read each command file in `.specify/templates/commands/*.md` (including this one) to verify no outdated references (agent-specific names like CLAUDE only) remain when generic guidance is required.
   - Read any runtime guidance docs (e.g., `README.md`, `docs/quickstart.md`, or agent-specific guidance files if present). Update references to principles changed.

5. Produce a Sync Impact Report (prepend as an HTML comment at top of the constitution file after update):
   - Version change: old → new
   - List of modified principles (old title → new title if renamed)
   - Added sections
   - Removed sections
   - Templates requiring updates (✅ updated / ⚠ pending) with file paths
   - Follow-up TODOs if any placeholders intentionally deferred.

6. Validation before final output:
   - No remaining unexplained bracket tokens.
   - Version line matches report.
   - Dates ISO format YYYY-MM-DD.
   - Principles are declarative, testable, and free of vague language ("should" → replace with MUST/SHOULD rationale where appropriate).

7. Write the completed constitution back to `.specify/memory/constitution.md` (overwrite).

8. Output a final summary to the user with:
   - New version and bump rationale.
   - Any files flagged for manual follow-up.
   - Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z (principle additions + governance update)`).

Formatting & Style Requirements:

- Use Markdown headings exactly as in the template (do not demote/promote levels).
- Wrap long rationale lines to keep readability (<100 chars ideally) but do not hard enforce with awkward breaks.
- Keep a single blank line between sections.
- Avoid trailing whitespace.

If the user supplies partial updates (e.g., only one principle revision), still perform validation and version decision steps.

If critical info missing (e.g., ratification date truly unknown), insert `TODO(<FIELD_NAME>): explanation` and include in the Sync Impact Report under deferred items.

Do not create a new template; always operate on the existing `.specify/memory/constitution.md` file.

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


/sp.constitution # Todo App – Phase II Constitution
## Project Name
Hackathon II – Evolution of Todo

## Current Phase
Phase II: Full-Stack Web Application

## Purpose
Transform the in-memory Python console app into a multi-user, full-stack web application with persistent storage, authentication, and RESTful API.

## Guiding Principles
- **Spec-Driven Development**: All features implemented via Claude Code + Spec-Kit Plus.
- **No Manual Coding**: Refine specs until Claude Code generates correct output.
- **Clean Code**: Proper folder structure, modular design, separation of concerns.
- **Security**: JWT-based authentication for API endpoints.
- **Scalability**: Backend built to handle multiple users, database connections managed efficiently.

## Architecture Overview
- **Frontend**: Next.js 16+ with App Router, Tailwind CSS
- **Backend**: FastAPI, SQLModel, Neon Serverless PostgreSQL
- **Auth**: Better Auth with JWT
- **API**: REST endpoints secured by JWT
- **DB Models**: `users` (from Better Auth), `tasks` (CRUD operations)

## Responsibilities
- **Frontend**: UI rendering, API calls with JWT, responsive design.
- **Backend**: Task CRUD logic, authentication verification, JWT validation, database operations.
- **Database**: Persistent task storage, user isolation, indexes for filtering.

## Deliverables
2. `/frontend` – Next.js app with CLAUDE.md
3. `/backend` – FastAPI app with CLAUDE.md
4. `/specs` – All specifications (features, API, database, UI)
5. Constitution file, setup instructions, README.md

## Notes
- Use `.env` file for secrets like `DATABASE_URL` and `BETTER_AUTH_SECRET`.
- Always reference specs via `@specs/...` in Claude Code prompts.
```

## RESPONSE_TEXT

I've successfully updated the project constitution based on the provided information. Here's the final summary:

**New Version**: 1.0.0 (Initial version)
**Bump Rationale**: This is the initial creation of the constitution for the Todo App – Phase II project, establishing the foundational principles and governance structure.

**Files Updated**:
- `.specify/memory/constitution.md` - Updated with the new constitution

**Constitution Highlights**:
- Established 6 core principles: Spec-Driven Development, No Manual Coding, Clean Code, Security, Scalability, and Architecture-First Design
- Defined Technology Stack Requirements for the full-stack application
- Outlined Development Workflow responsibilities
- Set governance rules emphasizing specification-driven development

**Suggested Commit Message**: 
`docs: add constitution v1.0.0 for Todo App Phase II project`

The constitution is now in place to guide the development of the Todo App Phase II project, emphasizing specification-driven development, clean architecture, and security-first principles.

## OUTCOME

Successfully created and updated the project constitution file with the required principles and governance structure for the Todo App Phase II project. The constitution now reflects the project's focus on spec-driven development, security, scalability, and clean architecture.

## EVALUATION

The constitution update was completed successfully with all required elements incorporated. The file `.specify/memory/constitution.md` has been updated with the new principles and governance structure. The PHR has been created with all required information.
<!-- 
Sync Impact Report:
Version change: N/A → 1.0.0
Added sections: Spec-Driven Development, No Manual Coding, Clean Code, Security, Scalability, Architecture-First Design principles
Removed sections: None
Modified principles: None (new constitution)
Templates requiring updates: 
  - ✅ plan-template.md: Aligns with new principles
  - ✅ spec-template.md: Aligns with new principles  
  - ✅ tasks-template.md: Aligns with new principles
Follow-up TODOs: None
-->
# Todo App – Phase II Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### Spec-Driven Development
All features implemented via Claude Code + Spec-Kit Plus.
Every feature must be specified before implementation using Claude Code and Spec-Kit Plus; Specifications serve as the single source of truth for feature requirements and implementation guidelines.

### No Manual Coding
Refine specs until Claude Code generates correct output.
Manual coding is prohibited unless absolutely necessary; All code must be generated through Claude Code from well-defined specifications; Refine specifications iteratively until Claude Code produces the desired output.

### Clean Code
Proper folder structure, modular design, separation of concerns.
Code must follow clean architecture principles with clear separation between frontend, backend, and database layers; Folder structure must be intuitive and maintainable; Each module should have a single responsibility.

### Security
JWT-based authentication for API endpoints.
All API endpoints must be secured with JWT authentication; Authentication must be implemented using Better Auth with JWT; Proper authorization checks must be performed for all protected resources.

### Scalability
Backend built to handle multiple users, database connections managed efficiently.
Backend must be designed to scale horizontally to accommodate multiple concurrent users; Database connections must be managed efficiently using connection pooling; System must handle load increases gracefully.

### Architecture-First Design
Prioritize well-defined architecture with clear separation of concerns between frontend, backend, and database layers.
System architecture must be planned before implementation begins; Clear interfaces must be defined between system components; Architecture decisions must be documented and reviewed before implementation.

## Technology Stack Requirements

Frontend: Next.js 16+ with App Router, Tailwind CSS; Backend: FastAPI, SQLModel, Neon Serverless PostgreSQL; Auth: Better Auth with JWT; API: REST endpoints secured by JWT; DB Models: users (from Better Auth), tasks (CRUD operations). All technology choices must align with the specified stack requirements to ensure compatibility and maintainability.

## Development Workflow

Frontend responsibilities: UI rendering, API calls with JWT, responsive design; Backend responsibilities: Task CRUD logic, authentication verification, JWT validation, database operations; Database responsibilities: Persistent task storage, user isolation, indexes for filtering. Each team member must understand and adhere to their designated responsibilities to ensure proper system integration.

## Governance
All features implemented via specifications using Claude Code and Spec-Kit Plus; All deliverables must include proper documentation (CLAUDE.md files); Use .env file for secrets like DATABASE_URL and BETTER_AUTH_SECRET; Always reference specs via @specs/... in Claude Code prompts. All PRs/reviews must verify compliance; Complexity must be justified; Use specifications for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-01-25 | **Last Amended**: 2026-01-25
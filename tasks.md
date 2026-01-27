# Tasks: Task CRUD Operations

**Input**: Design documents from `/specs/features/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume web app structure - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure with backend and frontend directories
- [ ] T002 Initialize Python project with FastAPI dependencies in backend/
- [ ] T003 [P] Initialize Next.js project with Tailwind CSS in frontend/
- [ ] T004 Set up shared environment configuration management

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [X] T005 Setup database schema and migrations framework in backend/
- [X] T006 [P] Implement authentication/authorization framework with Better Auth in backend/
- [X] T007 [P] Setup API routing and middleware structure in backend/
- [X] T008 Create base models/entities that all stories depend on in backend/src/models/
- [ ] T009 Configure error handling and logging infrastructure in backend/
- [X] T010 Setup JWT validation middleware in backend/
- [X] T011 Create database connection utilities in backend/src/db/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create New Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks with title and description

**Independent Test**: Users can submit a form to create a new task that gets stored in the database and associated with their account

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Contract test for POST /api/{user_id}/tasks in backend/tests/contract/test_tasks.py
- [ ] T013 [P] [US1] Integration test for task creation in backend/tests/integration/test_task_creation.py

### Implementation for User Story 1

- [X] T014 [P] [US1] Create Task model in backend/src/models/task.py
- [X] T015 [US1] Create TaskCreate schema in backend/src/schemas/task.py
- [X] T016 [US1] Implement TaskService.create_task in backend/src/services/task_service.py
- [X] T017 [US1] Implement POST /api/{user_id}/tasks endpoint in backend/src/api/tasks.py
- [X] T018 [US1] Create task creation form component in frontend/src/components/TaskForm.tsx
- [X] T019 [US1] Implement API call to create task in frontend/src/lib/api.ts
- [X] T020 [US1] Create task creation page in frontend/src/app/create-task/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View All Tasks (Priority: P2)

**Goal**: Allow users to view all their tasks with filtering capabilities

**Independent Test**: Users can navigate to a page that displays all their tasks with title, description, and status

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T021 [P] [US2] Contract test for GET /api/{user_id}/tasks in backend/tests/contract/test_tasks.py
- [ ] T022 [P] [US2] Integration test for task retrieval in backend/tests/integration/test_task_retrieval.py

### Implementation for User Story 2

- [X] T023 [P] [US2] Create TaskRead schema in backend/src/schemas/task.py
- [X] T024 [US2] Implement TaskService.get_user_tasks in backend/src/services/task_service.py
- [X] T025 [US2] Implement GET /api/{user_id}/tasks endpoint in backend/src/api/tasks.py
- [X] T026 [US2] Create task list component in frontend/src/components/TaskList.tsx
- [X] T027 [US2] Implement API call to fetch tasks in frontend/src/lib/api.ts
- [X] T028 [US2] Create task listing page in frontend/src/app/tasks/page.tsx
- [X] T029 [US2] Add filtering by status (pending/completed/all) in frontend/src/components/TaskFilter.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Task (Priority: P3)

**Goal**: Allow users to modify existing tasks

**Independent Test**: Users can edit an existing task's title or description and save the changes

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T030 [P] [US3] Contract test for PUT /api/{user_id}/tasks/{id} in backend/tests/contract/test_tasks.py
- [ ] T031 [P] [US3] Integration test for task update in backend/tests/integration/test_task_update.py

### Implementation for User Story 3

- [X] T032 [P] [US3] Create TaskUpdate schema in backend/src/schemas/task.py
- [X] T033 [US3] Implement TaskService.update_task in backend/src/services/task_service.py
- [X] T034 [US3] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/src/api/tasks.py
- [X] T035 [US3] Enhance task form component to support editing in frontend/src/components/TaskForm.tsx
- [X] T036 [US3] Implement API call to update task in frontend/src/lib/api.ts
- [X] T037 [US3] Create task editing page in frontend/src/app/edit-task/[id]/page.tsx

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Delete Task (Priority: P4)

**Goal**: Allow users to remove tasks they no longer need

**Independent Test**: Users can delete a task which removes it from the database and no longer appears in their task list

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T038 [P] [US4] Contract test for DELETE /api/{user_id}/tasks/{id} in backend/tests/contract/test_tasks.py
- [ ] T039 [P] [US4] Integration test for task deletion in backend/tests/integration/test_task_deletion.py

### Implementation for User Story 4

- [X] T040 [US4] Implement TaskService.delete_task in backend/src/services/task_service.py
- [X] T041 [US4] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/src/api/tasks.py
- [X] T042 [US4] Create delete confirmation dialog in frontend/src/components/DeleteConfirmation.tsx
- [X] T043 [US4] Implement API call to delete task in frontend/src/lib/api.ts
- [X] T044 [US4] Add delete button to task list items in frontend/src/components/TaskItem.tsx

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - Mark Task Complete/Incomplete (Priority: P5)

**Goal**: Allow users to toggle the completion status of tasks

**Independent Test**: Users can toggle a task's completion status which updates the database and reflects in the UI

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [ ] T045 [P] [US5] Contract test for PATCH /api/{user_id}/tasks/{id}/complete in backend/tests/contract/test_tasks.py
- [ ] T046 [P] [US5] Integration test for task completion toggle in backend/tests/integration/test_task_completion.py

### Implementation for User Story 5

- [X] T047 [P] [US5] Create TaskToggleComplete schema in backend/src/schemas/task.py
- [X] T048 [US5] Implement TaskService.toggle_task_completion in backend/src/services/task_service.py
- [X] T049 [US5] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/src/api/tasks.py
- [X] T050 [US5] Implement API call to toggle task completion in frontend/src/lib/api.ts
- [X] T051 [US5] Add completion toggle to task list items in frontend/src/components/TaskItem.tsx
- [X] T052 [US5] Add visual indication of task completion status in frontend/src/components/TaskItem.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T053 [P] Documentation updates in docs/
- [X] T054 Code cleanup and refactoring
- [X] T055 Performance optimization across all stories
- [X] T056 [P] Additional unit tests (if requested) in backend/tests/unit/ and frontend/tests/
- [X] T057 Security hardening
- [X] T058 Run quickstart validation
- [X] T059 Add loading states and error handling to UI components
- [X] T060 Add form validation to task creation/updating

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3/US4 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for POST /api/{user_id}/tasks in backend/tests/contract/test_tasks.py"
Task: "Integration test for task creation in backend/tests/integration/test_task_creation.py"

# Launch all models for User Story 1 together:
Task: "Create Task model in backend/src/models/task.py"
Task: "Create TaskCreate schema in backend/src/schemas/task.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
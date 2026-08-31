# AGENTS.md

Drop-in operating instructions for coding agents. Read this file before every task.

**Working code only. Finish the job. Plausibility is not correctness.**

This file follows the [AGENTS.md](https://agents.md) open standard (Linux Foundation / Agentic AI Foundation). Claude Code, Codex, Cursor, Windsurf, Copilot, Aider, Devin, Amp read it natively. For tools that look elsewhere, symlink:

```bash
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md GEMINI.md
```

---

## 0. Non-negotiables

These rules override everything else in this file when in conflict:

1. **No flattery, no filler.** Skip openers like "Great question", "You're absolutely right", "Excellent idea", "I'd be happy to". Start with the answer or the action.
2. **Disagree when you disagree.** If the user's premise is wrong, say so before doing the work. Agreeing with false premises to be polite is the single worst failure mode in coding agents.
3. **Never fabricate.** Not file paths, not commit hashes, not API names, not test results, not library functions. If you don't know, read the file, run the command, or say "I don't know, let me check."
4. **Stop when confused.** If the task has two plausible interpretations, ask. Do not pick silently and proceed.
5. **Touch only what you must.** Every changed line must trace directly to the user's request. No drive-by refactors, reformatting, or "while I was in there" cleanups.

---

## 1. Before writing code

**Goal: understand the problem and the codebase before producing a diff.**

- State your plan in one or two sentences before editing. For anything non-trivial, produce a numbered list of steps with a verification check for each.
- Read the files you will touch. Read the files that call the files you will touch. Claude Code: use subagents for exploration so the main context stays clean.
- Match existing patterns in the codebase. If the project uses pattern X, use pattern X, even if you'd do it differently in a greenfield repo.
- When creating or modifying features, always inspect and reference existing feature implementations (UI/UX layout, components, hooks, validation, and backend services) to maintain consistency in design and development.
- When refactoring an existing feature, follow the **Feature Refactoring Protocol** in section 10: build isolated in `<feature>-refactor` / `<feature>-refactored`, reference already-refactored features like `customer`, maintain exact modular folder and file organization, write clean, maintainable, and scalable code, and verify before migration.
- Surface assumptions out loud: "I'm assuming you want X, Y, Z. If that's wrong, say so." Do not bury assumptions inside the implementation.
- If two approaches exist, present both with tradeoffs. Do not pick one silently. Exception: trivial tasks (typo, rename, log line) where the diff fits in one sentence.

---

## 2. Writing code: simplicity first

**Goal: the minimum code that solves the stated problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code. No configurability, flexibility, or hooks that were not requested.
- No error handling for impossible scenarios. Handle the failures that can actually happen.
- If the solution runs 200 lines and could be 50, rewrite it before showing it.
- If you find yourself adding "for future extensibility", stop. Future extensibility is a future decision.
- Bias toward deleting code over adding code. Shipping less is almost always better.

The test: would a senior engineer reading the diff call this overcomplicated? If yes, simplify.

---

## 3. Surgical changes

**Goal: clean, reviewable diffs. Change only what the request requires.**

- Do not "improve" adjacent code, comments, formatting, or imports that are not part of the task.
- Do not refactor code that works just because you are in the file.
- Do not delete pre-existing dead code unless asked. If you notice it, mention it in the summary.
- Do clean up orphans created by your own changes (unused imports, variables, functions your edit made obsolete).
- Match the project's existing style exactly: indentation, quotes, naming, file layout.

The test: every changed line traces directly to the user's request. If a line fails that test, revert it.

---

## 4. Goal-driven execution

**Goal: define success as something you can verify, then loop until verified.**

Rewrite vague asks into verifiable goals before starting:

- "Add validation" becomes "Write tests for invalid inputs (empty, malformed, oversized), then make them pass."
- "Fix the bug" becomes "Write a failing test that reproduces the reported symptom, then make it pass."
- "Refactor X" becomes "Ensure the existing test suite passes before and after, and no public API changes."
- "Make it faster" becomes "Benchmark the current hot path, identify the bottleneck with profiling, change it, show the benchmark is faster."

For every task:

1. State the success criteria before writing code.
2. Write the verification (test, script, benchmark, screenshot diff) where practical.
3. Run the verification. Read the output. Do not claim success without checking.
4. If the verification fails, fix the cause, not the test.

---

## 5. Tool use and verification

- Prefer running the code to guessing about the code. If a test suite exists, run it. If a linter exists, run it. If a type checker exists, run it.
- Never report "done" based on a plausible-looking diff alone. Plausibility is not correctness.
- When debugging, address root causes, not symptoms. Suppressing the error is not fixing the error.
- For UI changes, verify visually: screenshot before, screenshot after, describe the diff.
- Use CLI tools (gh, aws, gcloud, kubectl) when they exist. They are more context-efficient than reading docs or hitting APIs unauthenticated.
- When reading logs, errors, or stack traces, read the whole thing. Half-read traces produce wrong fixes.

---

## 6. Session hygiene

- Context is the constraint. Long sessions with accumulated failed attempts perform worse than fresh sessions with a better prompt.
- After two failed corrections on the same issue, stop. Summarize what you learned and ask the user to reset the session with a sharper prompt.
- Use subagents (Claude Code: "use subagents to investigate X") for exploration tasks that would otherwise pollute the main context with dozens of file reads.
- When committing, write descriptive commit messages (subject under 72 chars, body explains the why). No "update file" or "fix bug" commits. No "Co-Authored-By: Claude" attribution unless the project explicitly wants it.

---

## 7. Communication style

- Direct, not diplomatic. "This won't scale because X" beats "That's an interesting approach, but have you considered...".
- Concise by default. Two or three short paragraphs unless the user asks for depth. No padding, no restating the question, no ceremonial closings.
- When a question has a clear answer, give it. When it does not, say so and give your best read on the tradeoffs.
- Celebrate only what matters: shipping, solving genuinely hard problems, metrics that moved. Not feature ideas, not scope creep, not "wouldn't it be cool if".
- No excessive bullet points, no unprompted headers, no emoji. Prose is usually clearer than structure for short answers.

---

## 8. When to ask, when to proceed

**Ask before proceeding when:**
- The request has two plausible interpretations and the choice materially affects the output.
- The change touches something you've been told is load-bearing, versioned, or has a migration path.
- You need a credential, a secret, or a production resource you don't have access to.
- The user's stated goal and the literal request appear to conflict.

**Proceed without asking when:**
- The task is trivial and reversible (typo, rename a local variable, add a log line).
- The ambiguity can be resolved by reading the code or running a command.
- The user has already answered the question once in this session.

---

## 9. Self-improvement loop

**This file is living. Keep it short by keeping it honest.**

After every session where the agent did something wrong:

1. Ask: was the mistake because this file lacks a rule, or because the agent ignored a rule?
2. If lacking: add the rule under "Project Learnings" below, written as concretely as possible ("Always use X for Y" not "be careful with Y").
3. If ignored: the rule may be too long, too vague, or buried. Tighten it or move it up.
4. Every few weeks, prune. For each line, ask: "Would removing this cause the agent to make a mistake?" If no, delete. Bloated AGENTS.md files get ignored wholesale.

Boris Cherny (creator of Claude Code) keeps his team's file around 100 lines. Under 300 is a good ceiling. Over 500 and you are fighting your own config.

---

## 10. Project context

### Stack
- Language and version: TypeScript (ES2023 / ESNext), Node.js (v20+)
- Framework(s):
  - Frontend (`/client`): React 19, Vite 8, Tailwind CSS v4, Apollo Client v3, Zustand v5, React Router DOM v7, Radix UI / shadcn/ui, React Hook Form, Zod v4, TanStack Table v8, Recharts
  - Backend (`/server`): Express 4, Apollo Server v5 (GraphQL), Prisma ORM v7 (PostgreSQL), Argon2, JSON Web Tokens (`jsonwebtoken`), Resend / Nodemailer, Zod v4
- Package manager: npm (`package-lock.json` in both `/client` and `/server`)
- Runtime / deployment target: Node.js (backend), Browser / Vite SPA (frontend), PostgreSQL (database)

### Commands
- Install:
  - Client: `cd client && npm install`
  - Server: `cd server && npm install`
- Build:
  - Client: `npm --prefix client run build` (`tsc -b && vite build`)
  - Server: `npm --prefix server run build` (`tsc`)
- Test (all): None configured (no test runner configured in `package.json`)
- Test (single file): None configured
- Lint:
  - Client: `npm --prefix client run lint` (`eslint .`)
- Typecheck:
  - Client: `npx --prefix client tsc -b --noEmit`
  - Server: `npx --prefix server tsc --noEmit`
- Run locally:
  - Client: `npm --prefix client run dev` (Vite dev server on `http://localhost:5173`)
  - Server: `npm --prefix server run dev` (Nodemon + TSX on `http://localhost:4000`, GraphQL on `http://localhost:4000/graphql`)
- Database:
  - Generate Prisma client: `npm --prefix server run prisma:generate`
  - Run migrations: `npm --prefix server run prisma:migrate`
  - Reset database: `npm --prefix server run prisma:reset`
  - Prisma Studio: `npm --prefix server run prisma:studio`
  - Seed database: `npm --prefix server run seed`

### Layout
- Source lives in:
  - Frontend: `client/src/` (`components/`, `features/`, `graphql/`, `hooks/`, `layout/`, `lib/`, `providers/`, `routes/`, `store/`, `types/`)
  - Backend: `server/src/` (`context/`, `enums/`, `features/`, `graphql/`, `lib/`, `schemas/`, `types/`, `utils/`, `seed.ts`, `server.ts`)
  - Database schema & migrations: `server/prisma/` (`schema.prisma`, `migrations/`)
- Tests live in: None currently present in codebase
- Do not modify:
  - `server/src/generated/` (Generated GraphQL / Prisma types)
  - `client/node_modules/`, `server/node_modules/`, `client/dist/`, `server/dist/`

### Conventions specific to this repo
- Naming:
  - Feature-driven modular layout in `src/features/<feature-name>/`
  - Server feature files follow `<feature>.resolver.ts`, `<feature>.service.ts`, `<feature>.validation.ts`, `<feature>.util.ts`, `<feature>.gql`, `types.ts`, `index.ts`
  - Client feature files follow `<feature>.columns.tsx`, `<feature>.constants.ts`, `<feature>.types.ts`, `<feature>.utils.ts`, `components/`, `hooks/`, `pages/`, `validation/`
  - PascalCase for React components (`*.tsx`), camelCase for utilities/services (`*.ts`), `.gql` for GraphQL schema definitions
- Import style:
  - Path alias: `@/*` mapped to `src/*` (e.g., `@/components/...`, `@/features/...`, `@/lib/...`, `@/context`, `@/graphql`)
- Error handling pattern:
  - Server: Apollo Server `formatError` in `server.ts` returning sanitized error messages and extensions code (`INTERNAL_SERVER_ERROR`); Zod validation and domain errors thrown in services
  - Client: Apollo Client error handling, toast alerts via Sonner (`sonner`), form validation via Zod schemas and `@hookform/resolvers/zod`
- Testing pattern and framework:
  - No automated test framework currently configured

### Feature Refactoring Protocol
When requested to refactor an existing feature (e.g., `product`, `customer`, `sale`, `inventory`):
1. **Isolation in Refactor Directory**:
   - Do NOT modify or break the existing feature in-place immediately.
   - Create a dedicated folder named `<feature>-refactor` (or `<feature>-refactored`) under `client/src/features/` (and corresponding backend structure in `server/src/features/` if backend refactoring is required).
   - Implement the new, clean version completely within this directory.
2. **Reference Golden Standards**:
   - Always inspect and use already-refactored features (e.g., `client/src/features/customer/` and `client/src/features/sale/`, or `server/src/features/customer/`) as the reference benchmark for folder hierarchy, file contents, code organization, and naming.
3. **Standard Frontend Feature Architecture**:
   - `components/`: Modular UI components broken down by responsibility. Encapsulate multi-step/complex components into dedicated subdirectories (e.g., `create-<feature>-sheet/`, `edit-<feature>-sheet/`, `view-<feature>-sheet/`, `<feature>-form/`, `common/`). Each subfolder should encapsulate its component files, local hooks in `hooks/`, and a local `index.ts`. Barrel-export all components via `components/index.ts`.
   - `constants/`: Feature-level constants, table column helper configs, status definitions, and static options (Never place TypeScript union types here; put them in `types/`).
   - `operations/`: GraphQL operation documents and queries/mutations (`op.queries.ts`, `op.mutations.ts`, and `index.ts`).
   - `layout/`: Feature-level layouts, views wrappers, or headers.
   - `pages/`: Primary page views and routed views for the feature.
   - `types/`: Strongly typed TypeScript interfaces, DTOs, and union types (`<feature>.types.ts`, `index.ts`).
   - `utils/`: Reusable, pure utility functions, transformers, calculations, and formatters (`<feature>.utils.ts`, `index.ts`).
   - `validation/`: Zod validation schemas for forms and payload validations (`<feature>.validation.ts`, `index.ts`).
   - `index.ts`: Feature-level public API barrel export re-exporting all submodules.
4. **Table Column & UI/UX Design Standards**:
   - **Modular Cell Components (No JSX Dumping in Columns)**:
     - Never dump bulky inline JSX or complex multi-line markup directly inside `column.cell: ({ row }) => (...)`.
     - Always extract distinct or multi-element cells into dedicated components within the feature's `pages/<page>/cells/<cell-name>/` folder (e.g., `ProductCell.tsx`, `ContactCell.tsx`, `PricingCell.tsx`, `StatusCell.tsx`, `ActionsCell.tsx`).
     - Keep `<feature>.columns.tsx` declarative, clean, and minimal by delegating cell rendering to these domain components.
   - **Standout Modern Layout**: Never create generic, plain spreadsheet-like tables. Implement modern, high-contrast, polished rows with clear hierarchy and micro-details.
   - **Primary Entity Column (Image/Avatar + Details + Sub-Badges)**:
     - Always include a media/thumbnail avatar container (e.g., 40-44px rounded box with subtle gradient and border) that displays the entity icon (e.g., `Package`, `User`) and dynamically renders the entity's image URL when available.
     - Pair the primary entity name (bold, leading-snug) with secondary identifiers (e.g., SKU pill, email, phone) as small badge pills directly underneath.
   - **Description & Long Text Columns**:
     - Never abruptly cut off or truncate long descriptions with a flat single-line `truncate`.
     - Always allow text to wrap across lines naturally using `break-words whitespace-normal leading-relaxed text-xs text-slate-600` with an appropriate `max-w-[...]` to maintain table balance while keeping full text readable.
   - **Financial, Pricing & Metric Columns**:
     - Use monospaced font styling (`font-mono` / `IBM Plex Sans`) with strict currency/number formatters (`formatCurrency`, `formatDate`).
     - Display primary and secondary metrics together where helpful (e.g., Selling Price with sub-label, Cost Price with a calculated `% margin` pill).
   - **Interactive Status & Action Cells**:
     - Retain interactive popover status cells using `useOptimisticMutation` with `<FEATURE>_STATUS_LABELS` and `<FEATURE>_STATUS_COLORS`.
5. **Standard Backend Feature Architecture**:
   - `<feature>.gql`: GraphQL Schema Definition for types, queries, and mutations.
   - `<feature>.resolver.ts`: Type-safe Apollo resolver functions mapping GraphQL operations to service logic.
   - `<feature>.service.ts`: Core business logic, Prisma ORM operations, and error handling.
   - `<feature>.validation.ts`: Zod schemas for backend request/argument validation.
   - `constants.ts` & `types.ts`: Feature constants and TypeScript types.
   - `index.ts`: Barrel export for the backend feature module.
6. **Quality & Maintainability Standards**:
   - **Type Safety**: Strictly typed TypeScript; no `any` or loose typings.
   - **Clean & Scalable Code**: Single-responsibility components, decoupled logic into custom hooks, clear separation of UI and business logic.
   - **Verification**: Run type checks (`npx --prefix client tsc -b --noEmit` / `npx --prefix server tsc --noEmit`) and verify clean compilation.
7. **Immediate App Integration**:
   - Right after completing and verifying the refactored feature, immediately update `client/src/App.tsx` and `client/src/features/index.ts` to mount any global feature sheets (`Create<Feature>Sheet`, `Edit<Feature>Sheet`, `View<Feature>Sheet`), update route definitions, and wire up the refactored feature.

### Forbidden
- Do not edit generated code in `server/src/generated/` directly.
- Do not modify database schema directly without creating and applying Prisma migrations (`npm run prisma:migrate`).
- Do not use relative path traversal (`../../..`) when `@/*` path alias can be used.
- Do not use outdated nested constant patterns like `{ ACTIVE: { a: 'ACTIVE', b: 'ACTIVATE' } }`. Always use clean flat `as const` object definitions (e.g., `export const SaleStatus = { PENDING: 'PENDING', ... } as const;`) paired with separate `<FEATURE>_STATUS_LABELS` and `<FEATURE>_STATUS_COLORS` record maps, matching `client/src/features/sale/constants/sale.constants.ts`.
- Do not create generic spreadsheet-like tables with single-line truncated descriptions. Always implement rich entity cells (with thumbnail/icon placeholders + sub-badges) and word-wrapped readable text.
- Do not dump bulky inline JSX directly inside column definitions in `<feature>.columns.tsx`. Always extract cell UI into dedicated cell components stored in the feature's `cells/` directory.

---

## 11. Project Learnings

**Accumulated corrections. This section is for the agent to maintain, not just the human.**

When the user corrects your approach, append a one-line rule here before ending the session. Write it concretely ("Always use X for Y"), never abstractly ("be careful with Y"). If an existing line already covers the correction, tighten it instead of adding a new one. Remove lines when the underlying issue goes away (model upgrades, refactors, process changes).

- Always place TypeScript union types (e.g. types derived from `as const` objects/enums) in feature `types/` files (`types.ts`, `union.types.ts`, or `<feature>.types.ts`), never in `constants` files.
- Always immediately wire up and update `client/src/App.tsx` (and `client/src/features/index.ts`) with the refactored feature's sheets, routes, and layout after completing a feature refactor.
- Always use clean flat `as const` constant definitions with separate `<FEATURE>_STATUS_LABELS` and `<FEATURE>_STATUS_COLORS` record maps (following `sale.constants.ts`), and never use outdated nested `{ a: '...', b: '...' }` objects.
- Always design rich, standout table columns: include an image/thumbnail placeholder container with sub-badges (e.g., SKU/phone) in the primary entity column, and allow full word-wrapping (`break-words whitespace-normal`) for description columns instead of single-line truncation.
- Always extract table column cell layouts into modular components under the feature's `cells/` directory instead of dumping inline JSX directly into `<feature>.columns.tsx`.

---

## 12. How this file was built

This boilerplate synthesizes:
- Sean Donahoe's IJFW ("It Just F\*cking Works") principles: one install, working code, no ceremony.
- Andrej Karpathy's observations on LLM coding pitfalls (the four principles: think-first, simplicity, surgical changes, goal-driven execution).
- Boris Cherny's public Claude Code workflow (reactive pruning, keep it ~100 lines, only rules that fix real mistakes).
- Anthropic's official Claude Code best practices (explore-plan-code-commit, verification loops, context as the scarce resource).
- Community anti-sycophancy patterns (explicit banned phrases, direct-not-diplomatic).
- The AGENTS.md open standard (cross-tool portability via symlinks).

Read once. Edit sections 10 and 11 for your project. Prune the rest over time. This file gets better the more you use it.

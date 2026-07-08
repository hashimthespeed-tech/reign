# Reign — Security TODO

Known RLS / trust-boundary gaps to close in a later hardening pass. Listed so
future sessions don't mistake them for finished work.

## Open items

1. **Client-side `daily_reports` inserts (`daily_insert_own`).**
   RLS lets a student INSERT their own daily report from the browser
   (`with_check: user_id = auth.uid()`). That means report content — including
   `portfolio_value_at_close`, `day_change_dollars`, etc. — is currently
   writable by the client and therefore forgeable. Long term, daily reports
   should be generated and written **server-side** (Netlify scheduled function
   with the service role key), and the client INSERT policy dropped.

2. **`unlocks_all_own` — students can grant their own unlocks.**
   The `unlocks` table policy is `ALL` with `user_id = auth.uid()`, so a student
   can INSERT arbitrary `unlock_type` rows and unlock gated features early
   (AI analysis, thesis builder, etc.). Same applies to `student_concepts`
   (`studconcepts_all_own`). Feature-gating is not currently tamper-proof.
   Move unlock grants server-side once the unlock cadence is finalized.

3. **`classes_select_all` — every class row is world-readable.**
   The `classes` SELECT policy is `true`, so any authenticated user can read
   every class's settings, budget, teacher_id, and class_code. Needed today so
   students can look up a class by code during onboarding, but it leaks all
   classes. Long term, replace with a narrower lookup (e.g. an RPC that returns
   only the matched class by code) and scope SELECT to members + teacher.

## Enforced correctly (for reference)
- Money mutations (portfolios/holdings/trades) go through the server-side
  trading function using the service role key; the client never writes cash or
  share balances directly. Client reads are RLS-scoped to the owner.

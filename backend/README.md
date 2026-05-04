# Backend Skeleton

<!--
Purpose:
- This folder will hold the API, authentication, validation, and finance-specific business rules.

Core API areas:
- Auth: sign in, sign out, password reset or invite flow.
- Users / family members: profiles, household membership, roles, and permissions.
- Accounts: create, update, archive, and list finance accounts.
- Transactions: create, update, delete, categorize, split, search, and import.
- Categories: income, expense, transfer, savings, debt, and custom household categories.
- Budgets: monthly category limits, rollover behavior, and alerts.
- Recurring items: bills, subscriptions, paychecks, transfers, and reminders.
- Reports: monthly summaries, category totals, net worth snapshots, and export endpoints.

Business rules to define:
- How transfers are represented so they do not count as spending.
- How shared expenses are attributed to one person or the whole household.
- Whether edits are audited for accountability.
- Whether deleted records are soft-deleted for recovery.
- How dates, time zones, and currency should be handled.

Security notes:
- Validate all input at the API boundary.
- Hash passwords if using local auth.
- Use parameterized SQL queries through the chosen database library or ORM.
- Keep secrets in environment variables, never in committed files.
-->

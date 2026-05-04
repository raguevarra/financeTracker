# Security And Privacy Checklist

<!--
Before real finance data is entered:
- Add authentication.
- Use HTTPS for any non-local deployment.
- Store secrets outside the repo.
- Confirm database backups are encrypted or stored somewhere private.
- Add a restore test, not just a backup job.
- Confirm logs do not include full transaction details or credentials.
- Confirm uploaded import files are protected or deleted after processing.
- Add authorization checks for every household-scoped API route.
- Avoid exposing stack traces in production.

Nice-to-have later:
- Two-factor authentication.
- Audit log for edits and deletes.
- Session timeout.
- Per-user permissions.
- Read-only family member role.
- Export history.
-->

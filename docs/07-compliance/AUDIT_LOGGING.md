# Audit Logging

## What Audit Logging Is

Audit logging records who did what, to what, and when. It answers questions after an incident: "Did someone export the user database?" "When did this account change permissions?" "Who deployed to production?"

Without audit logs, you are guessing. With good audit logs, you can reconstruct exactly what happened and when.

Audit logging is not application logging. Application logs track errors and performance. Audit logs track security-relevant events — they are the paper trail for accountability.

---

## What to Log

### Always Log

**Authentication events:**
- Login success (user, timestamp, IP, method: password / SSO / API key)
- Login failure (user, timestamp, IP, reason: bad password / account locked / MFA failure)
- Logout
- Password or credential change
- MFA (Multi-Factor Authentication) enrollment or removal
- Session creation and expiry

**Authorization decisions:**
- Access granted (user, resource, action, timestamp)
- Access denied (user, resource, action, reason — this is often more important than granted)
- Permission changes (who changed what permission for whom, and who authorized it)

**Data access (for sensitive and PII data):**
- Reads of sensitive records (which record was accessed, by whom, at what time)
- Bulk exports or queries returning large result sets
- Downloads of files or reports containing sensitive data

**Data modification:**
- Create, update, delete of sensitive records
- Include: who changed it, what changed (old value / new value where safe to log), when

**Administrative actions:**
- User account creation, modification, deactivation
- Role or group assignments
- Configuration changes (to the application, not just deployments)
- Secret rotation or key management events
- Integration changes (adding or removing third-party services)

**System events:**
- Application startup and shutdown
- Service restarts and crashes
- Deployment events (version deployed, who deployed, when)
- Error events that could indicate an attack (unexpected exceptions, input validation failures)

---

## Log Format

Each log entry must include enough context to be useful on its own. An entry that says "user login failed" is nearly useless. An entry with the following fields is actionable:

```
timestamp:    ISO 8601 — 2026-05-03T14:22:11Z
              Always use UTC. Never use local time in logs.

level:        INFO | WARN | ERROR | AUDIT
              Use AUDIT for security-relevant events to make them easy to filter.

event_type:   A structured, dot-separated identifier
              Examples:
                user.login.success
                user.login.failure
                user.password.changed
                data.record.read
                data.record.deleted
                admin.role.changed
                admin.user.created
                config.changed
                deploy.started

user_id:      The unique identifier of the user performing the action.
              For service accounts: the service name or account ID.
              For unauthenticated requests: "anonymous" or null.

resource:     What was accessed or modified.
              Use a stable identifier: table/record ID, file path, endpoint.
              Example: "users/12345", "s3://mybucket/reports/q1.csv"

outcome:      success | failure | denied

ip_address:   Source IP address of the request.
              For internal services: the service's IP plus the original client IP
              if available (from X-Forwarded-For).

request_id:   A unique identifier for the request or transaction.
              Used to correlate multiple log entries for the same operation.
              Generate a UUID per request and attach it to all logs in that request.

details:      Optional structured field for additional context.
              Example: {"changed_field": "role", "old_value": "viewer", "new_value": "admin"}
```

### Example Log Entry (JSON)
```json
{
  "timestamp": "2026-05-03T14:22:11Z",
  "level": "AUDIT",
  "event_type": "admin.role.changed",
  "user_id": "admin-7819",
  "resource": "users/12345",
  "outcome": "success",
  "ip_address": "10.0.1.22",
  "request_id": "req-a3b2c1-8821",
  "details": {
    "changed_field": "role",
    "old_value": "viewer",
    "new_value": "admin",
    "authorized_by": "admin-7819"
  }
}
```

---

## What Not to Log

**Never log:**
- Passwords, in any form — plaintext, hashed, or encrypted
- Full credit card numbers (PAN — Primary Account Number). Log only the last four digits.
- SSNs (Social Security Numbers) or government ID numbers
- Full API keys or tokens (log only a prefix or a non-sensitive identifier)
- Full request or response bodies if they contain any of the above

The risk: logs are often stored with weaker controls than databases. A log that contains passwords or full credit card numbers is itself a high-severity security incident if accessed by an attacker.

Log the fact that something was accessed, not the sensitive value itself.

---

## Log Retention

| Environment | Minimum Retention |
|---|---|
| Hobby / Development | 30 days |
| Small business / General | 90 days |
| Enterprise | 1 year |
| SOC 2 / ISO 27001 | 1 year minimum |
| Government (NIST Moderate) | 3 years |
| Government (NIST High) | 7+ years (check your specific program requirements) |

Set retention policies in your log management system and automate enforcement. Manual log management fails under pressure.

---

## Tamper Evidence

Audit logs are only useful as evidence if they cannot be modified after the fact. An attacker who compromises your system and can also delete or modify your logs can cover their tracks completely.

**Minimum requirement:** Write logs to a system that is separate from your application servers. If an attacker compromises the app server, they should not have access to the log store.

**Cloud log services provide tamper-evidence by default:**
- AWS CloudWatch Logs: logs are stored in a separate managed service. Enable CloudWatch Logs Insights for querying.
- GCP Cloud Logging: managed service with access controls separate from compute
- Azure Monitor Logs: similar separation

**For higher assurance:**
- Use a WORM (Write Once Read Many) store: AWS S3 with Object Lock, Azure Blob with Immutability, or a dedicated logging service (Splunk, Sumo Logic, Datadog Logs)
- Cryptographically sign log batches: generate a hash of each batch of log entries and store the hash separately. Any modification changes the hash.
- Forward logs in real time to a separate account or environment that the application cannot write to

---

## Monitoring and Alerting

Logs that no one reads are useless. Set up automated alerts so that important events surface immediately.

**Alert on these patterns:**

| Pattern | What It Might Mean |
|---|---|
| 5+ failed logins for the same account within 10 minutes | Brute force attack or credential stuffing |
| Successful login from a new country for an admin account | Account compromise or travel without notification |
| Bulk export (more than N records) of sensitive data | Data exfiltration or an over-permissioned query |
| Config change outside of a defined change window | Unauthorized change or unauthorized access |
| Any access to CUI or classified data | Normal (log it); alert if the user is unexpected |
| Admin action by a user with no recent activity | Dormant account misuse |
| Application error rate spike | Attack pattern or deployment issue |

Start with simple threshold-based alerts. Tune them based on your normal baseline. Alert fatigue from too many false positives causes teams to ignore real alerts.

---

## Implementation Checklist

- [ ] Structured logging format (JSON preferred) with all required fields
- [ ] Logs written to a system separate from the application server
- [ ] AUDIT level events clearly distinguished from INFO/WARN/ERROR
- [ ] Retention policy configured and automated
- [ ] Log access restricted: only security/ops personnel can read audit logs
- [ ] Alerts configured for critical patterns (brute force, bulk export, admin changes)
- [ ] Logs tested: generate a test event and verify it appears in the log store
- [ ] Log review scheduled: someone reviews logs at least weekly (or automated anomaly detection)

---

## Related Documents

- [DATA_CLASSIFICATION.md](./DATA_CLASSIFICATION.md) — determines which data access must be logged
- [ACCESS_CONTROL.md](./ACCESS_CONTROL.md) — who can access log data
- [NIST_OVERVIEW.md](./NIST_OVERVIEW.md) — AU (Audit and Accountability) control family requirements
- [ENCRYPTION_AND_SECRETS.md](./ENCRYPTION_AND_SECRETS.md) — logs themselves may need encryption if they contain sensitive context

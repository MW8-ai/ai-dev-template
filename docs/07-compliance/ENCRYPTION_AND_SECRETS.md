# Encryption and Secrets

Encryption protects data from being useful to an attacker who obtains it. Secrets management prevents credentials from being obtained in the first place. Both are required. Neither alone is enough.

---

## Encryption at Rest

Encryption at rest protects data stored on disk, in a database, in object storage, or in backups. If an attacker obtains a storage volume or a database dump, encryption at rest makes it unreadable without the key.

| Classification | Requirement |
|---|---|
| Public | None required |
| Internal / General | Recommended: disk-level encryption |
| Sensitive / Confidential | Required: AES-256 minimum |
| PII (Personally Identifiable Information) | Required: AES-256, plus access controls and audit logging |
| Government CUI (Controlled Unclassified Information) | Required: AES-256 with a FIPS 140-2 or 140-3 validated module |

### Implementation Options

**Database:**

- PostgreSQL: `pgcrypto` extension for column-level encryption of specific sensitive fields. Alternatively, enable Transparent Data Encryption (TDE) at the database cluster level if your managed database provider supports it.
- MySQL / MariaDB: `AES_ENCRYPT()` / `AES_DECRYPT()` for column-level, or enable InnoDB tablespace encryption.
- MongoDB Atlas: encryption at rest is enabled by default in Atlas.
- Application-level encryption: encrypt values in application code before writing to the database. The database stores ciphertext. This is the most portable approach and works regardless of the database engine.

**File and object storage:**

- AWS S3: Server-Side Encryption (SSE) with SSE-S3 (Amazon-managed keys), SSE-KMS (AWS KMS-managed keys, gives you rotation control and audit logs), or SSE-C (customer-provided keys).
- GCP Cloud Storage: default encryption with Google-managed keys, or Customer-Managed Encryption Keys (CMEK) via Cloud KMS.
- Azure Blob Storage: Storage Service Encryption (SSE) with Microsoft-managed keys, or Customer-Managed Keys (CMK) via Azure Key Vault.

**Disk / volume:**

- Linux: LUKS (Linux Unified Key Setup) for full-disk encryption. Enabled at OS install time or on attached volumes via `cryptsetup`.
- Windows: BitLocker for volume encryption. Enable via Group Policy for enterprise environments.
- macOS: FileVault for the system disk. Enable in System Settings > Privacy & Security.
- Cloud VMs: Enable encrypted root volumes when provisioning. On AWS, set `Encrypted: true` on EBS volumes. On GCP, use CMEK for persistent disks.

**Backups:**

- Encrypt backups before transmission and storage.
- Store the encryption key separately from the backup — if they are in the same place, an attacker who gets the backup gets the key too.
- Test restoration from encrypted backups quarterly. Unrestorable backups are not backups.

---

## Encryption in Transit

Encryption in transit protects data moving across a network. Without it, anyone on the network path can read the data (and on the internet, many parties are on the path).

**Rules:**

- Use TLS (Transport Layer Security) 1.2 minimum. TLS 1.3 is preferred for new systems.
- Never serve authenticated or sensitive content over plain HTTP in production.
- Redirect HTTP to HTTPS at the load balancer or CDN (Content Delivery Network) — do not serve anything over HTTP.
- For internal service-to-service communication in high-security environments: use mTLS (mutual TLS), where both sides present a certificate. Service meshes like Istio and Linkerd implement mTLS automatically.
- Do not accept self-signed certificates in production clients. Use a trusted CA (Certificate Authority) — Let's Encrypt for public internet, your organization's internal CA for internal services.

**Certificate management:**

- Automate certificate renewal. Manual renewal fails when someone forgets.
- AWS: ACM (AWS Certificate Manager) auto-renews certificates for load balancers and CloudFront.
- Let's Encrypt: use certbot with a cron job or a service like cert-manager in Kubernetes.
- Alert on certificates expiring within 30 days. Expired TLS certificates break services and are an embarrassing, entirely preventable failure.

---

## Key Management

Encryption is only as strong as the protection of the keys. A plaintext key sitting next to the data it protects defeats the purpose entirely.

### Core Rules

1. **Keys are secrets.** Treat encryption keys with the same care as passwords and API credentials.
2. **Never store a key with the data it encrypts.** If an attacker gets the data, they must not also get the key.
3. **Rotate keys on a schedule.** See the rotation schedule below.
4. **Have a key recovery process.** Losing an encryption key means losing the data. Document who controls keys and how to recover them if the primary holder is unavailable.
5. **One key per purpose.** Don't use the same key for database encryption, API signing, and TLS. Compromising one key should not compromise everything.

### Key Storage by Environment

| Environment | Where to Store Keys |
|---|---|
| Local development | `.env` file (gitignored), never in code |
| CI/CD pipelines | GitHub Encrypted Secrets, or your CI platform's secret store |
| Staging | Secrets manager (see options below) |
| Production | Secrets manager (mandatory); HSM for high-impact or regulated systems |

**Secrets manager options:**

- **AWS Secrets Manager:** stores secrets, rotates them automatically (built-in rotation lambdas for RDS, Redshift, DocumentDB), integrates with IAM for access control. $0.40/secret/month.
- **AWS KMS (Key Management Service):** manages cryptographic keys (not arbitrary secrets). Use for data encryption keys. Automatic annual rotation, FIPS 140-2 Level 2 validated.
- **HashiCorp Vault:** open source, self-hosted or managed. Dynamic secrets (generates credentials on demand, revokes after use), fine-grained policies, audit log of every secret access.
- **Google Cloud Secret Manager:** similar to AWS Secrets Manager. Integrates with Cloud IAM. Automatic replication.
- **Azure Key Vault:** manages keys, secrets, and certificates. FIPS 140-2 Level 2 (standard tier) or Level 3 (premium tier / HSM-backed).

---

## Secrets Management

### The Rules

1. **Secrets never go in code.** Not in commented-out lines. Not in example files with real values. Not in a private repository you think no one can access. One leaked PR or misconfigured repo exposes everything.

2. **Secrets never go in git history.** A secret committed even once and then deleted is still in the git history. Tools like Trufflehog, GitLeaks, and GitHub's secret scanning will find it.

3. **Use `.env` files locally, gitignored.** The `.env` file lives on each developer's machine. It is listed in `.gitignore`. It is never committed.

4. **Use `.env.example` to document what secrets exist.** This file is committed. It lists every required variable with fake example values:

   ```dotenv
   DATABASE_URL=postgresql://user:password@localhost:5432/mydb
   STRIPE_API_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   JWT_SECRET=change-me-to-a-random-64-char-string
   ```dotenv

   Real values go in `.env`, which is gitignored. The `.env.example` tells new developers what to fill in.

5. **Production secrets go in your platform's secret store, not on the server filesystem.** Servers can be imaged, snapshotted, and shared. A secret in a file on a server can end up in unexpected places.

### If You Accidentally Commit a Secret

This happens. Handle it immediately:

1. **Rotate the secret now.** Before doing anything else. Assume the secret is already compromised — it has been in the git history, potentially pushed to a remote, potentially indexed by a code scanning tool. Rotation is the only way to contain the damage.

2. **Remove from git history.** Use `git filter-repo` (preferred over the deprecated BFG Repo Cleaner):

   ```bash
   # Install git-filter-repo (pip install git-filter-repo)
   git filter-repo --path path/to/file --invert-paths
   # Or to scrub a specific string:
   git filter-repo --replace-text <(echo 'sk_live_real_secret==>REDACTED')
   ```dotenv

3. **Force push all branches.** History rewrite requires force push. Coordinate with your team — everyone will need to re-clone or rebase their local copies.

4. **Notify the platform.** GitHub automatically scans for common secret patterns (AWS keys, GitHub tokens, Stripe keys, etc.) and notifies the issuing platform. Some platforms (GitHub, AWS) will auto-revoke detected secrets. Check whether the platform has already taken action.

5. **Document the incident.** Record what happened, when, what was exposed, what actions were taken. This is required for compliance purposes and useful for postmortem review.

### Secret Rotation Schedule

| Secret Type | Rotation Frequency |
|---|---|
| API keys (low privilege, read-only) | Every 90 days |
| API keys (high privilege, write access) | Every 30 days |
| Database passwords | Every 90 days |
| Service account credentials | Every 90 days |
| Privileged service account credentials | Every 30 days |
| TLS certificates | Per expiry (automate — use ACM or Let's Encrypt with auto-renewal) |
| Encryption keys (data at rest) | Annually |
| JWT signing secrets | Every 90 days (rotate without breaking existing sessions using a grace period) |

Automate rotation where possible. Secrets managers like AWS Secrets Manager support automatic rotation with Lambda functions for common credential types.

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---|---|---|
| Hardcoding a secret in source code | Secret exposed to everyone with repo access, and forever in git history | Use environment variables or secrets manager |
| Storing `.env` in git | Same as hardcoding | Add `.env` to `.gitignore` before creating the file |
| Using the same key for everything | One compromise exposes all data | One key per use case |
| Never rotating keys | An undetected compromise has permanent impact | Rotation limits the window of exposure |
| Sharing service account credentials | Revocation affects all services; attribution is impossible | One credential per service |
| Not testing backup decryption | Backup is unrestorable when you need it | Test restoration quarterly |

---

## Related Documents

- [DATA_CLASSIFICATION.md](./DATA_CLASSIFICATION.md) — encryption requirements by data classification level
- [ACCESS_CONTROL.md](./ACCESS_CONTROL.md) — who can access keys and secrets
- [AUDIT_LOGGING.md](./AUDIT_LOGGING.md) — log all access to secrets and keys
- [FIPS_OVERVIEW.md](./FIPS_OVERVIEW.md) — FIPS-validated crypto requirements for federal systems
- [NIST_OVERVIEW.md](./NIST_OVERVIEW.md) — SC (System and Communications Protection) control family

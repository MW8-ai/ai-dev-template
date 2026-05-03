# FIPS Overview

FIPS (Federal Information Processing Standards) are standards published by NIST (National Institute of Standards and Technology) that federal agencies must follow. FIPS 140-2 and 140-3 cover cryptographic modules — the software and hardware components that perform encryption, decryption, hashing, and key management.

If your system handles federal data or needs to connect to federal systems, you must use FIPS-validated cryptography. This document explains what that means and how to implement it.

---

## FIPS 140-2 and 140-3

FIPS 140-2 is the validation standard for cryptographic modules. FIPS 140-3 is its successor, adopted in 2019. Both are still in use — 140-2 certificates remain valid; new certifications are issued under 140-3.

"FIPS validated" means a specific version of a specific product was tested by an accredited lab and listed in the NIST CMVP (Cryptographic Module Validation Program) database. It is not a generic property of an algorithm — it is tied to a specific implementation. Using AES-256 in your own code is not FIPS validated. Using AES-256 through OpenSSL's FIPS module, which is validated, is.

Check the CMVP database at: https://csrc.nist.gov/projects/cryptographic-module-validation-program

---

## Validation Levels (1–4)

FIPS 140-2 and 140-3 define four levels of assurance:

| Level | What It Means | Typical Use |
|---|---|---|
| Level 1 | Software-only module, no physical security requirements. Uses approved algorithms correctly. | Cloud services, server software |
| Level 2 | Adds tamper-evidence (physical seals or coatings). Operators authenticated via roles. | Hardware security tokens, smart cards |
| Level 3 | Adds tamper-resistance: module attempts to zeroize keys when attacked. Strong operator authentication. | HSMs in high-security environments |
| Level 4 | Highest assurance. Complete envelope of protection. Detects and responds to environmental attacks (voltage, temperature). | Military, classified systems |

For most federal civilian software: Level 1 is the minimum, Level 2 for hardware tokens, Level 3+ for HSMs (Hardware Security Modules) storing high-value keys.

---

## Approved Algorithms

Only use the algorithms on NIST's Approved Algorithms list. The key ones:

### Symmetric Encryption

- **AES-128, AES-192, AES-256** — all approved. AES-256 is the default recommendation.
- Use in GCM (Galois/Counter Mode) for authenticated encryption (provides both confidentiality and integrity).

### Hashing

- **SHA-256** — minimum acceptable for most uses
- **SHA-384, SHA-512** — preferred for higher security
- **SHA-1** — deprecated; do not use for new systems. Some legacy systems still accept it for verification only.
- **MD5** — not approved. Do not use for any security purpose.

### Key Exchange

- **ECDH (Elliptic Curve Diffie-Hellman)** with P-256 or P-384 — preferred
- **RSA** — key size 2048-bit minimum; 3072-bit or 4096-bit for long-lived keys
- **DH (Diffie-Hellman)** — 2048-bit minimum; ECDH is preferred

### Digital Signatures

- **ECDSA (Elliptic Curve Digital Signature Algorithm)** with P-256 or P-384
- **RSA-PSS** — RSA signatures with PSS (Probabilistic Signature Scheme) padding; 2048-bit minimum
- **Ed25519** — approved in FIPS 186-5 (2023); check your agency's approved algorithm list, as older agency policies may not yet include it
- **RSA-PKCS1v15** — still common but RSA-PSS is preferred for new implementations

### Not Approved — Do Not Use

| Algorithm | Reason |
|---|---|
| MD5 | Collision attacks, broken |
| SHA-1 | Collision attacks demonstrated |
| DES | 56-bit key, easily brute-forced |
| 3DES (Triple DES) | Deprecated by NIST in 2023; Sweet32 attack |
| RC4 | Multiple vulnerabilities |
| Custom / home-grown crypto | Not validated, almost certainly flawed |

---

## TLS (Transport Layer Security) Requirements

TLS is the protocol that secures data in transit. FIPS requires:

- **Minimum: TLS 1.2.** TLS 1.0 and 1.1 are prohibited.
- **Preferred: TLS 1.3.** TLS 1.3 removes legacy cipher suites and is more secure by design.

### Approved TLS 1.2 Cipher Suites (examples)

```text
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
```

Cipher suites using RC4, DES, 3DES, MD5, or anonymous key exchange are prohibited.

---

## Practical Implementation

### Rule 1: Use OS-Provided Crypto

Do not implement cryptographic algorithms yourself. Use the operating system or platform cryptographic providers:

- **Linux:** OpenSSL with the FIPS module enabled, or the NSS (Network Security Services) library in FIPS mode
- **Windows:** CNG (Cryptography API: Next Generation) — built in, FIPS-validated at the OS level. Enable FIPS mode via Group Policy or registry key.
- **macOS:** Apple's Security framework and CommonCrypto. macOS includes FIPS-validated modules; check the CMVP database for the specific OS version.

### Rule 2: Check Your Language Runtime

Your application code calls crypto libraries. Verify the chain:

```text
Your code → language runtime → crypto library → FIPS-validated module
```

- **Go:** Use `crypto/tls` from the standard library. For FIPS builds, use `GOEXPERIMENT=boringcrypto` or the `go-boring` fork, which uses BoringCrypto (FIPS validated).
- **Python:** `cryptography` package, configured to use OpenSSL FIPS module. Standard `hashlib` and `ssl` modules use OpenSSL.
- **Java:** Use `SunPKCS11` provider pointing to a FIPS-validated HSM, or the Bouncy Castle FIPS provider.
- **Node.js:** Built against OpenSSL. Run with `--enable-fips` flag and OpenSSL FIPS module installed.

### OpenSSL FIPS Module Setup (Overview)

1. Download OpenSSL source and the FIPS module source from openssl.org
2. Build the FIPS module: `./Configure enable-fips && make && make install_fips`
3. Configure `/etc/ssl/fips_enabled` or set `openssl.cnf` to activate the FIPS provider
4. Verify: `openssl list -providers` should show the fips provider active
5. Test: any call to a non-approved algorithm will fail with an error

Full instructions: https://wiki.openssl.org/index.php/OpenSSL_3.0

### AWS: FIPS Endpoints and GovCloud

AWS offers FIPS 140-2 validated endpoints for most services. These endpoints enforce FIPS-compliant TLS.

- Use `*.us-gov-west-1.amazonaws.com` or `*.us-gov-east-1.amazonaws.com` endpoints in GovCloud
- Or use the FIPS-specific endpoint hostnames: `s3-fips.us-east-1.amazonaws.com`, `kms-fips.us-east-1.amazonaws.com`, etc.
- AWS GovCloud regions are FedRAMP High authorized and use FIPS-validated crypto throughout

---

## Key Management

Key management is where most FIPS implementations fail in practice.

### Rotation Schedule

- Encrypt data at rest: rotate encryption keys annually at minimum
- TLS certificates: rotate per the certificate lifecycle; automate with Let's Encrypt or AWS ACM (Certificate Manager)
- API signing keys: rotate per your security policy (quarterly is common)

### Key Storage

- **Low impact systems:** Secrets manager (AWS Secrets Manager, HashiCorp Vault)
- **Moderate impact systems:** KMS (Key Management Service) with FIPS-validated backend — AWS KMS in GovCloud, Google Cloud KMS with FIPS mode, Azure Key Vault
- **High impact systems:** HSM (Hardware Security Module) at FIPS 140-2 Level 3 or higher — AWS CloudHSM, Thales Luna, Utimaco

### Key Escrow

Some federal programs require key escrow: a copy of the encryption key held by a trusted third party, allowing authorized recovery if the primary key holder is unavailable. Requirements vary by agency and program. Check your program's specific requirements.

### Never Do This

- Store a key next to the data it encrypts (if an attacker gets the data, they get the key too)
- Store keys in environment variables without a secrets manager in production
- Hardcode keys in source code
- Use the same key for multiple purposes (one key per use case)

---

## Related Documents

- [NIST_OVERVIEW.md](./NIST_OVERVIEW.md) — the broader NIST framework that FIPS fits into
- [ENCRYPTION_AND_SECRETS.md](./ENCRYPTION_AND_SECRETS.md) — secrets management and encryption at rest/in transit
- [DATA_CLASSIFICATION.md](./DATA_CLASSIFICATION.md) — impact level determines which FIPS requirements apply

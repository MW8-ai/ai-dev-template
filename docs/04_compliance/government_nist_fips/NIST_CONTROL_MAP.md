# NIST_CONTROL_MAP.md

## Purpose

Lightweight mapping from repo practices to NIST-style control areas.

## Families To Consider

- AC — Access Control
- AU — Audit and Accountability
- CM — Configuration Management
- CP — Contingency Planning
- IA — Identification and Authentication
- IR — Incident Response
- RA — Risk Assessment
- SA — System and Services Acquisition
- SC — System and Communications Protection
- SI — System and Information Integrity

## Example Mapping

| Practice | NIST Area | Evidence |
|---|---|---|
| Branch protection | CM / AC | Repo settings screenshot or policy |
| Required PR review | CM | GitHub branch rules |
| Audit logs | AU | Platform audit logs |
| Incident response doc | IR | `INCIDENT_RESPONSE.md` |
| Access review | AC / IA | `ACCESS_REVIEW.md` |
| Dependency scanning | RA / SI | CI/security scan output |
| Rollback plan | CP / CM | `ROLLBACK.md` |

## Rule

This is a planning aid, not a complete compliance package.

# FIPS_CRYPTO_CHECKLIST.md

## Purpose

Checklist for projects where FIPS-validated cryptography may matter.

## Questions

- Does the project handle sensitive government data?
- Is encryption required at rest?
- Is encryption required in transit?
- Are we using a managed cloud service?
- Which cryptographic module is actually used?
- Is the exact module/version validated under CMVP?
- Is FIPS mode required by policy?
- Are non-FIPS algorithms disabled?
- Are dev/stage/prod configured consistently?
- Is evidence captured?

## Evidence To Capture

- vendor documentation
- module name
- module version
- CMVP certificate
- configuration screenshots
- architecture notes
- compensating controls if any

## Warning

Do not claim FIPS compliance unless validated modules and required configurations are confirmed.

# MODEL_ROUTING.md

## Goal

Use the smallest capable model/tool.

## Cheap/Fast Models

Use for:

- docs cleanup
- changelog updates
- simple formatting
- CSS tweaks
- repetitive catalog additions
- prompt variations

## Mid Models

Use for:

- small features
- bug fixes
- simple integrations
- test additions
- refactors within one module

## Strong Models

Use for:

- architecture
- security
- auth
- database migrations
- cross-file debugging
- production deployment
- unclear requirements
- compliance interpretation

## Rule

If the task copies a known pattern, use cheaper tools.

If the task creates a new pattern or touches safety/security, use stronger tools and human review.

## Testing Standards

### The Goal

Tests give you confidence to change code without fear of breaking things. A codebase without tests means every change is a gamble.

### Testing Pyramid

```text
        /\
       /E2E\          ← few, slow, catch integration issues
      /------\
     / Integ  \       ← some, medium speed, test component interaction
    /----------\
   /    Unit    \     ← many, fast, test individual functions
  /--------------\
```

- Unit tests: fast, isolated, test one function or class
- Integration tests: test how components interact (e.g., API endpoint + database)
- E2E (End-to-End) tests: test the full application from the user's perspective

### Coverage Expectations

| Project Type | Minimum Coverage |
|---|---|
| Hobby | No hard requirement — some tests are better than none |
| Enterprise | 70% line coverage for business logic |
| Government | 80%+ line coverage, 100% for security-critical paths |

Coverage numbers are a floor, not a goal. 70% meaningful tests beats 90% coverage of trivial getters.

### What to Test

- Every public function with logic
- Error cases and edge cases
- Security-relevant paths (auth, permissions, input validation)
- Any bug that was reported — write a test that would have caught it

### What Not to Test

- Trivial getters/setters with no logic
- Third-party library internals
- Generated code you don't own

### Test Naming

Name tests so failures are self-documenting:

- `test_login_fails_with_wrong_password` not `test_login_2`
- `should return 404 when user not found` not `user test`

### Test Data

- Use factories or fixtures — don't hardcode realistic-looking data
- Never use real user data in tests
- Reset state between tests — tests must be independent and runnable in any order

---

## Next Step

→ [Documentation standards](docs/06-standards/DOCUMENTATION.md)

# Branching Strategy

Every team needs a branching strategy. The wrong one creates merge hell. The right one fits your team's size, release cadence, and risk tolerance.

This doc explains the three main strategies, when to use each, and what this repo recommends.

---

## The Three Strategies

### 1. Trunk-Based Development

Everyone commits to a single branch (`main` or `trunk`). Long-lived feature branches are avoided. Instead, unfinished work is hidden behind feature flags.

```
main: A → B → C → D → E → F  (continuous flow)
            ↑       ↑
        tiny short  tiny short
        branch      branch
        (merged     (merged
        same day)   same day)
```

**Rules:**
- No branch lives longer than 1–2 days
- Incomplete features use feature flags, not long branches
- CI must pass before merging
- Deployments happen continuously or on a schedule from `main`

**Best for:**
- Teams practicing continuous delivery / continuous deployment
- Small to mid-size teams (2–15 engineers) with strong test coverage
- Products that ship frequently (multiple times per day or week)
- Teams with high discipline and good CI coverage

**Not ideal for:**
- Large, distributed teams where coordination is hard
- Projects with long QA cycles or external approval gates
- Open-source projects with untrusted external contributors

---

### 2. GitFlow

A structured model with dedicated branches for each phase of development: features, releases, and hotfixes. Popularized by Vincent Driessen's 2010 blog post.

```
main:    ────●──────────────────●──────────────●──────
             │                  │              │
develop: ─●──●──●───●───●───●───●──●───●───●──●──────
              \       /   \       /
          feature/A       feature/B

release/1.0: ───────────────●───●  (only bug fixes)
                             \   \
                       tag v1.0  merged back to main + develop

hotfix/critical: ──────────────────────●──●
                                        \  \
                                    tag v1.0.1  merged to main + develop
```

**Branches:**
| Branch | Purpose | Lifetime |
|---|---|---|
| `main` | Production-ready code, every commit is a release | Permanent |
| `develop` | Integration branch, next release |  Permanent |
| `feature/*` | Individual features | Days to weeks |
| `release/*` | Release preparation (only bug fixes) | Days |
| `hotfix/*` | Emergency production fixes | Hours |

**Best for:**
- Teams with scheduled release cycles (monthly, quarterly)
- Products with multiple supported versions
- Large teams where `develop` provides a buffer before production
- Projects with formal QA / sign-off processes

**Not ideal for:**
- Continuous delivery teams — the overhead kills velocity
- Small teams — two permanent branches doubles the merge work
- Teams that want a simple history — GitFlow creates complex merge chains

---

### 3. GitHub Flow (Simplified Trunk)

A simpler version of trunk-based development. One long-lived branch (`main`) plus short-lived feature branches. No `develop`, no `release` branches.

```
main:       A ─────────────────● ─────────────●
                               ↑              ↑
feature/login: ─B─C─D (PR) ──┘              │
feature/search:    ─E─F─G (PR) ─────────────┘
```

**Rules:**
1. `main` is always deployable
2. Work on named feature branches (`feature/`, `fix/`, `docs/`, etc.)
3. Open a PR to merge into `main`
4. Deploy from `main` after merging

**Best for:**
- Teams deploying frequently
- Small to mid-size teams
- Projects where every merged PR can go to production immediately
- Open-source repos where simplicity helps external contributors

**This is the strategy this repo uses.** See below.

---

## This Repo's Approach: GitHub Flow with Enforcement

We use GitHub Flow with additional guardrails:

### Branch Naming Convention

```
feature/<short-description>    # new functionality
fix/<short-description>        # bug fix
docs/<short-description>       # documentation only
chore/<short-description>      # maintenance, deps, config
hotfix/<short-description>     # emergency fix to production
release/<version>              # release prep (optional, for versioned projects)
```

Examples:
```
feature/user-authentication
fix/login-redirect-loop
docs/update-api-reference
chore/upgrade-node-20
hotfix/sql-injection-patch
release/v1.2.0
```

Why naming matters: CI workflows can trigger selectively by branch pattern. Code owners can be assigned by path or branch prefix. The `labeler.yml` automation applies labels based on branch names.

### Branch Protection on `main`

- Require at least 1 approving review
- Require all status checks to pass (lint, test, security scan)
- No direct pushes — everything goes through a PR
- No force pushes

### Merge Strategy

Squash merge by default. Each PR becomes one commit on `main`. This keeps `main`'s history clean: one line per feature/fix, not a tangled web of WIP commits.

```
main before: A → B → C
             (clean, readable)

main after merging feature/X (squashed):
A → B → C → D
             (D = all of feature/X's commits squashed into one)
```

---

## Trunk vs GitFlow: How to Decide

Ask these questions:

**Do you deploy multiple times per day?**
→ Yes: Trunk-based or GitHub Flow

**Do you maintain multiple production versions simultaneously?**
→ Yes: GitFlow (you need `release/1.x` and `release/2.x` branches)

**Is your team fewer than ~15 engineers?**
→ Yes: GitHub Flow is simpler and sufficient

**Do you have a formal QA cycle between "code complete" and "shipped"?**
→ Yes: GitFlow's `release` branch gives you a stable integration point for QA

**Do you struggle with merge conflicts eating up time?**
→ Consider trunk-based: smaller, more frequent merges reduce conflict surface area

---

## Feature Flags vs Long-Lived Branches

Trunk-based development requires feature flags for incomplete work. This is the main objection teams have: "What if the feature isn't done?"

**The answer is a feature flag:**

```javascript
if (featureFlags.isEnabled("new-checkout-flow", userId)) {
  return renderNewCheckout();
} else {
  return renderLegacyCheckout();
}
```

The incomplete code ships to production, but no users see it. When it's ready, flip the flag. This is how large companies (Google, Facebook, Netflix) ship — not by maintaining months-long branches.

**When feature flags are overkill:**
- Small teams with fast PR cycles (< 1 week per PR)
- Projects where every commit is isolated and self-contained
- Open-source where you can't coordinate flags across contributors

In those cases, short-lived branches + GitHub Flow is simpler and works well.

---

## Long-Lived Branches: When They're Okay

Sometimes a long-lived branch is the right call:

| Scenario | Approach |
|---|---|
| Major API rewrite that can't be incremental | Long branch, rebase frequently against `main` |
| Client-specific fork of the codebase | Separate branch, cherry-pick upstream fixes |
| Parallel maintained versions (v1 and v2) | `release/1.x` and `release/2.x` branches with separate CI |
| Experimental proof-of-concept | `experiment/<name>` branch, no expectation of merging |

Rules for long-lived branches:
1. Rebase against `main` at least weekly to prevent divergence
2. Have a clear merge-or-abandon decision date
3. Assign an owner who is responsible for keeping it mergeable
4. Communicate to the team so nobody builds on top of it unintentionally

---

## Workflow Triggers by Branch Pattern

Your GitHub Actions workflows can fire differently based on the branch:

```yaml
# Run tests on every feature branch PR
on:
  pull_request:
    branches: [main]

# Deploy only from main
on:
  push:
    branches: [main]

# Notify on hotfix merges (urgent path)
on:
  push:
    branches: ["hotfix/**"]
```

This is why consistent branch naming matters — your CI can automate differently based on the branch prefix.

---

## Next Step

→ `docs/06-standards/COMMIT_CONVENTION.md` — how commits should be formatted, and why it matters for automation

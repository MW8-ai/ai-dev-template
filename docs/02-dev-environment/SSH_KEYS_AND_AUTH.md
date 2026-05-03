# SSH Keys and GitHub Authentication

SSH (Secure Shell) keys are the standard way to authenticate with GitHub from the command line. Once set up, you never type your password to push or pull — Git authenticates automatically using your key pair.

## Quick Path (Mac and Linux)

```bash
# 1. Generate an Ed25519 key pair
ssh-keygen -t ed25519 -C "your@email.com"
# When prompted for a file location, press Enter to accept the default
# When prompted for a passphrase, press Enter twice for no passphrase
# (or set a passphrase if you want extra security)

# 2. Print your public key
cat ~/.ssh/id_ed25519.pub
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... your@email.com

# 3. Copy the entire output line to your clipboard
# On Mac:
cat ~/.ssh/id_ed25519.pub | pbcopy
# On Linux (with xclip):
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# 4. Go to GitHub.com → click your profile photo → Settings
#    → SSH and GPG keys → New SSH key
#    Paste the key, give it a title like "MacBook Pro 2024", click Add SSH key

# 5. Test the connection
ssh -T git@github.com
# Hi your-username! You've successfully authenticated, but GitHub
# does not provide shell access.
```

## Quick Path (Windows — Git Bash)

The commands are identical to Mac/Linux. Open **Git Bash** and run the exact same steps above.

---

## Full Explanation

### What SSH Keys Are

An SSH key pair consists of two mathematically linked files:

- **Private key** (`~/.ssh/id_ed25519`): Stays on your computer. Never share this with anyone. Never upload it anywhere.
- **Public key** (`~/.ssh/id_ed25519.pub`): Placed on servers you want to authenticate to — in this case, GitHub. It is safe to share publicly; it is useless without the matching private key.

When you connect to GitHub via SSH, the server presents a challenge encrypted with your public key. Only your private key can decrypt it. If the decryption succeeds, you're authenticated — no password required.

Think of it like a padlock. You give GitHub the padlock (public key). You keep the key to the padlock (private key). Anyone can lock things with the padlock, but only you can unlock them.

### Ed25519 vs RSA

The algorithm determines how the key pair is generated and how strong it is.

**Ed25519** is the right choice for new SSH keys:

- Keys are much shorter (68 characters vs 3000+ for RSA)
- Faster to generate and verify
- More secure than equivalent RSA key lengths
- Supported by GitHub, GitLab, Bitbucket, and all modern SSH servers

**RSA** is the older standard. Still secure at 4096 bits, but there is no reason to use RSA for new keys.

```bash
# Ed25519 (recommended)
ssh-keygen -t ed25519 -C "your@email.com"

# RSA at 4096 bits (only if a system specifically requires RSA)
ssh-keygen -t rsa -b 4096 -C "your@email.com"
```

### The ssh-agent

The `ssh-agent` is a background process that holds your private key in memory after you've unlocked it once. When an SSH connection is made, the agent handles the authentication without prompting you again.

**Start ssh-agent and add your key:**

```bash
# Start the agent in the background
eval "$(ssh-agent -s)"
# Agent pid 23456

# Add your private key to the agent
ssh-add ~/.ssh/id_ed25519
# Identity added: /Users/you/.ssh/id_ed25519 (your@email.com)
```

On Mac, the keychain integration means you only need to add the key once:

```bash
# Mac: add key to agent and save passphrase in macOS Keychain
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

Add these lines to `~/.zshrc` (Mac/Linux) or `~/.bashrc` so the agent starts automatically:

```bash
# ~/.zshrc or ~/.bashrc
if [ -z "$SSH_AUTH_SOCK" ]; then
   eval "$(ssh-agent -s)" > /dev/null
   ssh-add ~/.ssh/id_ed25519 2>/dev/null
fi
```

### Multiple GitHub Accounts (Work and Personal)

If you have two GitHub accounts — say, a personal account and a work account — you need two SSH keys and a config file to tell SSH which key to use for which host.

**Step 1: Generate a second key pair:**

```bash
# Give it a different filename
ssh-keygen -t ed25519 -C "work@company.com" -f ~/.ssh/id_ed25519_work
```

Add `id_ed25519_work.pub` to your work GitHub account via the same Settings → SSH keys process.

**Step 2: Create or edit `~/.ssh/config`:**

```text
# Personal GitHub account
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519

# Work GitHub account (using a custom host alias)
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

**Step 3: Use the host alias for work repos:**

```bash
# Clone a work repo using the alias instead of "github.com"
git clone git@github-work:work-org/their-repo.git

# Update an existing repo's remote to use the alias
git remote set-url origin git@github-work:work-org/their-repo.git
```

When you push, SSH uses the config file to determine which key to send based on the host alias.

### HTTPS vs SSH

GitHub supports two protocols for Git operations:

| | HTTPS | SSH |
|---|---|---|
| URL format | `https://github.com/org/repo.git` | `git@github.com:org/repo.git` |
| Authentication | GitHub token or password manager | SSH key pair |
| Setup effort | Low — paste a token | Moderate — generate and register key |
| Behind corporate firewalls | Usually works (port 443) | May be blocked (port 22) |
| Long-term convenience | Requires credential helper | Authenticate once per machine |

Use HTTPS if your company blocks port 22 (SSH's default port). GitHub also supports SSH over port 443:

```bash
# Test SSH over port 443 (if port 22 is blocked)
ssh -T -p 443 git@ssh.github.com
# Hi your-username! You've successfully authenticated...
```

To use port 443 for all GitHub SSH connections, add to `~/.ssh/config`:

```text
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
```

**Switch an existing repo from HTTPS to SSH:**

```bash
# Check current remote URL
git remote -v
# origin  https://github.com/your-org/your-repo.git (fetch)

# Switch to SSH
git remote set-url origin git@github.com:your-org/your-repo.git

# Verify
git remote -v
# origin  git@github.com:your-org/your-repo.git (fetch)
```

### Troubleshooting

**"Permission denied (publickey)"**

This means GitHub rejected your SSH key. Debug with verbose output:

```bash
ssh -vT git@github.com
```

Look for:

- "Trying private key: /Users/you/.ssh/id_ed25519" — confirm it's trying the right key
- "Server accepts key" — the key matched, but something else failed (rare)
- "No more authentication methods to try" — the key wasn't accepted

Common causes and fixes:

```bash
# 1. Key not added to ssh-agent
ssh-add -l
# If empty: "The agent has no identities."
ssh-add ~/.ssh/id_ed25519

# 2. Wrong key registered on GitHub
# Check which keys GitHub has:
# GitHub → Settings → SSH keys
# Compare with your public key:
cat ~/.ssh/id_ed25519.pub

# 3. Using the wrong remote URL (HTTPS instead of SSH)
git remote -v
# If it shows "https://..." switch to SSH:
git remote set-url origin git@github.com:your-org/your-repo.git
```

**"Host key verification failed" or "REMOTE HOST IDENTIFICATION HAS CHANGED"**

GitHub's SSH host key fingerprint is public and verifiable. This error means the fingerprint stored in your `~/.ssh/known_hosts` doesn't match what GitHub presents — either because GitHub legitimately rotated its key, or (rarely) because of a man-in-the-middle attack.

GitHub publishes its current fingerprints at [docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints).

If you trust GitHub updated its key:

```bash
# Remove the stale GitHub entry from known_hosts
ssh-keygen -R github.com

# Reconnect — SSH will prompt you to accept the new fingerprint
ssh -T git@github.com
```

**"Bad permissions" on private key file**

SSH requires that private key files are readable only by their owner. If permissions are too open, SSH refuses to use the key.

```bash
# Fix permissions
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 700 ~/.ssh/
```

---

## What to Read Next

- `docs/01-getting-started/FIRST_COMMIT_PUSH.md` — start pushing with your new SSH key
- `docs/02-dev-environment/GIT_CLI_SETUP.md` — the full Git command reference
- `docs/01-getting-started/COMMON_MISTAKES.md` — common mistakes including auth errors

---

## Next Step

→ [docs/03-development-workflow/ISSUE_TO_BRANCH_TO_PR.md](docs/03-development-workflow/ISSUE_TO_BRANCH_TO_PR.md) — walk through the full development workflow from opening an issue to merging a PR

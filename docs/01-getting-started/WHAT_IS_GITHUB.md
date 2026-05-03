# What Is GitHub?

## Quick Path: Create a Free GitHub Account

1. Go to [github.com](https://github.com) and click **Sign up**
2. Enter your email, create a password, and choose a username (this is public — pick something professional)
3. Verify your email address and complete the onboarding steps — you now have a GitHub account

---

## Full Explanation

### The Problem That Version Control Solves

Imagine three people writing a report together in a single Word document stored on a shared drive. Person A edits the introduction. Person B rewrites the conclusion at the same time. Person C renames the file to "final_v2_ACTUALLY_FINAL.docx" and emails it to everyone.

Now you have four conflicting versions. Nobody knows which is current. Whoever saves last wins. Work gets lost.

This is exactly the problem that version control solves — and it gets far worse with code, where a single misplaced character can break an entire application.

Version control is a system that tracks every change to a set of files over time. It records who changed what, when, and why. It lets multiple people work on the same project simultaneously without overwriting each other. And it lets you go back to any previous state if something breaks.

### What Git Is

**Git** is a version control tool that runs on your local computer. It was created by Linus Torvalds in 2005 to manage the Linux kernel source code, and it has become the standard for software development worldwide.

Git lives entirely on your machine. When you initialize a Git repository (a tracked project folder), Git creates a hidden `.git/` folder inside it. Every change you save (called a **commit**) is stored in that folder as a snapshot of your files at that moment. You can have 10,000 commits spanning 5 years and browse any of them instantly.

Git works without an internet connection. You can commit, branch, and review history entirely offline.

### What GitHub Is

**GitHub** is a cloud platform built on top of Git. It hosts copies of your Git repositories online and adds a layer of collaboration tools:

- A web interface to browse code, history, and file diffs
- **Pull Requests (PRs)**: a structured process for proposing and reviewing changes
- **Issues**: a bug tracker and task list
- **Actions**: automated workflows (run tests, deploy code) triggered by Git events
- Access control: who can read or write to a repository
- **Codespaces**: full development environments in the cloud (see `docs/02-dev-environment/CODESPACES_SETUP.md`)

GitHub is not the only Git hosting platform — GitLab and Bitbucket also exist — but GitHub is by far the most widely used, especially for open source.

### Key Concepts Explained Simply

**Repository (Repo)**
A repository is a project folder that Git tracks. It contains your files plus the complete history of every change ever made to them. Repos can be public (anyone can see them) or private (only invited people).

**Commit**
A commit is a saved snapshot of your project at a specific point in time. Every commit has a unique ID (a long string like `a3f9b12`), a message describing what changed, the author's name, and a timestamp. Think of commits like save points in a video game — you can always go back.

**Branch**
A branch is a parallel version of your repository. The main branch (usually called `main`) holds the working, production-ready code. When you want to add a feature or fix a bug, you create a new branch. You work there safely without touching `main`. When you're done, you merge your branch back.

**Pull Request (PR)**
A pull request is a formal proposal to merge your branch into another branch (usually `main`). It's where code review happens. Team members can comment on specific lines, approve the changes, or request modifications before anything merges.

**Fork**
A fork is your own copy of someone else's repository on GitHub. Forking is how open source contributions work: you fork a project, make changes in your fork, then open a pull request to propose those changes back to the original project.

**Clone**
Cloning is downloading a complete copy of a repository — including all its history — to your local machine. This is how you get started on an existing project.

### What Happens When You Push Code

When you **push** code, here is the sequence:

1. You have made one or more commits in your local Git repository
2. You run `git push origin main` (or another branch name)
3. Git connects to GitHub over HTTPS (HyperText Transfer Protocol Secure) or SSH (Secure Shell)
4. Git compares your local commits to what GitHub already has
5. Git sends only the new commits and the files that changed within them — not the entire project
6. GitHub stores those commits and updates the branch to point to the latest one
7. Anyone with access can now pull your changes to their local copy

GitHub stores Git history in the same format Git uses locally. There is no translation — GitHub is just a Git server with a web interface and collaboration features on top.

### What You Can Do on GitHub.com vs Locally

| Task | Local (Git) | GitHub.com |
|---|---|---|
| Create commits | Yes | No (web editor creates commits but it's limited) |
| Browse file history | Yes (`git log`) | Yes, with a nice UI |
| Create and switch branches | Yes | Yes |
| Open a pull request | No | Yes |
| Review code line-by-line | No | Yes |
| Run automated tests (CI/CD) | Yes (locally) | Yes (Actions) |
| Manage access permissions | No | Yes |
| Create Issues and project boards | No | Yes |
| Deploy code | Not directly | Yes (via Actions) |

Most daily development happens locally. GitHub is where collaboration, review, and history sharing happen.

---

## What to Read Next

- `docs/01-getting-started/GIT_TERMS_EXPLAINED.md` — every key term defined with an analogy and example
- `docs/01-getting-started/FIRST_COMMIT_PUSH.md` — make your first commit and push it
- `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — set up secure authentication with GitHub

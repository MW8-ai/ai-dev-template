# Branching and Merge Guide

## Simple model
A branch is a safe workspace. A pull request is a request to merge that workspace into the main line.

## Default flow
1. Create a branch from `main`.
2. Make a small focused change.
3. Run checks.
4. Open a pull request.
5. Review and resolve comments.
6. Merge after checks pass.

## Merge conflicts
Conflicts happen when two changes edit the same area. Resolve by choosing the correct final content, not blindly accepting one side.

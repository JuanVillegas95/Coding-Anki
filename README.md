**Coding-Anki** repository is designed to practice and reinforce my understanding of coding problems using a spaced repetition approach.

## Overview
This repository leverages Git branches to create a system for coding practice. By revisiting specific branches, I can repeatedly re-implement coding exercises and run tests to solidify my understanding and improve retention.

## Structure

- **main**: Contains the README and general information about the repository.
- **solution/**: Branches with the full implementation of exercises and unit tests.
- **practice/**: Branches where the implementation is removed, keeping only the tests for practice.

## Exercises
### OpenGL
1. OpenGL-Create_window

## Handy commands
Remove untracked files and move to another branch:
```bash
git reset --hard origin/<branch-name>
git clean -fd
git checkout main
```
This command will remove files that are not tracked by Git, including new files you created.

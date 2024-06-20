# Coding-Anki
Repository for practicing and reinforcing coding problems using a spaced repetition approach.

## Overview
This repository leverages Git branches to create a system for coding practice. By revisiting specific branches and commits, I can repeatedly re-implement coding exercises and run tests to solidify my understanding and improve retention. Each branch represents a different area of study or topic, and each commit represents a specific step or exercise within that topic.

## Commit Conventions
### Problems
- **Problem Commit:** `[problem] <topic>: <description>`
- **Solution Commit:** `[solution] <topic>: <description>`

### Projects
- Normal commit messages are used for projects. To view a solution, simply go one commit ahead.

## Example Workflow for Problems and Projects
#### Branch: `algorithms`
1. **Commit 1 (Problem):** `[problem] binary-search: added exercise with incomplete function`
2. **Commit 2 (Solution):** `[solution] binary-search: implemented binary search function`
#### Branch: `open-gl`
1. **Commit 1:** `set up project`
2. **Commit 2:** `create a window`
3. **Commit 3:** `draw a circle`
3. **Commit ...:** `...`
   
## Existing Problems and Projects

### Problems
- **Binary Search**
  - **Branch:** `algorithms`
  - **Problem Commit:** `[problem] binary-search: added exercise with incomplete function`
  - **Solution Commit:** `[solution] binary-search: implemented binary search function`

### Projects
- **Particle simulator:** 
  - **Branch:** `open-gl`
1. **Commit 1:** `set up project`  Implement a window .h and .c with the functions create, destroy, loop.
3. **Commit 2:** `create a window`  Implement a particle .h and .c with the functions create, destroy, draw.
4. **Commit 3:** `draw a circle`

## Handy commands
To move your current branch pointer to a specific commit:
```
git reset --hard <commit_hash>
```

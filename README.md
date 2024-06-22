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

| Number | Commit Message                    | SHA                                        | Description                                                                           |
|--------|-----------------------------------|--------------------------------------------|---------------------------------------------------------------------------------------|
| 1      | set up project                    | 3199f71f92e3e4174ef2e1c9999eb87f83cfe0ac   | Implement a window .h and .c with the functions create, destroy, loop.                |
| 2      | create a window                   | 9c8a10f7a11c8e0b5dadce5d4f4d1dec96c65fa8   | Implement a particle .h and .c with the functions create, destroy, draw and add velocity. |
| 3      | draw a circle and add velocity    | 094b23fe41bd322afbce7f1464904cfd5efd5cba   | Add delta time and gravity to the particle implementation                             |
| 3      | add delta time and gravity        | d6006d28febe0ab3118d5643b150895ea9d2135e   |                                                                                       |



## Handy commands
To move your current branch pointer to a specific commit:
```
git reset --hard <commit_hash>
```

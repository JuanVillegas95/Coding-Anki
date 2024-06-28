# Coding-Anki
Repository for practicing and reinforcing coding problems using a spaced repetition approach.

## Overview
This repository leverages Git branches to create a system for coding practice. By revisiting specific branches and commits, I can repeatedly re-implement coding exercises and run tests to solidify my understanding and improve retention. Each branch represents a different area of study or topic, and each commit represents a specific step or exercise within that topic.

## Existing Problems and Projects

### Problems
- **Binary Search**
  - **Branch:** `data_structures`

| Number | Problem          | To-Implement                | Implementation                                                     |
|--------|------------------|-----------------------------|---------------------------------------------------------------------|
| 1      | Binary Tree      | 3199f71f92e3e4174ef2e1c9999eb87f83cfe0ac  | 3199f71f92e3e4174ef2e1c9999eb87f83cfe0ac |

### Projects
1. **Particle simulator:** 
  - **Branch:** `open-gl`

| Number | Commit Message                          | SHA                                       | To-do                                                               |
|--------|-----------------------------------------|-------------------------------------------|---------------------------------------------------------------------|
| 1      | Set up project                          | 3199f71f92e3e4174ef2e1c9999eb87f83cfe0ac  | Implement window.h and window.c with functions: create, destroy, loop |
| 2      | Create a window                         | 9c8a10f7a11c8e0b5dadce5d4f4d1dec96c65fa8  | Implement particle.h and particle.c with functions: create, destroy, draw, add velocity |
| 3      | Draw a circle and add velocity          | 094b23fe41bd322afbce7f1464904cfd5efd5cba  | Add delta time and gravity to the particle implementation            |
| 4      | Add delta time and gravity              | d6006d28febe0ab3118d5643b150895ea9d2135e  | Add collision detection for the white box                            |
| 5      | Add collision detection for the box     | 24096b975322a9e352859f06eb744259b8b681b6  | Add multiple particles and encapsulate the box behavior              |
| 6      | Add multiple particles                  | 93e1583b5a96fa8b357342c7017a5d06cc160a52  | Add particle with mouse and particle counter                         |
| 7      | Add particle with mouse and counter     | 4217b0110133b765426f93bb44a3adf80a8829ee  | Add particle cfps                                            |
| 8      | Add particle fps                        | 7d4348554e0fb0f780c4b818979bc227ecf74b3a  |                                                                     |
2. **Purrfect timing:** 
  - **Branch:** `purrfect-timing`
    
| Number | Commit Message                          | SHA                                       | To-do                                                               |
|--------|-----------------------------------------|-------------------------------------------|---------------------------------------------------------------------|
| 1      | Starting point                        | 59c2518f07c1f459031e66699df31e5abc11922b  |  | Implement a handling for the form sumbit
| 2      | Create a window                         | 9c8a10f7a11c8e0b5dadce5d4f4d1dec96c65fa8  | Implement particle.h and particle.c with functions: create, destroy, draw, add 






## Handy commands
To move your current branch pointer to a specific commit:
```
git reset --hard <commit_hash>
```

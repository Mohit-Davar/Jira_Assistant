# Jira Assistant

A **React-based Jira Assistant** that allows users to interact with Jira using natural language.
---
[!Demo](https://github.com/user-attachments/assets/29b4dae3-bf9f-4b89-925a-3fc5241e4de7)




## Table of Contents

- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Request Flow](#request-flow)
- [Why This Architecture](#why-this-architecture)
- [Agent Execution Loop](#agent-execution-loop)
- [Tech Stack](#tech-stack)

---

## Overview

This project avoids a single “do-everything” AI model.  
Instead, it splits responsibility across **focused agents**, each designed for a specific Jira task.

---

## High-Level Architecture

<img width="1024" height="768" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/f55c11d0-3b0d-4a4f-86eb-0d3ae97e0e9e" />

---

## Request Flow

1. **User submits a query**  
   Example: *Create a bug ticket for login failure*

2. **Manager Agent**
   - Understands user intent
   - Routes the request to the correct specialised agent

3. **Specialized Agent**
   - Decides which Jira tool is required
   - Validates parameters

4. **Tool Execution**
   - Jira API is called
   - Result is returned

5. **Final Response**
   - Manager formats and displays the response to the user

---

## Why This Architecture

### Traditional Chatbot
- One large prompt
- High hallucination risk
- Hard to debug

### Agent-Based System
- Lower token usage
- Higher accuracy
- Scalable and maintainable

---

## Agent Execution Loop

<img width="1024" height="768" alt="Agent Loop Diagram" src="https://github.com/user-attachments/assets/f3bd9596-3225-45c4-b0bf-bd3a371be66f" />

1. Reason about the request  
2. Execute a Jira tool  
3. Observe the result  
4. Retry or return final answer  

---

## Tech Stack

- **Frontend:** React
- **Language:** TypeScript
- **Validation:** Zod
- **Agent Framework:** `@openai/agents-sdk`
- **Jira API Client:** `jira.js`

---

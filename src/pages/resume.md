---
title: "Resume"
description:
layout: "@layouts/ContentLayout.astro"
tags: []
date: "2026-08-06"
---

### Email: dev@rjb.tech

### Location: Tennessee, United States

---

## Work Experience

### Fullstack Engineer III (senior engineer)

#### Balto (December 2025 - Present)

- Developed an LLM-provider-agnostic agentic harness powering customer-facing natural-language features, taking it from concept to a live 10+ customer beta in under 4 months — supporting reads and writes across major services

- Advocated for and integrated auditability and safety as a release requirement for the harness — not a peripheral feature, but a precondition for shipping AI-driven customer features

- Designed and built the resulting security auditing layer: malicious prompt blocking, token usage policies, encryption-boundary-safe data handling, and full session reconstruction enabling admins to replay and review complete sessions

- Built a usage and adoption dashboard for the harness — tracking cost, active users/orgs, latency, and daily session volume with org-level drill-down — that became the primary source of truth for beta usage, adopted by customer success for per-org tracking and review

- Built an MCP service adapting our microservice infrastructure for compatibility with the harness, enabling natural-language-driven reads/writes across services without custom glue code

### Software Engineer --> Team Lead Senior Software Engineer

#### Future Capital (March 2023 - November 2025)

- Built scalable browser automation platform for retirement account access across distributors lacking API support, using privacy-preserving architecture where clients control authentication/MFA while operations agents manage account tasks in auditable sessions (Node.js, Playwright, Redis, RabbitMQ, Kubernetes).

- Increased weekly trade execution by 50% by implementing WebSocket-based real-time communication (SignalR/C#) and auditable event tracking system that eliminated operational friction, enabling operations team of 10 to complete revenue-generating trades more efficiently.

- Developed a SAML Assertion Consumer in C#/.NET to support IdP-initiated authentication flows from multiple identity providers, driving increased platform adoption and enabling seamless advisor-portal access for a strategic broker-dealer partnership serving 2,700+ wealth management firms.

- Increased AUM growth and streamlined onboardings by converting our single-account signup flow to allow multi-account signups using React and C#/.NET, increasing average AUM per signup by 10-20%.

- Identified and eliminated a critical security liability by migrating from single-key TripleDES encryption to per-user AES-256-GCM for at-rest and ephemeral x25519/xChaCha20-Poly1305 for in-transit encryption, reducing breach impact from all encrypted data to individual users and achieving modern security compliance.

- Led emergency full-stack (.NET, React) migration from Yodlee FastLink 3→4 across account management and signup flows, completing vendor-recommended month-long rearchitecture in one week to restore signups for Open Banking distributors (Fidelity, TIAA, Voya).

- Built unit testing infrastructure for previously untested .NET Core backend, implementing 150+ automated tests with Moq/XUnit and creating documentation to aid other engineers in test writing

### Fullstack Engineer I --> Fullstack Engineer II

#### Balto (December 2021 - December 2022)

- Led development of audio-related product from design to production using React and HTML5 Audio, reaching 30,000 minutes of usage within 2 weeks of launch.

- Contributed core components to shared library (React, Redux, Semantic UI, Storybook), improving development velocity across product teams.

- Built reporting platform features for manager call analytics and organizational insights, including paginated backend APIs (FastAPI/Flask) and React dashboards for data discovery.

---

### Education

#### Bachelor of Science in Audio Production, Computer Science minor

Middle Tennessee State University (2019)

# Portfolio

My software engineering portfolio and playground for exploring new technologies.

The repository contains several independent projects that share a common infrastructure, deployment pipeline, and development tooling.

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Firebase Authentication
- Firestore
- Google Maps JavaScript API

## Backend

- Spring Boot 3
- Java 21
- Maven

## Infrastructure

- Google Cloud Run
- Google Artifact Registry
- Terraform
- GitHub Actions
- Docker
- Firebase Emulator Suite
- Google Secret Manager

## Monorepo

- npm Workspaces
- Nx

---

# Repository Layout

```
.
├── api/          Spring Boot API
├── web/          Next.js frontend
├── infra/        Terraform infrastructure
├── docs/         Documentation
└── package.json  Workspace root
```

Additional applications will be added alongside the existing projects as the portfolio grows.

---

# Requirements

- Node.js 24
- npm 11
- Java 21
- Maven (or use the Maven Wrapper)
- Terraform 1.5.7
- Docker Desktop
- Google Cloud SDK

---

# Installation

Clone the repository and install dependencies from the repository root.

```bash
npm ci
```

---

# Local Development

## Start the Spring Boot API

```bash
cd api
./mvnw spring-boot:run
```

## Start the Next.js application

```bash
npm run dev --workspace=web
```

## Firebase Emulator Suite

```bash
firebase emulators:start
```

---

# Useful Commands

Run the web application build:

```bash
npx nx build web
```

Lint the web project:

```bash
npx nx lint web
```

Run web tests:

```bash
npx nx test web
```

Build the production Docker image:

```bash
docker compose build web
```

---

# Deployment

Deployments are fully automated through GitHub Actions.

## Responsibilities

### GitHub Actions

- Run tests
- Build Docker images
- Push images to Artifact Registry
- Deploy new Cloud Run revisions

### Terraform

Terraform is the source of truth for infrastructure, including:

- Cloud Run configuration
- IAM
- Secret Manager
- Artifact Registry
- Cloudflare DNS

Infrastructure changes require approval before being applied.

---

# Secrets

Application secrets are stored in Google Secret Manager.

GitHub Actions authenticates to Google Cloud using Workload Identity Federation instead of long-lived service account keys.

The only remaining GitHub secret is the Firebase service account used to deploy Firestore rules.

---

# Current Projects

## Portfolio Website

The primary portfolio site showcasing projects and experiments.

Current features include:

- Firebase Authentication
- National Parks tracker
- AI-assisted features
- Google Maps integration

Additional portfolio projects will be added to this repository over time.

---

# License

Personal portfolio project.

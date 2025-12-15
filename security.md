Security Overview

This repository powers my personal portfolio site at https://kdilts.net
. The goal of this security setup is to keep the public-facing attack surface small, protect authenticated routes, and prevent common "bypass the CDN" pitfalls, while staying practical for a portfolio project.

Architecture

Frontend: Next.js (App Router) on Cloud Run (web service)

Backend: Spring Boot on Cloud Run (api service)

Auth: Firebase Auth (Google sign-in)

Data: Firestore via client SDK (no custom data APIs)

Edge / DNS: Cloudflare in front of kdilts.net

Canonical domain: kdilts.net (with www → root redirect at Cloudflare)

High-level security model
"Single front door" for real traffic

Public user traffic should enter via Cloudflare → kdilts.net → Cloud Run web service.

Direct access to Cloud Run service URLs (\*.run.app) is treated as non-canonical.

API is not publicly invokable

The Cloud Run API service requires Cloud Run IAM authentication.

Only the web service account has roles/run.invoker on the api service.

The browser never calls the API service URL directly.

App-level authentication still applies

/api/me requires a valid Firebase ID token (verified by the Spring Boot backend).

The Next.js server proxies /app-api/me and forwards the Firebase ID token to the API using X-Firebase-Authorization.

Front doors and bypass prevention
Cloud Run \*.run.app URLs ("two front doors")

Web service: Requests on non-canonical hosts are redirected to https://kdilts.net, and /app-api/\* is blocked on non-canonical hosts.

API service: Requests are rejected by Cloud Run IAM with a fast 403 unless the caller is the web service account.

This prevents bypassing Cloudflare protections (rate limiting, caching, etc.) by calling \*.run.app directly.

Public endpoints
Next.js /app-api/\*

Protected by Cloudflare rate limiting

Non-canonical hosts are blocked for /app-api/\*

Current routes include:

/app-api/me (auth required; proxies to backend)

/app-api/parks/[id]/wikipedia (public; not an open proxy; cached)

Spring Boot /api/\*

Only /api/me is exposed intentionally

Cloud Run IAM restricts invocations to the web service account

Firebase ID token verification required

Rate limiting and abuse controls

Cloudflare rate limiting is applied to /app-api/\* to protect unauthenticated and semi-authenticated entry points.

Cloud Run autoscaling is capped at max instances = 3 per service to contain cost and reduce blast radius during abuse.

Headers and transport security

The site enforces:

HTTPS

HSTS (currently 1 month, includeSubDomains)

X-Content-Type-Options: nosniff

Logging and privacy

Backend logs avoid storing sensitive user identifiers (e.g., emails).

The project is designed to minimize sensitive data exposure; most data access is via Firestore client SDK + Firebase security rules.

CI security checks

tfsec runs in GitHub Actions for Terraform changes to detect common infrastructure security issues.

Note: static analyzers vary in coverage; critical access controls (like Cloud Run IAM invoker policy) are enforced by Terraform configuration and validated via gcloud run services get-iam-policy.

How to verify the current hardening
Verify API is not public

gcloud run services get-iam-policy api ... should not include allUsers for roles/run.invoker.

Direct curl to https://api-\*.run.app/api/me should return 403 quickly (Cloud Run IAM).

Verify "non-canonical host" behavior for web

Requests to https://web-\*.run.app/ redirect to https://kdilts.net/.

Requests to https://web-\*.run.app/app-api/... return 403.

Threat model and scope

This is a portfolio site. The focus is:

Preventing common bypasses and misconfigurations

Keeping authenticated routes protected

Containing cost / abuse blast radius

Out of scope (intentionally) for this project:

Dedicated DDoS mitigation beyond Cloudflare defaults

Google Cloud Armor + external HTTPS load balancer (more complexity than warranted here)

Formal penetration testing

Reporting

If you find a security issue, please open a GitHub issue with reproduction steps (or contact me via the email on the site). Please avoid testing that could degrade availability.

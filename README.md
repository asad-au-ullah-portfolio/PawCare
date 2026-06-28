# 🐾 PawCare — Virtual Vet Consults

> A modern full-stack veterinary telemedicine platform built with **React** and **ASP.NET Core**, enabling pet owners to connect with licensed veterinarians through secure video consultations.

---

## Overview

PawCare is a portfolio project that demonstrates how to build a production-style healthcare platform using modern web technologies.

The application allows pet owners to book consultations, attend secure video appointments, manage pet health records, receive prescriptions, and pay online—all from a single platform.

This project focuses on clean architecture, scalability, security, and cloud-ready development practices.

---

## Features

* 🔐 Secure authentication using JWT and Refresh Tokens
* 👤 Pet owner and veterinarian accounts
* 📅 Instant and scheduled appointments
* 📹 Video consultations with Jitsi Meet
* 📋 Pet health records
* 💊 Digital prescription management
* 💳 Secure online payments with Stripe
* 🤖 AI-assisted symptom triage
* 📊 Logging, monitoring, and distributed tracing

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* React Router
* TanStack Query
* React Hook Form
* Zod
* Material UI
* Axios

### Backend

* .NET 10
* ASP.NET Core Minimal API
* Entity Framework Core
* PostgreSQL
* FluentValidation
* JWT Authentication
* Swagger / OpenAPI

### Infrastructure

* Docker
* GitHub Actions
* Serilog
* Seq
* OpenTelemetry
* Grafana

### Integrations

* Jitsi Meet
* Stripe

---

## Architecture

```text
                React 19 Frontend
                        │
                   HTTPS / REST
                        │
        ASP.NET Core Minimal API (.NET 10)
             │                     │
             │                     │
      PostgreSQL              External Services
                              ├── Jitsi Meet
                              └── Stripe
                        │
        Serilog • OpenTelemetry • Grafana
```

---

## Project Structure

```text
pawcare
│
├── frontend
│   ├── src
│   ├── components
│   ├── features
│   ├── hooks
│   ├── pages
│   └── services
│
├── backend
│   ├── PawCare.Api
│   ├── PawCare.Core
│   ├── PawCare.Infrastructure
│   └── PawCare.Tests
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

* .NET 10 SDK
* Node.js 20+
* PostgreSQL
* Docker (optional)

### Clone the repository

```bash
git clone https://github.com/your-username/pawcare.git

cd pawcare
```

---

### Run the Backend

```bash
cd backend

dotnet restore

dotnet ef database update

dotnet run
```

---

### Run the Frontend

```bash
cd frontend

npm install

npm run dev
```

---

### Using Docker

```bash
docker compose up --build
```

---

## Environment Variables

Backend

```env
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
```

Frontend

```env
VITE_API_BASE_URL=
VITE_STRIPE_PUBLIC_KEY=
```

---

## Roadmap

* [x] Project setup
* [x] Architecture design
* [ ] Authentication
* [ ] User onboarding
* [ ] Appointment scheduling
* [ ] Video consultations
* [ ] Payments
* [ ] Prescriptions
* [ ] Pet health records
* [ ] AI-assisted triage
* [ ] Observability
* [ ] Production deployment

---

## Goals

This project demonstrates practical experience with:

* Full-stack application development
* Modern React development
* ASP.NET Core Minimal APIs
* Entity Framework Core
* PostgreSQL
* Authentication and authorization
* REST API design
* Third-party integrations
* Docker containerization
* CI/CD
* Observability and monitoring

---

## License

Licensed under the MIT License.

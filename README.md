<div align="center">

# 🐾 PawCare

### Production-style Veterinary Appointment Management Platform

**ASP.NET Core &nbsp;•&nbsp; React &nbsp;•&nbsp; TypeScript &nbsp;•&nbsp; PostgreSQL &nbsp;•&nbsp; JWT**

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/badge/Release-v1.0.0--mvp-orange?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)]()

<br/>

> PawCare is a full-stack web application that enables pet owners to register, manage their pets,  
> and book appointments with veterinarians through a clean and responsive interface.  
> Built as a portfolio project to demonstrate production-grade full-stack engineering practices.

<br/>

[Live Demo](#) &nbsp;•&nbsp; [API](#) &nbsp;•&nbsp; [Report Bug](#) &nbsp;•&nbsp; [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Demo Credentials](#-demo-credentials)
- [Project Structure](#-project-structure)
- [MVP Workflow](#-mvp-workflow)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔒 Authentication & Authorization
- JWT-based stateless authentication
- ASP.NET Core Identity
- Role-based authorization (Owner / Vet)
- Secure login & registration
- Protected routes on the frontend

</td>
<td width="50%">

### 🐶 Pet Management
- Add and manage multiple pets
- Full CRUD with owner-scoped access
- Species, breed, age, and weight tracking
- Update and delete with confirmation

</td>
</tr>
<tr>
<td width="50%">

### 🏥 Veterinarian Directory
- Browse available veterinarians
- View specialties and experience
- Consultation fee display
- Clean, filterable listing

</td>
<td width="50%">

### 📅 Appointment Booking
- Book appointments with any veterinarian
- Select from your registered pets
- Future date validation
- Appointment status tracking (Pending / Confirmed / Cancelled)

</td>
</tr>
<tr>
<td width="50%">

### 📊 Dashboard
- Personalized overview on login
- Upcoming appointment summary
- Registered pet summary
- Quick-access navigation

</td>
<td width="50%">

### 🛡 Security
- Passwords hashed via ASP.NET Identity
- JWT expiry and bearer validation
- Server-side ownership checks on all data
- Input validation via FluentValidation

</td>
</tr>
</table>

---

## 🎥 Demo

<!-- walkthrough -->
<video src="https://github.com/user-attachments/assets/dff6146a-b36b-4168-84a7-fd4e2056f51c" width="1280" height="720" controls></video>
---

## 📸 Screenshots

<table>
  <tr>
    <th colspan="6" align="center"><b>Home</b></th>
  </tr>
  <tr>
    <td colspan="6" align="center">
      <img width="100%" alt="home-page" src="https://github.com/user-attachments/assets/137ec144-4ad9-408f-83d0-cadc45d8adfe" />
    </td>
  </tr>

  <tr>
    <th colspan="3" align="center"><b>Register</b></th>
    <th colspan="3" align="center"><b>Login</b></th>
  </tr>
  <tr>
    <td colspan="3">
      <img width="100%" alt="register-page" src="https://github.com/user-attachments/assets/2d51e4c1-7098-4166-a4cc-24d21664502c" />
    </td>
    <td colspan="3">
      <img width="100%" alt="login-page" src="https://github.com/user-attachments/assets/23f1a128-592f-407c-8398-ef86bbe99195" />
    </td>
  </tr>

  <tr>
    <th colspan="2" align="center"><b>Dashboard</b></th>
    <th colspan="2" align="center"><b>My Appointments</b></th>
    <th colspan="2" align="center"><b>Veterinarian Directory</b></th>
  </tr>
  <tr>
    <td colspan="2">
      <img width="100%" alt="dashboard-page" src="https://github.com/user-attachments/assets/ff068a6e-8823-4de8-a834-e4a7013d7ae6" />
    </td>
    <td colspan="2">
      <img width="100%" alt="my-appointments-page" src="https://github.com/user-attachments/assets/b422610c-e2e1-4647-90a3-0cb03d7ba954" />
    </td>
    <td colspan="2">
      <img width="100%" alt="veterinarian-directory-page" src="https://github.com/user-attachments/assets/8ea8301d-cf39-4a71-bd9b-874a59e8c959" />
    </td>
  </tr>

  <tr>
    <th colspan="2" align="center"><b>My Pets</b></th>
    <th colspan="2" align="center"><b>Add Pet</b></th>
    <th colspan="2" align="center"><b>Edit Pet</b></th>
  </tr>
  <tr>
    <td colspan="2">
      <img width="100%" alt="my-pets-page" src="https://github.com/user-attachments/assets/fb12627b-a756-4b7a-beea-fa5b0b928b0c" />
    </td>
    <td colspan="2">
      <img width="100%" alt="add-pet-page" src="https://github.com/user-attachments/assets/f517cb7c-6d64-4326-91af-557044168f1f" />
    </td>
    <td colspan="2">
      <img width="100%" alt="edit-pet-page" src="https://github.com/user-attachments/assets/df19a060-12ab-49af-970d-1b4b3f867fed" />
    </td>
  </tr>
</table>

---

## 🏗 Architecture

```mermaid
flowchart TB

%% =========================
%% CLIENT LAYER
%% =========================

subgraph Client["Client Layer"]
    User["👤 Pet Owner / Veterinarian"]
    React["React 19<br/>TypeScript<br/>Vite<br/>Base UI"]
    User --> React
end

%% =========================
%% API LAYER
%% =========================

React -- HTTPS / REST API<br/>JWT Bearer --> API

subgraph API["ASP.NET Core Web API"]
    Controllers["Controllers"]

    subgraph Services["Application Services"]
        Auth["Authentication Service"]
        Pet["Pet Service"]
        Vet["Veterinarian Service"]
        Appointment["Appointment Service"]
    end

    subgraph Business["Business Rules"]
        Validation["Validation"]
        Authorization["Authorization"]
        Scheduling["Appointment Scheduling"]
    end

    Controllers --> Auth
    Controllers --> Pet
    Controllers --> Vet
    Controllers --> Appointment

    Pet --> Validation
    Vet --> Validation
    Appointment --> Scheduling
    Auth --> Authorization
end

%% =========================
%% DATA ACCESS
%% =========================

subgraph Data["Persistence Layer"]
    EF["Entity Framework Core"]

    SQL[("SQL Server")]

    EF --> SQL
end

Pet --> EF
Vet --> EF
Appointment --> EF
Auth --> EF

%% =========================
%% DATABASE
%% =========================

subgraph Database["Database Schema"]
    Users["AspNetUsers"]
    Roles["AspNetRoles"]
    Owners["PetOwners"]
    Vets["Veterinarians"]
    Pets["Pets"]
    Appointments["Appointments"]
end

SQL --> Users
SQL --> Roles
SQL --> Owners
SQL --> Vets
SQL --> Pets
SQL --> Appointments

%% =========================
%% FUTURE INTEGRATIONS
%% =========================

subgraph Future["External Services (Future Roadmap)"]
    Stripe["Stripe Payments"]
    Jitsi["Jitsi Meet"]
    Email["Email Notifications"]
    Storage["Cloud Storage"]
    Calendar["Calendar Integration"]
    Monitoring["Logging & Monitoring"]
end

Appointment -. Future .-> Stripe
Appointment -. Future .-> Jitsi
Auth -. Future .-> Email
Pet -. Future .-> Storage
Appointment -. Future .-> Calendar
API -. Telemetry .-> Monitoring
```

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| TanStack Query | Server state & caching |
| React Hook Form + Zod | Form management & validation |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Component library |
| Axios | HTTP client with JWT interceptor |
| Sonner | Toast notifications |

### Backend

| Technology | Purpose |
|---|---|
| ASP.NET Core (.NET 10) | Web API (Minimal APIs) |
| ASP.NET Core Identity | User management & password hashing |
| Entity Framework Core | ORM |
| Npgsql | PostgreSQL driver |
| JWT Bearer Auth | Stateless authentication |
| FluentValidation | Request input validation |

### Development Tools

- Visual Studio 2022
- Visual Studio Code
- Git & GitHub

---

## 🚀 Getting Started

### Prerequisites

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- [PostgreSQL 16+](https://www.postgresql.org/download/)
- Git

---

### Clone the repository

```bash
git clone https://github.com/asad-au-ullah-portfolio/PawCare.git
cd PawCare
```

---

### Backend

```bash
cd backend

dotnet restore

dotnet ef database update

dotnet run
```

API will be available at:

```
https://localhost:7228
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Application will be available at:

```
http://localhost:5173
```

---

## ⚙ Configuration

Update `appsettings.json` with your values:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=PawCareDb;Username=your_user;Password=your_password"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY",
    "Issuer": "PawCareApi",
    "Audience": "PawCareClient",
    "ExpiryMinutes": 60
  }
}
```

---

## 📂 Project Structure

```
PawCare/
│
├── backend/
│   ├── Features/
│   │   ├── Auth/
│   │   ├── Pets/
│   │   ├── Appointments/
│   │   └── Veterinarians/
│   ├── Entities/
│   ├── Persistence/
│   └── Migrations/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── lib/
│   └── public/
│
└── README.md
```

---

## 📌 MVP Workflow

The current MVP supports the complete end-to-end user journey:

```
Register
    ↓
Login
    ↓
Dashboard
    ↓
Add Pet
    ↓
Browse Veterinarians
    ↓
Book Appointment
    ↓
View My Appointments
```

---

## 🛣 Roadmap

### v1.1 — Infrastructure
- [ ] Docker & Docker Compose
- [ ] Cloud deployment (Vercel + Render)
- [ ] CI/CD with GitHub Actions
- [ ] Structured logging (Serilog + Seq)

### v1.2 — Quality
- [ ] Integration tests
- [ ] OpenTelemetry + Grafana
- [ ] Health checks & response caching
- [ ] API documentation (Swagger)

### v2.0 — Features
- [ ] Email notifications & appointment reminders
- [ ] Online payments (Stripe)
- [ ] Real-time video consultations (Jitsi)
- [ ] Medical records & e-prescriptions
- [ ] Reviews & ratings
- [ ] Admin dashboard

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Asadullah Ehsan**

- LinkedIn: *https://www.linkedin.com/in/asadullahehsan/*
- GitHub: [asad-au-ullah-portfolio](https://github.com/asad-au-ullah-portfolio)

---

<div align="center">

If you found this project useful, consider giving it a ⭐

</div>
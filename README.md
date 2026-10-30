<div align="center">

<h1>LOKSEVA MITRA</h1>

<h3>AI-Assisted Government Scheme Discovery &amp; Citizen Guidance</h3>

<p><strong>Discover schemes. Understand eligibility. Prepare documents. Navigate applications.</strong></p>

<p>
  <a href="https://github.com/ImmrAD/lokseva-mitra"><img src="https://img.shields.io/badge/GitHub-Project_Repository-155CA6?style=for-the-badge&logo=github&logoColor=white" alt="Project repository" /></a>
  <img src="https://img.shields.io/badge/Next.js-16.2.1-123F70?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2.4-1769AA?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<a href="#project-overview">Overview</a> · <a href="#system-architecture">Architecture</a> · <a href="#end-to-end-user-journey">User Journey</a> · <a href="#key-features">Features</a> · <a href="#technology-stack">Tech Stack</a> · <a href="#getting-started">Setup</a> · <a href="#team-and-contact">Contact</a>

</div>

---

## Project Overview

**Lokseva Mitra (लोकसेवा मित्र)** is a full-stack platform focused on making Indian government welfare schemes easier to discover, understand, and navigate. It connects searchable scheme information with eligibility guidance, document preparation, application instructions, and a multilingual AI chat experience.

Instead of sending users through disconnected information sources, the platform presents a **connected journey from discovery to informed next steps**.

| Real-world challenge | Lokseva Mitra's approach |
|:--|:--|
| Schemes are difficult to discover. | Searchable, category-based scheme explorer. |
| Eligibility rules can be confusing. | Guided criteria-based assessment. |
| Required documents are not always clear. | Checklist with required/optional indicators and progress. |
| Application procedures take time to understand. | Guided steps, timeline, and frequently asked questions. |
| Language creates barriers. | English, Hindi, and Marathi chat experience. |

### The product thinking

The key design decision is to combine **structured workflows** with **conversational guidance**. Users can search, compare requirements, review checklists, and follow next steps without depending entirely on chat responses.

---

## System Architecture

### High-level application architecture

```mermaid
flowchart TB
    USER["CITIZEN / ADMINISTRATOR"] --> WEB["NEXT.JS + REACT WEB APP"]

    subgraph FRONTEND["01  |  FRONTEND EXPERIENCE"]
      direction LR
      ACCOUNT["Account & Dashboard"]
      SCHEMES["Scheme & Eligibility"]
      GUIDE["Documents & Application Guide"]
      CHAT["Multilingual AI Chat"]
    end

    WEB --> ACCOUNT
    WEB --> SCHEMES
    WEB --> GUIDE
    WEB --> CHAT

    subgraph HANDLERS["02  |  NEXT.JS API HANDLERS"]
      direction LR
      AUTH["Register / Login / Verify"]
      CHATAPI["Chat Endpoint"]
    end

    ACCOUNT --> AUTH
    CHAT --> CHATAPI

    subgraph SERVICES["03  |  DATA & EXTERNAL SERVICES"]
      direction LR
      DB["MongoDB"]
      MAIL["Nodemailer"]
      MODEL["Configured AI Provider"]
    end

    AUTH --> DB
    AUTH --> MAIL
    CHATAPI --> MODEL

    classDef entry fill:#071A30,stroke:#3E88C8,stroke-width:3px,color:#FFFFFF;
    classDef interface fill:#124F87,stroke:#69B2F1,stroke-width:2px,color:#FFFFFF;
    classDef handler fill:#175F98,stroke:#7BC5F5,stroke-width:2px,color:#FFFFFF;
    classDef integration fill:#123B63,stroke:#5DA6D8,stroke-width:2px,color:#FFFFFF;
    class USER,WEB entry;
    class ACCOUNT,SCHEMES,GUIDE,CHAT interface;
    class AUTH,CHATAPI handler;
    class DB,MAIL,MODEL integration;
    style FRONTEND fill:#0A2542,stroke:#3B83BF,stroke-width:2px,color:#FFFFFF
    style HANDLERS fill:#0A2542,stroke:#3B83BF,stroke-width:2px,color:#FFFFFF
    style SERVICES fill:#0A2542,stroke:#3B83BF,stroke-width:2px,color:#FFFFFF
    linkStyle default stroke:#3179B7,stroke-width:2px
```

**How to read this diagram:**

1. **Frontend experience:** Users interact with account pages, the scheme and eligibility modules, document/application guidance, and AI chat.
2. **Application layer:** Next.js handles the documented authentication and chat API endpoints.
3. **Connected services:** Authentication uses MongoDB and Nodemailer; chat connects to the AI provider configured for the project.

Scheme discovery, eligibility, documents, and application guidance are shown as **application modules**, not as separate external APIs. Their exact data sources and server-side behavior depend on the current implementation.

### Component responsibility map

| Component | Role in the system | Documented route / integration |
|:--|:--|:--|
| **Account & Dashboard** | Registration, login, and a central entry point for users. | `/auth/signup`, `/auth/login`, `/dashboard` |
| **Scheme Discovery** | Browse and filter schemes and open scheme details. | `/schemes` |
| **Eligibility Checker** | Collect relevant details and present criteria-based guidance. | `/eligibility` |
| **Document Guidance** | Show required documents and preparation progress. | `/documents` |
| **Application Guide** | Explain steps, timelines, and frequently asked questions. | `/guide` |
| **Multilingual AI Chat** | Provide a conversational assistance interface. | `/chat`, `/api/chat` |
| **Admin Dashboard** | Display scheme, user, and application management views. | `/admin` |
| **Authentication API** | Process registration, login, and email verification. | `/api/auth/*` |
| **Database & Email** | Store user records and send verification emails. | MongoDB, Nodemailer |

---

## End-to-End User Journey

### From first visit to application readiness

```mermaid
flowchart TB
    START["OPEN LOKSEVA MITRA"]
    START --> NEW["NEW USER: SIGN UP"]
    START --> RETURN["EXISTING USER"]
    NEW --> VERIFY["VERIFY EMAIL"]
    VERIFY --> ACCESS["LOG IN"]
    RETURN --> ACCESS
    ACCESS --> DASH["USER DASHBOARD"]
    DASH --> DISCOVER["1. DISCOVER SCHEMES"]
    DISCOVER --> ELIGIBLE["2. CHECK ELIGIBILITY"]
    ELIGIBLE --> DOCUMENTS["3. PREPARE DOCUMENTS"]
    DOCUMENTS --> STEPS["4. FOLLOW APPLICATION GUIDE"]
    DASH --> ASSIST["OPTIONAL: ASK AI ASSISTANT"]

    classDef entry fill:#071A30,stroke:#438CC9,stroke-width:3px,color:#FFFFFF;
    classDef account fill:#124F87,stroke:#66B7F1,stroke-width:2px,color:#FFFFFF;
    classDef journey fill:#17659E,stroke:#79C1F0,stroke-width:2px,color:#FFFFFF;
    classDef optional fill:#164C77,stroke:#4C9ACF,stroke-width:2px,color:#FFFFFF;
    class START,DASH entry;
    class NEW,RETURN,VERIFY,ACCESS account;
    class DISCOVER,ELIGIBLE,DOCUMENTS,STEPS journey;
    class ASSIST optional;
    linkStyle default stroke:#3179B7,stroke-width:2px
```

**Two paths, one dashboard:** New users register and verify their email; existing users can log in directly. From the dashboard, citizens can follow the discovery-to-guidance sequence or open the AI assistant independently. The application guide supports the next steps; it does not submit government applications automatically.

### Workflow 01 — Registration and verification

```text
Create Account
    |
    v
Validate Details and Hash Password
    |
    v
Persist User in MongoDB
    |
    v
Generate Verification Token
    |
    v
Send Email via Nodemailer
    |
    v
Verify Email -> Login -> Dashboard
```

The implementation notes describe PBKDF2-SHA512 password hashing and time-limited verification tokens.

### Workflow 02 — Scheme discovery and application guidance

```text
Browse / Search Schemes
        |
        v
Filter by Category and View Details
        |
        v
Provide Eligibility Information
        |
        v
Review Criteria and Next Steps
        |
        v
Track Document Checklist
        |
        v
Follow Application Instructions
```

This is an informational support workflow; official authorities make final eligibility decisions and process applications.

### Workflow 03 — AI assistance

```mermaid
sequenceDiagram
    participant U as User
    participant F as Chat Interface
    participant B as Next.js Chat API
    participant AI as Configured AI Service
    U->>F: Ask in English / Hindi / Marathi
    F->>B: Submit message
    B->>AI: Process question
    AI-->>B: Return answer
    B-->>F: Respond to chat
    F-->>U: Display assistant reply
```

The documented chat module also describes conversation history and PDF export. The diagram presents the high-level interaction without assuming an undocumented retrieval technique.

---

## Key Features

| Module | What users can do |
|:--|:--|
| **Multilingual AI Chat** | Ask questions in English, Hindi, or Marathi; review conversations and export as PDF. |
| **Scheme Explorer** | Search, filter, and inspect government schemes. |
| **Eligibility Checker** | Enter profile details and review eligibility criteria. |
| **Document Guidance** | Identify required documents and follow a progress checklist. |
| **Application Guide** | Navigate a step-by-step timeline and FAQs. |
| **Account System** | Register, verify email, log in, and access a dashboard. |
| **Admin Dashboard** | View scheme, user, and application management screens. |
| **Responsive Design** | Use the interface across mobile, tablet, and desktop. |

<details>
<summary><strong>Explore account and authentication capabilities</strong></summary>

The project documentation describes registration, credential validation, password hashing, MongoDB user records, verification emails, and dashboard access. Google OAuth is described as ready for configuration.

</details>

<details>
<summary><strong>Explore scheme discovery and user guidance</strong></summary>

The scheme module offers category-based browsing, filters, and details. The eligibility module evaluates provided inputs against displayed criteria, while the document and application-guide modules convert the findings into practical preparation tasks.

</details>

<details>
<summary><strong>Explore AI chat and PDF capabilities</strong></summary>

The chat experience is designed for English, Hindi, and Marathi interaction. The implementation notes describe conversation archives and PDF export. Installed AI-related packages include LangChain, LangGraph, Google GenAI, and Google Vertex AI libraries.

</details>

---

## Technology Stack

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.1-104F8E?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-176FB2?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-087EA4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-Database-1777A5?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/LangChain-AI_Tooling-135DAB?style=flat-square" alt="LangChain" />
</div>

| Category | Tools and libraries |
|:--|:--|
| Frontend | Next.js 16.2.1, React 19.2.4, TypeScript |
| UI / Styling | Tailwind CSS 4, Framer Motion |
| Backend | Next.js API handlers |
| Database | MongoDB |
| Identity / Email | Authentication utilities, Nodemailer; NextAuth dependency |
| AI ecosystem | LangChain Core, Community, LangGraph, Google GenAI, Google Vertex AI packages |
| Other libraries | Supabase JS, jsPDF, React Markdown, Remark GFM, Cheerio, Puppeteer |
| Tooling | npm, ESLint, TypeScript |

**Design system:** A newspaper-inspired interface with serif headlines, monospace labels, bold dividers, structured grids, high-contrast colors, and responsive layouts.

---

## Project Structure

The implementation documents describe this module layout:

```text
lokseva-mitra/
|
|-- app/
|   |-- page.tsx              Landing page
|   |-- auth/                 Login and signup
|   |-- dashboard/            User dashboard
|   |-- chat/                 AI assistant
|   |-- schemes/              Scheme discovery
|   |-- eligibility/          Eligibility checker
|   |-- documents/            Document requirements
|   |-- guide/                Application guidance
|   |-- admin/                Admin dashboard
|   +-- api/                  Server endpoints
|
|-- src/lib/
|   |-- mongodb.ts            Database helpers
|   |-- nodemailer.ts         Email service
|   |-- auth.ts               Auth utilities
|   +-- types/                Shared interfaces
|
|-- package.json
|-- package-lock.json
|-- next.config.ts
|-- tsconfig.json
|-- QUICK_START.md
|-- IMPLEMENTATION.md
`-- README.md
```

<details>
<summary><strong>Expand the documented routes and API overview</strong></summary>

| Route | Purpose |
|:--|:--|
| `/` | Landing page |
| `/auth/signup` | Registration |
| `/auth/login` | Login |
| `/dashboard` | User dashboard |
| `/chat` | AI assistant |
| `/schemes` | Scheme discovery |
| `/eligibility` | Eligibility checker |
| `/documents` | Document guidance |
| `/guide` | Application guide |
| `/admin` | Admin interface |

| Method | Endpoint | Purpose |
|:--|:--|:--|
| `POST` | `/api/auth/register` | Register an account |
| `POST` | `/api/auth/login` | Login |
| `GET / POST` | `/api/auth/verify` | Verify email |
| `POST` | `/api/chat` | AI chat |
| `GET` | `/api/news` | News ticker |

Keep this documented API list aligned with current route handlers as the project evolves.

</details>

---

## Getting Started

### Prerequisites

- Git
- Compatible Node.js LTS and npm
- MongoDB connection details
- Email credentials for verification
- API credentials for whichever external AI/data integrations are enabled

### 1. Clone

```bash
git clone https://github.com/ImmrAD/lokseva-mitra.git
cd lokseva-mitra
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure the environment

Create `.env.local` in the project root:

```dotenv
MONGODB_URI=your_mongodb_connection_string
NODEMAILER_SERVICE=gmail
NODEMAILER_USER=your_email@example.com
NODEMAILER_PASS=your_email_app_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
SALT_SECRET=replace_with_a_long_random_secret
```

The accompanying implementation guide also mentions `GOOGLE_API_KEY`, `OGD_API_KEY`, and `SUPABASE_URL`. Configure them if the enabled features require those integrations.

> [!IMPORTANT]
> Never commit `.env.local`, database credentials, email passwords, cloud keys, or other secrets.

### 4. Run locally

```bash
npm run dev
```

Visit **http://localhost:3000**.

| Command | Purpose |
|:--|:--|
| `npm run dev` | Start development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Build application |
| `npm run start` | Serve a completed production build |

<details>
<summary><strong>Expand the local demo checklist</strong></summary>

- [ ] Open the landing page.
- [ ] Register and verify an account.
- [ ] Log in and explore the dashboard.
- [ ] Search and inspect schemes.
- [ ] Walk through an eligibility assessment.
- [ ] Review the document checklist and guide.
- [ ] Try multilingual chat with the required services configured.
- [ ] Check responsive behavior on a mobile screen.

</details>

---

## Engineering Considerations and Roadmap

The product spans several meaningful engineering concerns: **account security**, **reliable public information**, **AI response quality**, **responsive UX**, and **multi-stage user guidance**.

The implementation notes identify production-hardening work including protected admin authorization, session management, secure cookies, rate limiting, and HTTPS. The following are sensible next milestones:

- [ ] Validate and clearly attribute all government scheme sources.
- [ ] Add automated checks for authentication and eligibility workflows.
- [ ] Harden access control, session security, and API protections.
- [ ] Add last-updated information and official application links.
- [ ] Improve multilingual accessibility and usability testing.
- [ ] Include verified screenshots and a live demo link.

---

## Team and Contact

**Repository owner:** [ImmrAD](https://github.com/ImmrAD)

**Collaborator:** [Prathamesh Thakare](https://github.com/thakare18) · [LinkedIn](https://www.linkedin.com/in/prathameshv-thakare/)

**Contact email (Prathamesh):** [prathameshthakare9677@gmail.com](mailto:prathameshthakare9677@gmail.com)

**Project source:** [ImmrAD/lokseva-mitra](https://github.com/ImmrAD/lokseva-mitra)

For technical discussions, collaboration, and career opportunities, connect through the linked profiles.

---

<div align="center">

<h3>Lokseva Mitra</h3>

<p><strong>Making public welfare information easier to discover, understand, and act on.</strong></p>

</div>

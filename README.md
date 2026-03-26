# MetaCall FaaS Dashboard

**A modern, local developer dashboard for the [MetaCall FaaS](https://github.com/metacall/faas) platform.**

Deploy, inspect, invoke, and observe your polyglot serverless functions locally—all from a clean, intuitive web interface that runs right alongside your local FaaS server.

## Preview

**Login**
<img width="1919" height="934" alt="image" src="https://github.com/user-attachments/assets/099ce821-7d31-4f41-a283-a27a95097df7" />

**Signup**
<img width="1919" height="934" alt="image" src="https://github.com/user-attachments/assets/943ce8be-c98b-417c-85cf-4ff53a523377" />

**Dashboard**
<img width="1919" height="934" alt="image" src="https://github.com/user-attachments/assets/088e2e09-eddc-4bb2-9505-62a9c551eb78" />

**New Deploy Page**
<img width="1919" height="934" alt="image" src="https://github.com/user-attachments/assets/a8779ae6-5dc9-4a05-888d-0c0eeeda8e07" />

*Small Screen*
<img width="1919" height="934" alt="image" src="https://github.com/user-attachments/assets/570e8f6f-82d5-4b90-8dd6-b8543815deda" />


**Zip Edit**
<img width="1919" height="934" alt="image" src="https://github.com/user-attachments/assets/46c36422-cc3a-4f7e-b372-9816b7f6f9bf" />


And others...

## Features

- **Live Dashboard**: Real-time server status indicator, deployment summaries, and at-a-glance metrics.
- **Deploy Hub**: Flexible deployment options including Drag-and-Drop ZIP uploads or direct Git repository cloning.
- **Package Wizard**: Step-by-step guidance from package selection to validation and final deployment.
- **Repository Deploy**: One-click deployments directly from your GitHub or GitLab branches.
- **Deployment Details**: Deep dive into active deployments with status badges, exposed function browsing, and an integrated tester.
- **Live Invocation**: Invoke your polyglot functions directly from the browser with JSON arguments and instantly see the results.
- **Logs Viewer**: Real-time log streaming per deployment with auto-scrolling and easy copy functionality.
- **Configuration**: Easily manage server URLs, authentication tokens, and environment settings.

---

## Tech Stack

Built with a modern, high-performance web stack to ensure a seamless developer experience:

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React |
| **Language** | TypeScript |
| **Build Tool / Bundler** | Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router |
| **Icons** | Lucide React |
| **API Client** | Axios |
| **State & Auth** | JWT via `localStorage` |

---

## Getting Started

Follow these steps to get your local FaaS dashboard up and running.

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: `≥ 20.1.0`
- **npm**: `≥ 10.0.0`
- **Backend Service**: A running instance of the [MetaCall FaaS Server](https://github.com/metacall/faas) (usually at `http://localhost:9000`).

### 1. Install Dependencies

Navigate to the UI project directory and install the required npm packages:

```bash
cd faas_dashboard
npm install
```

### 2. Configure the Environment

Copy the example environment file to create your local configuration:

```bash
cp .env.example .env.local
```

Open `.env.local` and customize your settings if needed:

```env
# URL of your local MetaCall FaaS server
VITE_FAAS_URL=http://localhost:9000

# Optional: Set a JWT token to bypass the login screen during development
VITE_FAAS_TOKEN=<your-jwt-token>
```

### 3. Start the Development Server

Launch the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

> **Note**: The Dashboard will be accessible at **[http://localhost:5173](http://localhost:5173)**. Make sure your local FaaS backend is running independently.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR. |
| `npm run build` | Type-checks the codebase and creates a production build in `dist/`. |
| `npm run lint` | Lints the codebase using ESLint to enforce code quality. |
| `npm run format` | Formats all source files using Prettier. |
| `npm run test` | Runs the unit test suite via Vitest. |
| `npm run preview` | Serves the production build locally for testing. |

---

## Project Structure

```text
faas-dashboard/
├── public/              # Static assets (favicons, etc.)
├── src/
│   ├── api/             # Typed Axios API client for all FaaS endpoints
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Core layout components (AppShell, Navbar, Sidebar)
│   │   └── ui/          # Generic UI elements (Buttons, Cards, Badges, Modals)
│   ├── hooks/           # Custom React hooks (e.g., useServerStatus)
│   ├── pages/           # Application route components
│   ├── types/           # Global TypeScript type definitions
│   ├── App.tsx          # Main application router and auth guards
│   └── main.tsx         # React application entry point
├── .env.example         # Template for environment variables
├── eslint.config.js     # ESLint configuration
├── vite.config.ts       # Vite bundler configuration
└── package.json         # Project metadata and dependency tree
```

---

## Authentication & Connectivity

- **JWT Tokens:** The dashboard uses standard Bearer JWT tokens for authentication. On your first visit, you will be redirected to the `/login` route. Tokens are saved securely in your browser's `localStorage` under the key `faas_token`.
- **Backend API:** All network requests are routed through `src/api/client.ts`. The base API URL is injected at build time via `VITE_FAAS_URL`, and the client automatically attaches the active JWT to all outgoing requests.

---

## To-Do
### What We Have Done

- **Foundation Shell**: App routes, layout rendering, and design tokens applied.
- **UI Primitives**: All shared components (buttons, cards, badges, etc.) are polished and functional.
- **Dashboard Page**: Live server, active deployments, and function stats rendered directly from the backend.
- **Deployments Page**: List of deployments with search, filtering, and delete with confirmation working.
- **Deploy Wizard (mostly done)**: ZIP upload and repository cloning flows are connected.
- **Deployment Detail**: Metadata display, function list extracting, inline tester, and improved error states.
- **Logs & Settings**: Real-time logs endpoint is implemented along with settings persistence.

### Not Done Yet

#### Backend & API Integration
- [ ] **API Integration (Highest Priority)**: Connect `src/api/client.ts` properly using `VITE_FAAS_TOKEN`.
- [ ] **Backend Integration - Hooks**: Wire up `useDeployments`, `useLogs`, `useServerStatus` to actual `@metacall/protocol` client (replace mocks).
- [ ] **Dashboard Page**: Aggregate real data from the FaaS server to replace mock dashboard statistics.
- [ ] **Deployments Page**: Connect the list, search, and delete functionalities to actual backend endpoints.
- [ ] **Backend Refactoring**: Resolve remaining protocol-type TODOs in backend controllers.

#### UI & UX Polish
- [ ] **Inline File Creation**: Implement the "MC-0" file creation tab in the Deploy Wizard for text file creation.
- [ ] **Dynamic Zip Rebuilding**: Implement logic in `DeployWizardPage` to generate `metacall.json` dynamically and inject it into the Zip before upload.
- [ ] **Deployment Confirmation**: Add a success confirmation page or toast notification after wizard finishes deploying.
- [ ] **QA & Polish**: End-to-end smoke tests, finishing error state handling, and final UI transitions/hover polish.

#### Documentation
- [ ] **Documentation**: Capture application screenshots and finish final PR documentation.

#### User Plan (Pending Workflow & Testing)
- [ ] **Plan Testing**: Test the system with the user plan functionality.
- [ ] **Plan Functions Integration**: Implement actual functions and workflows of the user plan (billing and checkout flows remain mock-only).


---

## License

None

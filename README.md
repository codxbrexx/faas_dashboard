# MetaCall FaaS Dashboard

**A modern, local developer dashboard for the [MetaCall FaaS](https://github.com/metacall/faas) platform.**

Deploy, inspect, invoke, and observe your polyglot serverless functions locally—all from a clean, intuitive web interface that runs right alongside your local FaaS server.

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

- **Frontend Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool / Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/)
- **State & Auth**: JWT via `localStorage`

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
Dashboard/
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

## Contributing

We welcome contributions! Please review the [CONTRIBUTING.md](../CONTRIBUTING.md) in the root directory for details on our code of conduct, branching conventions, and the pull request submission process.

---

## License

None
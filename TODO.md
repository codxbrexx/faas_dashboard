# MetaCall FaaS Dashboard - TODO List

## What We Have Done

- **Foundation Shell**: App routes, layout rendering, and design tokens applied.
- **UI Primitives**: All shared components (buttons, cards, badges, etc.) are polished and functional.
- **Dashboard Page**: Live server, active deployments, and function stats rendered directly from the backend.
- **Deployments Page**: List of deployments with search, filtering, and delete with confirmation working.
- **Deploy Wizard (mostly done)**: ZIP upload and repository cloning flows are connected.
- **Deployment Detail**: Metadata display, function list extracting, inline tester, and improved error states.
- **Logs & Settings**: Real-time logs endpoint is implemented along with settings persistence.

---

## Not Done Yet
### Backend & API Integration
- [ ] **API Integration (Highest Priority)**: Connect `src/api/client.ts` properly using `VITE_FAAS_TOKEN`.
- [ ] **Backend Integration - Hooks**: Wire up `useDeployments`, `useLogs`, `useServerStatus` to actual `@metacall/protocol` client (replace mocks).
- [ ] **Dashboard Page**: Aggregate real data from the FaaS server to replace mock dashboard statistics.
- [ ] **Deployments Page**: Connect the list, search, and delete functionalities to actual backend endpoints.
- [ ] **Backend Refactoring**: Resolve remaining protocol-type TODOs in backend controllers.

### UI & UX Polish
- [ ] **Inline File Creation**: Implement the "MC-0" file creation tab in the Deploy Wizard for text file creation.
- [ ] **Dynamic Zip Rebuilding**: Implement logic in `DeployWizardPage` to generate `metacall.json` dynamically and inject it into the Zip before upload.
- [ ] **Deployment Confirmation**: Add a success confirmation page or toast notification after wizard finishes deploying.
- [ ] **QA & Polish**: End-to-end smoke tests, finishing error state handling, and final UI transitions/hover polish.

### Documentation
- [ ] **Documentation**: Capture application screenshots and finish final PR documentation.

### User Plan (Pending Workflow & Testing)
- [ ] **Plan Testing**: Test the system with the user plan functionality.
- [ ] **Plan Functions Integration**: Implement actual functions and workflows of the user plan (billing and checkout flows remain mock-only).

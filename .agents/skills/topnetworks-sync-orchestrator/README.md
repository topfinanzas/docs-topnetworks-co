# TopNetworks Sync Orchestrator

This module provides the second phase of the TopNetworks Inc. deployment strategy. It is responsible for orchestrating the remote execution of synchronization scripts on a GCP-hosted Ubuntu instance. It ensures idempotent deployment cycles, secure `gcloud` execution, and real-time output monitoring via standard streams.

## Features

- **Secure Execution**: Leverages `gcloud compute ssh` avoiding any hardcoded credentials. It requires an active `gcloud` authenticated session.
- **Idempotent Deployment**: Validates successful exit codes from remote scripts and manages state accurately.
- **Real-Time Observability**: Streams `stdout` and `stderr` directly from the remote execution back to the local node process.
- **Type-Safe**: Written in TypeScript with clear interfaces.
- **Testable**: Fully covered by Jest tests mocking the remote processes.

## Requirements

- Node.js (>= 18)
- A valid `gcloud` CLI installation authenticated with access to the target project.
- The target instance must be a GCP-hosted Ubuntu environment.

## Usage

```typescript
import { SyncOrchestrator } from "./src/SyncOrchestrator";

const orchestrator = new SyncOrchestrator({
  instanceName: "topfinanzas-com",
  zone: "us-central1-a",
  projectId: "absolute-brook-452020-d5",
  remotePath: "/var/www/html",
});

orchestrator
  .executeRemoteDeployment("deploy.sh")
  .then(() => {
    console.log("Deployment successful!");
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
  });
```

## Running Tests

To execute the mocked unit test suite:

```bash
npm install
npm test
```

## Security

This module follows the `api-security-hardening` standards by delegating authentication to the `gcloud` CLI environment. No secrets, keys, or passwords are kept in code or environment variables directly accessed by this skill.

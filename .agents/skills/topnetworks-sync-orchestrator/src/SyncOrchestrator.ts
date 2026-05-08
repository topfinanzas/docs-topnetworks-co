import { spawn, ChildProcess } from "child_process";

export interface SyncOrchestratorConfig {
  instanceName: string;
  zone: string;
  projectId: string;
  remotePath: string;
}

export class SyncOrchestrator {
  private config: SyncOrchestratorConfig;

  constructor(config: SyncOrchestratorConfig) {
    this.config = config;
  }

  /**
   * Executes the deployment script on the remote host via gcloud compute ssh.
   * @param scriptName The name of the script to execute in the remotePath. Defaults to 'deploy.sh'.
   * @returns Promise that resolves when the execution is successful, or rejects on failure.
   */
  public async executeRemoteDeployment(
    scriptName: string = "deploy.sh",
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const { instanceName, zone, projectId, remotePath } = this.config;

      const sshCommand = `cd ${remotePath} && ./${scriptName}`;

      const args = [
        "compute",
        "ssh",
        instanceName,
        "--zone",
        zone,
        "--project",
        projectId,
        "--command",
        sshCommand,
        "--quiet",
      ];

      console.log(
        `[SyncOrchestrator] Starting remote execution on ${instanceName} (${projectId})...`,
      );

      const child: ChildProcess = spawn("gcloud", args, {
        stdio: ["inherit", "pipe", "pipe"],
      });

      let errorOutput = "";

      child.stdout?.on("data", (data) => {
        const text = data.toString();
        process.stdout.write(`[REMOTE] ${text}`);
      });

      child.stderr?.on("data", (data) => {
        const text = data.toString();
        errorOutput += text;
        process.stderr.write(`[REMOTE ERR] ${text}`);
      });

      child.on("close", (code) => {
        if (code === 0) {
          console.log(
            `[SyncOrchestrator] Deployment completed successfully on ${instanceName}.`,
          );
          resolve();
        } else {
          console.error(
            `[SyncOrchestrator] Deployment failed with exit code ${code} on ${instanceName}.`,
          );
          reject(
            new Error(
              `Remote execution failed with exit code ${code}. Error output: ${errorOutput}`,
            ),
          );
        }
      });

      child.on("error", (err) => {
        console.error(
          `[SyncOrchestrator] Failed to spawn gcloud process: ${err.message}`,
        );
        reject(err);
      });
    });
  }
}

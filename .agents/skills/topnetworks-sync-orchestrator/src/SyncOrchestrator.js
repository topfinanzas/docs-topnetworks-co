"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncOrchestrator = void 0;
const child_process_1 = require("child_process");
class SyncOrchestrator {
  config;
  constructor(config) {
    this.config = config;
  }
  /**
   * Executes the deployment script on the remote host via gcloud compute ssh.
   * @param scriptName The name of the script to execute in the remotePath. Defaults to 'deploy.sh'.
   * @returns Promise that resolves when the execution is successful, or rejects on failure.
   */
  async executeRemoteDeployment(scriptName = "deploy.sh") {
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
      const child = (0, child_process_1.spawn)("gcloud", args, {
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
exports.SyncOrchestrator = SyncOrchestrator;
//# sourceMappingURL=SyncOrchestrator.js.map

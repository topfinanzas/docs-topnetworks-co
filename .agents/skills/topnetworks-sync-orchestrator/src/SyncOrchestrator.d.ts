export interface SyncOrchestratorConfig {
    instanceName: string;
    zone: string;
    projectId: string;
    remotePath: string;
}
export declare class SyncOrchestrator {
    private config;
    constructor(config: SyncOrchestratorConfig);
    /**
     * Executes the deployment script on the remote host via gcloud compute ssh.
     * @param scriptName The name of the script to execute in the remotePath. Defaults to 'deploy.sh'.
     * @returns Promise that resolves when the execution is successful, or rejects on failure.
     */
    executeRemoteDeployment(scriptName?: string): Promise<void>;
}
//# sourceMappingURL=SyncOrchestrator.d.ts.map
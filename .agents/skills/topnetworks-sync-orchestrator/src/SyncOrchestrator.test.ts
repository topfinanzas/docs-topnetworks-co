import { spawn } from 'child_process';
import { SyncOrchestrator } from './SyncOrchestrator';
import { EventEmitter } from 'events';

jest.mock('child_process');

describe('SyncOrchestrator', () => {
    const mockedSpawn = spawn as jest.MockedFunction<typeof spawn>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully execute remote deployment', async () => {
        const config = {
            instanceName: 'test-instance',
            zone: 'us-central1-a',
            projectId: 'absolute-brook-452020-d5',
            remotePath: '/var/www/html'
        };

        const mockChildProcess = new EventEmitter() as any;
        mockChildProcess.stdout = new EventEmitter();
        mockChildProcess.stderr = new EventEmitter();
        mockedSpawn.mockReturnValue(mockChildProcess);

        const orchestrator = new SyncOrchestrator(config);
        
        // Execute the function but don't await immediately, trigger close event first
        const promise = orchestrator.executeRemoteDeployment('deploy.sh');

        // Emulate successful execution
        setTimeout(() => mockChildProcess.emit('close', 0), 10);

        await expect(promise).resolves.toBeUndefined();

        expect(mockedSpawn).toHaveBeenCalledWith(
            'gcloud',
            [
                'compute',
                'ssh',
                'test-instance',
                '--zone',
                'us-central1-a',
                '--project',
                'absolute-brook-452020-d5',
                '--command',
                'cd /var/www/html && ./deploy.sh',
                '--quiet'
            ],
            { stdio: ['inherit', 'pipe', 'pipe'] }
        );
    });

    it('should reject when execution fails', async () => {
        const config = {
            instanceName: 'test-instance',
            zone: 'us-central1-a',
            projectId: 'absolute-brook-452020-d5',
            remotePath: '/var/www/html'
        };

        const mockChildProcess = new EventEmitter() as any;
        mockChildProcess.stdout = new EventEmitter();
        mockChildProcess.stderr = new EventEmitter();
        mockedSpawn.mockReturnValue(mockChildProcess);

        const orchestrator = new SyncOrchestrator(config);
        
        const promise = orchestrator.executeRemoteDeployment('deploy.sh');

        // Emulate some error output and a non-zero exit code
        setTimeout(() => {
            mockChildProcess.stderr.emit('data', Buffer.from('permission denied'));
            mockChildProcess.emit('close', 1);
        }, 10);

        await expect(promise).rejects.toThrow('Remote execution failed with exit code 1. Error output: permission denied');
    });

    it('should reject when spawn throws an error', async () => {
        const config = {
            instanceName: 'test-instance',
            zone: 'us-central1-a',
            projectId: 'absolute-brook-452020-d5',
            remotePath: '/var/www/html'
        };

        const mockChildProcess = new EventEmitter() as any;
        mockChildProcess.stdout = new EventEmitter();
        mockChildProcess.stderr = new EventEmitter();
        mockedSpawn.mockReturnValue(mockChildProcess);

        const orchestrator = new SyncOrchestrator(config);
        
        const promise = orchestrator.executeRemoteDeployment();

        setTimeout(() => mockChildProcess.emit('error', new Error('Spawn failed')), 10);

        await expect(promise).rejects.toThrow('Spawn failed');
    });
});

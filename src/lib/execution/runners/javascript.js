const fs = require('fs');
const { spawn } = require('child_process');

async function runTest(testCase, solutionFile) {
    return new Promise((resolve) => {
        const start = process.hrtime.bigint();
        const child = spawn('node', [solutionFile]);

        let stdout = '';
        let stderr = '';

        if (testCase.input) {
            child.stdin.write(testCase.input);
            child.stdin.end();
        }

        child.stdout.on('data', (data) => { stdout += data; });
        child.stderr.on('data', (data) => { stderr += data; });

        const timeout = setTimeout(() => {
            child.kill();
            resolve({
                status: 'TIME_LIMIT_EXCEEDED',
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                executionTime: 5000,
                memoryUsed: 0
            });
        }, 5000);

        child.on('close', (code) => {
            clearTimeout(timeout);
            const end = process.hrtime.bigint();
            const durationMs = Number(end - start) / 1000000;

            resolve({
                status: code === 0 ? 'SUCCESS' : 'RUNTIME_ERROR',
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                exitCode: code,
                executionTime: Math.round(durationMs),
                memoryUsed: 0 // Memory tracking would require more complex logic here or using /usr/bin/time -v for the runner itself
            });
        });
    });
}

async function main() {
    const testCasesFile = 'test_cases.json';
    const solutionFile = 'solution.js';

    if (!fs.existsSync(testCasesFile)) {
        console.error('Test cases file not found');
        process.exit(1);
    }

    const testCases = JSON.parse(fs.readFileSync(testCasesFile, 'utf8'));
    const results = [];

    for (const tc of testCases) {
        const result = await runTest(tc, solutionFile);
        results.push(result);
        if (result.status !== 'SUCCESS') break; // Stop on first failure like the current logic
    }

    console.log('---RESULTS_START---');
    console.log(JSON.stringify(results));
    console.log('---RESULTS_END---');
}

main();
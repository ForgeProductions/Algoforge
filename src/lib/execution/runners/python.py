import json
import subprocess
import time
import os

def run_test(test_case, solution_file):
    start_time = time.perf_counter()
    try:
        process = subprocess.Popen(
            ['python3', solution_file],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(input=test_case.get('input', ''), timeout=5)
        end_time = time.perf_counter()
        
        duration_ms = (end_time - start_time) * 1000
        
        return {
            'status': 'SUCCESS' if process.returncode == 0 else 'RUNTIME_ERROR',
            'stdout': stdout.strip(),
            'stderr': stderr.strip(),
            'exitCode': process.returncode,
            'executionTime': round(duration_ms),
            'memoryUsed': 0
        }
    except subprocess.TimeoutExpired:
        process.kill()
        return {
            'status': 'TIME_LIMIT_EXCEEDED',
            'stdout': '',
            'stderr': 'Time Limit Exceeded',
            'executionTime': 5000,
            'memoryUsed': 0
        }

def main():
    test_cases_file = 'test_cases.json'
    solution_file = 'solution.py'
    
    if not os.path.exists(test_cases_file):
        print("Test cases file not found")
        return

    with open(test_cases_file, 'r') as f:
        test_cases = json.load(f)
    
    results = []
    for tc in test_cases:
        result = run_test(tc, solution_file)
        results.append(result)
        if result['status'] != 'SUCCESS':
            break
            
    print("---RESULTS_START---")
    print(json.dumps(results))
    print("---RESULTS_END---")

if __name__ == "__main__":
    main()
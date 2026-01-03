# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import time
import cpuinfo
import psutil 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. SYSTEM MONITOR (Live Data) ---
@app.get("/system-stats")
def get_system_stats():
    # RAM Usage
    memory = psutil.virtual_memory()
    
    # Disk Usage (C: drive or Root)
    # On Windows, '/' defaults to the current drive (usually C:)
    disk = psutil.disk_usage('/')
    
    return {
        "ram": {
            "total_gb": round(memory.total / (1024**3), 2),
            "used_gb": round(memory.used / (1024**3), 2),
            "percent": memory.percent
        },
        "disk": {
            "total_gb": round(disk.total / (1024**3), 2),
            "used_gb": round(disk.used / (1024**3), 2),
            "percent": disk.percent
        }
    }

# --- 2. BENCHMARK (Speed Test) ---
class BenchmarkRequest(BaseModel):
    size: int = 5000

@app.post("/run-benchmark")
async def run_benchmark(request: BenchmarkRequest):
    size = request.size
    results = {}

    try:
        info = cpuinfo.get_cpu_info()
        results["cpu_name"] = info['brand_raw']
    except:
        results["cpu_name"] = "Unknown CPU"

    devices = ["cpu"]
    if torch.cuda.is_available():
        devices.append("cuda")

    for device_name in devices:
        try:
            device = torch.device(device_name)
            
            if device_name == "cuda":
                results["gpu_name"] = torch.cuda.get_device_name(0)

            # Create random matrices
            a = torch.randn(size, size, device=device)
            b = torch.randn(size, size, device=device)

            # Warmup
            if device_name == "cuda": torch.cuda.synchronize()

            start = time.time()
            c = torch.matmul(a, b)
            if device_name == "cuda": torch.cuda.synchronize()

            results[device_name] = time.time() - start
        except Exception as e:
            results[device_name] = -1

    if "cuda" in results and results["cuda"] > 0:
        speedup = results["cpu"] / results["cuda"]
        results["summary"] = f"GPU is {speedup:.1f}x faster"
    else:
        results["summary"] = "GPU unavailable"

    return results

# --- 3. STRESS TEST (Load Testing) ---
class StressTestRequest(BaseModel):
    duration: int = 10  # Default 10 seconds

@app.post("/stress-test")
async def run_stress_test(request: StressTestRequest):
    duration = request.duration
    
    # Safety limit: Max 60 seconds to prevent crashes/overheating
    if duration > 60: duration = 60
    
    # Check for GPU
    if torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")
        
    # Create massive matrices (Heavy VRAM usage)
    size = 10000 
    try:
        a = torch.randn(size, size, device=device)
        b = torch.randn(size, size, device=device)
    except Exception:
        # Fallback if VRAM is too full, go smaller
        size = 5000
        a = torch.randn(size, size, device=device)
        b = torch.randn(size, size, device=device)

    start_time = time.time()
    end_time = start_time + duration
    iterations = 0

    print(f"🔥 STARTING STRESS TEST: {duration}s on {device}")

    # The Loop of Fire
    while time.time() < end_time:
        c = torch.matmul(a, b)
        iterations += 1
        
        # Sync to ensure GPU actually finishes work before checking time
        if device.type == 'cuda':
            torch.cuda.synchronize()

    return {
        "status": "Completed",
        "device": str(device),
        "duration_actual": round(time.time() - start_time, 2),
        "matrix_operations": iterations
    }
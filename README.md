# The Engineer's Terminal 🚀

> **A Full-Stack Hardware Acceleration Dashboard** > *Bridging the gap between High-Performance Computing and Modern Web Interfaces.*

The **Engineer's Terminal** is a distributed application that allows a web-based frontend to directly communicate with and control local computer hardware. Unlike standard websites, this tool has "System-Level" privileges via a custom Python bridge, enabling it to perform GPU benchmarks, monitor real-time telemetry, and execute hardware stress tests.

![Project Status](https://img.shields.io/badge/Status-Active-emerald)
![Tech Stack](https://img.shields.io/badge/Stack-Astro_React_FastAPI_PyTorch-blue)

---

## 🏗️ Architecture & Modules

This application consists of three core "Command Modules," each designed to test a specific aspect of your machine's capability.

### 1. 🏎️ SYS.BENCHMARK_V1 (Compute Unit)
A raw performance race between your **CPU** (Central Processing Unit) and **GPU** (Graphics Processing Unit).
* **Logic:** Generates two massive 8000x8000 matrices filled with random floating-point numbers.
* **The Test:** Forces both processors to perform Matrix Multiplication (Dot Product).
* **Output:** Measures the exact time in seconds and calculates the "Speedup Factor" (e.g., *GPU is 12.5x faster*).
* **Tech:** Uses `torch.cuda` for hardware acceleration.

### 2. 📡 LIVE.MONITOR (Telemetry)
A real-time heartbeat monitor for your system's resources.
* **Logic:** The frontend polls the backend every 2000ms (2 seconds) to fetch the latest system stats.
* **Metrics:** Tracks **RAM Usage** (Active Memory) and **Disk Usage** (Root Volume).
* **Tech:** Powered by the `psutil` library for cross-platform hardware hooks.

### 3. 🔥 STRESS.TEST_MODE (Load Testing)
A stability testing module designed to saturate the GPU's VRAM and Compute Cores.
* **Logic:** Locks the GPU into a continuous "While Loop" of heavy matrix calculations for a set duration (15s).
* **Purpose:** To verify system stability under heavy load and observe thermal performance.
* **Warning:** This module intentionally starves the system of resources; minor stutters are expected.

---

## 🛠️ Tech Stack

### The Brain (Backend)
* **Language:** Python 3.11+
* **Framework:** FastAPI (High-performance Async API)
* **Core Libraries:**
    * `PyTorch`: For tensor operations and CUDA GPU access.
    * `Psutil`: For retrieving system memory and disk information.
    * `Py-cpuinfo`: For fetching the exact marketing name of the processor.

### The Face (Frontend)
* **Framework:** Astro (Static Site Generation + Hydration)
* **UI Library:** React 19 (Interactive "Islands")
* **Styling:** TailwindCSS v4 (Utility-first styling)
* **Communication:** REST API (Fetch)

---

## 🚀 How to Run

Follow these steps to launch the distributed system. You will need **two separate terminal windows**.

### Prerequisites
* **Python 3.11+** installed and added to PATH.
* **Node.js 18+** installed.
* *(Optional)* **NVIDIA GPU** with drivers installed (for CUDA acceleration).

### Phase 1: Start the Backend (The Brain)
1.  Open your terminal and navigate to the `backend` folder:
    ```powershell
    cd backend
    ```

2.  Create a virtual environment (keeps your PC clean):
    ```powershell
    python -m venv venv
    ```

3.  Activate the environment:
    * **Windows (PowerShell):**
        ```powershell
        .\venv\Scripts\activate
        ```
    * **Mac/Linux:**
        ```bash
        source venv/bin/activate
        ```

4.  Install the required libraries:
    ```powershell
    pip install -r requirements.txt
    ```
    *> **Note for NVIDIA Users:** If the standard install doesn't detect your GPU, you may need to install the specific CUDA version of PyTorch: [Start Locally | PyTorch](https://pytorch.org/get-started/locally/)*

5.  Launch the Server:
    ```powershell
    uvicorn main:app --reload
    ```
    *You should see: `Uvicorn running on http://127.0.0.1:8000`*

### Phase 2: Start the Frontend (The Face)
1.  Open a **new** terminal window and navigate to the `frontend` folder:
    ```powershell
    cd frontend
    ```

2.  Install JavaScript dependencies:
    ```powershell
    npm install
    ```

3.  Launch the Web Interface:
    ```powershell
    npm run dev
    ```

4.  Open your browser and visit:  
    👉 **http://localhost:4321**

---

## 👨‍💻 Created By

**Pasya Shafaa Aaqila** *FrontEnd Developer & Computer Science Undergraduate* *Universitas Gunadarma*

> Built as an experiment in Full-Stack Systems Architecture, exploring the intersection of web technologies and low-level hardware control.

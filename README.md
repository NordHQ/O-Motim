# ◈ O'MOTIM (BETA)

> Modular reconnaissance platform for authorized security testing.
>
> Subdomain discovery, HTTP probing, technology fingerprinting, header analysis,
> secret detection, and CVE matching — all in one unified context, with an AI assistant powered by Ollama.

![Tauri](https://img.shields.io/badge/Tauri-v2-blue?logo=tauri&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss&logoColor=white)

**Tags:** `osint` `pentest` `reconnaissance` `react` `cybersecurity` `security-tools` `hacking`

---

## 📋 Table of Contents

- [Overview](#overview)
- [Screenshots](#-screenshots)
- [Backend Setup](#-backend-setup)
- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Requirements](#-requirements)
- [Installation](#-installation)
  - [1. System Setup](#1-system-setup)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Development Mode](#3-development-mode)
  - [4. Build Application](#4-build-application)
- [Ollama AI Configuration](#-ollama-ai-configuration)
- [Scanning Pipeline](#-scanning-pipeline)
- [Usage](#-usage)
- [Export Reports](#-export-reports)
- [Tech Stack](#-tech-stack)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## Overview

**O'MOTIM** is a modular reconnaissance platform consisting of two main components:

1. **Frontend** (React + TypeScript) — User interface for scanning and results visualization
2. **Backend** (Rust + Tauri) — Core scanning engine with 24 analysis modules

This repository contains **only the frontend**. The backend must be set up separately.

---

## 📸 Screenshots

### 1. Dashboard — Main entry point with quick stats
<img width="1440" height="900" alt="Снимок экрана — 2026-06-21 в 19 04 36" src="https://github.com/user-attachments/assets/5ef8f666-7868-4d0d-9937-7ff12111e18f" />


The dashboard displays an overview of your scan results with quick statistics cards showing discovered subdomains, active hosts, CVEs found, secrets detected, vulnerabilities, API endpoints, directories, crawled pages, and more. Dark theme with orange accent color (#c84b0e).

---

### 2. Results — Subdomain discovery and detailed findings
<img width="1440" height="900" alt="Снимок экрана — 2026-06-21 в 19 04 05" src="https://github.com/user-attachments/assets/26d444fc-339d-4cd0-a64e-6460c7080a1a" />


The Results tab shows a comprehensive table of discovered subdomains with HTTP probe results. Tab-based interface provides access to different finding categories (Subdomains, HTTP Probe, Tech, Headers, Secrets, CVEs, Backdoors, Dirs, CORS, Methods, etc.). Real-time results as scanning progresses.

---

### 3. Scan Pipeline — Real-time scanning progress with live log
<img width="1440" height="900" alt="Снимок экрана — 2026-06-21 в 19 03 24" src="https://github.com/user-attachments/assets/83f38610-c203-4091-aec5-92a4cc157448" />


During an active scan, the interface shows the pipeline with all 24 stages of analysis. Each stage displays its status (Running, Complete, Pending) with counts of findings. The live log at the bottom shows real-time execution with timestamps. Status bar shows CPU usage (50%), RAM consumption, thread count, and elapsed time.

---

## 🔌 Backend Setup

### Where is the Backend?

The Rust backend is located in a separate repository:

**Repository:** [NordHQ/O-Motim-src-tauri](https://github.com/NordHQ/O-Motim-src-tauri)

### Clone and Configure the Backend

The backend should be cloned into the `src-tauri/` directory within this frontend repository:

```bash
# Clone the frontend (if you haven't already)
git clone https://github.com/NordHQ/O-Motim.git
cd O-Motim

# Clone the backend into src-tauri/
git clone https://github.com/NordHQ/O-Motim-src-tauri.git src-tauri
```

After cloning, your project structure should look like:

```
O-Motim/                    # Frontend repository
├── src/                    # Frontend source code
├── package.json            # Frontend dependencies
├── vite.config.ts
├── index.html
├── src-tauri/              # ← Backend repository (cloned)
│   ├── src/
│   ├── Cargo.toml          # Rust dependencies
│   ├── tauri.conf.json
│   └── README.md
└── ...
```

### Backend Download & Build

Once the backend is in `src-tauri/`, the build system will automatically:

1. **Download Rust dependencies** — First build may take 5-10 minutes
2. **Compile Rust code** — `cargo build --release` runs automatically
3. **Link with frontend** — Tauri bundles them together

No separate build steps needed for the backend—everything is handled by `npm run tauri dev` or `npm run tauri build`.

### Backend Requirements

The backend requires:
- **Rust** ≥ 1.70 (installed via [rustup](https://rustup.rs))
- **Cargo** (comes with Rust)
- Platform-specific build tools (see [Installation](#-installation) section)

---

## ✨ Features

| Module | Description |
|--------|----------|
| **Subdomain Discovery** | Discover subdomains via crt.sh, DNS-over-HTTPS (DoH), brute force |
| **DNS Resolver** | Resolve DNS records for discovered hosts |
| **HTTP Probe** | HTTP probing with 50 workers, HTTPS-first priority |
| **Fingerprint** | Detect technologies — 26 signatures |
| **Headers Analysis** | Analyze security headers (CSP, HSTS, X-Frame, etc.) |
| **Secrets Scanner** | Find leaks using 12 patterns (API keys, tokens, etc.) |
| **CVE Match** | Match detected technologies against NVD database |
| **AI Assistant** | Local AI chat powered by Ollama — finding analysis, attack vectors, remediation advice |
| **Reports** | Generate JSON and HTML reports |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────┐
│                   Tauri (Rust)               │
│  start_scan / stop_scan / ai_chat / stats    │
│              ◄── IPC invoke() ──►            │
├──────────────────────────────────────────────┤
│              React Frontend                  │
│  ┌──────────┐  ┌───────────┐  ┌───────────┐  │
│  │ Zustand  │  │  Hooks   │  │Components │  │
│  │  Store   │◄─┤ useScan  │◄─┤ Dashboard │  │
│  │          │  │ useAI    │  │ Pipeline  │  │
│  │  View    │  │ useStats │  │ Results   │  │
│  │  Events  │  │          │  │ AI Chat   │  │
│  │  Context │  │          │  │ Report    │  │
│  └──────────┘  └───────────┘  └───────────┘  │
└──────────────────────────────────────────────┘
```

**How it works:**
1. Frontend calls Tauri IPC commands (`invoke`) — `start_scan`, `stop_scan`, `ai_chat`, `check_ollama`, `get_system_stats`
2. Rust backend performs scanning and sends events via Tauri event system (`pipeline-event`, `scan-complete`)
3. Zustand store updates in real-time from events
4. React components render UI based on store state

---

## 📁 Project Structure

```
O-Motim/
├── index.html                  # HTML entry point
├── package.json                # Frontend dependencies and scripts
├── vite.config.ts              # Vite + Tauri configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TS config for Vite
├── tailwind.config.js          # Dark theme, custom colors
├── postcss.config.js           # PostCSS (Tailwind + Autoprefixer)
├── templates/
│   └── report.html             # HTML report template (handlebars-style)
├── src-tauri/                  # ← Rust backend (separate repo)
│   ├── src/
│   ├── Cargo.toml              # Rust dependencies
│   ├── tauri.conf.json         # Tauri configuration
│   └── README.md               # Backend documentation
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Root component, view routing
    ├── index.css               # Tailwind + custom styles
    ├── store/
    │   └── scanStore.ts        # Zustand store (scan state)
    ├── hooks/
    │   ├── useScan.ts          # Hook for start/stop scan
    │   ├── useAI.ts            # Hook for AI chat (Ollama)
    │   └── useSystemStats.ts   # Hook for system stats (CPU/RAM)
    └── components/
        ├── Layout/
        │   ├── Topbar.tsx      # Top navigation
        │   ├── Sidebar.tsx     # Sidebar with pipeline stages
        │   └── StatusBar.tsx   # Status bar (CPU, RAM, threads, elapsed)
        ├── Dashboard/
        │   ├── Dashboard.tsx   # Main page
        │   ├── TargetInput.tsx # Target domain input field
        │   └── QuickStats.tsx  # Quick stats cards
        ├── Pipeline/
        │   ├── PipelineView.tsx # Pipeline representation
        │   ├── StageCard.tsx   # Scan stage card
        │   └── LiveLog.tsx     # Auto-scrolling log
        ├── Results/
        │   ├── ResultsTabs.tsx  # Result tabs
        │   ├── SubdomainTable.tsx # Subdomain table
        │   ├── HttpResults.tsx   # HTTP probing results
        │   ├── TechCards.tsx     # Technology cards
        │   ├── CveTable.tsx      # CVE table
        │   ├── SecretsPanel.tsx  # Secrets panel
        ├── AI/
        │   ├── AIAssistant.tsx  # AI sidebar (collapsible)
        │   └── AIChat.tsx       # Full-screen AI chat
        └── Report/
            ├── ExportPanel.tsx    # JSON/HTML export
            └── ReportPreview.tsx  # Report preview
```

---

## 📦 Requirements

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | ≥ 18 | Execute JavaScript, npm |
| **npm** | ≥ 9 | Package manager (ships with Node.js) |
| **Rust** | ≥ 1.70 | Tauri backend (rustup) |
| **Tauri CLI** | v2 | Build and run Tauri app |
| **Ollama** | Latest | AI assistant (optional) |

### Supported OS

- **macOS** (x86_64 and aarch64/Apple Silicon)
- **Linux** (x86_64)
- **Windows** (x86_64)

---

## 🚀 Installation

### 1. System Setup

#### Install Node.js

**macOS (Homebrew):**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Download the installer from [nodejs.org](https://nodejs.org) (LTS version).

Verify:
```bash
node -v    # v20.x.x or higher
npm -v     # 10.x.x or higher
```

#### Install Rust

**macOS / Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

**Windows:**
Download rustup-init.exe from [rust-lang.org](https://rustup.rs).

Verify:
```bash
rustc --version   # 1.70+ or higher
cargo --version
```

#### Tauri System Dependencies

**macOS — no additional dependencies required.**
Make sure Xcode Command Line Tools are installed:
```bash
xcode-select --install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**Linux (Fedora):**
```bash
sudo dnf install -y \
  webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

**Windows — no additional dependencies required** (all needed tools included in MSVC Build Tools).

---

### 2. Install Dependencies

Clone both repositories and install dependencies:

```bash
# Clone the frontend
git clone https://github.com/NordHQ/O-Motim.git
cd O-Motim

# Clone the backend into src-tauri/
git clone https://github.com/NordHQ/O-Motim-src-tauri.git src-tauri

# Install frontend dependencies
npm install
```

> This will install React, Tauri API, Vite, TypeScript, Tailwind CSS and all other frontend dependencies.
> The `package-lock.json` file will be generated automatically.
> Rust dependencies will be handled during the first build.

---

### 3. Development Mode

#### Frontend only (without Tauri backend)

If you want to view/debug only the React interface:

```bash
npm run dev
```

> Vite will start a dev server on `http://localhost:1420`.
> Components will render, but Tauri IPC calls won't work (backend missing).

#### Full run with Tauri (with backend)

To run the complete desktop application with Rust backend:

```bash
npm run tauri dev
```

> This will simultaneously run the Vite dev server and compile/launch the Tauri application.
> On first run, Rust dependencies will be downloaded and compiled (may take 5-10 minutes).
> 
> **Before running this, ensure the backend is cloned:** `git clone https://github.com/NordHQ/O-Motim-src-tauri.git src-tauri`

---

### 4. Build Application

#### Build frontend only:

```bash
npm run build
```

> Result: `dist/` folder with optimized HTML/CSS/JS files.

#### Full desktop application build:

```bash
npm run tauri build
```

> Creates installer in `src-tauri/target/release/bundle/`:
> - macOS: `.dmg` / `.app`
> - Linux: `.deb` / `.AppImage`
> - Windows: `.msi` / `.exe`

---

## 🤖 Ollama AI Configuration

The AI assistant works through a local [Ollama](https://ollama.ai) model.

### Install Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download installer from [ollama.ai](https://ollama.ai).

### Run a Model

```bash
# Start Ollama server
ollama serve

# In another terminal — download and run a model
ollama pull llama3
ollama run llama3
```

After starting the Ollama server, the application will automatically detect it and show **"Connected"** status in the AI panel.

> The AI assistant is **optional** — the application works fully without it.
> All other scanning modules are independent of Ollama.

---

## ⚙ Scanning Pipeline

```
┌─────────────────────┐
│ 1. Subdomain        │  crt.sh + DoH + brute
│    Discovery         │
├─────────────────────┤
│ 2. DNS Resolver     │  A / AAAA / CNAME
├─────────────────────┤
│ 3. HTTP Probe       │  50 workers, HTTPS-first
├─────────────────────┤
│ 4. Fingerprint      │  26 tech signatures
├─────────────────────┤
│ 5. Headers          │  CSP, HSTS, X-Frame...
│    Analysis         │
├─────────────────────┤
│ 6. Secrets Scanner  │  12 regex patterns
├─────────────────────┤
│ 7. CVE Match        │  NVD database lookup
├─────────────────────┤
│ 8. Report           │  JSON / HTML export
└─────────────────────┘
```

Each stage is displayed in the sidebar with real-time status:
- `pending` — waiting
- `running` — executing (animated)
- `done` — completed
- `error` — error occurred
- `skipped` — skipped

---

## 🖥 Usage

1. **Set up the project** (frontend + backend as described above)
2. **Start the application** (`npm run tauri dev`)
3. **Enter target domain** in the "Target domain" field on Dashboard
4. **Click "Start scan"** or press `Enter`
5. **Monitor progress** in Pipeline — each stage updates in real-time
6. **View results** — Results tab opens automatically after scan completes
7. **Ask AI** — Go to AI tab to analyze findings
8. **Generate report** — Report tab with JSON/HTML export

---

## 📊 Export Reports

| Format | Description |
|--------|----------|
| **JSON** | Full scan context (subdomains, HTTP, technologies, CVE, secrets) |
| **HTML** | Styled report with dark theme, tables and summary cards |

Export is available on the **Report** tab via the **Show Export** button.

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 |
| **Language** | TypeScript 5 |
| **Build** | Vite 5 |
| **Desktop** | Tauri v2 (Rust) |
| **Styling** | Tailwind CSS 3.4 |
| **State Management** | Zustand 4.5 |
| **Animations** | Framer Motion 11 |
| **Charts** | Recharts 2.12 |
| **Icons** | Lucide React 0.383 |
| **AI** | Ollama (local LLM) |

---

## 📜 Available Scripts

```bash
npm run dev        # Run Vite dev server (frontend only)
npm run build      # Build frontend (tsc + vite build)
npm run preview    # Preview production build
npm run tauri      # Run Tauri CLI
npm run tauri dev  # Full development mode (with backend)
npm run tauri build # Full desktop app build
```

---

## ⚖ License

This project is intended **for authorized security testing only**.
Use without explicit permission from the target resource owner is prohibited.

---

<p align="center">
  <strong>O'MOTIM</strong> · Modular reconnaissance platform<br>
  <span style="color:#7a7a99">For authorized security testing only.</span>
</p>

<div align="center">
Built with ❤️ and 🦀 by NordHQ

If this helped you, leave a ⭐ — it means a lot!

</div>

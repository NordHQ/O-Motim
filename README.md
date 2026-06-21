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
MOTIM/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite + Tauri configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TS config for Vite
├── tailwind.config.js          # Dark theme, custom colors
├── postcss.config.js           # PostCSS (Tailwind + Autoprefixer)
├── templates/
│   └── report.html             # HTML report template (handlebars-style)
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

Clone the repository and install npm packages:

```bash
cd MOTIM
npm install
```

> This command will install React, Tauri API, Vite, TypeScript, Tailwind CSS and all other dependencies.
> The `package-lock.json` file will be generated automatically.

---

### 3. Development Mode

#### Frontend only (without Tauri backend)

If you want to view/debug only the React interface:

```bash
npm run dev
```

> Vite will start a dev server on `http://localhost:1420`.
> Components will render, but Tauri IPC calls won't work (backend missing).

#### Full run with Tauri

To run the desktop application with Rust backend:

```bash
npm run tauri dev
```

> This will simultaneously run the Vite dev server and compile/launch the Tauri application.
> On first run, Rust dependencies will be downloaded and compiled (may take several minutes).

> ⚠️ **Important:** This repository contains only the frontend part.
> The Rust backend (`src-tauri/`) with `start_scan`, `stop_scan`, `ai_chat` command implementations
> must be connected separately.

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

1. **Start the application** (`npm run tauri dev`)
2. **Enter target domain** in the "Target domain" field on Dashboard
3. **Click "Start scan"** or press `Enter`
4. **Monitor progress** in Pipeline — each stage updates in real-time
5. **View results** — Results tab opens automatically after scan completes
6. **Ask AI** — Go to AI tab to analyze findings
7. **Generate report** — Report tab with JSON/HTML export

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
npm run tauri dev  # Full development mode
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

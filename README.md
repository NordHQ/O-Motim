# ◈ O'MOTIM (BETA)

> Модульная reconnaissance-платформа для авторизованного тестирования безопасности.
>
> Дискавери поддоменов, HTTP-пробинг, фингерпринтинг технологий, анализ заголовков,
> поиск секретов и CVE-матчинг — всё в едином контексте, с AI-ассистентом на базе Ollama.

![Tauri](https://img.shields.io/badge/Tauri-v2-blue?logo=tauri&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss&logoColor=white)

---

## 📋 Содержание

- [Возможности](#-возможности)
- [Скриншоты (описание интерфейса)](#-скриншоты)
- [Архитектура](#-архитектура)
- [Структура проекта](#-структура-проекта)
- [Требования](#-требования)
- [Установка](#-установка)
  - [1. Подготовка системы](#1-подготовка-системы)
  - [2. Установка зависимостей](#2-установка-зависимостей)
  - [3. Запуск в режиме разработки](#3-запуск-в-режиме-разработки)
  - [4. Сборка приложения](#4-сборка-приложения)
- [Конфигурация Ollama AI](#-конфигурация-ollama-ai)
- [Конвейер сканирования (Pipeline)](#-конвейер-сканирования-pipeline)
- [Использование](#-использование)
- [Экспорт отчётов](#-экспорт-отчётов)
- [Технологический стек](#-технологический-стек)
- [Доступные скрипты](#-доступные-скрипты)
- [Лицензия](#-лицензия)

---

## ✨ Возможности

| Модуль | Описание |
|--------|----------|
| **Subdomain Discovery** | Обнаружение поддоменов через crt.sh, DNS-over-HTTPS (DoH), брутфорс |
| **DNS Resolver** | Разрешение DNS-записей для обнаруженных хостов |
| **HTTP Probe** | HTTP-пробинг с 50 воркерами, приоритет HTTPS |
| **Fingerprint** | Определение технологий — 26 сигнатур |
| **Headers Analysis** | Анализ security-заголовков (CSP, HSTS, X-Frame и др.) |
| **Secrets Scanner** | Поиск утечек по 12 паттернам (API-ключи, токены и т.д.) |
| **CVE Match** | Сопоставление обнаруженных технологий с базой NVD |
| **AI Assistant** | Локальный AI-чат на базе Ollama — анализ находок, векторы атак, рекомендации по исправлению |
| **Reports** | Генерация отчётов в JSON и HTML |

---

## 📸 Скриншоты

> Интерфейс выполнен в тёмной теме с акцентным оранжевым цветом (`#c84b0e`).

### Основные экраны:

1. **Dashboard** — стартовая страница с полем ввода целевого домена и карточками шагов pipeline
<img width="1440" height="900" alt="Снимок экрана — 2026-06-21 в 18 12 19" src="https://github.com/user-attachments/assets/f742e5aa-15a2-4402-8bf0-755b2ac5ecbc" />

2. **Pipeline** — отображение 8 этапов сканирования в реальном времени с прогресс-баром и live-логом
<img width="1440" height="900" alt="Снимок экрана — 2026-06-21 в 18 19 47" src="https://github.com/user-attachments/assets/0611f417-2d84-413a-99f9-4139c9698896" />


3. **Results** — табличный просмотр результатов: поддомены, HTTP-пробинг, технологии, заголовки, секреты, CVE
<img width="1440" height="900" alt="Снимок экрана — 2026-06-21 в 18 12 30" src="https://github.com/user-attachments/assets/64b9faaf-8b54-47e3-ad72-f6e5cd66ed43" />


---

## 🏗 Архитектура

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

**Как это работает:**
1. Frontend вызывает Tauri IPC-команды (`invoke`) — `start_scan`, `stop_scan`, `ai_chat`, `check_ollama`, `get_system_stats`
2. Rust-бэкенд выполняет сканирование и отправляет события через Tauri event system (`pipeline-event`, `scan-complete`)
3. Zustand-стор обновляется событиями в реальном времени
4. React-компоненты рендерят UI на основе стора

---

## 📁 Структура проекта

```
MOTIM/
├── index.html                  # Точка входа HTML
├── package.json                # Зависимости и скрипты
├── vite.config.ts              # Конфигурация Vite + Tauri
├── tsconfig.json               # Конфигурация TypeScript
├── tsconfig.node.json          # TS-конфиг для Vite
├── tailwind.config.js          # Тёмная тема, кастомные цвета
├── postcss.config.js           # PostCSS (Tailwind + Autoprefixer)
├── templates/
│   └── report.html             # HTML-шаблон отчёта (handlebars-style)
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Root-компонент, роутинг по views
    ├── index.css               # Tailwind + кастомные стили
    ├── store/
    │   └── scanStore.ts        # Zustand-стор (состояние сканирования)
    ├── hooks/
    │   ├── useScan.ts          # Хук запуска/остановки сканирования
    │   ├── useAI.ts            # Хук AI-чата (Ollama)
    │   └── useSystemStats.ts   # Хук системной статистики (CPU/RAM)
    └── components/
        ├── Layout/
        │   ├── Topbar.tsx      # Верхняя навигация
        │   ├── Sidebar.tsx     # Боковая панель этапов pipeline
        │   └── StatusBar.tsx   # Статус-бар (CPU, RAM, threads, elapsed)
        ├── Dashboard/
        │   ├── Dashboard.tsx   # Главная страница
        │   ├── TargetInput.tsx # Поле ввода целевого домена
        │   └── QuickStats.tsx  # Карточки быстрой статистики
        ├── Pipeline/
        │   ├── PipelineView.tsx # Представление конвейера
        │   ├── StageCard.tsx   # Карточка этапа сканирования
        │   └── LiveLog.tsx     # Автопрокручивающийся лог
        ├── Results/
        │   ├── ResultsTabs.tsx  # Табы результатов
        │   ├── SubdomainTable.tsx # Таблица поддоменов
        │   ├── HttpResults.tsx   # Результаты HTTP-пробинга
        │   ├── TechCards.tsx     # Карточки технологий
        │   ├── CveTable.tsx      # Таблица CVE
        │   ├── SecretsPanel.tsx  # Панель секретов
        ├── AI/
        │   ├── AIAssistant.tsx  # Боковая панель AI (сворачиваемая)
        │   └── AIChat.tsx       # Полноэкранный AI-чат
        └── Report/
            ├── ExportPanel.tsx    # Экспорт JSON/HTML
            └── ReportPreview.tsx  # Предпросмотр отчёта
```

---

## 📦 Требования

| Инструмент | Версия | Зачем |
|------------|--------|-------|
| **Node.js** | ≥ 18 | Выполнение JavaScript, npm |
| **npm** | ≥ 9 | Менеджер пакетов (поставляется с Node.js) |
| **Rust** | ≥ 1.70 | Tauri-бэкенд (rustup) |
| **Tauri CLI** | v2 | Сборка и запуск Tauri-приложения |
| **Ollama** | 最新 | AI-ассистент (опционально) |

### Поддерживаемые ОС

- **macOS** (x86_64 и aarch64/Apple Silicon)
- **Linux** (x86_64)
- **Windows** (x86_64)

---

## 🚀 Установка

### 1. Подготовка системы

#### Установка Node.js

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
Скачайте установщик с [nodejs.org](https://nodejs.org) (LTS-версия).

Проверьте:
```bash
node -v    # v20.x.x или выше
npm -v     # 10.x.x или выше
```

#### Установка Rust

**macOS / Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

**Windows:**
Скачайте rustup-init.exe с [rust-lang.org](https://rustup.rs).

Проверьте:
```bash
rustc --version   # 1.70+ или выше
cargo --version
```

#### Системные зависимости Tauri

**macOS — дополнительные зависимости не требуются.**
Убедитесь, что установлен Xcode Command Line Tools:
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

**Windows — дополнительные зависимости не требуются** (все необходимое входит в MSVC Build Tools).

---

### 2. Установка зависимостей

Клонируйте репозиторий и установите npm-пакеты:

```bash
cd MOTIM
npm install
```

> Эта команда установит React, Tauri API, Vite, TypeScript, Tailwind CSS и все остальные зависимости.
> Файл `package-lock.json` будет сгенерирован автоматически.

---

### 3. Запуск в режиме разработки

#### Только frontend (без Tauri-бэкенда)

Если вы хотите посмотреть/отладить только React-интерфейс:

```bash
npm run dev
```

> Vite запустит dev-сервер на `http://localhost:1420`.
> Компоненты будут рендериться, но Tauri IPC-вызовы не будут работать (бэкенд отсутствует).

#### Полный запуск с Tauri

Для запуска desktop-приложения с Rust-бэкендом:

```bash
npm run tauri dev
```

> Это одновременно запустит Vite dev-сервер и скомпилирует/запустит Tauri-приложение.
> При первом запуске Rust-зависимости будут скачаны и скомпилированы (может занять несколько минут).

> ⚠️ **Важно:** Данный репозиторий содержит только frontend-часть.
> Rust-бэкенд (`src-tauri/`) с реализацией команд `start_scan`, `stop_scan`, `ai_chat` и т.д.
> должен быть подключён отдельно.

---

### 4. Сборка приложения

#### Сборка frontend (только булды):

```bash
npm run build
```

> Результат: папка `dist/` с оптимизированными HTML/CSS/JS файлами.

#### Полная сборка desktop-приложения:

```bash
npm run tauri build
```

> Создаст установочный пакет в `src-tauri/target/release/bundle/`:
> - macOS: `.dmg` / `.app`
> - Linux: `.deb` / `.AppImage`
> - Windows: `.msi` / `.exe`

---

## 🤖 Конфигурация Ollama AI

AI-ассистент работает через локальную модель [Ollama](https://ollama.ai).

### Установка Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Скачайте установщик с [ollama.ai](https://ollama.ai).

### Запуск модели

```bash
# Запустить Ollama-сервер
ollama serve

# В другом терминале — скачать и запустить модель
ollama pull llama3
ollama run llama3
```

После запуска Ollama-сервера приложение автоматически обнаружит его и отобразит статус **«Connected»** в AI-панели.

> AI-ассистент **опционален** — приложение полностью работает и без него.
> Все остальные модули сканирования не зависят от Ollama.

---

## ⚙ Конвейер сканирования (Pipeline)

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

Каждый этап отображается в sidebar с реальным статусом:
- `pending` — ожидание
- `running` — выполнение (анимация)
- `done` — завершён
- `error` — ошибка
- `skipped` — пропущен

---

## 🖥 Использование

1. **Запустите приложение** (`npm run tauri dev`)
2. **Введите целевой домен** в поле «Target domain» на Dashboard
3. **Нажмите «Start scan»** или нажмите `Enter`
4. **Следите за прогрессом** в Pipeline — каждый этап обновляется в реальном времени
5. **Просмотрите результаты** — после завершения сканирования автоматически откроется вкладка Results
6. **Спросите AI** — перейдите на вкладку AI для анализа находок
7. **Сгенерируйте отчёт** — вкладка Report с экспортом в JSON/HTML

---

## 📊 Экспорт отчётов

| Формат | Описание |
|--------|----------|
| **JSON** | Полный контекст сканирования (поддомены, HTTP, технологии, CVE, секреты) |
| **HTML** | Стилизованный отчёт с тёмной темой, таблицами и summary-карточками |

Экспорт доступен на вкладке **Report** через кнопку **Show Export**.

---

## 🛠 Технологический стек

| Категория | Технология |
|-----------|------------|
| **Фреймворк** | React 18 |
| **Язык** | TypeScript 5 |
| **Сборка** | Vite 5 |
| **Desktop** | Tauri v2 (Rust) |
| **Стилизация** | Tailwind CSS 3.4 |
| **State Management** | Zustand 4.5 |
| **Анимации** | Framer Motion 11 |
| **Графики** | Recharts 2.12 |
| **Иконки** | Lucide React 0.383 |
| **AI** | Ollama (локальная LLM) |

---

## 📜 Доступные скрипты

```bash
npm run dev        # Запустить Vite dev-сервер (frontend only)
npm run build      # Собрать frontend (tsc + vite build)
npm run preview    # Предпросмотр production-билда
npm run tauri      # Запустить Tauri CLI
npm run tauri dev  # Полный запуск в режиме разработки
npm run tauri build # Полная сборка desktop-приложения
```

---

## ⚖ Лицензия

Этот проект предназначен **только для авторизованного тестирования безопасности**.
Использование без явного разрешения владельца целевых ресурсов запрещено.

---

<p align="center">
  <strong>O'MOTIM</strong> · Модульная reconnaissance-платформа<br>
  <span style="color:#7a7a99">For authorized security testing only.</span>
</p>

<div align="center">
Built with ❤️ and 🦀 by NordHQ

If this helped you, leave a ⭐ — it means a lot!

</div>

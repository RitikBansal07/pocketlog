# PocketLog — Privacy-First Wellness Journal & Biometric Vault

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo%20SDK-58-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-v5-FF4154?style=flat&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Tests](https://img.shields.io/badge/Jest-15%2F15%20Passing-brightgreen?style=flat&logo=jest)](https://jestjs.io/)

A privacy-first, local-first daily wellness journal and habit intelligence application built with **React Native (Expo)** and **TypeScript**. Designed for a **React Native Developer Portfolio**, PocketLog demonstrates high-level mobile engineering capabilities: **60fps UI gestures, hardware biometrics (FaceID/TouchID), native audio recording, interactive data visualization (30-day GitHub-style habit heatmap), and tactile haptics.**

Compiles natively for **iOS** and **Android**, and exports as a zero-dependency static web application for **GitHub Pages**.

---

## 📱 Live Demo
- **GitHub Pages Static Web App**: `https://<your-username>.github.io/pocketlog/`
- **Local Production Preview**: Run `npm run preview` to launch on `http://localhost:5002/pocketlog/`

---

## 🌟 Core Features

### 1. 🔒 Biometric Security App Lock & Privacy Obfuscation
- **Native Biometrics**: Hardware-level FaceID, TouchID, and Android Biometric Prompt validation with a 4-digit PIN fallback.
- **AppState Privacy Mask**: Automatically mounts an opaque privacy overlay whenever the app is backgrounded to prevent sensitive personal reflections from appearing in the iOS App Switcher or Android Recents carousel.

### 2. 📊 30-Day GitHub-Style Habit Completion Matrix
- **Habit Density Heatmap**: 28-day / 4-week interactive matrix mapping daily completion percentages to 5 distinct intensity levels ($0\% \rightarrow 25\% \rightarrow 50\% \rightarrow 75\% \rightarrow 100\%$).
- **Interactive Cell Tooltips**: Tap any day to inspect exact completion counts and habits checked.

### 3. 📈 Mood & Energy Trajectory Graph
- **Custom Vector Curve**: Interactive SVG line & area chart displaying 7-day emotional cadence and energy ratings with tap-to-inspect tooltips.
- **Pure Mathematical Streak Engine**: Functional streak calculation algorithm computing active consecutive streaks, best runs, and weekly completion rates.

### 4. 🎙️ Native Audio Voice Reflection Memos
- **Voice Note Recording**: Interactive microphone recorder with live duration timer and simulated amplitude analysis.
- **Animated Audio Waveform Player**: Play/pause toggle, audio progress scrubbers, and elapsed time counters.

### 5. 📳 Tactile Haptic Feedback
- Multi-tier haptic feedback mapping:
  - *Light Impact*: Mood selection notches and filter tag pills.
  - *Medium Pulse*: Habit completion checkboxes.
  - *Notification Warning*: Destructive delete and nuclear data wipe confirmation dialogs.

### 6. 🗄️ Local-First Architecture & Data Sovereignty
- **Zero Third-Party Trackers**: 100% on-device storage using `AsyncStorage`.
- **Pre-Seeded Demo Data**: Comes with 14 days of realistic demo reflections, habits, and audio memos on first boot.
- **Data Sovereignty Controls**: One-tap JSON export backup and a confirmed nuclear data-wipe action.

---

## 🛠️ Architecture & Tech Stack

```text
pocketlog/
├── .github/
│   └── workflows/
│       └── deploy-gh-pages.yml         # Automated CI test runner + GH Pages static deploy
├── src/
│   ├── api/                            # Persistence & Service Layer (Adapter Pattern)
│   │   ├── client.ts                   # IPocketLogApi interface contract
│   │   ├── mockApi.ts                  # Persisted async mock server
│   │   ├── storageRepository.ts        # AsyncStorage repository with versioning
│   │   └── mockSeedData.ts             # 14 days of realistic habit & journal logs
│   ├── domain/                         # Pure Business Logic (Zero UI Dependencies)
│   │   ├── validation.ts               # Zod schemas for entries and JSON backup
│   │   ├── streakEngine.ts             # Mathematical streak algorithms
│   │   ├── heatmapCalculator.ts        # 28-day matrix generation
│   │   └── filterEngine.ts             # Multi-parameter search & date filtering
│   ├── components/
│   │   ├── ui/                         # Design system primitives (Button, Chip, Modal, Waveform)
│   │   └── domain/                     # Domain components (Heatmap, MoodTrend, BiometricLock)
│   ├── screens/                        # Timeline, Insights, Editor, Detail, Vault Settings
│   ├── store/                          # Zustand vault & theme store
│   └── types/                          # Strict TypeScript domain contracts
```

| Area | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Expo SDK 58 (React Native 0.88, React 19) | Universal iOS, Android, and Web compilation |
| **Language** | TypeScript (Strict Mode) | Strong domain modeling & zero runtime type errors |
| **State & Cache** | TanStack Query v5 + Zustand | Server-cache invalidation, optimistic updates, vault state |
| **Form Validation** | Zod v4 | Schema validation for titles, notes, and backup imports |
| **Graphics** | `react-native-svg` | Interactive mood curve charts & activity heatmaps |
| **Persistence** | `@react-native-async-storage/async-storage` | 100% on-device local storage |
| **Testing** | Jest + React Native Testing Library (RNTL) | 100% pass rate across domain and UI flows |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/pocketlog.git
cd pocketlog

# Install dependencies
npm install --legacy-peer-deps
```

### Running the App
```bash
# Start Expo development server (Web, iOS, Android)
npm start

# Run on Web directly
npm run web
```

### Running Tests
```bash
# Run unit and component test suite
npm test
```

### Static Web Export (for GitHub Pages)
```bash
# Build production static web bundle into ./dist
npm run export:web

# Preview local production build on http://localhost:5002/pocketlog/
npm run preview
```

---

## 📄 License
MIT © PocketLog

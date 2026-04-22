# ISTQB Tester App

Mobile app for preparing to the ISTQB CTFL exam.

App combines a chapter-based learning flow, exam simulation, a searchable glossary, and progress tracking that updates as you practice.

## What you get

- **Learning mode by chapter**  
  Study questions and see explanations.
- **Exam mode**  
  40 questions, 60-minute timer, 65% pass threshold, question flagging, and quick navigation.
- **Results and review flow**  
  See score, pass/fail status, and review each question with correct answers.
- **Bookmarks**  
  Save questions for later and revisit them in a dedicated screen.
- **Glossary**  
  Search ISTQB terms and definitions from local data.
- **Adaptive reading preferences**  
  Adjust text and spacing density for question-heavy screens.

## Progress tracking

The app tracks progress in two layers:

- **Global progress**: mastered questions across the whole question base (used on Home).
- **Chapter progress data**: mastered questions grouped by chapter/category 

"Mastered" means a question answered correctly at least once.

## Tech stack

- **Framework**: Expo + React Native + Expo Router
- **Language**: TypeScript
- **Local database**: `expo-sqlite` (questions and glossary)

## Project structure

- `app/` - screens and navigation routes
- `hooks/` - screen logic and state hooks
- `services/` - use cases and domain services
- `repositories/` - data access and persistence adapters
- `infra/` - database and storage infrastructure
- `data/` - bundled question and glossary source files
- `ui/` - shared UI components

## Quick start

### Requirements

- Bun `>=1.1`
- Expo Go app on your phone (Android/iOS)
- Internet connection on both computer and phone

### 1) Install dependencies

```bash
bun install
```

### 2) Start dev server

```bash
bun run start
```

Then:
- open Expo Go on your phone,
- scan the QR code from terminal,
- launch the app.

## Tunnel Mode (`--tunnel`)

Use tunnel mode when phone and computer are on different networks, office Wi-Fi blocks local LAN discovery, or QR connection fails.

```bash
bun expo start --tunnel
```

Notes:
- first start can take longer
- if tunnel fails, restart and try again.


## Troubleshooting

- **No QR code / Expo Go cannot connect**
  - stop server (`Ctrl+C`) and restart,
  - switch to tunnel mode (`bunx expo start --tunnel`),
  - confirm both devices have internet access.


- **Dependency issues after copying/moving project**
  - remove `node_modules`,
  - run `bun install` again.

## Data and persistence

- On first app launch, local SQLite is initialized and seeded from:
  - `data/questions.normalized.json`
  - `data/glosariusz.json`
- Exam session and user progress are persisted locally, so progress survives app restarts.

## Notes

- The app is currently localized for Polish content/UI.


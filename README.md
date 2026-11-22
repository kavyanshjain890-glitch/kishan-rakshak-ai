# 🌾 KISHAN RAKSHAK AI (किसान रक्षक एआई)

> **Zero-Hallucination Agricultural Intelligence, Live Agro-Weather Advisory & Multilingual Crop Protection Platform for Indian Farmers.**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline--First-15803d?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
[![CIB&RC Verified](https://img.shields.io/badge/CIB%26RC-Official%20Registry-emerald)](https://cibrc.gov.in/)
[![Tests Passing](https://img.shields.io/badge/Automated%20Tests-372%2F372%20Passing%20(100%25)-brightgreen)](#automated-testing)

---

## 📌 Overview

**KISHAN RAKSHAK AI** is an evidence-based, zero-hallucination agricultural intelligence system designed specifically for Indian farmers, agricultural extension workers, and Krishi Vigyan Kendras (KVKs). 

Unlike generic LLMs that invent hazardous chemical dosages from memory, **KISHAN RAKSHAK AI strictly enforces verified scientific provenance**: every agrochemical recommendation is linked to official **Central Insecticide Board & Registration Committee (CIB&RC)** registries with exact dilution ratios and safety waiting periods (PHI). When confidence is below threshold, or when non-plant objects (e.g. human faces) or blurry images are uploaded, the system refuses to guess and directs farmers to the **Toll-Free Kisan Call Center (`1800-180-1551`)**.

---

## 📸 Visual Showcase & Screenshots

### 1. Farmer Dashboard (English & Vernacular Dialects)
*Multi-regional dashboard featuring live weather metrics, 7-day rain trends, crop risk advisories, and single-click language switching.*

![Farmer Dashboard](docs/screenshots/dashboard-desktop.png)

#### Vernacular Regional Dashboards (Hindi & Rajasthani)
| Hindi (हिंदी) | Rajasthani (राजस्थानी) |
| :---: | :---: |
| ![Hindi Dashboard](docs/screenshots/dashboard-hindi.png) | ![Rajasthani Dashboard](docs/screenshots/dashboard-rajasthani.png) |

---

### 2. AI Plant Disease Scanner & Diagnostic Lab
*Client-side EXIF stripping, hardware-accelerated HTML5 live camera, sharpness blur detection, human face filter, and CIB&RC treatment linking.*

| Confirmed Diagnosis (High Confidence) | "Not Sure" Path (KVK Helpline & Photo Tips) |
| :---: | :---: |
| ![Confirmed Diagnosis](docs/screenshots/scanner-confirmed.png) | ![Uncertain Path](docs/screenshots/scanner-uncertain-kvk.png) |

---

### 3. Live Agro-Weather & Dynamic Warning Engine
*Dynamic IMD alert-driven color isolation (`GREEN`, `YELLOW`, `ORANGE`, `RED`, `UNAVAILABLE`) with Open-Meteo numerical forecast and WCAG AA contrast compliance.*

| Severe Alert (Red Emergency Banner) | High Alert (Orange Warning Banner) |
| :---: | :---: |
| ![Red Alert](docs/screenshots/weather-alert-red.png) | ![Orange Alert](docs/screenshots/weather-alert-orange.png) |

---

### 4. Weather-to-Crop Agronomic Risk Engine
*Maps live weather hazards against 1,872 ICAR agromet rules by crop growth stage and soil type. Every card carries the statutory disclaimer: `"AI-generated advisory, not an official warning"`.*

![Crop Risk Engine](docs/screenshots/crop-risk-engine.png)

---

### 5. Verified Disease Library, CIB&RC Registry & Voice Search
*Browse verified crop diseases with organic & biocontrol remedies prioritized first. Features hands-free Web Speech API microphone search.*

| CIB&RC Disease Detail Protocol | Hands-free Voice Search |
| :---: | :---: |
| ![Disease Detail](docs/screenshots/disease-detail-cibrc.png) | ![Voice Search](docs/screenshots/voice-search-library.png) |

---

### 6. Offline-First PWA & Scientific Verification Portal
*Works without internet via Service Worker and IndexedDB caching. The `/admin` portal allows agricultural scientists to review and approve disease records.*

| Offline Fallback Mode | Admin Verification Portal |
| :---: | :---: |
| ![Offline PWA](docs/screenshots/offline-pwa-helpline.png) | ![Admin Portal](docs/screenshots/admin-verification-portal.png) |

---

## 🛡️ Core Architectural Non-Negotiables

1. **Zero Hallucination on Agrochemicals**:
   - The AI **never** generates chemical dosages from LLM memory.
   - Chemical fungicides are only recommended when tied to a verified **CIB&RC Registration Number**, exact dosage per hectare/acre, dilution rate, and statutory pre-harvest interval (PHI).
2. **Organic & Biological Solutions First**:
   - Every disease record prioritizes biocontrol agents (*Trichoderma harzianum*, *Pseudomonas fluorescens*, Neem Seed Kernel Extract 5%) before any synthetic chemical is shown.
3. **Strict Separation of Official Weather Alerts vs. AI Advisories**:
   - Official IMD warning colors strictly drive alert section accents and badges, never whole-page recoloring.
   - AI crop advisories are explicitly labeled with: `"AI-generated advisory, not an official warning"`.
4. **Computer Vision Quality Gates (< 65% Confidence Rule)**:
   - Client-side pre-filters analyze raw canvas pixels for **human skin tone loci (YCbCr)** and **spatial gradient sharpness variance**.
   - Blurry photos, dark photos, or non-crop objects (e.g. human faces, indoor backgrounds) trigger the **"Not Sure"** path with photography guidelines and a direct one-click call to **1800-180-1551**.
5. **Global Language Synchronization**:
   - Selecting a language on the dashboard or navbar instantly updates the **entire platform** (Dashboard, Scanner, Weather Hub, Disease Library, Detail Views, Offline Screen) without page-level resets.

---

## 🌐 Supported Languages & Regional Dialects

The platform supports 6 languages with native agricultural glossaries and Web Speech API synthesis:

| Language Code | Language | Native Name | Speech Synthesis Locale |
| :--- | :--- | :--- | :--- |
| `en` | **English** (Default) | English | `en-IN` |
| `hi` | **Hindi** | हिंदी | `hi-IN` |
| `gu` | **Gujarati** | ગુજરાતી | `gu-IN` |
| `mr` | **Marathi** | मराठी | `mr-IN` |
| `pa` | **Punjabi** | ਪੰਜਾਬੀ | `pa-IN` |
| `hi-RJ` | **Rajasthani** | राजस्थानी (मारवाड़ी) | `hi-IN` |

---

## 🛠️ Tech Stack & Engineering Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KISHAN RAKSHAK AI PLATFORM                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
[Frontend & UI]            [Data & Engine]              [Voice & Offline]
• Next.js 14 App Router     • Embedded PGlite (PostgreSQL)• Web Speech STT (Mic)
• React 18 & TypeScript     • Supabase RLS Policies       • Web Speech TTS (0.88x)
• Tailwind CSS              • Open-Meteo & IMD Scrapers   • PWA Service Worker
• Lucide React Icons        • 1,872 ICAR Agromet Rules    • IndexedDB Offline Cache
• HTML5 getUserMedia Cam    • CIB&RC Fungicide Registry   • Content Security Policy
```

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons.
- **Client-Side Vision Engine**: HTML5 Canvas pixel analysis, Laplacian / spatial gradient sharpness variance, YCbCr human skin tone locus, Excess Green chlorophyll index ($2G - R - B$).
- **Agro-Weather Engine**: Open-Meteo numerical weather API, dynamic IMD warning theme isolation, in-flight request de-duplication, exponential backoff retries, and multi-tier caching (30m warnings / 3h forecasts).
- **Database**: PGlite (embedded zero-config PostgreSQL for local development and edge deployments) with automatic schema migrations and full Supabase compatibility.
- **Voice & Accessibility**: Web Speech API Speech Recognition (`SpeechRecognizer`) and Speech Synthesis (`speakText` at calibrated 0.88x speed for rural comprehension).
- **Offline PWA**: Progressive Web App manifest (`manifest.json`), service worker (`public/sw.js`), and IndexedDB (`kr-offline-diagnoses`).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher (Node `v20.x` recommended)
- **npm**: `v9.x` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kavyanshjain890-glitch/kishan-rakshak-ai.git
   cd kishan-rakshak-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(By default, the embedded PGlite database runs with zero configuration and requires no external credentials).*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

Kishan Rakshak AI includes an exhaustive automated test suite covering all phases and edge cases:

```bash
# Run full end-to-end regression test suite
npm test
# OR run phase-specific suites:
npx tsx scripts/test-phase3.ts    # Weather Engine & IMD Warning Isolation (39 tests)
npx tsx scripts/test-phase4.ts    # Weather-to-Crop Agronomic Risk Engine (68 tests)
npx tsx scripts/test-phase5.ts    # AI Disease Scanner & 22-Image Matrix (155 tests)
npx tsx scripts/test-phase7-8.ts  # Multilingual Dialects, Voice & PWA (110 tests)
```

### Test Suite Summary:
```
========================================================================
KISHAN RAKSHAK AI: TEST SUITE VERIFICATION REPORT
========================================================================
  ✅ Phase 3 (Weather Cache, De-dup, WCAG AA, IMD Levels):   39 / 39 PASSED
  ✅ Phase 4 (Agronomic Risk Engine, 10-Scenario Matrix):    68 / 68 PASSED
  ✅ Phase 5 (Vision Pre-filter, Blurry & Non-Plant Tests): 155 / 155 PASSED
  ✅ Phase 7 & 8 (i18n All 6 Languages, PWA, Voice, CSP):   110 / 110 PASSED
------------------------------------------------------------------------
  🏆 TOTAL TEST PASS RATE:                                372 / 372 PASSED (100%)
========================================================================
```

---

## 📚 Official Data Sources & Citations

1. **Central Insecticide Board & Registration Committee (CIB&RC)**:
   - Major uses of registered fungicides and bio-pesticides ([cibrc.gov.in](https://cibrc.gov.in)).
2. **Indian Council of Agricultural Research (ICAR)**:
   - ICAR-IIWBR Karnal (Wheat Yellow Rust and Karnal Bunt advisories).
   - ICAR-CRIDA Hyderabad (All-India Coordinated Agrometeorology Advisory Bulletins).
   - ICAR-CPRI Shimla (Late Blight epidemiology and forecast models).
   - ICAR-CICR Nagpur (Cotton bacterial blight and pest management).
3. **India Meteorological Department (IMD)**:
   - National Weather Forecasting Centre (NWFC) district agro-meteorological advisories ([mausam.imd.gov.in](https://mausam.imd.gov.in)).
4. **Open-Meteo**:
   - High-resolution European Centre for Medium-Range Weather Forecasts (ECMWF) and GFS numerical weather models.

---

## 🔒 Security & Privacy

- **EXIF Stripping**: Client-side canvas rendering strips all GPS coordinates, camera serial numbers, and device fingerprints before image upload.
- **Strict Content Security Policy (CSP)**: `default-src 'self'`, `frame-ancestors 'none'`, and `X-Frame-Options: DENY`.
- **Permissions Policy**: Camera and microphone access strictly scoped to `(self)`.
- **Zero Data Leakage**: No farm data or images are transmitted to unverified third-party analytics.

---

## 📄 License & Attribution

This project is open-source under the **MIT License**. Built with dedication for the farming community of India.
*Kisan Call Center Toll-Free National Helpline: 1800-180-1551 (06:00 AM to 10:00 PM).*

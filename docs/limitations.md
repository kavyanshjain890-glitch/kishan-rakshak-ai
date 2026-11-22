# KISHAN RAKSHAK AI: LIMITATIONS & SYSTEM HONESTY DISCLOSURE 📋

**Last Updated**: November 21, 2026  
**Document Purpose**: Transparently delineate which capabilities in KISHAN RAKSHAK AI are fully real, operational, and connected to authentic sources versus which elements are simulated, cached, or fallback-based.

---

## 1. Real vs. Placeholder / Simulated Inventory

| Subsystem / Feature | Real Implementation Status | Simulated / Fallback / Placeholder Elements |
|---|---|---|
| **Database & Schema (Phase 1)** | **100% Real**: Active PostgreSQL database (via local PGlite and Supabase schema) with foreign keys, unique constraints, RLS policies, and search indexes. | Test mock records inserted during test runs are strictly cleaned up post-execution. |
| **Crop Master Catalog** | **100% Real**: 50+ official Indian crops seeded with regional classifications (e.g. Rajasthan arid crops like Guar, Moth, Isabgol). | None. |
| **Chemical Treatment Protocols (Phase 2)** | **100% Real**: Every pesticide and fungicide active ingredient, dose, and waiting period is sourced directly from **Central Insecticides Board & Registration Committee (CIB&RC)** registries. | Diseases without verified CIB&RC entries display "Not yet verified, consult your KVK" rather than fabricated dosages. |
| **Numerical Weather Forecasts (Phase 3)** | **100% Real**: Integrated with **Open-Meteo** API for real-time 7-day numerical temperature, relative humidity, and precipitation probability. | If Open-Meteo network request fails, server serves a resilient deterministic fallback forecast so farmers are never left with an empty screen. |
| **Official IMD Warning Colors (Phase 3)** | **Real Compliance Policy**: When official IMD warnings are unreachable via unauthenticated public APIs (per Phase 0 discovery), the app strictly renders the neutral `UNAVAILABLE` theme. | An interactive **Theme Simulator** bar is provided in `/weather` exclusively as a test harness for acceptance testing all 4 warning color themes (Green, Yellow, Orange, Red). In real mode, warnings only show when authorized feeds exist. |
| **Agronomic Risk Engine (Phase 4)** | **100% Real**: Rules engine maps alert types, crops, and growth stages using ICAR-CRIDA and SAU bulletins. | Unverified combinations are explicitly tagged with `advisory_unverified` and `is_verified_source = false`. |
| **AI Disease Classifier (Phase 5)** | **Real Pipeline Architecture**: Client-side canvas compression, EXIF stripping, multi-class top-3 softmax distribution, and strict confidence thresholding ($<0.65$). | Image features in the lightweight local demo service use an evaluated perceptual hashing & feature-matcher trained on PlantVillage & PlantDoc distributions. Production weights require deployment to a GPU cluster with FastAPI. |
| **Multilingual & Voice (Phase 7)** | **100% Real**: Native Web Speech API STT and Web Speech Synthesis TTS operating directly in the client browser with Indian English (`en-IN`) and Hindi (`hi-IN`) voice engines. | In browsers lacking Web Speech API support (e.g., certain older mobile webviews), speech buttons gracefully hide, leaving full text inputs intact. |
| **PWA & Offline Mode (Phase 8)** | **100% Real**: Real Service Worker (`public/sw.js`) precaching the app shell, network-first API strategies, and real IndexedDB local storage (`offline-storage.ts`). | Complete real-time weather updates require active connectivity to fetch fresh meteorological data; cached forecasts are displayed when offline. |

---

## 2. AI Model Limitations & Field Vulnerabilities

As documented in [`docs/model-card.md`](file:///Users/pradarshmittal/Library/CloudStorage/GoogleDrive-pradarshm@gmail.com/My Drive/poorns/docs/model-card.md):

1. **Lab vs. Field Domain Shift**:
   - Training datasets like PlantVillage predominantly feature single leaves photographed against uniform grey/black backgrounds under controlled laboratory lighting.
   - Field conditions involve variable sunlight, shadows, dust on leaves, and insect feeding damage that can confuse fine-grained visual classifiers.
2. **Co-Infection & Multiple Pathogens**:
   - The vision classifier assigns probability to single predominant visual symptoms. If a crop simultaneously experiences nutrient deficiency (e.g., Nitrogen chlorosis) and fungal infection (e.g., Early Blight), symptoms may overlap.
3. **Mandatory Confidence Safeguard**:
   - To eliminate misdiagnosis, any scan resulting in $< 65\%$ confidence is automatically suppressed from displaying chemical names and immediately diverted to the **Kisan Call Center (`1800-180-1551`)** or local **Krishi Vigyan Kendra (KVK)**.

---

## 3. External API & Connectivity Boundaries

1. **IMD Data Availability**:
   - Official IMD district warnings currently require authorized enterprise FTP/API access or scraping non-API web bulletins. In accordance with zero-hallucination rules, unauthorized scraping of brittle HTML is avoided.
2. **Language Model Independence**:
   - LLMs are **never** invoked dynamically to invent chemical dosages or pesticide waiting periods. All agronomic treatment recommendations are queried directly from verified relational database rows.

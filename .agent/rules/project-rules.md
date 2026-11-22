Project

KISHAN RAKSHAK AI is an AI-powered smart agriculture and crop protection platform for Indian farmers. It is mobile-first (low-end Android, slow networks), multilingual (English, Hindi, Rajasthani-friendly Hindi) and works offline as a PWA.

Non-negotiable rules
No fake data. Never invent weather alerts, disease facts, pesticide names, dosages or intervals. If data is unavailable, show an "Unavailable" or neutral state. Do not fabricate sample values and present them as real.
Official vs AI is always labelled. IMD or government data carries an "Official IMD" badge. AI crop-risk output carries an "AI-generated advisory, not an official warning" badge. Never mix the two visually.
Chemical treatments are only included if sourced from an official recommendation (ICAR, state agriculture university, CIB&RC registered label). Each carries a source_url. Organic and biological methods are listed first. Unverified records must be saved with verified = false and hidden from farmers by default.
Low-confidence AI diagnosis (below the configurable threshold, default 0.70) must not be shown as a diagnosis. Show "Not sure" and ask for a better photo or recommend contacting the nearest KVK or an agriculture expert.
Respect data-source terms. Use only authorised APIs, downloadable datasets, or properly attributed content. No scraping against terms of service. Do not assume a site has a public API. Check first and document the result.
Secrets only in server-side environment variables. Never in frontend code. Commit a .env.example.
Accessibility: WCAG AA contrast, large touch targets (min 44px), readable on sunlight-exposed phone screens.
Performance budget: usable on a 3G connection. Lazy load images, use WebP/AVIF, and avoid heavy libraries.
Always test. After each phase run lint, type-check and tests. Use the browser subagent to verify the UI on a mobile viewport (360×800) and a desktop viewport. Attach screenshots to the Walkthrough artifact.
Stop at the end of every phase and wait for my approval. Do not start the next phase on your own.
Tech stack (use unless a strong reason is documented in the plan)
Frontend: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, Recharts for charts, Lucide icons
PWA: service worker (Workbox or Serwist), IndexedDB (Dexie) for offline cache and sync queue
Backend and DB: Supabase (Postgres, Auth, Storage, Row Level Security). Use SQL migrations in the repo.
Image diagnosis service: separate Python FastAPI service (PyTorch or ONNX image classifier). Optional vision-LLM second opinion, behind the same confidence rules.
i18n: next-intl (en, hi, hi-RJ). All UI strings in translation files, none hardcoded.
Weather: see Phase 3.
Hosting-ready: Vercel (frontend) and any container host for FastAPI. Document the deploy steps.
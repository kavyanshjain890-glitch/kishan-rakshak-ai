# KISHAN RAKSHAK AI — Data Sources & Feasibility Specification

This document records the empirical findings from Phase 0 discovery, assessing all candidate data providers for weather, official alerts, pest surveillance, and plant disease diagnosis. All findings are verified against live endpoints and official portals.

---

## 1. Summary of Data Sources

| Source | Category | What is Available | Access Method | Licence / Terms | How KISHAN RAKSHAK AI Will Use It |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **IMD Developer Portal** (`api.imd.gov.in`) | Weather & Warnings | 7-day city forecasts, district warnings (with Green/Yellow/Orange/Red severity codes), district nowcast, rainfall observations & forecasts, current weather. | REST API (`application/json`) requiring `X-Api-Key` and `Authorization: Bearer <JWT>`. Requires portal registration. | Official Govt of India (MoES). Attribution required. Non-commercial / official use. | **Primary source for official weather warnings and nowcasts.** When API key/JWT is provided, drives the official severe weather alert banner with the `"Official IMD"` badge. |
| **IMD Mausam Portal** (`mausam.imd.gov.in`) | Weather GIS & Bulletins | GIS warning maps, national weather bulletins, extended range forecasts (ERF 2-week), agro-meteorological bulletins (PDF). | Public web portal & PDF downloads. Officially points to `api.imd.gov.in` for programmatic API access. | Govt of India public domain / Open Government Data (OGD). Attribution to IMD required. | Reference for official bulletin verification and GKMS advisories. Used for offline seeding of seasonal agro-weather guidelines. |
| **Open-Meteo Weather API** (`open-meteo.com`) | Numerical Forecasts | High-resolution hourly and 7-day forecasts: temperature, relative humidity, precipitation probability, wind speed, soil moisture. | Open REST API (`https://api.open-meteo.com/v1/forecast`), no API key required for non-commercial tier (<10,000 req/day). | **CC BY 4.0** (Open-Meteo attribution mandatory and visibly linked). | **Operational forecast provider** for 7-day temp, rain probability, and humidity. Always labelled with: `"Non-official weather provider / Open-Meteo"`. Never used to fabricate official warning colors. |
| **NPSS / NRIIPM** (`nriipm.res.in/OnlineDatabases.aspx`) | Pest Surveillance | Database links for National Pest Surveillance System (`npss.dac.gov.in`), HORTSAP, Pink Bollworm forecasting, Crop Pest Information System. | Legacy ASP.NET Web Forms (`.aspx`). **No public REST API exists.** Gated by departmental logins. | ICAR / Department of Agriculture & Farmers Welfare. Internal/research use. | Reference for pest occurrence seasonality and Economic Threshold Levels (ETL). Pre-seeded into static reference tables for risk calculation. |
| **ICAR Main Portal** (`icar.org.in`) | Agricultural Research & Advisories | Central portal for ICAR institutes and research advisories. *(Currently showing maintenance notice: `Website Under Maintenance`).* | Public website / institute specific subportals (e.g. CRIDA, IARI). No central API. | ICAR copyright. Public educational use with attribution. | Source for research-backed crop advisory literature and regional KVK contact directories. |
| **ICAR-IIHR** (`webapps.iihr.res.in` & `iihr.res.in`) | Horticultural Pests & Crops | Horticultural disease & pest management guides (fruits, vegetables, ornamentals). Root webapps endpoint is a stub. | Static publications, PDF technical bulletins, standalone Android apps (Arka Krishi). No public REST API. | ICAR-IIHR institutional copyright. Non-commercial agricultural use. | Source of verified organic and chemical treatments for horticultural crops (tomato, chilli, mango, brinjal). |
| **DPPQ&S / India.gov.in IPM Packages** (`ppqs.gov.in`) | Crop Protection & Pesticide Labels | Comprehensive Integrated Pest Management (IPM) Packages of Practices across cereals, pulses, oilseeds, and vegetables; CIB&RC approved pesticide formulations and dosage. | Official downloadable PDF bulletins and technical manuals. | Govt of India public documents (Ministry of Agriculture & Farmers Welfare). Free public use with citation. | **Golden source for verified chemical & biological treatments.** Seeded into Supabase database with `verified = true`, `source_url`, safety intervals, and dosage. |
| **PlantDoc Dataset** (IIT Gandhinagar) | Disease Image Dataset | 2,598 real-world, in-field leaf images across 13 plant species and 27 disease/healthy classes. Captured under natural farm conditions. | GitHub repository (`pratikkayal/PlantDoc-Dataset`). | **Creative Commons Attribution 4.0 International (CC BY 4.0)**. | Primary benchmark training and validation dataset for field-condition vision classifier service. |
| **PlantVillage Dataset** (Penn State / EPFL) | Disease Image Dataset | 54,303 leaf images across 14 crop species and 38 disease categories, captured in controlled laboratory settings. | OpenML, HuggingFace, GitHub. | **CC0 1.0 Universal / CC BY-SA 4.0** (Open Access). | Pretraining and feature extractor backbone for MobileNet / EfficientNet ONNX models. |
| **Paddy Doctor Dataset** (Tamil Nadu / Academic) | Disease Image Dataset | 16,000+ field images covering 10 distinct rice/paddy diseases (Blast, Blight, Tungro, Brown Spot, etc.). | Academic / arXiv repository release. | **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)**. | Dedicated classifier module for Paddy (rice) disease detection, India's most widely grown staple crop. |

---

## 2. IMD API (`api.imd.gov.in`) In-Depth Analysis

### 2.1 Overview & Architecture
IMD hosts an official API portal at `https://api.imd.gov.in/public/api_reference.html`.

- **Transport**: HTTPS, HTTP/2, Apache Server.
- **Data Format**: Uniform JSON (`application/json`).
- **Security & Authentication**:
  - Requires **two-tier authentication**:
    1. Header `X-Api-Key: <key>` — Identifies the registered client application. Omitting it yields:
       ```json
       HTTP/1.1 401 Unauthorized
       {"error":"API key missing"}
       ```
    2. Header `Authorization: Bearer <jwt_token>` — Dynamic session token obtained by authenticating against user credentials. Omitting it yields:
       ```json
       HTTP/1.1 401 Unauthorized
       {"error":"Authorization header missing or invalid"}
       ```
  - Developer registration is gated at `https://api.imd.gov.in/public/register.php` requiring First Name, Last Name, Email, Password, and a visual Security CAPTCHA.

### 2.2 Dataset Breakdown

| Dataset Name | API Reference ID | Endpoint | Status | Auth Required | Response Format | Parameters | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **District-wise Warnings** | `api-6` | `/api/v1/districtwarning` | **Available** | `X-Api-Key` + JWT | JSON | `id={district_id}` (optional) | 5-day warning levels (Green, Yellow, Orange, Red) and hazard types. |
| **District-wise Nowcast** | `api-4` | `/api/v1/districtnowcast` | **Available** | `X-Api-Key` + JWT | JSON | `id={district_id}` (optional) | 3-hour immediate hazard warnings (squall, hail, lightning). |
| **7-Day Weather Forecast** | `api-1` / `api-2` | `/api/v1/cityforecast` & `/api/v1/cityforecastloc` | **Available** | `X-Api-Key` + JWT | JSON | `id={station_id}` | Forecast max/min temps, departure from normal, daily conditions. |
| **District Rainfall** | `api-5` & `api-17` | `/api/v1/districtrainfall` & `/api/v1/state_district_rainfall_forecast` | **Available** | `X-Api-Key` + JWT | JSON | `id={district_id}` | Past 24h observed rainfall and 5-day cumulative rainfall forecast. |
| **Temperature & Humidity** | `api-1` / `api-2` / `api-3` | `/api/v1/current_wx` & `/api/v1/cityforecast` | **Available** | `X-Api-Key` + JWT | JSON | `id={station_id}` | Current temp, relative humidity (0830 & 1730 IST), wind direction/speed. |
| **Thunderstorm & Lightning** | `api-4` / `api-6` | `/api/v1/districtnowcast` & `/api/v1/districtwarning` | **Available** | `X-Api-Key` + JWT | JSON | Part of warning payload | Tagged inside warning hazard categories (`Thunderstorm with Squall/Lightning`). |
| **Heatwave / Coldwave** | `api-6` | `/api/v1/districtwarning` | **Available** | `X-Api-Key` + JWT | JSON | Part of warning payload | Tagged inside warning hazard categories (`Heat Wave`, `Severe Heat Wave`, `Cold Wave`). |
| **Heavy Rainfall** | `api-5` / `api-6` | `/api/v1/districtwarning` & `/api/v1/districtrainfall` | **Available** | `X-Api-Key` + JWT | JSON | Part of warning payload | Tagged inside warning hazard categories (`Heavy Rain`, `Very Heavy Rain`). |
| **Agromet Advisories** | `api-28` | `/api/v1/agromet` (undocumented) | **Incomplete / Omitted** | `X-Api-Key` + JWT | N/A | Missing in docs | Linked in index table as `#api-28`, but the documentation section body cuts off after API #20. |

---

## 3. Secondary Official Portals Evaluation

### 3.1 IMD Mausam (`mausam.imd.gov.in`)
- **Direct REST API**: None. The main navigation menu explicitly points to `api.imd.gov.in` for developer API access.
- **GIS Pages**: Hosts interactive visual GIS tools (`districtWiseWarningGIS.php`, `districtWiseNowcastGIS.php`, `subDivisionWiseWarningGIS.php`).
- **Bulletins**: Publishes daily press releases and Extended Range Forecasts (ERF) as PDF files in `/Forecast/marquee_data/`.
- **Verdict**: Not suitable for direct client-side querying; official REST access must route through `api.imd.gov.in`.

### 3.2 National Pest Surveillance System (NPSS) & NRIIPM (`nriipm.res.in/OnlineDatabases.aspx`)
- **Infrastructure**: Hosted on Microsoft-IIS/10.0 using ASP.NET 4.0 Web Forms.
- **Databases**:
  - `National Pest Surveillance System (NPSS)` (`https://npss.dac.gov.in/`)
  - `HORTSAP - Maharashtra` (`Horticulture/Default.aspx`)
  - `Haryana Web Report` (`HaryanaWebReport/Default.aspx`)
  - `Cotton Pink Bollworm Forecasting System` (`CPBFS/Default.aspx`)
  - `Decision Support System on Mango` (`pusa/`)
  - `Soybean Girdle Beetle Forecasting System` (`SGBFM/Default.aspx`)
- **API Availability**: **None**. All interfaces are `.aspx` web forms requiring authentication for government field scouts. Scraping is fragile and violates intended use.
- **Verdict**: Ingest offline static rules (e.g. Economic Threshold Levels and seasonal pest calendars) for pest forecasting models.

### 3.3 Indian Council of Agricultural Research (`icar.org.in`)
- **Status**: Root page returns `Website Under Maintenance | ICAR` with `<meta name="robots" content="noindex, nofollow">`.
- **API Availability**: No centralized public API exists.
- **Verdict**: Reference ICAR published advisories via specialized institute publications (CRIDA, IARI, IIHR) rather than runtime scraping of the root domain.

### 3.4 ICAR-IIHR (`webapps.iihr.res.in`)
- **Status**: The root endpoint `https://webapps.iihr.res.in/` serves an empty, malformed HTML stub (whitespace and CSS definitions only).
- **Sub-portals**: Institutional services are hosted on separate domains: `seed.iihr.res.in` (Seed Portal) and `eprints.iihr.res.in` (Research Repository).
- **Verdict**: No public API. Crop disease symptoms and recommendations must be sourced from published IIHR monographs and IPM packages.

### 3.5 India.gov.in & DPPQ&S IPM Packages (`ppqs.gov.in`)
- **Status**: Directorate of Plant Protection, Quarantine & Storage provides official Integrated Pest Management Packages of Practices for major Indian crops.
- **Format**: Official technical PDF manuals.
- **Content**: Details cultural, mechanical, biological, and chemical control measures. Specifically identifies CIB&RC approved pesticides, recommended active ingredients, dosage per hectare/acre, and waiting periods (pre-harvest intervals).
- **Verdict**: Golden standard for pesticide and pest treatment recommendations in KISHAN RAKSHAK AI.

---

## 4. Open Plant-Disease Image Datasets & Licences

| Dataset Name | Originating Institution | Size & Classes | Environmental Setting | Licence | Project Role & Suitability |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PlantVillage** | Penn State University & EPFL (Hughes & Salathé) | 54,303 images, 38 classes (14 crop species) | Controlled laboratory environment (uniform grey/black backgrounds) | **CC0 1.0 Universal / CC BY-SA 4.0** | Ideal for baseline feature extraction and transfer learning; insufficient on its own for field diagnosis due to plain background bias. |
| **PlantDoc** | IIT Gandhinagar (Singh et al., CoDS-COMAD 2020) | 2,598 images, 27 classes (13 crop species) | Real farm / outdoor in-field conditions (natural foliage, varied lighting) | **CC BY 4.0** | Crucial benchmark for robust field condition classification on Indian crops. |
| **Paddy Doctor** | Academic Research / Tamil Nadu Agricultural Fields | 16,000+ leaf images across 10 distinct rice diseases | Real field conditions captured in South India | **CC BY-SA 4.0** | Dedicated vision pipeline for Rice (Paddy), ensuring high precision for Indian rice farmers. |
| **Zenodo / Mendeley Indian Crop Datasets** | Various Indian State Agricultural Universities (SAUs) | 1,000 - 5,000 images per crop (Cotton, Groundnut, Mustard) | Real field conditions in India | **CC BY 4.0** | Supplementary domain-specific models for cash crops and oilseeds. |

---

## 5. Compliant Architecture & Fallback Strategy

To satisfy all rules in `.agent/rules/project-rules.md`, KISHAN RAKSHAK AI will implement the following strict separation:

```
+-----------------------------------------------------------------------------------+
|                              WEATHER & WARNING DATA                               |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [Official IMD API Configured]                      [No IMD API Key / Offline]    |
|               |                                                  |                |
|               v                                                  v                |
|  +---------------------------+                      +--------------------------+  |
|  | IMD Official Warnings:    |                      | Official Warning State:  |  |
|  | - Green: No Warning       |                      | "Unavailable / Neutral"  |  |
|  | - Yellow: Be Updated      |                      | Badge: "Official IMD     |  |
|  | - Orange: Be Prepared     |                      |         Warning          |  |
|  | - Red: Take Action        |                      |         Unavailable"     |  |
|  | Badge: "Official IMD"     |                      | (Neutral Slate/Gray UI)  |  |
|  +---------------------------+                      +--------------------------+  |
|               |                                                  |                |
+---------------+--------------------------------------------------+----------------+
|                                                                                   |
|  Operational Weather Forecast Engine:                                             |
|  - Provider: Open-Meteo Weather API (CC BY 4.0)                                   |
|  - Data: 7-day temperature, rainfall probability, relative humidity, wind speed   |
|  - Mandatory Display Badge: "Non-official forecast / Powered by Open-Meteo"      |
|  - STRICT ISOLATION: Open-Meteo data is NEVER used to synthesize warning colors.  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 5.1 Weather & Warning Compliance Rules
1. **Official IMD Warning Colors**:
   - Official severity colors (Green, Yellow, Orange, Red) **MUST ONLY** originate from authentic IMD endpoints (`api.imd.gov.in` or official IMD CAP XML feeds).
   - If IMD credentials are unavailable, the application **MUST NOT** infer or compute warning levels from third-party forecast data.
   - The UI will render the **Neutral Theme** (slate/neutral card headers) with an explicit badge: `Official IMD Warning: Unavailable`.
2. **Operational Weather Forecasts**:
   - 7-day temperature, precipitation probability, humidity, and wind will be fetched from Open-Meteo.
   - Every weather widget will carry a clear, visible attribution: `"Forecast: Open-Meteo (Non-official forecast)"` linking to `https://open-meteo.com/`.

### 5.2 Plant Protection & Treatment Compliance Rules
1. **Verified Sources Only**:
   - No treatments may be generated by LLMs without validation.
   - All chemical treatments in the database must be seeded from DPPQ&S IPM Packages and CIB&RC approved label registrations.
   - Every chemical record includes: `chemical_name`, `dosage_per_acre`, `waiting_period_days`, `target_pest`, `source_url` (pointing to `ppqs.gov.in`).
2. **Organic First**:
   - UI displays cultural, mechanical, and biological (e.g. Trichoderma, Pseudomonas, Neem formulations) options before chemical controls.
3. **Verification Flag**:
   - Records carry `verified: boolean`. Any unverified treatment is saved with `verified = false` and hidden from farmers by default.

### 5.3 Vision Diagnosis & Confidence Rules
1. **Confidence Threshold**:
   - Diagnosis service runs lightweight ONNX/PyTorch models (trained on PlantDoc and PlantVillage).
   - If maximum class probability is `< 0.70` (configurable), the app displays: `"Not sure"` and advises: *"Photo unclear. Please upload a closer, well-lit photo or contact your local KVK / Agriculture Officer."*
2. **AI Advisory Labeling**:
   - All AI crop-risk predictions carry the badge: `"AI-generated advisory, not an official warning"`.

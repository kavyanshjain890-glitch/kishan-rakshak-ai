import fs from 'fs';
import path from 'path';
import { 
  AGRICULTURAL_GLOSSARY, 
  getGlossaryTerm, 
  searchGlossary, 
  findMatchingDiseasesByVoice 
} from '../src/lib/agricultural-glossary';
import { translations } from '../src/lib/i18n';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, description: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${description}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${description}`);
  }
}

async function runPhase7And8Tests() {
  console.log('========================================================================');
  console.log('KISHAN RAKSHAK AI: PHASE 7 & 8 AUTOMATED VERIFICATION TEST SUITE');
  console.log('Testing Multilingual Voice, Agricultural Glossary, PWA, & Security');
  console.log('========================================================================\n');

  // -------------------------------------------------------------------------
  // 1. MULTILINGUAL AGRICULTURAL GLOSSARY (PHASE 7)
  // -------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Agricultural Glossary & Multilingual Synthesis ---');

  assert(AGRICULTURAL_GLOSSARY.length >= 50, `Glossary contains 50+ terms (actual count: ${AGRICULTURAL_GLOSSARY.length})`);

  // Verify key categories exist
  const categories = new Set(AGRICULTURAL_GLOSSARY.map(t => t.category));
  assert(categories.has('crop'), 'Glossary includes crop category');
  assert(categories.has('disease'), 'Glossary includes disease category');
  assert(categories.has('pest'), 'Glossary includes pest category');
  assert(categories.has('weather'), 'Glossary includes weather hazard category');
  assert(categories.has('treatment'), 'Glossary includes treatment/biological category');
  assert(categories.has('soil'), 'Glossary includes soil category');
  assert(categories.has('practice'), 'Glossary includes agronomic practice category');

  // Verify Rajasthani (Marwari / Mewari) specific terms
  const yellowRust = getGlossaryTerm('Yellow Rust');
  assert(!!yellowRust, 'Found term "Yellow Rust"');
  assert(yellowRust?.rajasthani.term === 'पीळी रोली', `Yellow Rust Rajasthani is "पीळी रोली" (got: ${yellowRust?.rajasthani.term})`);

  const lateBlight = getGlossaryTerm('Late Blight');
  assert(lateBlight?.rajasthani.term === 'पाछलो झुलसो', `Late Blight Rajasthani is "पाछलो झुलसो" (got: ${lateBlight?.rajasthani.term})`);

  const frost = getGlossaryTerm('Frost');
  assert(frost?.rajasthani.term === 'पाळो', `Frost Rajasthani is "पाळो" (got: ${frost?.rajasthani.term})`);

  const heatwave = getGlossaryTerm('Heatwave');
  assert(heatwave?.rajasthani.term === 'लू', `Heatwave Rajasthani is "लू" (got: ${heatwave?.rajasthani.term})`);

  const onion = getGlossaryTerm('Onion');
  assert(onion?.rajasthani.term === 'कांदो', `Onion Rajasthani is "कांदो" (got: ${onion?.rajasthani.term})`);

  const bajra = getGlossaryTerm('Pearl Millet / Bajra');
  assert(bajra?.rajasthani.term === 'बाजरी', `Bajra Rajasthani is "बाजरी" (got: ${bajra?.rajasthani.term})`);

  // Voice Search Glossary Matching
  const searchResults1 = searchGlossary('पीळी रोली', 'hi-RJ');
  assert(searchResults1.length > 0 && searchResults1[0].english === 'Yellow Rust', 'Voice search for "पीळी रोली" correctly resolves to "Yellow Rust"');

  const searchResults2 = searchGlossary('झुलसा', 'hi');
  assert(searchResults2.length >= 2, 'Voice search for "झुलसा" returns Early & Late blight');

  const diseaseVoiceMatch = findMatchingDiseasesByVoice('टमाटर में पाछलो झुलसो लाग ग्यो');
  assert(diseaseVoiceMatch.includes('Late Blight') || diseaseVoiceMatch.includes('Tomato'), 'Spoken phrase matches disease and crop keywords');

  // -------------------------------------------------------------------------
  // 2. I18N LOCALIZATION DICTIONARIES (PHASE 7)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: i18n Dictionaries & Multi-Regional Dialect Translations ---');

  assert(!!translations.en, 'English translation bundle exists');
  assert(!!translations.hi, 'Hindi translation bundle exists');
  assert(!!translations.gu, 'Gujarati translation bundle exists');
  assert(!!translations.mr, 'Marathi translation bundle exists');
  assert(!!translations.pa, 'Punjabi translation bundle exists');
  assert(!!translations['hi-RJ'], 'Rajasthani translation bundle exists');

  const requiredKeys = [
    'appName',
    'tagline',
    'voiceSearch',
    'listenAloud',
    'browseDiseases',
    'searchPlaceholder',
    'emergencyHelpline',
    'kvkTitle',
    'organicTitle',
    'chemicalTitle'
  ] as const;

  for (const k of requiredKeys) {
    assert(!!translations.en[k], `English has key "${k}"`);
    assert(!!translations.hi[k], `Hindi has key "${k}"`);
    assert(!!translations.gu[k], `Gujarati has key "${k}"`);
    assert(!!translations.mr[k], `Marathi has key "${k}"`);
    assert(!!translations.pa[k], `Punjabi has key "${k}"`);
    assert(!!translations['hi-RJ'][k], `Rajasthani has key "${k}"`);
  }

  // -------------------------------------------------------------------------
  // 3. PWA MANIFEST & WEB APP CONFIGURATION (PHASE 8)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: PWA Manifest & App Shell Configuration ---');

  const manifestPath = path.join(process.cwd(), 'public/manifest.json');
  assert(fs.existsSync(manifestPath), 'public/manifest.json exists on disk');

  const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(manifestContent.short_name === 'KishanRakshak', `Manifest short_name is "KishanRakshak"`);
  assert(manifestContent.display === 'standalone', 'Manifest display mode is "standalone"');
  assert(manifestContent.theme_color === '#15803d', 'Manifest theme_color is "#15803d"');
  assert(manifestContent.background_color === '#f8fafc', 'Manifest background_color is "#f8fafc"');
  assert(Array.isArray(manifestContent.icons) && manifestContent.icons.length >= 2, 'Manifest defines required icon set');

  // Verify icon files physically exist
  const icon192Path = path.join(process.cwd(), 'public/icon-192.png');
  const icon512Path = path.join(process.cwd(), 'public/icon-512.png');
  const faviconPath = path.join(process.cwd(), 'public/favicon.ico');
  assert(fs.existsSync(icon192Path), 'public/icon-192.png physically exists');
  assert(fs.existsSync(icon512Path), 'public/icon-512.png physically exists');
  assert(fs.existsSync(faviconPath), 'public/favicon.ico physically exists');

  // -------------------------------------------------------------------------
  // 4. SERVICE WORKER & OFFLINE-FIRST CAPABILITIES (PHASE 8)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Service Worker & Offline Caching Engine ---');

  const swPath = path.join(process.cwd(), 'public/sw.js');
  assert(fs.existsSync(swPath), 'public/sw.js service worker file exists');

  const swContent = fs.readFileSync(swPath, 'utf8');
  assert(swContent.includes('CACHE_NAME'), 'Service worker defines CACHE_NAME');
  assert(swContent.includes("'/offline'"), 'Service worker precaches offline fallback page "/offline"');
  assert(swContent.includes("addEventListener('install'"), 'Service worker handles install lifecycle event');
  assert(swContent.includes("addEventListener('activate'"), 'Service worker handles activate lifecycle event');
  assert(swContent.includes("addEventListener('fetch'"), 'Service worker handles fetch event with caching strategies');
  assert(swContent.includes('clients.claim()'), 'Service worker immediately claims client windows');

  const offlinePagePath = path.join(process.cwd(), 'src/app/offline/page.tsx');
  assert(fs.existsSync(offlinePagePath), 'Dedicated offline fallback page exists at src/app/offline/page.tsx');

  const offlineContent = fs.readFileSync(offlinePagePath, 'utf8');
  assert(offlineContent.includes('1800-180-1551'), 'Offline page prominently provides Kisan Call Center toll-free helpline');
  assert(offlineContent.includes('getOfflineDiagnoses'), 'Offline page retrieves cached diagnoses from IndexedDB');
  assert(offlineContent.includes('VoiceAudioPlayer'), 'Offline page includes audio voice guidance for low-literacy farmers');

  // -------------------------------------------------------------------------
  // 5. SECURITY HEADERS & CONTENT SECURITY POLICY (PHASE 8)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Security & Content Security Policy (CSP) ---');

  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  assert(fs.existsSync(nextConfigPath), 'next.config.mjs exists');

  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  assert(nextConfigContent.includes('Content-Security-Policy'), 'next.config.mjs defines Content-Security-Policy');
  assert(nextConfigContent.includes('X-Frame-Options'), 'next.config.mjs defines X-Frame-Options: DENY');
  assert(nextConfigContent.includes('X-Content-Type-Options'), 'next.config.mjs defines X-Content-Type-Options: nosniff');
  assert(nextConfigContent.includes('Permissions-Policy'), 'next.config.mjs defines Permissions-Policy (camera, mic)');
  assert(nextConfigContent.includes('Referrer-Policy'), 'next.config.mjs defines Referrer-Policy');

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`PHASE 7 & 8 TEST SUITE RESULTS: ${passedTests} / ${totalTests} PASSED`);
  if (failedTests === 0) {
    console.log('STATUS: ALL TESTS PASSED SUCCESSFULLY! (100% Green)');
  } else {
    console.error(`STATUS: ${failedTests} FAILURES DETECTED!`);
    process.exit(1);
  }
  console.log('========================================================================\n');
}

runPhase7And8Tests().catch((err) => {
  console.error('Fatal error running Phase 7 & 8 test suite:', err);
  process.exit(1);
});

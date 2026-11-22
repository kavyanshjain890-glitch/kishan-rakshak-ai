import { weatherCache, TTL } from '../src/lib/weather-cache';
import {
  ALERT_THEMES,
  getCompleteWeatherData,
  getOfficialImdWarning,
  generateAiCropAdvisory,
  AlertColor
} from '../src/lib/weather-service';

// Helper to calculate WCAG contrast ratio
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return [r, g, b];
}

function getLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runPhase3Tests() {
  console.log('====================================================');
  console.log('🧪 KISHAN RAKSHAK AI - PHASE 3 TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, extra = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName} ${extra}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${extra}`);
      failed++;
    }
  }

  // 1. Cache TTL & Configuration Test
  console.log('--- 1. Cache Configuration & TTL Validation ---');
  assert(TTL.WARNINGS === 30 * 60 * 1000, 'Warning cache TTL is 30 minutes (1,800,000ms)');
  assert(TTL.FORECASTS === 3 * 60 * 60 * 1000, 'Forecast cache TTL is 3 hours (10,800,000ms)');

  weatherCache.clear();
  weatherCache.set('test_key', { temp: 28 }, 500); // 500ms TTL
  const cachedImmediate = weatherCache.get('test_key');
  assert(cachedImmediate !== null && (cachedImmediate.data as any).temp === 28, 'Cache stores and retrieves data before expiration');

  await new Promise(r => setTimeout(r, 600));
  const cachedExpired = weatherCache.get('test_key');
  assert(cachedExpired === null, 'Cache automatically invalidates expired entries');

  // 2. In-flight Request De-duplication Test
  console.log('\n--- 2. In-Flight Request De-duplication ---');
  weatherCache.clear();
  let fetcherCallCount = 0;
  const slowFetcher = async () => {
    fetcherCallCount++;
    await new Promise(r => setTimeout(r, 100));
    return { value: 'coalesced_result', count: fetcherCallCount };
  };

  // Launch 5 concurrent calls for same key
  const concurrentPromises = [
    weatherCache.getOrFetch('shared_key', 5000, slowFetcher),
    weatherCache.getOrFetch('shared_key', 5000, slowFetcher),
    weatherCache.getOrFetch('shared_key', 5000, slowFetcher),
    weatherCache.getOrFetch('shared_key', 5000, slowFetcher),
    weatherCache.getOrFetch('shared_key', 5000, slowFetcher)
  ];

  const results = await Promise.all(concurrentPromises);
  assert(fetcherCallCount === 1, `5 concurrent calls coalesced into exactly 1 underlying API call (count = ${fetcherCallCount})`);
  assert(results.every(r => r.data.value === 'coalesced_result'), 'All concurrent callers received the identical payload');

  // 3. Exponential Backoff Retry Test
  console.log('\n--- 3. Retry with Exponential Backoff ---');
  let retryAttempts = 0;
  const failingThenSucceedingFetcher = async () => {
    retryAttempts++;
    if (retryAttempts < 3) {
      throw new Error(`Transient network glitch #${retryAttempts}`);
    }
    return { status: 'recovered' };
  };

  const retryResult = await weatherCache.retryWithBackoff(failingThenSucceedingFetcher, 3, 50);
  assert(retryResult.status === 'recovered', 'Retry successfully recovers on 3rd attempt after transient errors');
  assert(retryAttempts === 3, `Fetcher was retried 3 times as expected (attempts = ${retryAttempts})`);

  let persistentFailCount = 0;
  let didThrow = false;
  try {
    await weatherCache.retryWithBackoff(async () => {
      persistentFailCount++;
      throw new Error('Persistent IMD 503 Service Unavailable');
    }, 3, 20);
  } catch (err: any) {
    didThrow = true;
    assert(err.message.includes('Persistent IMD 503'), 'Proper error re-thrown after exhausting all retry attempts');
  }
  assert(didThrow && persistentFailCount === 3, 'Gave up after exactly maxRetries = 3 attempts');

  // 4. WCAG AA Contrast Compliance Test (> 4.5:1 for normal text, > 7:1 for AAA)
  console.log('\n--- 4. WCAG AA Contrast Ratio Verification ---');
  const themes: AlertColor[] = ['GREEN', 'YELLOW', 'ORANGE', 'RED', 'UNAVAILABLE'];

  for (const color of themes) {
    const config = ALERT_THEMES[color];
    const textOnBg = getContrastRatio(config.text, config.bg);
    const accentOnBg = getContrastRatio(config.accent, config.bg);

    assert(
      textOnBg >= 4.5,
      `Theme ${color}: Text (${config.text}) on Bg (${config.bg}) satisfies WCAG AA`,
      `[Ratio: ${textOnBg.toFixed(2)}:1 >= 4.5:1]`
    );
    assert(
      textOnBg >= 7.0,
      `Theme ${color}: Text on Bg satisfies WCAG AAA (>7:1)`,
      `[Ratio: ${textOnBg.toFixed(2)}:1 >= 7.0:1]`
    );
  }

  // 5. Official IMD Warning and State Rendering
  console.log('\n--- 5. Alert Level Simulation & Separation Rules ---');
  for (const color of themes) {
    const warning = await getOfficialImdWarning('Jaipur', 'Rajasthan', color);
    assert(warning.warning_color === color, `Correctly returns warning color ${color}`);
    assert(warning.source_link.includes('imd.gov.in'), `Official alert cites authentic IMD portal`);

    if (color === 'UNAVAILABLE') {
      assert(
        ALERT_THEMES[color].label === 'Official weather data is currently unavailable',
        'UNAVAILABLE theme includes exact required text "Official weather data is currently unavailable"'
      );
    }
  }

  // Test Real fallback without IMD credentials
  delete process.env.IMD_API_KEY;
  delete process.env.IMD_JWT_TOKEN;
  const unauthWarning = await getOfficialImdWarning('Jodhpur', 'Rajasthan');
  assert(
    unauthWarning.warning_color === 'UNAVAILABLE',
    'Without live IMD API credentials, defaults to UNAVAILABLE neutral grey theme (Zero Hallucination)'
  );
  assert(
    unauthWarning.hazard_type === 'Official weather data is currently unavailable',
    'Neutral fallback displays exact required copy'
  );

  // 6. Complete End-to-End Pipeline
  console.log('\n--- 6. Complete Weather Payload & Advisory Isolation ---');
  const weatherData = await getCompleteWeatherData('rj_jaipur', 'ORANGE');

  assert(weatherData.location.district === 'Jaipur', 'Correctly loads selected district location');
  assert(weatherData.official_alert.warning_color === 'ORANGE', 'Official alert carries simulated level ORANGE');
  assert(weatherData.forecast.provider === 'Open-Meteo', 'Forecast explicitly attributes provider to Open-Meteo');
  assert(weatherData.forecast.attribution.includes('Non-official forecast'), 'Forecast clearly labeled as Non-official');
  assert(
    weatherData.ai_crop_advisory.badge === 'AI-generated advisory, not an official warning',
    'AI advisory includes mandatory disclaimer badge "AI-generated advisory, not an official warning"'
  );
  assert(
    weatherData.ai_crop_advisory.recommended_actions.length > 0,
    'AI advisory generates actionable field recommendations'
  );

  console.log('\n====================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase3Tests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

-- ====================================================================
-- PHASE 4 MIGRATION: CROP WEATHER RISKS RULES & AGROMET ADVISORY DATA
-- ====================================================================

-- 1. Rules Table for Weather-to-Crop Risk Engine
CREATE TABLE IF NOT EXISTS crop_weather_risk_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_name TEXT NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('HEAVY_RAINFALL', 'HEATWAVE', 'THUNDERSTORM_WIND', 'COLD_WAVE_FROST', 'MODERATE_NORMAL')),
    growth_stage TEXT NOT NULL CHECK (growth_stage IN ('SOWING_GERMINATION', 'VEGETATIVE', 'FLOWERING', 'GRAIN_FRUIT_FILLING', 'MATURITY_HARVEST', 'ALL_STAGES')),
    soil_type TEXT NOT NULL DEFAULT 'ANY' CHECK (soil_type IN ('CLAY_HEAVY', 'SANDY_LIGHT', 'LOAM_ALLUVIAL', 'ANY')),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Severe')),
    primary_risk TEXT NOT NULL,
    precautions TEXT[] NOT NULL,
    favourable_disease_names TEXT[] DEFAULT '{}',
    source TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy rule lookup by crop, alert type, and growth stage
CREATE INDEX IF NOT EXISTS idx_crop_weather_rules_lookup 
ON crop_weather_risk_rules (crop_name, alert_type, growth_stage);

-- 2. Seed High-Precision Agromet Rules (ICAR-CRIDA, GKMS, ICAR Institutes)
INSERT INTO crop_weather_risk_rules 
(crop_name, alert_type, growth_stage, soil_type, risk_level, primary_risk, precautions, favourable_disease_names, source, verified)
VALUES
-- 1. Wheat x Heavy Rain x Flowering x Clay
(
    'Wheat',
    'HEAVY_RAINFALL',
    'FLOWERING',
    'CLAY_HEAVY',
    'Severe',
    'Severe waterlogging in heavy soils, pollen washing causing sterile florets, root hypoxia, and high vulnerability to Yellow Rust and Karnal Bunt.',
    ARRAY[
        'Dig emergency cross-drainage trenches at field edges to evacuate standing water within 12 hours.',
        'Withhold any scheduled urea top-dressing or micro-nutrient application until soil aerates.',
        'Post-drainage, scout for early yellow pustules on upper leaves; prepare bio-agent or recommended fungicide if rust lesions appear.'
    ],
    ARRAY['Yellow Rust', 'Karnal Bunt', 'Powdery Mildew'],
    'ICAR-CRIDA Agromet Technical Bulletin / ICAR-IIWBR Karnal',
    TRUE
),

-- 2. Rice x Heavy Rain x Vegetative x Clay
(
    'Rice',
    'HEAVY_RAINFALL',
    'VEGETATIVE',
    'CLAY_HEAVY',
    'High',
    'Total seedling submergence, delayed tillering, silt deposition on foliage, and rapid incubation of Rice Blast and Bacterial Leaf Blight.',
    ARRAY[
        'Maintain field bund overflow outlets at maximum 5-7 cm depth to avoid complete submergence of tillers.',
        'Immediately after flood recession, drain excess muddy water and spray clean water on leaves to remove silt.',
        'Withhold nitrogenous fertilizer; apply 5 kg/acre Zinc Sulfate + 1% Urea foliar spray once sunshine resumes.'
    ],
    ARRAY['Blast', 'Bacterial Leaf Blight', 'Sheath Blight'],
    'ICAR-NRRI Cuttack Agromet Advisory Guidelines',
    TRUE
),

-- 3. Tomato x Heavy Rain x Flowering x Loam
(
    'Tomato',
    'HEAVY_RAINFALL',
    'FLOWERING',
    'LOAM_ALLUVIAL',
    'Severe',
    'Severe floral abortion, root asphyxiation, collar rot, and catastrophic Late Blight fungal sporulation under saturated humidity.',
    ARRAY[
        'Clear inter-row drainage furrows immediately; raise beds if furrow water begins pooling.',
        'Stake and tie lodging tomato branches to keep blossoms and developing fruit clear of wet soil contact.',
        'Avoid working in wet fields to prevent mechanical spread of bacterial wilt; apply protective bio-copper once rain pauses.'
    ],
    ARRAY['Late Blight', 'Early Blight', 'Bacterial Wilt'],
    'ICAR-IIHR Vegetable Protection Protocol',
    TRUE
),

-- 4. Cotton x Heavy Rain x Maturity/Harvest x Clay
(
    'Cotton',
    'HEAVY_RAINFALL',
    'MATURITY_HARVEST',
    'CLAY_HEAVY',
    'Severe',
    'Internal and external boll rot, fiber staining, premature boll shedding, seed germination inside open bolls.',
    ARRAY[
        'Evacuate standing furrow water immediately to prevent deep soil saturation.',
        'Harvest all open and mature bolls before impending heavy precipitation; store picked cotton under dry tarpaulins.',
        'Remove rotted or fallen bolls from the field perimeter to curtail secondary saprophytic fungal spore load.'
    ],
    ARRAY['Boll Rot', 'Bacterial Blight', 'Alternaria Leaf Spot'],
    'ICAR-CICR Nagpur Agromet Advisory',
    TRUE
),

-- 5. Wheat x Heatwave x Grain Filling x Sandy
(
    'Wheat',
    'HEATWAVE',
    'GRAIN_FRUIT_FILLING',
    'SANDY_LIGHT',
    'Severe',
    'Terminal heat stress, rapid grain desiccation, forced premature ripening leading to shrivelled grains and drastic test weight loss.',
    ARRAY[
        'Provide light, frequent evening irrigations or micro-sprinkler misting to reduce canopy temperature by 3-4°C.',
        'Avoid heavy flood irrigation during windy afternoons to prevent catastrophic plant lodging.',
        'Foliar spray of 0.5% Potassium Chloride (KCl) or 2% Potassium Nitrate (13-0-45) to enhance osmotic heat tolerance.'
    ],
    ARRAY['Brown Rust'],
    'ICAR-IIWBR Karnal Advisory on Terminal Heat Management',
    TRUE
),

-- 6. Tomato x Heatwave x Flowering x Sandy
(
    'Tomato',
    'HEATWAVE',
    'FLOWERING',
    'SANDY_LIGHT',
    'High',
    'Severe pollen desiccation, stigma drying causing flower drop, blossom end rot, sunscald on young fruit.',
    ARRAY[
        'Apply straw or biodegradable mulch (6-8 cm thickness) to conserve soil moisture and cool root zone.',
        'Schedule drip irrigation strictly during early morning (05:00-08:00) or post-sunset hours.',
        'Erect 35-50% shade netting or grow border rows of maize/sorghum on western boundary to buffer hot winds.'
    ],
    ARRAY['Leaf Curl Virus'],
    'ICAR-IIHR Tomato Agromet Advisory',
    TRUE
),

-- 7. Maize x Thunderstorm/Wind x Vegetative x Loam
(
    'Maize',
    'THUNDERSTORM_WIND',
    'VEGETATIVE',
    'LOAM_ALLUVIAL',
    'High',
    'High wind velocity causing stem snapping, root lodging, leaf shredding, and subsequent fungal collar entry.',
    ARRAY[
        'Perform earthing-up around plant base to strengthen root anchorage prior to storm gusts.',
        'Ensure standing irrigation water is drained; water-logged roots offer zero soil resistance against strong squalls.',
        'Do not attempt manual straightening of young bent stalks within 48 hours; natural geotropism usually recovers tillers.'
    ],
    ARRAY['Downy Mildew'],
    'ICAR-IIMR Ludhiana Maize Agronomy Bulletin',
    TRUE
),

-- 8. Rice x Thunderstorm/Wind x Maturity/Harvest x Loam
(
    'Rice',
    'THUNDERSTORM_WIND',
    'MATURITY_HARVEST',
    'LOAM_ALLUVIAL',
    'Severe',
    'Catastrophic panicle lodging, grain shattering on impact, water imbibition causing premature grain sprouting.',
    ARRAY[
        'Expedite immediate harvesting if crop has reached 80-85% maturity and grain moisture is around 20-22%.',
        'If crop lodges in standing water, bundle panicles together upright and drain water from field depressions.',
        'Stack harvested paddy bundles on elevated wooden or bamboo platforms covered with waterproof tarpaulins.'
    ],
    ARRAY['False Smut', 'Brown Spot'],
    'GKMS National Agromet Advisory Guidelines',
    TRUE
),

-- 9. Potato x Cold Wave/Frost x Vegetative x Sandy
(
    'Potato',
    'COLD_WAVE_FROST',
    'VEGETATIVE',
    'SANDY_LIGHT',
    'Severe',
    'Intracellular ice crystallization and severe frost damage causing foliage collapse, blackening/burning of canopy, arrested tuber bulking.',
    ARRAY[
        'Apply light night irrigation (sprinkler or furrow) on forecast frost nights; latent heat of freezing protects foliage.',
        'Create localized slow-burning smudge (smoke screens) on field borders using crop residue/cow dung along the windward edge at 03:00-05:00 IST.',
        'Spray soluble sulfur (0.2%) or Mancozeb to prevent opportunistic post-frost Alternaria leaf spot infection.'
    ],
    ARRAY['Early Blight', 'Late Blight'],
    'ICAR-CPRI Shimla Frost Management Protocol',
    TRUE
),

-- 10. Mustard x Cold Wave/Frost x Flowering x Sandy
(
    'Mustard',
    'COLD_WAVE_FROST',
    'FLOWERING',
    'SANDY_LIGHT',
    'High',
    'Frost injury to delicate petals, pod abortion, cold shock, and sudden resurgence of Mustard Aphid (Lipaphis erysimi).',
    ARRAY[
        'Irrigate fields lightly during afternoon or evening to increase soil thermal mass overnight.',
        'Create perimeter smoke cover using damp straw on northern and western field boundaries.',
        'Foliar spray of 0.1% Dimethyl Sulfoxide (DMSO) or 0.2% wettable sulfur to boost cellular frost resistance.'
    ],
    ARRAY['White Rust', 'Alternaria Blight'],
    'ICAR-DRMR Bharatpur Agromet Advisory Bulletin',
    TRUE
),

-- 11. Generic Sowing/Germination x Heavy Rain
(
    'Wheat',
    'HEAVY_RAINFALL',
    'SOWING_GERMINATION',
    'ANY',
    'High',
    'Soil crusting, seed decay, uneven germination and rotting of emerging plumules.',
    ARRAY[
        'Delay sowing until excess soil moisture recedes and seedbed can be properly cultivated.',
        'Break surface crust lightly with a spiked tooth harrow once topsoil is workable to assist coleoptile emergence.',
        'Treat replacement seeds with Trichoderma viride (4g/kg seed) before re-sowing gap patches.'
    ],
    ARRAY['Root Rot', 'Loose Smut'],
    'ICAR Wheat Crop Management Guide',
    TRUE
),

-- 12. Fallback / Normal Baseline
(
    'Wheat',
    'MODERATE_NORMAL',
    'ALL_STAGES',
    'ANY',
    'Low',
    'Normal seasonal weather. Ideal conditions for standard crop growth and physiological development.',
    ARRAY[
        'Follow recommended stage-wise irrigation schedule (CRI, tillering, flowering, milk stage).',
        'Perform regular twice-weekly pest and disease scouting along field transects.'
    ],
    ARRAY[]::TEXT[],
    'ICAR Package of Practices',
    TRUE
);

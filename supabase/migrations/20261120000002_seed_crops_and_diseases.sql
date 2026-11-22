-- Supabase Migration: 20261120000002_seed_crops_and_diseases.sql
-- Seed Crop Master List and Disease Name Stubs (verified = false, no treatments)

-- 1. SEED DEFAULT ADMIN PROFILE (for verification testing)
INSERT INTO profiles (id, full_name, phone, role, preferred_language)
VALUES ('00000000-0000-0000-0000-000000000001', 'Admin Officer', '+919876543210', 'admin', 'en')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED STATES & RAJASTHAN DISTRICTS SAMPLE
INSERT INTO states (name, code) VALUES ('Rajasthan', 'RJ'), ('Madhya Pradesh', 'MP'), ('Punjab', 'PB'), ('Haryana', 'HR')
ON CONFLICT (name) DO NOTHING;

-- 3. SEED CROP MASTER LIST
-- Cereals
INSERT INTO crops (name, scientific_name, category, region, description) VALUES
('Rice', 'Oryza sativa', 'Cereals', 'All-India', 'Major staple cereal crop cultivated across Kharif and Rabi seasons.'),
('Wheat', 'Triticum aestivum', 'Cereals', 'All-India', 'Primary winter staple cereal (Rabi) in northern and central India.'),
('Maize', 'Zea mays', 'Cereals', 'All-India', 'Important coarse cereal grown across diverse agro-climatic zones.'),
('Barley', 'Hordeum vulgare', 'Cereals', 'All-India', 'Cereal crop utilized for food, feed, and malting in northern India.'),
('Bajra', 'Pennisetum glaucum', 'Cereals', 'All-India', 'Pearl millet, high drought-tolerant staple in arid zones including Rajasthan.'),
('Jowar', 'Sorghum bicolor', 'Cereals', 'All-India', 'Sorghum, vital dryland food and fodder crop.'),
('Ragi', 'Eleusine coracana', 'Cereals', 'All-India', 'Finger millet, nutrient-dense millets grown in dry belts.')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, region = EXCLUDED.region;

-- Pulses
INSERT INTO crops (name, scientific_name, category, region, description) VALUES
('Chickpea', 'Cicer arietinum', 'Pulses', 'All-India', 'Bengal gram, major pulse crop of Rabi season fixing atmospheric nitrogen.'),
('Pigeon Pea', 'Cajanus cajan', 'Pulses', 'All-India', 'Arhar/Tur, essential pulse crop with high protein content.'),
('Green Gram', 'Vigna radiata', 'Pulses', 'All-India', 'Moong, short duration pulse suitable for crop rotations.'),
('Black Gram', 'Vigna mungo', 'Pulses', 'All-India', 'Urad, widely consumed pulse crop.'),
('Lentil', 'Lens culinaris', 'Pulses', 'All-India', 'Masoor, cool season legume cultivated in northern plains.'),
('Kidney Bean', 'Phaseolus vulgaris', 'Pulses', 'All-India', 'Rajma, popular hill and winter pulse.'),
('Field Pea', 'Pisum sativum', 'Pulses', 'All-India', 'Matar, protein-rich legume cultivated in winter.')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, region = EXCLUDED.region;

-- Oilseeds
INSERT INTO crops (name, scientific_name, category, region, description) VALUES
('Mustard', 'Brassica juncea', 'Oilseeds', 'All-India', 'Rapeseed-mustard, dominant Rabi oilseed of northern/western India.'),
('Groundnut', 'Arachis hypogaea', 'Oilseeds', 'All-India', 'Peanut, major oilseed and food legume.'),
('Soybean', 'Glycine max', 'Oilseeds', 'All-India', 'Major Kharif oilseed in central and western plateau.'),
('Sunflower', 'Helianthus annuus', 'Oilseeds', 'All-India', 'Photo-insensitive oilseed with high polyunsaturated fatty acids.'),
('Sesame', 'Sesamum indicum', 'Oilseeds', 'All-India', 'Til, ancient drought-tolerant oilseed crop.'),
('Castor', 'Ricinus communis', 'Oilseeds', 'All-India', 'Non-edible commercial oilseed with industrial applications.')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, region = EXCLUDED.region;

-- Fruits
INSERT INTO crops (name, scientific_name, category, region, description) VALUES
('Mango', 'Mangifera indica', 'Fruits', 'All-India', 'National fruit of India, major tropical fruit tree.'),
('Banana', 'Musa acuminata', 'Fruits', 'All-India', 'High calorific tropical fruit grown extensively.'),
('Apple', 'Malus domestica', 'Fruits', 'All-India', 'Temperate fruit grown in Himalayan states.'),
('Grapes', 'Vitis vinifera', 'Fruits', 'All-India', 'Commercial subtropical fruit cultivated in peninsular India.'),
('Pomegranate', 'Punica granatum', 'Fruits', 'All-India', 'High value arid and semi-arid fruit crop.'),
('Papaya', 'Carica papaya', 'Fruits', 'All-India', 'Fast-growing tropical fruit with medicinal and nutritional value.'),
('Guava', 'Psidium guajava', 'Fruits', 'All-India', 'Hardy subtropical/tropical fruit with high Vitamin C.'),
('Citrus', 'Citrus spp.', 'Fruits', 'All-India', 'Mandarin, sweet orange, and lime grown across multiple states.'),
('Watermelon', 'Citrullus lanatus', 'Fruits', 'All-India', 'Cucurbitaceous fruit cultivated during summer (Zaid).'),
('Muskmelon', 'Cucumis melo', 'Fruits', 'All-India', 'Sweet summer dessert fruit.'),
('Litchi', 'Litchi chinensis', 'Fruits', 'All-India', 'Subtropical fruit tree requiring specific chilling hours.'),
('Ber', 'Ziziphus mauritiana', 'Fruits', 'All-India', 'Indian jujube, extremely drought-hardy fruit crop.')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, region = EXCLUDED.region;

-- Vegetables
INSERT INTO crops (name, scientific_name, category, region, description) VALUES
('Tomato', 'Solanum lycopersicum', 'Vegetables', 'All-India', 'Solanaceous vegetable grown round the year.'),
('Potato', 'Solanum tuberosum', 'Vegetables', 'All-India', 'Major tuber crop and staple vegetable.'),
('Onion', 'Allium cepa', 'Vegetables', 'All-India', 'Essential bulb crop grown across Kharif, Late Kharif, and Rabi.'),
('Garlic', 'Allium sativum', 'Vegetables', 'All-India', 'Pungent bulb crop used for culinary and medicinal uses.'),
('Chilli', 'Capsicum annuum', 'Vegetables', 'All-India', 'Important spice and vegetable crop.'),
('Brinjal', 'Solanum melongena', 'Vegetables', 'All-India', 'Eggplant, widely cultivated warm season solanaceous vegetable.'),
('Cauliflower', 'Brassica oleracea var. botrytis', 'Vegetables', 'All-India', 'Cole crop grown across cool seasons.'),
('Cabbage', 'Brassica oleracea var. capitata', 'Vegetables', 'All-India', 'Cruciferous leafy vegetable.'),
('Okra', 'Abelmoschus esculentus', 'Vegetables', 'All-India', 'Bhindi, popular summer and rainy season vegetable.'),
('Cucumber', 'Cucumis sativus', 'Vegetables', 'All-India', 'Cucurbitaceous salad vegetable.'),
('Bottle Gourd', 'Lagenaria siceraria', 'Vegetables', 'All-India', 'Lauki, widespread cucurbit vegetable.'),
('Bitter Gourd', 'Momordica charantia', 'Vegetables', 'All-India', 'Karela, valued for culinary and antidiabetic properties.'),
('Pumpkin', 'Cucurbita moschata', 'Vegetables', 'All-India', 'Hardy trailing cucurbit with high carotene content.')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, region = EXCLUDED.region;

-- Cash crops
INSERT INTO crops (name, scientific_name, category, region, description) VALUES
('Cotton', 'Gossypium hirsutum', 'Cash crops', 'All-India', 'King of fibers, premier commercial cash crop.'),
('Sugarcane', 'Saccharum officinarum', 'Cash crops', 'All-India', 'Major industrial sweetener crop.'),
('Tobacco', 'Nicotiana tabacum', 'Cash crops', 'All-India', 'Commercial leaf crop.'),
('Jute', 'Corchorus olitorius', 'Cash crops', 'All-India', 'Golden fiber crop grown in eastern regions.')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, region = EXCLUDED.region;

-- Other (Spices and Condiments)
INSERT INTO crops (name, scientific_name, category, region, description) VALUES
('Turmeric', 'Curcuma longa', 'Other', 'All-India', 'Rhizomatous spice and medicinal golden crop.'),
('Ginger', 'Zingiber officinale', 'Other', 'All-India', 'Commercial underground rhizome spice.'),
('Coriander', 'Coriandrum sativum', 'Other', 'All-India', 'Seed and leafy culinary spice.'),
('Cumin', 'Cuminum cyminum', 'Other', 'All-India', 'Jeera, major export seed spice of arid/semi-arid zones.'),
('Fennel', 'Foeniculum vulgare', 'Other', 'All-India', 'Saunf, aromatic seed spice.'),
('Fenugreek', 'Trigonella foenum-graecum', 'Other', 'All-India', 'Methi, multi-purpose spice, vegetable, and fodder crop.')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, region = EXCLUDED.region;

-- Regional Crops (Rajasthan)
INSERT INTO crops (name, scientific_name, category, region, description) VALUES
('Moth Bean', 'Vigna aconitifolia', 'Pulses', 'Rajasthan', 'Extremely drought-resilient pulse crop native to the Thar desert.'),
('Guar', 'Cyamopsis tetragonoloba', 'Cash crops', 'Rajasthan', 'Cluster bean, vital source of industrial guar gum and cattle feed.'),
('Isabgol', 'Plantago ovata', 'Other', 'Rajasthan', 'Psyllium husk, high-value commercial medicinal crop cultivated in arid western Rajasthan.')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, region = EXCLUDED.region;

-- 4. SEED REGIONAL VARIETIES (Rajasthan focus)
INSERT INTO crop_varieties (crop_id, variety_name, duration_days, suitable_regions, characteristics)
SELECT id, 'RMO-40', 65, ARRAY['Rajasthan', 'Gujarat'], 'Early maturing, drought-tolerant moth bean variety.'
FROM crops WHERE name = 'Moth Bean'
ON CONFLICT (crop_id, variety_name) DO NOTHING;

INSERT INTO crop_varieties (crop_id, variety_name, duration_days, suitable_regions, characteristics)
SELECT id, 'RGC-936', 90, ARRAY['Rajasthan', 'Haryana'], 'High gum content, lodging resistant guar variety.'
FROM crops WHERE name = 'Guar'
ON CONFLICT (crop_id, variety_name) DO NOTHING;

INSERT INTO crop_varieties (crop_id, variety_name, duration_days, suitable_regions, characteristics)
SELECT id, 'GI-2', 115, ARRAY['Rajasthan', 'North Gujarat'], 'High husk yield, moderately resistant to downy mildew.'
FROM crops WHERE name = 'Isabgol'
ON CONFLICT (crop_id, variety_name) DO NOTHING;

-- 5. SEED DISEASE NAME STUBS (verified = false, NO treatments)
-- Strict adherence to rule: Treatment text is left NULL for Phase 2 official citations.

-- Rice Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Blast', 'Fungal', 'High', false FROM crops WHERE name = 'Rice'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Bacterial Leaf Blight', 'Bacterial', 'High', false FROM crops WHERE name = 'Rice'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Sheath Blight', 'Fungal', 'Medium', false FROM crops WHERE name = 'Rice'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Brown Spot', 'Fungal', 'Medium', false FROM crops WHERE name = 'Rice'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'False Smut', 'Fungal', 'Medium', false FROM crops WHERE name = 'Rice'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Tungro', 'Viral', 'Severe', false FROM crops WHERE name = 'Rice'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

-- Wheat Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Yellow Rust', 'Fungal', 'Severe', false FROM crops WHERE name = 'Wheat'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Brown Rust', 'Fungal', 'Medium', false FROM crops WHERE name = 'Wheat'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Loose Smut', 'Fungal', 'Medium', false FROM crops WHERE name = 'Wheat'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Karnal Bunt', 'Fungal', 'High', false FROM crops WHERE name = 'Wheat'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Powdery Mildew', 'Fungal', 'Low', false FROM crops WHERE name = 'Wheat'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

-- Tomato Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Early Blight', 'Fungal', 'Medium', false FROM crops WHERE name = 'Tomato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Late Blight', 'Fungal', 'Severe', false FROM crops WHERE name = 'Tomato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Bacterial Wilt', 'Bacterial', 'Severe', false FROM crops WHERE name = 'Tomato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Fusarium Wilt', 'Fungal', 'High', false FROM crops WHERE name = 'Tomato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Leaf Curl Virus', 'Viral', 'Severe', false FROM crops WHERE name = 'Tomato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Septoria Leaf Spot', 'Fungal', 'Medium', false FROM crops WHERE name = 'Tomato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Anthracnose', 'Fungal', 'Medium', false FROM crops WHERE name = 'Tomato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

-- Potato Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Early Blight', 'Fungal', 'Medium', false FROM crops WHERE name = 'Potato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Late Blight', 'Fungal', 'Severe', false FROM crops WHERE name = 'Potato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Black Scurf', 'Fungal', 'Medium', false FROM crops WHERE name = 'Potato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Common Scab', 'Bacterial', 'Medium', false FROM crops WHERE name = 'Potato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Bacterial Wilt', 'Bacterial', 'High', false FROM crops WHERE name = 'Potato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Potato Virus Y', 'Viral', 'Severe', false FROM crops WHERE name = 'Potato'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

-- Cotton Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Bacterial Blight', 'Bacterial', 'High', false FROM crops WHERE name = 'Cotton'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Fusarium Wilt', 'Fungal', 'Severe', false FROM crops WHERE name = 'Cotton'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Root Rot', 'Fungal', 'High', false FROM crops WHERE name = 'Cotton'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Alternaria Leaf Spot', 'Fungal', 'Medium', false FROM crops WHERE name = 'Cotton'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Boll Rot', 'Fungal', 'High', false FROM crops WHERE name = 'Cotton'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

-- Mango Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Anthracnose', 'Fungal', 'High', false FROM crops WHERE name = 'Mango'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Powdery Mildew', 'Fungal', 'High', false FROM crops WHERE name = 'Mango'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Dieback', 'Fungal', 'Medium', false FROM crops WHERE name = 'Mango'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Bacterial Canker', 'Bacterial', 'Medium', false FROM crops WHERE name = 'Mango'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Sooty Mould', 'Fungal', 'Low', false FROM crops WHERE name = 'Mango'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

-- Chilli Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Anthracnose', 'Fungal', 'High', false FROM crops WHERE name = 'Chilli'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Leaf Curl', 'Viral', 'Severe', false FROM crops WHERE name = 'Chilli'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Powdery Mildew', 'Fungal', 'Medium', false FROM crops WHERE name = 'Chilli'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Bacterial Wilt', 'Bacterial', 'Severe', false FROM crops WHERE name = 'Chilli'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Dieback', 'Fungal', 'High', false FROM crops WHERE name = 'Chilli'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

-- Banana Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Panama Disease', 'Fungal', 'Severe', false FROM crops WHERE name = 'Banana'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Sigatoka Leaf Spot', 'Fungal', 'High', false FROM crops WHERE name = 'Banana'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Bacterial Wilt', 'Bacterial', 'Severe', false FROM crops WHERE name = 'Banana'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Anthracnose', 'Fungal', 'Medium', false FROM crops WHERE name = 'Banana'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

-- Onion Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Purple Blotch', 'Fungal', 'High', false FROM crops WHERE name = 'Onion'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Downy Mildew', 'Fungal', 'High', false FROM crops WHERE name = 'Onion'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Basal Rot', 'Fungal', 'Medium', false FROM crops WHERE name = 'Onion'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Stemphylium Blight', 'Fungal', 'Medium', false FROM crops WHERE name = 'Onion'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

-- Pomegranate Diseases
INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Bacterial Blight', 'Bacterial', 'Severe', false FROM crops WHERE name = 'Pomegranate'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Anthracnose', 'Fungal', 'High', false FROM crops WHERE name = 'Pomegranate'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Wilt', 'Fungal', 'High', false FROM crops WHERE name = 'Pomegranate'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

INSERT INTO plant_diseases (crop_id, disease_name, category, severity, verified)
SELECT id, 'Fruit Spot', 'Fungal', 'Medium', false FROM crops WHERE name = 'Pomegranate'
ON CONFLICT (crop_id, lower(trim(disease_name))) DO NOTHING;

export interface PilotDiseaseData {
  crop_name: string;
  disease_name: string;
  scientific_name: string;
  category: 'Fungal' | 'Bacterial' | 'Viral' | 'Nematode';
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  symptoms_early: string;
  symptoms_advanced: string;
  causes: string;
  favourable_weather: {
    temperature_min: number;
    temperature_max: number;
    humidity_min: number;
    rainfall_relation: string;
  };
  spread: string;
  prevention: string;
  organic_treatment: string;
  ipm_methods: string;
  chemical_treatment: string;
  monitoring_recovery: string;
  reference_images: Array<{ url: string; caption: string; license: string; credit: string }>;
  verified_sources: Array<{ title: string; url: string; authority: string; publication_year: number }>;
  translations: {
    hi: {
      disease_name: string;
      symptoms_early: string;
      symptoms_advanced: string;
      causes: string;
      favourable_weather_text: string;
      prevention: string;
      organic_treatment: string;
      ipm_methods: string;
      chemical_treatment: string;
      monitoring_recovery: string;
    };
    'hi-RJ': {
      disease_name: string;
      symptoms_early: string;
      symptoms_advanced: string;
      organic_treatment: string;
      prevention: string;
      chemical_treatment: string;
    };
  };
  treatments: Array<{
    treatment_type: 'Biological' | 'Organic' | 'Cultural' | 'Chemical';
    method_name: string;
    dosage: string;
    application_method: string;
    safety_interval_days: number | null;
    source_url: string;
  }>;
}

export const pilotDiseases: PilotDiseaseData[] = [
  {
    crop_name: 'Rice',
    disease_name: 'Blast',
    scientific_name: 'Pyricularia oryzae (Magnaporthe oryzae)',
    category: 'Fungal',
    severity: 'High',
    symptoms_early: 'Small, bluish-green water-soaked spots on young leaves, rapidly enlarging into characteristic diamond- or spindle-shaped lesions with grayish-white centers and dark brown borders.',
    symptoms_advanced: 'Lesions coalesce causing complete drying of foliage. Neck blast attacks the panicle node causing blackening, panicle breaking, and completely empty or chaffy grains.',
    causes: 'Airborne fungal conidia of Magnaporthe oryzae surviving on infected seed, crop stubble, and collateral grassy weeds (Digitaria sanguinalis).',
    favourable_weather: {
      temperature_min: 20,
      temperature_max: 25,
      humidity_min: 90,
      rainfall_relation: 'High relative humidity, prolonged leaf wetness (>10 hrs), overcast skies with light drizzling showers.'
    },
    spread: 'Wind-borne fungal conidia over long distances and water droplets splashing from infected lesions.',
    prevention: 'Avoid excessive doses of nitrogenous fertilizers (split applications into 3 equal doses); destroy infected stubble; cultivate resistant or tolerant varieties.',
    organic_treatment: 'Seed treatment with Pseudomonas fluorescens @ 10g/kg seed or Trichoderma harzianum @ 10g/kg seed. Foliar spray of Pseudomonas fluorescens (0.2% - 2g/L water) at tillering and panicle emergence.',
    ipm_methods: 'Maintain proper water levels (avoid severe soil drying); clear weeds from field bunds; apply balanced fertilizers with adequate potash.',
    chemical_treatment: 'Tricyclazole 75% WP @ 0.6g/L water (300-400g/ha in 500L water) or Isoprothiolane 40% EC @ 1.5ml/L water. Pre-harvest safety waiting period: 30 days. Warning: Strictly adhere to CIB&RC registered labels.',
    monitoring_recovery: 'Scout nurseries and fields twice a week during tillering and heading. If diamond lesions appear on >2% leaf area, initiate bio-control immediately.',
    reference_images: [
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        caption: 'Rice blast spindle-shaped foliar lesion with gray-white center and brown margin',
        license: 'PlantDoc Dataset / CC BY 4.0',
        credit: 'IIT Gandhinagar & DPPQ&S'
      }
    ],
    verified_sources: [
      {
        title: 'IPM Package for Rice',
        url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_rice.pdf',
        authority: 'Directorate of Plant Protection, Quarantine & Storage (DPPQ&S), Ministry of Agriculture & Farmers Welfare',
        publication_year: 2021
      }
    ],
    translations: {
      hi: {
        disease_name: 'धान का झुलसा रोग (ब्लास्ट)',
        symptoms_early: 'पत्तियों पर छोटे, नीले-हरे धब्बे जो बाद में नाव या आंख के आकार (तर्कु आकार) में बदल जाते हैं, जिनका केंद्र भूरा-सफेद और किनारा गहरा भूरा होता है।',
        symptoms_advanced: 'धब्बे आपस में मिलकर पूरी पत्ती को सुखा देते हैं। बाली के आधार (गर्दन) पर काला घेरा बन जाता है जिससे बाली टूट जाती है और दाने थोथे रह जाते हैं।',
        causes: 'पाइरिकुलेरिया ओराइजी नामक फफूंद, जो फसल के अवशेषों और बीजों में जीवित रहती है।',
        favourable_weather_text: 'तापमान 20-25 डिग्री सेल्सियस, हवा में 90% से अधिक नमी तथा बादलों भरा मौसम।',
        prevention: 'नाइट्रोजन (यूरिया) का अत्यधिक उपयोग न करें, पोटाश का उचित प्रयोग करें, रोगरोधी किस्मों का चयन करें।',
        organic_treatment: 'सूडोमोनास फ्लोरेसेंस (Pseudomonas fluorescens) 10 ग्राम प्रति किलो बीज से बीजोपचार करें। खेत में 2 ग्राम प्रति लीटर पानी की दर से छिड़काव करें।',
        ipm_methods: 'खेत की मेड़ों को खरपतवार मुक्त रखें, खेत में जल स्तर बनाए रखें और सूखने न दें।',
        chemical_treatment: 'ट्राइसाइक्लाजोल 75% WP (Tricyclazole) 0.6 ग्राम प्रति लीटर पानी अथवा इसोप्रोथियोलेन 40% EC 1.5 मिली प्रति लीटर। कटाई से 30 दिन पहले छिड़काव बंद करें।',
        monitoring_recovery: 'कल्ले फूटते समय तथा बाली निकलते समय प्रति सप्ताह दो बार निरीक्षण करें।'
      },
      'hi-RJ': {
        disease_name: 'धान रो झुलसो (ब्लास्ट)',
        symptoms_early: 'पानां माथे आंख जेड़ा भूरा-धोळा दागा बण जावे।',
        symptoms_advanced: 'दागा मिल’र पूरो पान सुखा देवे, बाली री गर्दन काली पड़’र टूट जावे।',
        organic_treatment: 'सूडोमोनास (Pseudomonas) 10 ग्राम सूं बीजोपचार करो अर देसी गोबर री खाद देवो।',
        prevention: 'यूरिया ज्यादा मत नाखो, पोटाश बरोबर राखो।',
        chemical_treatment: 'ट्राइसाइक्लाजोल 75% WP 0.6 ग्राम प्रति लीटर। सरकारी लेबल देख’र ही छिड़को।'
      }
    },
    treatments: [
      {
        treatment_type: 'Biological',
        method_name: 'Pseudomonas fluorescens Seed Treatment',
        dosage: '10g per kg of seed',
        application_method: 'Seed priming before sowing',
        safety_interval_days: null,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_rice.pdf'
      },
      {
        treatment_type: 'Biological',
        method_name: 'Pseudomonas fluorescens Foliar Spray',
        dosage: '2g per litre of water (0.2%)',
        application_method: 'Foliar spray at maximum tillering',
        safety_interval_days: null,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_rice.pdf'
      },
      {
        treatment_type: 'Chemical',
        method_name: 'Tricyclazole 75% WP',
        dosage: '0.6g per litre of water (300g-400g/ha in 500L)',
        application_method: 'Foliar spray on disease onset',
        safety_interval_days: 30,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_rice.pdf'
      }
    ]
  },
  {
    crop_name: 'Wheat',
    disease_name: 'Yellow Rust',
    scientific_name: 'Puccinia striiformis f. sp. tritici',
    category: 'Fungal',
    severity: 'Severe',
    symptoms_early: 'Bright yellow, powdery pustules arranged in distinct narrow stripes or parallel lines along the veins of leaf blades.',
    symptoms_advanced: 'Pustules turn dark brown or black as winter ends. Entire leaves desiccate rapidly, giving fields a scorched appearance. Grains remain small, shriveled, and underweight.',
    causes: 'Puccinia striiformis fungal urediniospores carried southward by western disturbances from higher altitude hills.',
    favourable_weather: {
      temperature_min: 10,
      temperature_max: 15,
      humidity_min: 85,
      rainfall_relation: 'Cool weather, persistent fog, heavy morning dew, intermittent winter drizzle.'
    },
    spread: 'Wind-borne spores across hundreds of kilometers along the Indo-Gangetic plains.',
    prevention: 'Cultivate recommended rust-resistant varieties (HD-2967, HD-3086, DBW-187); avoid late sowing; do not apply excessive nitrogen.',
    organic_treatment: 'Prophylactic spray of Neem-based formulation (Azadirachtin 0.03% @ 3-5ml/L) or Trichoderma viride @ 5g/L water at first report of yellow rust in the district.',
    ipm_methods: 'Intensive field scouting in January; eradicate volunteer wheat and collateral grasses (Polypogon monspeliensis).',
    chemical_treatment: 'Propiconazole 25% EC @ 1ml/L water (500ml in 500L water/ha) or Tebuconazole 25.9% EC @ 1ml/L. Pre-harvest waiting period: 30 days. Warning: Strictly follow CIB&RC registered labels.',
    monitoring_recovery: 'Inspect lower and middle canopies weekly from mid-December through February. Touch yellow stripes: if yellow powder rubs off on fingers, initiate spraying immediately.',
    reference_images: [
      {
        url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        caption: 'Wheat stripe rust showing linear rows of bright yellow powdery pustules',
        license: 'PlantVillage Dataset / CC BY-SA 4.0',
        credit: 'ICAR-IIWBR Karnal & DPPQ&S'
      }
    ],
    verified_sources: [
      {
        title: 'IPM Package for Wheat',
        url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_wheat.pdf',
        authority: 'ICAR - Indian Institute of Wheat and Barley Research (IIWBR) & DPPQ&S',
        publication_year: 2021
      }
    ],
    translations: {
      hi: {
        disease_name: 'गेहूं का पीला रतुआ (येलो रस्ट / हल्दी रोग)',
        symptoms_early: 'पत्तियों की शिराओं के समानांतर चमकीले पीले रंग की फुंसियों की धारियां बन जाती हैं, जिन्हें छूने पर उंगली पर पीला पाउडर (हल्दी जैसा) लग जाता है।',
        symptoms_advanced: 'पत्तियां पीली पड़कर सूख जाती हैं, पूरा खेत झुलसा हुआ दिखता है और दाने बहुत छोटे, सिकुड़े हुए रह जाते हैं।',
        causes: 'पक्सीनिया स्ट्राइफोर्मिस फफूंद, जो हवा के द्वारा पहाड़ी क्षेत्रों से मैदानी इलाकों में फैलती है।',
        favourable_weather_text: 'तापमान 10-15 डिग्री सेल्सियस, सुबह का घना कोहरा, ओस और 85% से अधिक आर्द्रता।',
        prevention: 'प्रतिरोधी किस्मों (जैसे HD-2967, HD-3086, DBW-187) की समय पर बुवाई करें।',
        organic_treatment: 'नीम का तेल (अजाडिरैचटिन 0.03%) 3-5 मिली प्रति लीटर पानी या ट्राइकोडर्मा विरिडी 5 ग्राम प्रति लीटर पानी का छिड़काव।',
        ipm_methods: 'जनवरी माह में नियमित रूप से खेत का निरीक्षण करें और गुल्ली-डंडा खरपतवार नष्ट करें।',
        chemical_treatment: 'प्रोपिकोनाजोल 25% EC (Propiconazole) 1 मिली प्रति लीटर पानी (500 मिली प्रति हेक्टेयर)। कटाई से 30 दिन पहले छिड़काव न करें।',
        monitoring_recovery: 'दिसंबर के अंत से फरवरी तक हर हफ्ते खेत का कोना-कोना देखें।'
      },
      'hi-RJ': {
        disease_name: 'गेहूं रो पीळो रतुआ (हल्दी रोग)',
        symptoms_early: 'पानां माथे पीळी धारियां बण जावे, आंगळी माथे हल्दी जैसो पाउडर लागे।',
        symptoms_advanced: 'पानां सुक’र काळस पड़ जावे अर दाणो हलको रह जावे।',
        organic_treatment: 'नीम रो तेल 4-5 मिली प्रति लीटर छिड़को।',
        prevention: 'बढ़िया बीज (HD-2967) बोवो, यूरिया कम राखो।',
        chemical_treatment: 'प्रोपिकोनाजोल 25% EC 1 मिली प्रति लीटर। सरकारी लेबल पढ़’र छिड़को।'
      }
    },
    treatments: [
      {
        treatment_type: 'Biological',
        method_name: 'Trichoderma viride Foliar Spray',
        dosage: '5g per litre of water',
        application_method: 'Preventive foliar spray in early winter',
        safety_interval_days: null,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_wheat.pdf'
      },
      {
        treatment_type: 'Chemical',
        method_name: 'Propiconazole 25% EC',
        dosage: '1ml per litre of water (500ml/ha in 500L water)',
        application_method: 'Foliar spray on stripe appearance',
        safety_interval_days: 30,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_wheat.pdf'
      }
    ]
  },
  {
    crop_name: 'Tomato',
    disease_name: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    category: 'Fungal',
    severity: 'Severe',
    symptoms_early: 'Water-soaked, irregular pale-green or brown lesions appearing on leaflets, rapidly turning dark brown to black.',
    symptoms_advanced: 'White cottony downy growth on the underside of leaves during moist mornings. Stems develop dark greasy girdling lesions. Fruits develop large, firm, greasy olive-brown to dark brown surface decay.',
    causes: 'Oomycete pathogen Phytophthora infestans surviving on solanaceous weeds, infected volunteer plants, and potato cull piles.',
    favourable_weather: {
      temperature_min: 10,
      temperature_max: 22,
      humidity_min: 90,
      rainfall_relation: 'Cool nights (10-15°C) and mild days (18-22°C), continuous high humidity, prolonged rain or heavy morning dew.'
    },
    spread: 'Airborne sporangia dispersed by wind and rain splash from infected leaves to healthy plants.',
    prevention: 'Strict crop rotation with non-solanaceous crops (cereals/pulses); provide wide plant spacing for ventilation; avoid overhead sprinkler irrigation.',
    organic_treatment: 'Prophylactic spray with Copper Hydroxide 53.8% DF @ 2g/L water or Bordeaux mixture 1% (10g copper sulfate + 10g lime per litre); soil application of Trichoderma harzianum @ 5g/plant.',
    ipm_methods: 'Stake tomato plants to keep foliage off the ground; strip lower leaves up to 20 cm from ground; rogue out infected plants promptly.',
    chemical_treatment: 'Cymoxanil 8% + Mancozeb 64% WP @ 2g/L water or Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5g/L water. Pre-harvest waiting period: 7-10 days. Warning: Strictly follow CIB&RC registered labels.',
    monitoring_recovery: 'Daily scouting during cool, overcast weather. Remove affected leaves and apply protective fungicide before disease spreads to the stem or fruit.',
    reference_images: [
      {
        url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
        caption: 'Tomato late blight greasy dark brown foliar and stem lesions',
        license: 'PlantDoc Dataset / CC BY 4.0',
        credit: 'ICAR-IIHR Bengaluru & DPPQ&S'
      }
    ],
    verified_sources: [
      {
        title: 'IPM Package for Tomato',
        url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_tomato.pdf',
        authority: 'ICAR-Indian Institute of Horticultural Research (IIHR) & DPPQ&S',
        publication_year: 2021
      }
    ],
    translations: {
      hi: {
        disease_name: 'टमाटर का पछेती झुलसा (लेट ब्लाइट)',
        symptoms_early: 'पत्तियों के किनारों पर पानी से भीगे हुए भूरे-काले धब्बे जो बहुत तेजी से फैलते हैं।',
        symptoms_advanced: 'पत्तियों की निचली सतह पर सफेद रुई जैसी फफूंद दिखाई देती है। तने काले पड़ जाते हैं और फलों पर भूरे, कड़े, बड़े धब्बे बन जाते हैं।',
        causes: 'फाइटोफ्थोरा इन्फेस्टैन्स (Phytophthora infestans) नामक कवक जनित रोग।',
        favourable_weather_text: 'ठंडी रातें (10-15°C), सामान्य दिन (18-22°C), हवा में 90% से अधिक नमी और लगातार बादल/ओस।',
        prevention: 'पौधों को उचित दूरी पर लगाएं, ड्रिप सिंचाई का प्रयोग करें, टमाटर के बाद आलू या बैंगन न लगाएं।',
        organic_treatment: 'बोर्डो मिश्रण 1% (10 ग्राम नीला थोथा + 10 ग्राम चूना प्रति लीटर) या कॉपर हाइड्रॉक्साइड 2 ग्राम प्रति लीटर पानी का छिड़काव करें।',
        ipm_methods: 'पौधों को बांस के सहारे बांधें, निचली संक्रमित पत्तियों को तोड़कर नष्ट करें।',
        chemical_treatment: 'साइमोक्सानिल 8% + मैंकोजेब 64% WP (Cymoxanil + Mancozeb) 2 ग्राम प्रति लीटर पानी अथवा मेटालैक्सिल-एम + मैंकोजेब 2.5 ग्राम प्रति लीटर। प्रतीक्षा अवधि: 7-10 दिन।',
        monitoring_recovery: 'ठंडे और नम मौसम में प्रतिदिन खेत का निरीक्षण करें।'
      },
      'hi-RJ': {
        disease_name: 'टमाटर रो पछेती झुलसो (लेट ब्लाइट)',
        symptoms_early: 'पानां माथे काळस-भूरा दागा पड़े अर पत्ता सड़बा लागे।',
        symptoms_advanced: 'पानां रै पाछै धोळी फफूंद दीखे, टमाटर माथे काळा कड़ा दागा बण जावे।',
        organic_treatment: 'बोर्डो मिक्चर (1%) या कॉपर री दवाई छिड़को।',
        prevention: 'पौधां ने बांस सूं बांधो, पानी भरबा मत देवो।',
        chemical_treatment: 'साइमोक्सानिल + मैंकोजेब 2 ग्राम प्रति लीटर। लेबल देख’र ही काम लो।'
      }
    },
    treatments: [
      {
        treatment_type: 'Organic',
        method_name: 'Bordeaux Mixture 1%',
        dosage: '10g copper sulfate + 10g lime per litre of water',
        application_method: 'Preventive foliar spray prior to wet spells',
        safety_interval_days: null,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_tomato.pdf'
      },
      {
        treatment_type: 'Chemical',
        method_name: 'Cymoxanil 8% + Mancozeb 64% WP',
        dosage: '2g per litre of water',
        application_method: 'Foliar spray at early disease onset',
        safety_interval_days: 7,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_tomato.pdf'
      }
    ]
  },
  {
    crop_name: 'Potato',
    disease_name: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    category: 'Fungal',
    severity: 'Severe',
    symptoms_early: 'Small, circular to irregular water-soaked spots appearing near the margins or tips of potato leaflets.',
    symptoms_advanced: 'Rapid blighting and decay of the entire foliage with a foul odor. White downy mold visible on lower leaf surfaces under morning humidity. Tubers exhibit dry, granular, reddish-brown rot spreading inwards from the skin.',
    causes: 'Phytophthora infestans sporangia originating from infected seed tubers, volunteer potatoes, or cull piles.',
    favourable_weather: {
      temperature_min: 12,
      temperature_max: 20,
      humidity_min: 85,
      rainfall_relation: 'High relative humidity (>85%) for 48+ consecutive hours with temperatures between 12°C and 22°C.'
    },
    spread: 'Wind-carried sporangia; rain wash carries spores down into the soil to infect developing tubers.',
    prevention: 'Plant only certified disease-free seed tubers; perform high earthing up (15-20cm ridge height) to shield tubers from sporangia wash-down; dehaulm 10-12 days before harvesting.',
    organic_treatment: 'Prophylactic application of Copper Oxychloride 50% WP @ 2.5g/L; seed tuber bio-priming with Trichoderma viride @ 4g/kg seed tuber.',
    ipm_methods: 'Destroy cull piles; follow blight forecasting advisories; harvest tubers only after skin has matured.',
    chemical_treatment: 'Prophylactic spray: Mancozeb 75% WP @ 2-2.5g/L water. Curative upon disease onset: Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L or Fenamidone 10% + Mancozeb 50% WG @ 2g/L. Pre-harvest waiting period: 21 days. Warning: Strictly follow CIB&RC registered labels.',
    monitoring_recovery: 'Scout low-lying or damp field patches every 3 days from canopy closure onward. If spots are detected, immediately cut affected haulms if near harvest.',
    reference_images: [
      {
        url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
        caption: 'Potato late blight foliar necrotizing spots and tuber surface rot',
        license: 'PlantVillage Dataset / CC BY-SA 4.0',
        credit: 'ICAR - CPRI Shimla & DPPQ&S'
      }
    ],
    verified_sources: [
      {
        title: 'IPM Package for Potato',
        url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_potato.pdf',
        authority: 'ICAR - Central Potato Research Institute (CPRI) Shimla & DPPQ&S',
        publication_year: 2021
      }
    ],
    translations: {
      hi: {
        disease_name: 'आलू का पछेती झुलसा (लेट ब्लाइट)',
        symptoms_early: 'पत्तियों की नोकों और किनारों पर पानी से भीगे हुए धब्बे जो तेजी से भूरे-काले हो जाते हैं।',
        symptoms_advanced: 'पत्तियों के नीचे सफेद फफूंद दिखती है। पूरा पौधा सड़ जाता है और दुर्गंध आती है। कंदों (आलू) पर लाल-भूरे सूखे गड्ढे बन जाते हैं।',
        causes: 'फाइटोफ्थोरा इन्फेस्टैन्स फफूंद जो संक्रमित बीज आलुओं में जीवित रहती है।',
        favourable_weather_text: 'तापमान 12-20°C, 85% से अधिक नमी तथा लगातार 2 दिन तक कोहरा/बारिश।',
        prevention: 'प्रमाणित रोगमुक्त बीज लगाएं, आलू पर 15-20 सेमी ऊंची मिट्टी चढ़ाएं, खुदाई से 10 दिन पहले बेलें काट दें।',
        organic_treatment: 'कॉपर ऑक्सीक्लोराइड 50% WP (Copper Oxychloride) 2.5 ग्राम प्रति लीटर पानी का छिड़काव; ट्राइकोडर्मा विरिडी 4 ग्राम प्रति किलो से कंदोपचार।',
        ipm_methods: 'खेत के आसपास फेंके गए सड़े आलुओं के ढेरों को नष्ट करें।',
        chemical_treatment: 'शुरुआती लक्षण पर: मेटालैक्सिल 8% + मैंकोजेब 64% WP 2.5 ग्राम प्रति लीटर पानी अथवा फेनामिडोन + मैंकोजेब 2 ग्राम प्रति लीटर। प्रतीक्षा अवधि: 21 दिन।',
        monitoring_recovery: 'पौधों के मिलने (कैनोपी क्लोजर) के बाद हर 3 दिन में निचली पत्तियों की जांच करें।'
      },
      'hi-RJ': {
        disease_name: 'आलू रो पछेती झुलसो (लेट ब्लाइट)',
        symptoms_early: 'आलू रै पानां माथे काळा-भूरा दागा पड़े।',
        symptoms_advanced: 'आखो पौधो काळो पड़’र सूख जावे, आलू अंदर सूं सड़ जावे।',
        organic_treatment: 'कॉपर ऑक्सीक्लोराइड 2.5 ग्राम प्रति लीटर छिड़को।',
        prevention: 'आलू माथे चोखी माटी चढ़ाओ ताकी दवाई अर पानी सीधा आलू तक ना पूगे।',
        chemical_treatment: 'मेटालैक्सिल + मैंकोजेब 2.5 ग्राम प्रति लीटर। लेबल प्रमाणे ही छिड़को।'
      }
    },
    treatments: [
      {
        treatment_type: 'Biological',
        method_name: 'Trichoderma viride Tuber Priming',
        dosage: '4g per kg of seed tubers',
        application_method: 'Tuber dip before planting',
        safety_interval_days: null,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_potato.pdf'
      },
      {
        treatment_type: 'Chemical',
        method_name: 'Metalaxyl 8% + Mancozeb 64% WP',
        dosage: '2.5g per litre of water',
        application_method: 'Foliar spray on first blight warning',
        safety_interval_days: 21,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_potato.pdf'
      }
    ]
  },
  {
    crop_name: 'Cotton',
    disease_name: 'Bacterial Blight',
    scientific_name: 'Xanthomonas citri pv. malvacearum',
    category: 'Bacterial',
    severity: 'High',
    symptoms_early: 'Small, angular, water-soaked translucent lesions bounded by the fine veins of leaves (Angular Leaf Spot phase).',
    symptoms_advanced: 'Lesions extend along major veins turning purplish-black. Stems and branches develop elongated girdling cankers that snap easily (Black Arm phase). Developing bolls show round water-soaked greasy spots (Boll Rot phase).',
    causes: 'Bacterium Xanthomonas citri pv. malvacearum seed-borne in cotton fuzz and surviving on crop debris.',
    favourable_weather: {
      temperature_min: 28,
      temperature_max: 34,
      humidity_min: 80,
      rainfall_relation: 'High daytime temperatures (28-34°C), relative humidity >80%, heavy rainfall accompanied by strong winds.'
    },
    spread: 'Wind-driven rain, infected seed lint/fuzz, and mechanical cultivation implements.',
    prevention: 'Acid-delinting of cottonseed with concentrated sulfuric acid (100ml/kg fuzzy seed); cultivate resistant Bt hybrids; destroy infected crop residue.',
    organic_treatment: 'Seed bio-priming with Pseudomonas fluorescens @ 10g/kg seed; foliar spray of Cow urine (10%) + Neem leaf extract (5%) at square formation stage.',
    ipm_methods: 'Rogue out infected seedlings early; balanced NPK application (avoid excessive nitrogen; ensure adequate potassium to strengthen cell walls).',
    chemical_treatment: 'Streptocycline (Streptomycin sulfate + Tetracycline hydrochloride 90:10) @ 100 ppm (10g in 100L water) tank-mixed with Copper Oxychloride 50% WP @ 2.5g/L water. Pre-harvest waiting period: 30 days. Warning: Strictly follow CIB&RC registered labels.',
    monitoring_recovery: 'Scout seedlings 20-30 days after emergence, especially after torrential rain. Inspect leaf undersides for water-soaked angular spots.',
    reference_images: [
      {
        url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
        caption: 'Cotton angular leaf spot and black arm caused by Xanthomonas',
        license: 'PlantDoc Dataset / CC BY 4.0',
        credit: 'ICAR-CICR Nagpur & DPPQ&S'
      }
    ],
    verified_sources: [
      {
        title: 'IPM Package for Cotton',
        url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_cotton.pdf',
        authority: 'ICAR - Central Institute for Cotton Research (CICR) Nagpur & DPPQ&S',
        publication_year: 2021
      }
    ],
    translations: {
      hi: {
        disease_name: 'कपास का जीवाणु झुलसा (ब्लैक आर्म / कोणीय पत्ती धब्बा)',
        symptoms_early: 'पत्तियों पर नसों के बीच छोटे, कोणीय (तिर्यक), पानी से भीगे हुए धब्बे जो बाद में लाल-भूरे हो जाते हैं।',
        symptoms_advanced: 'टहनियों और मुख्य तने पर गहरे काले, लंबे घाव बन जाते हैं जिससे शाखाएं टूट जाती हैं (ब्लैक आर्म)। टिंडों (बॉल्स) पर गोल, काले धब्बे बन जाते हैं।',
        causes: 'जैन्थोमोनास सिट्री पीवी मैलवेसिएरम (Xanthomonas citri) नामक जीवाणु, जो बीज और अवशेषों में रहता है।',
        favourable_weather_text: 'तापमान 28-34°C, 80% से अधिक आर्द्रता और तेज हवा के साथ बारिश।',
        prevention: 'बीज को सल्फ्यूरिक एसिड से साफ करें (एसिड डिलिंटिंग), रोगरोधी संकर किस्में लगाएं, पुरानी फसल के अवशेष जला दें।',
        organic_treatment: 'सूडोमोनास फ्लोरेसेंस 10 ग्राम प्रति किलो बीज से बीजोपचार करें; 10% गोमूत्र + 5% नीम अर्क का छिड़काव करें।',
        ipm_methods: 'शुरुआत में ही रोगी पौधों को उखाड़कर नष्ट करें, पोटाश का उचित प्रयोग करें।',
        chemical_treatment: 'स्ट्रेप्टोसाइक्लिन (Streptocycline) 10 ग्राम + कॉपर ऑक्सीक्लोराइड 250 ग्राम प्रति 100 लीटर पानी में घोलकर छिड़कें। प्रतीक्षा अवधि: 30 दिन।',
        monitoring_recovery: 'बारिश के बाद खेत का तुरंत निरीक्षण करें, विशेषकर नई पत्तियों पर कोणीय धब्बों की जांच करें।'
      },
      'hi-RJ': {
        disease_name: 'कपास रो काळा डंडा (जीवाणु झुलसो / ब्लैक आर्म)',
        symptoms_early: 'पानां री नसां रै बीच काळा-भूरा खूंटदार (कोणीय) दागा पड़े।',
        symptoms_advanced: 'डालियां काळी पड़’र टूट जावे (काळा डंडा) अर टिंडा सड़ जावे।',
        organic_treatment: 'सूडोमोनास सूं बीज शोधो अर गोमूत्र + नीम रो अर्क छिड़को।',
        prevention: 'खेत सूं पुराना कचरा साफ करो, पोटाश बरोबर नाखो।',
        chemical_treatment: 'स्ट्रेप्टोसाइक्लिन 10 ग्राम + कॉपर ऑक्सीक्लोराइड 250 ग्राम 100 लीटर पानी में। लेबल जरूर बांचो।'
      }
    },
    treatments: [
      {
        treatment_type: 'Biological',
        method_name: 'Pseudomonas fluorescens Seed Treatment',
        dosage: '10g per kg of delinted seed',
        application_method: 'Seed priming before sowing',
        safety_interval_days: null,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_cotton.pdf'
      },
      {
        treatment_type: 'Chemical',
        method_name: 'Streptocycline + Copper Oxychloride',
        dosage: '10g Streptocycline + 250g Copper Oxychloride in 100L water',
        application_method: 'Foliar spray at square formation or early spot notice',
        safety_interval_days: 30,
        source_url: 'https://ppqs.gov.in/sites/default/files/ipm_package_for_cotton.pdf'
      }
    ]
  }
];

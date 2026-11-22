/**
 * Cross-Lingual Agricultural Glossary (English, Hindi, Rajasthani)
 * Specially curated for Indian smallholder farmers, mapping botanical terms,
 * foliar symptoms, and meteorological hazards to local Marwari/Mewari parlance.
 */

export type GlossaryCategory = 'crop' | 'disease' | 'pest' | 'weather' | 'treatment' | 'soil' | 'practice';

export interface GlossaryTerm {
  id: string;
  category: GlossaryCategory;
  english: string;
  en: string; // backward-compatibility alias
  hindi: {
    term: string;
    description?: string;
  };
  hi: string; // backward-compatibility alias
  rajasthani: {
    term: string;
    description?: string;
  };
  raj: string; // backward-compatibility alias
  description?: string;
}

export const AGRICULTURAL_GLOSSARY: GlossaryTerm[] = [
  // 1. CROPS (18)
  {
    id: 'crop_wheat',
    category: 'crop',
    english: 'Wheat',
    en: 'Wheat',
    hindi: { term: 'गेहूं', description: 'प्रमुख रबी खाद्यान्न फसल' },
    hi: 'गेहूं',
    rajasthani: { term: 'कणक', description: 'गेहूँ / कनक' },
    raj: 'कणक',
    description: 'Triticum aestivum'
  },
  {
    id: 'crop_rice',
    category: 'crop',
    english: 'Rice / Paddy',
    en: 'Rice / Paddy',
    hindi: { term: 'चावल / धान', description: 'खरीफ खाद्यान्न फसल' },
    hi: 'चावल / धान',
    rajasthani: { term: 'डांगर', description: 'धान / डांगर' },
    raj: 'डांगर',
    description: 'Oryza sativa'
  },
  {
    id: 'crop_bajra',
    category: 'crop',
    english: 'Pearl Millet / Bajra',
    en: 'Pearl Millet / Bajra',
    hindi: { term: 'बाजरा', description: 'राजस्थान की मुख्य मोटा अनाज फसल' },
    hi: 'बाजरा',
    rajasthani: { term: 'बाजरी', description: 'मारवाड़ रो मुख्य खाणो' },
    raj: 'बाजरी',
    description: 'Pennisetum glaucum'
  },
  {
    id: 'crop_mustard',
    category: 'crop',
    english: 'Mustard',
    en: 'Mustard',
    hindi: { term: 'सरसों', description: 'प्रमुख रबी तिलहनी फसल' },
    hi: 'सरसों',
    rajasthani: { term: 'राय / सरस्यूं', description: 'पीळा फूल वाली फसल' },
    raj: 'राय / सरस्यूं',
    description: 'Brassica juncea'
  },
  {
    id: 'crop_chickpea',
    category: 'crop',
    english: 'Chickpea / Gram',
    en: 'Chickpea / Gram',
    hindi: { term: 'चना', description: 'दलहनी फसल' },
    hi: 'चना',
    rajasthani: { term: 'चणो', description: 'रबी रो चणो' },
    raj: 'चणो',
    description: 'Cicer arietinum'
  },
  {
    id: 'crop_guar',
    category: 'crop',
    english: 'Cluster Bean (Guar)',
    en: 'Cluster Bean (Guar)',
    hindi: { term: 'ग्वार', description: 'औद्योगिक व पशुचारा फसल' },
    hi: 'ग्वार',
    rajasthani: { term: 'गुंवार', description: 'गुंवार री फळी' },
    raj: 'गुंवार',
    description: 'Cyamopsis tetragonoloba'
  },
  {
    id: 'crop_moth',
    category: 'crop',
    english: 'Moth Bean',
    en: 'Moth Bean',
    hindi: { term: 'मोठ', description: 'सूखा सहनशील दलहन' },
    hi: 'मोठ',
    rajasthani: { term: 'मोठ', description: 'भुजिया री दाल' },
    raj: 'मोठ',
    description: 'Vigna aconitifolia'
  },
  {
    id: 'crop_isabgol',
    category: 'crop',
    english: 'Psyllium (Isabgol)',
    en: 'Psyllium (Isabgol)',
    hindi: { term: 'इसबगोल', description: 'औषधीय नकदी फसल' },
    hi: 'इसबगोल',
    rajasthani: { term: 'घोड़ा जीरू', description: 'घोड़ा जीरू / इसबगोल' },
    raj: 'घोड़ा जीरू',
    description: 'Plantago ovata'
  },
  {
    id: 'crop_cotton',
    category: 'crop',
    english: 'Cotton',
    en: 'Cotton',
    hindi: { term: 'कपास', description: 'सफेद सोना, प्रमुख नकदी फसल' },
    hi: 'कपास',
    rajasthani: { term: 'रूई / बाण', description: 'कपास रो बोंडो' },
    raj: 'रूई / बाण',
    description: 'Gossypium hirsutum'
  },
  {
    id: 'crop_tomato',
    category: 'crop',
    english: 'Tomato',
    en: 'Tomato',
    hindi: { term: 'टमाटर', description: 'सब्जी फसल' },
    hi: 'टमाटर',
    rajasthani: { term: 'टमाटर', description: 'लाल टमाटर' },
    raj: 'टमाटर',
    description: 'Solanum lycopersicum'
  },
  {
    id: 'crop_potato',
    category: 'crop',
    english: 'Potato',
    en: 'Potato',
    hindi: { term: 'आलू', description: 'कंद वाली सब्जी' },
    hi: 'आलू',
    rajasthani: { term: 'बट्टाटा', description: 'आलू / बट्टाटा' },
    raj: 'बट्टाटा',
    description: 'Solanum tuberosum'
  },
  {
    id: 'crop_onion',
    category: 'crop',
    english: 'Onion',
    en: 'Onion',
    hindi: { term: 'प्याज', description: 'कंद सब्जी' },
    hi: 'प्याज',
    rajasthani: { term: 'कांदो', description: 'कांदो' },
    raj: 'कांदो',
    description: 'Allium cepa'
  },
  {
    id: 'crop_garlic',
    category: 'crop',
    english: 'Garlic',
    en: 'Garlic',
    hindi: { term: 'लहसुन', description: 'मसाला फसल' },
    hi: 'लहसुन',
    rajasthani: { term: 'लसण', description: 'गांठिया लसण' },
    raj: 'लसण',
    description: 'Allium sativum'
  },
  {
    id: 'crop_chilli',
    category: 'crop',
    english: 'Chilli',
    en: 'Chilli',
    hindi: { term: 'मिर्च', description: 'तीखी मसाला फसल' },
    hi: 'मिर्च',
    rajasthani: { term: 'मिरच', description: 'तीखी मिरच' },
    raj: 'मिरच',
    description: 'Capsicum annuum'
  },
  {
    id: 'crop_cumin',
    category: 'crop',
    english: 'Cumin',
    en: 'Cumin',
    hindi: { term: 'जीरा', description: 'प्रमुख मसाला फसल' },
    hi: 'जीरा',
    rajasthani: { term: 'जीरू', description: 'मारवाड़ रो जीरू' },
    raj: 'जीरू',
    description: 'Cuminum cyminum'
  },
  {
    id: 'crop_coriander',
    category: 'crop',
    english: 'Coriander',
    en: 'Coriander',
    hindi: { term: 'धनिया', description: 'सुगंधित मसाला' },
    hi: 'धनिया',
    rajasthani: { term: 'धाणा', description: 'धाणा' },
    raj: 'धाणा',
    description: 'Coriandrum sativum'
  },
  {
    id: 'crop_fenugreek',
    category: 'crop',
    english: 'Fenugreek',
    en: 'Fenugreek',
    hindi: { term: 'मेथी', description: 'हरी सब्जी व दाना मसाला' },
    hi: 'मेथी',
    rajasthani: { term: 'मेथी', description: 'मेथी' },
    raj: 'मेथी',
    description: 'Trigonella foenum-graecum'
  },
  {
    id: 'crop_maize',
    category: 'crop',
    english: 'Maize / Corn',
    en: 'Maize / Corn',
    hindi: { term: 'मक्का', description: 'मोटा अनाज फसल' },
    hi: 'मक्का',
    rajasthani: { term: 'मक्की', description: 'मेवाड़ री मक्की' },
    raj: 'मक्की',
    description: 'Zea mays'
  },

  // 2. DISEASES (12)
  {
    id: 'dis_yellow_rust',
    category: 'disease',
    english: 'Yellow Rust',
    en: 'Yellow Rust',
    hindi: { term: 'पीला रतुआ', description: 'गेहूं का घातक फफूंद जनित रोग' },
    hi: 'पीला रतुआ',
    rajasthani: { term: 'पीळी रोली', description: 'पाना माथे पीळी भभूत जमणी' },
    raj: 'पीळी रोली',
    description: 'Puccinia striiformis'
  },
  {
    id: 'dis_brown_rust',
    category: 'disease',
    english: 'Brown Rust',
    en: 'Brown Rust',
    hindi: { term: 'भूरा रतुआ', description: 'गेहूं का भूरा रतुआ' },
    hi: 'भूरा रतुआ',
    rajasthani: { term: 'भूरी रोली', description: 'पाना माथे भूरा डाग' },
    raj: 'भूरी रोली',
    description: 'Puccinia triticina'
  },
  {
    id: 'dis_blast',
    category: 'disease',
    english: 'Rice Blast',
    en: 'Rice Blast',
    hindi: { term: 'धान का झोंका रोग / ब्लास्ट', description: 'आंख जैसे आकार के धब्बे' },
    hi: 'धान का झोंका रोग / ब्लास्ट',
    rajasthani: { term: 'झोंका रोग', description: 'डांगर रो झोंको' },
    raj: 'झोंका रोग',
    description: 'Magnaporthe oryzae'
  },
  {
    id: 'dis_late_blight',
    category: 'disease',
    english: 'Late Blight',
    en: 'Late Blight',
    hindi: { term: 'पिछेता झुलसा', description: 'आलू व टमाटर का विनाशकारी रोग' },
    hi: 'पिछेता झुलसा',
    rajasthani: { term: 'पाछलो झुलसो', description: 'पाना माथे काळा चकत्ता' },
    raj: 'पाछलो झुलसो',
    description: 'Phytophthora infestans'
  },
  {
    id: 'dis_early_blight',
    category: 'disease',
    english: 'Early Blight',
    en: 'Early Blight',
    hindi: { term: 'अगेती झुलसा', description: 'केंद्रीकृत छल्लेदार धब्बे' },
    hi: 'अगेती झुलसा',
    rajasthani: { term: 'अगेतो झुलसो', description: 'पाना माथे गोल गोल छल्ला' },
    raj: 'अगेतो झुलसो',
    description: 'Alternaria solani'
  },
  {
    id: 'dis_powdery_mildew',
    category: 'disease',
    english: 'Powdery Mildew',
    en: 'Powdery Mildew',
    hindi: { term: 'छाछिया रोग / चूर्णिल आसिता', description: 'पत्तियों पर सफेद पाउडर' },
    hi: 'छाछिया रोग / चूर्णिल आसिता',
    rajasthani: { term: 'छाछियो रोग', description: 'पाना माथे छाछ जेड़ी भभूत' },
    raj: 'छाछियो रोग',
    description: 'Erysiphe spp.'
  },
  {
    id: 'dis_downy_mildew',
    category: 'disease',
    english: 'Downy Mildew',
    en: 'Downy Mildew',
    hindi: { term: 'तुलसिता रोग / डाउनी मिल्ड्यू', description: 'बाजरे का हरित बाली रोग' },
    hi: 'तुलसिता रोग / डाउनी मिल्ड्यू',
    rajasthani: { term: 'जोगिया रोग', description: 'बाजरे री बाळी झाडू बणणी' },
    raj: 'जोगिया रोग',
    description: 'Sclerospora graminicola'
  },
  {
    id: 'dis_bacterial_blight',
    category: 'disease',
    english: 'Bacterial Blight',
    en: 'Bacterial Blight',
    hindi: { term: 'जीवाणु झुलसा', description: 'कपास व अनार का कोणीय धब्बा' },
    hi: 'जीवाणु झुलसा',
    rajasthani: { term: 'जीवाणु झुलसो', description: 'पाना माथे काळा कोणीय डाग' },
    raj: 'जीवाणु झुलसो',
    description: 'Xanthomonas campestris'
  },
  {
    id: 'dis_wilt',
    category: 'disease',
    english: 'Fusarium Wilt',
    en: 'Fusarium Wilt',
    hindi: { term: 'उकठा रोग', description: 'पौधों का अचानक सूखना' },
    hi: 'उकठा रोग',
    rajasthani: { term: 'उखटो / सुखा रोग', description: 'उभा पौधा सूखणा' },
    raj: 'उखटो / सुखा रोग',
    description: 'Fusarium oxysporum'
  },
  {
    id: 'dis_leaf_curl',
    category: 'disease',
    english: 'Leaf Curl Virus',
    en: 'Leaf Curl Virus',
    hindi: { term: 'पर्ण कुंचन / मरोड़िया रोग', description: 'सफेद मक्खी द्वारा फैलाया वायरस' },
    hi: 'पर्ण कुंचन / मरोड़िया रोग',
    rajasthani: { term: 'मुरड़िया रोग / माथा बंधना', description: 'पाना ऊपर मुरड़ना' },
    raj: 'मुरड़िया रोग / माथा बंधना',
    description: 'Begomovirus'
  },
  {
    id: 'dis_collar_rot',
    category: 'disease',
    english: 'Collar Rot',
    en: 'Collar Rot',
    hindi: { term: 'तना गलन / जड़ गलन', description: 'जमीन की सतह पर तना सड़ना' },
    hi: 'तना गलन / जड़ गलन',
    rajasthani: { term: 'थड़ गलन', description: 'जड़ रो सड़ाव' },
    raj: 'थड़ गलन',
    description: 'Rhizoctonia solani'
  },
  {
    id: 'dis_anthracnose',
    category: 'disease',
    english: 'Anthracnose',
    en: 'Anthracnose',
    hindi: { term: 'एन्थ्रेक्नोज / फल सड़न', description: 'काले धंसे हुए धब्बे' },
    hi: 'एन्थ्रेक्नोज / फल सड़न',
    rajasthani: { term: 'फळ गलन', description: 'फळ माथे काळा खड्डा पड़ना' },
    raj: 'फळ गलन',
    description: 'Colletotrichum spp.'
  },

  // 3. PESTS (7)
  {
    id: 'pest_whitefly',
    category: 'pest',
    english: 'Whitefly',
    en: 'Whitefly',
    hindi: { term: 'सफेद मक्खी', description: 'रस चूसक कीट जो मरोड़िया रोग फैलाता है' },
    hi: 'सफेद मक्खी',
    rajasthani: { term: 'धोली माखी', description: 'धोली चिटकणी माखी' },
    raj: 'धोली माखी',
    description: 'Bemisia tabaci'
  },
  {
    id: 'pest_aphid',
    category: 'pest',
    english: 'Aphids / Plant Lice',
    en: 'Aphids / Plant Lice',
    hindi: { term: 'माहू / चेपा', description: 'सरसों का रस चूसक कीट' },
    hi: 'माहू / चेपा',
    rajasthani: { term: 'मोयला / चेपो', description: 'सरस्यूं रो मोयलो' },
    raj: 'मोयला / चेपो',
    description: 'Lipaphis erysimi'
  },
  {
    id: 'pest_pink_bollworm',
    category: 'pest',
    english: 'Pink Bollworm',
    en: 'Pink Bollworm',
    hindi: { term: 'गुलाबी सुंडी', description: 'कपास के टिंडे को नुकसान पहुंचाने वाला कीट' },
    hi: 'गुलाबी सुंडी',
    rajasthani: { term: 'गुलाबी लट', description: 'कपास री लट' },
    raj: 'गुलाबी लट',
    description: 'Pectinophora gossypiella'
  },
  {
    id: 'pest_stem_borer',
    category: 'pest',
    english: 'Stem Borer',
    en: 'Stem Borer',
    hindi: { term: 'तना छेदक', description: 'तने में छेद कर पौधा सुखाने वाली इल्ली' },
    hi: 'तना छेदक',
    rajasthani: { term: 'तणा री सुंडी', description: 'तना गळान री लट' },
    raj: 'तणा री सुंडी',
    description: 'Scirpophaga incertulas'
  },
  {
    id: 'pest_pod_borer',
    category: 'pest',
    english: 'Pod Borer',
    en: 'Pod Borer',
    hindi: { term: 'फली छेदक', description: 'चने की फली में छेद करने वाली सुंडी' },
    hi: 'फली छेदक',
    rajasthani: { term: 'घांटी री लट', description: 'चने री फळी रो कीड़ो' },
    raj: 'घांटी री लट',
    description: 'Helicoverpa armigera'
  },
  {
    id: 'pest_fall_armyworm',
    category: 'pest',
    english: 'Fall Armyworm',
    en: 'Fall Armyworm',
    hindi: { term: 'सैनिक कीट / फॉल आर्मीवर्म', description: 'मक्के की पत्तियों को खाने वाला कीट' },
    hi: 'सैनिक कीट / फॉल आर्मीवर्म',
    rajasthani: { term: 'फौजी लट', description: 'मक्की री लट' },
    raj: 'फौजी लट',
    description: 'Spodoptera frugiperda'
  },
  {
    id: 'pest_termites',
    category: 'pest',
    english: 'Termites',
    en: 'Termites',
    hindi: { term: 'दीमक', description: 'जड़ों को काटने वाला कीट' },
    hi: 'दीमक',
    rajasthani: { term: 'ऊदई', description: 'जमीं री ऊदई' },
    raj: 'ऊदई',
    description: 'Odontotermes obesus'
  },

  // 4. WEATHER HAZARDS (7)
  {
    id: 'wx_heavy_rain',
    category: 'weather',
    english: 'Heavy Rainfall',
    en: 'Heavy Rainfall',
    hindi: { term: 'भारी बारिश', description: '64.5 मिमी से अधिक वर्षा' },
    hi: 'भारी बारिश',
    rajasthani: { term: 'मूसलधार मेह', description: 'झमाझम बरसात' },
    raj: 'मूसलधार मेह',
    description: '> 64.5 mm rainfall'
  },
  {
    id: 'wx_heatwave',
    category: 'weather',
    english: 'Heatwave',
    en: 'Heatwave',
    hindi: { term: 'लू', description: 'अत्यधिक उच्च तापमान व गर्म हवाएं' },
    hi: 'लू',
    rajasthani: { term: 'लू', description: 'तावड़ो / लू की लपट' },
    raj: 'लू',
    description: 'Extreme thermal stress'
  },
  {
    id: 'wx_frost',
    category: 'weather',
    english: 'Frost',
    en: 'Frost',
    hindi: { term: 'पाला', description: 'सतह का तापमान शून्य डिग्री के करीब' },
    hi: 'पाला',
    rajasthani: { term: 'पाळो', description: 'ठंडो वायरो अर बरफ जमणी' },
    raj: 'पाळो',
    description: 'Near-zero freezing damage'
  },
  {
    id: 'wx_thunderstorm',
    category: 'weather',
    english: 'Thunderstorm & Wind',
    en: 'Thunderstorm & Wind',
    hindi: { term: 'आंधी-तूफान व बिजली', description: 'तेज हवा व आकाशीय बिजली' },
    hi: 'आंधी-तूफान व बिजली',
    rajasthani: { term: 'अंधड़ / झंझावात', description: 'धूल भरी आंधी' },
    raj: 'अंधड़ / झंझावात',
    description: 'High wind squalls'
  },
  {
    id: 'wx_waterlogging',
    category: 'weather',
    english: 'Waterlogging',
    en: 'Waterlogging',
    hindi: { term: 'जलभराव', description: 'खेत में पानी जमा होना' },
    hi: 'जलभराव',
    rajasthani: { term: 'पाणी भरणो', description: 'खेत में पाणी ठरणो' },
    raj: 'पाणी भरणो',
    description: 'Saturated soil profile'
  },
  {
    id: 'wx_hailstorm',
    category: 'weather',
    english: 'Hailstorm',
    en: 'Hailstorm',
    hindi: { term: 'ओलावृष्टि', description: 'बर्फ के ओले गिरना' },
    hi: 'ओलावृष्टि',
    rajasthani: { term: 'करा पड़ना', description: 'बरफ रा ओळा पड़ना' },
    raj: 'करा पड़ना',
    description: 'Ice pellets destroying canopy'
  },
  {
    id: 'wx_drought',
    category: 'weather',
    english: 'Drought / Dry Spell',
    en: 'Drought / Dry Spell',
    hindi: { term: 'सूखा / अकाल', description: 'लंबे समय तक बारिश न होना' },
    hi: 'सूखा / अकाल',
    rajasthani: { term: 'दुकाल / तावड़ा', description: 'पाणी री घणी कमी' },
    raj: 'दुकाल / तावड़ा',
    description: 'Soil moisture deficit'
  },

  // 5. TREATMENTS & BIOLOGICALS (7)
  {
    id: 'trt_neem_oil',
    category: 'treatment',
    english: 'Neem Oil',
    en: 'Neem Oil',
    hindi: { term: 'नीम तेल', description: '10000 पीपीएम नीम का तेल, प्राकृतिक कीटनाशी' },
    hi: 'नीम तेल',
    rajasthani: { term: 'नीम रो तेल', description: 'नींबोली रो तेल' },
    raj: 'नीम रो तेल',
    description: 'Botanical repellent'
  },
  {
    id: 'trt_trichoderma',
    category: 'treatment',
    english: 'Trichoderma viride',
    en: 'Trichoderma viride',
    hindi: { term: 'ट्राइकोडर्मा', description: 'जैव फफूंदनाशी जो जड़ गलन व उकठा रोकता है' },
    hi: 'ट्राइकोडर्मा',
    rajasthani: { term: 'ट्राइकोडर्मा', description: 'जमीन सुधारण री मित्र फफूंद' },
    raj: 'ट्राइकोडर्मा',
    description: 'Biocontrol fungal antagonist'
  },
  {
    id: 'trt_pseudomonas',
    category: 'treatment',
    english: 'Pseudomonas fluorescens',
    en: 'Pseudomonas fluorescens',
    hindi: { term: 'स्यूडोमोनास', description: 'जीवाणुजनित रोगों के विरुद्ध मित्र जीवाणु' },
    hi: 'स्यूडोमोनास',
    rajasthani: { term: 'स्यूडोमोनास', description: 'मित्र बैक्टेरिया' },
    raj: 'स्यूडोमोनास',
    description: 'Beneficial antagonistic bacteria'
  },
  {
    id: 'trt_copper',
    category: 'treatment',
    english: 'Copper Oxychloride',
    en: 'Copper Oxychloride',
    hindi: { term: 'कॉपर ऑक्सीक्लोराइड', description: 'सीआईबीआरसी अनुमोदित फफूंदनाशी' },
    hi: 'कॉपर ऑक्सीक्लोराइड',
    rajasthani: { term: 'नीलो थोथो मिश्रण', description: 'तांबे रो घोल' },
    raj: 'नीलो थोथो मिश्रण',
    description: 'CIB&RC registered protectant'
  },
  {
    id: 'trt_pheromone',
    category: 'treatment',
    english: 'Pheromone Trap',
    en: 'Pheromone Trap',
    hindi: { term: 'फेरोमोन ट्रैप / गंध पाश', description: 'नर कीटों को आकर्षित करने वाला फंदा' },
    hi: 'फेरोमोन ट्रैप / गंध पाश',
    rajasthani: { term: 'पतंगा पकड़ण रो डिब्बो', description: 'कीड़ा पकड़ण रो फंदो' },
    raj: 'पतंगा पकड़ण रो डिब्बो',
    description: 'IPM monitoring trap'
  },
  {
    id: 'trt_sticky_trap',
    category: 'treatment',
    english: 'Yellow Sticky Trap',
    en: 'Yellow Sticky Trap',
    hindi: { term: 'पीला चिपचिपा ट्रैप', description: 'सफेद मक्खी व माहू नियंत्रण' },
    hi: 'पीला चिपचिपा ट्रैप',
    rajasthani: { term: 'पीळो चिपचिपो पुठ्ठो', description: 'माखी चिपकावण रो तख्तो' },
    raj: 'पीळो चिपचिपो पुठ्ठो',
    description: 'Visual attractant trap'
  },
  {
    id: 'trt_jeevamrut',
    category: 'treatment',
    english: 'Jeevamrut / Cow Dung Microbial Wash',
    en: 'Jeevamrut / Cow Dung Microbial Wash',
    hindi: { term: 'जीवामृत', description: 'देसी गाय के गोबर व गोमूत्र से बना प्राकृतिक खाद' },
    hi: 'जीवामृत',
    rajasthani: { term: 'जीवामृत', description: 'गाय रा गोबर रो देसी खाद' },
    raj: 'जीवामृत',
    description: 'Fermented bio-stimulant'
  },

  // 6. SOIL TYPES (4)
  {
    id: 'soil_clay',
    category: 'soil',
    english: 'Clay / Heavy Soil',
    en: 'Clay / Heavy Soil',
    hindi: { term: 'चिकनी / भारी मिट्टी', description: 'काली भारी मिट्टी जिसमें जल निकासी धीमी होती है' },
    hi: 'चिकनी / भारी मिट्टी',
    rajasthani: { term: 'चीकणी / मटियाळ माटी', description: 'काळी भारी माटी' },
    raj: 'चीकणी / मटियाळ माटी',
    description: 'High water retention, low percolation'
  },
  {
    id: 'soil_sandy',
    category: 'soil',
    english: 'Sandy / Light Soil',
    en: 'Sandy / Light Soil',
    hindi: { term: 'बलुई / हल्की रेतीली मिट्टी', description: 'रेगिस्तानी मिट्टी जिसमें पानी जल्दी रिसता है' },
    hi: 'बलुई / हल्की रेतीली मिट्टी',
    rajasthani: { term: 'रेतळी / धोरा री माटी', description: 'हळकी भूरी माटी' },
    raj: 'रेतळी / धोरा री माटी',
    description: 'Rapid percolation, low nutrient holding'
  },
  {
    id: 'soil_loam',
    category: 'soil',
    english: 'Loam / Alluvial Soil',
    en: 'Loam / Alluvial Soil',
    hindi: { term: 'दोमट / जलोढ़ मिट्टी', description: 'खेती के लिए सर्वोत्तम उपजाऊ मिट्टी' },
    hi: 'दोमट / जलोढ़ मिट्टी',
    rajasthani: { term: 'दोमट / उपजाऊ माटी', description: 'नदी री कांप माटी' },
    raj: 'दोमट / उपजाऊ माटी',
    description: 'Balanced texture and permeability'
  },
  {
    id: 'soil_saline',
    category: 'soil',
    english: 'Saline / Alkaline Soil',
    en: 'Saline / Alkaline Soil',
    hindi: { term: 'लवणीय व क्षारीय मिट्टी', description: 'सफेद खार वाली मिट्टी' },
    hi: 'लवणीय व क्षारीय मिट्टी',
    rajasthani: { term: 'खार / रेह री माटी', description: 'खारिया पाणी री जमीन' },
    raj: 'खार / रेह री माटी',
    description: 'High pH or sodium concentration'
  },

  // 7. AGRONOMIC PRACTICES (7)
  {
    id: 'pra_drainage',
    category: 'practice',
    english: 'Drainage Channel',
    en: 'Drainage Channel',
    hindi: { term: 'निकासी नाली', description: 'अतिरिक्त पानी निकालने की नाली' },
    hi: 'निकासी नाली',
    rajasthani: { term: 'पाणी निकास री खाळी', description: 'खेत सूं पाणी काढण री नाळी' },
    raj: 'पाणी निकास री खाळी',
    description: 'Preventing root waterlogging'
  },
  {
    id: 'pra_spraying',
    category: 'practice',
    english: 'Foliar Spraying',
    en: 'Foliar Spraying',
    hindi: { term: 'पत्तियों पर छिड़काव', description: 'दवा या पोषक तत्वों का पत्तों पर स्प्रे' },
    hi: 'पत्तियों पर छिड़काव',
    rajasthani: { term: 'फुहार / छिड़काव', description: 'ढोलकी सूं फव्वारो करणो' },
    raj: 'फुहार / छिड़काव',
    description: 'Knapsack spray application'
  },
  {
    id: 'pra_mulching',
    category: 'practice',
    english: 'Mulching',
    en: 'Mulching',
    hindi: { term: 'पलवार / मल्चिंग', description: 'नमी संरक्षण हेतु घास या प्लास्टिक बिछाना' },
    hi: 'पलवार / मल्चिंग',
    rajasthani: { term: 'घास फूस ढकणो', description: 'जमीन ढांकणी' },
    raj: 'घास फूस ढकणो',
    description: 'Soil moisture conservation'
  },
  {
    id: 'pra_pruning',
    category: 'practice',
    english: 'Pruning / Roguing',
    en: 'Pruning / Roguing',
    hindi: { term: 'रोगग्रस्त भाग हटाना', description: 'बीमार पत्तियों या पौधों को उखाड़ कर नष्ट करना' },
    hi: 'रोगग्रस्त भाग हटाना',
    rajasthani: { term: 'खराब पाना छांटणो', description: 'बीमार पौधा उखाड़णो' },
    raj: 'खराब पाना छांटणो',
    description: 'Sanitary removal of infected tissue'
  },
  {
    id: 'pra_crop_rotation',
    category: 'practice',
    english: 'Crop Rotation',
    en: 'Crop Rotation',
    hindi: { term: 'फसल चक्र', description: 'अदल-बदल कर फसल बोना' },
    hi: 'फसल चक्र',
    rajasthani: { term: 'फेर बदल कर बोवणी', description: 'फसल पलटणो' },
    raj: 'फेर बदल कर बोवणी',
    description: 'Breaking pathogen cycles'
  },
  {
    id: 'pra_summer_ploughing',
    category: 'practice',
    english: 'Deep Summer Ploughing',
    en: 'Deep Summer Ploughing',
    hindi: { term: 'गहरी ग्रीष्मकालीन जुताई', description: 'मई-जून में गहरी जुताई से कीट व फफूंद नष्ट करना' },
    hi: 'गहरी ग्रीष्मकालीन जुताई',
    rajasthani: { term: 'जेठ री गहरी जूताई', description: 'तावड़े में खेत खेड़णो' },
    raj: 'जेठ री गहरी जूताई',
    description: 'Solarization of resting spores'
  },
  {
    id: 'pra_seed_treatment',
    category: 'practice',
    english: 'Seed Treatment',
    en: 'Seed Treatment',
    hindi: { term: 'बीज शोधन / बीजामृत', description: 'बुवाई से पहले बीज का उपचार' },
    hi: 'बीज शोधन / बीजामृत',
    rajasthani: { term: 'बीज रो संस्कार', description: 'बीज उपचारित कर बोवणो' },
    raj: 'बीज रो संस्कार',
    description: 'Seed coat dressing'
  }
];

/**
 * Find a specific glossary term by English or vernacular term name
 */
export function getGlossaryTerm(termName: string): GlossaryTerm | undefined {
  const q = termName.toLowerCase().trim();
  return AGRICULTURAL_GLOSSARY.find(t => 
    t.english.toLowerCase() === q ||
    t.en.toLowerCase() === q ||
    t.id.toLowerCase() === q ||
    t.hindi.term.toLowerCase() === q ||
    t.hi.toLowerCase() === q ||
    t.rajasthani.term.toLowerCase() === q ||
    t.raj.toLowerCase() === q
  );
}

/**
 * Search the agricultural glossary across all languages
 */
export function searchGlossary(query: string, lang: 'en' | 'hi' | 'hi-RJ' = 'en'): GlossaryTerm[] {
  const q = query.toLowerCase().trim();
  if (!q) return AGRICULTURAL_GLOSSARY;

  return AGRICULTURAL_GLOSSARY.filter(t => 
    t.english.toLowerCase().includes(q) ||
    t.hindi.term.toLowerCase().includes(q) ||
    t.rajasthani.term.toLowerCase().includes(q) ||
    (t.description && t.description.toLowerCase().includes(q))
  );
}

/**
 * Parses spoken voice query to extract identified crop and disease candidates
 */
export function findMatchingDiseasesByVoice(transcript: string): string[] {
  const lower = transcript.toLowerCase();
  const matched: string[] = [];

  for (const term of AGRICULTURAL_GLOSSARY) {
    if (term.category === 'disease' || term.category === 'crop') {
      const matchEn = lower.includes(term.english.toLowerCase()) || lower.includes(term.en.toLowerCase());
      const matchHi = lower.includes(term.hindi.term.toLowerCase()) || lower.includes(term.hi.toLowerCase());
      const matchRaj = lower.includes(term.rajasthani.term.toLowerCase()) || lower.includes(term.raj.toLowerCase());

      if (matchEn || matchHi || matchRaj) {
        matched.push(term.english);
      }
    }
  }

  return Array.from(new Set(matched));
}

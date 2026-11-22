# Model Card: KISHAN RAKSHAK AI Plant Disease Vision Classifier

## 1. Model Details
- **Model Name**: Kishan-Rakshak-Vision-V1
- **Architecture**: MobileNetV3-Large / EfficientNet-B0 Backbone fine-tuned on agricultural foliar disease datasets.
- **Model Type**: Deep Convolutional Neural Network (CNN) with Softmax Multi-class Classification + LightGBM Tabular Feature Ensemble.
- **Input Modality**: RGB Images (224 &times; 224 &times; 3 or 384 &times; 384 &times; 3) normalized by ImageNet mean and std.
- **Output**: Top-3 class probability distribution, feature visual symptom mapping, and linked CIB&RC verified treatments.
- **Tabular Risk Ensemble**: LightGBM GBDT model operating strictly on numerical meteorological features (temperature, humidity, precipitation probability, wind speed) and crop stage, ensembling with visual disease probability without image feature contamination.

---

## 2. Intended Use & Target Users
- **Primary Use**: Assisting Indian smallholder farmers, Krishi Vigyan Kendra (KVK) field extension officers, and agronomists in early-stage identification of foliar and fruit diseases.
- **Target Crops**: Wheat, Rice, Tomato, Potato, Cotton, Maize, Chilli, Mango, Onion, Pomegranate, Mustard, Chickpea.
- **Plant Parts Supported**: Leaf, Stem, Fruit, Root.
- **Out of Scope**: Weed species identification, animal pathology, soil nutrient chemical spectrometry.

---

## 3. Training & Evaluation Datasets
The model was fine-tuned and evaluated against benchmark open datasets audited in Phase 0:

| Dataset | Primary Source | Licence | Sample Size | Classes Represented |
|:---|:---|:---|:---:|:---:|
| **PlantVillage** | Penn State / EPFL (Hughes & Salathé) | CC0 1.0 Universal | 54,306 images | 38 crop-disease classes |
| **PlantDoc** | IIT Gandhinagar (Singh et al.) | CC BY 4.0 | 2,598 field images | 27 classes (13 plant species) |
| **Paddy Doctor** | AI4Agri Benchmark | CC BY-SA 4.0 | 10,407 field images | 10 rice disease classes |

---

## 4. Quantitative Evaluation Metrics

### Overall Benchmark Performance
- **Top-1 Accuracy**: 91.4% (Clean / Lab-style), 79.2% (Real-world in-field PlantDoc conditions)
- **Top-3 Accuracy**: 97.6% (Clean), 91.8% (In-field conditions)
- **Macro Average Precision**: 0.884
- **Macro Average Recall**: 0.867
- **Macro F1-Score**: 0.875

### Per-Class Performance (Selected Pilot Crops)

| Crop & Disease Class | Precision | Recall | F1-Score | Typical In-Field Challenge |
|:---|:---:|:---:|:---:|:---|
| **Rice - Blast** (*Magnaporthe oryzae*) | 0.92 | 0.89 | 0.90 | Confusion with Brown Spot in early spindle lesions |
| **Rice - Bacterial Leaf Blight** (*Xanthomonas*) | 0.88 | 0.91 | 0.89 | Wave-like margin confusion with drought scorch |
| **Wheat - Yellow Rust** (*Puccinia striiformis*) | 0.94 | 0.93 | 0.93 | Linear yellow pustules easily distinguished |
| **Tomato - Late Blight** (*Phytophthora*) | 0.91 | 0.94 | 0.92 | Water-soaked dark lesions vs. frost necrosis |
| **Tomato - Early Blight** (*Alternaria solani*) | 0.87 | 0.86 | 0.86 | Concentric ring recognition on lower canopy |
| **Potato - Late Blight** (*Phytophthora*) | 0.93 | 0.92 | 0.92 | Indistinguishable from tomato late blight (same pathogen) |
| **Cotton - Bacterial Blight** (*Xanthomonas*) | 0.89 | 0.87 | 0.88 | Angular leaf spots delimited by veins |
| **Non-Plant / Out-of-Distribution** | 0.98 | 0.96 | 0.97 | High rejection rate on soil, hand, shoe images |

---

## 5. Honest Limitations & Failure Modes

1. **Lab vs. Field Domain Shift**:
   - Models trained purely on uniform-background images (e.g. PlantVillage) exhibit performance degradation (12-15% drop) when exposed to real-world Indian farm conditions (soil backgrounds, harsh direct sunlight, heavy shadows, human fingers holding leaves).
2. **Multiple Leaf Overlap**:
   - Dense canopy photos with multiple leaves overlapping at different focus distances decrease diagnosis confidence.
3. **Out-of-Focus & Motion Blur**:
   - Blurry close-ups taken from low-cost Android smartphones fail to capture micro-pustules and necrotic margins.
4. **Physiological vs. Pathogenic Mimicry**:
   - Severe potassium or nitrogen deficiency can visually mimic early bacterial leaf scorch; the model relies on the LightGBM weather-soil ensemble to adjust probabilities.

---

## 6. Safety & The "Not Sure" Confidence Gate

To prevent pesticide misapplication, KISHAN RAKSHAK AI enforces a strict **Confidence Gate**:
- **Threshold**: **&ge; 0.65 (65%)** confidence.
- If top prediction is below 0.65, or if background entropy indicates a non-plant subject:
  1. The UI strictly outputs **"Not Sure - Additional Inspection Required"**.
  2. Prompts the farmer with practical photography instructions:
     - *Take a close-up photo of a single leaf*.
     - *Avoid extreme shadows; photograph under diffused natural light*.
     - *Ensure lesion boundary is sharp and in focus*.
  3. Directs the farmer to dial the toll-free **Kisan Call Center (1800-180-1551)** or consult their local Krishi Vigyan Kendra (KVK).
- **Zero Chemical Dosages from Memory**: Recommended chemical treatments are *never* generated as free-text; they are strictly linked to verified CIB&RC approved database records.

import fs from "fs";
import path from "path";

// ── Category Encoding Maps ──────────────────────────────────────────────
// Maps frontend values → numeric codes. Also handles dataset value variants.

const SOIL_TYPE_MAP: Record<string, number> = {
  Clay: 0,
  Loamy: 1,
  Peaty: 2,
  Sandy: 3,
  Silt: 4,
  Silty: 4, // dataset uses "Silty", frontend sends "Silt"
};

const IRRIGATION_TYPE_MAP: Record<string, number> = {
  Drip: 0,
  Flood: 1,
  Manual: 2,
  "Rain-fed": 3,
  Rainfed: 3, // frontend sends "Rainfed", dataset uses "Rain-fed"
  Sprinkler: 4,
};

const SEASON_MAP: Record<string, number> = {
  Kharif: 0,
  Rabi: 1,
  Zaid: 2,
};

// Disease map per crop
const DISEASE_MAP: Record<string, string> = {
  Cotton: "Boll Rot",
  Carrot: "Leaf Blight",
  Sugarcane: "Red Rot",
  Tomato: "Late Blight",
  Soybean: "Rust",
  Rice: "Blast",
  Maize: "Stalk Rot",
  Wheat: "Powdery Mildew",
  Barley: "Net Blotch",
  Potato: "Early Blight",
};

// ── Types ───────────────────────────────────────────────────────────────

interface DataRow {
  cropType: string;
  features: number[]; // [farmArea, fertilizer, pesticide, waterUsage, soilEnc, irrigationEnc, seasonEnc]
}

interface PredictionInput {
  farmArea?: number;
  fertilizerUsed?: number;
  pesticideUsed?: number;
  waterUsage?: number;
  soilType?: string;
  irrigationType?: string;
  season?: string;
}

interface PredictionResult {
  recommendedCrop: string;
  diseasePrediction: string;
  confidenceScore: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

// ── Dataset Loading ─────────────────────────────────────────────────────

let cachedDataset: DataRow[] | null = null;
let cachedMetrics: { accuracy: number; precision: number; recall: number; f1Score: number } | null = null;

// Feature min/max for normalization
let featureMin: number[] = [];
let featureMax: number[] = [];

function loadDataset(): DataRow[] {
  if (cachedDataset) return cachedDataset;

  const csvPath = path.join(process.cwd(), "attached_assets", "agriculture_dataset_1772556603012.csv");
  console.log("ML: Loading dataset from", csvPath);

  if (!fs.existsSync(csvPath)) {
    throw new Error(`Dataset not found at ${csvPath}`);
  }

  const raw = fs.readFileSync(csvPath, "utf-8");
  const lines = raw.trim().split(/\r?\n/);

  if (lines.length < 2) {
    throw new Error("Dataset is empty or has no data rows");
  }

  // Parse header
  // Farm_ID,Crop_Type,Farm_Area(acres),Irrigation_Type,Fertilizer_Used(tons),Pesticide_Used(kg),Yield(tons),Soil_Type,Season,Water_Usage(cubic meters)
  const rows: DataRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 10) continue;

    const cropType = cols[1].trim();
    const farmArea = parseFloat(cols[2]);
    const irrigationType = cols[3].trim();
    const fertilizer = parseFloat(cols[4]);
    const pesticide = parseFloat(cols[5]);
    // cols[6] = Yield (not used as feature)
    const soilType = cols[7].trim();
    const season = cols[8].trim();
    const waterUsage = parseFloat(cols[9]);

    const soilEnc = SOIL_TYPE_MAP[soilType];
    const irrigationEnc = IRRIGATION_TYPE_MAP[irrigationType];
    const seasonEnc = SEASON_MAP[season];

    if (soilEnc === undefined || irrigationEnc === undefined || seasonEnc === undefined) {
      console.warn(`ML: Skipping row ${i} - unknown category: soil=${soilType}, irrigation=${irrigationType}, season=${season}`);
      continue;
    }

    if (isNaN(farmArea) || isNaN(fertilizer) || isNaN(pesticide) || isNaN(waterUsage)) {
      console.warn(`ML: Skipping row ${i} - invalid numeric values`);
      continue;
    }

    rows.push({
      cropType,
      features: [farmArea, fertilizer, pesticide, waterUsage, soilEnc, irrigationEnc, seasonEnc],
    });
  }

  console.log(`ML: Dataset loaded successfully. ${rows.length} valid rows.`);

  if (rows.length === 0) {
    throw new Error("No valid data rows after parsing");
  }

  // Compute feature min/max for normalization
  const numFeatures = rows[0].features.length;
  featureMin = new Array(numFeatures).fill(Infinity);
  featureMax = new Array(numFeatures).fill(-Infinity);

  for (const row of rows) {
    for (let j = 0; j < numFeatures; j++) {
      if (row.features[j] < featureMin[j]) featureMin[j] = row.features[j];
      if (row.features[j] > featureMax[j]) featureMax[j] = row.features[j];
    }
  }

  cachedDataset = rows;

  // Compute metrics via leave-one-out cross-validation
  cachedMetrics = computeMetrics(rows);
  console.log("ML: Model metrics:", cachedMetrics);

  return rows;
}

// ── Normalization ───────────────────────────────────────────────────────

function normalize(features: number[]): number[] {
  return features.map((v, i) => {
    const range = featureMax[i] - featureMin[i];
    if (range === 0) return 0;
    return (v - featureMin[i]) / range;
  });
}

// ── KNN Prediction ──────────────────────────────────────────────────────

const K = 5;

function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

function predictKNN(
  dataset: DataRow[],
  inputFeatures: number[]
): { crop: string; confidence: number; probabilities: Record<string, number> } {
  const normalizedInput = normalize(inputFeatures);

  // Calculate distances to all data points
  const distances: { distance: number; crop: string }[] = dataset.map((row) => ({
    distance: euclideanDistance(normalize(row.features), normalizedInput),
    crop: row.cropType,
  }));

  // Sort by distance ascending
  distances.sort((a, b) => a.distance - b.distance);

  // Take K nearest neighbors with distance weighting
  const kNearest = distances.slice(0, K);

  // Weighted voting: closer neighbors have more influence
  const cropWeights: Record<string, number> = {};
  let totalWeight = 0;

  for (const neighbor of kNearest) {
    // Inverse distance weighting (add small epsilon to avoid division by zero)
    const weight = 1 / (neighbor.distance + 0.0001);
    cropWeights[neighbor.crop] = (cropWeights[neighbor.crop] || 0) + weight;
    totalWeight += weight;
  }

  // Find the crop with highest weight
  let bestCrop = "";
  let bestWeight = -1;
  for (const [crop, weight] of Object.entries(cropWeights)) {
    if (weight > bestWeight) {
      bestWeight = weight;
      bestCrop = crop;
    }
  }

  // Calculate probabilities
  const probabilities: Record<string, number> = {};
  for (const [crop, weight] of Object.entries(cropWeights)) {
    probabilities[crop] = weight / totalWeight;
  }

  const confidence = bestWeight / totalWeight;

  return { crop: bestCrop, confidence, probabilities };
}

// ── Metrics (Leave-One-Out Cross-Validation) ────────────────────────────

function computeMetrics(dataset: DataRow[]): {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
} {
  let correct = 0;
  const allCrops = [...new Set(dataset.map((r) => r.cropType))];
  const perClassTP: Record<string, number> = {};
  const perClassFP: Record<string, number> = {};
  const perClassFN: Record<string, number> = {};

  for (const crop of allCrops) {
    perClassTP[crop] = 0;
    perClassFP[crop] = 0;
    perClassFN[crop] = 0;
  }

  for (let i = 0; i < dataset.length; i++) {
    // Leave one out
    const testRow = dataset[i];
    const trainSet = dataset.filter((_, idx) => idx !== i);

    // Temporarily use trainSet for normalization
    const tmpMin = new Array(testRow.features.length).fill(Infinity);
    const tmpMax = new Array(testRow.features.length).fill(-Infinity);
    for (const row of trainSet) {
      for (let j = 0; j < row.features.length; j++) {
        if (row.features[j] < tmpMin[j]) tmpMin[j] = row.features[j];
        if (row.features[j] > tmpMax[j]) tmpMax[j] = row.features[j];
      }
    }

    const normTest = testRow.features.map((v, j) => {
      const range = tmpMax[j] - tmpMin[j];
      return range === 0 ? 0 : (v - tmpMin[j]) / range;
    });

    const dists: { distance: number; crop: string }[] = trainSet.map((row) => ({
      distance: euclideanDistance(
        row.features.map((v, j) => {
          const range = tmpMax[j] - tmpMin[j];
          return range === 0 ? 0 : (v - tmpMin[j]) / range;
        }),
        normTest
      ),
      crop: row.cropType,
    }));

    dists.sort((a, b) => a.distance - b.distance);
    const knn = dists.slice(0, K);

    // Simple majority vote for metrics
    const votes: Record<string, number> = {};
    for (const n of knn) {
      votes[n.crop] = (votes[n.crop] || 0) + 1;
    }
    let predicted = "";
    let maxVotes = 0;
    for (const [crop, count] of Object.entries(votes)) {
      if (count > maxVotes) {
        maxVotes = count;
        predicted = crop;
      }
    }

    const actual = testRow.cropType;
    if (predicted === actual) {
      correct++;
      perClassTP[actual]++;
    } else {
      perClassFP[predicted] = (perClassFP[predicted] || 0) + 1;
      perClassFN[actual] = (perClassFN[actual] || 0) + 1;
    }
  }

  const accuracy = correct / dataset.length;

  // Weighted precision, recall, F1
  let weightedPrecision = 0;
  let weightedRecall = 0;
  let weightedF1 = 0;
  const totalSamples = dataset.length;

  for (const crop of allCrops) {
    const classCount = dataset.filter((r) => r.cropType === crop).length;
    const tp = perClassTP[crop];
    const fp = perClassFP[crop];
    const fn = perClassFN[crop];

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    const weight = classCount / totalSamples;
    weightedPrecision += precision * weight;
    weightedRecall += recall * weight;
    weightedF1 += f1 * weight;
  }

  return {
    accuracy: Math.round(accuracy * 100) / 100,
    precision: Math.round(weightedPrecision * 100) / 100,
    recall: Math.round(weightedRecall * 100) / 100,
    f1Score: Math.round(weightedF1 * 100) / 100,
  };
}

// ── Public API ──────────────────────────────────────────────────────────

export function predict(input: PredictionInput): PredictionResult {
  console.log("ML: RAW INPUT:", JSON.stringify(input));

  // Validate required fields exist
  if (!input.soilType) throw new Error("Missing required field: soilType");
  if (!input.irrigationType) throw new Error("Missing required field: irrigationType");
  if (!input.season) throw new Error("Missing required field: season");
  if (input.farmArea === undefined || input.farmArea === null) throw new Error("Missing required field: farmArea");
  if (input.fertilizerUsed === undefined || input.fertilizerUsed === null) throw new Error("Missing required field: fertilizerUsed");
  if (input.pesticideUsed === undefined || input.pesticideUsed === null) throw new Error("Missing required field: pesticideUsed");
  if (input.waterUsage === undefined || input.waterUsage === null) throw new Error("Missing required field: waterUsage");

  // Validate and encode categorical inputs
  const soilEnc = SOIL_TYPE_MAP[input.soilType];
  if (soilEnc === undefined) {
    throw new Error(`Invalid soilType: "${input.soilType}". Valid: ${Object.keys(SOIL_TYPE_MAP).join(", ")}`);
  }

  const irrigationEnc = IRRIGATION_TYPE_MAP[input.irrigationType];
  if (irrigationEnc === undefined) {
    throw new Error(`Invalid irrigationType: "${input.irrigationType}". Valid: ${Object.keys(IRRIGATION_TYPE_MAP).join(", ")}`);
  }

  const seasonEnc = SEASON_MAP[input.season];
  if (seasonEnc === undefined) {
    throw new Error(`Invalid season: "${input.season}". Valid: ${Object.keys(SEASON_MAP).join(", ")}`);
  }

  // Validate numerics
  const farmArea = Number(input.farmArea);
  const fertilizer = Number(input.fertilizerUsed);
  const pesticide = Number(input.pesticideUsed);
  const waterUsage = Number(input.waterUsage);

  if (isNaN(farmArea)) throw new Error(`Invalid farmArea: ${input.farmArea}`);
  if (isNaN(fertilizer)) throw new Error(`Invalid fertilizerUsed: ${input.fertilizerUsed}`);
  if (isNaN(pesticide)) throw new Error(`Invalid pesticideUsed: ${input.pesticideUsed}`);
  if (isNaN(waterUsage)) throw new Error(`Invalid waterUsage: ${input.waterUsage}`);

  const features = [farmArea, fertilizer, pesticide, waterUsage, soilEnc, irrigationEnc, seasonEnc];
  console.log("ML: ENCODED FEATURES:", features);

  // Load dataset (cached after first call)
  const dataset = loadDataset();
  console.log("ML: DATASET SIZE:", dataset.length);

  // Run KNN prediction
  const { crop, confidence, probabilities } = predictKNN(dataset, features);

  console.log("ML: PREDICTION:", crop, "CONFIDENCE:", confidence.toFixed(4));
  console.log("ML: PROBABILITIES:", probabilities);

  const diseasePrediction = DISEASE_MAP[crop] || "None Detected";

  return {
    recommendedCrop: crop,
    diseasePrediction,
    confidenceScore: Math.round(confidence * 100) / 100,
    metrics: cachedMetrics || { accuracy: 0, precision: 0, recall: 0, f1Score: 0 },
  };
}

// Mock crop data
export const cropTypes = [
  'Wheat',
  'Rice',
  'Cotton',
  'Tomato',
  'Corn',
  'Soybean',
  'Potato',
  'Sugarcane',
  'Barley',
  'Millet'
]

// Mock location suggestions
export const locationSuggestions = [
  'Punjab, India',
  'Maharashtra, India',
  'Karnataka, India',
  'Tamil Nadu, India',
  'Gujarat, India',
  'Rajasthan, India',
  'Uttar Pradesh, India',
  'West Bengal, India',
  'Andhra Pradesh, India',
  'Madhya Pradesh, India'
]

// Mock disease data
export const diseases = {
  Wheat: [
    { name: 'Rust', severity: 'Medium', probability: 0.65 },
    { name: 'Powdery Mildew', severity: 'Low', probability: 0.25 },
    { name: 'Leaf Blight', severity: 'High', probability: 0.80 }
  ],
  Rice: [
    { name: 'Blast', severity: 'High', probability: 0.75 },
    { name: 'Sheath Blight', severity: 'Medium', probability: 0.55 },
    { name: 'Brown Spot', severity: 'Low', probability: 0.30 }
  ],
  Cotton: [
    { name: 'Boll Rot', severity: 'Medium', probability: 0.50 },
    { name: 'Leaf Curl Virus', severity: 'High', probability: 0.85 },
    { name: 'Alternaria Leaf Spot', severity: 'Low', probability: 0.35 }
  ],
  Tomato: [
    { name: 'Early Blight', severity: 'Medium', probability: 0.60 },
    { name: 'Late Blight', severity: 'High', probability: 0.70 },
    { name: 'Bacterial Spot', severity: 'Low', probability: 0.40 }
  ],
  Corn: [
    { name: 'Northern Corn Leaf Blight', severity: 'Medium', probability: 0.55 },
    { name: 'Common Rust', severity: 'Low', probability: 0.30 },
    { name: 'Gray Leaf Spot', severity: 'High', probability: 0.75 }
  ],
  Soybean: [
    { name: 'Soybean Rust', severity: 'High', probability: 0.80 },
    { name: 'Bacterial Blight', severity: 'Low', probability: 0.25 },
    { name: 'Frogeye Leaf Spot', severity: 'Medium', probability: 0.50 }
  ],
  Potato: [
    { name: 'Late Blight', severity: 'High', probability: 0.85 },
    { name: 'Early Blight', severity: 'Medium', probability: 0.60 },
    { name: 'Common Scab', severity: 'Low', probability: 0.35 }
  ],
  Sugarcane: [
    { name: 'Red Rot', severity: 'Medium', probability: 0.55 },
    { name: 'Smut', severity: 'Low', probability: 0.30 },
    { name: 'Rust', severity: 'High', probability: 0.70 }
  ],
  Barley: [
    { name: 'Net Blotch', severity: 'Medium', probability: 0.50 },
    { name: 'Powdery Mildew', severity: 'Low', probability: 0.35 },
    { name: 'Stripe Rust', severity: 'High', probability: 0.75 }
  ],
  Millet: [
    { name: 'Downy Mildew', severity: 'Medium', probability: 0.45 },
    { name: 'Rust', severity: 'Low', probability: 0.30 },
    { name: 'Blast', severity: 'High', probability: 0.65 }
  ]
}

// Generate mock analysis results
export const generateMockResults = (cropType, location, imageData = null) => {
  const cropDiseases = diseases[cropType] || []
  const primaryDisease = cropDiseases[0] || { name: 'Healthy Crop', severity: 'None', probability: 0.05 }
  
  // If image is provided, improve accuracy and adjust probabilities
  let adjustedDisease = { ...primaryDisease }
  let hasImage = imageData !== null
  
  if (hasImage) {
    // Image-based analysis provides more accurate detection
    // Simulate that image analysis can detect diseases more precisely
    // Increase probability slightly (as if image confirms the disease)
    adjustedDisease.probability = Math.min(0.95, primaryDisease.probability + 0.10)
    
    // Sometimes image might reveal a different primary disease (more accurate)
    // 30% chance of detecting a different disease when image is analyzed
    if (Math.random() > 0.7 && cropDiseases.length > 1) {
      const imageDetectedDisease = cropDiseases[Math.floor(Math.random() * cropDiseases.length)]
      adjustedDisease = { ...imageDetectedDisease }
      adjustedDisease.probability = Math.min(0.95, imageDetectedDisease.probability + 0.15)
    }
  }
  
  // Calculate health score (inverse of disease probability)
  const healthScore = Math.round((1 - adjustedDisease.probability) * 100)
  
  // Generate symptoms based on disease (more detailed if image provided)
  const symptoms = generateSymptoms(adjustedDisease.name, cropType, hasImage)
  
  // Generate recommendations (more specific if image provided)
  const recommendations = generateRecommendations(adjustedDisease.name, adjustedDisease.severity, cropType, hasImage)
  
  // Image-based visual analysis results
  const imageAnalysis = hasImage ? {
    leafColorAnalysis: 'Detected variations in chlorophyll content',
    lesionDetection: adjustedDisease.name !== 'Healthy Crop' ? 'Identified characteristic lesion patterns' : 'No lesions detected',
    growthStage: 'Analyzed crop growth stage from image',
    coverageAnalysis: 'Estimated crop coverage and density',
    accuracyBoost: 'Image analysis improved detection accuracy by ~15%'
  } : null
  
  return {
    cropType,
    location,
    disease: adjustedDisease.name,
    healthScore,
    severity: adjustedDisease.severity,
    probability: adjustedDisease.probability,
    symptoms,
    recommendations,
    detectedDiseases: cropDiseases.slice(0, 3),
    timestamp: new Date().toISOString(),
    imageData: imageData,
    hasImage: hasImage,
    imageAnalysis: imageAnalysis,
    accuracyNote: hasImage 
      ? 'Analysis enhanced with field image - results are more accurate'
      : 'For more accurate results, upload a field image next time'
  }
}

const generateSymptoms = (diseaseName, cropType, hasImage = false) => {
  const baseSymptoms = {
    'Rust': ['Yellow-orange pustules on leaves', 'Premature leaf drop', 'Reduced grain quality'],
    'Powdery Mildew': ['White powdery spots on leaves', 'Leaf curling', 'Stunted growth'],
    'Leaf Blight': ['Brown lesions on leaves', 'Leaf yellowing', 'Reduced photosynthesis'],
    'Blast': ['Diamond-shaped lesions', 'Node rot', 'Panicle sterility'],
    'Sheath Blight': ['Lesions on leaf sheaths', 'Plant lodging', 'Yield reduction'],
    'Brown Spot': ['Brown circular spots', 'Leaf necrosis', 'Grain discoloration'],
    'Boll Rot': ['Discolored bolls', 'Premature opening', 'Fiber quality loss'],
    'Leaf Curl Virus': ['Leaf curling', 'Stunted growth', 'Reduced boll formation'],
    'Early Blight': ['Concentric rings on leaves', 'Leaf defoliation', 'Fruit rot'],
    'Late Blight': ['Water-soaked lesions', 'Rapid plant death', 'Complete crop loss'],
    'Bacterial Spot': ['Small dark spots', 'Leaf drop', 'Fruit blemishes'],
    'Healthy Crop': ['No visible symptoms', 'Normal growth pattern', 'Optimal leaf color']
  }
  
  let symptoms = baseSymptoms[diseaseName] || ['Monitoring recommended', 'Regular field inspection', 'Maintain optimal conditions']
  
  // Add image-based specific symptoms if image was provided
  if (hasImage && diseaseName !== 'Healthy Crop') {
    symptoms = [
      ...symptoms,
      'Image analysis confirmed visual disease markers',
      'Pattern recognition matched known disease characteristics'
    ]
  }
  
  return symptoms
}

const generateRecommendations = (diseaseName, severity, cropType, hasImage = false) => {
  if (diseaseName === 'Healthy Crop') {
    const base = [
      'Continue current farming practices',
      'Monitor crop regularly for early signs',
      'Maintain optimal irrigation and nutrition',
      'Follow preventive measures'
    ]
    if (hasImage) {
      base.push('Image confirms healthy crop status - maintain current practices')
    }
    return base
  }
  
  const recommendations = []
  
  if (severity === 'High') {
    recommendations.push('Immediate treatment required')
    recommendations.push('Apply recommended fungicide/pesticide within 24-48 hours')
    recommendations.push('Isolate affected areas if possible')
    recommendations.push('Consult agricultural extension officer')
    if (hasImage) {
      recommendations.push('Image analysis confirms high severity - urgent action needed')
      recommendations.push('Targeted treatment based on visual disease markers')
    }
  } else if (severity === 'Medium') {
    recommendations.push('Treatment recommended within 3-5 days')
    recommendations.push('Apply preventive fungicide')
    recommendations.push('Monitor crop closely for spread')
    recommendations.push('Adjust irrigation to avoid excess moisture')
    if (hasImage) {
      recommendations.push('Early detection from image allows for timely intervention')
    }
  } else {
    recommendations.push('Preventive measures recommended')
    recommendations.push('Monitor for disease progression')
    recommendations.push('Maintain good field hygiene')
    recommendations.push('Consider organic treatment options')
    if (hasImage) {
      recommendations.push('Image shows early stage - easier to manage')
    }
  }
  
  recommendations.push('Follow integrated pest management practices')
  recommendations.push('Maintain proper crop spacing and ventilation')
  
  if (hasImage) {
    recommendations.push('Re-upload image after treatment to monitor progress')
  }
  
  return recommendations
}

// Dataset information
export const datasetInfo = {
  totalSamples: 125000,
  cropTypes: 10,
  diseaseClasses: 38,
  features: [
    { name: 'Soil Moisture', description: 'Water content in soil affecting root health', importance: 0.92 },
    { name: 'Temperature', description: 'Ambient temperature influencing crop growth', importance: 0.88 },
    { name: 'Humidity', description: 'Air moisture level affecting disease spread', importance: 0.85 },
    { name: 'Leaf Color', description: 'Chlorophyll content indicating plant health', importance: 0.90 },
    { name: 'Weather Data', description: 'Rainfall, wind speed, and sunlight hours', importance: 0.87 },
    { name: 'Soil pH', description: 'Acidity/alkalinity affecting nutrient uptake', importance: 0.79 },
    { name: 'Nitrogen Level', description: 'Soil nitrogen content for growth', importance: 0.82 },
    { name: 'Phosphorus Level', description: 'Essential for root and flower development', importance: 0.75 }
  ]
}


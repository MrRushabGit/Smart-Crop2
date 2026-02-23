// Download utility functions

/**
 * Download analysis results as JSON file
 */
export const downloadAnalysisResults = (results) => {
  const dataStr = JSON.stringify(results, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `agrinova-analysis-${results.cropType}-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download analysis results as CSV file
 */
export const downloadAnalysisResultsCSV = (results) => {
  const csvRows = []
  
  // Header
  csvRows.push(['Field', 'Value'].join(','))
  
  // Data rows
  csvRows.push(['Crop Type', results.cropType].join(','))
  csvRows.push(['Location', results.location].join(','))
  csvRows.push(['Detected Disease', results.disease].join(','))
  csvRows.push(['Health Score', `${results.healthScore}%`].join(','))
  csvRows.push(['Severity', results.severity].join(','))
  csvRows.push(['Detection Probability', `${Math.round(results.probability * 100)}%`].join(','))
  csvRows.push(['Analysis Date', new Date(results.timestamp).toLocaleString()].join(','))
  csvRows.push(['', ''].join(','))
  csvRows.push(['Symptoms', ''].join(','))
  results.symptoms.forEach(symptom => {
    csvRows.push(['', symptom].join(','))
  })
  csvRows.push(['', ''].join(','))
  csvRows.push(['Recommendations', ''].join(','))
  results.recommendations.forEach(rec => {
    csvRows.push(['', rec].join(','))
  })
  
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `agrinova-analysis-${results.cropType}-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download dataset information as JSON
 */
export const downloadDatasetInfo = (datasetInfo) => {
  const dataStr = JSON.stringify(datasetInfo, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `agrinova-dataset-info-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download dataset information as CSV
 */
export const downloadDatasetInfoCSV = (datasetInfo) => {
  const csvRows = []
  
  // Header
  csvRows.push(['Dataset Information', ''].join(','))
  csvRows.push(['', ''].join(','))
  
  // Overview
  csvRows.push(['Total Samples', datasetInfo.totalSamples.toLocaleString()].join(','))
  csvRows.push(['Crop Types', datasetInfo.cropTypes].join(','))
  csvRows.push(['Disease Classes', datasetInfo.diseaseClasses].join(','))
  csvRows.push(['', ''].join(','))
  
  // Features
  csvRows.push(['Feature Name', 'Importance', 'Description'].join(','))
  datasetInfo.features.forEach(feature => {
    csvRows.push([
      feature.name,
      `${Math.round(feature.importance * 100)}%`,
      feature.description
    ].join(','))
  })
  
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `agrinova-dataset-info-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


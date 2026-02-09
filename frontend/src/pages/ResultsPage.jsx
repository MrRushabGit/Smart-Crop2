import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Sprout, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  MapPin,
  Calendar,
  ArrowRight,
  Image as ImageIcon,
  Zap
} from 'lucide-react'

const ResultsPage = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)

  useEffect(() => {
    const storedResults = localStorage.getItem('analysisResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      navigate('/dashboard')
    }
  }, [navigate])

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'text-red-600 bg-red-50'
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'Low':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-green-600 bg-green-50'
    }
  }

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-green-50 via-white to-agri-brown-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crop Analysis Results
          </h1>
          <p className="text-xl text-gray-600">
            Detailed insights about your crop health and recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Crop Info Card */}
            <div className="glass rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                    <Sprout className="w-6 h-6 text-agri-green-600" />
                    <span>{results.cropType}</span>
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{results.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(results.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg font-semibold ${getSeverityColor(results.severity)}`}>
                  {results.severity} Risk
                </div>
              </div>

              {/* Health Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Crop Health Score</span>
                  <span className={`text-2xl font-bold ${getHealthColor(results.healthScore)}`}>
                    {results.healthScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${results.healthScore}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      results.healthScore >= 80 
                        ? 'bg-green-500' 
                        : results.healthScore >= 60 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Disease Detection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    {results.disease === 'Healthy Crop' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span>Detected Condition</span>
                  </h3>
                  {results.hasImage && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Image-Enhanced
                    </span>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xl font-semibold text-gray-900 mb-1">
                    {results.disease}
                  </p>
                  {results.disease !== 'Healthy Crop' && (
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">
                        Detection Probability: {Math.round(results.probability * 100)}%
                      </p>
                      {results.hasImage && (
                        <span className="text-xs text-green-600 font-medium">
                          (Higher accuracy with image)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Symptoms Observed</h3>
                <ul className="space-y-2">
                  {results.symptoms.map((symptom, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start space-x-2 text-gray-700"
                    >
                      <span className="text-agri-green-600 mt-1">•</span>
                      <span>{symptom}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Uploaded Image Display */}
            {results.hasImage && results.imageData && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <ImageIcon className="w-6 h-6 text-agri-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Field Image Analysis</h3>
                  <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>Enhanced Accuracy</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative rounded-lg overflow-hidden border-2 border-agri-green-200">
                    <img
                      src={results.imageData}
                      alt="Field image"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      Your Field Image
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-agri-green-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-agri-green-700 mb-2">
                        Image-Based Analysis Results
                      </p>
                      {results.imageAnalysis && (
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{results.imageAnalysis.leafColorAnalysis}</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{results.imageAnalysis.lesionDetection}</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{results.imageAnalysis.growthStage}</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{results.imageAnalysis.coverageAnalysis}</span>
                          </li>
                        </ul>
                      )}
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-700 mb-1">
                        Accuracy Improvement
                      </p>
                      <p className="text-xs text-blue-600">
                        {results.imageAnalysis?.accuracyBoost || 'Image analysis improved detection accuracy'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Accuracy Note */}
            {!results.hasImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass rounded-2xl shadow-lg p-6 border-2 border-yellow-200 bg-yellow-50"
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800 mb-1">
                      Improve Analysis Accuracy
                    </p>
                    <p className="text-sm text-yellow-700">
                      {results.accuracyNote || 'Upload a field image for more accurate disease detection and recommendations.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recommendations Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-agri-green-600" />
                <span>Recommended Actions</span>
              </h3>
              <ul className="space-y-4">
                {results.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-agri-green-50 rounded-lg hover:bg-agri-green-100 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-agri-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Sidebar - Detected Diseases */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">All Detected Conditions</h3>
              <div className="space-y-3">
                {results.detectedDiseases.map((disease, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-agri-green-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{disease.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(disease.severity)}`}>
                        {disease.severity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${disease.probability * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                        className="h-full bg-agri-green-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {Math.round(disease.probability * 100)}% probability
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <button
                onClick={() => navigate('/insights')}
                className="w-full bg-agri-green-600 text-white py-3 rounded-lg font-semibold hover:bg-agri-green-700 transition-colors mb-3"
              >
                View Dataset Insights
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-white text-agri-green-600 border-2 border-agri-green-600 py-3 rounded-lg font-semibold hover:bg-agri-green-50 transition-colors"
              >
                New Analysis
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Sprout, Search, Loader2 } from 'lucide-react'
import { cropTypes, locationSuggestions, generateMockResults } from '../data/mockData'

const Dashboard = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    location: '',
    cropType: ''
  })
  const [locationSuggestionsVisible, setLocationSuggestionsVisible] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(locationSuggestions)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleLocationChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, location: value })
    
    if (value) {
      const filtered = locationSuggestions.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setLocationSuggestionsVisible(true)
    } else {
      setLocationSuggestionsVisible(false)
    }
  }

  const selectLocation = (location) => {
    setFormData({ ...formData, location })
    setLocationSuggestionsVisible(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.location || !formData.cropType) {
      alert('Please fill in all required fields')
      return
    }

    setIsAnalyzing(true)

    // Simulate analysis delay
    setTimeout(() => {
      const results = generateMockResults(formData.cropType, formData.location)
      localStorage.setItem('analysisResults', JSON.stringify(results))
      setIsAnalyzing(false)
      navigate('/results')
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-green-50 via-white to-agri-brown-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crop Field Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Enter your field details to get AI-powered crop health analysis
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Location Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-agri-green-600" />
                <span>Location</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.location}
                  onChange={handleLocationChange}
                  onFocus={() => {
                    if (formData.location) {
                      setLocationSuggestionsVisible(true)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your location (e.g., Punjab, India)"
                  required
                />
                {locationSuggestionsVisible && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectLocation(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-agri-green-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Crop Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-agri-green-600" />
                <span>Crop Type</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green-500 focus:border-transparent transition-all bg-white"
                required
              >
                <option value="">Select a crop type</option>
                {cropTypes.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isAnalyzing}
              className="w-full bg-agri-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-agri-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Crop...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze Crop</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Analysis Animation Overlay */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass rounded-2xl p-12 max-w-md mx-4 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-agri-green-600 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Analyzing Your Crop
              </h3>
              <p className="text-gray-600">
                Processing field data...
              </p>
              <div className="mt-6 space-y-2">
                {['Scanning crop data...', 'Analyzing soil conditions...', 'Detecting diseases...'].map(
                  (step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.4 }}
                      className="text-sm text-gray-500"
                    >
                      {step}
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard


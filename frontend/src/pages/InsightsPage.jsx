import { motion } from 'framer-motion'
import { Database, BarChart3, TrendingUp, Info, Download } from 'lucide-react'
import { datasetInfo } from '../data/mockData'
import { downloadDatasetInfo, downloadDatasetInfoCSV } from '../utils/download'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const InsightsPage = () => {
  // Mock chart data
  const diseaseDistribution = [
    { name: 'Rust', value: 18, color: '#dc2626' },
    { name: 'Blight', value: 15, color: '#ea580c' },
    { name: 'Mildew', value: 12, color: '#f59e0b' },
    { name: 'Virus', value: 10, color: '#eab308' },
    { name: 'Healthy', value: 45, color: '#22c55e' }
  ]

  const featureImportance = datasetInfo.features
    .sort((a, b) => b.importance - a.importance)
    .map(f => ({
      name: f.name,
      importance: f.importance * 100
    }))

  const yieldImpact = [
    { disease: 'Rust', impact: -35 },
    { disease: 'Blight', impact: -42 },
    { disease: 'Mildew', impact: -18 },
    { disease: 'Virus', impact: -28 },
    { disease: 'Healthy', impact: 0 }
  ]

  const monthlyTrends = [
    { month: 'Jan', detections: 120, healthy: 380 },
    { month: 'Feb', detections: 145, healthy: 355 },
    { month: 'Mar', detections: 180, healthy: 320 },
    { month: 'Apr', detections: 210, healthy: 290 },
    { month: 'May', detections: 195, healthy: 305 },
    { month: 'Jun', detections: 165, healthy: 335 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-green-50 via-white to-agri-brown-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dataset & Feature Insights
          </h1>
          <p className="text-xl text-gray-600">
            Understanding the data powering AgriNova
          </p>
        </motion.div>

        {/* Dataset Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Database className="w-8 h-8 text-agri-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Dataset Overview</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => downloadDatasetInfo(datasetInfo)}
                className="flex items-center space-x-2 px-4 py-2 bg-agri-green-600 text-white rounded-lg hover:bg-agri-green-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download JSON</span>
              </button>
              <button
                onClick={() => downloadDatasetInfoCSV(datasetInfo)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-agri-green-600 border border-agri-green-600 rounded-lg hover:bg-agri-green-50 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download CSV</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-agri-green-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-agri-green-700 mb-2">
                {datasetInfo.totalSamples.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Crop Samples</div>
            </div>
            <div className="bg-agri-green-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-agri-green-700 mb-2">
                {datasetInfo.cropTypes}
              </div>
              <div className="text-gray-600">Crop Types</div>
            </div>
            <div className="bg-agri-green-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-agri-green-700 mb-2">
                {datasetInfo.diseaseClasses}
              </div>
              <div className="text-gray-600">Disease Classes</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Disease Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-agri-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Disease Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Feature Importance */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-agri-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Feature Importance</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="importance" fill="#3a9159" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-agri-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Monthly Detection Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="detections" 
                stroke="#dc2626" 
                name="Disease Detections"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="healthy" 
                stroke="#22c55e" 
                name="Healthy Crops"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Yield Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-agri-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Disease Impact on Yield</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yieldImpact}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="disease" />
              <YAxis label={{ value: 'Yield Impact (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="impact" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Features Used */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Info className="w-6 h-6 text-agri-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Features Used in Analysis</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datasetInfo.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-agri-green-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{feature.name}</span>
                  <span className="text-sm text-agri-green-600 font-medium">
                    {Math.round(feature.importance * 100)}% importance
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${feature.importance * 100}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                    className="h-full bg-agri-green-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default InsightsPage


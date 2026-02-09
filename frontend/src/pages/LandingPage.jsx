import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Sprout, 
  Search, 
  MapPin, 
  TrendingUp,
  Shield,
  BarChart3,
  ArrowRight
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Search,
      title: 'Crop Disease Detection',
      description: 'AI-powered identification of crop diseases from images and field data'
    },
    {
      icon: BarChart3,
      title: 'Crop Health Analysis',
      description: 'Comprehensive health scoring and monitoring for optimal yield'
    },
    {
      icon: MapPin,
      title: 'Location-Based Advice',
      description: 'Personalized recommendations based on your geographic location'
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven Insights',
      description: 'Actionable insights from 125,000+ crop samples and field data'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-green-50 via-white to-agri-brown-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-agri-green-100/30 to-transparent" />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-64 bg-agri-green-200/20"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-agri-green-100 mb-6"
            >
              <Sprout className="w-10 h-10 text-agri-green-600" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Smart Crop Advisory
              <br />
              <span className="text-agri-green-600">for Better Yield</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              AI-based crop guidance powered by machine learning. 
              Get instant disease detection, health analysis, and personalized 
              recommendations for your fields.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/auth"
                className="group relative px-8 py-4 bg-agri-green-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-agri-green-700 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-2"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/auth"
                className="px-8 py-4 bg-white text-agri-green-600 border-2 border-agri-green-600 rounded-lg font-semibold text-lg hover:bg-agri-green-50 transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to make informed decisions about your crops
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-lg bg-agri-green-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-agri-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-agri-brown-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 Smart Crop Advisory. Empowering farmers with AI.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage


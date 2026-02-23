import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Sprout, BarChart3, Home, FileText } from 'lucide-react'

const Navbar = ({ user, onLogout }) => {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/results', label: 'Results', icon: FileText },
    { path: '/insights', label: 'Insights', icon: BarChart3 },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <Sprout className="w-6 h-6 text-agri-green-600 group-hover:text-agri-green-700 transition-colors" />
            <span className="text-xl font-semibold text-gray-800">AgriNova</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-agri-green-100 text-agri-green-700'
                      : 'text-gray-600 hover:bg-agri-green-50 hover:text-agri-green-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user?.name || user?.email}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar


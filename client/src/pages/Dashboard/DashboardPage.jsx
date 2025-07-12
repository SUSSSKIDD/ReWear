import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  Plus, Package, Users, Heart,
  ArrowRight, Calendar, MapPin, Star, RefreshCw
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { usersAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Avatar from '../../components/common/Avatar'
import { motion } from 'framer-motion'

const DashboardPage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const location = useLocation()

  // Show welcome message if coming from add item page
  useEffect(() => {
    if (location.state?.fromAddItem) {
      toast.success('Item added successfully! Check your updated statistics below.', {
        duration: 4000,
        icon: '🎉'
      })
      
      // Force refresh of stats when coming from add item
      queryClient.invalidateQueries(['userStats'])
      queryClient.invalidateQueries(['userActivity'])
    }
  }, [location.state, queryClient])

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => usersAPI.getStats(),
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch when invalidated
    refetchInterval: 60000 // Refetch every minute
  })

  // Debug logging
  console.log('Dashboard - stats data:', stats)
  console.log('Dashboard - stats loading:', statsLoading)
  console.log('Dashboard - location state:', location.state)

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['userActivity'],
    queryFn: () => usersAPI.getActivity({ limit: 5 }),
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch when invalidated
    refetchInterval: 60000 // Refetch every minute
  })

  if (statsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Items',
      value: stats?.stats?.items?.total || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Available Items',
      value: stats?.stats?.items?.available || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Swaps',
      value: stats?.stats?.swaps?.total || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Points Balance',
      value: stats?.stats?.points || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  const quickActions = [
    {
      title: 'Add New Item',
      description: 'List a clothing item for swap',
      icon: Plus,
      href: '/add-item',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Browse Items',
      description: 'Find items to swap',
      icon: Package,
      href: '/items',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'My Swaps',
      description: 'View your swap history',
      icon: Users,
      href: '/swaps',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Dashboard - ReWear</title>
        <meta name="description" content="Your ReWear dashboard" />
      </Helmet>

      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20 relative">
        {/* Background images with low opacity */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30"></div>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="mb-10 relative"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-indigo-700 drop-shadow-sm">Welcome back, {user?.firstName} 👋</h1>
              <p className="text-gray-600 mt-2 text-sm">Here's what's happening with your ReWear account</p>
            </div>
            <button
              onClick={() => {
                queryClient.invalidateQueries(['userStats'])
                queryClient.invalidateQueries(['userActivity'])
              }}
              disabled={statsLoading || activityLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all border border-white/50 hover:bg-white/90"
            >
              <RefreshCw className={`w-4 h-4 ${statsLoading || activityLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium text-indigo-700">Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              className="rounded-xl bg-white/80 backdrop-blur-sm p-5 shadow-lg hover:shadow-xl transition-all border border-white/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h2>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} shadow-inner`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Quick Actions</h3>
                <p className="text-sm text-gray-500">Jump into action right away</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center bg-white p-4 rounded-lg hover:bg-indigo-50 transition-all border border-gray-100 hover:border-indigo-100 group"
                >
                  <div className={`p-2 rounded-lg ${action.bgColor} mr-4 shadow-sm group-hover:shadow-md transition`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 group-hover:text-indigo-700 transition">{action.title}</p>
                    <p className="text-sm text-gray-500 group-hover:text-indigo-500 transition">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 ml-2 transition" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Recent Activity</h3>
                <p className="text-sm text-gray-500">Your latest uploads and swaps</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </div>

            <div className="space-y-4">
              {activity?.activities?.length > 0 ? (
                activity.activities.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center p-4 rounded-lg bg-white border border-gray-200 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md"
                    whileHover={{ x: 5 }}
                  >
                    <div className="mr-4">
                      {item.type === "item" ? (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shadow-inner">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.type === "item" ? item.data.title : `Swap ${item.data.status}`}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      {item.type === "item" ? (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.data.isAvailable ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600"}`}>
                          {item.data.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      ) : (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.data.status === "completed" ? "bg-indigo-100 text-indigo-600"
                          : item.data.status === "pending" ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-200 text-gray-600"
                        }`}>
                          {item.data.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-8 bg-white/50 rounded-lg border border-dashed border-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Start by listing an item or making your first swap.
                  </p>
                </motion.div>
              )}
            </div>

            {activity?.activities?.length > 0 && (
              <div className="mt-6 text-right">
                <Link
                  to="/users/activity"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition inline-flex items-center"
                >
                  View all activity <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* User Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 border border-white/50"
        >
          <div className="relative">
            <Avatar user={user} size="2xl" />
            <div className="absolute -bottom-2 -right-2 bg-indigo-100 rounded-full p-1 shadow-md">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-gray-500">@{user?.username}</p>
            {user?.location && (
              <p className="text-sm text-gray-400 mt-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {user.location}
              </p>
            )}
            {user?.bio && (
              <p className="text-gray-600 mt-2 text-sm">{user.bio}</p>
            )}
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg shadow-inner">
            <div className="flex items-center text-yellow-500 text-sm justify-center">
              <Star className="w-5 h-5 mr-1" />
              <span className="font-bold">{user?.rating || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Rating</p>
            <div className="mt-3">
              <p className="text-lg font-bold text-gray-800 text-center">{user?.reviewsCount || 0}</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default DashboardPage
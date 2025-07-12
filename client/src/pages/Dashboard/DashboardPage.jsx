import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  Plus, 
  Package, 
  Users, 
  TrendingUp, 
  Heart,
  Clock,
  Star,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { usersAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Avatar from '../../components/common/Avatar'

const DashboardPage = () => {
  const { user } = useAuth()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => usersAPI.getStats(),
    enabled: !!user
  })

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['userActivity'],
    queryFn: () => usersAPI.getActivity({ limit: 5 }),
    enabled: !!user
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
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-secondary-600 mt-2">
            Here's what's happening with your ReWear account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
                <p className="card-description">Get started with these common tasks</p>
              </div>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="flex items-center p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg ${action.bgColor} mr-4`}>
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-sm text-secondary-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
                <p className="card-description">Your latest items and swaps</p>
              </div>
              <div className="space-y-4">
                {activity?.activities?.length > 0 ? (
                  activity.activities.map((item, index) => (
                    <div key={index} className="flex items-center p-4 rounded-lg border border-secondary-200">
                      <div className="flex-shrink-0 mr-4">
                        {item.type === 'item' ? (
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 truncate">
                          {item.type === 'item' ? item.data.title : `Swap ${item.data.status}`}
                        </p>
                        <div className="flex items-center text-sm text-secondary-500 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {item.type === 'item' && (
                          <span className={`badge ${item.data.isAvailable ? 'badge-primary' : 'badge-secondary'}`}>
                            {item.data.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        )}
                        {item.type === 'swap' && (
                          <span className={`badge ${
                            item.data.status === 'completed' ? 'badge-primary' :
                            item.data.status === 'pending' ? 'badge-accent' :
                            'badge-secondary'
                          }`}>
                            {item.data.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600">No recent activity</p>
                    <p className="text-sm text-secondary-500 mt-1">
                      Start by adding your first item or browsing the community
                    </p>
                  </div>
                )}
              </div>
              {activity?.activities?.length > 0 && (
                <div className="card-footer">
                  <Link
                    to="/users/activity"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    View all activity →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile Summary */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center space-x-6">
              <Avatar user={user} size="2xl" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-secondary-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-secondary-600">@{user?.username}</p>
                {user?.location && (
                  <div className="flex items-center text-sm text-secondary-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </div>
                )}
                {user?.bio && (
                  <p className="text-secondary-600 mt-2">{user.bio}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="flex items-center text-sm text-secondary-600">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {user?.rating || 0}
                  </div>
                  <p className="text-xs text-secondary-500">Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-secondary-900">
                    {user?.reviewsCount || 0}
                  </div>
                  <p className="text-xs text-secondary-500">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage 
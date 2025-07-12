import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { 
  Users, Package, TrendingUp, Shield, 
  Settings, BarChart3, AlertTriangle, CheckCircle
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import AdminItemsPage from './AdminItemsPage'
import AdminUsersPage from './AdminUsersPage'
import AdminReportsPage from './AdminReportsPage'

const AdminPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    )
  }

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => adminAPI.getDashboard(),
    enabled: !!user && user.role === 'admin'
  })

  const stats = dashboardData?.data?.stats || dashboardData?.stats

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'items', label: 'Items Management', icon: Package },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: TrendingUp }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard stats={stats} isLoading={isLoading} />
      case 'items':
        return <AdminItemsPage />
      case 'users':
        return <AdminUsersPage />
      case 'reports':
        return <AdminReportsPage />
      default:
        return <AdminDashboard stats={stats} isLoading={isLoading} />
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel - ReWear</title>
        <meta name="description" content="ReWear admin panel" />
      </Helmet>

      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20 relative">
        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-50"></div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-gray-600 mt-2">Manage ReWear platform and content</p>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700">Admin Access</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-red-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          {renderContent()}
        </div>
      </div>
    </>
  )
}

// Dashboard Component
const AdminDashboard = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Items',
      value: stats?.items?.total || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Items',
      value: stats?.items?.pending || 0,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Swaps',
      value: stats?.swaps?.total || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Items</h3>
          <div className="space-y-3">
            {stats?.recentActivity?.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    by {item.owner?.firstName} {item.owner?.lastName}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {item.isApproved ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : item.isRejected ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {stats?.recentActivity?.users?.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage 
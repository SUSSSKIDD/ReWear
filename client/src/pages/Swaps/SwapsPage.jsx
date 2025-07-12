import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { 
  Inbox, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  Package,
  Users,
  Heart
} from 'lucide-react'
import { swapsAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SwapCard from '../../components/swaps/SwapCard'

const SwapsPage = () => {
  const [activeTab, setActiveTab] = useState('received')

  const { data: receivedSwaps, isLoading: receivedLoading } = useQuery({
    queryKey: ['swaps', 'received'],
    queryFn: () => swapsAPI.getReceived(),
  })

  const { data: sentSwaps, isLoading: sentLoading } = useQuery({
    queryKey: ['swaps', 'sent'],
    queryFn: () => swapsAPI.getSent(),
  })

  const tabs = [
    { 
      id: 'received', 
      label: 'Received', 
      icon: Inbox, 
      count: receivedSwaps?.swaps?.filter(s => s.status === 'pending').length || 0 
    },
    { 
      id: 'sent', 
      label: 'Sent', 
      icon: Send, 
      count: sentSwaps?.swaps?.filter(s => s.status === 'pending').length || 0 
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4 text-secondary-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'accepted':
        return 'text-blue-600 bg-blue-100'
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      case 'cancelled':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-secondary-600 bg-secondary-100'
    }
  }

  if (receivedLoading || sentLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Swaps - ReWear</title>
        <meta name="description" content="Manage your swap requests and history" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            My Swaps
          </h1>
          <p className="text-secondary-600">
            Manage your swap requests and track your exchange history
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Swaps</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {(receivedSwaps?.swaps?.length || 0) + (sentSwaps?.swaps?.length || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Pending</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {(receivedSwaps?.swaps?.filter(s => s.status === 'pending').length || 0) + 
                   (sentSwaps?.swaps?.filter(s => s.status === 'pending').length || 0)}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Completed</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {(receivedSwaps?.swaps?.filter(s => s.status === 'completed').length || 0) + 
                   (sentSwaps?.swaps?.filter(s => s.status === 'completed').length || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Points Earned</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {(receivedSwaps?.swaps?.filter(s => s.status === 'completed')
                    .reduce((sum, swap) => sum + (swap.pointsEarned || 0), 0) || 0) + 
                   (sentSwaps?.swaps?.filter(s => s.status === 'completed')
                    .reduce((sum, swap) => sum + (swap.pointsEarned || 0), 0) || 0)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-secondary-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'received' && (
            <div>
              {receivedSwaps?.swaps?.length > 0 ? (
                <div className="space-y-4">
                  {receivedSwaps.swaps.map((swap) => (
                    <SwapCard 
                      key={swap._id} 
                      swap={swap} 
                      type="received"
                      statusIcon={getStatusIcon(swap.status)}
                      statusColor={getStatusColor(swap.status)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Inbox className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    No received swaps
                  </h3>
                  <p className="text-secondary-600">
                    You haven't received any swap requests yet
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div>
              {sentSwaps?.swaps?.length > 0 ? (
                <div className="space-y-4">
                  {sentSwaps.swaps.map((swap) => (
                    <SwapCard 
                      key={swap._id} 
                      swap={swap} 
                      type="sent"
                      statusIcon={getStatusIcon(swap.status)}
                      statusColor={getStatusColor(swap.status)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Send className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    No sent swaps
                  </h3>
                  <p className="text-secondary-600">
                    You haven't sent any swap requests yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SwapsPage 
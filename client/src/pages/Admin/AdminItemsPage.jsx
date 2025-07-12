import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Package, Eye, CheckCircle, XCircle, Trash2, 
  Search, Filter, Calendar, User, AlertTriangle
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { getImageUrl } from '../../utils/imageUtils'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminItemsPage = () => {
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const queryClient = useQueryClient()

  const { data: itemsData, isLoading } = useQuery({
    queryKey: ['adminItems', status, search, page],
    queryFn: () => adminAPI.getItems({ status, search, page, limit: 20 }),
    enabled: true
  })

  const items = itemsData?.data?.items || itemsData?.items || []
  const pagination = itemsData?.data?.pagination || itemsData?.pagination

  const approveMutation = useMutation({
    mutationFn: (itemId) => adminAPI.approveItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminItems'])
      queryClient.invalidateQueries(['adminDashboard'])
      toast.success('Item approved successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to approve item')
    }
  })

  const rejectMutation = useMutation({
    mutationFn: ({ itemId, reason }) => adminAPI.rejectItem(itemId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminItems'])
      queryClient.invalidateQueries(['adminDashboard'])
      setShowRejectModal(false)
      setRejectReason('')
      setSelectedItem(null)
      toast.success('Item rejected successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reject item')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId) => adminAPI.deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminItems'])
      queryClient.invalidateQueries(['adminDashboard'])
      toast.success('Item deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete item')
    }
  })

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    rejectMutation.mutate({ itemId: selectedItem._id, reason: rejectReason })
  }

  const getStatusBadge = (item) => {
    if (item.isRejected) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          Rejected
        </span>
      )
    }
    if (item.isApproved) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Approved
        </span>
      )
    }
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
        Pending
      </span>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Items Management</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none outline-none text-sm"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white rounded-lg px-3 py-2 shadow-sm border-none outline-none text-sm"
          >
            <option value="all">All Items</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="xl" />
        </div>
      ) : (
        <>
          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Item Image */}
                <div className="relative aspect-square">
                  <img
                    src={getImageUrl(item.images?.[0], item._id, 0)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-item.jpg'
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(item)}
                  </div>
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{item.owner?.firstName} {item.owner?.lastName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-indigo-600">{item.pointsValue} pts</span>
                    <span className="text-sm text-gray-500 capitalize">{item.category}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {!item.isApproved && !item.isRejected && (
                      <button
                        onClick={() => approveMutation.mutate(item._id)}
                        disabled={approveMutation.isLoading}
                        className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {approveMutation.isLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1 inline" />
                            Approve
                          </>
                        )}
                      </button>
                    )}
                    
                    {!item.isRejected && (
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowRejectModal(true)
                        }}
                        disabled={rejectMutation.isLoading}
                        className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4 mr-1 inline" />
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                          deleteMutation.mutate(item._id)
                        }
                      }}
                      disabled={deleteMutation.isLoading}
                      className="bg-gray-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-3 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reject Item</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting "{selectedItem?.title}"
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                  setSelectedItem(null)
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isLoading}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {rejectMutation.isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Reject Item'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminItemsPage 
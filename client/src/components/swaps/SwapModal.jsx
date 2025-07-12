import { useState } from 'react'
import { X, Package, Heart } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { swapsAPI } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const SwapModal = ({ item, onClose }) => {
  const [swapType, setSwapType] = useState('direct')
  const [selectedItems, setSelectedItems] = useState([])
  const [message, setMessage] = useState('')
  const queryClient = useQueryClient()

  const createSwapMutation = useMutation({
    mutationFn: (data) => swapsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['swaps'])
      onClose()
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const swapData = {
      requestedItem: item._id,
      swapType,
      message,
      ...(swapType === 'direct' && { offeredItems: selectedItems }),
      ...(swapType === 'points' && { pointsOffered: item.pointsValue })
    }

    createSwapMutation.mutate(swapData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            Request Swap
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Item Preview */}
          <div className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg">
            <img
              src={item.images[0]?.url}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-secondary-900">{item.title}</h3>
              <p className="text-sm text-secondary-600">{item.category} • {item.size}</p>
              <div className="flex items-center mt-1">
                <Heart className="w-4 h-4 text-primary-600 mr-1" />
                <span className="text-sm font-medium text-primary-600">
                  {item.pointsValue} points
                </span>
              </div>
            </div>
          </div>

          {/* Swap Type Selection */}
          <div>
            <h3 className="font-medium text-secondary-900 mb-3">Swap Type</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-secondary-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input
                  type="radio"
                  name="swapType"
                  value="direct"
                  checked={swapType === 'direct'}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-secondary-900">Direct Swap</div>
                  <div className="text-sm text-secondary-600">
                    Exchange with items from your wardrobe
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-secondary-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input
                  type="radio"
                  name="swapType"
                  value="points"
                  checked={swapType === 'points'}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-secondary-900">Points Swap</div>
                  <div className="text-sm text-secondary-600">
                    Use your points balance ({item.pointsValue} points)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Direct Swap Items Selection */}
          {swapType === 'direct' && (
            <div>
              <h3 className="font-medium text-secondary-900 mb-3">
                Select Items to Offer
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {/* Placeholder for user's items */}
                <div className="text-center py-8 text-secondary-600">
                  <Package className="w-8 h-8 mx-auto mb-2" />
                  <p>Your available items will appear here</p>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Message to Owner
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the owner why you'd like to swap for this item..."
              rows={4}
              className="textarea w-full"
            />
          </div>

          {/* Error Message */}
          {createSwapMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">
                {createSwapMutation.error.message || 'Failed to create swap request'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSwapMutation.isLoading}
              className="btn btn-primary flex-1"
            >
              {createSwapMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SwapModal 
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  Package, 
  Calendar,
  Eye,
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { itemsAPI, swapsAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { getImageUrl } from '../../utils/imageUtils'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Avatar from '../../components/common/Avatar'
import SwapModal from '../../components/swaps/SwapModal'

const ItemDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [swapActionType, setSwapActionType] = useState('swap')

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => itemsAPI.getById(id),
    enabled: !!id
  })

  // Reset currentImageIndex when item changes
  useEffect(() => {
    if (item?.images?.length) {
      setCurrentImageIndex(0)
    }
  }, [item?._id])

  // Ensure currentImageIndex is within bounds
  useEffect(() => {
    if (item?.images?.length && currentImageIndex >= item.images.length) {
      setCurrentImageIndex(0)
    }
  }, [item?.images?.length, currentImageIndex])

  const likeMutation = useMutation({
    mutationFn: () => itemsAPI.toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['item', id])
    }
  })

  const handleLike = () => {
    if (user) {
      likeMutation.mutate()
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const nextImage = () => {
    if (!item?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === item.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!item?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? item.images.length - 1 : prev - 1
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">Item not found</p>
      </div>
    )
  }

  const isOwner = user?._id === item.owner?._id

  return (
    <>
      <Helmet>
        <title>{item.title} - ReWear</title>
        <meta name="description" content={item.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-secondary-600 hover:text-secondary-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={getImageUrl(item.images?.[currentImageIndex], item._id, currentImageIndex)}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-item.jpg'
                }}
              />
              
              {/* Navigation Arrows */}
              {item.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {item.images?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {item.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {item.images?.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-primary-600' 
                        : 'border-secondary-200'
                    }`}
                  >
                    <img
                      src={getImageUrl(image, item._id, index)}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-secondary-900">
                  {item.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    disabled={likeMutation.isLoading}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    {likeMutation.isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Heart 
                        className={`w-5 h-5 ${item.isLiked ? 'fill-red-500 text-red-500' : 'text-secondary-400'}`} 
                      />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-secondary-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-secondary-600">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {item.views} views
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Price and Availability */}
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-primary-600">
                  {item.pointsValue.toLocaleString()} points
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </div>
              </div>
              <p className="text-sm text-secondary-600">
                Points value for this item
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-secondary-900 mb-2">Description</h3>
              <p className="text-secondary-700 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-secondary-900 mb-1">Category</h4>
                <p className="text-secondary-600">{item.category}</p>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900 mb-1">Size</h4>
                <p className="text-secondary-600">{item.size}</p>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900 mb-1">Condition</h4>
                <p className="text-secondary-600 capitalize">{item.condition}</p>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900 mb-1">Brand</h4>
                <p className="text-secondary-600">{item.brand || 'Unknown'}</p>
              </div>
            </div>

            {/* Location */}
            {item.location && (
              <div className="flex items-center text-secondary-600">
                <MapPin className="w-4 h-4 mr-2" />
                {item.location}
              </div>
            )}

            {/* Owner Info */}
            {item.owner && (
              <div className="border-t border-secondary-200 pt-6">
                <h3 className="font-semibold text-secondary-900 mb-4">Listed by</h3>
                <div className="bg-secondary-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar user={item.owner} size="lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-secondary-900">
                        {item.owner.firstName} {item.owner.lastName}
                      </h4>
                      <p className="text-secondary-600">@{item.owner.username}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-secondary-600">
                          {item.owner.rating || 0} ({item.owner.reviewsCount || 0} reviews)
                        </span>
                      </div>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-secondary-600">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          <span>{item.owner.itemsCount || 0} items listed</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Member since {new Date(item.owner.createdAt).getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isOwner && (
                    <div className="mt-4">
                      <button className="btn btn-outline w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-secondary-200 pt-6">
              {isOwner ? (
                <div className="space-y-3">
                  <button className="btn btn-primary w-full">
                    Edit Item
                  </button>
                  <button className="btn btn-outline w-full">
                    Mark as Unavailable
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {item.isAvailable ? (
                    <>
                      <button
                        onClick={() => {
                          setSwapActionType('swap')
                          setShowSwapModal(true)
                        }}
                        className="btn btn-primary w-full"
                      >
                        Request Swap
                      </button>
                      <button
                        onClick={() => {
                          setSwapActionType('redeem')
                          setShowSwapModal(true)
                        }}
                        className="btn btn-secondary w-full"
                      >
                        Redeem via Points ({item.pointsValue.toLocaleString()} pts)
                      </button>
                      <button className="btn btn-outline w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message Owner
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-lg font-medium text-secondary-900 mb-2">
                        Item Unavailable
                      </div>
                      <p className="text-secondary-600">
                        This item is currently not available for swaps or redemption.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <SwapModal
          item={item}
          actionType={swapActionType}
          onClose={() => setShowSwapModal(false)}
        />
      )}
    </>
  )
}

export default ItemDetailPage 
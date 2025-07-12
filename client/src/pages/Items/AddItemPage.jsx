import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Upload, 
  X, 
  Package,
  Camera,
  Plus
} from 'lucide-react'
import { itemsAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const AddItemPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset
  } = useForm()

  const createItemMutation = useMutation({
    mutationFn: (data) => itemsAPI.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['items'])
      queryClient.invalidateQueries(['userItems'])
      navigate(`/items/${data.item._id}`)
    },
    onError: (error) => {
      setError('root', {
        type: 'manual',
        message: error.message || 'Failed to create item'
      })
    }
  })

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    )

    if (validFiles.length + images.length > 5) {
      setError('images', {
        type: 'manual',
        message: 'Maximum 5 images allowed'
      })
      return
    }

    setImages(prev => [...prev, ...validFiles])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    if (images.length === 0) {
      setError('images', {
        type: 'manual',
        message: 'At least one image is required'
      })
      return
    }

    setUploading(true)
    try {
      // Upload images first
      const imageUrls = await Promise.all(
        images.map(image => itemsAPI.uploadImage(image))
      )

      // Create item with image URLs
      const itemData = {
        ...data,
        images: imageUrls.map(url => ({ url }))
      }

      createItemMutation.mutate(itemData)
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Failed to upload images'
      })
    } finally {
      setUploading(false)
    }
  }

  const categories = [
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' }
  ]

  const sizes = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'One Size', label: 'One Size' }
  ]

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ]

  return (
    <>
      <Helmet>
        <title>Add Item - ReWear</title>
        <meta name="description" content="Add a new item to your ReWear wardrobe" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Add New Item
          </h1>
          <p className="text-secondary-600">
            Share your clothing with the ReWear community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Images Section */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Item Photos</h3>
              <p className="card-description">
                Upload up to 5 photos of your item (max 5MB each)
              </p>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={images.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <Camera className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600 mb-2">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-sm text-secondary-500">
                    PNG, JPG up to 5MB each
                  </p>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="text-sm text-red-600">{errors.images.message}</p>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Basic Information</h3>
              <p className="card-description">
                Tell us about your item
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  className={`input ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="e.g., Vintage Denim Jacket"
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 3,
                      message: 'Title must be at least 3 characters'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Title must be less than 100 characters'
                    }
                  })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Category *
                </label>
                <select
                  className={`select ${errors.category ? 'border-red-500' : ''}`}
                  {...register('category', {
                    required: 'Category is required'
                  })}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Size *
                </label>
                <select
                  className={`select ${errors.size ? 'border-red-500' : ''}`}
                  {...register('size', {
                    required: 'Size is required'
                  })}
                >
                  <option value="">Select size</option>
                  {sizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
                {errors.size && (
                  <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  className={`input ${errors.brand ? 'border-red-500' : ''}`}
                  placeholder="e.g., Levi's, Nike"
                  {...register('brand', {
                    maxLength: {
                      value: 50,
                      message: 'Brand must be less than 50 characters'
                    }
                  })}
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Condition *
                </label>
                <select
                  className={`select ${errors.condition ? 'border-red-500' : ''}`}
                  {...register('condition', {
                    required: 'Condition is required'
                  })}
                >
                  <option value="">Select condition</option>
                  {conditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                )}
              </div>

              {/* Points Value */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Points Value *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  className={`input ${errors.pointsValue ? 'border-red-500' : ''}`}
                  placeholder="e.g., 100"
                  {...register('pointsValue', {
                    required: 'Points value is required',
                    min: {
                      value: 1,
                      message: 'Points value must be at least 1'
                    },
                    max: {
                      value: 10000,
                      message: 'Points value must be less than 10,000'
                    }
                  })}
                />
                {errors.pointsValue && (
                  <p className="mt-1 text-sm text-red-600">{errors.pointsValue.message}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className={`input ${errors.location ? 'border-red-500' : ''}`}
                  placeholder="e.g., New York, NY"
                  {...register('location', {
                    maxLength: {
                      value: 100,
                      message: 'Location must be less than 100 characters'
                    }
                  })}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Description</h3>
              <p className="card-description">
                Tell potential swappers about your item
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description *
              </label>
              <textarea
                rows={6}
                className={`textarea ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your item, including any details about style, material, fit, etc..."
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters'
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Description must be less than 1000 characters'
                  }
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createItemMutation.isLoading || uploading}
              className="btn btn-primary"
            >
              {(createItemMutation.isLoading || uploading) ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddItemPage 
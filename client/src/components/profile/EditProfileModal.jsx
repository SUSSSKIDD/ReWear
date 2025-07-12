import { useState } from 'react'
import { X, Camera } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersAPI } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import Avatar from '../common/Avatar'

const EditProfileModal = ({ user, onClose }) => {
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio || '',
      location: user.location || ''
    }
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data) => usersAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', user.username])
      queryClient.invalidateQueries(['user'])
      onClose()
    },
    onError: (error) => {
      setError('root', {
        type: 'manual',
        message: error.message || 'Failed to update profile'
      })
    }
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (file) => usersAPI.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', user.username])
      queryClient.invalidateQueries(['user'])
      setIsUploading(false)
    },
    onError: (error) => {
      setError('root', {
        type: 'manual',
        message: error.message || 'Failed to upload avatar'
      })
      setIsUploading(false)
    }
  })

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      uploadAvatarMutation.mutate(file)
    }
  }

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar user={user} size="2xl" />
              <label className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            {isUploading && (
              <div className="mt-2">
                <LoadingSpinner size="sm" />
                <p className="text-sm text-secondary-600">Uploading...</p>
              </div>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              className={`input ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="Enter your first name"
              {...register('firstName', {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'First name must be less than 50 characters'
                }
              })}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              className={`input ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Enter your last name"
              {...register('lastName', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Last name must be less than 50 characters'
                }
              })}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Username
            </label>
            <input
              type="text"
              className={`input ${errors.username ? 'border-red-500' : ''}`}
              placeholder="Choose a username"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                },
                maxLength: {
                  value: 30,
                  message: 'Username must be less than 30 characters'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores'
                }
              })}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
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
              placeholder="Enter your location"
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

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              className={`textarea ${errors.bio ? 'border-red-500' : ''}`}
              placeholder="Tell us about yourself..."
              {...register('bio', {
                maxLength: {
                  value: 500,
                  message: 'Bio must be less than 500 characters'
                }
              })}
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.root.message}</p>
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
              disabled={updateProfileMutation.isLoading}
              className="btn btn-primary flex-1"
            >
              {updateProfileMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal 
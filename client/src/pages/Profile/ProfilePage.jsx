import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { 
  Edit, 
  MapPin, 
  Calendar, 
  Star, 
  Package, 
  Users,
  Heart,
  Settings,
  Camera
} from 'lucide-react'
import { usersAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Avatar from '../../components/common/Avatar'
import ItemCard from '../../components/items/ItemCard'
import EditProfileModal from '../../components/profile/EditProfileModal'

const ProfilePage = () => {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('items')
  const [showEditModal, setShowEditModal] = useState(false)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => usersAPI.getByUsername(username),
    enabled: !!username
  })

  const { data: userItems } = useQuery({
    queryKey: ['userItems', username],
    queryFn: () => usersAPI.getItems(username),
    enabled: !!username
  })

  const { data: userActivity } = useQuery({
    queryKey: ['userActivity', username],
    queryFn: () => usersAPI.getActivity({ username, limit: 10 }),
    enabled: !!username
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">User not found</p>
      </div>
    )
  }

  const isOwnProfile = currentUser?.username === username

  const tabs = [
    { id: 'items', label: 'Items', icon: Package, count: userItems?.items?.length || 0 },
    { id: 'activity', label: 'Activity', icon: Users, count: userActivity?.activities?.length || 0 }
  ]

  return (
    <>
      <Helmet>
        <title>{profile.firstName} {profile.lastName} (@{profile.username}) - ReWear</title>
        <meta name="description" content={`View ${profile.firstName}'s profile on ReWear`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar user={profile} size="2xl" />
              {isOwnProfile && (
                <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-secondary-600">@{profile.username}</p>
                  
                  {profile.location && (
                    <div className="flex items-center text-secondary-600 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {profile.rating || 0} ({profile.reviewsCount || 0} reviews)
                    </div>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="btn btn-outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                    <button className="btn btn-outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="text-secondary-700 mt-4 leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-secondary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-900">
                {userItems?.items?.length || 0}
              </div>
              <p className="text-sm text-secondary-600">Items</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-900">
                {profile.points || 0}
              </div>
              <p className="text-sm text-secondary-600">Points</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-900">
                {profile.swapsCount || 0}
              </div>
              <p className="text-sm text-secondary-600">Swaps</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-900">
                {profile.followersCount || 0}
              </div>
              <p className="text-sm text-secondary-600">Followers</p>
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
                  <span className="ml-2 bg-secondary-100 text-secondary-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'items' && (
            <div>
              {userItems?.items?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userItems.items.map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    No items yet
                  </h3>
                  <p className="text-secondary-600">
                    {isOwnProfile 
                      ? "Start by adding your first item to your wardrobe"
                      : "This user hasn't added any items yet"
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              {userActivity?.activities?.length > 0 ? (
                <div className="space-y-4">
                  {userActivity.activities.map((activity, index) => (
                    <div key={index} className="card">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {activity.type === 'item' ? (
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Users className="w-6 h-6 text-purple-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-900">
                            {activity.type === 'item' 
                              ? `Added "${activity.data.title}"`
                              : `Completed swap for "${activity.data.itemTitle}"`
                            }
                          </p>
                          <p className="text-sm text-secondary-600">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    No activity yet
                  </h3>
                  <p className="text-secondary-600">
                    {isOwnProfile 
                      ? "Your activity will appear here"
                      : "This user hasn't had any activity yet"
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={profile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  )
}

export default ProfilePage 
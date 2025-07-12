import { User } from 'lucide-react'

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  if (user?.avatar) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden`}>
        <img
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full bg-secondary-200 flex items-center justify-center`}>
      {user ? (
        <span className="text-secondary-700 font-medium text-sm">
          {getInitials(user.firstName, user.lastName)}
        </span>
      ) : (
        <User className="w-1/2 h-1/2 text-secondary-500" />
      )}
    </div>
  )
}

export default Avatar 
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { 
  Search, 
  Filter, 
  Grid, 
  List,
  SlidersHorizontal,
  X,
  Package
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { itemsAPI } from '../../services/api'
import ItemCard from '../../components/items/ItemCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import FilterSidebar from '../../components/items/FilterSidebar'

const ItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    condition: searchParams.get('condition') || '',
    minPoints: searchParams.get('minPoints') || '',
    maxPoints: searchParams.get('maxPoints') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['items', filters],
    queryFn: () => itemsAPI.getAll(filters),
    keepPreviousData: true
  })

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      size: '',
      condition: '',
      minPoints: '',
      maxPoints: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'createdAt' && value !== 'desc')

  return (
    <>
      <Helmet>
        <title>Browse Items - ReWear</title>
        <meta name="description" content="Browse and discover clothing items for swap on ReWear" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Browse Items
          </h1>
          <p className="text-secondary-600">
            Discover clothing items from our community
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="input pl-10 w-full"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-secondary-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-secondary-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-secondary-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center flex-wrap gap-2 mt-4 pt-4 border-t border-secondary-200">
              <span className="text-sm text-secondary-600">Active filters:</span>
              {filters.category && (
                <span className="badge badge-primary">
                  {filters.category}
                  <button
                    onClick={() => handleFilterChange({ category: '' })}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.size && (
                <span className="badge badge-primary">
                  {filters.size}
                  <button
                    onClick={() => handleFilterChange({ size: '' })}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.condition && (
                <span className="badge badge-primary">
                  {filters.condition}
                  <button
                    onClick={() => handleFilterChange({ condition: '' })}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.minPoints || filters.maxPoints) && (
                <span className="badge badge-primary">
                  {filters.minPoints && filters.maxPoints 
                    ? `${filters.minPoints}-${filters.maxPoints} points`
                    : filters.minPoints 
                    ? `${filters.minPoints}+ points`
                    : `${filters.maxPoints} points max`
                  }
                  <button
                    onClick={() => handleFilterChange({ minPoints: '', maxPoints: '' })}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          {/* Items Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="xl" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-secondary-600">Error loading items</p>
              </div>
            ) : data?.items?.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  No items found
                </h3>
                <p className="text-secondary-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-secondary-600">
                    {data?.pagination?.totalItems || 0} items found
                  </p>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-')
                      handleFilterChange({ sortBy, sortOrder })
                    }}
                    className="select"
                  >
                    <option value="createdAt-desc">Newest first</option>
                    <option value="createdAt-asc">Oldest first</option>
                    <option value="pointsValue-asc">Price: Low to High</option>
                    <option value="pointsValue-desc">Price: High to Low</option>
                    <option value="views-desc">Most Popular</option>
                  </select>
                </div>

                {/* Items Grid */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {data?.items?.map((item) => (
                    <ItemCard key={item._id} item={item} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {data?.pagination && data.pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFilterChange({ page: data.pagination.currentPage - 1 })}
                        disabled={!data.pagination.hasPrev}
                        className="btn btn-outline btn-sm"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handleFilterChange({ page })}
                          className={`btn btn-sm ${
                            page === data.pagination.currentPage 
                              ? 'btn-primary' 
                              : 'btn-outline'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handleFilterChange({ page: data.pagination.currentPage + 1 })}
                        disabled={!data.pagination.hasNext}
                        className="btn btn-outline btn-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ItemsPage 
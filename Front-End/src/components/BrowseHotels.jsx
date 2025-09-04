import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HotelCard from './Hotelcard.jsx';
import SearchBar from './SearchBar.jsx';
import { hotelService } from '../services/hotelService.js';

const BrowseHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        total: 1,
        totalHotels: 0
    });
    
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('rating');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentFilters, setCurrentFilters] = useState({});
    
    const location = useLocation();
    const navigate = useNavigate();

    // Sort options
    const sortOptions = [
        { value: 'rating', label: 'Rating' },
        { value: 'name', label: 'Name' },
        { value: 'price', label: 'Price' },
        { value: 'location', label: 'Location' }
    ];

    // Load initial hotels based on location state
    useEffect(() => {
        const loadInitialHotels = async () => {
            try {
                setLoading(true);
                setError(null);

                let response;
                const locationState = location.state;

                if (locationState?.fromSearch && locationState?.hotels) {
                    // Display search results from Home component
                    setHotels(locationState.hotels);
                    setPagination({
                        current: 1,
                        total: 1,
                        totalHotels: locationState.hotels.length
                    });
                    setCurrentFilters(locationState.searchParams || {});
                    return; // Exit early since we have the results
                } else if (locationState?.category) {
                    // Filter by category
                    response = await hotelService.searchHotels({
                        query: '',
                        location: '',
                        category: locationState.category,
                        page: 1,
                        limit: 20,
                        sortBy,
                        sortOrder
                    });
                } else if (locationState?.location) {
                    // Filter by location
                    response = await hotelService.getHotelsByLocation(locationState.location, {
                        page: 1,
                        limit: 20,
                        sortBy,
                        sortOrder
                    });
                } else {
                    // Load all hotels
                    response = await hotelService.getAllHotels({
                        page: 1,
                        limit: 20,
                        sortBy,
                        sortOrder
                    });
                }

                setHotels(response.hotels || []);
                setPagination(response.pagination || {
                    current: 1,
                    total: 1,
                    totalHotels: 0
                });
            } catch (err) {
                console.error('Error loading hotels:', err);
                setError(err.message || 'Failed to load hotels');
            } finally {
                setLoading(false);
            }
        };

        loadInitialHotels();
    }, [location.state, sortBy, sortOrder]);

    // Handle search from search bar
    const handleSearch = (params) => {
        setCurrentFilters(params);
        setPagination(prev => ({ ...prev, current: 1 }));
        performSearch(params, 1);
    };

    // Handle advanced search
    const handleAdvancedSearch = (params) => {
        setCurrentFilters(params);
        setPagination(prev => ({ ...prev, current: 1 }));
        performSearch(params, 1);
    };

    // Perform search with current filters
    const performSearch = async (filters, page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const hasComplexFilters = filters.amenities?.length > 0 || 
                                   filters.roomType || 
                                   filters.guests ||
                                   filters.priceRange ||
                                   filters.rating;

            const searchMethod = hasComplexFilters ? 'advancedSearch' : 'searchHotels';
            
            const response = await hotelService[searchMethod]({
                ...filters,
                page,
                limit: 20,
                sortBy,
                sortOrder
            });

            setHotels(response.hotels || []);
            setPagination(response.pagination || {
                current: page,
                total: 1,
                totalHotels: 0
            });
        } catch (err) {
            console.error('Search error:', err);
            setError(err.message || 'Failed to search hotels');
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, current: newPage }));
        if (Object.keys(currentFilters).length > 0) {
            performSearch(currentFilters, newPage);
        } else {
            loadHotels(newPage);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Load hotels for pagination
    const loadHotels = async (page = 1) => {
        try {
            setLoading(true);
            const response = await hotelService.getAllHotels({
                page,
                limit: 20,
                sortBy,
                sortOrder
            });
            setHotels(response.hotels || []);
            setPagination(response.pagination || {
                current: page,
                total: 1,
                totalHotels: 0
            });
        } catch (err) {
            console.error('Error loading hotels:', err);
            setError(err.message || 'Failed to load hotels');
        } finally {
            setLoading(false);
        }
    };

    // Handle sort change
    const handleSortChange = (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        if (Object.keys(currentFilters).length > 0) {
            performSearch(currentFilters, 1);
        } else {
            loadHotels(1);
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setCurrentFilters({});
        setPagination(prev => ({ ...prev, current: 1 }));
        loadHotels(1);
    };

    // Render hotel cards
    const renderHotelCards = () => {
        if (hotels.length === 0) {
            return (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        {loading ? 'Loading hotels...' : 'No hotels found matching your criteria'}
                    </div>
                    {!loading && Object.keys(currentFilters).length > 0 && (
                        <button
                            onClick={clearAllFilters}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className={`grid gap-6 ${
                viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
            }`}>
                {hotels.map((hotel) => (
                    <HotelCard
                        key={hotel._id}
                        id={hotel._id}
                        image={hotel.images?.[0]}
                        name={hotel.name}
                        location={hotel.location}
                        description={hotel.description}
                        pricerange={hotel.price_range}
                        rating={hotel.rating}
                        hotel={hotel}
                    />
                ))}
            </div>
        );
    };

    // Render pagination
    const renderPagination = () => {
        if (pagination.total <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, pagination.current - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pagination.total, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center space-x-2 mt-8">
                {pagination.current > 1 && (
                    <button
                        onClick={() => handlePageChange(pagination.current - 1)}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg border ${
                            page === pagination.current
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {pagination.current < pagination.total && (
                    <button
                        onClick={() => handlePageChange(pagination.current + 1)}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        Next
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                ← Back to Home
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {location.state?.fromSearch 
                                    ? 'Search Results' 
                                    : location.state?.category 
                                        ? `${location.state.category}` 
                                        : 'Browse All Hotels'
                                }
                                {pagination.totalHotels > 0 && (
                                    <span className="text-gray-500 text-lg font-normal ml-2">
                                        ({pagination.totalHotels} hotels)
                                    </span>
                                )}
                            </h1>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg ${
                                    viewMode === 'grid' 
                                        ? 'bg-blue-100 text-blue-600' 
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg ${
                                    viewMode === 'list' 
                                        ? 'bg-blue-100 text-blue-600' 
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Search Bar */}
                <SearchBar
                    onSearch={handleSearch}
                    onAdvancedSearch={handleAdvancedSearch}
                    className="mb-6"
                />

                {/* Results Header */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        {/* Results Info */}
                        <div className="flex items-center space-x-4">
                            {location.state?.fromSearch && location.state?.searchParams && (
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Search for: </span>
                                    {location.state.searchParams.query && (
                                        <span className="text-blue-600">"{location.state.searchParams.query}"</span>
                                    )}
                                    {location.state.searchParams.location && (
                                        <span className="text-gray-500">
                                            {location.state.searchParams.query ? ' in ' : ''}
                                            {location.state.searchParams.location}
                                        </span>
                                    )}
                                </div>
                            )}
                            <span className="text-gray-600">
                                Showing {hotels.length} of {pagination.totalHotels} hotels
                            </span>
                            {Object.keys(currentFilters).length > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value, sortOrder)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => handleSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading hotels...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="text-red-800">
                            <p className="font-medium">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && (
                    <>
                        {renderHotelCards()}
                        {renderPagination()}
                    </>
                )}
            </div>
        </div>
    );
};

export default BrowseHotels;






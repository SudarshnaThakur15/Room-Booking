import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';

const SearchBar = ({ onSearch, onAdvancedSearch, className = '' }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filters, setFilters] = useState({
        priceRange: '',
        rating: '',
        amenities: [],
        roomType: '',
        guests: '',
        sortBy: '',
        sortOrder: 'asc',
        availability: '',
        distance: '',
        features: []
    });
    
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Popular locations for suggestions
    const popularLocations = [
        'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL',
        'Las Vegas, NV', 'San Francisco, CA', 'Boston, MA', 'Seattle, WA',
        'Denver, CO', 'Austin, TX', 'Nashville, TN', 'Orlando, FL'
    ];

    // Price range options
    const priceRanges = ['$', '$$', '$$$', '$$$$'];

    // Rating options
    const ratingOptions = ['4.5+', '4.0+', '3.5+', '3.0+'];

    // Amenity options
    const amenityOptions = [
        'WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar',
        'Room Service', 'Free Breakfast', 'Parking', 'Airport Shuttle',
        'Business Center', 'Concierge', 'Laundry', 'Pet Friendly',
        'Beach Access', 'Mountain View', 'City View', 'Balcony',
        'Kitchenette', 'Mini Bar', 'Safe', 'TV', 'AC', 'Heating'
    ];

    // Room type options
    const roomTypeOptions = [
        'Standard', 'Deluxe', 'Suite', 'Presidential', 'Family'
    ];

    // Guest options
    const guestOptions = ['1', '2', '3', '4', '5+'];

    // Sort options
    const sortOptions = [
        { value: 'rating', label: 'Rating' },
        { value: 'price', label: 'Price' },
        { value: 'name', label: 'Name' },
        { value: 'distance', label: 'Distance' }
    ];

    // Availability options
    const availabilityOptions = [
        { value: 'available', label: 'Available Now' },
        { value: 'weekend', label: 'Weekend Available' },
        { value: 'flexible', label: 'Flexible Dates' }
    ];

    // Distance options
    const distanceOptions = [
        { value: '1', label: 'Within 1 mile' },
        { value: '5', label: 'Within 5 miles' },
        { value: '10', label: 'Within 10 miles' },
        { value: '25', label: 'Within 25 miles' }
    ];

    // Feature options
    const featureOptions = [
        'Free Cancellation', 'Best Price Guarantee', 'Loyalty Program',
        'Mobile Check-in', 'Digital Key', 'Contactless Service',
        'Eco-Friendly', 'Accessible', 'Family Friendly'
    ];

    // Handle search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        if (value.length > 2) {
            // Show suggestions based on input
            const filtered = popularLocations.filter(loc => 
                loc.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle location input changes
    const handleLocationChange = (e) => {
        const value = e.target.value;
        setLocation(value);
        
        if (value.length > 2) {
            const filtered = popularLocations.filter(loc => 
                loc.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion, type) => {
        if (type === 'search') {
            setSearchQuery(suggestion);
        } else {
            setLocation(suggestion);
        }
        setShowSuggestions(false);
    };

    // Handle basic search
    const handleBasicSearch = () => {
        const searchParams = {};
        
        if (searchQuery.trim()) {
            searchParams.query = searchQuery.trim();
        }
        
        if (location.trim()) {
            searchParams.location = location.trim();
        }
        
        if (Object.keys(searchParams).length > 0) {
            onSearch(searchParams);
        }
    };

    // Handle advanced search
    const handleAdvancedSearch = () => {
        const searchParams = {
            query: searchQuery.trim(),
            location: location.trim(),
            advancedFilters: { ...filters }
        };
        
        // Remove empty values from advancedFilters
        Object.keys(searchParams.advancedFilters).forEach(key => {
            if (!searchParams.advancedFilters[key] || 
                (Array.isArray(searchParams.advancedFilters[key]) && searchParams.advancedFilters[key].length === 0)) {
                delete searchParams.advancedFilters[key];
            }
        });
        
        // Remove advancedFilters if it's empty
        if (Object.keys(searchParams.advancedFilters).length === 0) {
            delete searchParams.advancedFilters;
        }
        
        if (searchParams.query || searchParams.location || searchParams.advancedFilters) {
            onAdvancedSearch(searchParams);
        }
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        if (key === 'amenities' || key === 'features') {
            setFilters(prev => ({
                ...prev,
                [key]: prev[key].includes(value)
                    ? prev[key].filter(a => a !== value)
                    : [...prev[key], value]
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [key]: value
            }));
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            priceRange: '',
            rating: '',
            amenities: [],
            roomType: '',
            guests: '',
            sortBy: '',
            sortOrder: 'asc',
            availability: '',
            distance: '',
            features: []
        });
    };

    // Handle enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (showAdvanced) {
                handleAdvancedSearch();
            } else {
                handleBasicSearch();
            }
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`search-container ${className}`} ref={searchRef}>
            {/* Main Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search hotels by name, description..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900"
                            />
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion, 'search')}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Location Input */}
                    <div className="flex-1 relative">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Location (city, area, landmarks)..."
                                value={location}
                                onChange={handleLocationChange}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900"
                            />
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion, 'location')}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleBasicSearch}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                    >
                        Search
                    </button>

                    {/* Advanced Filters Toggle - Hidden */}
                    {/* <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`px-4 py-3 rounded-lg border transition-colors duration-200 flex items-center gap-2 ${
                            showAdvanced 
                                ? 'bg-blue-100 border-blue-300 text-blue-700' 
                                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Filter className="w-5 h-5" />
                        Filters
                    </button> */}
                </div>
            </div>

            {/* Advanced Filters - Hidden */}
            {false && showAdvanced && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <X className="w-4 h-4" />
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price Range
                            </label>
                            <select
                                value={filters.priceRange}
                                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Any Price</option>
                                {priceRanges.map((range, index) => (
                                    <option key={index} value={range}>
                                        {range} - {range === '$' ? 'Budget' : range === '$$' ? 'Moderate' : range === '$$$' ? 'Expensive' : 'Luxury'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimum Rating
                            </label>
                            <select
                                value={filters.rating}
                                onChange={(e) => handleFilterChange('rating', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Any Rating</option>
                                {ratingOptions.map((rating, index) => (
                                    <option key={index} value={rating}>
                                        {rating} Stars
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Room Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Room Type
                            </label>
                            <select
                                value={filters.roomType}
                                onChange={(e) => handleFilterChange('roomType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Any Type</option>
                                {roomTypeOptions.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Guests */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Guests
                            </label>
                            <select
                                value={filters.guests}
                                onChange={(e) => handleFilterChange('guests', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Any Number</option>
                                {guestOptions.map((guests, index) => (
                                    <option key={index} value={guests}>
                                        {guests} {guests === '1' ? 'Guest' : 'Guests'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Amenities */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amenities
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                {amenityOptions.map((amenity, index) => (
                                    <label key={index} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.amenities.includes(amenity)}
                                            onChange={() => handleFilterChange('amenities', amenity)}
                                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Default</option>
                                {sortOptions.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort Order
                            </label>
                            <select
                                value={filters.sortOrder}
                                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>

                        {/* Availability */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Availability
                            </label>
                            <select
                                value={filters.availability}
                                onChange={(e) => handleFilterChange('availability', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Any Time</option>
                                {availabilityOptions.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Distance */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Distance from Center
                            </label>
                            <select
                                value={filters.distance}
                                onChange={(e) => handleFilterChange('distance', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Any Distance</option>
                                {distanceOptions.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Features */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Features
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {featureOptions.map((feature, index) => (
                                    <label key={index} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.features.includes(feature)}
                                            onChange={() => handleFilterChange('features', feature)}
                                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{feature}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Advanced Search Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleAdvancedSearch}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                        >
                            Advanced Search
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;





import React, { useMemo, useEffect, useState, useCallback } from 'react';
import HotelCard from './Hotelcard.jsx';
import SearchBar from './SearchBar.jsx';
import { hotelService } from '../services/hotelService.js';
import { useNavigate } from 'react-router-dom';

const Home = React.memo(() => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Fetch featured hotels on component mount
  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await hotelService.getFeaturedHotels(10);
        
        if (response && response.hotels) {
          setHotels(response.hotels);
        } else if (Array.isArray(response)) {
          setHotels(response);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch featured hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

  // Real-time search with debouncing - Disabled to prevent interference with manual search
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (searchQuery.trim() || searchLocation.trim()) {
  //       handleSearch({ query: searchQuery, location: searchLocation });
  //     } else {
  //       setFilteredHotels([]);
  //       setIsFiltering(false);
  //       setShowSearchResults(false);
  //     }
  //   }, 300);

  //   return () => clearTimeout(timeoutId);
  // }, [searchQuery, searchLocation]);

  const handleSearch = useCallback(async (searchParams) => {
    try {
      console.log('Search triggered with params:', searchParams);
      setError(null);
      
      const searchQuery = searchParams.query || '';
      const searchLocation = searchParams.location || '';
      
      // Update local search state
      setSearchQuery(searchQuery);
      setSearchLocation(searchLocation);
      
      if (searchQuery.trim() || searchLocation.trim()) {
        console.log('Searching for:', { query: searchQuery, location: searchLocation });
        const response = await hotelService.searchHotels({
          query: searchQuery,
          location: searchLocation,
          page: 1,
          limit: 20
        });
        
        console.log('Search response:', response);
        
        // Navigate to BrowseHotels page with search results
        navigate('/browse', { 
          state: { 
            searchParams: searchParams,
            hotels: response.hotels || [],
            fromSearch: true
          } 
        });
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed');
    }
  }, [navigate]);

  const handleAdvancedSearch = useCallback(async (searchParams) => {
    try {
      setError(null);
      
      const searchQuery = searchParams.query || '';
      const searchLocation = searchParams.location || '';
      
      // Update local search state
      setSearchQuery(searchQuery);
      setSearchLocation(searchLocation);
      
      const response = await hotelService.searchHotels(searchParams);
      
      // Navigate to BrowseHotels page with search results
      navigate('/browse', { 
        state: { 
          searchParams: searchParams,
          hotels: response.hotels || [],
          fromSearch: true
        } 
      });
    } catch (err) {
      setError(err.message || 'Advanced search failed');
    }
  }, [navigate]);


  const goToBrowse = useCallback(() => {
    navigate('/browse');
  }, [navigate]);

  const goToCategory = useCallback((category) => {
    navigate('/browse', { state: { category } });
  }, [navigate]);

  const goToLocation = useCallback((location) => {
    navigate('/browse', { state: { location } });
  }, [navigate]);

  // Memoize the hotel cards to prevent unnecessary re-renders
  const hotelCards = useMemo(() => {
    // Only show featured hotels on homepage, search results go to BrowseHotels
    if (hotels.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hotels available.</p>
        </div>
      );
    }
    
    return hotels.map((hotel, index) => {
      return (
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
      );
    });
  }, [hotels]);

  // Memoize the category data to prevent recreation
  const categories = useMemo(() => [
    { name: 'Luxury Hotels', icon: '🏰', color: 'from-purple-500 to-pink-500' },
    { name: 'Business Hotels', icon: '💼', color: 'from-blue-500 to-cyan-500' },
    { name: 'Resort Hotels', icon: '🏖️', color: 'from-orange-500 to-red-500' },
    { name: 'Boutique Hotels', icon: '✨', color: 'from-green-500 to-teal-500' }
  ], []);

  // Memoize the destinations data with real Indian locations and hotel counts
  const destinations = useMemo(() => [
    { 
      name: 'Mumbai, India', 
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', 
      count: '1 hotel',
      location: 'Mumbai, India'
    },
    { 
      name: 'New Delhi, India', 
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop', 
      count: '1 hotel',
      location: 'New Delhi, India'
    },
    { 
      name: 'Bangalore, India', 
      image: 'https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?w=400&h=300&fit=crop', 
      count: '2 hotels',
      location: 'Bangalore, India'
    }
  ], []);

  // Memoize the retry handler
  const handleRetry = useCallback(() => {
    const fetchFeaturedHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await hotelService.getFeaturedHotels(10);
        
        if (response && response.hotels) {
          setHotels(response.hotels);
        } else if (Array.isArray(response)) {
          setHotels(response);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch featured hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover amazing hotels and book your next adventure
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              onAdvancedSearch={handleAdvancedSearch}
              className="mb-8"
            />
          </div>


          {/* Clear Search Button */}
          {(searchQuery || searchLocation) && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchLocation('');
                }}
                className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition-colors duration-200"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Browse by Category
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Find hotels that match your preferences
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${category.color} text-white rounded-lg p-6 text-center cursor-pointer hover:scale-105 transition-transform duration-200`}
                onClick={() => goToCategory(category.name)}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Hotels Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Featured Hotels
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Handpicked hotels for an exceptional experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotelCards}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={goToBrowse}
              className="bg-white text-slate-800 border-2 border-slate-800 px-8 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors duration-200 font-semibold"
            >
              View All Hotels
            </button>
          </div>
        </div>

        {/* Popular Destinations Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Popular Indian Destinations
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Discover amazing hotels across India's most beautiful cities
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
                onClick={() => goToLocation(destination.location)}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white w-full">
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <p className="text-sm opacity-90">{destination.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
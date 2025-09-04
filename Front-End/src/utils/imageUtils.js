// Image utility functions to prevent infinite loading

// Default image URLs - using data URIs to ensure they always exist
export const DEFAULT_IMAGES = {
    hotel: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZtaWxseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhvdGVsIEltYWdlPC90ZXh0Pgo8L3N2Zz4K',
    room: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZtaWxseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJvb20gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=',
    user: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZtaWxseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlVzZXIgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='
};

// Safe image loader with fallback
export const safeImageLoader = (imageUrl, fallbackType = 'hotel') => {
    console.log('safeImageLoader called with:', { imageUrl, fallbackType });
    
    if (!imageUrl || imageUrl === '' || imageUrl === 'undefined' || imageUrl === 'null') {
        console.log('Image URL is invalid, using fallback:', fallbackType);
        return DEFAULT_IMAGES[fallbackType];
    }
    
    // Check if it's a valid URL
    try {
        new URL(imageUrl);
        console.log('Valid URL found:', imageUrl);
        return imageUrl;
    } catch {
        console.log('Invalid URL, using fallback:', fallbackType);
        return DEFAULT_IMAGES[fallbackType];
    }
};

// Image error handler to prevent infinite loops
export const handleImageError = (event, fallbackType = 'hotel') => {
    console.log('Image error handler called for:', fallbackType);
    const img = event.target;
    
    // Prevent infinite loop by checking if we're already using fallback
    if (img.src !== DEFAULT_IMAGES[fallbackType]) {
        console.log('Setting fallback image for:', fallbackType);
        img.src = DEFAULT_IMAGES[fallbackType];
        img.onerror = null; // Prevent infinite loop
    } else {
        console.log('Already using fallback image, preventing further errors');
    }
};

// Check if image array has valid images
export const hasValidImages = (images) => {
    console.log('hasValidImages called with:', images);
    
    const isValid = images && 
           Array.isArray(images) && 
           images.length > 0 && 
           images.some(img => img && img.trim() !== '' && img !== 'undefined' && img !== 'null');
    
    console.log('hasValidImages result:', isValid);
    return isValid;
};

// Get first valid image from array
export const getFirstValidImage = (images, fallbackType = 'hotel') => {
    console.log('getFirstValidImage called with:', { images, fallbackType });
    
    if (!hasValidImages(images)) {
        console.log('No valid images found, using fallback:', fallbackType);
        return DEFAULT_IMAGES[fallbackType];
    }
    
    const firstImage = images.find(img => img && img.trim() !== '' && img !== 'undefined' && img !== 'null');
    console.log('First valid image found:', firstImage);
    
    return safeImageLoader(firstImage, fallbackType);
};

// Create a memoized image loader to prevent unnecessary re-renders
export const createImageLoader = (fallbackType = 'hotel') => {
    const cache = new Map();
    
    return (imageUrl) => {
        if (cache.has(imageUrl)) {
            return cache.get(imageUrl);
        }
        
        const result = safeImageLoader(imageUrl, fallbackType);
        cache.set(imageUrl, result);
        return result;
    };
}; 
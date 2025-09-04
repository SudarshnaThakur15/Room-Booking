import React, { useState, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_IMAGES } from '../../utils/imageUtils.js';

const SafeImage = ({ 
    src, 
    alt, 
    fallbackType = 'hotel', 
    className = '', 
    onLoad, 
    onError,
    ...props 
}) => {
    const validateAndCleanSrc = (source) => {
        if (!source || source === '' || source === 'undefined' || source === 'null') {
            return null;
        }
        
        try {
            new URL(source);
            return source;
        } catch {
            return null;
        }
    };
    
    const finalImageSrcRef = useRef(null);
    const hasSetFallbackRef = useRef(false);
    
    if (finalImageSrcRef.current === null) {
        const validSrc = validateAndCleanSrc(src);
        if (!validSrc) {
            finalImageSrcRef.current = DEFAULT_IMAGES[fallbackType];
            hasSetFallbackRef.current = true;
        } else {
            finalImageSrcRef.current = validSrc;
        }
    }
    
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = useCallback((e) => {
        setIsLoading(false);
        setHasError(false);
        if (onLoad) onLoad(e);
    }, [onLoad]);

    const handleError = useCallback((e) => {
        if (!hasSetFallbackRef.current) {
            finalImageSrcRef.current = DEFAULT_IMAGES[fallbackType];
            hasSetFallbackRef.current = true;
            setIsLoading(false);
            setHasError(true);
        }
        
        if (onError) onError(e);
    }, [fallbackType, onError]);

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Loading...</div>
                </div>
            )}
            
            <img
                {...props}
                src={finalImageSrcRef.current}
                alt={alt}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={handleLoad}
                onError={handleError}
                style={{ 
                    transition: 'opacity 0.3s ease-in-out',
                    ...props.style 
                }}
            />
            
            {hasError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-500 text-xs text-center">
                        Image not available
                    </div>
                </div>
            )}
        </div>
    );
};

SafeImage.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string.isRequired,
    fallbackType: PropTypes.oneOf(['hotel', 'room', 'user']),
    className: PropTypes.string,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
};

export default SafeImage; 
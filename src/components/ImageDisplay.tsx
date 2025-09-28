import React, { useState } from 'react';
import Image from 'next/image';
import { ImageData } from '@/types';

interface ImageDisplayProps {
  images?: ImageData[];
  variant?: 'card' | 'detail' | 'hero';
  className?: string;
  showFirst?: boolean;
}

interface SingleImageDisplayProps {
  image: ImageData;
  variant: 'card' | 'detail' | 'hero';
  className?: string;
  priority?: boolean;
}

function SingleImageDisplay({ 
  image, 
  variant, 
  className = '', 
  priority = false 
}: SingleImageDisplayProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <div className="text-center">
          <svg 
            className="mx-auto h-8 w-8 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-xs">图片加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="text-gray-400">
            <svg 
              className="h-8 w-8 animate-spin" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </div>
        </div>
      )}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        style={{ objectFit: variant === 'hero' ? 'contain' : 'cover' }}
        priority={priority}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className="transition-opacity duration-300"
        sizes={
          variant === 'card' 
            ? '(max-width: 768px) 100vw, 50vw' 
            : variant === 'hero'
            ? '(max-width: 1024px) 100vw, 50vw'
            : '100vw'
        }
      />
    </div>
  );
}

export function ImageDisplay({ 
  images, 
  variant = 'card', 
  className = '',
  showFirst = true 
}: ImageDisplayProps) {
  if (!images || images.length === 0) {
    return null;
  }

  if ((variant === 'card' || variant === 'hero') && showFirst) {
    // 只显示第一张图片（用于卡片或主图片）
    return (
      <SingleImageDisplay
        image={images[0]}
        variant={variant}
        className={className}
        priority={true}
      />
    );
  }

  if (variant === 'detail') {
    // 详情页显示所有图片
    return (
      <div className={`space-y-4 ${className}`}>
        {images.map((image, index) => (
          <div key={index} className="relative">
            <SingleImageDisplay
              image={image}
              variant={variant}
              className="w-full h-96 rounded-lg"
              priority={index === 0}
            />
            {image.alt && (
              <p className="mt-2 text-sm text-gray-600 text-center">{image.alt}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default ImageDisplay;
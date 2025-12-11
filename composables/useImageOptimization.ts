/**
 * Image Optimization Composable
 * Handles image optimization for Firebase Storage URLs and local images
 * Includes client-side compression and resizing before upload
 */

interface ImageOptions {
  width?: number
  height?: number
  quality?: number // 0-100, default 100 (no quality loss)
  format?: 'webp' | 'jpeg' | 'png' | 'auto'
}

interface OptimizedImageResult {
  src: string
  srcset?: string
  sizes?: string
  width?: number
  height?: number
}

interface CompressOptions {
  maxWidth: number
  maxHeight: number
  quality: number // 0-1
  format: 'image/jpeg' | 'image/webp' | 'image/png'
}

interface ProfileImageResult {
  full: Blob       // 256x256 for profile page
  thumbnail: Blob  // 64x64 for cards, comments, etc.
}

export const useImageOptimization = () => {
  /**
   * Generate optimized image URL
   * For Firebase Storage - URLs are returned as-is (Firebase handles caching)
   * For other sources - could integrate with image CDN
   */
  const getOptimizedUrl = (src: string, options: ImageOptions = {}): string => {
    if (!src) return '/images/placeholder.svg'

    // Firebase Storage URLs - return as-is
    // Firebase already handles CDN caching and delivery
    if (src.includes('firebasestorage.googleapis.com')) {
      return src
    }

    // Local images - return as-is
    if (src.startsWith('/') || src.startsWith('./')) {
      return src
    }

    // External URLs - return as-is
    return src
  }

  /**
   * Generate srcset for responsive images
   * Returns different sized URLs for responsive loading
   */
  const generateSrcset = (
    src: string,
    widths: number[] = [320, 640, 960, 1280, 1920]
  ): string | undefined => {
    // For now, Firebase Storage doesn't support on-the-fly resizing
    // Would need Firebase Extensions (Image Resizer) or external service
    // Return undefined to use original image
    return undefined
  }

  /**
   * Generate sizes attribute for responsive images
   */
  const generateSizes = (
    breakpoints: { maxWidth?: number; width: string }[] = [
      { maxWidth: 640, width: '100vw' },
      { maxWidth: 1024, width: '50vw' },
      { width: '33vw' }
    ]
  ): string => {
    return breakpoints
      .map((bp) => {
        if (bp.maxWidth) {
          return `(max-width: ${bp.maxWidth}px) ${bp.width}`
        }
        return bp.width
      })
      .join(', ')
  }

  /**
   * Get optimized image data for component usage
   */
  const getOptimizedImage = (
    src: string,
    options: ImageOptions = {}
  ): OptimizedImageResult => {
    return {
      src: getOptimizedUrl(src, options),
      srcset: generateSrcset(src),
      sizes: generateSizes(),
      width: options.width,
      height: options.height
    }
  }

  /**
   * Preload critical images (LCP optimization)
   * Call this for above-the-fold images
   */
  const preloadImage = (src: string, as: 'image' = 'image') => {
    if (import.meta.client && src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = as
      link.href = getOptimizedUrl(src)
      document.head.appendChild(link)
    }
  }

  /**
   * Check if image URL is valid
   */
  const isValidImageUrl = (src: string): boolean => {
    if (!src) return false

    // Check for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']
    const hasExtension = imageExtensions.some((ext) =>
      src.toLowerCase().includes(ext)
    )

    // Check for Firebase Storage URLs (they may not have extensions)
    const isFirebase = src.includes('firebasestorage.googleapis.com')

    // Check for data URLs
    const isDataUrl = src.startsWith('data:image/')

    return hasExtension || isFirebase || isDataUrl
  }

  /**
   * Get placeholder image based on type
   */
  const getPlaceholder = (
    type: 'hotel' | 'province' | 'blog' | 'user' | 'default' = 'default'
  ): string => {
    const placeholders: Record<string, string> = {
      hotel: '/images/placeholder-hotel.svg',
      province: '/images/placeholder-province.svg',
      blog: '/images/placeholder-blog.svg',
      user: '/images/placeholder-user.svg',
      default: '/images/placeholder.svg'
    }
    return placeholders[type] || placeholders.default
  }

  /**
   * Create blur data URL for placeholder (progressive loading)
   * Returns a tiny blurred version for instant display
   */
  const createBlurPlaceholder = (color: string = '#e5e7eb'): string => {
    // Create a simple SVG placeholder with background color
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="${color}" width="100" height="100"/></svg>`
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  /**
   * Get aspect ratio for consistent image sizing
   */
  const getAspectRatio = (
    type: 'hotel' | 'province' | 'blog' | 'square' | 'wide' = 'hotel'
  ): string => {
    const ratios: Record<string, string> = {
      hotel: '4/3',
      province: '3/4',
      blog: '16/9',
      square: '1/1',
      wide: '21/9'
    }
    return ratios[type] || '4/3'
  }

  /**
   * Compress and resize image before upload
   * Uses Canvas API for client-side processing
   */
  const compressImage = (
    file: File,
    options: Partial<CompressOptions> = {}
  ): Promise<Blob> => {
    const {
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 0.85,
      format = 'image/jpeg'
    } = options

    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      img.onload = () => {
        let { width, height } = img

        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        canvas.width = width
        canvas.height = height

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Draw image with smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          format,
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))

      // Load image from file
      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Create square crop (center crop) for profile images
   */
  const createSquareCrop = (
    file: File,
    size: number,
    quality: number = 0.9
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      img.onload = () => {
        const { width, height } = img

        // Calculate crop area (center square)
        const minDim = Math.min(width, height)
        const sx = (width - minDim) / 2
        const sy = (height - minDim) / 2

        canvas.width = size
        canvas.height = size

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Draw with high quality
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw cropped and scaled image
        ctx.drawImage(
          img,
          sx, sy, minDim, minDim,  // Source (crop area)
          0, 0, size, size          // Destination
        )

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to create square crop'))
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))

      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Create profile images in multiple sizes
   * Returns both full size (256px) and thumbnail (64px)
   */
  const createProfileImages = async (file: File): Promise<ProfileImageResult> => {
    const [full, thumbnail] = await Promise.all([
      createSquareCrop(file, 256, 0.9),    // Full: 256x256, 90% quality
      createSquareCrop(file, 64, 0.85)     // Thumbnail: 64x64, 85% quality
    ])

    return { full, thumbnail }
  }

  /**
   * Get file size in human readable format
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return {
    getOptimizedUrl,
    generateSrcset,
    generateSizes,
    getOptimizedImage,
    preloadImage,
    isValidImageUrl,
    getPlaceholder,
    createBlurPlaceholder,
    getAspectRatio,
    // New upload optimization functions
    compressImage,
    createSquareCrop,
    createProfileImages,
    formatFileSize
  }
}

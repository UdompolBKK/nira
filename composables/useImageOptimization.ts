/**
 * Image Optimization Composable
 * Handles image optimization for Firebase Storage URLs and local images
 * WITHOUT losing quality - focuses on proper sizing and lazy loading
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

  return {
    getOptimizedUrl,
    generateSrcset,
    generateSizes,
    getOptimizedImage,
    preloadImage,
    isValidImageUrl,
    getPlaceholder,
    createBlurPlaceholder,
    getAspectRatio
  }
}

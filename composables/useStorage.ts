/**
 * Composable for handling Firebase Storage URLs
 */

export const useStorage = () => {
  const config = useRuntimeConfig()
  const STORAGE_BUCKET = config.public.firebaseStorageBucket

  /**
   * แปลง path เป็น Firebase Storage public URL
   *
   * @param path - path ของรูปภาพ เช่น "/nakornnayok/thiwtara/thiwtara1.png" หรือ "/images/provinces/rayong.jpg"
   * @returns Firebase Storage public URL
   */
  const getStorageUrl = (path: string | null | undefined): string => {
    if (!path) return ''

    // ถ้าเป็น URL เต็มรูปแบบแล้ว ให้ return ไปเลย
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }

    // ลบ leading slash ออก
    let cleanPath = path.startsWith('/') ? path.slice(1) : path

    // ลบ "images/" prefix ออก เพราะใน Storage ไม่มี folder นี้
    // เช่น "images/provinces/rayong.jpg" -> "provinces/rayong.jpg"
    if (cleanPath.startsWith('images/')) {
      cleanPath = cleanPath.slice(7) // ลบ "images/" (7 ตัวอักษร)
    }

    // ทุก path ถูก migrate ไปอยู่ใน media/ folder แล้ว
    // Format: https://storage.googleapis.com/{bucket}/media/{path}
    return `https://storage.googleapis.com/${STORAGE_BUCKET}/media/${cleanPath}`
  }

  /**
   * แปลง array ของ paths เป็น Storage URLs
   */
  const getStorageUrls = (paths: (string | null | undefined)[]): string[] => {
    return paths.map(path => getStorageUrl(path)).filter(Boolean)
  }

  /**
   * แปลง hotel object ให้มี Storage URLs
   */
  const transformHotelImages = (hotel: any) => {
    if (!hotel) return null

    return {
      ...hotel,
      mainImage: hotel.mainImage ? getStorageUrl(hotel.mainImage) : null,
      image: hotel.image ? getStorageUrl(hotel.image) : null,
      images: hotel.images ? hotel.images.map((img: string) => getStorageUrl(img)) : [],
      gallery: hotel.gallery ? hotel.gallery.map((item: any) => ({
        ...item,
        image: item.image ? getStorageUrl(item.image) : null
      })) : []
    }
  }

  /**
   * แปลง province object ให้มี Storage URLs
   */
  const transformProvinceImages = (province: any) => {
    if (!province) return null

    return {
      ...province,
      image: province.image ? getStorageUrl(province.image) : null,
      attractions: province.attractions ? province.attractions.map((item: any) => ({
        ...item,
        image: item.image ? getStorageUrl(item.image) : null
      })) : []
    }
  }

  /**
   * แปลง blog object ให้มี Storage URLs
   */
  const transformBlogImages = (blog: any) => {
    if (!blog) return null

    return {
      ...blog,
      featuredImage: blog.featuredImage ? getStorageUrl(blog.featuredImage) : null
    }
  }

  return {
    getStorageUrl,
    getStorageUrls,
    transformHotelImages,
    transformProvinceImages,
    transformBlogImages
  }
}

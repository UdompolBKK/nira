import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export const useFileUpload = () => {
  const { storage } = useFirebase()
  const uploading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  /**
   * Upload single file to Firebase Storage
   * @param file - File to upload
   * @param path - Storage path (e.g., 'hotels/image.jpg')
   * @returns Download URL or null if failed
   */
  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    try {
      uploading.value = true
      error.value = null
      progress.value = 0

      // สร้าง storage reference
      const fileRef = storageRef(storage, path)

      // อัปโหลดไฟล์
      const snapshot = await uploadBytes(fileRef, file)
      progress.value = 100

      // ดึง download URL
      const downloadURL = await getDownloadURL(snapshot.ref)

      return downloadURL
    } catch (err: any) {
      console.error('Upload error:', err)
      error.value = err.message || 'ไม่สามารถอัปโหลดไฟล์ได้'
      return null
    } finally {
      uploading.value = false
    }
  }

  /**
   * Upload multiple files
   * @param files - Array of files to upload
   * @param basePath - Base storage path (e.g., 'hotels/gallery')
   * @returns Array of download URLs
   */
  const uploadMultipleFiles = async (
    files: File[],
    basePath: string
  ): Promise<string[]> => {
    try {
      uploading.value = true
      error.value = null

      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${Date.now()}_${index}_${file.name}`
        const path = `${basePath}/${fileName}`
        return await uploadFile(file, path)
      })

      const results = await Promise.all(uploadPromises)

      // กรองเฉพาะ URL ที่อัปโหลดสำเร็จ
      return results.filter((url): url is string => url !== null)
    } catch (err: any) {
      console.error('Multiple upload error:', err)
      error.value = err.message || 'ไม่สามารถอัปโหลดไฟล์ได้'
      return []
    } finally {
      uploading.value = false
    }
  }

  /**
   * Upload image with auto-generated filename
   * @param file - Image file to upload
   * @param folder - Folder name (e.g., 'hotels', 'blogs')
   * @param id - Document ID (optional)
   * @returns Download URL or null if failed
   */
  const uploadImage = async (
    file: File,
    folder: string,
    id?: string
  ): Promise<string | null> => {
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = id
      ? `${id}_${timestamp}.${extension}`
      : `${timestamp}.${extension}`

    const path = `${folder}/${fileName}`
    return await uploadFile(file, path)
  }

  /**
   * Upload gallery images
   * @param files - Array of image files
   * @param folder - Folder name (e.g., 'hotels', 'blogs')
   * @param id - Document ID
   * @returns Array of download URLs
   */
  const uploadGallery = async (
    files: File[],
    folder: string,
    id: string
  ): Promise<string[]> => {
    const basePath = `${folder}/${id}/gallery`
    return await uploadMultipleFiles(files, basePath)
  }

  /**
   * Delete file from storage
   * @param url - Firebase Storage URL
   * @returns True if deleted successfully
   */
  const deleteFile = async (url: string): Promise<boolean> => {
    try {
      // แปลง URL เป็น storage reference
      const fileRef = storageRef(storage, url)
      await deleteObject(fileRef)
      return true
    } catch (err: any) {
      console.error('Delete error:', err)
      error.value = err.message || 'ไม่สามารถลบไฟล์ได้'
      return false
    }
  }

  /**
   * Validate image file
   * @param file - File to validate
   * @param maxSizeMB - Maximum file size in MB (default: 5)
   * @returns True if valid
   */
  const validateImage = (file: File, maxSizeMB: number = 5): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!validTypes.includes(file.type)) {
      error.value = 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP)'
      return false
    }

    const maxSize = maxSizeMB * 1024 * 1024 // Convert to bytes
    if (file.size > maxSize) {
      error.value = `ไฟล์มีขนาดใหญ่เกิน ${maxSizeMB} MB`
      return false
    }

    error.value = null
    return true
  }

  /**
   * Preview image file as Data URL
   * @param file - Image file
   * @returns Promise<string> Data URL
   */
  const previewImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadMultipleFiles,
    uploadImage,
    uploadGallery,
    deleteFile,
    validateImage,
    previewImage
  }
}

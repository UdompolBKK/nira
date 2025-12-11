import { adminAuth, adminStorage } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify authentication
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'กรุณาเข้าสู่ระบบ'
      })
    }

    const token = authHeader.split('Bearer ')[1]
    await adminAuth().verifyIdToken(token)

    const query = getQuery(event)
    const folder = (query.folder as string) || ''

    const storage = adminStorage()
    const bucket = storage.bucket()

    // List all files in the folder
    const prefix = folder ? `media/${folder}/` : 'media/'

    console.log('Listing files with prefix:', prefix, 'bucket:', bucket.name)

    let files: any[] = []
    let folderPrefixes: string[] = []

    try {
      // Get files
      const [fileList] = await bucket.getFiles({
        prefix,
        delimiter: '/'
      })
      files = fileList

      // Get folders (prefixes)
      const [, , apiResponse] = await bucket.getFiles({
        prefix,
        delimiter: '/',
        autoPaginate: false
      })
      folderPrefixes = (apiResponse as any)?.prefixes || []

      console.log('Found files:', files.length, 'folders:', folderPrefixes.length)
    } catch (storageError: any) {
      console.error('Storage error:', storageError.message)
      // Return empty if media folder doesn't exist yet
      return {
        success: true,
        data: {
          files: [],
          folders: [],
          currentFolder: folder
        }
      }
    }

    // Format file data - filter out .keep files and folder markers
    const fileData = await Promise.all(
      files
        .filter(file => {
          const fileName = file.name.split('/').pop() || ''
          return !file.name.endsWith('/') && fileName !== '.keep' && fileName !== ''
        })
        .map(async (file) => {
          try {
            const [metadata] = await file.getMetadata()

            // Get download URL - use Firebase Storage public URL format
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`

            return {
              name: file.name.split('/').pop() || file.name,
              path: file.name,
              url,
              size: parseInt(metadata.size?.toString() || '0'),
              contentType: metadata.contentType || 'application/octet-stream',
              updated: metadata.updated,
              folder: file.name.split('/').slice(0, -1).join('/')
            }
          } catch (error) {
            console.error(`Error getting metadata for ${file.name}:`, error)
            return null
          }
        })
    )

    // Filter out nulls and sort by updated date
    const validFiles = fileData
      .filter((f): f is NonNullable<typeof f> => f !== null)
      .sort((a, b) => new Date(b.updated || 0).getTime() - new Date(a.updated || 0).getTime())

    // Format folder data
    const folderData = folderPrefixes.map((prefixPath: string) => {
      const folderName = prefixPath.replace(/\/$/, '').split('/').pop() || prefixPath
      // Remove 'media/' prefix for display
      const displayPath = prefixPath.replace(/^media\//, '').replace(/\/$/, '')
      return {
        name: folderName,
        path: displayPath,
        isFolder: true
      }
    })

    return {
      success: true,
      data: {
        files: validFiles,
        folders: folderData,
        currentFolder: folder
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('Failed to list media:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to list media files'
    })
  }
})

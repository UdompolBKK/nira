import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'

export const useFirebaseStorage = () => {
  const { storage } = useFirebase()

  const uploadFile = async (path: string, file: File) => {
    const fileRef = storageRef(storage, path)
    const snapshot = await uploadBytes(fileRef, file)
    const url = await getDownloadURL(snapshot.ref)
    return { snapshot, url }
  }

  const getFileUrl = async (path: string) => {
    const fileRef = storageRef(storage, path)
    return await getDownloadURL(fileRef)
  }

  const deleteFile = async (path: string) => {
    const fileRef = storageRef(storage, path)
    await deleteObject(fileRef)
  }

  const listFiles = async (path: string) => {
    const folderRef = storageRef(storage, path)
    const result = await listAll(folderRef)
    return result
  }

  return {
    uploadFile,
    getFileUrl,
    deleteFile,
    listFiles
  }
}

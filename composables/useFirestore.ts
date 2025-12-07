import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type QueryConstraint
} from 'firebase/firestore'

export const useFirestore = () => {
  const { firestore } = useFirebase()

  const getDocument = async (collectionName: string, documentId: string) => {
    const docRef = doc(firestore, collectionName, documentId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  }

  const getCollection = async (collectionName: string, ...queryConstraints: QueryConstraint[]) => {
    const collectionRef = collection(firestore, collectionName)
    const q = queryConstraints.length > 0 ? query(collectionRef, ...queryConstraints) : collectionRef
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }

  const addDocument = async (collectionName: string, data: any) => {
    const collectionRef = collection(firestore, collectionName)
    const docRef = await addDoc(collectionRef, data)
    return docRef.id
  }

  const setDocument = async (collectionName: string, documentId: string, data: any, merge = true) => {
    const docRef = doc(firestore, collectionName, documentId)
    await setDoc(docRef, data, { merge })
  }

  const updateDocument = async (collectionName: string, documentId: string, data: any) => {
    const docRef = doc(firestore, collectionName, documentId)
    await updateDoc(docRef, data)
  }

  const deleteDocument = async (collectionName: string, documentId: string) => {
    const docRef = doc(firestore, collectionName, documentId)
    await deleteDoc(docRef)
  }

  return {
    getDocument,
    getCollection,
    addDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    // Export query helpers
    where,
    orderBy,
    limit
  }
}

import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import db from '@/utils/firestore'
import { ACTIVITY_COLLECTION_NAME } from '@/utils/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const collectionRef = collection(db, ACTIVITY_COLLECTION_NAME)
    const docSnap = await getDocs(collectionRef)
    const deletePromises: Promise<any>[] = []

    if (docSnap.empty) {
      return res.status(200).json({ message: 'No document to delete' })
    }
    docSnap.docs.forEach(async (d) => {
      deletePromises.push(deleteDoc(doc(db, ACTIVITY_COLLECTION_NAME, d.id)))
    })
    await Promise.all(deletePromises)
    res
      .status(200)
      .json({ message: 'Successfully deleted the activities of previous week' })
  } catch (error) {
    console.error('Error deleting the documents:', error)
    res.status(500).json({ error: 'Failed to delete the documents' })
  }
}

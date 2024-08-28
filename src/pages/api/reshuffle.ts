import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import db from '@/utils/firestore'
import {
  SCHEDULE_COLLECTION_NAME,
  DATA_FIELD,
  SCHEDULE_DOC_NAME,
} from '@/utils/constants'
import { shuffleList } from '@/utils/helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const docRef = doc(db, SCHEDULE_COLLECTION_NAME, SCHEDULE_DOC_NAME)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()?.[DATA_FIELD] as string[]
      const reshuffledData = shuffleList(data)

      setDoc(doc(db, SCHEDULE_COLLECTION_NAME, SCHEDULE_DOC_NAME), {
        [DATA_FIELD]: reshuffledData,
        timestamp: serverTimestamp(),
      }).then(() => {})

      res.status(200).json({ message: 'Successfully reshuffled the list' })
    } else {
      res.status(500).json({
        message: "Couldn't find the team list from DB. Please check DB",
      })
    }
  } catch (error) {
    console.error('Error executing scheduled task:', error)
    res.status(500).json({ error: 'Failed to execute scheduled task' })
  }
}

'use client'

import { ToastContainer } from 'react-toastify'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'

import db from '@/utils/firestore'
import { getCurrentWeekDaysWithDates } from '@/utils/helper'
import {
  SCHEDULE_DOC_NAME,
  DATA_FIELD,
  SCHEDULE_COLLECTION_NAME,
} from '@/utils/constants'
import DraggableList from '@/components/DragableList/DragableList'
import AddMe from '@/components/AddMe'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const weekDays = getCurrentWeekDaysWithDates(5)
  const [team, setTeam] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    const fetch = async () => {
      const docRef = doc(db, SCHEDULE_COLLECTION_NAME, SCHEDULE_DOC_NAME)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()?.[DATA_FIELD]
        if (Array.isArray(data)) {
          setTeam(data as string[])
        }
      }
    }

    fetch()
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, SCHEDULE_COLLECTION_NAME, SCHEDULE_DOC_NAME),
      (doc) => {
        const data = doc.data()?.[DATA_FIELD]
        setTeam(data as string[])
      }
    )

    return () => {
      unsub()
    }
  }, [])

  return (
    <>
      <main className="flex flex-col items-center justify-center gap-16 px-0 py-4 lg:px-8">
        <header className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          WFH Scheduler
        </header>
        <section className="flex w-full flex-col items-center justify-between gap-4 px-4 sm:px-8 md:px-16">
          <DraggableList list={weekDays} draggable={false} />
          <DraggableList list={team} />
        </section>
        <AddMe toggleSidebar={() => setIsOpen(!isOpen)} />
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </main>
      <ToastContainer />
    </>
  )
}

import React, { useEffect, useState } from 'react'
import { IActivity } from '@/utils/interface'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import db from '../utils/firestore'
import { ACTIVITY_COLLECTION_NAME } from '../utils/constants'

type Props = {
  isOpen: boolean
  setIsOpen: (_open: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: Props) => {
  const [activityList, setActivityList] = useState<IActivity[]>([])

  useEffect(() => {
    const fetch = async () => {
      const collectionRef = collection(db, ACTIVITY_COLLECTION_NAME)
      const docsSnap = await getDocs(collectionRef)
      setActivityList(
        docsSnap.docs.map((d) => {
          return { ...d.data(), time: d.id }
        }) as IActivity[]
      )
    }

    fetch()
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, ACTIVITY_COLLECTION_NAME),
      (docsSnap) => {
        setActivityList(
          docsSnap.docs.map((d) => {
            return {
              ...d.data(),
              time: d.id,
            }
          }) as IActivity[]
        )
      }
    )

    return () => {
      unsub()
    }
  }, [])

  return (
    <aside
      id="sidebar"
      className={`fixed right-0 top-0 h-screen w-full lg:w-1/4 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-40 overflow-y-scroll border-l border-slate-200 bg-black py-4 shadow-lg shadow-slate-200 transition-all`}
    >
      <div className="sticky top-0 bg-black">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute left-2 h-8 w-8 rounded-full border border-slate-200"
        >
          X
        </button>
        <h1 className="mb-8 text-center text-3xl">Activity</h1>
      </div>

      <div className="flex w-full flex-col items-start justify-start space-y-4">
        {activityList.map((activity: IActivity, index) => {
          return (
            <div
              key={activity?.time ?? index}
              className="w-full border-y border-slate-200 p-2"
            >
              <p>
                <span className="text-lg font-bold">{activity.who}</span>{' '}
                changed with{' '}
                <span className="text-lg font-bold">{activity.withWhom}</span>
              </p>
              <p className="text-sm">
                From: <b className="text-base">{activity.previousDay}</b>
              </p>
              <p className="text-sm">
                To: <b className="text-base">{activity.changedToDay}</b>
              </p>
              {activity.time && (
                <p className="text-sm">
                  Time:{' '}
                  <b className="text-base">
                    {new Date(+activity.time).toLocaleString()}
                  </b>
                </p>
              )}
              <p className="mt-2 text-xs">
                Updater: <b className="text-sm">{activity.updater}</b>
              </p>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar

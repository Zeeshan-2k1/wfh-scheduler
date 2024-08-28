'use client'
import { DragEvent, useEffect, useRef, useState } from 'react'
import { WeekDayWithDate, getDayName } from '@/utils/helper'
import DraggableItem from './DraggableItem'
import useScreenSize from '@/hooks/useScreenSize'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import db from '@/utils/firestore'
import {
  SCHEDULE_COLLECTION_NAME,
  DATA_FIELD,
  SCHEDULE_DOC_NAME,
  ACTIVITY_COLLECTION_NAME,
} from '@/utils/constants'
import { User } from 'firebase/auth'
import auth from '@/utils/auth'
import { errorNotification } from '@/utils/notification'
import { IActivity } from '../../utils/interface'

interface DraggableListProps {
  list: WeekDayWithDate[] | string[]
  draggable?: boolean
}

const DraggableList = ({ list, draggable = true }: DraggableListProps) => {
  const { isSmallScreen } = useScreenSize()
  const [items, setItems] = useState<string[] | WeekDayWithDate[]>(list)
  const [dragOverIndex, setDragOverIndex] = useState<number>(-1)
  const dragNode = useRef<HTMLElement | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>()

  useEffect(() => {
    setCurrentUser(auth.currentUser)
  }, [auth.currentUser])

  useEffect(() => {
    setItems(list)
  }, [list])

  const getAbbreviatedItem = (item: WeekDayWithDate | string) => {
    if (typeof item === 'string') {
      return item
    }

    const day = isSmallScreen ? item.day.slice(0, 3) : item.day
    const date = isSmallScreen ? item.date.slice(-2) : item.date

    return { day, date }
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    const { target } = e
    dragNode.current = target as HTMLElement
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', (target as HTMLElement).outerHTML)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    if (dragNode.current !== e.target) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnd = async (e: DragEvent<HTMLDivElement>, index: number) => {
    setDragOverIndex(-1)
    if (dragOverIndex === -1 || index === dragOverIndex) {
      return
    }

    if (!currentUser) {
      errorNotification('Please sign up to make modifications.')
      return
    }

    if (!currentUser?.emailVerified) {
      errorNotification('Email not verified. Please verify it and try again.')
      return
    }

    const newItems = [...items]
    const draggingItem = newItems[index]
    const targetItem = newItems[dragOverIndex]

    newItems[index] = targetItem
    newItems[dragOverIndex] = draggingItem

    setItems(newItems as string[])
    await setDoc(doc(db, SCHEDULE_COLLECTION_NAME, SCHEDULE_DOC_NAME), {
      [DATA_FIELD]: newItems as string[],
      timestamp: serverTimestamp(),
    })

    await logActivity(
      index,
      dragOverIndex,
      newItems[dragOverIndex] as string,
      newItems[index] as string
    )
  }

  const logActivity = async (
    currentIndex: number,
    nextIndex: number,
    who: string,
    withWhom: string
  ) => {
    const activity: IActivity = {
      changedToDay: getDayName(nextIndex),
      previousDay: getDayName(currentIndex),
      who,
      withWhom,
      updater: auth.currentUser?.email ?? '',
    }
    await setDoc(
      doc(db, ACTIVITY_COLLECTION_NAME, Date.now().toString()),
      activity
    )
  }

  return (
    <div className={`mx-4 grid w-full grid-cols-5 gap-4`}>
      {items?.map((item, index) => (
        <DraggableItem
          key={index}
          draggable={draggable}
          handleDragEnd={handleDragEnd}
          handleDragOver={handleDragOver}
          handleDragStart={handleDragStart}
          index={index}
          item={getAbbreviatedItem(item)}
        />
      ))}
    </div>
  )
}

export default DraggableList

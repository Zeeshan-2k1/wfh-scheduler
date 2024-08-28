import React from 'react'
import { WeekDayWithDate } from '@/utils/helper'
import Tooltip from '../Tooltip'

type Props = {
  item: string | WeekDayWithDate
  draggable: boolean
  handleDragStart: (_e: any, _index: number) => void
  handleDragOver: (_e: any, _index: number) => void
  handleDragEnd: (_e: any, _index: number) => void
  index: number
}

const DraggableItem = ({
  item,
  draggable,
  handleDragEnd,
  handleDragOver,
  handleDragStart,
  index,
}: Props) => {
  if (typeof item === 'string') {
    return (
      <div
        key={item}
        draggable={draggable}
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={(e) => handleDragEnd(e, index)}
      >
        <Tooltip>{item}</Tooltip>
      </div>
    )
  } else {
    return (
      <div
        key={item.date}
        draggable={draggable}
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={(e) => handleDragEnd(e, index)}
      >
        <Tooltip>
          <div className="flex flex-col gap-1">
            <span className="text-base">{item.day}</span>
            <span className="text-sm text-slate-400">{item.date}</span>
          </div>
        </Tooltip>
      </div>
    )
  }
}

export default DraggableItem

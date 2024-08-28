import React from 'react'

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
}

const Tooltip = (props: TooltipProps) => {
  return (
    <div className="group relative">
      <div className="w-100% overflow-hidden text-ellipsis text-nowrap rounded-md border border-slate-200 p-3 text-center capitalize">
        {props.children}
      </div>
      <span className="absolute left-1/2 top-10 z-40 -translate-x-1/2 scale-0 rounded border border-slate-100 bg-black p-2 text-xs text-white transition-all group-hover:scale-100">
        {props.text?.length ? props.text : props.children}
      </span>
    </div>
  )
}

export default Tooltip

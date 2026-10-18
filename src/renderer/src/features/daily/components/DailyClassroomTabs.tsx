import React from 'react'
import type { ClassroomItem } from '../types'

interface DailyClassroomTabsProps {
  classrooms: ClassroomItem[]
  selectedClassroomId: string
  onSelectClassroom: (id: string) => void
}

export const DailyClassroomTabs: React.FC<DailyClassroomTabsProps> = ({
  classrooms,
  selectedClassroomId,
  onSelectClassroom
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {classrooms.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelectClassroom(c.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedClassroomId === c.id
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/60'
          }`}
        >
          <span className="material-symbols-outlined text-base">meeting_room</span>
          <span>{c.name}</span>
          {c.room && <span className="opacity-70 font-mono">({c.room})</span>}
        </button>
      ))}
    </div>
  )
}

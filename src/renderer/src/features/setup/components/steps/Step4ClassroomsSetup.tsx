import React, { useState } from 'react'
import { GraduationCap, Plus, Trash2, Users, School } from 'lucide-react'
import type { SetupFormData, SetupClassroomItem } from '../../types'

interface Step4ClassroomsSetupProps {
  formData: SetupFormData
  addClassroom: (item: Omit<SetupClassroomItem, 'id'>) => void
  removeClassroom: (id: string) => void
  updateClassroom: (id: string, updates: Partial<SetupClassroomItem>) => void
}

export const Step4ClassroomsSetup: React.FC<Step4ClassroomsSetupProps> = ({
  formData,
  addClassroom,
  removeClassroom,
  updateClassroom
}) => {
  const [newName, setNewName] = useState('')
  const [newRoom, setNewRoom] = useState('')
  const [newCapacity, setNewCapacity] = useState(20)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    addClassroom({
      name: newName.trim(),
      room: newRoom.trim() || 'قاعة دراسية',
      capacity: Number(newCapacity) || 20
    })
    setNewName('')
    setNewRoom('')
    setNewCapacity(20)
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <span>تهيئة الفصول والمراحل التعليمية</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          يمكنك تخصيص أسماء الفصول المبدئية وسعتها والقاعات التابعة لها، ويمكن تعديلها لاحقاً في أي وقت.
        </p>
      </div>

      {/* Add Classroom Form */}
      <form onSubmit={handleAdd} className="p-4 rounded-xl border border-border bg-card/60 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-foreground mb-1">اسم الفصل / المرحلة</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="مثال: فصل الزهور (تمهيدي 1)"
            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">القاعة / الغرفة</label>
          <input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="قاعة 105"
            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فصل</span>
          </button>
        </div>
      </form>

      {/* Classrooms List */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-foreground flex items-center justify-between px-1">
          <span>قائمة الفصول الحالية ({formData.classrooms.length})</span>
          <span className="text-[11px] text-muted-foreground">السعة الإجمالية المقدرة: {formData.classrooms.reduce((acc, c) => acc + c.capacity, 0)} طالب</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {formData.classrooms.map((cls) => (
            <div
              key={cls.id}
              className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <School className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={cls.name}
                    onChange={(e) => updateClassroom(cls.id, { name: e.target.value })}
                    className="w-full font-bold text-xs text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1"
                  />
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground px-1">
                    <span>القاعة:</span>
                    <input
                      type="text"
                      value={cls.room}
                      onChange={(e) => updateClassroom(cls.id, { room: e.target.value })}
                      className="w-20 bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-muted/40 px-2 py-1 rounded-lg border border-border/60 text-xs">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={cls.capacity}
                    onChange={(e) => updateClassroom(cls.id, { capacity: Number(e.target.value) || 20 })}
                    className="w-10 bg-transparent text-center font-bold text-foreground focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeClassroom(cls.id)}
                  title="حذف الفصل"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

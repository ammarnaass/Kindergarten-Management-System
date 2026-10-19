import React from 'react'
import type { ClassroomItem } from '@/lib/api/types'

interface EditChildFormFieldsProps {
  firstName: string
  setFirstName: (val: string) => void
  lastName: string
  setLastName: (val: string) => void
  birthDate: string
  setBirthDate: (val: string) => void
  gender: 'male' | 'female'
  setGender: (val: 'male' | 'female') => void
  classroomId: string
  setClassroomId: (val: string) => void
  status: 'active' | 'waitlist' | 'graduated' | 'withdrawn'
  setStatus: (val: 'active' | 'waitlist' | 'graduated' | 'withdrawn') => void
  allergies: string
  setAllergies: (val: string) => void
  medicalNotes: string
  setMedicalNotes: (val: string) => void
  classrooms: ClassroomItem[]
}

export function EditChildFormFields({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthDate,
  setBirthDate,
  gender,
  setGender,
  classroomId,
  setClassroomId,
  status,
  setStatus,
  allergies,
  setAllergies,
  medicalNotes,
  setMedicalNotes,
  classrooms
}: EditChildFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
            الاسم الشخصي *
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
            اللقب العائلي *
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
            تاريخ الميلاد *
          </label>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1">الجنس *</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
          >
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
            الفصل الدراسي
          </label>
          <select
            value={classroomId}
            onChange={(e) => setClassroomId(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
          >
            <option value="">غير مسكن في فصل</option>
            {classrooms.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} {cls.room ? `(${cls.room})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
            حالة القيد
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
          >
            <option value="active">نشط ومسجل</option>
            <option value="waitlist">قائمة الانتظار</option>
            <option value="graduated">متخرج</option>
            <option value="withdrawn">منسحب</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1">
          الحساسيات الغذائية والدوائية
        </label>
        <input
          type="text"
          placeholder="مثال: حساسية الفول السوداني، حساسية البنسلين..."
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1">
          ملاحظات صحية خاصة
        </label>
        <textarea
          rows={2}
          placeholder="أي إرشادات طبية أو بروتوكول طوارئ خاص بالطفل..."
          value={medicalNotes}
          onChange={(e) => setMedicalNotes(e.target.value)}
          className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
        />
      </div>
    </>
  )
}

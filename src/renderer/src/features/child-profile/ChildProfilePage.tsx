import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import type { ClassroomItem, ChildItem } from '@/lib/api/types'
import {
  ProfileHeroBanner,
  CriticalHealthAlertBanner,
  ProfileNavigationTabs,
  ParentsAndPickupsSection,
  GrowthAndAuditSection,
  EditChildModal,
  AddPickupModal,
  ProfileTabId
} from './index'

export default function ChildProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [child, setChild] = useState<ChildItem | null>(null)
  const [guardians, setGuardians] = useState<any[]>([])
  const [pickups, setPickups] = useState<any[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ProfileTabId>('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddPickupModalOpen, setIsAddPickupModalOpen] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [c, g, p, cls] = await Promise.all([
        api.children.get(id).catch(() => null),
        api.children.getGuardians(id).catch(() => []),
        api.children.getPickups(id).catch(() => []),
        api.classrooms.list().catch(() => [])
      ])
      setChild(c)
      setGuardians(g ?? [])
      setPickups(p ?? [])
      setClassrooms(cls ?? [])
    } catch (e: any) {
      console.error('Error loading child profile:', e)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  // Desktop keyboard shortcuts (Ctrl+E for Edit, Ctrl+P for Print)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        if (child) {
          setIsEditModalOpen(true)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [child])

  // Loading state
  if (loading && !child) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center select-none">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">
          progress_activity
        </span>
        <p className="font-semibold text-on-surface text-base">جاري مزامنة بيانات ملف الطفل محلياً...</p>
        <p className="font-caption text-xs text-on-surface-variant mt-1">قراءة السجلات من قاعدة بيانات SQLite</p>
      </div>
    )
  }

  // Not found error state
  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm select-none">
        <div className="w-16 h-16 rounded-full bg-error-container/40 text-error flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl">person_off</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface mb-2">لم يتم العثور على ملف الطفل</h2>
        <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
          المعرّف المطلوب غير مسجل، أو ربما تم حذف ملف هذا الطفل من قاعدة البيانات المحلية.
        </p>
        <button
          onClick={() => navigate('/children')}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          type="button"
        >
          <span className="material-symbols-outlined text-base">arrow_forward</span>
          <span>العودة إلى سجل الأطفال</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-space-lg select-none">
      {/* Top Profile Hero Banner */}
      <ProfileHeroBanner
        child={child}
        onEdit={() => setIsEditModalOpen(true)}
        onPrint={() => window.print()}
      />

      {/* Critical Permanent Health Alert Banner (renders only if allergies or notes exist) */}
      <CriticalHealthAlertBanner
        allergies={child.allergies}
        medicalNotes={child.medicalNotes}
      />

      {/* Navigation Tabs Strip */}
      <ProfileNavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Two-Column Rich Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Right Side (Column 7): Family Contacts & Authorized Pickups */}
        <div className="lg:col-span-7">
          <ParentsAndPickupsSection
            guardians={guardians}
            pickups={pickups.map((p) => ({
              id: p.id,
              name: p.fullName || p.name,
              relationship: p.note || p.relationship || 'مخوّل رسمي',
              phone: p.phone || undefined,
              nationalId: p.nationalId || undefined,
              note: p.note || undefined
            }))}
            onAddPickup={() => setIsAddPickupModalOpen(true)}
          />
        </div>

        {/* Left Side (Column 5): Growth Metrics, Attendance, Finance & Audit Log */}
        <div className="lg:col-span-5">
          <GrowthAndAuditSection childId={child.id} child={child} />
        </div>
      </div>

      {/* Modal: Edit Child Profile */}
      <EditChildModal
        child={child}
        classrooms={classrooms}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={load}
      />

      {/* Modal: Add Authorized Pickup */}
      <AddPickupModal
        childId={child.id}
        childName={`${child.firstName} ${child.lastName}`}
        isOpen={isAddPickupModalOpen}
        onClose={() => setIsAddPickupModalOpen(false)}
        onSaved={load}
      />
    </div>
  )
}

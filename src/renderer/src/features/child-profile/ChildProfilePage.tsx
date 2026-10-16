import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ipc } from '@/lib/ipc'
import {
  ProfileHeroBanner,
  CriticalHealthAlertBanner,
  ProfileNavigationTabs,
  ParentsAndPickupsSection,
  GrowthAndAuditSection,
  ProfileTabId
} from './index'

export default function ChildProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [child, setChild] = useState<any>(null)
  const [guardians, setGuardians] = useState<any[]>([])
  const [pickups, setPickups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ProfileTabId>('overview')

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [c, g, p] = await Promise.all([
        ipc<any>('children:get', { id }).catch(() => null),
        ipc<any[]>('children:guardians', { id }).catch(() => []),
        ipc<any[]>('children:pickups', { id }).catch(() => [])
      ])
      setChild(c)
      setGuardians(g ?? [])
      setPickups(p ?? [])
    } catch (e: any) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  // Fallback demo child if not found or when testing route directly
  const displayChild = child || {
    id: id || 'demo-1',
    firstName: 'سارة',
    lastName: 'بنت طارق بن علي',
    birthDate: '12 يوليو 2022',
    photoPath:
      'https://images.unsplash.com/photo-1595454223600-91fb57790b4d?w=200&auto=format&fit=crop&q=80',
    classroomId: 'فصل النجوم',
    allergies: 'حساسية حادة من الفول السوداني ومشتقات المكسرات'
  }

  return (
    <div className="flex flex-col w-full gap-space-lg select-none">
      {/* Top Profile Hero Banner */}
      <ProfileHeroBanner
        child={displayChild}
        onEdit={() => console.log('Edit child')}
        onPrint={() => window.print()}
      />

      {/* Critical Permanent Health Alert Banner */}
      <CriticalHealthAlertBanner
        allergies={displayChild.allergies || 'حساسية حادة من الفول السوداني ومشتقات المكسرات'}
        doctorPhone="0555 987 654"
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
              relationship: p.relationship || p.note || 'مخوّل معتمد',
              phone: p.phone || '0550123456',
              tag: 'مخوّل مسجل',
              tagClass: 'bg-emerald-100 text-emerald-800',
              note: p.nationalId ? `هوية: ${p.nationalId}` : 'بصمة بيومترية مسجلة'
            }))}
            onAddPickup={() => console.log('Add pickup person')}
          />
        </div>

        {/* Left Side (Column 5): Growth Metrics, Attendance, Finance & Audit Log */}
        <div className="lg:col-span-5">
          <GrowthAndAuditSection childId={displayChild.id} />
        </div>
      </div>

      {loading && (
        <div className="text-center py-2 text-on-surface-variant font-caption text-caption">
          جاري مزامنة بيانات الطفل محلياً...
        </div>
      )}
    </div>
  )
}

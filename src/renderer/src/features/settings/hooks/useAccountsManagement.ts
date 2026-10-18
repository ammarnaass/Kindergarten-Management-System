import { useState, useEffect, useMemo, useCallback } from 'react'
import { api } from '@/lib/api'
import type { DetailedUserItem, RoleWithPermissionsItem } from '@/lib/api/types'
import type { AccountsFilterState, ActiveModalState, ModalType } from '../components/accounts/types'

export function useAccountsManagement() {
  const [users, setUsers] = useState<DetailedUserItem[]>([])
  const [roles, setRoles] = useState<RoleWithPermissionsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [filters, setFilters] = useState<AccountsFilterState>({
    search: '',
    role: 'all',
    status: 'all'
  })

  const [modalState, setModalState] = useState<ActiveModalState>({
    type: 'none',
    user: null
  })

  const showFeedback = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3500)
  }, [])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [uList, rList] = await Promise.all([
        api.users.list(),
        api.users.listRoles()
      ])
      setUsers(uList || [])
      setRoles(rList || [])
    } catch (err: any) {
      console.error('Failed to load users/roles:', err)
      showFeedback('فشل في تحميل قائمة الحسابات', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showFeedback])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openModal = useCallback((type: ModalType, user: DetailedUserItem | null = null) => {
    setModalState({ type, user })
  }, [])

  const closeModal = useCallback(() => {
    setModalState({ type: 'none', user: null })
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchName = u.displayName.toLowerCase().includes(query)
        const matchUsername = u.username.toLowerCase().includes(query)
        const matchPhone = u.phone?.includes(query) ?? false
        if (!matchName && !matchUsername && !matchPhone) return false
      }

      // Role filter
      if (filters.role !== 'all' && u.roleName !== filters.role) {
        return false
      }

      // Status filter
      if (filters.status === 'active' && !u.isActive) return false
      if (filters.status === 'inactive' && u.isActive) return false

      return true
    })
  }, [users, filters])

  // Actions
  const handleCreateUser = useCallback(async (data: any) => {
    try {
      await api.users.create(data)
      showFeedback(`تم إنشاء حساب المستخدم @${data.username} بنجاح`)
      closeModal()
      loadData()
    } catch (err: any) {
      showFeedback(err?.message || 'فشل في إنشاء الحساب', 'error')
      throw err
    }
  }, [closeModal, loadData, showFeedback])

  const handleUpdateUser = useCallback(async (data: any) => {
    try {
      await api.users.update(data)
      showFeedback(`تم تحديث بيانات الحساب بنجاح`)
      closeModal()
      loadData()
    } catch (err: any) {
      showFeedback(err?.message || 'فشل في تحديث الحساب', 'error')
      throw err
    }
  }, [closeModal, loadData, showFeedback])

  const handleResetPassword = useCallback(async (id: string, newPassword: string) => {
    try {
      await api.users.resetPassword({ id, newPassword })
      showFeedback('تم تعيين كلمة المرور الجديدة بنجاح')
      closeModal()
      loadData()
    } catch (err: any) {
      showFeedback(err?.message || 'فشل في تغيير كلمة المرور', 'error')
      throw err
    }
  }, [closeModal, loadData, showFeedback])

  const handleResetPin = useCallback(async (id: string, newPin: string | null) => {
    try {
      await api.users.resetPin({ id, newPin })
      showFeedback(newPin ? 'تم تحديث رمز PIN السريع بنجاح' : 'تم إلغاء تفعيل رمز PIN')
      closeModal()
      loadData()
    } catch (err: any) {
      showFeedback(err?.message || 'فشل في تحديث رمز PIN', 'error')
      throw err
    }
  }, [closeModal, loadData, showFeedback])

  const handleToggleActive = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      await api.users.toggleActive({ id, isActive: !currentStatus })
      showFeedback(!currentStatus ? 'تم تفعيل الحساب' : 'تم تعطيل الحساب بنجاح')
      loadData()
    } catch (err: any) {
      showFeedback(err?.message || 'فشل في تغيير حالة الحساب', 'error')
    }
  }, [loadData, showFeedback])

  const handleDeleteUser = useCallback(async (id: string, username: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الحساب @${username} نهائياً؟`)) {
      return
    }
    try {
      await api.users.delete(id)
      showFeedback(`تم حذف الحساب @${username} بنجاح`)
      loadData()
    } catch (err: any) {
      showFeedback(err?.message || 'فشل في حذف الحساب', 'error')
    }
  }, [loadData, showFeedback])

  return {
    users,
    roles,
    isLoading,
    feedback,
    filters,
    setFilters,
    filteredUsers,
    modalState,
    openModal,
    closeModal,
    handleCreateUser,
    handleUpdateUser,
    handleResetPassword,
    handleResetPin,
    handleToggleActive,
    handleDeleteUser,
    refreshUsers: loadData
  }
}

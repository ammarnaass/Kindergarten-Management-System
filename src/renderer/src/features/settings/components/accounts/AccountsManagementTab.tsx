import React from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { useAccountsManagement } from '../../hooks/useAccountsManagement'
import { AccountsKpiHeader } from './AccountsKpiHeader'
import { AccountsFilterToolbar } from './AccountsFilterToolbar'
import { AccountsTableView } from './AccountsTableView'
import { RolesPermissionsCard } from './RolesPermissionsCard'
import { AddUserModal } from './AddUserModal'
import { EditUserModal } from './EditUserModal'
import { ResetPasswordModal } from './ResetPasswordModal'
import { ResetPinModal } from './ResetPinModal'

export const AccountsManagementTab: React.FC = () => {
  const {
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
    refreshUsers
  } = useAccountsManagement()

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* KPI Stats */}
      <AccountsKpiHeader users={users} />

      {/* Filter and Actions Toolbar */}
      <AccountsFilterToolbar
        filters={filters}
        setFilters={setFilters}
        onAddNew={() => openModal('add')}
        onRefresh={refreshUsers}
        isLoading={isLoading}
      />

      {/* Users Table */}
      <AccountsTableView
        users={filteredUsers}
        onEdit={(u) => openModal('edit', u)}
        onResetPassword={(u) => openModal('reset-password', u)}
        onResetPin={(u) => openModal('reset-pin', u)}
        onToggleActive={handleToggleActive}
        onDelete={handleDeleteUser}
      />

      {/* Roles & Permissions Reference Card */}
      <RolesPermissionsCard roles={roles} />

      {/* Modals */}
      <AddUserModal
        isOpen={modalState.type === 'add'}
        onClose={closeModal}
        onSubmit={handleCreateUser}
        roles={roles}
      />

      <EditUserModal
        user={modalState.user}
        isOpen={modalState.type === 'edit'}
        onClose={closeModal}
        onSubmit={handleUpdateUser}
        roles={roles}
      />

      <ResetPasswordModal
        user={modalState.user}
        isOpen={modalState.type === 'reset-password'}
        onClose={closeModal}
        onSubmit={handleResetPassword}
      />

      <ResetPinModal
        user={modalState.user}
        isOpen={modalState.type === 'reset-pin'}
        onClose={closeModal}
        onSubmit={handleResetPin}
      />
    </div>
  )
}

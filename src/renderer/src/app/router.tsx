import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './Layout'
import { Login } from '../features/auth'
import { Dashboard } from '../features/dashboard'
import { ChildrenPage } from '../features/children'
import { AttendancePage } from '../features/attendance'
import { FinancePage } from '../features/finance'
import { BackupPage } from '../features/backup'
import { ChildProfilePage } from '../features/child-profile'
import { SafePickupPage } from '../features/safe-pickup'
import { SettingsPage } from '../features/settings'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'children', element: <ChildrenPage /> },
      { path: 'children/:id', element: <ChildProfilePage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'safe-pickup', element: <SafePickupPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'backup', element: <BackupPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
])

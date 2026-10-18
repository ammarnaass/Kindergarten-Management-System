import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './Layout'
import { Login, RegistrationWizardPage } from '../features/auth'
import { Dashboard } from '../features/dashboard'
import { ChildrenPage } from '../features/children'
import { AttendancePage } from '../features/attendance'
import { FinancePage } from '../features/finance'
import { BackupPage } from '../features/backup'
import { ChildProfilePage } from '../features/child-profile'
import { SafePickupPage } from '../features/safe-pickup'
import { DailyReportPage } from '../features/daily'
import { HealthPage } from '../features/health'
import { StaffPage } from '../features/staff'
import { ParentsPage } from '../features/parents'
import { ReportsPage } from '../features/reports'
import { SettingsPage } from '../features/settings'
import { TimetablePage } from '../features/timetable'
import { SetupWizardPage } from '../features/setup'
import { ClassroomsPage } from '../features/classrooms'

export const router = createBrowserRouter([
  { path: '/setup', element: <SetupWizardPage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <RegistrationWizardPage /> },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'children', element: <ChildrenPage /> },
      { path: 'children/:id', element: <ChildProfilePage /> },
      { path: 'classrooms', element: <ClassroomsPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'safe-pickup', element: <SafePickupPage /> },
      { path: 'daily', element: <DailyReportPage /> },
      { path: 'timetable', element: <TimetablePage /> },
      { path: 'health', element: <HealthPage /> },
      { path: 'parents', element: <ParentsPage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'backup', element: <BackupPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
])

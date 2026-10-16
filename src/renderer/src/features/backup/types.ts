export interface BackupItem {
  id: string
  date: string
  time: string
  type: string
  typeIcon: string
  typeClass: string
  size: string
  childrenCount: number
  invoicesCount: number
  path: string
  isLatest?: boolean
}

export const DEFAULT_BACKUPS: BackupItem[] = [
  {
    id: 'b1',
    date: '16 أكتوبر 2026',
    time: '14:30',
    type: 'تلقائي دوري',
    typeIcon: 'autorenew',
    typeClass: 'bg-primary-fixed text-on-primary-fixed-variant',
    size: '24.3 MB',
    childrenCount: 52,
    invoicesCount: 142,
    path: 'D:\\Rawdati_Backups\\auto_20261016.bak',
    isLatest: true
  },
  {
    id: 'b2',
    date: '15 أكتوبر 2026',
    time: '17:00',
    type: 'عند إغلاق التطبيق',
    typeIcon: 'power_settings_new',
    typeClass: 'bg-surface-container-high text-on-surface-variant',
    size: '24.1 MB',
    childrenCount: 52,
    invoicesCount: 138,
    path: 'D:\\Rawdati_Backups\\close_20261015.bak'
  },
  {
    id: 'b3',
    date: '14 أكتوبر 2026',
    time: '08:30',
    type: 'قبل تحديث النظام v2.0',
    typeIcon: 'upgrade',
    typeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    size: '23.8 MB',
    childrenCount: 51,
    invoicesCount: 130,
    path: 'D:\\Rawdati_Backups\\pre_upgrade.bak'
  },
  {
    id: 'b4',
    date: '12 أكتوبر 2026',
    time: '11:15',
    type: 'يدوي (أ. نادية المنصوري)',
    typeIcon: 'touch_app',
    typeClass: 'bg-surface-container-high text-on-surface-variant',
    size: '23.5 MB',
    childrenCount: 50,
    invoicesCount: 124,
    path: 'D:\\Rawdati_Backups\\manual_snap_20261012.bak'
  }
]

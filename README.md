# روضتي — Rawdati Desktop

نظام إدارة روضة أطفال لسطح المكتب (Electron + Vite + React + SQLite + Drizzle).

## التشغيل

```bash
npm install
npm run db:generate   # بعد تعديل المخطط
npm run dev           # تطوير
npm run dist:win      # بناء مثبت Windows
```

الدخول الافتراضي (بذرة التطوير): `admin / admin123` — غيّره فور التثبيت.

## البنية

- `src/shared` — عقد IPC ومخططات Zod وأنواع وثوابت (مشترك main+renderer)
- `src/main` — العملية الرئيسية: db/schema, repositories, services, ipc, security, infra
- `src/preload` — جسر contextBridge (قائمة بيضاء للقنوات)
- `src/renderer` — الواجهة React (RTL، عربي افتراضي)
- `drizzle/` — ملفات الهجرات

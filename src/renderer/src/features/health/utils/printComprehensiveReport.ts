import type { HealthStats, ClinicVisitItem } from '../types'

interface PrintHealthParams {
  date: string
  stats?: HealthStats
  clinicVisits: ClinicVisitItem[]
}

export function printComprehensiveReport({ date, stats, clinicVisits }: PrintHealthParams) {
  const printWin = window.open('', '_blank', 'width=800,height=600')
  if (!printWin) return

  printWin.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <title>سجل الصحة والسلامة المدرسية — ${date}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; direction: rtl; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: bold; color: #0059ba; margin: 0; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
          .stat-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center; }
          .stat-val { font-size: 18px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: right; }
          th { background: #f1f5f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">روضتي — سجل الصحة المدرسية والعيادة اليومي</h1>
          <p>تاريخ التقرير: ${date} • تقرير معتمد من العيادة المدرسية</p>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div>حالات الحساسية النشطة</div>
            <div class="stat-val" style="color:#ba1a1a;">${stats?.criticalAllergiesCount ?? 0}</div>
          </div>
          <div class="stat-box">
            <div>جرعات الأدوية الموثقة</div>
            <div class="stat-val" style="color:#825500;">${stats?.medicationsTodayCount ?? 0}</div>
          </div>
          <div class="stat-box">
            <div>مراجعات العيادة</div>
            <div class="stat-val" style="color:#0059ba;">${stats?.clinicVisitsTodayCount ?? 0}</div>
          </div>
          <div class="stat-box">
            <div>الحوادث المسجلة</div>
            <div class="stat-val" style="color:#727784;">${stats?.incidentsTodayCount ?? 0}</div>
          </div>
        </div>

        <h3>مراجعات العيادة المسجلة:</h3>
        <table>
          <thead>
            <tr>
              <th>الطفل</th>
              <th>الفصل</th>
              <th>النوع</th>
              <th>التفاصيل والإجراء</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            ${
              clinicVisits.length === 0
                ? '<tr><td colspan="5" style="text-align:center;">لا توجد مراجعات مسجلة</td></tr>'
                : clinicVisits
                    .map(
                      (v) => `
              <tr>
                <td>${v.childFirstName} ${v.childLastName}</td>
                <td>${v.classroomName || '—'}</td>
                <td>${v.kind}</td>
                <td>${v.detail}</td>
                <td>${v.recordedOn}</td>
              </tr>
            `
                    )
                    .join('')
            }
          </tbody>
        </table>

        <div class="footer">
          <p>نظام روضتي المكتبي • تقرير رسمي مستخرج محلياً</p>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
    </html>
  `)
  printWin.document.close()
}

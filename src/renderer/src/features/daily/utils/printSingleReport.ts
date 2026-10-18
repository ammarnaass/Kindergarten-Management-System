import type { DailyClassroomChild, DailyReportFormState, FoodValue, NapValue } from '../types'

interface PrintReportParams {
  child: DailyClassroomChild
  classroomName?: string
  date: string
  form: DailyReportFormState
}

export function printSingleReport({ child, classroomName, date, form }: PrintReportParams) {
  const printWin = window.open('', '_blank', 'width=800,height=600')
  if (!printWin) return

  const moodArabic = {
    happy: '😊 سعيد ومبتهج',
    calm: '😌 هادئ ومستقر',
    active: '⚡ نشيط وحيوي',
    tired: '😴 متعب / قليل النوم',
    fussy: '😢 متقلب المزاج'
  }[form.mood || 'happy']

  const foodArabic = (v: FoodValue | null) =>
    v === 'full' ? 'أكلها كاملة 💯' : v === 'half' ? 'نصف الوجبة 🥣' : 'لم يرغب بالأكل ❌'

  const napArabic = (v: NapValue | null) =>
    v === 'good_sleep' ? 'نام بهدوء وعمق 🛌' : v === 'rested' ? 'استرخاء وهدوء 📖' : 'قلق أو لم ينم ⚠️'

  printWin.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <title>التقرير اليومي — ${child.firstName} ${child.lastName}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; direction: rtl; color: #1e293b; background: #fff; }
          .card { border: 2px solid #0059ba; border-radius: 16px; padding: 20px; max-width: 650px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: bold; color: #0059ba; margin: 0; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; background: #f8faff; padding: 10px; border-radius: 10px; margin-bottom: 16px; }
          .section { margin-bottom: 14px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
          .section-title { font-size: 13px; font-weight: bold; color: #0059ba; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; }
          .item-row { font-size: 12px; margin-bottom: 4px; }
          .notice-box { background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; border-radius: 8px; padding: 8px; font-size: 12px; margin-top: 10px; }
          .footer { margin-top: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">روضتي — التقرير اليومي للطفل</h1>
            <p class="subtitle">يومية الملاحظات والأنشطة والرعاية المدرسية</p>
          </div>

          <div class="info-grid">
            <div><strong>اسم الطفل:</strong> ${child.firstName} ${child.lastName}</div>
            <div><strong>التاريخ:</strong> ${date}</div>
            <div><strong>الفصل:</strong> ${classroomName || '—'}</div>
            <div><strong>الحالة المزاجية:</strong> ${moodArabic}</div>
          </div>

          <div class="section">
            <div class="section-title">🥣 التغذية والوجبات</div>
            <div class="item-row"><strong>وجبة الإفطار:</strong> ${foodArabic(form.breakfastValue)} — ${form.breakfastNote}</div>
            <div class="item-row"><strong>وجبة الغداء:</strong> ${foodArabic(form.lunchValue)} — ${form.lunchNote}</div>
            <div class="item-row"><strong>سناك العصر:</strong> ${form.snackNote}</div>
          </div>

          <div class="section">
            <div class="section-title">🛌 فترة القيلولة والراحة</div>
            <div class="item-row"><strong>الحالة:</strong> ${napArabic(form.napValue)} (${form.napTime})</div>
          </div>

          <div class="section">
            <div class="section-title">🎨 الأنشطة التعليمية والتربوية</div>
            <div class="item-row">${form.activities}</div>
            <div class="item-row" style="margin-top:6px;"><strong>ملاحظة المعلمة:</strong> ${form.teacherNote}</div>
          </div>

          ${
            form.guardianNotice
              ? `
            <div class="notice-box">
              <strong>تنبيه لولي الأمر:</strong> ${form.guardianNotice}
            </div>
          `
              : ''
          }

          <div class="footer">
            <p>نظام روضتي المكتبي • تم استخراج هذا التقرير بتاريخ ${new Date().toLocaleDateString('ar-DZ')}</p>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `)
  printWin.document.close()
}

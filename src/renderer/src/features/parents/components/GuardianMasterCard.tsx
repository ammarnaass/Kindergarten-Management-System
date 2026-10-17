import React from 'react'
import type { GuardianItem, AuthorizedPickupItem } from '../types'

interface GuardianMasterCardProps {
  guardian: GuardianItem
  pickups: AuthorizedPickupItem[]
  onOpenPickupCard: () => void
  onOpenAddPickup: () => void
  onRevokePickup: (pickupId: string) => void
  onActionFeedback: (msg: string) => void
}

export const GuardianMasterCard: React.FC<GuardianMasterCardProps> = ({
  guardian,
  pickups,
  onOpenPickupCard,
  onOpenAddPickup,
  onRevokePickup,
  onActionFeedback
}) => {
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}.${last.charAt(0)}`
  }

  const allCanPickup = guardian.children.every((c) => c.canPickup)

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-outline-variant/20 relative overflow-hidden">
      {/* Accent Top Bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-l from-primary via-primary-container to-secondary-container" />

      {/* Profile Header */}
      <div className="flex items-start justify-between mb-space-md mt-1">
        <div className="flex items-center gap-space-md">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-primary text-on-primary font-bold text-lg flex items-center justify-center shadow-xs">
              {getInitials(guardian.firstName, guardian.lastName)}
            </div>
            <span
              className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]"
              title="تم التحقق من الهوية"
            >
              <span className="material-symbols-outlined text-[12px]">verified</span>
            </span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              {guardian.firstName} {guardian.lastName}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {guardian.children[0]?.relation || 'الولي الشرعي'} •{' '}
              {guardian.children[0]?.childName
                ? `كفيل الطفل (${guardian.children[0].childName})`
                : 'ولي أمر'}
            </p>
            <div className="flex items-center gap-1 text-primary font-caption text-caption mt-0.5">
              <span className="material-symbols-outlined text-[13px]">badge</span>
              <span className="font-mono">
                FAM-{guardian.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        {allCanPickup ? (
          <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold">
            معتمد نظامياً
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold">
            محظور
          </span>
        )}
      </div>

      {/* Official Info Matrix */}
      <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low/70 p-space-md rounded-xl mb-space-md font-body-sm text-body-sm">
        <div>
          <span className="font-caption text-caption text-on-surface-variant block">الهوية الوطنية</span>
          <span className="font-semibold text-on-surface font-mono">
            {guardian.nationalId || 'غير مسجلة'}
          </span>
        </div>
        <div>
          <span className="font-caption text-caption text-on-surface-variant block">
            رقم الجوال الأساسي
          </span>
          <span className="font-semibold text-on-surface font-mono dir-ltr text-right block">
            {guardian.phone}
          </span>
        </div>
        <div>
          <span className="font-caption text-caption text-on-surface-variant block">البريد الإلكتروني</span>
          <span className="font-semibold text-on-surface truncate block font-mono text-caption">
            {guardian.email || 'لا يوجد'}
          </span>
        </div>
        <div>
          <span className="font-caption text-caption text-on-surface-variant block">العنوان السكني</span>
          <span className="font-semibold text-on-surface truncate block">
            {guardian.address || 'الرياض، المملكة العربية السعودية'}
          </span>
        </div>
      </div>

      {/* Children Section */}
      <div className="mb-space-md">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px] text-primary">escalator_warning</span>
            الأطفال المسجلين تحت كفالته
          </span>
          <span className="font-caption text-caption text-primary font-medium">
            {guardian.children.length} أطفال
          </span>
        </div>
        <div className="space-y-2">
          {guardian.children.map((c) => (
            <div
              key={c.childId}
              className="p-space-sm bg-surface-container-low rounded-xl flex items-center justify-between hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">child_care</span>
                </div>
                <div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold block leading-tight">
                    {c.childName}
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    كود: STU-{c.childId.slice(0, 6).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="font-caption text-caption text-primary">حاضر اليوم بالروضة</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-caption text-caption">
                  {c.canPickup ? 'مصرح بالاستلام' : 'غير مصرح'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authorized Pickup Delegates Sub-List */}
      <div className="mb-space-md">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px] text-secondary">how_to_reg</span>
            الأشخاص المفوضون رسمياً بالاستلام
          </span>
          <button
            onClick={onOpenAddPickup}
            className="text-primary hover:text-primary-container font-label-sm text-label-sm flex items-center gap-0.5 font-semibold transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            إضافة مفوض
          </button>
        </div>

        {pickups.length === 0 ? (
          <div className="p-3 rounded-xl bg-surface-container-low/50 text-center text-on-surface-variant text-caption">
            لا يوجد أشخاص مفوضون إضافيون مسجلون لهذا الطفل حالياً.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pickups.map((pickup) => (
              <div
                key={pickup.id}
                className="p-space-sm bg-surface-container-low/60 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-secondary-container/20 text-on-secondary-container flex items-center justify-center font-bold text-xs">
                    {pickup.fullName.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                        {pickup.fullName}
                      </span>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant font-mono">
                      {pickup.phone || 'بدون جوال'} {pickup.nationalId ? `• هوية: ${pickup.nationalId}` : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-caption text-caption font-medium">
                    {pickup.note || 'ساري'}
                  </span>
                  <button
                    onClick={() => onRevokePickup(pickup.id)}
                    className="text-on-surface-variant hover:text-error p-1 transition-colors"
                    title="إلغاء التفويض"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Trail Log Preview */}
      <div className="mb-space-md">
        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1 mb-space-xs">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            mark_email_read
          </span>
          سجل المراسلات والإشعارات الآلية الأخيرة
        </span>
        <div className="space-y-1.5 font-body-sm text-body-sm">
          <div className="p-2 rounded-lg bg-surface-container-low flex items-start justify-between">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">sms</span>
              <div>
                <span className="font-medium text-on-surface block text-label-sm">
                  إشعار وصول الطفل للروضة
                </span>
                <span className="font-caption text-caption text-on-surface-variant">
                  تم تسليم الرسالة النصية بنجاح عبر بوابة GSM
                </span>
              </div>
            </div>
            <span className="font-caption text-caption text-outline font-mono">اليوم 07:45 ص</span>
          </div>

          <div className="p-2 rounded-lg bg-surface-container-low flex items-start justify-between">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">how_to_reg</span>
              <div>
                <span className="font-medium text-on-surface block text-label-sm">
                  تأكيد اصطحاب الطفل عند البوابة
                </span>
                <span className="font-caption text-caption text-on-surface-variant">
                  تم مسح باركود البطاقة المشفرة عند البوابة
                </span>
              </div>
            </div>
            <span className="font-caption text-caption text-outline font-mono">أمس 12:40 م</span>
          </div>
        </div>
      </div>

      {/* Action Buttons inside Card */}
      <div className="pt-space-sm border-t border-outline-variant/10 flex flex-wrap items-center gap-space-xs">
        <button
          onClick={onOpenPickupCard}
          className="flex-1 bg-primary text-on-primary hover:bg-primary-container py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 shadow-xs transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">id_card</span>
          <span>إصدار بطاقة ذكية (CR80)</span>
        </button>
        <button
          onClick={() => onActionFeedback('تم وضع علامة تنبيه ومتابعة على ملف ولي الأمر.')}
          className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">pause_circle</span>
          <span>تعليق مؤقت</span>
        </button>
        <button
          onClick={() => onActionFeedback('تم تسجيل تنبيه إداري أمني بخصوص الاستلام.')}
          className="w-9 h-9 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container/20 flex items-center justify-center transition-colors"
          title="إجراءات قانونية وحظر استلام"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">security</span>
        </button>
      </div>
    </div>
  )
}

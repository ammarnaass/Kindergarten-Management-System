import { describe, it, expect } from 'vitest'
import { ipcContract } from '../../src/shared/ipc-contract'

describe('ipc-contract', () => {
  it('validates children:create rejects bad date', () => {
    const r = (ipcContract['children:create'].input as any).safeParse({ firstName: 'a', lastName: 'b', birthDate: 'bad', gender: 'male' })
    expect(r.success).toBe(false)
  })
  it('validates attendance:mark requires entries', () => {
    const r = (ipcContract['attendance:mark'].input as any).safeParse({ date: '2026-10-16', entries: [] })
    expect(r.success).toBe(false)
  })
  it('validates attendance:mark accepts valid entries with real UUIDs', () => {
    const r = (ipcContract['attendance:mark'].input as any).safeParse({
      date: '2026-10-16',
      entries: [
        { childId: '0192994f-1234-7000-8000-000000000001', status: 'present' },
        { childId: '0192994f-1234-7000-8000-000000000002', status: 'absent' },
        { childId: '0192994f-1234-7000-8000-000000000003', status: 'late' },
        { childId: '0192994f-1234-7000-8000-000000000004', status: 'excused' }
      ]
    })
    expect(r.success).toBe(true)
  })
  it('validates attendance:mark rejects invalid status or non-uuid', () => {
    const r1 = (ipcContract['attendance:mark'].input as any).safeParse({
      date: '2026-10-16',
      entries: [{ childId: '0192994f-1234-7000-8000-000000000001', status: 'invalid_status' }]
    })
    expect(r1.success).toBe(false)

    const r2 = (ipcContract['attendance:mark'].input as any).safeParse({
      date: '2026-10-16',
      entries: [{ childId: 'not-a-uuid', status: 'present' }]
    })
    expect(r2.success).toBe(false)
  })
  it('validates children:create accepts valid child data', () => {
    const r = (ipcContract['children:create'].input as any).safeParse({
      firstName: 'يوسف',
      lastName: 'بن خالد',
      birthDate: '2022-01-15',
      gender: 'male',
      status: 'active'
    })
    expect(r.success).toBe(true)
  })
  it('validates children:list applies default limit and offset', () => {
    const r = (ipcContract['children:list'].input as any).parse({})
    expect(r.limit).toBe(50)
    expect(r.offset).toBe(0)
    expect(r.search).toBe('')
  })
  it('validates classrooms:list accepts empty payload', () => {
    const r = (ipcContract['classrooms:list'].input as any).safeParse(undefined)
    expect(r.success).toBe(true)
  })
  it('validates window control channels accept empty payload', () => {
    expect((ipcContract['window:minimize'].input as any).safeParse(undefined).success).toBe(true)
    expect((ipcContract['window:maximize'].input as any).safeParse(undefined).success).toBe(true)
    expect((ipcContract['window:close'].input as any).safeParse(undefined).success).toBe(true)
    expect((ipcContract['window:isMaximized'].input as any).safeParse(undefined).success).toBe(true)
  })
  it('validates system printer and path channels', () => {
    expect((ipcContract['system:getPrinters'].input as any).safeParse(undefined).success).toBe(true)
    expect((ipcContract['system:selectDirectory'].input as any).safeParse(undefined).success).toBe(true)
    expect((ipcContract['system:openPath'].input as any).safeParse({ path: '/tmp/db.sqlite' }).success).toBe(true)
    expect((ipcContract['system:openPath'].input as any).safeParse({}).success).toBe(false)
  })
  it('validates invoices:createAndIssue requires valid childId, dueDate, and items', () => {
    const valid = (ipcContract['invoices:createAndIssue'].input as any).safeParse({
      childId: '0192994f-1234-7000-8000-000000000001',
      dueDate: '2026-10-16',
      period: '2026-10',
      items: [{ label: 'رسوم تمدرس', unitCents: 2000000, quantity: 1 }]
    })
    expect(valid.success).toBe(true)

    const invalid = (ipcContract['invoices:createAndIssue'].input as any).safeParse({
      childId: 'not-a-uuid',
      dueDate: 'bad-date',
      items: []
    })
    expect(invalid.success).toBe(false)
  })
  it('validates payments:record requires valid invoiceId and positive amount', () => {
    const valid = (ipcContract['payments:record'].input as any).safeParse({
      invoiceId: '0192994f-1234-7000-8000-000000000001',
      amountCents: 2000000,
      method: 'cash'
    })
    expect(valid.success).toBe(true)

    const invalidAmount = (ipcContract['payments:record'].input as any).safeParse({
      invoiceId: '0192994f-1234-7000-8000-000000000001',
      amountCents: 0,
      method: 'cash'
    })
    expect(invalidAmount.success).toBe(false)
  })
  it('validates children:createPickup requires childId and fullName', () => {
    const valid = (ipcContract['children:createPickup'].input as any).safeParse({
      childId: '0192994f-1234-7000-8000-000000000001',
      fullName: 'صالح بن محمد المنصور',
      phone: '0555123456',
      nationalId: '1234567890',
      note: 'العم - مخوّل أيام الخميس'
    })
    expect(valid.success).toBe(true)

    const invalidNoName = (ipcContract['children:createPickup'].input as any).safeParse({
      childId: '0192994f-1234-7000-8000-000000000001',
      fullName: ''
    })
    expect(invalidNoName.success).toBe(false)

    const invalidBadChildId = (ipcContract['children:createPickup'].input as any).safeParse({
      childId: 'not-a-uuid',
      fullName: 'صالح المنصور'
    })
    expect(invalidBadChildId.success).toBe(false)
  })
  it('validates settings:set requires key and string value', () => {
    const valid = (ipcContract['settings:set'].input as any).safeParse({
      key: 'branch.kindergartenNameAr',
      value: 'روضتي'
    })
    expect(valid.success).toBe(true)

    const invalid = (ipcContract['settings:set'].input as any).safeParse({
      key: 'branch.kindergartenNameAr'
    })
    expect(invalid.success).toBe(false)
  })
  it('validates invoices:list accepts empty filter with defaults', () => {
    const valid = (ipcContract['invoices:list'].input as any).parse({})
    expect(valid.status).toBe('all')
    expect(valid.limit).toBe(50)
    expect(valid.offset).toBe(0)
  })
  it('validates invoices:generateMonthly requires period, dueDate, label, and unitCents', () => {
    const valid = (ipcContract['invoices:generateMonthly'].input as any).safeParse({
      period: '2026-10',
      dueDate: '2026-10-31',
      label: 'رسوم شهر أكتوبر 2026',
      unitCents: 1500000
    })
    expect(valid.success).toBe(true)

    const invalid = (ipcContract['invoices:generateMonthly'].input as any).safeParse({
      period: '2026/10',
      dueDate: 'bad-date',
      label: '',
      unitCents: 0
    })
    expect(invalid.success).toBe(false)
  })
  it('validates daily:save requires valid childId, date, and accepts items and mood', () => {
    const valid = (ipcContract['daily:save'].input as any).safeParse({
      childId: '0192994f-1234-7000-8000-000000000001',
      date: '2026-10-16',
      mood: 'happy',
      summary: 'يوم رائع ومشاركة ممتازة في الأنشطة',
      items: [
        { category: 'breakfast', value: 'full', note: 'أكل وجبته كاملة' },
        { category: 'nap', value: 'good_sleep', note: 'نام لمدة ساعة' }
      ]
    })
    expect(valid.success).toBe(true)

    const invalid = (ipcContract['daily:save'].input as any).safeParse({
      childId: 'invalid-uuid',
      date: 'bad-date'
    })
    expect(invalid.success).toBe(false)
  })
  it('validates health:recordClinicVisit requires childId, detail, and valid recordedOn', () => {
    const valid = (ipcContract['health:recordClinicVisit'].input as any).safeParse({
      childId: '0192994f-1234-7000-8000-000000000001',
      detail: 'فحص حرارة دوري 37.1 - الحالة مستقرة',
      recordedOn: '2026-10-16'
    })
    expect(valid.success).toBe(true)

    const invalid = (ipcContract['health:recordClinicVisit'].input as any).safeParse({
      childId: 'not-a-uuid',
      detail: '',
      recordedOn: 'bad-date'
    })
    expect(invalid.success).toBe(false)
  })
  it('validates health:recordIncident requires childId, happenedAt, and description', () => {
    const valid = (ipcContract['health:recordIncident'].input as any).safeParse({
      childId: '0192994f-1234-7000-8000-000000000001',
      happenedAt: '2026-10-16 10:30',
      description: 'كدمة خفيفة في الركبة أثناء اللعب في الفناء الخارجي',
      actionTaken: 'تطهير الموضع ووضع كمادة باردة ومتابعة الحالة',
      notifiedGuardian: true
    })
    expect(valid.success).toBe(true)
  })
  it('validates health:recordMedication requires childId, medicine, and givenAt', () => {
    const valid = (ipcContract['health:recordMedication'].input as any).safeParse({
      childId: '0192994f-1234-7000-8000-000000000001',
      medicine: 'فينتولين بخاخ',
      dose: 'بختين',
      givenAt: '2026-10-16 11:00',
      givenBy: 'ممرضة الروضة'
    })
    expect(valid.success).toBe(true)
  })
  it('validates staff:create requires firstName, lastName, role', () => {
    const valid = (ipcContract['staff:create'].input as any).safeParse({
      firstName: 'نورة',
      lastName: 'العتيبي',
      role: 'معلمة رياض أطفال',
      phone: '0555987654',
      salaryCents: 600000,
      hiredAt: '2024-09-01',
      isActive: true
    })
    expect(valid.success).toBe(true)

    const invalid = (ipcContract['staff:create'].input as any).safeParse({
      firstName: 'ن',
      lastName: '',
      role: ''
    })
    expect(invalid.success).toBe(false)
  })
  it('validates staff:attendance:record requires staffId, date, and valid status', () => {
    const valid = (ipcContract['staff:attendance:record'].input as any).safeParse({
      staffId: '0192994f-1234-7000-8000-000000000001',
      date: '2026-10-16',
      status: 'present',
      note: 'حضور مبكر'
    })
    expect(valid.success).toBe(true)

    const invalid = (ipcContract['staff:attendance:record'].input as any).safeParse({
      staffId: 'not-uuid',
      date: 'bad-date',
      status: 'unknown_status'
    })
    expect(invalid.success).toBe(false)
  })
  it('validates staff:leaves:create requires staffId, fromDate, and toDate', () => {
    const valid = (ipcContract['staff:leaves:create'].input as any).safeParse({
      staffId: '0192994f-1234-7000-8000-000000000001',
      fromDate: '2026-10-20',
      toDate: '2026-10-22',
      reason: 'إجازة اضطرارية',
      status: 'approved'
    })
    expect(valid.success).toBe(true)
  })
  it('validates guardians:list and guardians:allPickups accept undefined input', () => {
    expect((ipcContract['guardians:list'].input as any).safeParse(undefined).success).toBe(true)
    expect((ipcContract['guardians:allPickups'].input as any).safeParse(undefined).success).toBe(true)
  })
  it('validates children:removePickup requires valid UUID', () => {
    expect((ipcContract['children:removePickup'].input as any).safeParse({ id: '0192994f-1234-7000-8000-000000000001' }).success).toBe(true)
    expect((ipcContract['children:removePickup'].input as any).safeParse({ id: 'invalid-id' }).success).toBe(false)
  })
})





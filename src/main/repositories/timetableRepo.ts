import { getDb, getSqlite } from '../db/client'
import { timetablePeriods, staffDuties } from '../db/schema/timetable'
import { eq, and, asc, isNull, or } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { TimetablePeriodInput, StaffDutyInput } from '@shared/schemas/timetable'

const DEFAULT_PERIODS: Omit<TimetablePeriodInput, 'id'>[] = [
  {
    periodNumber: 1,
    title: 'الاستقبال والتجمع الصباحي',
    category: 'arrival',
    startTime: '07:30',
    endTime: '08:15',
    color: '#0284c7',
    icon: 'meeting_room',
    notes: 'فحص بصري سريع، استلام آمن، أذكار الصباح وتمارين الإحماء',
    isActive: true
  },
  {
    periodNumber: 2,
    title: 'طابور الصباح والنشيد الوطني',
    category: 'assembly',
    startTime: '08:15',
    endTime: '08:45',
    color: '#059669',
    icon: 'flag',
    notes: 'تحية العلم والتمارين الرياضية الصباحية والأناشيد الترحيبية',
    isActive: true
  },
  {
    periodNumber: 3,
    title: 'حلقة التعلم الأولى (لغة/أرقام)',
    category: 'circle',
    startTime: '08:45',
    endTime: '09:30',
    color: '#2563eb',
    icon: 'menu_book',
    notes: 'الحروف الهجائية، سور قصيرة من القرآن الكريم، والمفاهيم الرقمية',
    isActive: true
  },
  {
    periodNumber: 4,
    title: 'وجبة الإفطار الصحية وآداب الطعام',
    category: 'meal',
    startTime: '09:30',
    endTime: '10:15',
    color: '#d97706',
    icon: 'restaurant',
    notes: 'غسل اليدين، دعاء الطعام، وتناول الوجبة الصحية باستقلالية',
    isActive: true
  },
  {
    periodNumber: 5,
    title: 'الأركان التعليمية واللعب الموجه',
    category: 'play',
    startTime: '10:15',
    endTime: '11:00',
    color: '#7c3aed',
    icon: 'extension',
    notes: 'ركن البناء والتركيب، الركن الفني، ركن التعبير والتمثيل، وركن القراءة',
    isActive: true
  },
  {
    periodNumber: 6,
    title: 'اللعب الخارجي والأنشطة الحركية',
    category: 'outdoor',
    startTime: '11:00',
    endTime: '11:45',
    color: '#16a34a',
    icon: 'sports_soccer',
    notes: 'الملعب الرملي، المراجيح، ألعاب التوازن واللياقة في الهواء الطلق',
    isActive: true
  },
  {
    periodNumber: 7,
    title: 'حلقة التعلم الثانية (استكشاف/قصة)',
    category: 'circle',
    startTime: '11:45',
    endTime: '12:30',
    color: '#0891b2',
    icon: 'psychology',
    notes: 'تجارب العلوم البسيطة، قصص السلوك الإيجابي، واللغة الإنجليزية التفاعلية',
    isActive: true
  },
  {
    periodNumber: 8,
    title: 'اللقاء الختامي ومراجعة اليوم',
    category: 'closing',
    startTime: '12:30',
    endTime: '13:15',
    color: '#db2777',
    icon: 'auto_stories',
    notes: 'استذكار ما تم تعلمه، تجهيز الحقائب وترتيب الفصل، نشيد الوداع',
    isActive: true
  },
  {
    periodNumber: 9,
    title: 'الانصراف والاستلام الآمن عند البوابة',
    category: 'pickup',
    startTime: '13:15',
    endTime: '14:00',
    color: '#dc2626',
    icon: 'sensor_door',
    notes: 'مطابقة بطاقات الاستلام المشفرة وتسليم الأطفال للمخولين رسمياً',
    isActive: true
  }
]

export const timetableRepo = {
  ensureTablesAndSeed() {
    const sqlite = getSqlite()
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS timetable_periods (
        id TEXT PRIMARY KEY,
        classroom_id TEXT,
        period_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'circle',
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT '#0284c7',
        icon TEXT NOT NULL DEFAULT 'schedule',
        supervisor_staff_id TEXT,
        supervisor_staff_name TEXT,
        notes TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS staff_duties (
        id TEXT PRIMARY KEY,
        staff_id TEXT NOT NULL,
        staff_name TEXT,
        duty_location TEXT NOT NULL,
        day_of_week INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        notes TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
        deleted_at INTEGER
      );
    `)

    // Check if default periods exist
    const countRow = sqlite.prepare('SELECT count(*) as count FROM timetable_periods').get() as { count: number }
    if (countRow.count === 0) {
      const insertStmt = sqlite.prepare(`
        INSERT INTO timetable_periods (
          id, classroom_id, period_number, title, category, start_time, end_time, color, icon, notes, is_active
        ) VALUES (
          @id, @classroomId, @periodNumber, @title, @category, @startTime, @endTime, @color, @icon, @notes, 1
        )
      `)

      for (const p of DEFAULT_PERIODS) {
        insertStmt.run({
          id: randomUUID(),
          classroomId: null,
          periodNumber: p.periodNumber,
          title: p.title,
          category: p.category,
          startTime: p.startTime,
          endTime: p.endTime,
          color: p.color,
          icon: p.icon,
          notes: p.notes
        })
      }
    }
  },

  listPeriods(classroomId?: string | null) {
    this.ensureTablesAndSeed()
    const db = getDb() as any

    let rows: any[]
    if (classroomId) {
      // Custom class periods or general
      rows = db
        .select()
        .from(timetablePeriods)
        .where(
          and(
            eq(timetablePeriods.isActive, true),
            or(eq(timetablePeriods.classroomId, classroomId), isNull(timetablePeriods.classroomId))
          )
        )
        .orderBy(asc(timetablePeriods.periodNumber), asc(timetablePeriods.startTime))
        .all()
    } else {
      // General master schedule
      rows = db
        .select()
        .from(timetablePeriods)
        .where(and(eq(timetablePeriods.isActive, true), isNull(timetablePeriods.classroomId)))
        .orderBy(asc(timetablePeriods.periodNumber), asc(timetablePeriods.startTime))
        .all()
    }

    return rows.map((r: any) => ({
      id: r.id,
      classroomId: r.classroomId,
      periodNumber: r.periodNumber,
      title: r.title,
      category: r.category,
      startTime: r.startTime,
      endTime: r.endTime,
      color: r.color,
      icon: r.icon,
      supervisorStaffId: r.supervisorStaffId,
      supervisorStaffName: r.supervisorStaffName,
      notes: r.notes,
      isActive: Boolean(r.isActive)
    }))
  },

  savePeriod(input: TimetablePeriodInput) {
    this.ensureTablesAndSeed()
    const db = getDb() as any
    const periodId = input.id || randomUUID()

    const values = {
      id: periodId,
      classroomId: input.classroomId || null,
      periodNumber: input.periodNumber,
      title: input.title,
      category: input.category,
      startTime: input.startTime,
      endTime: input.endTime,
      color: input.color || '#0284c7',
      icon: input.icon || 'schedule',
      supervisorStaffId: input.supervisorStaffId || null,
      supervisorStaffName: input.supervisorStaffName || null,
      notes: input.notes || null,
      isActive: input.isActive ?? true,
      updatedAt: new Date()
    }

    if (input.id) {
      db.update(timetablePeriods)
        .set(values)
        .where(eq(timetablePeriods.id, input.id))
        .run()
    } else {
      db.insert(timetablePeriods)
        .values({
          ...values,
          createdAt: new Date()
        })
        .run()
    }

    return values
  },

  deletePeriod(id: string) {
    this.ensureTablesAndSeed()
    const db = getDb() as any
    db.delete(timetablePeriods).where(eq(timetablePeriods.id, id)).run()
    return true
  },

  listStaffDuties(dayOfWeek?: number) {
    this.ensureTablesAndSeed()
    const db = getDb() as any

    let rows: any[]
    if (dayOfWeek !== undefined) {
      rows = db
        .select()
        .from(staffDuties)
        .where(eq(staffDuties.dayOfWeek, dayOfWeek))
        .orderBy(asc(staffDuties.startTime))
        .all()
    } else {
      rows = db.select().from(staffDuties).orderBy(asc(staffDuties.dayOfWeek), asc(staffDuties.startTime)).all()
    }

    return rows.map((r: any) => ({
      id: r.id,
      staffId: r.staffId,
      staffName: r.staffName,
      dutyLocation: r.dutyLocation,
      dayOfWeek: r.dayOfWeek,
      startTime: r.startTime,
      endTime: r.endTime,
      notes: r.notes
    }))
  },

  saveStaffDuty(input: StaffDutyInput) {
    this.ensureTablesAndSeed()
    const db = getDb() as any
    const dutyId = input.id || randomUUID()

    const values = {
      id: dutyId,
      staffId: input.staffId,
      staffName: input.staffName || null,
      dutyLocation: input.dutyLocation,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      notes: input.notes || null,
      updatedAt: new Date()
    }

    if (input.id) {
      db.update(staffDuties)
        .set(values)
        .where(eq(staffDuties.id, input.id))
        .run()
    } else {
      db.insert(staffDuties)
        .values({
          ...values,
          createdAt: new Date()
        })
        .run()
    }

    return values
  },

  deleteStaffDuty(id: string) {
    this.ensureTablesAndSeed()
    const db = getDb() as any
    db.delete(staffDuties).where(eq(staffDuties.id, id)).run()
    return true
  }
}

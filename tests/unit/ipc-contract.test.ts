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
})


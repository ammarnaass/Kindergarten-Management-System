import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@shared/schemas/auth'
import { ipc } from '../../lib/ipc'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { AppLogo } from '../../app/components/AppLogo'

export default function Login() {
  const { t } = useTranslation()
  const nav = useNavigate()
  const [err, setErr] = useState('')
  const { register, handleSubmit } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  return (
    <div className="min-h-screen grid place-items-center bg-surface select-none">
      <form
        className="w-96 space-y-5 rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-xl"
        onSubmit={handleSubmit(async (v) => {
          try { await ipc('auth:login', v); nav('/dashboard') }
          catch (e: any) { setErr(e.message ?? 'خطأ في المصادقة') }
        })}>
        <div className="flex flex-col items-center justify-center pb-2 text-center">
          <AppLogo size="lg" subtitle="نظام إدارة الروضة المكتبي" className="flex-col items-center gap-2" />
        </div>
        <div><label>{t('username')}</label><input className="w-full rounded border p-2" {...register('username')} /></div>
        <div><label>{t('password')}</label><input type="password" className="w-full rounded border p-2" {...register('password')} /></div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full rounded-xl bg-primary p-2 text-white">{t('login')}</button>
        <p className="text-xs text-muted-foreground">admin / admin123 (بذرة التطوير)</p>
      </form>
    </div>
  )
}

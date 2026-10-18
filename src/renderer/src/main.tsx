import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { DisplayZoomProvider } from './app/providers/DisplayZoomProvider'
import { ToastProvider } from './components/ui/toast'
import './styles/globals.css'
import './i18n'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <ThemeProvider>
        <DisplayZoomProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </DisplayZoomProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)


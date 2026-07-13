'use client'
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(message)
    timerRef.current = setTimeout(() => setToast(null), 2200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-24 lg:bottom-8 left-0 right-0 z-[200] px-4 flex justify-center pointer-events-none">
          <div
            className="bg-[#101214] text-white text-sm font-semibold pl-4 pr-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 pointer-events-auto toast-pop"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#B7FF1E' }} strokeWidth={2.25} />
            {toast}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
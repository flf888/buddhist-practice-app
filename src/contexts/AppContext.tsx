import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type TabType = 'home' | 'practice' | 'sutra' | 'festival' | 'profile' | 'chant' | 'baichan'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface AppContextType {
  // 导航
  activeTab: TabType
  navigate: (tab: TabType) => void
  goHome: () => void
  
  // 早课/晚课进度同步
  completedSteps: string[]
  courseType: 'morning' | 'evening'
  setCourseType: (type: 'morning' | 'evening') => void
  markStepComplete: (stepId: string) => void
  markStepIncomplete: (stepId: string) => void
  resetCourseProgress: () => void
  
  // 提醒状态
  showReminder: boolean
  setShowReminder: (show: boolean) => void
  
  // Toast 提示
  toasts: Toast[]
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  dismissToast: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const hour = new Date().getHours()
const isMorning = hour >= 5 && hour < 12

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [courseType, setCourseType] = useState<'morning' | 'evening'>(isMorning ? 'morning' : 'evening')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [showReminder, setShowReminder] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])

  const navigate = useCallback((tab: TabType) => {
    setActiveTab(tab)
  }, [])

  const goHome = useCallback(() => {
    setActiveTab('home')
  }, [])

  const markStepComplete = useCallback((stepId: string) => {
    setCompletedSteps(prev => {
      if (prev.includes(stepId)) return prev
      return [...prev, stepId]
    })
  }, [])

  const markStepIncomplete = useCallback((stepId: string) => {
    setCompletedSteps(prev => prev.filter(id => id !== stepId))
  }, [])

  const resetCourseProgress = useCallback(() => {
    setCompletedSteps([])
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts(prev => [...prev, { id, message, type }])
    
    // 3秒后自动消失
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const value: AppContextType = {
    activeTab,
    navigate,
    goHome,
    courseType,
    setCourseType,
    completedSteps,
    markStepComplete,
    markStepIncomplete,
    resetCourseProgress,
    showReminder,
    setShowReminder,
    toasts,
    showToast,
    dismissToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

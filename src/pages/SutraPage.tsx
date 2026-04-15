import { useState, useEffect } from 'react'
import { BookOpen, Flame, Loader2 } from 'lucide-react'
import SmartCountdown from '../components/SmartCountdown'
import type { PracticeTemplate } from '../components/SmartCountdown'
import { templateApi, recordsApi, storage } from '../services/api'
import { useApp } from '../contexts/AppContext'

export default function SutraPage() {
  const { navigate } = useApp()
  const [smartTemplates, setSmartTemplates] = useState<PracticeTemplate[]>([])
  const [completedToday, setCompletedToday] = useState(0)
  const [completedWeek, setCompletedWeek] = useState(0)
  const [completedTotal, setCompletedTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const templateData = await templateApi.getTemplatesByType('nianjing')

      const colors = ['#7c3aed', '#ea580c', '#475569', '#059669']
      const bgColors = ['from-purple-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-slate-600 to-gray-700', 'from-emerald-500 to-teal-600']

      const convertedTemplates: PracticeTemplate[] = templateData.map((t, idx) => ({
        id: `template-${t.id}`,
        name: t.name,
        subtitle: t.voiceGuide || '诵经修行',
        quantity: t.quantity,
        unit: t.unit,
        durationSeconds: t.durationSeconds,
        audioGuide: t.voiceGuide || '开始诵经',
        color: colors[idx % colors.length],
        bgColor: bgColors[idx % bgColors.length],
        templateId: t.id,
      }))

      setSmartTemplates(convertedTemplates)

      // 用户数据需要登录
      const token = storage.getToken()
      if (token) {
        try {
          const [statsData, weeklyData] = await Promise.all([
            recordsApi.getStats(),
            recordsApi.getWeekly()
          ])
          setCompletedTotal(statsData.totalNianjing)
          const today = new Date().toISOString().split('T')[0]
          const todayData = weeklyData.dailyData.find(d => d.date === today)
          setCompletedToday(todayData ? Math.floor(todayData.totalExp / 50) : 0)
          setCompletedWeek(Math.floor(weeklyData.weekTotal / 50))
        } catch { /* 不影响模板显示 */ }
      }
    } catch (err) {
      console.error('加载数据失败:', err)
      setSmartTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (template: PracticeTemplate) => {
    const token = storage.getToken()
    if (!token || !template.templateId) return

    try {
      await recordsApi.createRecord({
        templateId: template.templateId,
        practiceType: 'nianjing',
        practiceName: template.name,
        quantity: template.quantity,
        unit: template.unit,
        durationSeconds: template.durationSeconds,
        practiceMode: 'smart',
        sessionType: 'general',
      })

      setCompletedToday((prev) => prev + template.quantity)
      setCompletedWeek((prev) => prev + template.quantity)
      setCompletedTotal((prev) => prev + template.quantity)
    } catch (err) {
      console.error('保存记录失败:', err)
    }
  }

  // 未登录时显示引导
  if (!storage.getToken()) {
    return (
      <div className="px-4 py-4 space-y-4">
        {/* 头部 */}
        <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-1">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-bold">诵经修行</h1>
          </div>
          <p className="text-sm opacity-90">持诵经典 · 智慧增长</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">请先登录</h3>
            <p className="text-sm text-gray-500">登录后可记录诵经数据，开启智能功课</p>
          </div>
          <button
            onClick={() => navigate('profile')}
            className="w-full py-4 bg-gradient-to-r from-[#8b2323] to-[#a83232] text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            去登录
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#8b2323]" />
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* 头部 */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-6 h-6" />
          <h1 className="text-xl font-bold">诵经修行</h1>
        </div>
        <p className="text-sm opacity-90">持诵经典 · 智慧增长</p>
      </div>

      {/* 智能功课模式 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">智能功课模式</span>
        </div>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          选择诵经功课 → 点击开始 → 自动倒计时 → 时间到即完成1部
        </p>
        {smartTemplates.length > 0 ? (
          <SmartCountdown
            templates={smartTemplates}
            onComplete={handleComplete}
            practiceType="sutra"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>暂无诵经模板</p>
          </div>
        )}
      </div>

      {/* 统计 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" />
          诵经统计
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <p className="text-2xl font-bold text-amber-600">{completedToday}</p>
            <p className="text-xs text-gray-500">今日部数</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">{completedWeek}</p>
            <p className="text-xs text-gray-500">本周部数</p>
          </div>
          <div className="text-center p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#5c4033]">{completedTotal}</p>
            <p className="text-xs text-gray-500">累计总数</p>
          </div>
        </div>
      </div>
    </div>
  )
}

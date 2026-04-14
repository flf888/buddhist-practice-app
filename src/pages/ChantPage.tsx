import { useState, useEffect } from 'react'
import { Sparkles, Flame, Loader2 } from 'lucide-react'
import SmartCountdown from '../components/SmartCountdown'
import type { PracticeTemplate } from '../components/SmartCountdown'
import { templateApi, recordsApi, storage } from '../services/api'

export default function ChantPage() {
  const [templates, setTemplates] = useState<PracticeTemplate[]>([])
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
      const [templateData, statsData, weeklyData] = await Promise.all([
        templateApi.getTemplatesByType('nianzhou'),
        recordsApi.getStats(),
        recordsApi.getWeekly()
      ])

      // 转换模板数据
      const colors = ['#7c3aed', '#8b5cf6', '#db2777', '#059669', '#2563eb']
      const bgColors = ['from-purple-600 to-violet-600', 'from-purple-500 to-pink-500', 'from-pink-600 to-rose-600', 'from-emerald-600 to-teal-600', 'from-blue-600 to-indigo-600']

      const convertedTemplates: PracticeTemplate[] = templateData.map((t, idx) => ({
        id: `template-${t.id}`,
        name: t.name,
        subtitle: t.voiceGuide || '持咒修行',
        quantity: t.quantity,
        unit: t.unit,
        durationSeconds: t.durationSeconds,
        audioGuide: t.voiceGuide || '开始持咒',
        color: colors[idx % colors.length],
        bgColor: bgColors[idx % bgColors.length],
        templateId: t.id,
      }))

      setTemplates(convertedTemplates)
      setCompletedTotal(statsData.totalNianzhou)

      // 计算今日持咒经验
      const today = new Date().toISOString().split('T')[0]
      const todayData = weeklyData.dailyData.find(d => d.date === today)
      // 持咒1遍=2经验
      setCompletedToday(todayData ? Math.floor(todayData.totalExp * 0.5) : 0)
      setCompletedWeek(Math.floor(weeklyData.weekTotal * 0.5))
    } catch (err) {
      console.error('加载数据失败:', err)
      setTemplates([])
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
        practiceType: 'nianzhou',
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
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-xl font-bold">持咒修行</h1>
        </div>
        <p className="text-sm opacity-90">持咒精进，消除业障</p>
      </div>

      {/* 智能功课计数 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">智能功课模式</span>
        </div>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          选择咒语模板 → 点击开始 → 自动倒计时 → 时间到即完成对应遍数
        </p>
        {templates.length > 0 ? (
          <SmartCountdown
            templates={templates}
            onComplete={handleComplete}
            practiceType="chant"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>请先登录后使用修行功能</p>
          </div>
        )}
      </div>

      {/* 今日统计 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Flame className="w-5 h-5 text-purple-500" />
          今日持咒统计
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-purple-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">{completedToday}</p>
            <p className="text-xs text-gray-500">今日遍数</p>
          </div>
          <div className="text-center p-3 bg-pink-50 rounded-xl">
            <p className="text-2xl font-bold text-pink-600">{completedWeek}</p>
            <p className="text-xs text-gray-500">本周遍数</p>
          </div>
          <div className="text-center p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#5c4033]">{completedTotal}</p>
            <p className="text-xs text-gray-500">累计总数</p>
          </div>
        </div>
      </div>

      {/* 持咒提示 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
        <h3 className="font-semibold text-purple-800 mb-2">持咒要诀</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>· 咒心念清楚，字字不漏</li>
          <li>· 口诵、耳听、心记三业相应</li>
          <li>· 咒力不可思议，诚心即灵</li>
        </ul>
      </div>
    </div>
  )
}

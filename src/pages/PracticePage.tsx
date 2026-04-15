import { useState, useEffect } from 'react'
import { Repeat, Flame, Loader2 } from 'lucide-react'
import SmartCountdown from '../components/SmartCountdown'
import type { PracticeTemplate } from '../components/SmartCountdown'
import { templateApi, recordsApi, storage } from '../services/api'
import { useApp } from '../contexts/AppContext'

export default function PracticePage() {
  const { navigate } = useApp()
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
      // 模板加载不需要登录
      const templateData = await templateApi.getTemplatesByType('nianfo')

      const colors = ['#d97706', '#dc2626', '#9333ea', '#059669', '#2563eb']
      const bgColors = ['from-amber-500 to-orange-500', 'from-red-500 to-rose-600', 'from-purple-600 to-pink-600', 'from-emerald-500 to-teal-600', 'from-blue-500 to-indigo-600']

      const convertedTemplates: PracticeTemplate[] = templateData.map((t, idx) => ({
        id: `template-${t.id}`,
        name: t.name,
        subtitle: t.voiceGuide || '南无阿弥陀佛',
        quantity: t.quantity,
        unit: t.unit,
        durationSeconds: t.durationSeconds,
        audioGuide: t.voiceGuide || '开始念佛，净念相继',
        color: colors[idx % colors.length],
        bgColor: bgColors[idx % bgColors.length],
        templateId: t.id,
      }))

      setTemplates(convertedTemplates)

      // 用户数据需要登录，分开处理
      const token = storage.getToken()
      if (token) {
        try {
          const [statsData, weeklyData] = await Promise.all([
            recordsApi.getStats(),
            recordsApi.getWeekly()
          ])
          setCompletedTotal(statsData.totalNianfo)
          setCompletedWeek(weeklyData.weekTotal)
          const today = new Date().toISOString().split('T')[0]
          const todayData = weeklyData.dailyData.find(d => d.date === today)
          setCompletedToday(todayData?.totalExp || 0)
        } catch {
          // 用户数据加载失败不影响模板显示
        }
      }
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
        practiceType: 'nianfo',
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
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-1">
          <Repeat className="w-6 h-6" />
          <h1 className="text-xl font-bold">念佛修行</h1>
        </div>
        <p className="text-sm opacity-90">净念相继，心不散乱</p>
      </div>

      {/* 未登录时显示引导 */}
      {!storage.getToken() ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 mx-auto flex items-center justify-center">
            <Repeat className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">请先登录</h3>
            <p className="text-sm text-gray-500">登录后可记录念佛数据，开启智能功课</p>
          </div>
          <button
            onClick={() => navigate('profile')}
            className="w-full py-4 bg-gradient-to-r from-[#8b2323] to-[#a83232] text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            去登录
          </button>
        </div>
      ) : (
        <>
          {/* 智能功课计数 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-600 font-medium">智能功课模式</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              选择功课模板 → 点击开始 → 自动倒计时 → 时间到即完成对应遍数
            </p>
            {templates.length > 0 ? (
              <SmartCountdown
                templates={templates}
                onComplete={handleComplete}
                practiceType="practice"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>暂无念佛模板</p>
              </div>
            )}
          </div>

          {/* 今日统计 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              今日念佛统计
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-amber-50 rounded-xl">
                <p className="text-2xl font-bold text-amber-600">{completedToday}</p>
                <p className="text-xs text-gray-500">今日经验</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-xl">
                <p className="text-2xl font-bold text-orange-600">{completedWeek}</p>
                <p className="text-xs text-gray-500">本周经验</p>
              </div>
              <div className="text-center p-3 bg-[#faf8f5] rounded-xl">
                <p className="text-2xl font-bold text-[#5c4033]">{(completedTotal / 10000).toFixed(1)}万</p>
                <p className="text-xs text-gray-500">念佛总数</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 修行提示 */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
        <h3 className="font-semibold text-amber-800 mb-2">念佛要诀</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>· 专心一意，摄心不散</li>
          <li>· 念清楚、听清楚、记清楚</li>
          <li>· 持之以恒，日日不断</li>
        </ul>
      </div>
    </div>
  )
}

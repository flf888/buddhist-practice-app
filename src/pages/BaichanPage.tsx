import { useState, useEffect } from 'react'
import { Heart, Flame, Calendar, Check, Loader2 } from 'lucide-react'
import SmartCountdown from '../components/SmartCountdown'
import type { PracticeTemplate } from '../components/SmartCountdown'
import { templateApi, recordsApi, storage } from '../services/api'

export default function BaichanPage() {
  const [templates, setTemplates] = useState<PracticeTemplate[]>([])
  const [completedToday, setCompletedToday] = useState(0)
  const [completedWeek, setCompletedWeek] = useState(0)
  const [completedTotal, setCompletedTotal] = useState(0)
  const [recentSessions, setRecentSessions] = useState<{ name: string; date: string; cycles: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [templateData, statsData, weeklyData, recordsData] = await Promise.all([
        templateApi.getTemplatesByType('baichan'),
        recordsApi.getStats(),
        recordsApi.getWeekly(),
        recordsApi.getRecords({ limit: 5, type: 'baichan' })
      ])

      // 转换模板数据
      const colors = ['#d97706', '#ea580c', '#dc2626', '#16a34a', '#7c3aed']
      const bgColors = ['from-amber-500 to-orange-500', 'from-orange-500 to-red-500', 'from-red-500 to-rose-600', 'from-green-600 to-emerald-600', 'from-purple-600 to-pink-600']

      const convertedTemplates: PracticeTemplate[] = templateData.map((t, idx) => ({
        id: `template-${t.id}`,
        name: t.name,
        subtitle: t.voiceGuide || '礼佛修行',
        quantity: t.quantity,
        unit: t.unit,
        durationSeconds: t.durationSeconds,
        audioGuide: t.voiceGuide || '开始礼佛',
        color: colors[idx % colors.length],
        bgColor: bgColors[idx % bgColors.length],
        templateId: t.id,
      }))

      setTemplates(convertedTemplates)
      setCompletedTotal(statsData.totalBaichan)

      // 计算今日拜数（1拜=5经验）
      const today = new Date().toISOString().split('T')[0]
      const todayData = weeklyData.dailyData.find(d => d.date === today)
      setCompletedToday(todayData ? Math.floor(todayData.totalExp / 5) : 0)
      setCompletedWeek(Math.floor(weeklyData.weekTotal / 5))

      // 转换最近记录
      const sessions = recordsData.records.slice(0, 3).map(r => ({
        name: r.practiceName,
        date: r.practiceDate.slice(5).replace('-', '-'),
        cycles: r.quantity
      }))
      setRecentSessions(sessions)
    } catch (err) {
      console.error('加载数据失败:', err)
      setTemplates([])
      setRecentSessions([
        { name: '清明节超度', date: '04-05', cycles: 7 },
        { name: '观音诞辰祈福', date: '03-19', cycles: 3 },
        { name: '消灾法会', date: '03-15', cycles: 21 },
      ])
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
        practiceType: 'baichan',
        practiceName: template.name,
        quantity: template.quantity,
        unit: template.unit,
        durationSeconds: template.durationSeconds,
        practiceMode: 'smart',
        sessionType: 'general',
      })

      setCompletedToday((prev) => prev + template.quantity)
      setCompletedWeek((prev) => prev + template.quantity)
      setCompletedTotal((prev) => prev + 1)

      // 刷新最近记录
      const recordsData = await recordsApi.getRecords({ limit: 5, type: 'baichan' })
      const sessions = recordsData.records.slice(0, 3).map(r => ({
        name: r.practiceName,
        date: r.practiceDate.slice(5).replace('-', '-'),
        cycles: r.quantity
      }))
      setRecentSessions(sessions)
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
      <div className="bg-gradient-to-br from-[#8b2323] to-[#a83232] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-1">
          <Heart className="w-6 h-6" />
          <h1 className="text-xl font-bold">拜忏修行</h1>
        </div>
        <p className="text-sm opacity-90">至诚忏悔，消业增福</p>
      </div>

      {/* 智能功课计数 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">智能功课模式</span>
        </div>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          选择拜忏模板 → 点击开始 → 自动倒计时 → 时间到即完成对应拜数
        </p>
        {templates.length > 0 ? (
          <SmartCountdown
            templates={templates}
            onComplete={handleComplete}
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
          <Flame className="w-5 h-5 text-[#8b2323]" />
          拜忏统计
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-red-50 rounded-xl">
            <p className="text-2xl font-bold text-red-600">{completedToday}</p>
            <p className="text-xs text-gray-500">今日拜数</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">{completedWeek}</p>
            <p className="text-xs text-gray-500">本周拜数</p>
          </div>
          <div className="text-center p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#5c4033]">{completedTotal}</p>
            <p className="text-xs text-gray-500">累计次数</p>
          </div>
        </div>
      </div>

      {/* 最近记录 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          最近拜忏记录
        </h3>
        <div className="space-y-3">
          {recentSessions.map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#faf8f5] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{session.name}</h4>
                  <p className="text-xs text-gray-500">{session.date} · 完成{session.cycles}拜</p>
                </div>
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">已完成</span>
            </div>
          ))}
        </div>
      </div>

      {/* 拜忏须知 */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-2">拜忏须知</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>· 保持身心清净，虔诚忏悔</li>
          <li>· 配合诵经效果更佳</li>
          <li>· 建议清晨或傍晚进行</li>
          <li>· 完成后记得回向功德</li>
        </ul>
      </div>
    </div>
  )
}

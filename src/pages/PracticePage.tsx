import { useState } from 'react'
import { Repeat, Flame } from 'lucide-react'
import SmartCountdown from '../components/SmartCountdown'
import type { PracticeTemplate } from '../components/SmartCountdown'

const nianfoTemplates: PracticeTemplate[] = [
  {
    id: 'nianfo-10',
    name: '念佛 10 遍',
    subtitle: '南无阿弥陀佛 · 早起清净念',
    quantity: 10,
    unit: '遍',
    durationSeconds: 60,
    audioGuide: '开始念佛，净念相继，南无阿弥陀佛',
    color: '#d97706',
    bgColor: 'from-amber-500 to-orange-500',
  },
  {
    id: 'nianfo-108',
    name: '念佛 108 遍',
    subtitle: '南无阿弥陀佛 · 108圆满',
    quantity: 108,
    unit: '遍',
    durationSeconds: 600,
    audioGuide: '开始念佛，108遍完整修持，愿生西方净土中',
    color: '#dc2626',
    bgColor: 'from-red-500 to-rose-600',
  },
  {
    id: 'nianfo-1000',
    name: '念佛 1000 遍',
    subtitle: '南无阿弥陀佛 · 精进持念',
    quantity: 1000,
    unit: '遍',
    durationSeconds: 3600,
    audioGuide: '开始念佛，精进持念，一心不乱',
    color: '#9333ea',
    bgColor: 'from-purple-600 to-pink-600',
  },
]

export default function PracticePage() {
  const [completedToday, setCompletedToday] = useState(32)
  const [completedWeek, setCompletedWeek] = useState(256)
  const [completedTotal, setCompletedTotal] = useState(12800)

  const handleComplete = (template: PracticeTemplate) => {
    setCompletedToday((prev) => prev + template.quantity)
    setCompletedWeek((prev) => prev + template.quantity)
    setCompletedTotal((prev) => prev + template.quantity)
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

      {/* 智能功课计数 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">智能功课模式</span>
        </div>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          选择功课模板 → 点击开始 → 自动倒计时 → 时间到即完成对应遍数
        </p>
        <SmartCountdown
          templates={nianfoTemplates}
          onComplete={handleComplete}
        />
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
            <p className="text-xs text-gray-500">今日遍数</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">{completedWeek}</p>
            <p className="text-xs text-gray-500">本周遍数</p>
          </div>
          <div className="text-center p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#5c4033]">{(completedTotal / 10000).toFixed(1)}万</p>
            <p className="text-xs text-gray-500">累计总数</p>
          </div>
        </div>
      </div>

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

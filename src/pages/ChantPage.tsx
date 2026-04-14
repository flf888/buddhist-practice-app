import { useState } from 'react'
import { Sparkles, Flame } from 'lucide-react'
import SmartCountdown from '../components/SmartCountdown'
import type { PracticeTemplate } from '../components/SmartCountdown'

const chantTemplates: PracticeTemplate[] = [
  {
    id: 'dabei-3',
    name: '大悲咒 3 遍',
    subtitle: '千手千眼观世音菩萨广大圆满无碍大悲心陀罗尼',
    quantity: 3,
    unit: '遍',
    durationSeconds: 180,
    audioGuide: '开始持诵大悲咒，慈悲普被，消灾解厄',
    color: '#7c3aed',
    bgColor: 'from-purple-600 to-violet-600',
  },
  {
    id: 'dabei-7',
    name: '大悲咒 7 遍',
    subtitle: '大悲咒完整七遍修持',
    quantity: 7,
    unit: '遍',
    durationSeconds: 420,
    audioGuide: '开始持诵大悲咒七遍，虔诚持念',
    color: '#8b5cf6',
    bgColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 'dabei-21',
    name: '大悲咒 21 遍',
    subtitle: '大悲咒二十一遍圆满修持',
    quantity: 21,
    unit: '遍',
    durationSeconds: 1260,
    audioGuide: '开始持诵大悲咒二十一遍，圆满自在',
    color: '#db2777',
    bgColor: 'from-pink-600 to-rose-600',
  },
  {
    id: 'wangsheng-7',
    name: '往生咒 7 遍',
    subtitle: '拔一切业障根本，得生净土陀罗尼',
    quantity: 7,
    unit: '遍',
    durationSeconds: 280,
    audioGuide: '开始持诵往生咒，往生净土，莲登九品',
    color: '#059669',
    bgColor: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'liuzi-108',
    name: '六字大明咒 108 遍',
    subtitle: '唵嘛呢呗咪吽 · 观世音菩萨心咒',
    quantity: 108,
    unit: '遍',
    durationSeconds: 1080,
    audioGuide: '开始持诵六字大明咒，唵嘛呢呗咪吽',
    color: '#2563eb',
    bgColor: 'from-blue-600 to-indigo-600',
  },
]

export default function ChantPage() {
  const [completedToday, setCompletedToday] = useState(14)
  const [completedWeek, setCompletedWeek] = useState(98)
  const [completedTotal, setCompletedTotal] = useState(2100)

  const handleComplete = (template: PracticeTemplate) => {
    setCompletedToday((prev) => prev + template.quantity)
    setCompletedWeek((prev) => prev + template.quantity)
    setCompletedTotal((prev) => prev + template.quantity)
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
        <SmartCountdown
          templates={chantTemplates}
          onComplete={handleComplete}
        />
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

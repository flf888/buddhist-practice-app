import { useState } from 'react'
import { Heart, Flame, Calendar, Check } from 'lucide-react'
import SmartCountdown from '../components/SmartCountdown'
import type { PracticeTemplate } from '../components/SmartCountdown'

const baichanTemplates: PracticeTemplate[] = [
  {
    id: 'baichan-3',
    name: '礼佛三拜',
    subtitle: '消灾祈福 · 基础忏悔',
    quantity: 3,
    unit: '拜',
    durationSeconds: 120,
    audioGuide: '开始礼佛三拜，至诚忏悔',
    color: '#d97706',
    bgColor: 'from-amber-500 to-orange-500',
  },
  {
    id: 'baichan-7',
    name: '礼佛七拜',
    subtitle: '地藏经超度 · 七拜修持',
    quantity: 7,
    unit: '拜',
    durationSeconds: 280,
    audioGuide: '开始礼佛七拜，至诚忏悔',
    color: '#ea580c',
    bgColor: 'from-orange-500 to-red-500',
  },
  {
    id: 'baichan-21',
    name: '礼佛二十一遍',
    subtitle: '消灾祈福 · 二十一遍圆满',
    quantity: 21,
    unit: '拜',
    durationSeconds: 840,
    audioGuide: '开始礼佛二十一遍，圆满自在',
    color: '#dc2626',
    bgColor: 'from-red-500 to-rose-600',
  },
  {
    id: 'baichan-49',
    name: '礼佛四十九拜',
    subtitle: '药师佛祈福 · 四十九拜大修',
    quantity: 49,
    unit: '拜',
    durationSeconds: 1960,
    audioGuide: '开始礼佛四十九拜，虔诚精进',
    color: '#16a34a',
    bgColor: 'from-green-600 to-emerald-600',
  },
  {
    id: 'baichan-108',
    name: '礼佛一百零八拜',
    subtitle: '108大拜 · 圆满忏悔',
    quantity: 108,
    unit: '拜',
    durationSeconds: 4320,
    audioGuide: '开始礼佛一百零八拜，功德圆满',
    color: '#7c3aed',
    bgColor: 'from-purple-600 to-pink-600',
  },
]

const recentSessions = [
  { name: '清明节超度', date: '04-05', status: 'completed', cycles: 7 },
  { name: '观音诞辰祈福', date: '03-19', status: 'completed', cycles: 3 },
  { name: '消灾法会', date: '03-15', status: 'completed', cycles: 21 },
]

export default function BaichanPage() {
  const [completedToday, setCompletedToday] = useState(3)
  const [completedWeek, setCompletedWeek] = useState(17)
  const [completedTotal, setCompletedTotal] = useState(5)

  const handleComplete = (template: PracticeTemplate) => {
    setCompletedToday((prev) => prev + template.quantity)
    setCompletedWeek((prev) => prev + template.quantity)
    setCompletedTotal((prev) => prev + 1)
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
        <SmartCountdown
          templates={baichanTemplates}
          onComplete={handleComplete}
        />
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

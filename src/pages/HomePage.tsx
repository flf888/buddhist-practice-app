import { useState } from 'react'
import { Repeat, BookOpen, Heart, Sparkles, Play, ChevronRight, Bell } from 'lucide-react'

interface HomePageProps {
  onNavigate: (tab: 'home' | 'practice' | 'sutra' | 'festival' | 'profile' | 'chant' | 'baichan') => void
}

const todayStats = {
  nianfo: 3200,
  nianfoGoal: 10000,
  nianjing: 1,
  nianzhou: 50,
  baichan: 0,
}

const festivals = [
  { name: '观音诞辰', days: 12, icon: '🧘' },
  { name: '地藏王菩萨日', days: 18, icon: '🙏' },
]

const features = [
  { id: 'nianfo', name: '念佛', desc: '南无阿弥陀佛', count: todayStats.nianfo, goal: todayStats.nianfoGoal, icon: Repeat, color: 'from-amber-500 to-orange-500' },
  { id: 'nianjing', name: '念经', desc: '阿弥陀经', count: todayStats.nianjing, goal: 2, icon: BookOpen, color: 'from-blue-500 to-indigo-500' },
  { id: 'nianzhou', name: '念咒', desc: '六字大明咒', count: todayStats.nianzhou, goal: 108, icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 'baichan', name: '拜忏', desc: '消灾祈福', count: todayStats.baichan, goal: 1, icon: Heart, color: 'from-red-500 to-rose-500' },
]

export default function HomePage({ onNavigate }: HomePageProps) {
  const [showReminder, setShowReminder] = useState(true)

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Reminder Banner */}
      {showReminder && (
        <div className="bg-gradient-to-r from-[#c9a227]/10 to-[#c9a227]/5 border border-[#c9a227]/30 rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c9a227]/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#c9a227]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#5c4033]">今日功课提醒</h3>
                <p className="text-sm text-gray-600 mt-1">您今日还有念佛6800遍待完成，继续加油！</p>
              </div>
            </div>
            <button onClick={() => setShowReminder(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <button
            onClick={() => onNavigate('practice')}
            className="mt-3 w-full bg-[#c9a227] text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            开始修行
          </button>
        </div>
      )}

      {/* Progress Ring */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">今日修行进度</h2>
        <div className="flex items-center justify-center gap-8">
          <div className="relative">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="#f0ebe3" strokeWidth="8" fill="none" />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="#c9a227"
                strokeWidth="8"
                fill="none"
                strokeDasharray={301.59}
                strokeDashoffset={301.59 * (1 - todayStats.nianfo / todayStats.nianfoGoal)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#5c4033]">{Math.round(todayStats.nianfo / todayStats.nianfoGoal * 100)}%</span>
              <span className="text-xs text-gray-500">念佛进度</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">念佛 {todayStats.nianfo}/{todayStats.nianfoGoal}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">念经 {todayStats.nianjing}/{2}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">念咒 {todayStats.nianzhou}/{108}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature) => {
          const Icon = feature.icon
          const progress = Math.round((feature.count / feature.goal) * 100)
          return (
            <button
              key={feature.id}
              onClick={() => {
                if (feature.id === 'nianfo') onNavigate('practice')
                else if (feature.id === 'nianzhou') onNavigate('chant')
                else if (feature.id === 'nianjing') onNavigate('sutra')
                else if (feature.id === 'baichan') onNavigate('baichan')
              }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">{feature.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{feature.desc}</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${feature.color} rounded-full transition-all`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Upcoming Festivals */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">即将到来的节日</h2>
          <button onClick={() => onNavigate('festival')} className="text-sm text-[#8b2323] flex items-center gap-1">
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {festivals.map((festival, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#faf8f5] rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{festival.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-800">{festival.name}</h3>
                  <p className="text-xs text-gray-500">还有 {festival.days} 天</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('festival')}
                className="px-3 py-1.5 text-xs bg-[#8b2323] text-white rounded-lg"
              >
                预约
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Quote */}
      <div className="bg-gradient-to-br from-[#8b2323] to-[#a83232] rounded-2xl p-5 text-white">
        <p className="text-lg leading-relaxed font-light italic">
          "念佛一声，罪灭河沙；念佛十声，福报无量。"
        </p>
        <p className="text-sm opacity-80 mt-3">—《大势至菩萨念佛圆通章》</p>
      </div>
    </div>
  )
}

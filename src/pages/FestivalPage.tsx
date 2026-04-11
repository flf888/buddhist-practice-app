import { useState } from 'react'
import { ChevronRight, Calendar, Clock, Users, Bell, CheckCircle } from 'lucide-react'

const festivals = [
  {
    id: 1,
    name: '观音诞辰',
    subtitle: '农历二月十九',
    date: '2026年4月6日',
    daysLeft: 12,
    description: '观世音菩萨圣诞，念诵观音圣号及《观世音菩萨普门品》',
    practice: ['念诵"南无观世音菩萨"108遍', '读诵《普门品》', '放生护生'],
    participants: 1234,
    icon: '🧘',
    color: 'from-blue-500 to-indigo-600',
    status: 'upcoming',
    isMajor: true,
  },
  {
    id: 2,
    name: '普贤菩萨圣诞',
    subtitle: '农历二月廿一',
    date: '2026年4月8日',
    daysLeft: 14,
    description: '普贤菩萨圣诞，修持普贤行愿',
    practice: ['诵《普贤行愿品》', '礼佛忏悔'],
    participants: 856,
    icon: '🐘',
    color: 'from-green-500 to-teal-600',
    status: 'upcoming',
    isMajor: false,
  },
  {
    id: 3,
    name: '文殊菩萨圣诞',
    subtitle: '农历四月初四',
    date: '2026年5月20日',
    daysLeft: 56,
    description: '文殊菩萨圣诞，求智慧学业',
    practice: ['念诵"南无文殊菩萨"', '读诵《文殊心咒》', '文昌祈福'],
    participants: 2341,
    icon: '📚',
    color: 'from-purple-500 to-violet-600',
    status: 'upcoming',
    isMajor: true,
  },
  {
    id: 4,
    name: '释迦牟尼佛圣诞',
    subtitle: '农历四月初八',
    date: '2026年5月24日',
    daysLeft: 60,
    description: '佛陀圣诞，浴佛节',
    practice: ['浴佛', '念诵《释迦牟尼佛圣号》', '斋戒'],
    participants: 3567,
    icon: '🙏',
    color: 'from-amber-500 to-orange-600',
    status: 'upcoming',
    isMajor: true,
  },
  {
    id: 5,
    name: '地藏王菩萨圣诞',
    subtitle: '农历七月廿九',
    date: '2026年10月10日',
    daysLeft: 199,
    description: '地藏菩萨圣诞，救度地狱众生',
    practice: ['诵《地藏经》', '念"南无地藏王菩萨"', '供灯超度'],
    participants: 1876,
    icon: '⚡',
    color: 'from-red-500 to-rose-600',
    status: 'upcoming',
    isMajor: true,
  },
  {
    id: 6,
    name: '观音成道日',
    subtitle: '农历六月十九',
    date: '2026年8月2日',
    daysLeft: 143,
    description: '观世音菩萨成道纪念日',
    practice: ['持诵观音圣号', '茹素一天'],
    participants: 2890,
    icon: '🪷',
    color: 'from-pink-500 to-rose-600',
    status: 'upcoming',
    isMajor: true,
  },
]

const months = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'
]

export default function FestivalPage() {
  const [selectedFestival, setSelectedFestival] = useState<typeof festivals[0] | null>(null)
  const [joinedFestivals, setJoinedFestivals] = useState<number[]>([1])

  const toggleJoin = (id: number) => {
    setJoinedFestivals((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  if (selectedFestival) {
    return (
      <div className="px-4 py-4 space-y-4">
        {/* Back Button */}
        <button
          onClick={() => setSelectedFestival(null)}
          className="flex items-center gap-2 text-[#8b2323] font-medium"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          返回节日列表
        </button>

        {/* Festival Header */}
        <div className={`bg-gradient-to-br ${selectedFestival.color} rounded-2xl p-6 text-white`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{selectedFestival.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{selectedFestival.name}</h1>
              <p className="text-sm opacity-90">{selectedFestival.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{selectedFestival.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>还有 {selectedFestival.daysLeft} 天</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-3">节日简介</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{selectedFestival.description}</p>
        </div>

        {/* Practice Guide */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">当日功课指引</h2>
          <div className="space-y-3">
            {selectedFestival.practice.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-[#faf8f5] rounded-xl">
                <span className="w-6 h-6 rounded-full bg-[#8b2323] text-white text-xs flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 打七活动 */}
        {selectedFestival.isMajor && (
          <div className="bg-gradient-to-r from-[#c9a227]/10 to-[#c9a227]/5 border border-[#c9a227]/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏃</span>
              <h2 className="font-semibold text-[#5c4033]">打七共修</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              节日期间可参与七日精进共修，每日完成指定功课，全程参与可获得特别功德回向
            </p>
            <div className="bg-white rounded-xl p-3 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">已报名</span>
                <span className="text-[#8b2323] font-medium">{(selectedFestival.participants / 10).toFixed(0)}人</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">持续时间</span>
                <span className="text-[#5c4033] font-medium">7天</span>
              </div>
            </div>
            <button
              onClick={() => toggleJoin(selectedFestival.id)}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                joinedFestivals.includes(selectedFestival.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-[#8b2323] text-white'
              }`}
            >
              {joinedFestivals.includes(selectedFestival.id) ? '✓ 已报名' : '立即报名参加'}
            </button>
          </div>
        )}

        {/* Participants */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">参与同修</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{selectedFestival.participants}人</span>
            </div>
          </div>
          <div className="flex -space-x-2">
            {['🙏', '🧘', '✨', '☸️', '💫', '🪷', '⚡'].map((emoji, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b2323] to-[#a83232] flex items-center justify-center text-sm border-2 border-white"
              >
                {emoji}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 border-2 border-white">
              +{Math.floor(selectedFestival.participants / 10)}
            </div>
          </div>
        </div>

        {/* Reminder */}
        <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#c9a227]" />
            <span className="font-medium text-gray-700">开启节日提醒</span>
          </div>
          <div className="w-12 h-6 bg-[#8b2323] rounded-full relative">
            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl font-bold text-gray-800">佛教节日</h1>
        <p className="text-sm text-gray-500 mt-1">殊胜日共修 · 功德加倍</p>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">农历月份</h3>
        <div className="grid grid-cols-4 gap-2">
          {months.map((month, idx) => (
            <div
              key={month}
              className={`p-2 rounded-lg text-center text-sm cursor-pointer transition-all ${
                idx === 1 || idx === 5 || idx === 8
                  ? 'bg-[#8b2323] text-white'
                  : idx === 3 || idx === 6
                  ? 'bg-[#c9a227]/20 text-[#c9a227]'
                  : 'bg-[#faf8f5] text-gray-600 hover:bg-gray-100'
              }`}
            >
              {month.replace('月', '')}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#8b2323]" />
            <span className="text-gray-500">四大节日</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#c9a227]/20" />
            <span className="text-gray-500">菩萨圣诞</span>
          </div>
        </div>
      </div>

      {/* Upcoming Festivals */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">即将到来</h2>
        <div className="space-y-3">
          {festivals.filter((f) => f.daysLeft <= 60).map((festival) => (
            <button
              key={festival.id}
              onClick={() => setSelectedFestival(festival)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${festival.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {festival.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{festival.name}</h3>
                    {festival.isMajor && (
                      <span className="px-1.5 py-0.5 bg-[#c9a227]/20 text-[#c9a227] text-[10px] rounded">殊胜日</span>
                    )}
                    {joinedFestivals.includes(festival.id) && (
                      <CheckCircle className="w-4 h-4 text-green-500 fill-green-100" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{festival.subtitle} · {festival.date}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#8b2323] font-medium">
                      还有 {festival.daysLeft} 天
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3 h-3" />
                      <span>{festival.participants}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* All Year */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">全年重要节日</h3>
        <div className="space-y-2">
          {festivals.filter((f) => !f.daysLeft || f.daysLeft > 60).map((festival) => (
            <button
              key={festival.id}
              onClick={() => setSelectedFestival(festival)}
              className="w-full flex items-center justify-between p-3 bg-[#faf8f5] rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{festival.icon}</span>
                <div className="text-left">
                  <h4 className="text-sm font-medium text-gray-800">{festival.name}</h4>
                  <p className="text-xs text-gray-500">{festival.subtitle}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{festival.daysLeft}天后</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

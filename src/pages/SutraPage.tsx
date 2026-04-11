import { useState } from 'react'
import { Play, Pause, ChevronRight, CheckCircle } from 'lucide-react'

const sutras = [
  {
    id: 1,
    name: '阿弥陀经',
    sanskrit: 'Amituo Jing',
    description: '净土宗核心经典，讲述西方极乐世界的殊胜功德',
    chapters: 1,
    duration: '15分钟',
    completions: 156,
    icon: '🪷',
    color: 'from-amber-500 to-orange-500',
    isHot: true,
  },
  {
    id: 2,
    name: '观世音菩萨普门品',
    sanskrit: 'Guanyin Pumen',
    description: '《法华经》重要章节，赞叹观世音菩萨救苦救难功德',
    chapters: 1,
    duration: '10分钟',
    completions: 89,
    icon: '🧘',
    color: 'from-blue-500 to-indigo-500',
    isHot: false,
  },
  {
    id: 3,
    name: '心经',
    sanskrit: 'Xin Jing',
    description: '般若波罗蜜多心经，大乘佛教核心经典',
    chapters: 1,
    duration: '5分钟',
    completions: 234,
    icon: '✨',
    color: 'from-purple-500 to-pink-500',
    isHot: true,
  },
  {
    id: 4,
    name: '地藏经',
    sanskrit: 'Dizang Jing',
    description: '地藏菩萨本愿经，讲述地藏菩萨救度地狱众生',
    chapters: 13,
    duration: '60分钟',
    completions: 45,
    icon: '🙏',
    color: 'from-green-500 to-teal-500',
    isHot: false,
  },
  {
    id: 5,
    name: '药师经',
    sanskrit: 'Yaoshi Jing',
    description: '药师琉璃光如来本愿功德经，侧重消灾延寿',
    chapters: 12,
    duration: '45分钟',
    completions: 67,
    icon: '💊',
    color: 'from-red-500 to-rose-500',
    isHot: false,
  },
  {
    id: 6,
    name: '金刚经',
    sanskrit: 'Jingang Jing',
    description: '金刚般若波罗蜜经，禅宗核心经典',
    chapters: 32,
    duration: '30分钟',
    completions: 112,
    icon: '⚔️',
    color: 'from-gray-600 to-gray-800',
    isHot: true,
  },
]

export default function SutraPage() {
  const [selectedSutra, setSelectedSutra] = useState<typeof sutras[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSutras, setCompletedSutras] = useState<number[]>([1, 3])

  const toggleComplete = (id: number) => {
    setCompletedSutras((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  if (selectedSutra) {
    return (
      <div className="px-4 py-4 space-y-4">
        {/* Back Button */}
        <button
          onClick={() => setSelectedSutra(null)}
          className="flex items-center gap-2 text-[#8b2323] font-medium"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          返回经文列表
        </button>

        {/* Sutra Header */}
        <div className={`bg-gradient-to-br ${selectedSutra.color} rounded-2xl p-6 text-white`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selectedSutra.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{selectedSutra.name}</h1>
              <p className="text-sm opacity-90">{selectedSutra.sanskrit}</p>
            </div>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">{selectedSutra.description}</p>
        </div>

        {/* Sutra Content */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">经文内容</h2>
            <button
              onClick={() => toggleComplete(selectedSutra.id)}
              className={`flex items-center gap-1 text-sm ${
                completedSutras.includes(selectedSutra.id)
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${completedSutras.includes(selectedSutra.id) ? 'fill-green-100' : ''}`} />
              {completedSutras.includes(selectedSutra.id) ? '已完成' : '标记完成'}
            </button>
          </div>

          <div className="bg-[#faf8f5] rounded-xl p-4 text-[#5c4033] leading-loose text-sm">
            <p className="mb-4 text-center font-bold">南无本师释迦牟尼佛（三称）</p>
            <p className="mb-4 text-center text-xs text-gray-500">开经偈</p>
            <p className="mb-4 italic text-gray-600">
              无上甚深微妙法，百千万劫难遭遇，<br />
              我今见闻得受持，愿解如来真实义。
            </p>
            <p className="mb-4 text-center text-xs text-gray-500">正文</p>
            <p className="mb-4">
              如是我闻，一时佛在舍卫国，祇树给孤独园，与大比丘僧千二百五十人俱，皆是大阿罗汉，众所知识。
            </p>
            <p className="mb-4">
              尔时佛告长老舍利弗，从是西方，过十万亿佛土，有世界名曰极乐，其土有佛，号阿弥陀，今现在说法。
            </p>
            <p className="mb-4">
              舍利弗，彼土何故名为极乐？其国众生，无有众苦，但受诸乐，故名极乐。
            </p>
            <p className="text-center text-xs text-gray-500 mt-6">... 经文省略 ...</p>
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">诵读音频</span>
            <span className="text-xs text-gray-400">00:00 / {selectedSutra.duration}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-[#c9a227]'
                  : 'bg-gradient-to-br from-[#8b2323] to-[#a83232]'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex-1">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full bg-[#8b2323] rounded-full ${isPlaying ? 'animate-pulse' : ''}`} style={{ width: '35%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Reading Mode */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">诵读模式</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-[#8b2323] text-white rounded-xl text-sm font-medium">
              跟读模式
            </button>
            <button className="p-3 bg-[#faf8f5] text-gray-700 rounded-xl text-sm font-medium">
              静读模式
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl font-bold text-gray-800">经典诵读</h1>
        <p className="text-sm text-gray-500 mt-1">持诵经典 · 智慧增长</p>
      </div>

      {/* Today's Recommendation */}
      <div className="bg-gradient-to-r from-[#c9a227]/10 to-[#c9a227]/5 border border-[#c9a227]/30 rounded-2xl p-4">
        <p className="text-xs text-[#c9a227] font-medium mb-2">今日推荐</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🪷</span>
          <div>
            <h3 className="font-bold text-[#5c4033]">阿弥陀经</h3>
            <p className="text-xs text-gray-500">净土五经之一 · 西方极乐</p>
          </div>
          <button className="ml-auto bg-[#8b2323] text-white px-3 py-1.5 rounded-lg text-sm">
            开始诵读
          </button>
        </div>
      </div>

      {/* Sutra List */}
      <div className="space-y-3">
        {sutras.map((sutra) => (
          <button
            key={sutra.id}
            onClick={() => setSelectedSutra(sutra)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sutra.color} flex items-center justify-center text-2xl`}>
                {sutra.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{sutra.name}</h3>
                  {sutra.isHot && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] rounded">热门</span>
                  )}
                  {completedSutras.includes(sutra.id) && (
                    <CheckCircle className="w-4 h-4 text-green-500 fill-green-100" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{sutra.sanskrit}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{sutra.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>{sutra.chapters}品</span>
                  <span>{sutra.duration}</span>
                  <span>{sutra.completions}人诵读</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">本月诵经统计</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#8b2323]">12</p>
            <p className="text-xs text-gray-500">诵经次数</p>
          </div>
          <div className="p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#c9a227]">3.5h</p>
            <p className="text-xs text-gray-500">累计时长</p>
          </div>
          <div className="p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#5c4033]">5部</p>
            <p className="text-xs text-gray-500">不同经典</p>
          </div>
        </div>
      </div>
    </div>
  )
}

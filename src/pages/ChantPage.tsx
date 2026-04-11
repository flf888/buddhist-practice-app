import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Sparkles, Check } from 'lucide-react'

const chants = [
  { id: 1, name: '六字大明咒', mantra: '唵嘛呢呗咪吽', sanskrit: 'Om Mani Padme Hum', count: 108, icon: '🔮', desc: '观世音菩萨心咒，功德无量' },
  { id: 2, name: '大悲咒', mantra: '南无喝啰怛那哆啰夜耶', count: 84, icon: '🪷', desc: '千手千眼观世音菩萨广大圆满无碍大悲心陀罗尼' },
  { id: 3, name: '楞严咒', mantra: '妙湛总持不动尊', count: 2628, icon: '⚡', desc: '佛顶光明，微妙法门' },
  { id: 4, name: '往生咒', mantra: '南无阿弥多婆夜', count: 7, icon: '🌸', desc: '拔一切业障根本，得生净土' },
  { id: 5, name: '准提咒', mantra: '稽首皈依苏悉帝', count: 108, icon: '✨', desc: '准提菩萨根本咒，求愿悉地' },
]

export default function ChantPage() {
  const [selectedChant, setSelectedChant] = useState(chants[0])
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSets, setCompletedSets] = useState(0)

  const totalCount = count + completedSets * selectedChant.count
  const progress = Math.round((totalCount / selectedChant.count) * 100)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= selectedChant.count - 1) {
          setCompletedSets((s) => s + 1)
          return 0
        }
        return prev + 1
      })
    }, 1800)

    return () => clearInterval(interval)
  }, [isPlaying, selectedChant.count])

  const handleTap = () => {
    if (count >= selectedChant.count - 1) {
      setCompletedSets((s) => s + 1)
      setCount(0)
    } else {
      setCount((prev) => prev + 1)
    }
  }

  const reset = () => {
    setCount(0)
    setCompletedSets(0)
    setIsPlaying(false)
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-xl font-bold">念咒修行</h1>
        </div>
        <p className="text-sm opacity-90">持咒精进，消除业障</p>
      </div>

      {/* Chant Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">选择咒语</h2>
        <div className="grid grid-cols-1 gap-2">
          {chants.map((chant) => (
            <button
              key={chant.id}
              onClick={() => { setSelectedChant(chant); reset() }}
              className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
                selectedChant.id === chant.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-[#faf8f5] hover:bg-gray-100'
              }`}
            >
              <span className="text-3xl">{chant.icon}</span>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">{chant.name}</h3>
                <p className={`text-xs ${selectedChant.id === chant.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {chant.mantra}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedChant.id === chant.id ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {chant.count}遍/组
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Counter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <div className="mb-4">
          <p className="text-2xl text-[#5c4033] font-medium">{selectedChant.name}</p>
          <p className="text-lg text-purple-600 font-bold mt-1">{selectedChant.mantra}</p>
        </div>

        <div className="relative w-44 h-44 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="88" cy="88" r="80" stroke="#f3e8ff" strokeWidth="10" fill="none" />
            <circle
              cx="88"
              cy="88"
              r="80"
              stroke="#8b5cf6"
              strokeWidth="10"
              fill="none"
              strokeDasharray={502}
              strokeDashoffset={502 * (1 - Math.min(progress, 100) / 100)}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-purple-600">{totalCount}</span>
            <span className="text-sm text-gray-500">当前遍数</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-gray-600">当前组: {completedSets} 组</span>
            <span className="text-gray-600">组内: {count}/{selectedChant.count}</span>
            <span className="text-purple-600 font-medium">进度 {progress}%</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>
          <button
            onClick={handleTap}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all active:scale-95"
          >
            <span className="text-xs opacity-80">点击计数</span>
            <span className="text-lg font-bold">念</span>
          </button>
          <button
            onClick={reset}
            className="w-16 h-16 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shadow hover:bg-gray-200 transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs text-gray-400">{selectedChant.desc}</p>
      </div>

      {/* Completion */}
      {completedSets > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">已精进 {completedSets} 组</h3>
            <p className="text-sm opacity-90">持咒功德，回向众生</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">念咒统计</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-purple-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-purple-600">{completedSets}</p>
            <p className="text-xs text-gray-500">今日组数</p>
          </div>
          <div className="p-3 bg-pink-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-pink-600">{totalCount}</p>
            <p className="text-xs text-gray-500">今日遍数</p>
          </div>
          <div className="p-3 bg-[#faf8f5] rounded-xl text-center">
            <p className="text-2xl font-bold text-[#5c4033]">5</p>
            <p className="text-xs text-gray-500">累计咒语</p>
          </div>
        </div>
      </div>
    </div>
  )
}

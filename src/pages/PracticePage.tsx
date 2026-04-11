import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Settings } from 'lucide-react'

const mantras = [
  { id: 1, name: '南无阿弥陀佛', shortName: '阿弥陀佛', count: 10000, icon: '🙏' },
  { id: 2, name: '南无观世音菩萨', shortName: '观世音', count: 1000, icon: '🧘' },
  { id: 3, name: '南无地藏王菩萨', shortName: '地藏王', count: 108, icon: '🙏' },
]

const speeds = [
  { label: '慢速', value: 0.75 },
  { label: '正常', value: 1 },
  { label: '快速', value: 1.5 },
]

export default function PracticePage() {
  const [selectedMantra, setSelectedMantra] = useState(mantras[0])
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [mode, setMode] = useState<'manual' | 'auto'>('manual')
  const [showSettings, setShowSettings] = useState(false)

  const progress = Math.round((count / selectedMantra.count) * 100)

  useEffect(() => {
    if (!isPlaying || mode !== 'auto') return

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= selectedMantra.count) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1500 / speed)

    return () => clearInterval(interval)
  }, [isPlaying, mode, speed, selectedMantra.count])

  const handleCount = useCallback(() => {
    if (mode === 'manual' && count < selectedMantra.count) {
      setCount((prev) => prev + 1)
    }
  }, [mode, count, selectedMantra.count])

  const resetCount = () => {
    setCount(0)
    setIsPlaying(false)
  }

  const selectMantra = (mantra: typeof mantras[0]) => {
    setSelectedMantra(mantra)
    setCount(0)
    setIsPlaying(false)
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Mantra Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">选择修行内容</h2>
        <div className="space-y-2">
          {mantras.map((mantra) => (
            <button
              key={mantra.id}
              onClick={() => selectMantra(mantra)}
              className={`w-full p-3 rounded-xl flex items-center justify-between transition-all ${
                selectedMantra.id === mantra.id
                  ? 'bg-[#8b2323] text-white'
                  : 'bg-[#faf8f5] hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mantra.icon}</span>
                <div className="text-left">
                  <h3 className="font-medium">{mantra.name}</h3>
                  <p className={`text-xs ${selectedMantra.id === mantra.id ? 'text-white/80' : 'text-gray-500'}`}>
                    目标：{mantra.count}遍
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Counter Display */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="#f0ebe3" strokeWidth="12" fill="none" />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#8b2323"
              strokeWidth="12"
              fill="none"
              strokeDasharray={553}
              strokeDashoffset={553 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-[#8b2323]">{count}</span>
            <span className="text-sm text-gray-500">/ {selectedMantra.count}</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xl text-[#5c4033] font-medium">{selectedMantra.name}</p>
          <p className="text-sm text-gray-500 mt-1">进度 {progress}%</p>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setMode('manual')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === 'manual' ? 'bg-[#8b2323] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            手动计数
          </button>
          <button
            onClick={() => setMode('auto')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === 'auto' ? 'bg-[#8b2323] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            自动播放
          </button>
        </div>

        {mode === 'auto' && (
          <div className="flex justify-center gap-2 mb-4">
            {speeds.map((s) => (
              <button
                key={s.value}
                onClick={() => setSpeed(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  speed === s.value ? 'bg-[#c9a227] text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4">
          {mode === 'manual' ? (
            <button
              onClick={handleCount}
              disabled={count >= selectedMantra.count}
              className={`w-32 h-32 rounded-full text-white font-bold text-2xl shadow-lg transition-all active:scale-95 ${
                count >= selectedMantra.count ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-[#8b2323] to-[#a83232] hover:shadow-xl'
              }`}
            >
              <span className="text-sm font-normal block mb-1 opacity-80">点击计数</span>
              念
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8b2323] to-[#a83232] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
              <button
                onClick={resetCount}
                className="w-14 h-14 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shadow hover:bg-gray-200 transition-all"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {mode === 'manual' && (
          <button onClick={resetCount} className="mt-4 text-sm text-gray-500 flex items-center gap-1 mx-auto">
            <RotateCcw className="w-4 h-4" /> 重置计数
          </button>
        )}
      </div>

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">听念折算设置</span>
        </div>
        <span className="text-sm text-[#8b2323]">听1遍=念3遍</span>
      </button>

      {count >= selectedMantra.count && (
        <div className="bg-gradient-to-r from-[#c9a227] to-[#d4af37] rounded-2xl p-5 text-white text-center">
          <p className="text-2xl mb-2">🎉</p>
          <h3 className="font-bold text-lg">恭喜完成今日功课！</h3>
          <p className="text-sm opacity-90 mt-1">功德无量，福报加持</p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">修行统计</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#8b2323]">32</p>
            <p className="text-xs text-gray-500">今日念佛</p>
          </div>
          <div className="p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#c9a227]">128</p>
            <p className="text-xs text-gray-500">本周念佛</p>
          </div>
          <div className="p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#5c4033]">1.2万</p>
            <p className="text-xs text-gray-500">累计念佛</p>
          </div>
        </div>
      </div>
    </div>
  )
}

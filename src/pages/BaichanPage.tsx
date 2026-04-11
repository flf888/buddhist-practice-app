import { useState } from 'react'
import { Heart, Play, Check, ChevronRight, Calendar } from 'lucide-react'

const baichanTypes = [
  { 
    id: 1, 
    name: '消灾祈福', 
    desc: '祈求消除灾祸，福报增长',
    cycles: 21,
    icon: '🕯️',
    color: 'from-amber-500 to-orange-500',
    scriptures: ['梁皇宝忏', '礼佛大忏悔文']
  },
  { 
    id: 2, 
    name: '地藏经超度', 
    desc: '超度亡灵，往生净土',
    cycles: 7,
    icon: '🌅',
    color: 'from-yellow-600 to-amber-500',
    scriptures: ['地藏经']
  },
  { 
    id: 3, 
    name: '观音加持', 
    desc: '观世音菩萨慈悲加持',
    cycles: 7,
    icon: '🪷',
    color: 'from-pink-500 to-rose-500',
    scriptures: ['观世音菩萨普门品']
  },
  { 
    id: 4, 
    name: '药师佛祈福', 
    desc: '消苦延寿，健康平安',
    cycles: 49,
    icon: '💊',
    color: 'from-green-500 to-emerald-500',
    scriptures: ['药师经']
  },
  { 
    id: 5, 
    name: '家庭祈福', 
    desc: '保佑全家平安吉祥',
    cycles: 3,
    icon: '🏠',
    color: 'from-blue-500 to-cyan-500',
    scriptures: ['普贤菩萨行愿品']
  },
]

const recentSessions = [
  { name: '清明节超度', date: '04-05', status: 'completed', cycles: 7 },
  { name: '观音诞辰祈福', date: '03-19', status: 'completed', cycles: 3 },
  { name: '消灾法会', date: '03-15', status: 'completed', cycles: 21 },
]

export default function BaichanPage() {
  const [selectedType, setSelectedType] = useState(baichanTypes[0])
  const [currentStep, setCurrentStep] = useState<'select' | 'practice'>('select')
  const [currentCycle, setCurrentCycle] = useState(1)

  const startPractice = () => {
    setCurrentStep('practice')
    setCurrentCycle(1)
  }

  const completeCycle = () => {
    if (currentCycle < selectedType.cycles) {
      setCurrentCycle((c) => c + 1)
    } else {
      setCurrentStep('select')
    }
  }

  const reset = () => {
    setCurrentStep('select')
    setCurrentCycle(1)
  }

  if (currentStep === 'practice') {
    return (
      <div className="px-4 py-4 space-y-4">
        {/* Practice Header */}
        <div className={`bg-gradient-to-br ${selectedType.color} rounded-2xl p-5 text-white`}>
          <div className="text-center">
            <span className="text-5xl mb-3 block">{selectedType.icon}</span>
            <h1 className="text-2xl font-bold">{selectedType.name}</h1>
            <p className="text-sm opacity-90 mt-1">{selectedType.desc}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-2">第 <span className="text-2xl font-bold text-[#8b2323]">{currentCycle}</span> / {selectedType.cycles} 拜</p>
          
          <div className="relative w-40 h-40 mx-auto my-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="72" stroke="#f0ebe3" strokeWidth="8" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="72"
                stroke="#8b2323"
                strokeWidth="8"
                fill="none"
                strokeDasharray={452}
                strokeDashoffset={452 * (1 - currentCycle / selectedType.cycles)}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-[#8b2323]">{currentCycle}</span>
              <span className="text-xs text-gray-500">拜忏中</span>
            </div>
          </div>

          <p className="text-lg text-[#5c4033] mb-6">至诚忏悔，消除业障</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={completeCycle}
              className={`px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-lg transition-all active:scale-95 ${
                selectedType.color.split(' ')[1]
              }`}
            >
              完成一拜
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {Array.from({ length: selectedType.cycles }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < currentCycle ? 'bg-[#8b2323]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scripture Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">配合经典</h3>
          <div className="flex gap-2">
            {selectedType.scriptures.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-[#faf8f5] rounded-full text-sm text-[#5c4033]">
                {s}
              </span>
            ))}
          </div>
        </div>

        <button onClick={reset} className="w-full py-3 text-gray-500 flex items-center justify-center gap-2">
          <ChevronRight className="w-4 h-4 rotate-180" /> 返回选择
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8b2323] to-[#a83232] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6" />
          <h1 className="text-xl font-bold">拜忏修行</h1>
        </div>
        <p className="text-sm opacity-90">至诚忏悔，消业增福</p>
      </div>

      {/* Type Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">选择忏悔类型</h2>
        <div className="space-y-3">
          {baichanTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type)}
              className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                selectedType.id === type.id
                  ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                  : 'bg-[#faf8f5] hover:bg-gray-100'
              }`}
            >
              <span className="text-4xl">{type.icon}</span>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg">{type.name}</h3>
                <p className={`text-sm ${selectedType.id === type.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {type.desc}
                </p>
                <div className={`flex gap-2 mt-2 ${selectedType.id === type.id ? '' : 'text-gray-600'}`}>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedType.id === type.id ? 'bg-white/20' : 'bg-gray-200'}`}>
                    {type.cycles}拜/次
                  </span>
                  {type.scriptures.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${selectedType.id === type.id ? 'bg-white/20' : 'bg-gray-200'}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${selectedType.id === type.id ? '' : 'text-gray-400'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startPractice}
        className="w-full bg-gradient-to-r from-[#8b2323] to-[#a83232] text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3"
      >
        <Play className="w-6 h-6" />
        开始拜忏
      </button>

      {/* Recent Sessions */}
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

      {/* Tips */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-2">拜忏须知</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• 保持身心清净，虔诚忏悔</li>
          <li>• 配合诵经效果更佳</li>
          <li>• 建议清晨或傍晚进行</li>
          <li>• 完成后记得回向功德</li>
        </ul>
      </div>
    </div>
  )
}

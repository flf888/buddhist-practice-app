import { ChevronRight, CheckCircle, Circle, Bell, Sun, Moon } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const hour = new Date().getHours()
const isMorning = hour >= 5 && hour < 12

const morningSteps = [
  {
    id: 'lijing',
    name: '礼敬',
    desc: '南无本师释迦牟尼佛×3、南无阿弥陀佛×3',
    tag: '准备',
    color: 'from-amber-400 to-yellow-500',
    nav: null,
  },
  {
    id: 'sutra',
    name: '诵经',
    desc: '《般若波罗蜜多心经》× 1 遍',
    tag: '核心',
    color: 'from-blue-500 to-indigo-500',
    nav: 'sutra' as const,
  },
  {
    id: 'chant',
    name: '持咒',
    desc: '《大悲咒》3 / 7 / 21 遍任选',
    tag: '持咒',
    color: 'from-purple-500 to-pink-500',
    nav: 'chant' as const,
  },
  {
    id: 'practice',
    name: '念佛',
    desc: '南无阿弥陀佛 10 / 108 遍任选',
    tag: '念佛',
    color: 'from-orange-400 to-red-500',
    nav: 'practice' as const,
  },
  {
    id: 'baichan',
    name: '忏悔',
    desc: '念诵忏悔偈 × 3 遍',
    tag: '忏悔',
    color: 'from-rose-500 to-red-600',
    nav: 'baichan' as const,
  },
  {
    id: 'huixiang',
    name: '回向',
    desc: '愿以此功德，普及于一切',
    tag: '结束',
    color: 'from-emerald-400 to-teal-500',
    nav: null,
  },
]

const eveningSteps = [
  {
    id: 'lijing',
    name: '礼敬',
    desc: '南无阿弥陀佛 × 3 遍',
    tag: '准备',
    color: 'from-amber-400 to-yellow-500',
    nav: null,
  },
  {
    id: 'sutra',
    name: '诵经',
    desc: '《佛说阿弥陀经》× 1 遍（可换《心经》）',
    tag: '核心',
    color: 'from-blue-500 to-indigo-500',
    nav: 'sutra' as const,
  },
  {
    id: 'chant',
    name: '持咒',
    desc: '《往生咒》3 / 7 / 21 遍任选',
    tag: '持咒',
    color: 'from-purple-500 to-pink-500',
    nav: 'chant' as const,
  },
  {
    id: 'baichan',
    name: '忏悔',
    desc: '念诵忏悔偈 × 3 遍',
    tag: '忏悔',
    color: 'from-rose-500 to-red-600',
    nav: 'baichan' as const,
  },
  {
    id: 'practice',
    name: '念佛',
    desc: '南无阿弥陀佛 108 遍',
    tag: '念佛',
    color: 'from-orange-400 to-red-500',
    nav: 'practice' as const,
  },
  {
    id: 'huixiang',
    name: '回向',
    desc: '愿消三障诸烦恼，愿得智慧真明了',
    tag: '结束',
    color: 'from-emerald-400 to-teal-500',
    nav: null,
  },
]

const festivals = [
  { name: '观音诞辰', days: 12, icon: '🧘' },
  { name: '地藏王菩萨日', days: 18, icon: '🙏' },
]

export default function HomePage() {
  const { courseType, setCourseType, completedSteps, markStepComplete, markStepIncomplete, navigate, showReminder, setShowReminder, resetCourseProgress } = useApp()

  const steps = courseType === 'morning' ? morningSteps : eveningSteps
  const completedCount = completedSteps.length
  const totalSteps = steps.length

  const toggleStep = (id: string) => {
    if (completedSteps.includes(id)) {
      markStepIncomplete(id)
    } else {
      markStepComplete(id)
    }
  }

  const isAllDone = completedCount === totalSteps

  return (
    <div className="px-4 py-4 space-y-4">
      {/* 今日提醒 */}
      {showReminder && !isAllDone && (
        <div className="bg-gradient-to-r from-[#c9a227]/10 to-[#c9a227]/5 border border-[#c9a227]/30 rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c9a227]/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#c9a227]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#5c4033]">
                  {courseType === 'morning' ? '早课提醒' : '晚课提醒'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  今日{courseType === 'morning' ? '早课' : '晚课'}还未完成，请抽出 10–20 分钟修行。
                </p>
              </div>
            </div>
            <button onClick={() => setShowReminder(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
          </div>
        </div>
      )}

      {/* 全部完成提示 */}
      {isAllDone && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white flex items-center gap-4">
          <span className="text-3xl">🎉</span>
          <div>
            <h3 className="font-bold text-lg">今日{courseType === 'morning' ? '早课' : '晚课'}已圆满！</h3>
            <p className="text-sm opacity-90">愿以此功德，普及于一切众生</p>
          </div>
        </div>
      )}

      {/* 早晚课切换 + 进度 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">今日功课</h2>
          <div className="flex bg-[#faf8f5] rounded-xl p-1 gap-1">
            <button
              onClick={() => { setCourseType('morning'); resetCourseProgress() }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                courseType === 'morning'
                  ? 'bg-[#c9a227] text-white shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <Sun className="w-4 h-4" />早课
            </button>
            <button
              onClick={() => { setCourseType('evening'); resetCourseProgress() }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                courseType === 'evening'
                  ? 'bg-[#8b2323] text-white shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <Moon className="w-4 h-4" />晚课
            </button>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>已完成 {completedCount} / {totalSteps} 步</span>
            <span>{Math.round(completedCount / totalSteps * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c9a227] to-[#8b2323] rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* 步骤列表 */}
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const done = completedSteps.includes(step.id)
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  done ? 'bg-green-50 border border-green-100' : 'bg-[#faf8f5] border border-transparent'
                }`}
              >
                {/* 步骤序号 */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  done
                    ? 'bg-green-500 text-white'
                    : `bg-gradient-to-br ${step.color} text-white`
                }`}>
                  {done ? '✓' : idx + 1}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${done ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                      {step.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded-full">{step.tag}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{step.desc}</p>
                </div>

                {/* 操作区 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {step.nav && !done && (
                    <button
                      onClick={() => navigate(step.nav!)}
                      className="text-xs text-[#8b2323] bg-[#8b2323]/10 px-2 py-1 rounded-lg flex items-center gap-0.5"
                    >
                      进入<ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={() => toggleStep(step.id)}>
                    {done
                      ? <CheckCircle className="w-5 h-5 text-green-500" />
                      : <Circle className="w-5 h-5 text-gray-300" />
                    }
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 即将到来的节日 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">即将到来的节日</h2>
          <button onClick={() => navigate('festival')} className="text-sm text-[#8b2323] flex items-center gap-1">
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
                onClick={() => navigate('festival')}
                className="px-3 py-1.5 text-xs bg-[#8b2323] text-white rounded-lg"
              >
                预约
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 每日法语 */}
      <div className="bg-gradient-to-br from-[#8b2323] to-[#a83232] rounded-2xl p-5 text-white">
        <p className="text-base leading-relaxed font-light italic">
          "早晚课是修行的根本，一日不旷，功德无量。"
        </p>
        <p className="text-sm opacity-70 mt-3">—— 在家修行准则</p>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, CheckCircle, Volume2, Home } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export interface PracticeTemplate {
  id: string
  name: string
  subtitle: string
  quantity: number
  unit: string
  durationSeconds: number
  audioGuide: string
  color: string
  bgColor: string
  templateId?: number
}

// 本地默认遍数配置（未登录时显示，登录后可调）
export const DEFAULT_USER_SETTINGS = {
  // 早课
  morning_lijing: 3,
  morning_sutra: 1,
  morning_chant: 7,
  morning_nianfo: 10,
  morning_chanhui: 3,
  // 晚课
  evening_lijing: 3,
  evening_sutra: 1,
  evening_chant: 7,
  evening_nianfo: 108,
  evening_chanhui: 3,
}

interface SmartCountdownProps {
  templates: PracticeTemplate[]
  onComplete?: (template: PracticeTemplate) => void
  title?: string
  subtitle?: string
  /** 修行类型，用于同步首页进度 */
  practiceType?: 'sutra' | 'chant' | 'practice' | 'baichan'
}

export default function SmartCountdown({
  templates,
  onComplete,
  title,
  subtitle,
  practiceType,
}: SmartCountdownProps) {
  const { markStepComplete, goHome, showToast } = useApp()
  const [selectedTemplate, setSelectedTemplate] = useState<PracticeTemplate>(templates[0])
  const [phase, setPhase] = useState<'select' | 'countdown' | 'done'>('select')
  const [timeLeft, setTimeLeft] = useState(selectedTemplate.durationSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    setTimeLeft(selectedTemplate.durationSeconds)
  }, [selectedTemplate])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          setPhase('done')
          onComplete?.(selectedTemplate)
          // 同步首页进度
          if (practiceType) {
            markStepComplete(practiceType)
          }
          // 震动提示
          if (navigator.vibrate) navigator.vibrate([200, 100, 200])
          // 显示成功提示
          showToast(`${selectedTemplate.name} 已完成！`, 'success')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const startPractice = () => {
    setPhase('countdown')
    setTimeLeft(selectedTemplate.durationSeconds)
    // 模拟语音引导（实际项目替换为真实TTS或音频文件）
    if (selectedTemplate.audioGuide) {
      const utterance = new SpeechSynthesisUtterance(selectedTemplate.audioGuide)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  const reset = () => {
    setPhase('select')
    setTimeLeft(selectedTemplate.durationSeconds)
    setIsRunning(false)
  }

  const progress = 1 - timeLeft / selectedTemplate.durationSeconds
  const circumference = 2 * Math.PI * 88

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-6">
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="#d1fae5" strokeWidth="12" fill="none" />
            <circle
              cx="96" cy="96" r="88"
              stroke="#10b981"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-2" />
            <span className="text-4xl font-bold text-emerald-600">{selectedTemplate.quantity}</span>
            <span className="text-sm text-gray-500">{selectedTemplate.unit}</span>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#5c4033]">{selectedTemplate.name} 已完成！</h3>
          <p className="text-sm text-gray-500 mt-1">功德无量，愿回向一切众生</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={goHome}
            className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            返回首页
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#8b2323] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            再修一课
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'countdown') {
    return (
      <div className="space-y-6 py-4">
        {/* 模板信息 */}
        <div className={`rounded-2xl p-4 ${selectedTemplate.bgColor} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{selectedTemplate.name}</h3>
              <p className="text-sm opacity-80">{selectedTemplate.subtitle}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold">{selectedTemplate.quantity}</span>
              <span className="text-sm ml-1">{selectedTemplate.unit}</span>
            </div>
          </div>
        </div>

        {/* 倒计时圆环 */}
        <div className="flex justify-center">
          <div className="relative">
            <svg className="w-52 h-52 transform -rotate-90">
              <circle cx="104" cy="104" r="96" stroke="#f0ebe3" strokeWidth="14" fill="none" />
              <circle
                cx="104" cy="104" r="96"
                stroke={selectedTemplate.color}
                strokeWidth="14"
                fill="none"
                strokeDasharray={2 * Math.PI * 96}
                strokeDashoffset={2 * Math.PI * 96 * (1 - progress)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold" style={{ color: selectedTemplate.color }}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-gray-500 mt-1">剩余时间</span>
            </div>
          </div>
        </div>

        {/* 进度说明 */}
        <div className="text-center text-sm text-gray-500">
          完成 = <span className="font-semibold text-[#5c4033]">{selectedTemplate.quantity} {selectedTemplate.unit}</span>
          &nbsp;·&nbsp;{selectedTemplate.durationSeconds / 60} 分钟标准时长
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
            style={{ background: `linear-gradient(135deg, ${selectedTemplate.color}, ${selectedTemplate.color}cc)` }}
          >
            {isRunning
              ? <Pause className="w-9 h-9" />
              : <Play className="w-9 h-9 ml-1" />
            }
          </button>
          <button
            onClick={reset}
            className="w-14 h-14 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shadow hover:bg-gray-200 active:scale-95 transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* 语音引导提示 */}
        {selectedTemplate.audioGuide && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Volume2 className="w-4 h-4" />
            <span>「{selectedTemplate.audioGuide}」</span>
          </div>
        )}
      </div>
    )
  }

  // Select phase
  return (
    <div className="space-y-4">
      {title && (
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* 模板选择 */}
      <div className="space-y-2">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => setSelectedTemplate(tpl)}
            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
              selectedTemplate.id === tpl.id
                ? `bg-gradient-to-r ${tpl.bgColor} text-white shadow-lg`
                : 'bg-white border border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
              selectedTemplate.id === tpl.id ? 'bg-white/20' : 'bg-[#faf8f5]'
            }`}>
              <span className="text-xl font-bold" style={{
                color: selectedTemplate.id === tpl.id ? 'white' : tpl.color
              }}>{tpl.quantity}</span>
              <span className="text-[10px]" style={{
                color: selectedTemplate.id === tpl.id ? 'rgba(255,255,255,0.8)' : '#9ca3af'
              }}>{tpl.unit}</span>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold">{tpl.name}</h3>
              <p className={`text-xs ${selectedTemplate.id === tpl.id ? 'text-white/80' : 'text-gray-500'}`}>
                {tpl.subtitle}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{Math.floor(tpl.durationSeconds / 60)}分{tpl.durationSeconds % 60 > 0 ? `${tpl.durationSeconds % 60}秒` : ''}</span>
              <p className={`text-[10px] ${selectedTemplate.id === tpl.id ? 'text-white/60' : 'text-gray-400'}`}>
                标准时长
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* 开始按钮 */}
      <button
        onClick={startPractice}
        className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform`}
        style={{ background: `linear-gradient(135deg, ${selectedTemplate.color}, ${selectedTemplate.color}cc)` }}
      >
        开始 {selectedTemplate.name}
      </button>
    </div>
  )
}

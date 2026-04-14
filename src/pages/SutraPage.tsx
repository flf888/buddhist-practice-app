import { useState, useEffect } from 'react'
import { BookOpen, ChevronRight, Flame, Play, Pause, Loader2 } from 'lucide-react'
import SmartCountdown from '../components/SmartCountdown'
import type { PracticeTemplate } from '../components/SmartCountdown'
import { templateApi, recordsApi, storage } from '../services/api'

const sutras = [
  {
    id: 1,
    name: '心经',
    sanskrit: '般若波罗蜜多心经',
    description: '大乘佛教核心经典，般若智慧的精华',
    quantity: 1,
    unit: '部',
    durationSeconds: 300,
    chapters: 1,
    icon: '✨',
    color: '#7c3aed',
    bgColor: 'from-purple-500 to-pink-500',
    isHot: true,
    text: `观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。

舍利子，色不异空，空不异色，色即是空，空即是色，受想行识，亦复如是。

舍利子，是诸法空相，不生不灭，不垢不净，不增不减。是故空中无色，无受想行识，无眼耳鼻舌身意，无色声香味触法，无眼界，乃至无意识界。

无无明，亦无无明尽，乃至无老死，亦无老死尽。无苦集灭道，无智亦无得。以无所得故，菩提萨埵，依般若波罗蜜多故，心无挂碍，无挂碍故，无有恐怖，远离颠倒梦想。`,
  },
  {
    id: 2,
    name: '阿弥陀经',
    sanskrit: '佛说阿弥陀经',
    description: '净土宗核心经典，讲述西方极乐世界',
    quantity: 1,
    unit: '部',
    durationSeconds: 900,
    chapters: 1,
    icon: '🪷',
    color: '#ea580c',
    bgColor: 'from-amber-500 to-orange-500',
    isHot: true,
    text: `如是我闻，一时佛在舍卫国，祇树给孤独园，与大比丘僧千二百五十人俱。

尔时佛告长老舍利弗，从是西方，过十万亿佛土，有世界名曰极乐，其土有佛，号阿弥陀，今现在说法。

舍利弗，彼土何故名为极乐？其国众生，无有众苦，但受诸乐，故名极乐。`,
  },
  {
    id: 3,
    name: '金刚经',
    sanskrit: '金刚般若波罗蜜经',
    description: '禅宗核心经典，破除一切执着',
    quantity: 1,
    unit: '部',
    durationSeconds: 1200,
    chapters: 32,
    icon: '⚔️',
    color: '#475569',
    bgColor: 'from-slate-600 to-gray-700',
    isHot: true,
    text: `如是我闻，一时佛在舍卫国，祇树给孤独园，与大比丘众千二百五十人俱。

尔时世尊食时，着衣持钵，入舍卫大城乞食。于其城中次第乞已，还至本处。饭食讫，收衣钵，洗足已，敷座而坐。`,
  },
]

export default function SutraPage() {
  const [smartTemplates, setSmartTemplates] = useState<PracticeTemplate[]>([])
  const [selectedSutra, setSelectedSutra] = useState<typeof sutras[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSmart, setShowSmart] = useState(false)
  const [completedToday, setCompletedToday] = useState(0)
  const [completedWeek, setCompletedWeek] = useState(0)
  const [completedTotal, setCompletedTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [templateData, statsData, weeklyData] = await Promise.all([
        templateApi.getTemplatesByType('nianjing'),
        recordsApi.getStats(),
        recordsApi.getWeekly()
      ])

      // 转换模板数据
      const colors = ['#7c3aed', '#ea580c', '#475569']
      const bgColors = ['from-purple-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-slate-600 to-gray-700']

      const convertedTemplates: PracticeTemplate[] = templateData.map((t, idx) => ({
        id: `template-${t.id}`,
        name: t.name,
        subtitle: t.voiceGuide || '诵经修行',
        quantity: t.quantity,
        unit: t.unit,
        durationSeconds: t.durationSeconds,
        audioGuide: t.voiceGuide || '开始诵经',
        color: colors[idx % colors.length],
        bgColor: bgColors[idx % bgColors.length],
        templateId: t.id,
      }))

      setSmartTemplates(convertedTemplates)
      setCompletedTotal(statsData.totalNianjing)

      // 计算今日诵经（1部=50经验）
      const today = new Date().toISOString().split('T')[0]
      const todayData = weeklyData.dailyData.find(d => d.date === today)
      setCompletedToday(todayData ? Math.floor(todayData.totalExp / 50) : 0)
      setCompletedWeek(Math.floor(weeklyData.weekTotal / 50))
    } catch (err) {
      console.error('加载数据失败:', err)
      setSmartTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (template: PracticeTemplate) => {
    const token = storage.getToken()
    if (!token || !template.templateId) return

    try {
      await recordsApi.createRecord({
        templateId: template.templateId,
        practiceType: 'nianjing',
        practiceName: template.name,
        quantity: template.quantity,
        unit: template.unit,
        durationSeconds: template.durationSeconds,
        practiceMode: 'smart',
        sessionType: 'general',
      })

      setCompletedToday((prev) => prev + template.quantity)
      setCompletedWeek((prev) => prev + template.quantity)
      setCompletedTotal((prev) => prev + template.quantity)
    } catch (err) {
      console.error('保存记录失败:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#8b2323]" />
      </div>
    )
  }

  // 经文详情页
  if (selectedSutra) {
    return (
      <div className="px-4 py-4 space-y-4">
        <button
          onClick={() => setSelectedSutra(null)}
          className="flex items-center gap-2 text-[#8b2323] font-medium"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          返回经文列表
        </button>

        {/* 经文头部 */}
        <div className={`bg-gradient-to-br ${selectedSutra.bgColor} rounded-2xl p-6 text-white`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{selectedSutra.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{selectedSutra.name}</h1>
              <p className="text-sm opacity-80">{selectedSutra.sanskrit}</p>
            </div>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">{selectedSutra.description}</p>
        </div>

        {/* 诵读进度 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#8b2323]" />
            经文内容
          </h3>
          <div className="bg-[#faf8f5] rounded-xl p-4 text-[#5c4033] leading-loose text-sm">
            <p className="mb-3 text-center font-bold text-base">南无本师释迦牟尼佛（三称）</p>
            <p className="mb-3 text-center text-xs text-gray-500">开经偈</p>
            <p className="mb-3 italic text-gray-600 leading-loose">
              无上甚深微妙法，百千万劫难遭遇，<br />我今见闻得受持，愿解如来真实义。
            </p>
            {selectedSutra.text.split('\n\n').map((para, i) => (
              <p key={i} className="mb-3">{para}</p>
            ))}
          </div>
        </div>

        {/* 音频播放器 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-[#8b2323] text-white flex items-center justify-center shadow"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">诵读音频</p>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full bg-[#8b2323] rounded-full ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{ width: '35%' }}
                />
              </div>
            </div>
            <span className="text-xs text-gray-400">05:20 / {Math.floor(selectedSutra.durationSeconds / 60)}分钟</span>
          </div>
        </div>

        <button
          onClick={() => setSelectedSutra(null)}
          className="w-full py-3 text-gray-500 flex items-center justify-center gap-2"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> 返回选择
        </button>
      </div>
    )
  }

  // 列表页
  return (
    <div className="px-4 py-4 space-y-4">
      {/* 头部 */}
      <div className="mb-2">
        <h1 className="text-xl font-bold text-gray-800">经典诵读</h1>
        <p className="text-sm text-gray-500 mt-1">持诵经典 · 智慧增长</p>
      </div>

      {/* 智能诵经切换 */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSmart(false)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            !showSmart ? 'bg-[#8b2323] text-white' : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          经文列表
        </button>
        <button
          onClick={() => setShowSmart(true)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1 ${
            showSmart ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          {showSmart && <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />}
          智能功课
        </button>
      </div>

      {/* 智能功课模式 */}
      {showSmart ? (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            选择诵经功课 → 点击开始 → 自动倒计时 → 时间到即完成1部
          </p>
          {smartTemplates.length > 0 ? (
            <SmartCountdown
              templates={smartTemplates}
              onComplete={handleComplete}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>请先登录后使用修行功能</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 经文列表 */}
          <div className="space-y-3">
            {sutras.map((sutra) => (
              <button
                key={sutra.id}
                onClick={() => setSelectedSutra(sutra)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sutra.bgColor} flex items-center justify-center text-2xl`}>
                    {sutra.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{sutra.name}</h3>
                      {sutra.isHot && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] rounded">热门</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{sutra.sanskrit}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{sutra.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{sutra.chapters}品</span>
                      <span>{Math.floor(sutra.durationSeconds / 60)}分钟</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* 统计 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#8b2323]" />
          诵经统计
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <p className="text-2xl font-bold text-amber-600">{completedToday}</p>
            <p className="text-xs text-gray-500">今日部数</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">{completedWeek}</p>
            <p className="text-xs text-gray-500">本周部数</p>
          </div>
          <div className="text-center p-3 bg-[#faf8f5] rounded-xl">
            <p className="text-2xl font-bold text-[#5c4033]">{completedTotal}</p>
            <p className="text-xs text-gray-500">累计总数</p>
          </div>
        </div>
      </div>
    </div>
  )
}

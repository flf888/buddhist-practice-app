import { useState } from 'react'
import {
  User, Settings, Bell, Moon, Sun, ChevronRight, Award,
  Flame, Calendar, TrendingUp, Target, Star, Crown,
  Heart, HelpCircle
} from 'lucide-react'

const levelInfo = {
  level: 3,
  title: '精进居士',
  nextLevel: 4,
  nextTitle: '念佛行者',
  currentExp: 15680,
  expForNext: 20000,
  progress: 78,
}

const stats = {
  totalDays: 89,
  streak: 15,
  totalNianfo: 45600,
  totalNianjing: 23,
  totalNianzhou: 2100,
  totalBaichan: 5,
  totalHours: 127,
}

const achievements = [
  { id: 1, name: '初发心', desc: '完成首次念佛', icon: '🌱', unlocked: true },
  { id: 2, name: '七日精进', desc: '连续修行7天', icon: '🔥', unlocked: true },
  { id: 3, name: '万遍功德', desc: '累计念佛一万遍', icon: '🙏', unlocked: true },
  { id: 4, name: '经文通读', desc: '读完整部经典', icon: '📖', unlocked: true },
  { id: 5, name: '三十日恒', desc: '连续修行30天', icon: '⛰️', unlocked: false },
  { id: 6, name: '十万功德', desc: '累计念佛十万遍', icon: '✨', unlocked: false },
  { id: 7, name: '菩萨同行', desc: '参与菩萨圣诞共修', icon: '🪷', unlocked: false },
  { id: 8, name: '圆满打七', desc: '完成一次打七共修', icon: '🏃', unlocked: false },
]

const weeklyData = [
  { day: '周一', value: 1200 },
  { day: '周二', value: 1500 },
  { day: '周三', value: 800 },
  { day: '周四', value: 1800 },
  { day: '周五', value: 2000 },
  { day: '周六', value: 2200 },
  { day: '周日', value: 1600 },
]

export default function ProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const maxValue = Math.max(...weeklyData.map((d) => d.value))

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#8b2323] to-[#a83232] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">善知识</h1>
            <p className="text-sm opacity-90">精进修行中</p>
            <div className="flex items-center gap-2 mt-1">
              <Crown className="w-4 h-4 text-[#c9a227]" />
              <span className="text-sm text-[#c9a227]">Lv.{levelInfo.level} {levelInfo.title}</span>
            </div>
          </div>
          <button className="p-2 rounded-lg bg-white/10">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Level Progress */}
        <div className="mt-4 bg-white/10 rounded-xl p-3">
          <div className="flex justify-between text-xs mb-2">
            <span>当前经验 {levelInfo.currentExp.toLocaleString()}</span>
            <span>升级需要 {levelInfo.expForNext.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c9a227] rounded-full transition-all"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <p className="text-xs text-center mt-2 opacity-80">
            距离 Lv.{levelInfo.nextLevel} {levelInfo.nextTitle} 还差 {(levelInfo.expForNext - levelInfo.currentExp).toLocaleString()} 经验
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-[#8b2323] mb-2">
            <Flame className="w-5 h-5" />
            <span className="font-semibold">连续修行</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.streak}</p>
          <p className="text-xs text-gray-500">天</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-[#c9a227] mb-2">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">累计天数</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalDays}</p>
          <p className="text-xs text-gray-500">天</p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">本周修行</h2>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex items-end justify-between h-24 gap-2">
          {weeklyData.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-gradient-to-t from-[#8b2323] to-[#c9a227] rounded-t-lg transition-all"
                style={{ height: `${(day.value / maxValue) * 80}px` }}
              />
              <span className="text-xs text-gray-500">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500">本周念佛</span>
          <span className="font-semibold text-[#8b2323]">{(weeklyData.reduce((a, b) => a + b.value, 0)).toLocaleString()} 遍</span>
        </div>
      </div>

      {/* All Stats */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-4">修行统计</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="text-lg">🙏</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{(stats.totalNianfo / 10000).toFixed(1)}万</p>
              <p className="text-xs text-gray-500">念佛总数</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <span className="text-lg">📖</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{stats.totalNianjing}</p>
              <p className="text-xs text-gray-500">念经总数</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{stats.totalNianzhou}</p>
              <p className="text-xs text-gray-500">念咒总数</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <span className="text-lg">❤️</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{stats.totalBaichan}</p>
              <p className="text-xs text-gray-500">拜忏总数</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">成就徽章</h2>
          <span className="text-xs text-gray-500">{achievements.filter((a) => a.unlocked).length}/{achievements.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`flex flex-col items-center p-2 rounded-xl ${
                ach.unlocked ? 'bg-[#faf8f5]' : 'bg-gray-100 opacity-50'
              }`}
            >
              <span className={`text-2xl ${ach.unlocked ? '' : 'grayscale'}`}>{ach.icon}</span>
              <span className={`text-[10px] mt-1 ${ach.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                {ach.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-[#c9a227]" />
            <span className="font-medium text-gray-700">我的收藏</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#8b2323]" />
            <span className="font-medium text-gray-700">我的功德</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-500" />
            <span className="font-medium text-gray-700">修行目标</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">提醒设置</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100">
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-gray-500" />
            ) : (
              <Sun className="w-5 h-5 text-gray-500" />
            )}
            <span className="font-medium text-gray-700">深色模式</span>
          </div>
          <div
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-12 h-6 rounded-full relative transition-all ${
              isDarkMode ? 'bg-[#8b2323]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${
                isDarkMode ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </div>
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">帮助与反馈</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-medium text-gray-700">分享给好友</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Version */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">佛光普照 v1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">愿一切众生皆得安乐</p>
      </div>
    </div>
  )
}

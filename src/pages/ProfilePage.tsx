import { useState, useEffect, useCallback } from 'react'
import {
  User, Bell, Moon, Sun, ChevronRight, Award,
  Flame, Calendar, TrendingUp, Target, Star, Crown,
  Heart, HelpCircle, Minus, Plus, LogOut, Shield,
  MessageCircle, Loader2
} from 'lucide-react'
import {
  authApi,
  settingsApi,
  userApi,
  recordsApi,
  achievementsApi,
  storage,
  type UserProfile,
  type PracticeStats,
  type Achievement
} from '../services/api'

// 遍数配置项
const countSettings = [
  { key: 'morning_nianfo', label: '早课念佛', default: 10, min: 1, max: 108, unit: '遍' },
  { key: 'morning_chant', label: '早课持咒', default: 7, min: 1, max: 21, unit: '遍' },
  { key: 'morning_sutra', label: '早课诵经', default: 1, min: 1, max: 3, unit: '部' },
  { key: 'morning_chanhui', label: '早课忏悔', default: 3, min: 1, max: 7, unit: '遍' },
  { key: 'evening_nianfo', label: '晚课念佛', default: 108, min: 1, max: 108, unit: '遍' },
  { key: 'evening_chant', label: '晚课持咒', default: 7, min: 1, max: 21, unit: '遍' },
  { key: 'evening_sutra', label: '晚课诵经', default: 1, min: 1, max: 3, unit: '部' },
  { key: 'evening_chanhui', label: '晚课忏悔', default: 3, min: 1, max: 7, unit: '遍' },
  { key: 'baichan_default', label: '拜忏默认次数', default: 21, min: 3, max: 108, unit: '拜' },
]

const defaultLevelInfo = {
  level: 1,
  title: '初学居士',
  nextLevel: 2,
  nextTitle: '精进居士',
  currentExp: 0,
  expForNext: 100,
  progress: 0,
}

const defaultStats = {
  totalDays: 0,
  streak: 0,
  totalNianfo: 0,
  totalNianjing: 0,
  totalNianzhou: 0,
  totalBaichan: 0,
}

export default function ProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginStep, setLoginStep] = useState<'choice' | 'phone' | 'bind'>('choice')
  const [phone, setPhone] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [userSettings, setUserSettings] = useState<Record<string, number>>({})
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [codeSent, setCodeSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 用户数据
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<PracticeStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [weeklyData, setWeeklyData] = useState<{ day: string; value: number }[]>([])

  // 检查登录状态
  useEffect(() => {
    const token = storage.getToken()
    if (token) {
      setIsLoggedIn(true)
      loadUserData()
    }
  }, [])

  // 加载用户数据
  const loadUserData = async () => {
    try {
      setLoading(true)
      const [profileData, statsData, achievementsData, weekly, settingsData] = await Promise.all([
        userApi.getProfile(),
        recordsApi.getStats(),
        achievementsApi.getAchievements(),
        recordsApi.getWeekly(),
        settingsApi.getSettings()
      ])

      setProfile(profileData)
      setStats(statsData)
      setAchievements(achievementsData)
      setWeeklyData(weekly.dailyData.map(d => ({ day: d.day, value: d.totalExp })))
      // 转换UserSettings为普通对象
      const settingsObj: Record<string, number> = { ...settingsData }
      setUserSettings(settingsObj)
    } catch (err) {
      console.error('加载用户数据失败:', err)
      // 如果是token失效，跳转到未登录状态
      if (String(err).includes('Token')) {
        setIsLoggedIn(false)
        storage.removeToken()
      }
    } finally {
      setLoading(false)
    }
  }

  // 计算等级信息
  const getLevelInfo = useCallback(() => {
    if (!profile) return defaultLevelInfo
    const currentExp = profile.totalExp
    const level = profile.level
    const expForNext = profile.expForNextLevel
    const prevExp = level > 1 ? (level - 1) * 100 : 0
    const progress = Math.round(((currentExp - prevExp) / (expForNext - prevExp)) * 100)

    return {
      level,
      title: profile.title,
      nextLevel: Math.min(level + 1, 20),
      nextTitle: getTitleByLevel(level + 1),
      currentExp,
      expForNext,
      progress: Math.min(progress, 100),
    }
  }, [profile])

  const getTitleByLevel = (level: number) => {
    if (level <= 2) return '初学居士'
    if (level <= 4) return '精进居士'
    if (level <= 6) return '念佛行者'
    if (level <= 8) return '清净行者'
    if (level <= 10) return '智慧行者'
    if (level <= 15) return '菩萨行者'
    return '圆满行者'
  }

  const maxValue = weeklyData.length > 0 ? Math.max(...weeklyData.map((d) => d.value)) : 1

  // 发送验证码
  const sendVerifyCode = async () => {
    if (phone.length !== 11) return
    setSendingCode(true)
    setError('')
    try {
      await authApi.sendCode(phone)
      setCodeSent(true)
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError(String(err))
    } finally {
      setSendingCode(false)
    }
  }

  // 确认登录
  const confirmLogin = async () => {
    if (verifyCode.length !== 6) return
    setLoading(true)
    setError('')
    try {
      const result = await authApi.login(phone, verifyCode)
      storage.setToken(result.token)
      setIsLoggedIn(true)
      setLoginStep('choice')
      await loadUserData()
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  // 退出登录
  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.error('退出失败:', err)
    }
    storage.removeToken()
    setIsLoggedIn(false)
    setProfile(null)
    setStats(null)
    setAchievements([])
    setWeeklyData([])
  }

  // 调整设置
  const adjustSetting = async (key: string, delta: number, min: number, max: number) => {
    const currentValue = userSettings[key] || countSettings.find(s => s.key === key)?.default || 0
    const newValue = Math.min(max, Math.max(min, currentValue + delta))

    const newSettings = { ...userSettings, [key]: newValue }
    setUserSettings(newSettings)

    try {
      await settingsApi.updateSettings({ [key]: newValue })
    } catch (err) {
      console.error('保存设置失败:', err)
      // 回滚
      setUserSettings(userSettings)
    }
  }

  const getSettingValue = (key: string) => {
    if (userSettings[key] !== undefined) return userSettings[key]
    return countSettings.find((s) => s.key === key)?.default || 0
  }

  // 未登录 - 登录页
  if (!isLoggedIn) {
    return (
      <div className="px-4 py-4 space-y-4">
        {/* 未登录头部 */}
        <div className="bg-gradient-to-br from-[#8b2323] to-[#a83232] rounded-2xl p-6 text-white text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold mb-1">欢迎来到佛光普照</h2>
          <p className="text-sm opacity-80">登录后同步修行数据，配置个人功课</p>
        </div>

        {error && (
          <div className="bg-red-50 rounded-xl p-3 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {loginStep === 'choice' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center">请选择登录方式</p>

            {/* 微信登录 */}
            <button
              onClick={() => {
                const confirmed = window.confirm('即将调起微信授权（演示模式：点击确认继续）')
                if (confirmed) {
                  setLoginStep('phone')
                }
              }}
              className="w-full bg-gradient-to-r from-[#07c160] to-[#06ad56] text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <MessageCircle className="w-6 h-6" />
              微信授权登录
            </button>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              登录即表示同意<span className="text-[#8b2323]">《用户协议》</span>和<span className="text-[#8b2323]">《隐私政策》</span>
            </p>
          </div>
        )}

        {loginStep === 'phone' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-1">绑定手机号</h3>
              <p className="text-xs text-gray-500 mb-4">根据国家法规，需绑定手机号完成注册</p>

              {/* 手机号 */}
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-1 block">手机号</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="请输入手机号"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8b2323]"
                  />
                </div>
              </div>

              {/* 验证码 */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1 block">验证码</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入验证码"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8b2323]"
                  />
                  <button
                    onClick={sendVerifyCode}
                    disabled={phone.length !== 11 || sendingCode || countdown > 0}
                    className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      phone.length !== 11 || sendingCode || countdown > 0
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-[#8b2323] text-white'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s` : codeSent ? '重新获取' : '获取验证码'}
                  </button>
                </div>
                {/* 测试环境提示 */}
                <div className="mt-2 bg-amber-50 rounded-lg p-2 border border-amber-200">
                  <p className="text-xs text-amber-700">
                    <span className="font-semibold">测试模式：</span>
                    验证码固定为 <span className="font-bold text-amber-900">123456</span>，无需真实获取
                  </p>
                </div>
              </div>

              {/* 确认绑定 */}
              <button
                onClick={confirmLogin}
                disabled={phone.length !== 11 || verifyCode.length !== 6 || loading}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  phone.length === 11 && verifyCode.length === 6
                    ? 'bg-[#8b2323] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                确认绑定
              </button>
            </div>

            <button
              onClick={() => setLoginStep('choice')}
              className="w-full text-center text-sm text-gray-500 py-2"
            >
              返回选择登录方式
            </button>
          </div>
        )}
      </div>
    )
  }

  // 加载中
  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#8b2323]" />
      </div>
    )
  }

  const levelInfo = getLevelInfo()
  const displayStats: PracticeStats = stats ? {
    ...stats,
    streakDays: stats.streakDays || 0,
    totalExp: stats.totalExp || 0
  } : {
    totalNianfo: defaultStats.totalNianfo,
    totalNianjing: defaultStats.totalNianjing,
    totalNianzhou: defaultStats.totalNianzhou,
    totalBaichan: defaultStats.totalBaichan,
    totalExp: 0,
    totalDays: defaultStats.totalDays,
    streakDays: defaultStats.streak,
    lastPracticeDate: undefined
  }

  // 登录后 - 设置页
  if (showSettings) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setShowSettings(false)} className="text-[#8b2323] font-medium">
            ← 返回
          </button>
          <h2 className="text-lg font-bold text-gray-800">修行遍数设置</h2>
          <div />
        </div>

        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">提示：</span>
            以下配置与您的账号绑定。登录后可在各修行页面直接使用自定义遍数。退出登录后恢复默认值。
          </p>
        </div>

        {/* 早课设置 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">早课遍数</h3>
          <p className="text-xs text-gray-500 mb-4">礼敬 → 诵经 → 持咒 → 念佛 → 忏悔 → 回向</p>
          <div className="space-y-4">
            {countSettings.filter((s) => s.key.startsWith('morning')).map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{setting.label}</p>
                  <p className="text-xs text-gray-400">
                    可调范围：{setting.min}~{setting.max}{setting.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustSetting(setting.key, -1, setting.min, setting.max)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-[#8b2323]">
                    {getSettingValue(setting.key)}{setting.unit}
                  </span>
                  <button
                    onClick={() => adjustSetting(setting.key, 1, setting.min, setting.max)}
                    className="w-8 h-8 rounded-full bg-[#8b2323] text-white flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 晚课设置 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">晚课遍数</h3>
          <p className="text-xs text-gray-500 mb-4">礼敬 → 诵经 → 持咒 → 忏悔 → 念佛 → 回向</p>
          <div className="space-y-4">
            {countSettings.filter((s) => s.key.startsWith('evening')).map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{setting.label}</p>
                  <p className="text-xs text-gray-400">
                    可调范围：{setting.min}~{setting.max}{setting.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustSetting(setting.key, -1, setting.min, setting.max)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-[#8b2323]">
                    {getSettingValue(setting.key)}{setting.unit}
                  </span>
                  <button
                    onClick={() => adjustSetting(setting.key, 1, setting.min, setting.max)}
                    className="w-8 h-8 rounded-full bg-[#8b2323] text-white flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 拜忏设置 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">拜忏遍数</h3>
          <p className="text-xs text-gray-500 mb-4">拜忏默认次数（模板中显示为默认值）</p>
          <div className="space-y-4">
            {countSettings.filter((s) => s.key === 'baichan_default').map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{setting.label}</p>
                  <p className="text-xs text-gray-400">
                    可调范围：{setting.min}~{setting.max}{setting.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustSetting(setting.key, -1, setting.min, setting.max)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-[#8b2323]">
                    {getSettingValue(setting.key)}{setting.unit}
                  </span>
                  <button
                    onClick={() => adjustSetting(setting.key, 1, setting.min, setting.max)}
                    className="w-8 h-8 rounded-full bg-[#8b2323] text-white flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 保存提示 */}
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-center">
          <p className="text-xs text-emerald-700">设置已自动保存，登录后各修行页面将使用您的自定义遍数</p>
        </div>

        <button
          onClick={() => setShowSettings(false)}
          className="w-full py-3 text-[#8b2323] text-center font-medium"
        >
          返回个人中心
        </button>
      </div>
    )
  }

  // 登录后 - 正常个人中心
  return (
    <div className="px-4 py-4 space-y-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#8b2323] to-[#a83232] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{profile?.nickname || '善知识'}</h1>
              <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3 text-emerald-300" />
                <span className="text-xs text-emerald-200">已认证</span>
              </div>
            </div>
            <p className="text-sm opacity-90">精进修行中</p>
            <div className="flex items-center gap-2 mt-1">
              <Crown className="w-4 h-4 text-[#c9a227]" />
              <span className="text-sm text-[#c9a227]">Lv.{levelInfo.level} {levelInfo.title}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-white/10"
            title="退出登录"
          >
            <LogOut className="w-5 h-5" />
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
          <p className="text-3xl font-bold text-gray-800">{displayStats.streakDays}</p>
          <p className="text-xs text-gray-500">天</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-[#c9a227] mb-2">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">累计天数</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{displayStats.totalDays}</p>
          <p className="text-xs text-gray-500">天</p>
        </div>
      </div>

      {/* 修行设置入口 */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">修行遍数设置</h3>
              <p className="text-xs text-gray-500">自定义早晚课各环节遍数</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
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
                style={{ height: `${maxValue > 0 ? (day.value / maxValue) * 80 : 0}px`, minHeight: day.value > 0 ? '4px' : '0' }}
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
              <p className="text-xl font-bold text-gray-800">{(displayStats.totalNianfo / 10000).toFixed(1)}万</p>
              <p className="text-xs text-gray-500">念佛总数</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <span className="text-lg">📖</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{displayStats.totalNianjing}</p>
              <p className="text-xs text-gray-500">诵经总数</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{displayStats.totalNianzhou}</p>
              <p className="text-xs text-gray-500">持咒总数</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <span className="text-lg">❤️</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{displayStats.totalBaichan}</p>
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
          {achievements.slice(0, 8).map((ach) => (
            <div
              key={ach.id}
              className={`flex flex-col items-center p-2 rounded-xl ${
                ach.unlocked ? 'bg-[#faf8f5]' : 'bg-gray-100 opacity-50'
              }`}
              title={ach.description}
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
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
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
        <p className="text-xs text-gray-400">佛光普照 v1.3.0</p>
        <p className="text-xs text-gray-400 mt-1">愿一切众生皆得安乐</p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Home, BookOpen, User, Repeat, Sparkles, Heart } from 'lucide-react'
import HomePage from './pages/HomePage'
import PracticePage from './pages/PracticePage'
import SutraPage from './pages/SutraPage'
import FestivalPage from './pages/FestivalPage'
import ProfilePage from './pages/ProfilePage'
import ChantPage from './pages/ChantPage'
import BaichanPage from './pages/BaichanPage'
import './index.css'

type TabType = 'home' | 'practice' | 'sutra' | 'festival' | 'profile' | 'chant' | 'baichan'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home')

  const tabs = [
    { id: 'home' as TabType, label: '首页', icon: Home },
    { id: 'practice' as TabType, label: '念佛', icon: Repeat },
    { id: 'chant' as TabType, label: '念咒', icon: Sparkles },
    { id: 'baichan' as TabType, label: '拜忏', icon: Heart },
    { id: 'sutra' as TabType, label: '念经', icon: BookOpen },
    { id: 'profile' as TabType, label: '我的', icon: User },
  ]

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />
      case 'practice':
        return <PracticePage />
      case 'sutra':
        return <SutraPage />
      case 'festival':
        return <FestivalPage />
      case 'profile':
        return <ProfilePage />
      case 'chant':
        return <ChantPage />
      case 'baichan':
        return <BaichanPage />
      default:
        return <HomePage onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] max-w-md mx-auto relative pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8b2323] to-[#a83232] text-white px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🙏 佛光普照</h1>
            <p className="text-sm opacity-90">修行之路 · 每日精进</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Lv.3 精进</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-4">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-2 py-2 safe-area-pb">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#8b2323] bg-[#8b2323]/10'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default App

import { useEffect, useRef, useState } from 'react'
import useTheme from './hooks/useTheme.js'
import useServerStatus from './hooks/useServerStatus.js'
import useServerHistory from './hooks/useServerHistory.js'
import useDerivedStats from './hooks/useDerivedStats.js'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Overview from './pages/Overview.jsx'
import Players from './pages/Players.jsx'
import Analytics from './pages/Analytics.jsx'
import ServerInfo from './pages/ServerInfo.jsx'
import './App.css'

function formatToastMessage(isOnline) {
  return isOnline ? 'Server is now online' : 'Server is now offline'
}

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  const { theme, toggleTheme } = useTheme()
  const { status, geo } = useServerStatus()
  const history = useServerHistory()

  const derived = useDerivedStats({
    history: history.history,
    peak: history.peak,
    incidents: history.incidents,
  })

  useEffect(() => {
    if (!status.retrievedAt) return
    history.addEntry(status)
  }, [status.retrievedAt])

  useEffect(() => {
    const handleServerStatusChange = (event) => {
      const isOnline = Boolean(event?.detail?.online)

      setToast({
        id: `${Date.now()}-${isOnline ? 'online' : 'offline'}`,
        message: formatToastMessage(isOnline),
        tone: isOnline ? 'online' : 'offline',
      })
    }

    window.addEventListener('serverStatusChange', handleServerStatusChange)

    return () => {
      window.removeEventListener('serverStatusChange', handleServerStatusChange)
    }
  }, [])

  useEffect(() => {
    if (!toast) return undefined

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, 4000)

    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current)
        toastTimerRef.current = null
      }
    }
  }, [toast])

  let activeView = null

  if (activePage === 'Overview') {
    activeView = <Overview status={status} history={history} derived={derived} />
  } else if (activePage === 'Players') {
    activeView = <Players status={status} history={history} derived={derived} />
  } else if (activePage === 'Analytics') {
    activeView = <Analytics status={status} history={history} derived={derived} />
  } else if (activePage === 'ServerInfo') {
    activeView = <ServerInfo status={status} geo={geo} />
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="min-h-screen min-w-0 flex-1 pl-56">
        <TopBar
          theme={theme}
          onThemeToggle={toggleTheme}
          serverName="SurvivorSMP"
          isOnline={Boolean(status.online)}
        />

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{activeView}</div>
        </div>
      </main>

      {toast ? (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={[
            'app-toast fixed bottom-4 right-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl',
            toast.tone === 'online'
              ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-50'
              : 'border-rose-400/30 bg-rose-500/15 text-rose-50',
          ].join(' ')}
        >
          <div className="text-sm font-semibold">{toast.message}</div>
        </div>
      ) : null}
    </div>
  )
}

export default App

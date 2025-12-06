import { useState, useMemo } from 'react'
import EpisodeList from './components/EpisodeList'
import AudioPlayer from './components/AudioPlayer'
import Transcript from './components/Transcript'
import { ThemeProvider } from './components/ThemeProvider'
import ThemeToggle from './components/ThemeToggle'
import Footer from './components/Footer'
// We will import data, assuming it exists (might need to handle if script hasn't finished, but we know it generated episodes.json)
import episodesData from './data/episodes.json'

function AppContent() {
  const [currentEpisodeId, setCurrentEpisodeId] = useState(episodesData[0]?.id || 0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentEpisode = useMemo(() =>
    episodesData.find(ep => ep.id === currentEpisodeId) || episodesData[0],
    [currentEpisodeId]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300 relative selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
      {/* Light mode ambient background mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden dark:hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-200/30 blur-[100px]" />
      </div>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50 flex gap-2">
        <ThemeToggle />
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-indigo-600 rounded-full shadow-lg text-white hover:bg-indigo-700 transition-colors"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar: Episode List */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-96
        glass-panel border-r border-zinc-200 dark:border-zinc-800/50 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/50 flex justify-between items-center bg-white/50 dark:bg-transparent">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.jpg" alt="EnglishPod Logo" className="w-10 h-10 rounded-full object-cover shadow-md" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">
                EnglishPod
              </h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Learn English through 300+ conversations at various levels.</p>
          </div>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>

        <EpisodeList
          episodes={episodesData}
          currentId={currentEpisodeId}
          onSelect={(id) => {
            setCurrentEpisodeId(id);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative w-full lg:w-auto h-full overflow-hidden bg-white/30 dark:bg-transparent">

        {/* Motivational Banner */}
        <div className="w-full text-center py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30">
          <p className="text-xs lg:text-sm font-medium text-indigo-800 dark:text-indigo-200 px-4">
            You are building something great! Mastering English takes patience, but you have the power. Keep going, and never stop challenging yourself.
          </p>
        </div>

        {/* Transcript Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-4xl mx-auto min-h-full flex flex-col px-4 lg:px-8 pb-8">

            <div className="flex-1 space-y-6">
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  {currentEpisode.level || 'General'}
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {currentEpisode.title}
                </h2>
              </div>

              <Transcript episode={currentEpisode} />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Player + Footer */}
        <div className="flex-none z-30 glass-panel border-t border-zinc-200 dark:border-zinc-800/50 backdrop-blur-2xl bg-white/80 dark:bg-zinc-900/95 flex flex-col">
          <div className="p-4 lg:p-6 pb-2 lg:pb-4">
            <div className="max-w-4xl mx-auto">
              <AudioPlayer episode={currentEpisode} />
            </div>
          </div>

          <Footer />
        </div>

      </div>
    </div >
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App

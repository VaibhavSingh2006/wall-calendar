import { useState, useEffect } from 'react'
import HeroSection, { MONTH_THEMES } from './components/HeroSection'
import CalendarGrid from './components/CalendarGrid'
import NotesPanel from './components/NotesPanel'
import { format } from 'date-fns'
import './index.css'

const MONTH_GRADIENTS = {
  0:  'linear-gradient(135deg, #1a56db, #3b82f6)',
  1:  'linear-gradient(135deg, #db1a6b, #f472b6)',
  2:  'linear-gradient(135deg, #16a34a, #4ade80)',
  3:  'linear-gradient(135deg, #0891b2, #22d3ee)',
  4:  'linear-gradient(135deg, #059669, #34d399)',
  5:  'linear-gradient(135deg, #ea580c, #fb923c)',
  6:  'linear-gradient(135deg, #d97706, #fbbf24)',
  7:  'linear-gradient(135deg, #dc2626, #f87171)',
  8:  'linear-gradient(135deg, #b45309, #d97706)',
  9:  'linear-gradient(135deg, #c2410c, #f97316)',
  10: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
  11: 'linear-gradient(135deg, #1e40af, #3b82f6)',
}

function WeatherWidget({ selectedDate, themeColor, themeGradient }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedDate) return
    setLoading(true)
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const url = `https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Kolkata&start_date=${dateStr}&end_date=${dateStr}`
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setWeather({
          code: data.daily.weathercode[0],
          max: data.daily.temperature_2m_max[0],
          min: data.daily.temperature_2m_min[0],
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedDate])

  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️'
    if (code <= 3) return '⛅'
    if (code <= 67) return '🌧️'
    if (code <= 77) return '❄️'
    if (code <= 99) return '⛈️'
    return '🌡️'
  }

  if (!selectedDate) return null

  return (
    <div className="weather-widget" style={{ background: themeGradient || themeColor }}>
      <div className="weather-date">{format(selectedDate, 'EEE, MMM d')}</div>
      {loading && <div className="weather-loading">Loading...</div>}
      {weather && (
        <div className="weather-info">
          <span className="weather-emoji">{getWeatherEmoji(weather.code)}</span>
          <span className="weather-temp">
            {Math.round(weather.max)}° / {Math.round(weather.min)}°C
          </span>
        </div>
      )}
    </div>
  )
}

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [notesOpen, setNotesOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('calendar-dark') === 'true'
  )

  const themeColor = MONTH_THEMES[currentMonth.getMonth()].color
  const themeGradient = MONTH_GRADIENTS[currentMonth.getMonth()]

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('calendar-dark', next)
  }

  const handleRangeChange = (start, end) => {
    setStartDate(start)
    setEndDate(end)
    if (start && end) setNotesOpen(true)
  }

  return (
    <div className={`app-bg ${darkMode ? 'dark' : ''}`}>
      <div className={`calendar-card ${darkMode ? 'dark' : ''}`}>

        <div className="calendar-main">
          <HeroSection currentMonth={currentMonth} />
          <CalendarGrid
            onMonthChange={setCurrentMonth}
            onRangeChange={handleRangeChange}
            themeColor={themeColor}
            themeGradient={themeGradient}
            darkMode={darkMode}
            onToggleDark={toggleDark}
          />
          <WeatherWidget
            selectedDate={startDate}
            themeColor={themeColor}
            themeGradient={themeGradient}
          />
        </div>

        <button
          className="notes-toggle-btn"
          style={{ background: themeGradient }}
          onClick={() => setNotesOpen(!notesOpen)}
        >
          <span className="notes-toggle-icon">📝</span>
          <span className="notes-toggle-label">
            {notesOpen ? 'Close Notes' : 'My Notes'}
          </span>
        </button>

        {notesOpen && (
          <div className="notes-backdrop" onClick={() => setNotesOpen(false)} />
        )}

        <div className={`notes-drawer ${notesOpen ? 'notes-drawer-open' : ''}`}>
          <div className="notes-drawer-header" style={{ background: themeGradient }}>
            <span>📝 My Notes</span>
            <button className="notes-close-btn" onClick={() => setNotesOpen(false)}>✕</button>
          </div>
          <NotesPanel
            currentMonth={currentMonth}
            startDate={startDate}
            endDate={endDate}
            themeColor={themeColor}
          />
        </div>

      </div>
    </div>
  )
}

export default App
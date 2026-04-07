import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  format, getISOWeek,
  startOfMonth, endOfMonth,
  startOfWeek, endOfWeek,
  addDays, addMonths, subMonths,
  isSameMonth, isSameDay,
  isWithinInterval, isAfter, isBefore,
  differenceInCalendarDays, parse, isValid,
} from 'date-fns'
import './CalendarGrid.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MOODS = ['😊', '😢', '😡', '😴', '🤔', '🎉', '❤️', '💪']

const HOLIDAYS = {
  '01-26': 'Republic Day', '03-25': 'Holi',
  '04-14': 'Ambedkar Jayanti', '04-18': 'Good Friday',
  '05-12': 'Buddha Purnima', '08-15': 'Independence Day',
  '08-27': 'Janmashtami', '10-02': 'Gandhi Jayanti',
  '10-20': 'Dussehra', '11-05': 'Diwali', '12-25': 'Christmas',
}

const load = (key, def) => {
  try { return JSON.parse(localStorage.getItem(key) || def) }
  catch { return JSON.parse(def) }
}

const parseSearchDate = (input) => {
  const formats = [
    'dd MMM yyyy','dd MMMM yyyy','MMM dd yyyy','MMMM dd yyyy',
    'dd/MM/yyyy','MM/dd/yyyy','yyyy-MM-dd',
    'dd MMM','MMM dd','dd MMMM','MMMM dd',
  ]
  const yr = new Date().getFullYear()
  for (const fmt of formats) {
    try {
      const p = parse(input.trim(), fmt, new Date())
      if (isValid(p)) return p
      const p2 = parse(`${input.trim()} ${yr}`, `${fmt} yyyy`, new Date())
      if (isValid(p2)) return p2
    } catch {}
  }
  const n = new Date(input)
  return isValid(n) ? n : null
}

const createConfetti = (container) => {
  const colors = ['#f97316','#06b6d4','#8b5cf6','#ec4899','#10b981','#f59e0b','#ef4444']
  for (let i = 0; i < 36; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-piece'
    el.style.cssText = `
      left:${40+Math.random()*20}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${5+Math.random()*6}px;height:${5+Math.random()*6}px;
      border-radius:${Math.random()>.5?'50%':'2px'};
      animation-delay:${Math.random()*.4}s;
      animation-duration:${.8+Math.random()*.6}s;
      --dx:${-60+Math.random()*120}px;
      --dy:${-80+Math.random()*-60}px;
      --rot:${Math.random()*720}deg;
    `
    container.appendChild(el)
    setTimeout(() => el.remove(), 1500)
  }
}

const createCelebrationConfetti = () => {
  const colors = ['#f97316','#06b6d4','#8b5cf6','#ec4899','#10b981','#f59e0b','#ef4444','#3b82f6']
  const container = document.createElement('div')
  container.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:999999;overflow:hidden;`
  const card = document.querySelector('.calendar-card') || document.body
  card.style.position = 'relative'
  card.appendChild(container)
  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div')
    el.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      top:-20px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*8}px;
      height:${6+Math.random()*8}px;
      border-radius:${Math.random()>.5?'50%':'2px'};
      animation:celebrationFall ${1.5+Math.random()*2}s ease-in forwards;
      animation-delay:${Math.random()*1}s;
      --dx:${-80+Math.random()*160}px;
      --rot:${Math.random()*720}deg;
    `
    container.appendChild(el)
  }
  setTimeout(() => container.remove(), 4000)
}

function MiniMonthView({ month, themeColor, themeGradient, eventLabels, moods, pins, darkMode, onDayClick }) {
  const monthStart = startOfMonth(month)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = endOfWeek(endOfMonth(month))
  const today = new Date()
  const days = []
  let day = gridStart
  while (day <= gridEnd) { days.push(day); day = addDays(day, 1) }
  const getNoteForDay = (d) => localStorage.getItem(`note-${format(d,'yyyy-MM-dd')}`) || ''

  return (
    <div className={`mini-month ${darkMode ? 'dark' : ''}`}>
      <div className="mini-month-header" style={{ background: themeGradient || themeColor }}>
        <span className="mini-month-name">{format(month, 'MMMM yyyy')}</span>
      </div>
      <div className="mini-weekday-row">
        {WEEKDAYS.map(d => <div key={d} className="mini-weekday">{d[0]}</div>)}
      </div>
      <div className="mini-day-grid">
        {days.map((d, i) => {
          const dayKey = format(d, 'yyyy-MM-dd')
          const isToday = isSameDay(d, today)
          const inMonth = isSameMonth(d, month)
          const hasEvent = !!eventLabels[dayKey]
          const hasMood = !!moods[dayKey]
          const isPinned = pins.includes(dayKey)
          const hasNote = getNoteForDay(d).trim().length > 0
          const isHoliday = !!HOLIDAYS[format(d, 'MM-dd')]
          return (
            <div key={i}
              className={`mini-day ${!inMonth ? 'mini-other-month' : ''} ${isToday ? 'mini-today' : ''}`}
              style={isToday ? { background: themeGradient || themeColor, color: 'white' } : {}}
              onClick={() => onDayClick && onDayClick(d)}
            >
              <span>{format(d, 'd')}</span>
              {inMonth && (hasEvent || hasMood || isPinned || hasNote || isHoliday) && (
                <div className="mini-dots">
                  {isHoliday && <span className="mini-dot" style={{ background: '#ef4444' }} />}
                  {hasNote && <span className="mini-dot" style={{ background: themeColor }} />}
                  {hasEvent && <span className="mini-dot" style={{ background: '#10b981' }} />}
                  {hasMood && <span className="mini-dot" style={{ background: '#f59e0b' }} />}
                  {isPinned && <span className="mini-dot" style={{ background: '#8b5cf6' }} />}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CalendarGrid({ onMonthChange, onRangeChange, themeColor='#1a56db', themeGradient, darkMode, onToggleDark }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)
  const [pageAnim, setPageAnim] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [highlightDate, setHighlightDate] = useState(null)
  const [pins, setPins] = useState(() => load('calendar-pins', '[]'))
  const [moods, setMoods] = useState(() => load('calendar-moods', '{}'))
  const [eventLabels, setEventLabels] = useState(() => load('calendar-events', '{}'))
  const [contextMenu, setContextMenu] = useState(null)
  const [labelInput, setLabelInput] = useState('')
  const [multiView, setMultiView] = useState(false)
  const [celebration, setCelebration] = useState(null)
  const [dragKey, setDragKey] = useState(null)
  const [dragOverKey, setDragOverKey] = useState(null)

  const searchInputRef = useRef(null)
  const labelInputRef = useRef(null)
  const contextMenuRef = useRef(null)
  const touchStartY = useRef(null)
  const touchStartX = useRef(null)
  const isAnimating = useRef(false)
  const confettiRefs = useRef({})
  const prevMonthKey = useRef(format(new Date(), 'yyyy-MM'))

  const today = new Date()
  const isCurrentMonthView = isSameMonth(currentMonth, today)

  useEffect(() => {
    const handler = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target))
        setContextMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (contextMenu) setTimeout(() => labelInputRef.current?.focus(), 100)
  }, [contextMenu])

  useEffect(() => {
    const newKey = format(currentMonth, 'yyyy-MM')
    if (newKey !== prevMonthKey.current) {
      prevMonthKey.current = newKey
      setCelebration({ monthName: format(currentMonth, 'MMMM yyyy') })
      createCelebrationConfetti()
      setTimeout(() => setCelebration(null), 3500)
    }
  }, [currentMonth])

  const generateDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const gridStart = startOfWeek(monthStart)
    const gridEnd = endOfWeek(monthEnd)
    const days = []
    let day = gridStart
    while (day <= gridEnd) { days.push(day); day = addDays(day, 1) }
    return days
  }

  const handleDayClick = (day) => {
    if (isSameDay(day, today)) {
      const key = format(day, 'yyyy-MM-dd')
      const container = confettiRefs.current[key]
      if (container) createConfetti(container)
    }
    if (!startDate || (startDate && endDate)) {
      setStartDate(day); setEndDate(null)
      if (onRangeChange) onRangeChange(day, null)
    } else {
      if (isBefore(day, startDate)) {
        setEndDate(startDate); setStartDate(day)
        if (onRangeChange) onRangeChange(day, startDate)
      } else {
        setEndDate(day)
        if (onRangeChange) onRangeChange(startDate, day)
      }
    }
  }

  const handleDayDoubleClick = (day) => {
    const key = format(day, 'yyyy-MM-dd')
    const updated = pins.includes(key) ? pins.filter(p => p !== key) : [...pins, key]
    setPins(updated)
    localStorage.setItem('calendar-pins', JSON.stringify(updated))
  }

  const handleDayRightClick = (e, day) => {
    e.preventDefault()
    e.stopPropagation()
    const key = format(day, 'yyyy-MM-dd')
    setLabelInput(eventLabels[key] || '')
    const menuWidth = 230
    const menuHeight = 260
    const x = e.clientX + menuWidth > window.innerWidth ? e.clientX - menuWidth : e.clientX
    const y = e.clientY + menuHeight > window.innerHeight ? e.clientY - menuHeight : e.clientY
    setContextMenu({ day, key, x, y })
  }

  const handleDragStart = (e, dayKey) => {
    if (!eventLabels[dayKey]) return
    setDragKey(dayKey)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', dayKey)
  }

  const handleDragOver = (e, dayKey) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverKey(dayKey)
  }

  const handleDragLeave = () => setDragOverKey(null)

  const handleDrop = (e, targetDayKey) => {
    e.preventDefault()
    if (!dragKey || dragKey === targetDayKey) {
      setDragKey(null); setDragOverKey(null); return
    }
    const label = eventLabels[dragKey]
    if (!label) { setDragKey(null); setDragOverKey(null); return }
    const updated = { ...eventLabels }
    delete updated[dragKey]
    updated[targetDayKey] = label
    setEventLabels(updated)
    localStorage.setItem('calendar-events', JSON.stringify(updated))
    setDragKey(null); setDragOverKey(null)
  }

  const handleDragEnd = () => { setDragKey(null); setDragOverKey(null) }

  const setMood = (key, emoji) => {
    const updated = emoji === moods[key]
      ? Object.fromEntries(Object.entries(moods).filter(([k]) => k !== key))
      : { ...moods, [key]: emoji }
    setMoods(updated)
    localStorage.setItem('calendar-moods', JSON.stringify(updated))
  }

  const saveLabel = () => {
    if (!contextMenu) return
    const updated = labelInput.trim()
      ? { ...eventLabels, [contextMenu.key]: labelInput.trim() }
      : Object.fromEntries(Object.entries(eventLabels).filter(([k]) => k !== contextMenu.key))
    setEventLabels(updated)
    localStorage.setItem('calendar-events', JSON.stringify(updated))
    setContextMenu(null)
  }

  const getDayFlags = (day) => {
    const isCurrentMonth = isSameMonth(day, currentMonth)
    const isStart = startDate && isSameDay(day, startDate)
    const isEnd = endDate && isSameDay(day, endDate)
    const isToday = isSameDay(day, today)
    const isSun = day.getDay() === 0
    const isSat = day.getDay() === 6
    const isHighlighted = highlightDate && isSameDay(day, highlightDate)
    const compareEnd = endDate || hoverDate
    const inRange = startDate && compareEnd && isWithinInterval(day, {
      start: isBefore(startDate, compareEnd) ? startDate : compareEnd,
      end: isAfter(compareEnd, startDate) ? compareEnd : startDate,
    })
    return { isCurrentMonth, isStart, isEnd, isToday, isSun, isSat, inRange, isHighlighted }
  }

  const changeMonth = (direction) => {
    if (isAnimating.current) return
    isAnimating.current = true
    setPageAnim(direction === 'next' ? 'flip-up' : 'flip-down')
    setTimeout(() => {
      const updated = direction === 'next' ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1)
      setCurrentMonth(updated)
      setStartDate(null); setEndDate(null)
      if (onMonthChange) onMonthChange(updated)
      setPageAnim('flip-in')
      setTimeout(() => { setPageAnim(null); isAnimating.current = false }, 400)
    }, 400)
  }

  const jumpToToday = () => {
    setCurrentMonth(startOfMonth(today))
    if (onMonthChange) onMonthChange(startOfMonth(today))
  }

  const jumpToMonth = (date) => {
    setCurrentMonth(startOfMonth(date))
    if (onMonthChange) onMonthChange(startOfMonth(date))
  }

  const handleTouchStart = (e) => {
    if (contextMenu) return
    touchStartY.current = e.touches[0].clientY
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (contextMenu) return
    if (touchStartY.current === null) return
    const deltaY = touchStartY.current - e.changedTouches[0].clientY
    const deltaX = Math.abs(touchStartX.current - e.changedTouches[0].clientX)
    if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > deltaX) {
      deltaY > 0 ? changeMonth('prev') : changeMonth('next')
    }
    touchStartY.current = null; touchStartX.current = null
  }

  const handleWheel = (e) => {
    if (contextMenu || multiView) return
    if (Math.abs(e.deltaY) < 30) return
    e.deltaY > 0 ? changeMonth('prev') : changeMonth('next')
  }

  const handleSearchOpen = () => {
    setSearchOpen(true); setSearchQuery(''); setSearchResult(null)
    setTimeout(() => searchInputRef.current?.focus(), 300)
  }

  const handleSearchClose = () => {
    setSearchOpen(false); setSearchQuery(''); setSearchResult(null); setHighlightDate(null)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const parsed = parseSearchDate(searchQuery)
    if (parsed) { setSearchResult({ date: parsed }); setHighlightDate(parsed); jumpToMonth(parsed) }
    else setSearchResult({ error: 'Could not parse. Try "Apr 14" or "14/04/2026"' })
  }

  const getCountdown = () => {
    if (!startDate) return null
    const t = new Date(); t.setHours(0,0,0,0)
    const diff = differenceInCalendarDays(startDate, t)
    if (diff === 0) return { text: "🎯 That's today!", color: themeColor }
    if (diff > 0) return { text: `⏳ ${diff} day${diff>1?'s':''} away`, color: themeColor }
    return { text: `✅ ${Math.abs(diff)} day${Math.abs(diff)>1?'s':''} ago`, color: '#9ca3af' }
  }

  const getNoteForDay = (day) =>
    localStorage.getItem(`note-${format(day,'yyyy-MM-dd')}`) || ''

  const getMoonPhase = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // Known new moon: Jan 1, 2000
  const knownNewMoon = new Date(2000, 0, 6)
  const lunarCycle = 29.53058867
  const diff = (date - knownNewMoon) / (1000 * 60 * 60 * 24)
  const phase = ((diff % lunarCycle) + lunarCycle) % lunarCycle
  if (phase < 1.85)  return '🌑'
  if (phase < 5.54)  return '🌒'
  if (phase < 9.22)  return '🌓'
  if (phase < 12.91) return '🌔'
  if (phase < 16.61) return '🌕'
  if (phase < 20.30) return '🌖'
  if (phase < 23.99) return '🌗'
  if (phase < 27.68) return '🌘'
  return '🌑'
}

  const getRangeNoteForDay = (day) => {
    const dayKey = format(day, 'yyyy-MM-dd')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith('note-')) continue
      const body = key.replace('note-', '')
      const parts = body.split('-')
      if (parts.length === 6) {
        const start = `${parts[0]}-${parts[1]}-${parts[2]}`
        const end = `${parts[3]}-${parts[4]}-${parts[5]}`
        if (dayKey === start || dayKey === end) {
          const val = localStorage.getItem(key) || ''
          if (val.trim()) return val
        }
      }
    }
    return ''
  }

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5),16)
    const b = parseInt(hex.slice(5,7),16)
    return `${r}, ${g}, ${b}`
  }

  const getDotSummary = () => {
    const monthStart = startOfMonth(currentMonth)
    const daysInMonth = endOfMonth(currentMonth).getDate()
    const summary = []
    for (let d = 1; d <= daysInMonth; d++) {
      const day = addDays(monthStart, d - 1)
      const key = format(day, 'MM-dd')
      const dayKey = format(day, 'yyyy-MM-dd')
      const hasHoliday = !!HOLIDAYS[key]
      const hasNote = getNoteForDay(day).trim().length > 0
      const hasRangeNote = getRangeNoteForDay(day).trim().length > 0
      const isPinned = pins.includes(dayKey)
      const hasMood = !!moods[dayKey]
      const hasEvent = !!eventLabels[dayKey]
      if (hasHoliday || hasNote || hasRangeNote || isPinned || hasMood || hasEvent) {
        summary.push({ day: d, hasHoliday, hasNote, hasRangeNote, isPinned, hasMood, hasEvent, mood: moods[dayKey] })
      }
    }
    return summary
  }

  const days = generateDays()
  const countdown = getCountdown()
  const rgbColor = hexToRgb(themeColor)
  const dotSummary = getDotSummary()

  return (
    <div
      className={`calendar-grid-wrapper ${darkMode ? 'dark' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      style={{ '--rgb': rgbColor, '--theme': themeColor }}
    >
      <div className="accent-bar" style={{ background: themeGradient || themeColor }} />

      {/* Search Bar */}
      <div className={`search-bar-wrapper ${searchOpen ? 'search-open' : ''}`}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input ref={searchInputRef} className="search-input" type="text"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search date... e.g. Apr 14 or 14/04/2026"
          />
          <button type="submit" className="search-go-btn"
            style={{ background: themeGradient || themeColor }}>Go</button>
          <button type="button" className="search-close-btn" onClick={handleSearchClose}>✕</button>
        </form>
        {searchResult?.error && <div className="search-error">{searchResult.error}</div>}
        {searchResult?.date && (
          <div className="search-success" style={{ color: themeColor }}>
            ✅ Jumped to {format(searchResult.date, 'MMMM d, yyyy')}
          </div>
        )}
      </div>

      <div className={`page-flip-container ${pageAnim || ''}`}>

        <div className="nav-row">
          <div className="nav-left-group">
            <button onClick={handleSearchOpen} className="search-icon-btn" title="Search date">🔍</button>
            <button onClick={() => changeMonth('prev')} className="nav-btn">‹</button>
          </div>
          <div className="nav-month-label">
            <span className="nav-year">{format(currentMonth, 'yyyy')}</span>
            <span className="nav-month" style={{
              backgroundImage: themeGradient,
              WebkitBackgroundClip: themeGradient ? 'text' : undefined,
              WebkitTextFillColor: themeGradient ? 'transparent' : undefined,
              color: themeGradient ? 'transparent' : themeColor,
            }}>
              {format(currentMonth, 'MMMM')}
            </span>
          </div>
          <div className="nav-right-group">
            <button onClick={() => changeMonth('next')} className="nav-btn">›</button>
            {!isCurrentMonthView && (
              <button className="today-jump-btn" onClick={jumpToToday}
                style={{ background: themeGradient || themeColor }}>Today</button>
            )}
            <button
              className={`multi-view-btn ${multiView ? 'multi-view-active' : ''}`}
              onClick={() => setMultiView(!multiView)}
              title="3-month view"
              style={multiView ? { background: themeGradient || themeColor, color: 'white', borderColor: 'transparent' } : {}}
            >⊞</button>
            <button className="dark-toggle-btn" onClick={onToggleDark}
              title={darkMode ? 'Light mode' : 'Dark mode'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="swipe-hint">
          {multiView ? '3-month overview • click a date to navigate' : '↕ swipe or scroll to change month'}
        </div>

        {multiView ? (
          <div className="multi-month-wrapper">
            {[subMonths(currentMonth, 1), currentMonth, addMonths(currentMonth, 1)].map((month, i) => (
              <MiniMonthView key={i} month={month} themeColor={themeColor}
                themeGradient={themeGradient} eventLabels={eventLabels}
                moods={moods} pins={pins} darkMode={darkMode}
                onDayClick={(day) => { setMultiView(false); jumpToMonth(day) }}
              />
            ))}
          </div>
        ) : (
          <>
            
            <div className="weekday-row">
              <div className="weekday-label wk-label">WK</div>
              {WEEKDAYS.map((d, i) => (
                <div key={d} className="weekday-label"
                  style={i === 0 ? { color: '#ef4444' } : i === 6 ? { color: themeColor } : {}}>
                  {d}
                </div>
              ))}
            </div>

           
            <div className="day-grid">
              {days.map((day, idx) => {
                const { isCurrentMonth, isStart, isEnd, isToday, isSun, isSat, inRange, isHighlighted } = getDayFlags(day)
                const dateKey = format(day, 'MM-dd')
                const dayKey = format(day, 'yyyy-MM-dd')
                const holiday = HOLIDAYS[dateKey]
                const dayNote = getNoteForDay(day)
                const hasNote = dayNote.trim().length > 0
                const rangeNote = getRangeNoteForDay(day)          
                const hasRangeNote = rangeNote.trim().length > 0   
                const isRangeStart = isStart && endDate
                const isRangeEnd = isEnd && startDate
                const isPinned = pins.includes(dayKey)
                const mood = moods[dayKey]
                const moonPhase = isCurrentMonth ? getMoonPhase(day) : null
                const eventLabel = eventLabels[dayKey]
                const isDragOver = dragOverKey === dayKey
                const isDragging = dragKey === dayKey

                let wrapperClass = 'day-cell'
                if (inRange && !isStart && !isEnd) wrapperClass += ' range-fill'
                if (isRangeStart) wrapperClass += ' range-cap-left'
                if (isRangeEnd) wrapperClass += ' range-cap-right'
                if (isDragOver) wrapperClass += ' drag-over'

                let dayClass = 'calendar-day'
                if (!isCurrentMonth) dayClass += ' other-month'
                if (isToday) dayClass += ' today'
                if (isStart || isEnd) dayClass += ' range-endpoint'
                if (isHighlighted && !isStart && !isEnd && !isToday) dayClass += ' search-highlight'
                if (isDragging) dayClass += ' dragging'

                const textColor =
                  isStart || isEnd || isToday ? 'white'
                  : !isCurrentMonth ? (darkMode ? '#4b5563' : '#d1d5db')
                  : isSun ? '#ef4444'
                  : isSat ? themeColor
                  : darkMode ? '#e5e7eb' : '#374151'

                const cellStyle = inRange && !isStart && !isEnd
                  ? { '--range-bg': `rgba(${rgbColor}, 0.2)` }
                  : isRangeStart || isRangeEnd
                  ? { '--range-bg': `rgba(${rgbColor}, 0.2)` }
                  : {}

                return (
                  <>
                    {idx % 7 === 0 && (
                      <div key={`wk-${idx}`} className="week-number-cell">
                        {getISOWeek(day)}
                      </div>
                    )}
                    <div key={dayKey} className={wrapperClass} style={cellStyle}
                      onDragOver={(e) => handleDragOver(e, dayKey)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, dayKey)}
                    >
                      <div
                        className={dayClass}
                        onClick={() => handleDayClick(day)}
                        onDoubleClick={() => handleDayDoubleClick(day)}
                        onContextMenu={(e) => handleDayRightClick(e, day)}
                        onMouseEnter={() => startDate && !endDate && setHoverDate(day)}
                        onMouseLeave={() => setHoverDate(null)}
                        style={{
                          background: isStart || isEnd || isToday
                            ? themeGradient || themeColor
                            : isHighlighted && !isStart && !isEnd && !isToday
                            ? `rgba(${rgbColor}, 0.12)` : undefined,
                          color: textColor,
                          outline: isHighlighted && !isStart && !isEnd && !isToday
                            ? `2px dashed ${themeColor}` : undefined,
                        }}
                      >
                        <span className="day-number">{format(day, 'd')}</span>

                        {mood && isCurrentMonth && (
                          <span className="mood-emoji">{mood}</span>
                        )}

                        {moonPhase && (
                          <span className="moon-phase" title={`Moon phase`}>{moonPhase}</span>
                        )}

                        {eventLabel && isCurrentMonth && (
                          <span
                            className={`event-label ${isDragging ? 'event-dragging' : ''}`}
                            style={{ background: `${themeColor}22`, color: themeColor }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, dayKey)}
                            onDragEnd={handleDragEnd}
                            title="Drag to move event"
                          >
                            {eventLabel.length > 6 ? eventLabel.slice(0, 6) + '…' : eventLabel}
                          </span>
                        )}

                    
                        {(holiday || hasNote || hasRangeNote) && (
                          <div className="dots-row">
                            {holiday && <span className="dot dot-holiday" />}
                            {hasNote && <span className="dot dot-note" style={{ background: themeColor }} />}
                            {hasRangeNote && <span className="dot dot-range" />}
                          </div>
                        )}

                        {isPinned && <span className="wall-pin">📌</span>}

                        {isToday && (
                          <div className="confetti-container"
                            ref={(el) => { confettiRefs.current[dayKey] = el }} />
                        )}


                        {(holiday || hasNote || hasRangeNote || mood || eventLabel) && (
                          <div className="day-tooltip">
                            {eventLabel && (
                              <div className="tooltip-event">
                                <span className="tooltip-icon">🏷️</span>
                                <span>{eventLabel}</span>
                              </div>
                            )}
                            {mood && (
                              <div className="tooltip-mood">
                                <span className="tooltip-icon">{mood}</span>
                                <span>Mood</span>
                              </div>
                            )}
                            {hasRangeNote && (
                              <div className="tooltip-range-note">
                                <span className="tooltip-icon">📝</span>
                                <span>{rangeNote.length > 40 ? rangeNote.slice(0,40) + '…' : rangeNote}</span>
                              </div>
                            )}
                            {(eventLabel || mood || hasRangeNote) && (holiday || hasNote) && (
                              <div className="tooltip-divider" />
                            )}
                            {holiday && (
                              <div className="tooltip-festival">
                                <span className="tooltip-icon">🎉</span>
                                <span>{holiday}</span>
                              </div>
                            )}
                            {holiday && hasNote && <div className="tooltip-divider" />}
                            {hasNote && (
                              <div className="tooltip-note">
                                <span className="tooltip-icon">📝</span>
                                <span>{dayNote.length > 40 ? dayNote.slice(0,40) + '…' : dayNote}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )
              })}
            </div>

            
            {startDate && (
              <div className="selection-bottom">
                <div className="selection-info" style={{ color: themeColor }}>
                  {endDate
                    ? `📅 ${format(startDate,'MMM d')} → ${format(endDate,'MMM d, yyyy')}`
                    : `👆 Select end date`}
                </div>
                {countdown && !endDate && (
                  <div className="countdown-badge" style={{
                    color: countdown.color,
                    borderColor: `${countdown.color}40`,
                    background: `${countdown.color}10`,
                  }}>
                    {countdown.text}
                  </div>
                )}
              </div>
            )}

          
            {dotSummary.length > 0 && (
              <div className="dot-summary">
                <span className="dot-summary-label">Events:</span>
                <div className="dot-summary-items">
                  {dotSummary.map(({ day, hasHoliday, hasNote, hasRangeNote, isPinned, mood }) => (
                    <div key={day} className="dot-summary-item">
                      <span className="dot-summary-day">{day}</span>
                      <div className="dot-summary-dots">
                        {hasHoliday && <span className="dot dot-holiday" />}
                        {hasNote && <span className="dot dot-note" style={{ background: themeColor }} />}
                        {hasRangeNote && <span className="dot dot-range" />}
                        {isPinned && <span className="dot-summary-pin">📌</span>}
                        {mood && <span className="dot-summary-mood">{mood}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="footer-bar" style={{ background: themeGradient || themeColor }} />

     
      {contextMenu && createPortal(
        <div ref={contextMenuRef}
          className={`context-menu ${darkMode ? 'dark' : ''}`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="context-menu-header">
            <span className="context-date">{format(contextMenu.day, 'MMM d, yyyy')}</span>
          </div>
          <div className="context-section">
            <div className="context-section-label">😊 Mood</div>
            <div className="mood-picker">
              {MOODS.map((emoji) => (
                <button key={emoji}
                  className={`mood-btn ${moods[contextMenu.key] === emoji ? 'mood-active' : ''}`}
                  onClick={() => setMood(contextMenu.key, emoji)}
                  style={moods[contextMenu.key] === emoji
                    ? { background: `${themeColor}30`, borderColor: themeColor } : {}}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="context-section">
            <div className="context-section-label">🏷️ Event</div>
            <div className="event-input-row">
              <input ref={labelInputRef} className="event-input" type="text"
                value={labelInput} onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Add label..." maxLength={20}
                onKeyDown={(e) => e.key === 'Enter' && saveLabel()}
              />
              <button className="event-save-btn" onClick={saveLabel}
                style={{ background: themeGradient || themeColor }}>✓</button>
            </div>
          </div>
          <div className="context-hint">Right-click to open · Drag label to move · Double-click to pin</div>
        </div>,
        document.body
      )}

      {celebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <div className="celebration-emoji">🎊</div>
            <div className="celebration-text"
              style={{ background: themeGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {celebration.monthName}
            </div>
            <div className="celebration-sub" style={{ color: themeColor }}>
              New month, new beginnings!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarGrid
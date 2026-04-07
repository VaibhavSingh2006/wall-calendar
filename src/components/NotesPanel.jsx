import { useState, useEffect, useMemo, useRef } from 'react'
import { format, isValid } from 'date-fns'
import './NotesPanel.css'

function NotesPanel({ currentMonth, startDate, endDate, themeColor = '#1a56db' }) {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const noteRef = useRef('')
  const savedTimerRef = useRef(null)
  const prevKeyRef = useRef(null)

  const noteKey = useMemo(() => {
    try {
      const sd = startDate && isValid(new Date(startDate)) ? new Date(startDate) : null
      const ed = endDate && isValid(new Date(endDate)) ? new Date(endDate) : null
      const cm = currentMonth && isValid(new Date(currentMonth)) ? new Date(currentMonth) : new Date()
      if (sd && ed) return `note-${format(sd, 'yyyy-MM-dd')}-${format(ed, 'yyyy-MM-dd')}`
      if (sd) return `note-${format(sd, 'yyyy-MM-dd')}`
      return `note-${format(cm, 'yyyy-MM')}`
    } catch {
      return `note-${format(new Date(), 'yyyy-MM')}`
    }
  }, [currentMonth, startDate, endDate])

  useEffect(() => {
  const existing = localStorage.getItem(noteKey) || ''
  noteRef.current = existing
  setNote(existing)
  setCharCount(existing.length)
  setSaved(false)
}, [noteKey])

  const handleChange = (e) => {
  const val = e.target.value
  noteRef.current = val
  setNote(val)
  setCharCount(val.length)
  setSaved(false)
}

 const handleSave = () => {
  localStorage.setItem(noteKey, note)
  setSaved(true)
  if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
  savedTimerRef.current = setTimeout(() => setSaved(false), 1500)
}  

  const handleClear = () => {
    localStorage.removeItem(noteKey)
    noteRef.current = ''
    setNote('')
    setCharCount(0)
    setSaved(false)
  }

  const getLabel = () => {
    try {
      if (startDate && endDate && isValid(new Date(startDate)) && isValid(new Date(endDate)))
        return `${format(new Date(startDate), 'MMM d')} → ${format(new Date(endDate), 'MMM d')}`
      if (startDate && isValid(new Date(startDate)))
        return format(new Date(startDate), 'MMM d, yyyy')
      if (currentMonth && isValid(new Date(currentMonth)))
        return format(new Date(currentMonth), 'MMMM yyyy')
      return format(new Date(), 'MMMM yyyy')
    } catch {
      return format(new Date(), 'MMMM yyyy')
    }
  }

  const getEmoji = () => {
    if (startDate && endDate) return '📅'
    if (startDate) return '📌'
    return '🗓️'
  }

  return (
    <div className="notes-panel">
      <div className="notepad-holes">
        <div className="hole" />
        <div className="hole" />
        <div className="hole" />
      </div>

      <div className="notepad-header" style={{ borderBottomColor: themeColor }}>
        <div className="notepad-title-row">
          <span className="notepad-emoji">{getEmoji()}</span>
          <div className="notepad-title-block">
            <span className="notepad-title">MY NOTES</span>
            <span className="notepad-subtitle" style={{ color: themeColor }}>
              {getLabel()}
            </span>
          </div>
        </div>
        <div className="tape-strip" style={{ background: `${themeColor}30` }} />
      </div>

      <div className="notepad-body">
        <div className="margin-line" style={{ borderColor: `${themeColor}50` }} />
        <textarea
          className="notepad-textarea"
          value={note}
          onChange={handleChange}
          placeholder="Write your notes here..."
          spellCheck={true}
        />
      </div>

      <div className="notepad-footer">
        <span className="char-count" style={{ color: charCount > 200 ? '#ef4444' : '#d1d5db' }}>
          {charCount} chars
        </span>
        <div className="notes-actions">
          <button onClick={handleClear} className="btn-clear">
            🗑 Clear
          </button>
          <button
            onClick={handleSave}
            className={`btn-save ${saved ? 'btn-saved' : ''}`}
            style={{ background: saved ? '#16a34a' : themeColor }}
          >
            {saved ? '✓ Saved!' : '💾 Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotesPanel
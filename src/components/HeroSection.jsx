import { useEffect, useRef, useState } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import './HeroSection.css'

export const MONTH_THEMES = {
  0:  { color: '#1a56db', label: 'January',   img: 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800' },
  1:  { color: '#db1a6b', label: 'February',  img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
  2:  { color: '#16a34a', label: 'March',     img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=90&w=800&h=500&auto=format&fit=crop' },
  3:  { color: '#0891b2', label: 'April',     img: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800' },
  4:  { color: '#059669', label: 'May',       img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800' },
  5:  { color: '#ea580c', label: 'June',      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
  6:  { color: '#d97706', label: 'July',      img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80' },
  7:  { color: '#dc2626', label: 'August',    img: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800' },
  8:  { color: '#b45309', label: 'September', img: 'https://images.pexels.com/photos/1766838/pexels-photo-1766838.jpeg' },
  9:  { color: '#c2410c', label: 'October',   img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800' },
  10: { color: '#7c3aed', label: 'November',  img: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800' },
  11: { color: '#1e40af', label: 'December',  img: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800' },
}

function HeroSection({ currentMonth }) {
  const monthIndex = currentMonth.getMonth()
  const theme = MONTH_THEMES[monthIndex]
  const [flipping, setFlipping] = useState(false)
  const prevMonthRef = useRef(monthIndex)

  useEffect(() => {
    if (prevMonthRef.current !== monthIndex) {
      setFlipping(true)
      const t = setTimeout(() => setFlipping(false), 500)
      prevMonthRef.current = monthIndex
      return () => clearTimeout(t)
    }
  }, [monthIndex])

  useEffect(() => {
    const prev = subMonths(currentMonth, 1).getMonth()
    const next = addMonths(currentMonth, 1).getMonth()
    ;[prev, next].forEach((idx) => {
      const img = new Image()
      img.src = MONTH_THEMES[idx].img
    })
  }, [currentMonth])

  return (
    <div className={`hero-wrapper ${flipping ? 'flip-anim' : ''}`}>
      <img
        key={monthIndex}
        src={theme.img}
        alt={theme.label}
        className="hero-image"
      />

      <div className="hero-overlay">
        <div
          className="hero-shape"
          style={{ backgroundColor: theme.color }}
        />
      </div>

      <div className="hero-text">
        <span className="hero-year">{format(currentMonth, 'yyyy')}</span>
        <span className="hero-month">{format(currentMonth, 'MMMM').toUpperCase()}</span>
      </div>

      <div className="spiral-bar">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="spiral-ring" />
        ))}
      </div>
    </div>
  )
}

export default HeroSection
# 🗓️ Wall Calendar — Interactive React Component

> A polished, feature-rich wall calendar built with **React + Vite + Tailwind CSS**, inspired by the aesthetic of a physical wall calendar.

>LINK: https://wall-calendar-5hu2.onrender.com

---

## 📸 Preview

<img width="939" height="652" alt="Screenshot 2026-04-08 at 5 04 37 AM" src="https://github.com/user-attachments/assets/e3139182-d9ec-40f8-a6bb-0da6bbe6890a" />


---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Plain CSS** | Custom animations, geometric shapes |
| **date-fns** | Date math & formatting |
| **Open-Meteo API** | Free weather data (no API key) |
| **localStorage** | Client-side data persistence |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/VaibhavSingh2006/wall-calendar.git
cd wall-calendar

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🗂️ Project Structure

```
wall-calendar/
├── src/
│   ├── components/
│   │   ├── CalendarGrid.jsx      # Main calendar grid with all features
│   │   ├── CalendarGrid.css      # Grid styles, animations, dark mode
│   │   ├── HeroSection.jsx       # Top image + geometric overlay
│   │   ├── HeroSection.css       # Hero styles, spiral rings
│   │   ├── NotesPanel.jsx        # Notepad UI component
│   │   └── NotesPanel.css        # Notepad styles
│   ├── App.jsx                   # Root component, state management
│   ├── index.css                 # Global styles, dark mode, weather widget
│   └── main.jsx                  # React entry point
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ✨ Features

### 🖼️ Wall Calendar Aesthetic
- **Hero image** at the top that changes every month (Jan → snow, Apr → cherry blossom, etc.)
- **Geometric triangle shape** overlay with month-specific gradient color
- **Spiral binding rings** at the top, mimicking a physical wall calendar
- **Page flip animation** when switching months (3D `rotateX` CSS transform)
- <img width="506" height="594" alt="Screenshot 2026-04-08 at 5 06 25 AM" src="https://github.com/user-attachments/assets/fa9a1738-b1a5-4aee-b136-4588b6242b44" />

### 📅 Date Selection & Range
- **Single date selection** — click any date
- **Date range selection** — click start date, then end date
- **Visual range highlight** — smooth pill-shaped bar connecting start to end
- **Range start/end indicators** with gradient-filled circles
- **Countdown badge** — shows "⏳ 3 days away" or "✅ 2 days ago"
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 08 16 AM" src="https://github.com/user-attachments/assets/ed0f8e8e-1b8d-437f-8341-91e0584be503" />


### 📝 Notes System
- **Sliding notes drawer** — "My Notes" button slides in from right
- **Notepad aesthetic** — lined paper, red margin line, binding holes, tape strip
- **Context-aware notes** — separate note for each day, range, or month
- **Range notes** — notes saved for a date range show 📅 dot on both start and end dates
- **Hover tooltip** — range note preview visible on hovering start/end dates
- **Persistent storage** — all notes saved to `localStorage`
- **Character counter** turns red at 200 chars
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 09 54 AM" src="https://github.com/user-attachments/assets/09752b67-dad3-476d-870d-0bb8dd94ef4d" />


### 🌕 Moon Phase Display
- **Real lunar cycle calculation** — based on known new moon epoch (Jan 6, 2000)
- **8 moon phase emojis** shown on every date cell for the current month:

| Emoji | Phase |
|---|---|
| 🌑 | New Moon |
| 🌒 | Waxing Crescent |
| 🌓 | First Quarter |
| 🌔 | Waxing Gibbous |
| 🌕 | Full Moon |
| 🌖 | Waning Gibbous |
| 🌗 | Last Quarter |
| 🌘 | Waning Crescent |

<img width="506" height="595" alt="Screenshot 2026-04-08 at 5 11 31 AM" src="https://github.com/user-attachments/assets/159317ae-0e4a-44d8-976f-8ec6c200dee7" />


- Lunar cycle length: **29.53 days** (synodic month)
- Pure JavaScript calculation — no external API needed
- Subtle opacity so it doesn't clutter the calendar

### 🎉 Holiday Markers
- **Indian public holidays** pre-loaded (Republic Day, Holi, Diwali, Christmas, etc.)
- **Red dot** under holiday dates
- **Hover tooltip** shows holiday name in a dark card with arrow
- **Holiday dot** shown in the events summary bar at the bottom
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 13 47 AM" src="https://github.com/user-attachments/assets/d4ddbce7-3686-44c5-8916-adf829a5d810" />


### 🌤️ Weather Widget
- Appears when you select a date
- Fetches real forecast data from **Open-Meteo API** (free, no key needed)
- Coordinates set to **New Delhi** by default
- Shows weather emoji + max/min temperature
- Styled with the month's gradient
- <img width="506" height="271" alt="Screenshot 2026-04-08 at 5 15 17 AM" src="https://github.com/user-attachments/assets/22df96e3-ce49-4056-aa9a-dbb2f410c962" />


### 🌙 Dark Mode
- Toggle with the 🌙 button in the nav
- Smooth transition across entire app
- Persists across page refresh via `localStorage`
- Dark variables applied via CSS custom properties
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 16 19 AM" src="https://github.com/user-attachments/assets/4bab679d-b4aa-44c4-b75b-a3f31dddd684" />


### 🎨 Monthly Theme Colors
Each month has its own gradient that flows through the entire UI:

| Month | Color |
|---|---|
| January | Blue `#1a56db → #3b82f6` |
| February | Pink `#db1a6b → #f472b6` |
| March | Green `#16a34a → #4ade80` |
| April | Cyan `#0891b2 → #22d3ee` |
| May | Emerald `#059669 → #34d399` |
| June | Orange `#ea580c → #fb923c` |
| July | Amber `#d97706 → #fbbf24` |
| August | Red `#dc2626 → #f87171` |
| September | Brown `#b45309 → #d97706` |
| October | Deep Orange `#c2410c → #f97316` |
| November | Purple `#7c3aed → #a78bfa` |
| December | Navy `#1e40af → #3b82f6` |

### 🔢 Week Numbers
- ISO week numbers displayed in a subtle column on the left of every row

### 😊 Mood Tracker
- **Right-click** any date to open the context menu
- Pick from 8 mood emojis: 😊 😢 😡 😴 🤔 🎉 ❤️ 💪
- Mood emoji appears on the date cell
- Visible in tooltip on hover
- Persisted in `localStorage`
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 18 04 AM" src="https://github.com/user-attachments/assets/6b846d30-54d4-42cb-bdce-7da829662cb0" />


### 🏷️ Event Labels
- **Right-click** any date → type a short label (e.g. "Meeting", "Birthday")
- Label appears as a tiny badge on the date cell
- **Drag & drop** — grab an event label and drop it onto another date to move it
- Persisted in `localStorage`
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 18 31 AM" src="https://github.com/user-attachments/assets/2ecbf41f-e27a-4e67-9f15-df8cfdbde1e4" />


### 📌 Wall Pin
- **Double-click** any date to pin it
- Red 📌 pin drops in with a bounce animation
- Double-click again to unpin
- Pins persist across refresh
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 20 50 AM" src="https://github.com/user-attachments/assets/993acc40-8006-4f6c-afa7-7a04889e38e1" />


### 🔍 Date Search
- Click the 🔍 icon in the top-left nav
- Search bar slides down smoothly with a glowing border on focus
- Supports formats: `Apr 14`, `14/04/2026`, `14 April`, `2026-04-14`
- Jumps to that month and highlights the date with a pulse animation
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 21 52 AM" src="https://github.com/user-attachments/assets/7ce9289d-c4f7-4b6d-8d09-625d4e012a66" />


### ⏳ Today Button
- Appears only when you're not on the current month
- Pops in with a bounce animation
- One click returns you to today
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 22 34 AM" src="https://github.com/user-attachments/assets/fb643ee5-0944-4d0c-a140-7544ae25654d" />


### 🎊 Celebration Mode
- Full-screen confetti burst when navigating to a new month
- Animated month name overlay with gradient text
- Stays inside the calendar card
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 24 29 AM" src="https://github.com/user-attachments/assets/662f70ac-f924-4ca1-941b-f3a7e1d8e7c7" />

### 📊 Multi-Month View
- Click **⊞** to toggle 3-month side-by-side view (prev, current, next)
- Each mini month shows dots for holidays, notes, events, moods, pins
- Click any date in mini view to jump to that month
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 22 51 AM" src="https://github.com/user-attachments/assets/dbdfcf20-d080-49e7-aa21-0f646f0b2336" />



### 🖱️ Drag & Drop Events
- Event labels are draggable
- Drop target highlights with a colored ring
- Move events between dates with smooth feedback

### 📱 Responsive Design
- **Desktop** — full-width card, side-by-side layout
- **Mobile** — stacked layout, touch-friendly
- **Swipe up/down** on mobile to navigate months
- **Mouse scroll** on desktop does the same
- <img width="506" height="595" alt="Screenshot 2026-04-08 at 5 23 21 AM" src="https://github.com/user-attachments/assets/ef8e3055-4714-4f78-8afe-276fff5edccd" />


### ⌨️ Page Flip Animation
- Scroll up → previous month
- Scroll down → next month
- Swipe works same way on mobile
- 3D `rotateX` CSS keyframe animation with bounce-back effect

### 🎯 Today Confetti
- Click today's date → colorful confetti burst explodes from it
- 36 particles with randomized colors, sizes, directions, rotations

---

## 🗃️ Data Persistence

All data is stored in `localStorage` — no backend needed.

| Key Pattern | Data |
|---|---|
| `note-yyyy-MM` | Monthly note |
| `note-yyyy-MM-dd` | Single day note |
| `note-yyyy-MM-dd-yyyy-MM-dd` | Date range note |
| `calendar-pins` | Array of pinned date strings |
| `calendar-moods` | Object mapping date → mood emoji |
| `calendar-events` | Object mapping date → event label |
| `calendar-dark` | `"true"` or `"false"` |

---

## 🏗️ Architecture Decisions

### State Management
- All state lives in `App.jsx` (currentMonth, startDate, endDate, darkMode, notesOpen)
- `CalendarGrid` manages its own internal UI state (hover, animation, search, context menu)
- Props flow down, callbacks flow up via `onMonthChange` and `onRangeChange`

### No Backend
- Strictly frontend per assignment requirements
- `localStorage` used for all persistence
- Open-Meteo API requires zero authentication
- Moon phase calculated purely in JS — no API needed

### CSS Strategy
- **Tailwind** for layout, spacing, flex/grid utilities
- **Plain CSS** for animations, clip-paths, geometric shapes, dark mode variables, pseudo-elements
- CSS custom properties (`--theme`, `--rgb`, `--range-bg`) for dynamic theming

### Portal Pattern
- Context menu rendered via `createPortal(_, document.body)` to escape CSS `perspective` transform chain and prevent page jumping

---

## 📋 Component Overview

### `HeroSection`
- Accepts `currentMonth` prop
- Preloads adjacent month images for instant switching
- Triggers 3D flip animation on month change
- Geometric triangle shape color driven by `MONTH_THEMES`

### `CalendarGrid`
- Core component — handles all calendar logic
- Generates day grid using `date-fns` (`startOfWeek`, `endOfWeek`, `addDays`)
- Range selection with hover preview
- Touch, wheel, and click event handlers
- Portal-based context menu
- Moon phase calculated via `getMoonPhase()` helper using synodic month formula

### `NotesPanel`
- `useMemo` for stable note key computation
- `useRef` to track note value synchronously (avoids stale closure)
- Each key (day/range/month) is completely independent

### `App`
- Composes all components
- Manages global state
- Provides theme color and gradient to all children
- Houses the sliding notes drawer

---

## 🌐 API Reference

### Open-Meteo Weather API
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=28.6
  &longitude=77.2
  &daily=temperature_2m_max,temperature_2m_min,weathercode
  &timezone=Asia/Kolkata
  &start_date=YYYY-MM-DD
  &end_date=YYYY-MM-DD
```
- **Free** — no API key required
- **Default location** — New Delhi, India (28.6°N, 77.2°E)
- Returns `weathercode`, `temperature_2m_max`, `temperature_2m_min`

### Moon Phase Algorithm
```js
// Known new moon reference: January 6, 2000
const knownNewMoon = new Date(2000, 0, 6)
const lunarCycle = 29.53058867 // synodic month in days
const daysSince = (date - knownNewMoon) / (1000 * 60 * 60 * 24)
const phase = ((daysSince % lunarCycle) + lunarCycle) % lunarCycle
// phase 0–29.53 mapped to 8 moon emojis 🌑🌒🌓🌔🌕🌖🌗🌘
```

---

## 🤝 How to Use

```
1.  Navigate months    → Scroll, swipe, or use ‹ › arrows
2.  Select a date      → Single click
3.  Select a range     → Click start date, then end date
4.  Add a note         → Click "My Notes" → write → Save
5.  Add mood/event     → Right-click any date
6.  Pin a date         → Double-click any date
7.  Move an event      → Drag the event label to another date
8.  Search a date      → Click 🔍 → type date → Go
9.  Toggle dark mode   → Click 🌙 button
10. View 3 months      → Click ⊞ button
11. Moon phases        → Shown automatically on every date 🌕
```

---

## 👨‍💻 Author

**Vaibhav Singh**
- GitHub: [@VaibhavSingh2006](https://github.com/VaibhavSingh2006)
- IIT (ISM) Dhanbad — Adm. No. 24JE0972
- Built as part of takeUforward Frontend Engineering Internship Assignment


---

> *Built with ❤️ using React, Vite, Tailwind CSS, and date-fns by VAIBHAV*

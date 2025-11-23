# StreakStack 🚀

A minimalist daily habit tracker with stunning 3D tower visualizations. Build your habits and watch them grow into impressive towers!

![StreakStack](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8) ![Three.js](https://img.shields.io/badge/Three.js-Latest-black)

## Features ✨

### 🏗️ 3D Tower Visualization

- Each habit is represented as a 3D tower built with stacked cubes
- Every day you complete a habit, a new block is added to the tower
- Interactive camera controls to view your progress from any angle
- Smooth animations when towers grow
- Translucent preview blocks show what's next

### 📊 Habit Management

- Add up to 5 daily habits
- Customize each habit with:
  - Custom name
  - Material Design icon (WaterDrop, SelfImprovement, MenuBook, DirectionsRun, Restaurant)
  - Color theme
- Edit or delete habits anytime

### 🔥 Streak Tracking

- Track consecutive days for each habit
- Current streak displayed above each tower
- Personal best streak recorded
- Streaks reset if you miss a day

### 📈 Progress Dashboard

- **Check-ins This Week**: Total habit completions in the last 7 days
- **Best Current Streak**: Your longest active streak across all habits
- **Perfect Days**: Days when you completed ALL habits

### 💾 Data Persistence

- All data saved locally in your browser
- No account needed, complete privacy
- Automatic saving after each action

## Tech Stack 🛠️

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components (Card, Button, Badge, Dialog, Progress)
- **Three.js** - 3D graphics and animations
  - `@react-three/fiber` - React renderer for Three.js
  - `@react-three/drei` - Useful helpers for Three.js
- **@mui/icons-material** - Material Design icons
- **localStorage** - Data persistence

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd streakstack
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Usage Guide 📖

### Adding Your First Habit

1. Click the **"Add Habit"** button in the top right
2. Enter a habit name (e.g., "Drink Water")
3. Choose an icon that represents your habit
4. Pick a color theme
5. Click **"Add Habit"**

### Daily Check-ins

- Click on any habit card to check it off for today
- A green checkmark appears when completed
- The 3D tower grows by one block
- You can only check once per day

### Viewing Your Progress

- **Tower View**: See all your habits as 3D towers
  - Drag to rotate the camera
  - Scroll to zoom in/out
  - Hover over towers for a wobble effect
- **Stats Dashboard**: Track your overall progress
- **Habit Cards**: Quick view of today's status and streaks

### Managing Habits

- **Edit**: Click the "Edit" button on any habit card
- **Delete**: Click the delete icon (confirms before deleting)
- **Limit**: Maximum 5 habits to keep you focused

## How It Works 🔍

### Streak Logic

Streaks are calculated based on consecutive days:

- Day 1: Check habit → Streak = 1
- Day 2: Check habit → Streak = 2
- Day 3: Skip → Streak = 0
- Day 4: Check habit → Streak = 1 (starts over)

Streaks are checked at midnight (local time). Missing a day resets your streak to 0.

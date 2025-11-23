import { useLocalStorage } from './useLocalStorage';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const DEFAULT_HABITS = [
  { id: '1', name: 'Drink Water', icon: 'WaterDrop', color: '#3b82f6' },
  { id: '2', name: 'Stretch', icon: 'SelfImprovement', color: '#a855f7' },
  { id: '3', name: 'Read', icon: 'MenuBook', color: '#f59e0b' },
  { id: '4', name: 'Exercise', icon: 'DirectionsRun', color: '#ef4444' },
  { id: '5', name: 'Eat Healthy', icon: 'Restaurant', color: '#10b981' },
];

export const ICON_MAP = {
  WaterDrop: WaterDropIcon,
  SelfImprovement: SelfImprovementIcon,
  MenuBook: MenuBookIcon,
  DirectionsRun: DirectionsRunIcon,
  Restaurant: RestaurantIcon,
};

const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export function useHabits() {
  const [habits, setHabits] = useLocalStorage('streakstack_habits', DEFAULT_HABITS);
  const [checkIns, setCheckIns] = useLocalStorage('streakstack_checkins', {});
  const [streaks, setStreaks] = useLocalStorage('streakstack_streaks', {});
  const [bestStreaks, setBestStreaks] = useLocalStorage('streakstack_best_streaks', {});

  const today = getTodayString();

  // Calculate current streak for a habit
  const calculateStreak = (habitId) => {
    const habitCheckIns = checkIns[habitId] || [];
    if (!habitCheckIns.includes(today)) {
      // Check if yesterday was checked
      if (!habitCheckIns.includes(getYesterdayString())) {
        return 0;
      }
    }

    let streak = 0;
    const currentDate = new Date();

    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (habitCheckIns.includes(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Check if habit is completed today
  const isCheckedToday = (habitId) => {
    return (checkIns[habitId] || []).includes(today);
  };

  // Toggle habit check-in for today
  const toggleHabit = (habitId) => {
    setCheckIns((prev) => {
      const habitCheckIns = prev[habitId] || [];
      const newCheckIns = { ...prev };

      if (habitCheckIns.includes(today)) {
        // Uncheck
        newCheckIns[habitId] = habitCheckIns.filter((date) => date !== today);
      } else {
        // Check
        newCheckIns[habitId] = [...habitCheckIns, today];
      }

      return newCheckIns;
    });

    // Update streak
    setTimeout(() => {
      const newStreak = calculateStreak(habitId);
      setStreaks((prev) => ({ ...prev, [habitId]: newStreak }));

      // Update best streak if current is higher
      setBestStreaks((prev) => {
        const currentBest = prev[habitId] || 0;
        if (newStreak > currentBest) {
          return { ...prev, [habitId]: newStreak };
        }
        return prev;
      });
    }, 0);
  };

  // Add new habit
  const addHabit = (habit) => {
    if (habits.length >= 5) {
      return false;
    }
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
    };
    setHabits([...habits, newHabit]);
    return true;
  };

  // Update habit
  const updateHabit = (habitId, updates) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === habitId ? { ...habit, ...updates } : habit))
    );
  };

  // Delete habit
  const deleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    // Also clean up related data
    setCheckIns((prev) => {
      const newCheckIns = { ...prev };
      delete newCheckIns[habitId];
      return newCheckIns;
    });
    setStreaks((prev) => {
      const newStreaks = { ...prev };
      delete newStreaks[habitId];
      return newStreaks;
    });
  };

  // Get stats
  const getStats = () => {
    const currentStreaks = habits.map((h) => calculateStreak(h.id));
    const bestCurrentStreak = Math.max(...currentStreaks, 0);

    // Count check-ins this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoString = weekAgo.toISOString().split('T')[0];

    let weeklyCheckIns = 0;
    Object.values(checkIns).forEach((dates) => {
      weeklyCheckIns += dates.filter((date) => date >= weekAgoString).length;
    });

    // Count perfect days (all habits checked)
    const allDates = new Set();
    Object.values(checkIns).forEach((dates) => {
      dates.forEach((date) => allDates.add(date));
    });

    let perfectDays = 0;
    allDates.forEach((date) => {
      const checkedCount = habits.filter((h) =>
        (checkIns[h.id] || []).includes(date)
      ).length;
      if (checkedCount === habits.length) {
        perfectDays++;
      }
    });

    return {
      weeklyCheckIns,
      bestCurrentStreak,
      perfectDays,
    };
  };

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    isCheckedToday,
    getStreak: calculateStreak,
    getBestStreak: (habitId) => bestStreaks[habitId] || 0,
    getStats,
  };
}

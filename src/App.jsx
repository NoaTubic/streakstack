import { useState } from 'react';
import { useHabits } from './hooks/useHabits';
import { HabitCard } from './components/HabitCard';
import { HabitDialog } from './components/HabitDialog';
import { Stats } from './components/Stats';
import { TowerScene } from './components/Tower';
import { Button } from './components/ui/button';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    isCheckedToday,
    getStreak,
    getBestStreak,
    getStats,
  } = useHabits();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const stats = getStats();

  const handleAddHabit = () => {
    setEditingHabit(null);
    setDialogOpen(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setDialogOpen(true);
  };

  const handleSaveHabit = (habitData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      const success = addHabit(habitData);
      if (!success) {
        alert('Maximum 5 habits allowed!');
      }
    }
  };

  const handleDeleteHabit = (habitId) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">StreakStack</h1>
              <p className="text-gray-500 mt-1">Build your habits, watch them grow</p>
            </div>
            {habits.length < 5 && (
              <Button onClick={handleAddHabit} className="flex items-center gap-2">
                <AddIcon />
                Add Habit
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <Stats stats={stats} />
        </div>

        {/* 3D Tower Visualization */}
        {habits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Tower View</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-96">
                <TowerScene
                  habits={habits}
                  getStreak={getStreak}
                  isCheckedToday={isCheckedToday}
                />
              </div>
            </div>
          </div>
        )}

        {/* Habit Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Habits</h2>
            <span className="text-sm text-gray-500">
              {habits.filter((h) => isCheckedToday(h.id)).length} / {habits.length} completed
            </span>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">No habits yet. Start building your stack!</p>
              <Button onClick={handleAddHabit} className="flex items-center gap-2 mx-auto">
                <AddIcon />
                Add Your First Habit
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isChecked={isCheckedToday(habit.id)}
                  streak={getStreak(habit.id)}
                  bestStreak={getBestStreak(habit.id)}
                  onToggle={() => toggleHabit(habit.id)}
                  onEdit={() => handleEditHabit(habit)}
                  onDelete={() => handleDeleteHabit(habit.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-8">
          <p>Keep building your streaks, one day at a time! 🚀</p>
        </footer>
      </main>

      {/* Add/Edit Habit Dialog */}
      <HabitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveHabit}
        initialHabit={editingHabit}
      />
    </div>
  );
}

export default App;

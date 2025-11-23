import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { ICON_MAP } from '../hooks/useHabits';

const AVAILABLE_ICONS = [
  { name: 'WaterDrop', label: 'Water' },
  { name: 'SelfImprovement', label: 'Meditation' },
  { name: 'MenuBook', label: 'Book' },
  { name: 'DirectionsRun', label: 'Running' },
  { name: 'Restaurant', label: 'Food' },
  { name: 'FitnessCenter', label: 'Gym' },
  { name: 'LocalCafe', label: 'Coffee' },
  { name: 'Bedtime', label: 'Sleep' },
  { name: 'Spa', label: 'Relaxation' },
  { name: 'Nature', label: 'Nature' },
  { name: 'MusicNote', label: 'Music' },
  { name: 'Brush', label: 'Art' },
  { name: 'Work', label: 'Work' },
  { name: 'Psychology', label: 'Mental' },
  { name: 'Favorite', label: 'Heart' },
  { name: 'DirectionsBike', label: 'Cycling' },
  { name: 'Pool', label: 'Swimming' },
  { name: 'LocalFlorist', label: 'Flower' },
  { name: 'EmojiPeople', label: 'Social' },
  { name: 'AutoStories', label: 'Journal' },
];

const AVAILABLE_COLORS = [
  '#3b82f6', // blue
  '#a855f7', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#10b981', // green
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#8b5cf6', // violet
];

export function HabitDialog({ open, onOpenChange, onSave, initialHabit = null }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('WaterDrop');
  const [color, setColor] = useState('#10b981');

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setIcon(initialHabit.icon);
      setColor(initialHabit.color);
    } else {
      setName('');
      setIcon('WaterDrop');
      setColor('#10b981');
    }
  }, [initialHabit, open]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name, icon, color });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialHabit ? 'Edit Habit' : 'Add New Habit'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter habit name..."
              maxLength={30}
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map((iconOption) => {
                const IconComponent = ICON_MAP[iconOption.name];
                return (
                  <button
                    key={iconOption.name}
                    onClick={() => setIcon(iconOption.name)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      icon === iconOption.name
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent style={{ fontSize: 24 }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="grid grid-cols-8 gap-2">
              {AVAILABLE_COLORS.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-10 h-10 rounded-full transition-all hover:scale-110 ${
                    color === colorOption ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color + '20' }}
              >
                {(() => {
                  const IconComponent = ICON_MAP[icon];
                  return <IconComponent style={{ color, fontSize: 28 }} />;
                })()}
              </div>
              <span className="font-semibold">{name || 'Habit Name'}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {initialHabit ? 'Save Changes' : 'Add Habit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { ICON_MAP } from '../hooks/useHabits';

export function HabitCard({
  habit,
  isChecked,
  streak,
  bestStreak,
  onToggle,
  onEdit,
  onDelete,
}) {
  const IconComponent = ICON_MAP[habit.icon] || ICON_MAP.WaterDrop;

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
        isChecked ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onToggle}
    >
      <CardContent className="px-6 pt-7 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: habit.color + '20' }}
            >
              <IconComponent style={{ color: habit.color, fontSize: 28 }} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{habit.name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Streak: {streak}
                </Badge>
                {bestStreak > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Best: {bestStreak}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isChecked ? (
              <CheckCircleIcon className="text-primary" style={{ fontSize: 32 }} />
            ) : (
              <RadioButtonUncheckedIcon className="text-gray-300" style={{ fontSize: 32 }} />
            )}
          </div>
        </div>

        {isChecked && (
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <CheckCircleIcon style={{ fontSize: 16 }} />
            <span>Completed today</span>
          </div>
        )}

        <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <SettingsIcon style={{ fontSize: 16, marginRight: 4 }} />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <DeleteIcon style={{ fontSize: 16 }} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from './ui/card';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export function Stats({ stats }) {
  const statItems = [
    {
      label: 'Check-ins This Week',
      value: stats.weeklyCheckIns,
      icon: TrendingUpIcon,
      color: '#3b82f6',
    },
    {
      label: 'Best Current Streak',
      value: stats.bestCurrentStreak,
      icon: WhatshotIcon,
      color: '#f59e0b',
    },
    {
      label: 'Perfect Days',
      value: stats.perfectDays,
      icon: EmojiEventsIcon,
      color: '#10b981',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statItems.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="px-6 pt-4 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '20' }}
                >
                  <IconComponent style={{ color: stat.color, fontSize: 28 }} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

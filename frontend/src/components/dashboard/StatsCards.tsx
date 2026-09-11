import { Mail, MailOpen, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { useDashboardStats } from '../../hooks/useTracking';
import { Skeleton } from '../ui/skeleton';

export function StatsCards() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Sent',
      value: stats?.totalSent ?? 0,
      icon: Mail,
      color: 'text-blue-400',
    },
    {
      title: 'Total Opened',
      value: stats?.totalOpened ?? 0,
      icon: MailOpen,
      color: 'text-success',
    },
    {
      title: 'Open Rate',
      value: `${stats?.openRate ?? 0}%`,
      icon: BarChart3,
      color: 'text-primary',
    },
    {
      title: 'Avg Opens / Email',
      value: stats?.avgOpensPerEmail ?? 0,
      icon: TrendingUp,
      color: 'text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

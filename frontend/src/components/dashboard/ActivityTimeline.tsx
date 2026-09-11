import { useRecentActivity } from '../../hooks/useTracking';
import { Skeleton } from '../ui/skeleton';
import { Clock, Globe } from 'lucide-react';

export function ActivityTimeline() {
  const { data: activities, isLoading } = useRecentActivity(8);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No activity yet
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
        >
          <div className="mt-1 h-2 w-2 rounded-full bg-success shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {activity.tracking.recipientEmail}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {activity.tracking.subject || 'No subject'}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(activity.detectedAt).toLocaleString()}
              </span>
              {activity.ip && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {activity.ip}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

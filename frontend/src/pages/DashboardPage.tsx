import { StatsCards } from '../components/dashboard/StatsCards';
import { EmailTable } from '../components/dashboard/EmailTable';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { CreateEmailDialog } from '../components/tracking/CreateEmailDialog';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { Info } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your email opens in real-time
          </p>
        </div>
        <CreateEmailDialog />
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          Tracking detects when an email is opened. This does not guarantee the
          recipient read the email — automated pre-fetches by privacy-focused
          email clients may trigger false positives.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <CardTitle className="text-base mb-4">Tracked Emails</CardTitle>
              <EmailTable />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <CardTitle className="text-base mb-4">Recent Activity</CardTitle>
              <ActivityTimeline />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

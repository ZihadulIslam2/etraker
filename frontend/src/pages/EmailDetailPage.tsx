import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Clock, Globe, Monitor, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useEmailDetail } from '../hooks/useTracking';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { parseUserAgent } from '../lib/userAgent';

export function EmailDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: email, isLoading } = useEmailDetail(id ?? null);
  const [copied, setCopied] = useState(false);

  const getTrackingUrl = (emailId: string) => {
    let baseUrl = import.meta.env.VITE_API_URL;
    if (!baseUrl) {
      baseUrl = `${window.location.origin}/api`;
    } else if (!baseUrl.endsWith('/api')) {
      baseUrl = `${baseUrl.replace(/\/$/, '')}/api`;
    }
    return `${baseUrl}/track/open/${emailId}`;
  };

  const copyTrackingUrl = () => {
    if (!email) return;
    const url = getTrackingUrl(email.id);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Email tracking record not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {email.recipientEmail}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {email.subject || 'No subject'}
          </p>
        </div>
        <Badge variant={email.status === 'opened' ? 'success' : 'secondary'}>
          {email.status === 'opened' ? 'Opened' : 'Sent'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Mail className="h-4 w-4" /> Sent At
            </div>
            <p className="font-medium">{new Date(email.sentAt).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Clock className="h-4 w-4" /> Open Count
            </div>
            <p className="text-2xl font-bold text-primary">{email.openCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Globe className="h-4 w-4" /> Last IP
            </div>
            <p className="font-medium font-mono text-sm">
              {email.lastIp ?? '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Monitor className="h-4 w-4" /> Last Opened
            </div>
            <p className="font-medium text-sm">
              {email.openedAt ? new Date(email.openedAt).toLocaleString() : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-base">Tracking Pixel URL</CardTitle>
            <Button variant="outline" size="sm" onClick={copyTrackingUrl}>
              {copied ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="p-3 rounded-lg bg-secondary font-mono text-xs text-muted-foreground break-all">
            {getTrackingUrl(email.id)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Add this as a 1x1 image in your email HTML to track opens.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <CardTitle className="text-base mb-4">Open Event History</CardTitle>
          {email.opens.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No opens detected yet
            </p>
          ) : (
            <div className="space-y-1">
              {email.opens.map((open) => (
                <div
                  key={open.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors text-sm"
                >
                  <div className="h-2 w-2 rounded-full bg-success shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {open.ip ?? 'Unknown IP'}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span>{new Date(open.detectedAt).toLocaleString()}</span>
                    </div>
                    {open.userAgent && (() => {
                      const parsed = parseUserAgent(open.userAgent);
                      return (
                        <div className="flex items-center gap-2 mt-1.5 text-xs">
                          <span className="font-medium text-foreground">
                            {parsed.clientName}
                          </span>
                          {parsed.isProxy && (
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 font-normal">
                              Proxy
                            </Badge>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

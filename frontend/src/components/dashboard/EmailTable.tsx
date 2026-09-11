import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useEmailList } from '../../hooks/useTracking';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export function EmailTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useEmailList({ page, limit: 10, search });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const emails = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or subject..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Recipient</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Subject</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Sent At</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Opens</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Last Opened</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Detail</th>
            </tr>
          </thead>
          <tbody>
            {emails.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-muted-foreground">
                  No tracked emails yet. Create your first tracking record to get started.
                </td>
              </tr>
            ) : (
              emails.map((email) => (
                <tr
                  key={email.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-3 font-medium">{email.recipientEmail}</td>
                  <td className="p-3 text-muted-foreground">{email.subject || '—'}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(email.sentAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {email.openCount}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {email.openedAt
                      ? new Date(email.openedAt).toLocaleString()
                      : '—'}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant={email.status === 'opened' ? 'success' : 'secondary'}>
                      {email.status === 'opened' ? 'Opened' : 'Sent'}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => navigate(`/email/${email.id}`)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(meta.page - 1) * meta.limit + 1}-
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

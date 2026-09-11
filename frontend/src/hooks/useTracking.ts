import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { EmailTracking, DashboardStats, PaginatedResponse, OpenEvent } from '../types';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data;
    },
  });
}

export function useEmailList(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return useQuery<PaginatedResponse<EmailTracking>>({
    queryKey: ['email-list', params],
    queryFn: async () => {
      const { data } = await api.get('/tracking', { params });
      return data;
    },
  });
}

export function useEmailDetail(id: string | null) {
  return useQuery<EmailTracking & { opens: OpenEvent[] }>({
    queryKey: ['email-detail', id],
    queryFn: async () => {
      const { data } = await api.get(`/tracking/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useRecentActivity(limit = 10) {
  return useQuery<OpenEvent[]>({
    queryKey: ['recent-activity', limit],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/recent-activity', {
        params: { limit },
      });
      return data;
    },
  });
}

export function useCreateTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { recipientEmail: string; subject?: string }) => {
      const { data } = await api.post('/tracking', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

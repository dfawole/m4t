// client/src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '@shared/schema';
import { getQueryFn, apiRequest } from '@/lib/queryClient';

export function useAuth() {
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useQuery<User | null>({
		queryKey: ['/api/auth/user'],
		retry: false,
		queryFn: getQueryFn({ on401: 'returnNull' }),
	});

	const logoutMutation = useMutation({
		mutationFn: async () => {
			await apiRequest('POST', '/api/logout');
		},
		onSuccess: () => {
			// Clear user data from cache
			queryClient.setQueryData(['/api/auth/user'], null);
			// Redirect to home page
			window.location.href = '/';
		},
		onError: (error) => {
			console.error('Logout error:', error);
			// Force redirect even if logout request fails
			window.location.href = '/';
		},
	});

	const logout = () => {
		logoutMutation.mutate();
	};

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		logout,
		isLoggingOut: logoutMutation.isPending,
	};
}

//client/src/hooks/useJwtAuth.ts
// import { useState, useEffect } from 'react';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { apiRequest, queryClient } from '@/lib/queryClient';
// import { useToast } from '@/hooks/use-toast';

// interface User {
// 	id: string;
// 	email: string | null;
// 	firstName: string | null;
// 	lastName: string | null;
// 	profileImageUrl: string | null;
// 	role: string;
// }

// interface LoginResponse {
// 	accessToken: string;
// 	user: User;
// }

// interface RefreshResponse {
// 	accessToken: string;
// }

// export function useJwtAuth() {
// 	const { toast } = useToast();
// 	const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));

// 	// Get current user using JWT
// 	const {
// 		data: user,
// 		isLoading,
// 		error,
// 	} = useQuery({
// 		queryKey: ['/api/jwt/user'],
// 		queryFn: async () => {
// 			if (!token) return null;

// 			try {
// 				const response = await fetch('/api/jwt/user', {
// 					headers: {
// 						'Authorization': `Bearer ${token}`,
// 					},
// 				});

// 				if (!response.ok) {
// 					if (response.status === 401) {
// 						// Token expired, try to refresh
// 						return await refreshToken();
// 					}
// 					throw new Error('Failed to fetch user');
// 				}

// 				return await response.json();
// 			} catch (error) {
// 				console.error('Error fetching user:', error);
// 				return null;
// 			}
// 		},
// 		enabled: !!token,
// 	});

// 	// Refresh token function
// 	const refreshToken = async () => {
// 		try {
// 			const response = await fetch('/api/jwt/refresh', {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 			});

// 			if (!response.ok) {
// 				throw new Error('Failed to refresh token');
// 			}

// 			const data: RefreshResponse = await response.json();
// 			setToken(data.accessToken);
// 			localStorage.setItem('jwt_token', data.accessToken);

// 			// Re-fetch user with new token
// 			const userResponse = await fetch('/api/jwt/user', {
// 				headers: {
// 					'Authorization': `Bearer ${data.accessToken}`,
// 				},
// 			});

// 			if (!userResponse.ok) {
// 				throw new Error('Failed to fetch user with new token');
// 			}

// 			return await userResponse.json();
// 		} catch (error) {
// 			console.error('Error refreshing token:', error);
// 			logout();
// 			return null;
// 		}
// 	};

// 	// Login mutation
// 	const loginMutation = useMutation({
// 		mutationFn: async (credentials: { email: string }) => {
// 			// Make the request without using apiRequest to have more control over the response
// 			try {
// 				const response = await fetch('/api/jwt/login', {
// 					method: 'POST',
// 					headers: {
// 						'Content-Type': 'application/json',
// 					},
// 					body: JSON.stringify(credentials),
// 				});

// 				if (!response.ok) {
// 					const errorData = await response.json();
// 					throw new Error(errorData.message || 'Login failed');
// 				}

// 				return (await response.json()) as LoginResponse;
// 			} catch (error) {
// 				console.error('Login error:', error);
// 				throw error;
// 			}
// 		},
// 		onSuccess: (data: LoginResponse) => {
// 			if (data.accessToken) {
// 				setToken(data.accessToken);
// 				localStorage.setItem('jwt_token', data.accessToken);

// 				if (data.user) {
// 					queryClient.setQueryData(['/api/jwt/user'], data.user);
// 				}

// 				// Force a refetch to make sure we have the most up-to-date user data
// 				queryClient.invalidateQueries({ queryKey: ['/api/jwt/user'] });

// 				toast({
// 					title: 'Login Successful',
// 					description: `Welcome back, ${data.user?.firstName || 'User'}!`,
// 				});
// 			}
// 		},
// 		onError: (error: Error) => {
// 			toast({
// 				title: 'Login Failed',
// 				description: error.message || 'Could not log in. Please try again.',
// 				variant: 'destructive',
// 			});
// 		},
// 	});

// 	// Logout mutation
// 	const logoutMutation = useMutation({
// 		mutationFn: async () => {
// 			await apiRequest('POST', '/api/jwt/logout');
// 		},
// 		onSuccess: () => {
// 			setToken(null);
// 			localStorage.removeItem('jwt_token');
// 			queryClient.setQueryData(['/api/jwt/user'], null);
// 		},
// 		onError: (error: Error) => {
// 			toast({
// 				title: 'Logout Failed',
// 				description: error.message,
// 				variant: 'destructive',
// 			});
// 		},
// 	});

// 	// Helper function to logout
// 	const logout = () => {
// 		setToken(null);
// 		localStorage.removeItem('jwt_token');
// 		queryClient.setQueryData(['/api/jwt/user'], null);
// 	};

// 	// Attach token to all requests
// 	useEffect(() => {
// 		const originalFetch = window.fetch;
// 		window.fetch = async (input, init) => {
// 			// Skip if not authenticated or not an API request
// 			if (!token || (typeof input === 'string' && !input.startsWith('/api/'))) {
// 				return originalFetch(input, init);
// 			}

// 			// Add token to request headers
// 			const headers = init?.headers ? new Headers(init.headers) : new Headers();
// 			headers.set('Authorization', `Bearer ${token}`);

// 			const modifiedInit = {
// 				...init,
// 				headers,
// 			};

// 			try {
// 				const response = await originalFetch(input, modifiedInit);

// 				// If unauthorized and not already trying to refresh, try refreshing token
// 				if (response.status === 401 && input !== '/api/jwt/refresh') {
// 					await refreshToken();

// 					// Retry the original request with the new token
// 					const retryHeaders = init?.headers ? new Headers(init.headers) : new Headers();
// 					retryHeaders.set('Authorization', `Bearer ${localStorage.getItem('jwt_token')}`);

// 					return originalFetch(input, {
// 						...init,
// 						headers: retryHeaders,
// 					});
// 				}

// 				return response;
// 			} catch (error) {
// 				console.error('Fetch error:', error);
// 				return originalFetch(input, init);
// 			}
// 		};

// 		return () => {
// 			window.fetch = originalFetch;
// 		};
// 	}, [token]);

// 	return {
// 		user,
// 		isLoading,
// 		error,
// 		login: loginMutation.mutate,
// 		logout: logoutMutation.mutate,
// 		isAuthenticated: !!user,
// 	};
// }

// client/src/hooks/useJwtAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

interface User {
	id: string;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
	profileImageUrl: string | null;
	role: string;
}

interface LoginResponse {
	accessToken: string;
	user: User;
}

interface RefreshResponse {
	accessToken: string;
}

export function useJwtAuth() {
	const { toast } = useToast();
	const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));

	// Keep localStorage in sync
	useEffect(() => {
		if (token) {
			localStorage.setItem('jwt_token', token);
		} else {
			localStorage.removeItem('jwt_token');
		}
	}, [token]);

	// Function to refresh JWT
	const refreshToken = useCallback(async (): Promise<string> => {
		const res = await fetchWithAuth('/api/jwt/refresh', {
			method: 'POST',
		});
		if (!res.ok) {
			throw new Error('Failed to refresh token');
		}
		const data = (await res.json()) as RefreshResponse;
		setToken(data.accessToken);
		return data.accessToken;
	}, []);

	// Fetch current user
	const {
		data: user,
		isLoading,
		error,
	} = useQuery<User | null>({
		queryKey: ['jwt-user'],
		enabled: !!token,
		retry: false,
		queryFn: async () => {
			// First try to get the user
			let res = await fetchWithAuth('/api/jwt/user');
			// If unauthorized, try refreshing and retry
			if (res.status === 401) {
				await refreshToken();
				res = await fetchWithAuth('/api/jwt/user');
			}
			if (!res.ok) {
				throw new Error('Failed to fetch user');
			}
			return res.json();
		},
	});

	// Login mutation
	const loginMutation = useMutation<LoginResponse, Error, { email: string }>({
		mutationFn: async (credentials) => {
			const res = await fetchWithAuth('/api/jwt/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials),
			});
			if (!res.ok) {
				const errData = await res.json();
				throw new Error(errData.message || 'Login failed');
			}
			return res.json();
		},
		onSuccess: (data) => {
			setToken(data.accessToken);
			// Prime the cache with the user
			queryClient.setQueryData(['jwt-user'], data.user);
			queryClient.invalidateQueries({ queryKey: ['jwt-user'] });
			toast({
				title: 'Login Successful',
				description: `Welcome back, ${data.user.firstName || 'User'}!`,
			});
		},
		onError: (err) => {
			toast({
				title: 'Login Failed',
				description: err.message,
				variant: 'destructive',
			});
		},
	});

	// Logout mutation
	const logoutMutation = useMutation<void, Error, void>({
		mutationFn: async () => {
			const res = await fetchWithAuth('/api/jwt/logout', { method: 'POST' });
			if (!res.ok) {
				throw new Error('Logout failed');
			}
		},
		onSuccess: () => {
			setToken(null);
			queryClient.removeQueries({ queryKey: ['jwt-user'] });
		},
		onError: (err) => {
			toast({
				title: 'Logout Failed',
				description: err.message,
				variant: 'destructive',
			});
		},
	});

	return {
		user,
		isLoading,
		error,
		login: loginMutation.mutate,
		logout: logoutMutation.mutate,
		isAuthenticated: Boolean(user),
	};
}

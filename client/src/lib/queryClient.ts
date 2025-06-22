// import { QueryClient, QueryFunction } from "@tanstack/react-query";

// async function throwIfResNotOk(res: Response) {
//   if (!res.ok) {
//     const text = (await res.text()) || res.statusText;
//     throw new Error(`${res.status}: ${text}`);
//   }
// }

// export async function apiRequest(
//   method: string,
//   url: string,
//   data?: unknown | undefined,
// ): Promise<Response> {
//   // Ensure URL starts with /api/ for consistent backend routing
//   const apiUrl = url.startsWith('/api/') ? url : `/api${url.startsWith('/') ? url : '/' + url}`;

//   try {
//     const res = await fetch(apiUrl, {
//       method,
//       headers: data ? { "Content-Type": "application/json" } : {},
//       body: data ? JSON.stringify(data) : undefined,
//       credentials: "include",
//     });

//     await throwIfResNotOk(res);
//     return res;
//   } catch (error) {
//     console.error(`API request failed for ${method} ${apiUrl}:`, error);
//     throw error;
//   }
// }

// type UnauthorizedBehavior = "returnNull" | "throw";
// export const getQueryFn: <T>(options: {
//   on401: UnauthorizedBehavior;
// }) => QueryFunction<T> =
//   ({ on401: unauthorizedBehavior }) =>
//   async ({ queryKey }) => {
//     // Make sure queryKey[0] is a string and properly formatted
//     if (!queryKey[0] || typeof queryKey[0] !== 'string') {
//       throw new Error(`Invalid query key: ${JSON.stringify(queryKey)}`);
//     }

//     // Ensure URL starts with /api/ for consistent backend routing
//     const url = queryKey[0] as string;
//     const apiUrl = url.startsWith('/api/') ? url : `/api${url.startsWith('/') ? url : '/' + url}`;

//     try {
//       // Add error handling for network failures
//       let res;
//       try {
//         res = await fetch(apiUrl, {
//           credentials: "include",
//           // Add cache control to prevent caching issues
//           headers: {
//             'Cache-Control': 'no-cache, no-store, must-revalidate',
//             'Pragma': 'no-cache',
//             'Expires': '0'
//           }
//         });
//       } catch (error) {
//         const networkError = error as Error;
//         console.error(`Network error for ${apiUrl}:`, networkError);
//         throw new Error(`Network request failed: ${networkError.message}`);
//       }

//       // Handle common error statuses gracefully
//       // 401 Unauthorized and 302 Found (redirects to login)
//       if (res.status === 401 || res.status === 302) {
//         console.warn(`Authentication required for ${apiUrl} (${res.status})`);
//         if (unauthorizedBehavior === "returnNull") {
//           // For authentication-related queries, return null to indicate not authenticated
//           return null;
//         } else {
//           // Instead of throwing, just return null to prevent console errors
//           return null;
//         }
//       }

//       // 404 Not Found - return empty data instead of throwing error for optional resources
//       if (res.status === 404) {
//         return {};
//       }

//       await throwIfResNotOk(res);

//       // Handle empty responses gracefully
//       const text = await res.text();
//       if (!text) return {};

//       try {
//         return JSON.parse(text);
//       } catch (parseError) {
//         console.error(`Failed to parse JSON from ${apiUrl}:`, parseError);
//         throw new Error(`Invalid JSON response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
//       }
//     } catch (error) {
//       console.error(`Query failed for ${apiUrl}:`, error);
//       throw error;
//     }
//   };

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       queryFn: getQueryFn({ on401: "throw" }),
//       refetchInterval: false,
//       refetchOnWindowFocus: false,
//       staleTime: Infinity,
//       retry: false,
//     },
//     mutations: {
//       retry: false,
//     },
//   },
// });

/// ====

import { QueryClient, QueryFunction } from '@tanstack/react-query';

async function throwIfResNotOk(res: Response) {
	if (!res.ok) {
		const text = (await res.text()) || res.statusText;
		throw new Error(`${res.status}: ${text}`);
	}
}

export async function apiRequest(
	method: string,
	url: string,
	data?: unknown | undefined
): Promise<Response> {
	// Ensure URL starts with /api/ for consistent backend routing
	const apiUrl = url.startsWith('/api/') ? url : `/api${url.startsWith('/') ? url : '/' + url}`;

	try {
		const res = await fetch(apiUrl, {
			method,
			headers: data ? { 'Content-Type': 'application/json' } : {},
			body: data ? JSON.stringify(data) : undefined,
			credentials: 'include',
		});

		await throwIfResNotOk(res);
		return res;
	} catch (error) {
		console.error(`API request failed for ${method} ${apiUrl}:`, error);
		throw error;
	}
}

type UnauthorizedBehavior = 'returnNull' | 'throw';
export const getQueryFn: <T>(options: { on401: UnauthorizedBehavior }) => QueryFunction<T> =
	({ on401: unauthorizedBehavior }) =>
	async ({ queryKey }) => {
		// Make sure queryKey[0] is a string and properly formatted
		if (!queryKey[0] || typeof queryKey[0] !== 'string') {
			throw new Error(`Invalid query key: ${JSON.stringify(queryKey)}`);
		}

		// Ensure URL starts with /api/ for consistent backend routing
		const url = queryKey[0] as string;
		const apiUrl = url.startsWith('/api/') ? url : `/api${url.startsWith('/') ? url : '/' + url}`;

		try {
			// Add error handling for network failures
			let res;
			try {
				res = await fetch(apiUrl, {
					credentials: 'include',
					// Add cache control to prevent caching issues
					headers: {
						'Cache-Control': 'no-cache, no-store, must-revalidate',
						'Pragma': 'no-cache',
						'Expires': '0',
					},
				});
			} catch (error) {
				const networkError = error as Error;
				console.error(`Network error for ${apiUrl}:`, networkError);
				throw new Error(`Network request failed: ${networkError.message}`);
			}

			// Handle common error statuses gracefully
			// 401 Unauthorized and 302 Found (redirects to login)
			if (res.status === 401 || res.status === 302) {
				console.warn(`Authentication required for ${apiUrl} (${res.status})`);
				if (unauthorizedBehavior === 'returnNull') {
					// For authentication-related queries, return null to indicate not authenticated
					return null;
				} else {
					// Instead of throwing, just return null to prevent console errors
					return null;
				}
			}

			// 404 Not Found - return empty data instead of throwing error for optional resources
			if (res.status === 404) {
				return {};
			}

			await throwIfResNotOk(res);

			// Handle empty responses gracefully
			const text = await res.text();
			if (!text) return {};

			try {
				return JSON.parse(text);
			} catch (parseError) {
				console.error(`Failed to parse JSON from ${apiUrl}:`, parseError);
				throw new Error(
					`Invalid JSON response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`
				);
			}
		} catch (error) {
			console.error(`Query failed for ${apiUrl}:`, error);
			throw error;
		}
	};

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: getQueryFn({ on401: 'throw' }),
			refetchInterval: false,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
			retry: false,
		},
		mutations: {
			retry: false,
		},
	},
});

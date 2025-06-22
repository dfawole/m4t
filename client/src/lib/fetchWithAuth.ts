// src/utils/fetchWithAuth.ts
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
	const headers: HeadersInit = {
		...(init?.headers || {}),
		'Content-Type': 'application/json',
	};

	const response = await fetch(input, {
		...init,
		credentials: 'include', // Required for sending cookies
		headers,
	});

	if (response.status === 401) {
		// Optional: trigger auth redirect if not handled elsewhere
		window.location.href = '/login';
		throw new Error('Unauthorized');
	}

	return response;
}

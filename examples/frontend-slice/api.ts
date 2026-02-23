import type { LoginRequest, LoginResponse } from './schema';

export async function loginUser(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return response.json();
}

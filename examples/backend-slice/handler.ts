// --- ASA GENERATED START ---
import { NextRequest, NextResponse } from 'next/server';
import { LoginRequestSchema, type LoginResponse } from './schemas';
import { loginUser } from './repository';
// --- ASA GENERATED END ---

// --- USER CODE START ---
export async function POST(request: NextRequest) {
  const body = await request.json();
  const input = LoginRequestSchema.parse(body);

  const result = await loginUser(input.email, input.password);

  if (!result) {
    return NextResponse.json(
      { error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      { status: 401 }
    );
  }

  const response: LoginResponse = {
    token: result.token,
    expiresIn: result.expiresIn,
  };

  return NextResponse.json(response);
}
// --- USER CODE END ---

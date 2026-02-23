# Purpose
User logs in with email and password. Returns JWT token.

## Inputs
- email: string
- password: string

## Outputs
- jwt_token: string
- expires_in: int

## Behaviour
- Verify user exists in database AND user.is_active = True.
- Verify password matches stored hash (bcrypt).
- Generate JWT token with 24h expiration.
- Return token (never return password hash).

## Errors
- INVALID_CREDENTIALS: Invalid email or password.
- USER_NOT_FOUND: No user with this email exists.
- ACCOUNT_LOCKED: Account has been locked due to too many failed attempts.

## Side Effects
- Updates last_login timestamp in database.

## Dependencies
None

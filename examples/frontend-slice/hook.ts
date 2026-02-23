import useSWRMutation from 'swr/mutation';
import { loginUser } from './api';
import { LoginResponseSchema } from './schema';
import type { LoginRequest, LoginResponse } from './schema';

export function useLogin() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    '/api/auth/login',
    (_url: string, { arg }: { arg: LoginRequest }) => loginUser(arg)
  );

  // ASA Contract Validation
  if (data) {
    const validated = LoginResponseSchema.safeParse(data);
    if (!validated.success) {
      console.error(
        'Contract violation: backend sent invalid data for slice Login',
        {
          issues: validated.error.issues,
          received: data,
        }
      );
    }
  }

  return {
    login: trigger,
    data: data as LoginResponse | undefined,
    error,
    isLoading: isMutating,
  };
}

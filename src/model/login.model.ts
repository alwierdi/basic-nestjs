import z from 'zod';

export class LoginUserRequest {
  username: string;
  password: string;
}

export const loginUserRequestValidation = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(50),
});

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        icon={<Mail className="h-5 w-5" />}
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        icon={<Lock className="h-5 w-5" />}
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
      >
        Sign In
      </Button>
    </form>
  );
}
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'business']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        icon={<User className="h-5 w-5" />}
        label="Full Name"
        error={errors.name?.message}
        {...register('name')}
      />
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
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Account Type</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="user"
              {...register('role')}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Regular User</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="business"
              {...register('role')}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Business Owner</span>
          </label>
        </div>
        {errors.role && (
          <p className="text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>
      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
      >
        Create Account
      </Button>
    </form>
  );
}
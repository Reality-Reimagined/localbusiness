import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number').optional(),
  location: z.string().min(2, 'Location is required').optional(),
  bio: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      notifications: {
        email: true,
        push: true,
      },
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: data.name,
          phone: data.phone,
          location: data.location,
          bio: data.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({
        ...user,
        name: data.name,
      });

      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Settings update error:', error);
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Full Name"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
            disabled
          />

          <Input
            label="Phone Number"
            type="tel"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="Location"
            error={errors.location?.message}
            {...register('location')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              {...register('bio')}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('notifications.email')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('notifications.push')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Push notifications</span>
              </label>
            </div>
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
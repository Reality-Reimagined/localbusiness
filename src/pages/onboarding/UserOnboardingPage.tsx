import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Camera } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const userProfileSchema = z.object({
  phone: z.string().min(10, 'Invalid phone number'),
  location: z.string().min(2, 'Location is required'),
  bio: z.string().optional(),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
});

type UserProfileData = z.infer<typeof userProfileSchema>;

const interests = [
  'Home Improvement',
  'Professional Services',
  'Health & Wellness',
  'Automotive',
  'Technology',
  'Education',
];

export function UserOnboardingPage() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserProfileData>({
    resolver: zodResolver(userProfileSchema),
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0 && user) {
        const file = acceptedFiles[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        try {
          const { error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('profiles')
            .getPublicUrl(filePath);

          await supabase
            .from('users')
            .update({ profile_image_url: publicUrl })
            .eq('id', user.id);

        } catch (error) {
          toast.error('Failed to upload profile image');
        }
      }
    },
  });

  const onSubmit = async (data: UserProfileData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          phone: data.phone,
          location: data.location,
          bio: data.bio || null,
          interests: data.interests,
          profile_complete: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({
        ...user,
        profileComplete: true,
      });

      toast.success('Profile completed successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500">
          <input {...getInputProps()} />
          <Camera className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Click or drag to upload profile picture</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-lg shadow p-6">
        <Input
          label="Phone Number"
          type="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
        
        <Input
          icon={<MapPin className="h-5 w-5" />}
          label="Location"
          error={errors.location?.message}
          {...register('location')}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interests.map((interest) => (
              <label key={interest} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={interest}
                  {...register('interests')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{interest}</span>
              </label>
            ))}
          </div>
          {errors.interests && (
            <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
          )}
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          Complete Profile
        </Button>
      </form>
    </div>
  );
}
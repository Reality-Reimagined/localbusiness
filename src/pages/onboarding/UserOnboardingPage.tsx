import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Camera } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useDropzone } from 'react-dropzone';

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
  const { register, handleSubmit, formState: { errors } } = useForm<UserProfileData>({
    resolver: zodResolver(userProfileSchema),
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      // Handle file upload
    },
  });

  const onSubmit = (data: UserProfileData) => {
    // Handle form submission
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

        <Button type="submit" className="w-full">
          Complete Profile
        </Button>
      </form>
    </div>
  );
}
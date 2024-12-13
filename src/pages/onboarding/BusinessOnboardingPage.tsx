import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Clock, Camera, Plus } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const businessProfileSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(10, 'Invalid phone number'),
  website: z.string().url().optional().or(z.literal('')),
  hours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }),
  services: z.array(z.object({
    name: z.string().min(1, 'Service name is required'),
    price: z.number().min(0, 'Price must be positive'),
    duration: z.string().min(1, 'Duration is required'),
  })).min(1, 'Add at least one service'),
});

type BusinessProfileData = z.infer<typeof businessProfileSchema>;

const categories = [
  'Home Services',
  'Professional Services',
  'Health & Wellness',
  'Automotive',
  'Technology',
  'Education',
];

export function BusinessOnboardingPage() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [services, setServices] = useState([{ name: '', price: 0, duration: '' }]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BusinessProfileData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      hours: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: '10:00 AM - 3:00 PM',
        sunday: 'Closed',
      },
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 5,
    onDrop: async (acceptedFiles) => {
      if (!user) return;

      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Math.random()}.${fileExt}`;
          const filePath = `business-images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('businesses')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('businesses')
            .getPublicUrl(filePath);

          return publicUrl;
        });

        const imageUrls = await Promise.all(uploadPromises);

        await supabase
          .from('business_profiles')
          .update({ images: imageUrls })
          .eq('user_id', user.id);

        toast.success('Images uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload images');
      }
    },
  });

  const addService = () => {
    setServices([...services, { name: '', price: 0, duration: '' }]);
  };

  const onSubmit = async (data: BusinessProfileData) => {
    if (!user) return;

    try {
      // Create business profile
      const { error: businessError } = await supabase
        .from('business_profiles')
        .insert({
          user_id: user.id,
          business_name: data.businessName,
          description: data.description,
          category: data.category,
          address: data.address,
          website: data.website || null,
          hours: data.hours,
        });

      if (businessError) throw businessError;

      // Get the created business profile
      const { data: businessProfile } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!businessProfile) throw new Error('Failed to create business profile');

      // Create services
      const servicesData = data.services.map(service => ({
        business_id: businessProfile.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
      }));

      const { error: servicesError } = await supabase
        .from('services')
        .insert(servicesData);

      if (servicesError) throw servicesError;

      // Update user profile completion status
      const { error: userError } = await supabase
        .from('users')
        .update({
          profile_complete: true,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (userError) throw userError;

      setUser({
        ...user,
        profileComplete: true,
      });

      toast.success('Business profile completed successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create business profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Complete Business Profile</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Business Information</h2>
          
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 mb-6">
            <input {...getInputProps()} />
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Upload business photos (up to 5)</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Business Name"
              error={errors.businessName?.message}
              {...register('businessName')}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                {...register('category')}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <Input
              icon={<MapPin className="h-5 w-5" />}
              label="Business Address"
              error={errors.address?.message}
              {...register('address')}
            />

            <Input
              label="Phone Number"
              type="tel"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="Website (optional)"
              type="url"
              error={errors.website?.message}
              {...register('website')}
            />

            <div>
              <h3 className="text-lg font-medium mb-4">Business Hours</h3>
              <div className="grid grid-cols-2 gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day}>
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                      {day}
                    </label>
                    <input
                      type="text"
                      placeholder="9:00 AM - 5:00 PM"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register(`hours.${day}`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Services</h3>
                <Button type="button" variant="outline" onClick={addService}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
              
              <div className="space-y-4">
                {services.map((_, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <Input
                      label="Service Name"
                      {...register(`services.${index}.name`)}
                    />
                    <Input
                      label="Price"
                      type="number"
                      {...register(`services.${index}.price`, {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      label="Duration"
                      placeholder="e.g., 1 hour"
                      {...register(`services.${index}.duration`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full">
              Complete Business Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
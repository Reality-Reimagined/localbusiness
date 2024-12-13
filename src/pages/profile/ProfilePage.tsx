import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <Button
            variant="outline"
            onClick={logout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-10 w-10 text-gray-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{user.location}</span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {/* Implement edit profile */}}
              className="w-full"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
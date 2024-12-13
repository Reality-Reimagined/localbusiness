import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Briefcase, MessageSquare, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">LocalBiz</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/search" className="text-gray-600 hover:text-gray-900">
                <Search className="h-6 w-6" />
              </Link>
              <Link to="/messages" className="text-gray-600 hover:text-gray-900">
                <MessageSquare className="h-6 w-6" />
              </Link>
              {user ? (
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                  <User className="h-6 w-6" />
                </Link>
              ) : (
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
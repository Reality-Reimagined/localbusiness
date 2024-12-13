import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user } = useAuthStore();

  return (
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
            
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
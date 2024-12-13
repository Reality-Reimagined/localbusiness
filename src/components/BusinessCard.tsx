import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { type Business } from '../types';
import { cn } from '../lib/utils';

interface BusinessCardProps {
  business: Business;
  className?: string;
}

export function BusinessCard({ business, className }: BusinessCardProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{business.description}</p>
        </div>
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm font-medium text-gray-600">{business.rating}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {business.location}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        {business.services.slice(0, 2).map((service) => (
          <div key={service.id} className="flex justify-between text-sm">
            <span className="text-gray-600">{service.name}</span>
            <span className="font-medium text-gray-900">${service.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
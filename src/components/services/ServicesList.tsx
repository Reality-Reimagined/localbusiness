import React from 'react';
import { useServices } from '../../hooks/useServices';
import { Clock, DollarSign } from 'lucide-react';

interface ServicesListProps {
  businessId?: string;
}

export function ServicesList({ businessId }: ServicesListProps) {
  const { data: services, isLoading, error } = useServices(businessId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600">Failed to load services</div>
    );
  }

  if (!services?.length) {
    return (
      <div className="text-gray-500">No services available</div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-900">
                <DollarSign className="h-4 w-4" />
                <span>{service.price}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>{service.duration}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
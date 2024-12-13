import React from 'react';
import { Briefcase, Star, Search } from 'lucide-react';

export function FeatureSection() {
  return (
    <section className="grid md:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
        <p className="text-gray-600">Describe your needs and get competitive bids from professionals</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Read Reviews</h3>
        <p className="text-gray-600">Make informed decisions based on genuine customer feedback</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Browse Services</h3>
        <p className="text-gray-600">Explore a wide range of local services and providers</p>
      </div>
    </section>
  );
}
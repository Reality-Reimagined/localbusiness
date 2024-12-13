import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Star } from 'lucide-react';

export function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white">
        <h1 className="text-4xl font-bold mb-6">Find Trusted Local Businesses</h1>
        <p className="text-xl mb-8 text-blue-100">Connect with verified professionals in your area</p>
        <Link
          to="/search"
          className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          <Search className="mr-2 h-5 w-5" />
          Start Searching
        </Link>
      </section>

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
    </div>
  );
}
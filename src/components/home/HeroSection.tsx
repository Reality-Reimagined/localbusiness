import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export function HeroSection() {
  return (
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
  );
}
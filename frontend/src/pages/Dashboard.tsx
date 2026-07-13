import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { Search, MapPin, Home, Loader } from 'lucide-react';

export default function Dashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await API.get('/properties/', {
        params: { limit: 20 },
      });
      setProperties(response.data);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = searchCity
    ? properties.filter(p => p.city.toLowerCase().includes(searchCity.toLowerCase()))
    : properties;

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Property</h1>
          <p className="text-lg opacity-90 mb-8">Powered by AI Price Estimation</p>

          {/* Search Bar */}
          <div className="flex gap-2 bg-white rounded-lg p-2 max-w-md mx-auto">
            <Search size={24} className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search by city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="flex-1 px-4 py-2 text-gray-800 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center">
            <Loader className="animate-spin" size={40} />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Home size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, idx) => {
              const propertyImages = [
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1570129477492-45ac003fbf30?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1506643456615-330fda52c60e?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1580828343604-37b93d8a4b1e?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
              ];
              const imageUrl = propertyImages[idx % propertyImages.length];
              
              return (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden transform hover:scale-105"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img 
                    src={imageUrl} 
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{property.title}</h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin size={18} />
                    <span className="text-sm line-clamp-1">{property.city}, {property.postcode}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>🛏️ {property.bedrooms} bed</span>
                    <span>🚿 {property.bathrooms} bath</span>
                    <span>📐 {property.square_feet} sqft</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {property.asking_price ? `£${property.asking_price.toLocaleString()}` : 'TBD'}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {property.property_type}
                    </span>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

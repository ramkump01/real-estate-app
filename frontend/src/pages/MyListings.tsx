import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { Edit2, Trash2, Eye, Loader } from 'lucide-react';

export default function MyListings() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const response = await API.get('/properties/my-listings');
      setProperties(response.data);
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await API.delete(`/properties/${id}`);
        setProperties(properties.filter(p => p.id !== id));
        toast.success('Listing deleted');
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
        <button
          onClick={() => navigate('/create-listing')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + New Listing
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">You haven't created any listings yet</p>
          <button
            onClick={() => navigate('/create-listing')}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{property.address}, {property.city}</p>
                <div className="flex gap-4 text-sm">
                  <span>🛏️ {property.bedrooms} bed</span>
                  <span>🚿 {property.bathrooms} bath</span>
                  <span>📐 {property.square_feet} sqft</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="font-semibold">{property.status.toUpperCase()}</p>
                  <p className="text-xs text-blue-600">Fee: £{property.listing_fee_amount}</p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/property/${property.id}`}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Eye size={20} />
                  </Link>
                  <button
                    onClick={() => navigate(`/create-listing?id=${property.id}`)}
                    className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

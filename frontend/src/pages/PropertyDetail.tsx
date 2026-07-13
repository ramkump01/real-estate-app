import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { Loader, Home, MapPin, DollarSign, Zap } from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [estimate, setEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [estimating, setEstimating] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await API.get(`/properties/${id}`);
      setProperty(response.data);
      fetchEstimate();
    } catch (error) {
      toast.error('Failed to load property');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstimate = async () => {
    try {
      const response = await API.get(`/ai/price-estimate/${id}`);
      setEstimate(response.data);
    } catch (error) {
      console.log('No estimate yet');
    }
  };

  const handleGetEstimate = async () => {
    try {
      setEstimating(true);
      const response = await API.post('/ai/price-estimate', { property_id: parseInt(id!) });
      setEstimate(response.data);
      toast.success('Price estimate generated! 🤖');
    } catch (error) {
      toast.error('Failed to generate estimate');
    } finally {
      setEstimating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (!property) {
    return <div className="text-center py-12">Property not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Image */}
        <div className="bg-gradient-to-r from-blue-400 to-indigo-600 h-80 flex items-center justify-center">
          <span className="text-white text-2xl">Property Image</span>
        </div>

        {/* Details */}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{property.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <MapPin size={20} />
                <span>{property.address}, {property.city}, {property.postcode}</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">{property.property_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-semibold">{property.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-semibold">{property.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-semibold">{property.square_feet} sq ft</span>
                </div>
              </div>
            </div>

            {/* AI Estimate Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-200">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={24} className="text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-800">AI Price Estimate</h3>
              </div>

              {estimate ? (
                <div>
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    £{estimate.estimated_price.toLocaleString()}
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Confidence Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${estimate.confidence_score * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{(estimate.confidence_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded">{estimate.analysis}</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">No estimate yet. Click below to generate one using AI.</p>
                  <button
                    onClick={handleGetEstimate}
                    disabled={estimating}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {estimating ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        Get AI Estimate
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Listing Fee */}
          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Listing Fee:</span> £{property.listing_fee_amount} {property.listing_fee_paid ? '✓ Paid' : '- Not yet paid'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

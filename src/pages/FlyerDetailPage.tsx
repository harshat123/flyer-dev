import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  ThumbsUp, 
  Flame, 
  Heart, 
  MapPin, 
  Clock, 
  Copy,
  Calendar,
  User,
  Tag,
  Share2,
  Flag
} from 'lucide-react';
import { useFlyers } from '../contexts/FlyerContext';
import { formatDistanceToNow, format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

const FlyerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { flyers, incrementViews, addReaction } = useFlyers();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const navigate = useNavigate();

  const flyer = flyers.find(f => f.id === id);

  useEffect(() => {
    if (flyer) {
      incrementViews(flyer.id);
    }
  }, [flyer, incrementViews]);

  if (!flyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Flyer Not Found</h1>
          <Link to="/" className="text-orange-600 hover:text-orange-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleReaction = (reactionType: 'likes' | 'fire' | 'heart') => {
    addReaction(flyer.id, reactionType);
  };

  const copyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const shareFlyer = () => {
    if (navigator.share) {
      navigator.share({
        title: flyer.title,
        text: flyer.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedCode('link');
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      food: 'bg-orange-500',
      groceries: 'bg-green-500',
      events: 'bg-purple-500',
      markets: 'bg-blue-500',
      cricket: 'bg-red-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const isExpired = new Date() > flyer.expiryDate;
  const isExpiringSoon = () => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return threeDaysFromNow > flyer.expiryDate && !isExpired;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={shareFlyer}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span className="hidden sm:inline">Share</span>
              </button>
              
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <Flag className="h-5 w-5" />
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Status Badges */}
          <div className="relative">
            {isExpired && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Expired
                </div>
              </div>
            )}
            
            {!isExpired && isExpiringSoon() && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Expiring Soon
                </div>
              </div>
            )}

            <div className="absolute top-4 right-4 z-10">
              <span className={`${getCategoryColor(flyer.category)} text-white px-3 py-1 rounded-full text-sm font-semibold capitalize`}>
                {flyer.category}
              </span>
            </div>

            {/* Flyer Image */}
            <div className="h-64 sm:h-80 bg-gray-200">
              {flyer.imageUrl ? (
                <img
                  src={flyer.imageUrl}
                  alt={flyer.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-gray-400 text-center">
                    <Calendar className="h-16 w-16 mx-auto mb-4" />
                    <p>No Image Available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Title and Meta */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {flyer.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{flyer.userDisplayName}</span>
                </div>
                
                {(flyer.city || flyer.state) && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{flyer.city}{flyer.city && flyer.state && ', '}{flyer.state}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Posted {formatDistanceToNow(flyer.createdAt, { addSuffix: true })}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{flyer.views} views</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleReaction('likes')}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{flyer.reactions.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReaction('fire')}
                    className="flex items-center space-x-1 text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    <Flame className="h-4 w-4" />
                    <span>{flyer.reactions.fire}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReaction('heart')}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{flyer.reactions.heart}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {flyer.description}
              </p>
            </div>

            {/* Codes */}
            {(flyer.discountCode || flyer.redeemCode) && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Codes & Offers</h2>
                <div className="space-y-3">
                  {flyer.discountCode && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center text-green-600 font-medium mb-1">
                            <Tag className="h-4 w-4 mr-2" />
                            Discount Code
                          </div>
                          <div className="font-mono text-lg text-green-800 bg-white px-3 py-2 rounded border">
                            {flyer.discountCode}
                          </div>
                        </div>
                        <button
                          onClick={() => copyCode(flyer.discountCode!, 'discount')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {flyer.redeemCode && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center text-blue-600 font-medium mb-1">
                            <Tag className="h-4 w-4 mr-2" />
                            Redeem Code
                          </div>
                          <div className="font-mono text-lg text-blue-800 bg-white px-3 py-2 rounded border">
                            {flyer.redeemCode}
                          </div>
                        </div>
                        <button
                          onClick={() => copyCode(flyer.redeemCode!, 'redeem')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expiry Information */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Expiry Date</h3>
                  <p className={`text-sm ${isExpired ? 'text-red-600' : isExpiringSoon() ? 'text-orange-600' : 'text-gray-600'}`}>
                    {format(flyer.expiryDate, 'MMMM d, yyyy')}
                    {isExpired && ' (Expired)'}
                    {!isExpired && isExpiringSoon() && ' (Expiring Soon)'}
                  </p>
                </div>
                
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-900">Time Remaining</h3>
                  <p className={`text-sm ${isExpired ? 'text-red-600' : isExpiringSoon() ? 'text-orange-600' : 'text-gray-600'}`}>
                    {isExpired 
                      ? 'Expired' 
                      : formatDistanceToNow(flyer.expiryDate, { addSuffix: true })
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Flyers */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            More from {flyer.category}
          </h2>
          <div className="text-center py-8 text-gray-500">
            <Link
              to={`/category/${flyer.category}`}
              className="text-orange-600 hover:text-orange-800 font-medium"
            >
              View all {flyer.category} flyers →
            </Link>
          </div>
        </div>
      </div>

      {/* Copy Success Message */}
      {copiedCode && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm z-50">
          {copiedCode === 'discount' ? 'Discount code' : 
           copiedCode === 'redeem' ? 'Redeem code' : 
           'Link'} copied!
        </div>
      )}
    </div>
  );
};

export default FlyerDetailPage;
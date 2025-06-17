import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter, 
  SortAsc, 
  SortDesc,
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useFlyers } from '../contexts/FlyerContext';
import FlyerCard from '../components/FlyerCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = {
  food: { name: 'Food', icon: '🍛', description: 'Restaurants, home food, catering' },
  groceries: { name: 'Groceries', icon: '🛒', description: 'Indian stores, fresh produce' },
  events: { name: 'Events', icon: '🎉', description: 'Cultural events, festivals, meetups' },
  markets: { name: 'Markets', icon: '🏪', description: 'Bazaars, pop-up shops, vendors' },
  cricket: { name: 'Cricket', icon: '🏏', description: 'Matches, tournaments, clubs' }
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { getFlyersByCategory, loading } = useFlyers();
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'reactions'>('newest');

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!category || !categories[category as keyof typeof categories]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link to="/" className="text-orange-600 hover:text-orange-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = categories[category as keyof typeof categories];
  const categoryFlyers = getFlyersByCategory(category);

  // Sort flyers based on selected criteria
  const sortedFlyers = [...categoryFlyers].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views;
      case 'reactions':
        const aReactions = a.reactions.likes + a.reactions.fire + a.reactions.heart;
        const bReactions = b.reactions.likes + b.reactions.fire + b.reactions.heart;
        return bReactions - aReactions;
      case 'newest':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="text-4xl">{categoryInfo.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {categoryInfo.name} Flyers
              </h1>
              <p className="text-gray-600 mt-1">
                {categoryInfo.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <p className="text-lg font-bold text-blue-900">{categoryFlyers.length}</p>
                  <p className="text-blue-700 text-sm">Active Flyers</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Eye className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <p className="text-lg font-bold text-green-900">
                    {categoryFlyers.reduce((sum, flyer) => sum + flyer.views, 0)}
                  </p>
                  <p className="text-green-700 text-sm">Total Views</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-orange-500 mr-3" />
                <div>
                  <p className="text-lg font-bold text-orange-900">
                    {categoryFlyers.reduce((sum, flyer) => 
                      sum + flyer.reactions.likes + flyer.reactions.fire + flyer.reactions.heart, 0
                    )}
                  </p>
                  <p className="text-orange-700 text-sm">Total Reactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-gray-900">
              {sortedFlyers.length} flyers found
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Sort by:</span>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="views">Most Viewed</option>
              <option value="reactions">Most Reactions</option>
            </select>
          </div>
        </div>

        {/* Flyers Grid */}
        {sortedFlyers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{categoryInfo.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {categoryInfo.name.toLowerCase()} flyers yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to post a flyer in this category!
            </p>
            <Link
              to="/post-flyer"
              className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Post First Flyer
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedFlyers.map((flyer) => (
              <FlyerCard key={flyer.id} flyer={flyer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
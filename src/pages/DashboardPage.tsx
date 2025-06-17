import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Eye, 
  ThumbsUp, 
  Flame, 
  Heart, 
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFlyers } from '../contexts/FlyerContext';
import { formatDistanceToNow } from 'date-fns';
import FlyerCard from '../components/FlyerCard';

const DashboardPage = () => {
  const { user, userProfile } = useAuth();
  const { flyers, getUserFlyers, getTrendingFlyers } = useFlyers();
  const [activeTab, setActiveTab] = useState<'overview' | 'my-flyers' | 'analytics'>('overview');

  const userFlyers = getUserFlyers(user?.uid || '');
  const trendingFlyers = getTrendingFlyers();

  const totalViews = userFlyers.reduce((sum, flyer) => sum + flyer.views, 0);
  const totalReactions = userFlyers.reduce((sum, flyer) => 
    sum + flyer.reactions.likes + flyer.reactions.fire + flyer.reactions.heart, 0
  );

  const weeklyLimit = 2;
  const flyersThisWeek = userProfile?.flyersPostedThisWeek || 0;
  const canPostMore = flyersThisWeek < weeklyLimit;

  const stats = [
    {
      title: 'My Flyers',
      value: userFlyers.length,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Views',
      value: totalViews,
      icon: Eye,
      color: 'bg-green-500'
    },
    {
      title: 'Total Reactions',
      value: totalReactions,
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      title: 'This Week',
      value: `${flyersThisWeek}/${weeklyLimit}`,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.displayName?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your flyers and track their performance
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {canPostMore ? (
                <Link
                  to="/post-flyer"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Post New Flyer
                </Link>
              ) : (
                <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Weekly Limit Reached
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Limit Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Posting Limit</h3>
            <span className="text-sm text-gray-500">
              Resets every Monday
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                flyersThisWeek >= weeklyLimit ? 'bg-red-500' : 'bg-orange-500'
              }`}
              style={{ width: `${(flyersThisWeek / weeklyLimit) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {flyersThisWeek} of {weeklyLimit} flyers posted
            </span>
            <span className={flyersThisWeek >= weeklyLimit ? 'text-red-600' : 'text-orange-600'}>
              {weeklyLimit - flyersThisWeek} remaining
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'my-flyers', name: 'My Flyers', icon: Calendar },
                { id: 'analytics', name: 'Analytics', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  {userFlyers.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No flyers yet</h4>
                      <p className="text-gray-600 mb-4">
                        Start by posting your first flyer to connect with the community
                      </p>
                      {canPostMore && (
                        <Link
                          to="/post-flyer"
                          className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Post Your First Flyer
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userFlyers.slice(0, 3).map((flyer) => (
                        <div key={flyer.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            {flyer.imageUrl ? (
                              <img
                                src={flyer.imageUrl}
                                alt={flyer.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {flyer.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(flyer.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {flyer.views}
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {flyer.reactions.likes + flyer.reactions.fire + flyer.reactions.heart}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trending Flyers */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending in Community</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingFlyers.slice(0, 3).map((flyer) => (
                      <FlyerCard key={flyer.id} flyer={flyer} showTrending />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* My Flyers Tab */}
            {activeTab === 'my-flyers' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    My Flyers ({userFlyers.length})
                  </h3>
                  {canPostMore && (
                    <Link
                      to="/post-flyer"
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Flyer
                    </Link>
                  )}
                </div>

                {userFlyers.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-medium text-gray-900 mb-2">No flyers posted yet</h4>
                    <p className="text-gray-600 mb-6">
                      Share your business, events, or offers with the Indian community
                    </p>
                    {canPostMore && (
                      <Link
                        to="/post-flyer"
                        className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Post Your First Flyer
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userFlyers.map((flyer) => (
                      <FlyerCard key={flyer.id} flyer={flyer} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Analytics</h3>
                  
                  {userFlyers.length === 0 ? (
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-xl font-medium text-gray-900 mb-2">No analytics yet</h4>
                      <p className="text-gray-600">
                        Post flyers to see detailed analytics and performance metrics
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Performance Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <div className="flex items-center">
                            <Eye className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                              <p className="text-2xl font-bold text-blue-900">{totalViews}</p>
                              <p className="text-blue-700">Total Views</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                          <div className="flex items-center">
                            <ThumbsUp className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                              <p className="text-2xl font-bold text-green-900">
                                {userFlyers.reduce((sum, flyer) => sum + flyer.reactions.likes, 0)}
                              </p>
                              <p className="text-green-700">Total Likes</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                          <div className="flex items-center">
                            <Flame className="h-8 w-8 text-red-500 mr-3" />
                            <div>
                              <p className="text-2xl font-bold text-red-900">
                                {userFlyers.reduce((sum, flyer) => sum + flyer.reactions.fire, 0)}
                              </p>
                              <p className="text-red-700">Fire Reactions</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Top Performing Flyers */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Top Performing Flyers</h4>
                        <div className="space-y-4">
                          {userFlyers
                            .sort((a, b) => b.views - a.views)
                            .slice(0, 5)
                            .map((flyer, index) => (
                              <div key={flyer.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                
                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                  {flyer.imageUrl ? (
                                    <img
                                      src={flyer.imageUrl}
                                      alt={flyer.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Calendar className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-medium text-gray-900 truncate">
                                    {flyer.title}
                                  </h5>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {flyer.category}
                                  </p>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Eye className="h-4 w-4 mr-1" />
                                    {flyer.views}
                                  </div>
                                  <div className="flex items-center">
                                    <Heart className="h-4 w-4 mr-1" />
                                    {flyer.reactions.likes + flyer.reactions.fire + flyer.reactions.heart}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
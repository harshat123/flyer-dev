import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Bell, Settings, MessageCircle, Users, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Desifyar
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening in your community today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Messages',
              value: '24',
              change: '+12%',
              icon: MessageCircle,
              color: 'bg-blue-500'
            },
            {
              title: 'Connections',
              value: '156',
              change: '+8%',
              icon: Users,
              color: 'bg-green-500'
            },
            {
              title: 'Events',
              value: '8',
              change: '+3%',
              icon: Calendar,
              color: 'bg-purple-500'
            },
            {
              title: 'Growth',
              value: '23%',
              change: '+5%',
              icon: TrendingUp,
              color: 'bg-orange-500'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} from last week</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      user: 'Sarah Johnson',
                      action: 'shared a new post in',
                      target: 'Web Development',
                      time: '2 hours ago',
                      avatar: 'SJ'
                    },
                    {
                      user: 'Michael Chen',
                      action: 'commented on your post in',
                      target: 'Design Feedback',
                      time: '4 hours ago',
                      avatar: 'MC'
                    },
                    {
                      user: 'Emily Rodriguez',
                      action: 'joined the group',
                      target: 'React Developers',
                      time: '6 hours ago',
                      avatar: 'ER'
                    },
                    {
                      user: 'David Kim',
                      action: 'started a discussion in',
                      target: 'Career Advice',
                      time: '8 hours ago',
                      avatar: 'DK'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {activity.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.action}{' '}
                          <span className="font-medium text-blue-600">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Start a Discussion</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Find People</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Create Event</span>
                </button>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { topic: 'React 18 Features', posts: '24 posts' },
                    { topic: 'Remote Work Tips', posts: '18 posts' },
                    { topic: 'UI/UX Design', posts: '15 posts' },
                    { topic: 'Career Growth', posts: '12 posts' }
                  ].map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{trend.topic}</p>
                        <p className="text-xs text-gray-500">{trend.posts}</p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
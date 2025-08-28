"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { getDashboardEarnings } from "@/lib/stripe";

interface DashboardData {
  overview: {
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalWatchTime: number;
    totalTips: number;
    completionRate: number;
    lensRecommendations: number;
  };
  recent: {
    videosLast30Days: number;
    viewsLast30Days: number;
    tipsLast30Days: number;
  };
  videoPerformance: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    watchTime: number;
    completionRate: number;
    createdAt: string;
  }>;
  monthlyEarnings: Record<string, number>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatorId] = useState("demo-creator"); // In real app, get from auth

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getDashboardEarnings(creatorId);
        setData(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [creatorId]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
          <p className="text-gray-400">Track your content performance and earnings</p>
        </div>

        {data && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Videos</h3>
                <p className="text-2xl font-bold text-white">{data.overview.totalVideos}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Views</h3>
                <p className="text-2xl font-bold text-white">{data.overview.totalViews.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Watch Time</h3>
                <p className="text-2xl font-bold text-white">{formatDuration(data.overview.totalWatchTime)}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Earnings</h3>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(data.overview.totalTips)}</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Completion Rate</h3>
                <p className="text-2xl font-bold text-white">{data.overview.completionRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Average video completion</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">LENS Recommendations</h3>
                <p className="text-2xl font-bold text-blue-400">{data.overview.lensRecommendations}</p>
                <p className="text-xs text-gray-500 mt-1">Personalized feed appearances</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Total Likes</h3>
                <p className="text-2xl font-bold text-red-400">{data.overview.totalLikes.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Across all videos</p>
              </div>
            </div>

            {/* Recent Performance */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Last 30 Days</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">New Videos</p>
                  <p className="text-xl font-bold text-white">{data.recent.videosLast30Days}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Views</p>
                  <p className="text-xl font-bold text-white">{data.recent.viewsLast30Days.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tips Received</p>
                  <p className="text-xl font-bold text-green-400">{formatCurrency(data.recent.tipsLast30Days)}</p>
                </div>
              </div>
            </div>

            {/* Top Videos */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Top Performing Videos</h3>
              <div className="space-y-4">
                {data.videoPerformance.slice(0, 5).map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-white truncate">{video.title}</h4>
                      <p className="text-sm text-gray-400">
                        {video.views.toLocaleString()} views • {video.likes} likes • {video.completionRate.toFixed(1)}% completion
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Watch Time</p>
                      <p className="font-medium text-white">{formatDuration(video.watchTime / 1000)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Earnings Chart */}
            {Object.keys(data.monthlyEarnings).length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Earnings</h3>
                <div className="space-y-2">
                  {Object.entries(data.monthlyEarnings)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 6)
                    .map(([month, earnings]) => (
                      <div key={month} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                        <span className="text-gray-300">{new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                        <span className="font-medium text-green-400">{formatCurrency(earnings / 100)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


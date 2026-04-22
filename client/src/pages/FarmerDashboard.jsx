import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setWeatherError('Please enter a city name.');
      return;
    }
    setWeatherLoading(true);
    setWeatherError('');
    setWeather(null);
    try {
      const res = await API.get(`/weather?city=${encodeURIComponent(city)}`);
      setWeather(res.data);
    } catch (err) {
      setWeatherError(err.response?.data?.message || 'Could not fetch weather. Try again.');
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <span className="text-4xl">👨‍🌾</span>
            </div>
            <div>
              <p className="text-green-200 text-sm font-medium uppercase tracking-wide">Welcome back</p>
              <h1 className="text-3xl font-bold">{user?.name} 🌱</h1>
              <p className="text-green-200 text-sm mt-1">{user?.email}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <p className="text-green-200 text-xs uppercase tracking-wide">Role</p>
              <p className="text-white font-semibold capitalize mt-1">🌾 {user?.role}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <p className="text-green-200 text-xs uppercase tracking-wide">Status</p>
              <p className="text-white font-semibold mt-1">✅ Active</p>
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-gray-800 font-bold text-lg mb-1">🌤️ Weather & Farming Insights</h2>
          <p className="text-gray-500 text-sm mb-5">Enter your farm's location to get today's weather and farming tips.</p>

          <div className="flex space-x-3 mb-5">
            <input
              type="text"
              value={city}
              onChange={(e) => { setCity(e.target.value); setWeatherError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter city (e.g. Nakuru, Nairobi)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={fetchWeather}
              disabled={weatherLoading}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg text-sm font-semibold transition disabled:opacity-60"
            >
              {weatherLoading ? '...' : 'Search'}
            </button>
          </div>

          {weatherError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              ⚠️ {weatherError}
            </div>
          )}

          {weather && (
            <div className="space-y-4">
              {/* Weather Stats */}
              <div className="bg-green-50 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-800 font-bold text-xl">
                      📍 {weather.city}, {weather.country}
                    </p>
                    <p className="text-gray-600 text-sm capitalize mt-1">{weather.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-700 font-bold text-3xl">{weather.temp}°C</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-gray-500 text-xs">Humidity</p>
                    <p className="text-gray-800 font-bold text-lg">{weather.humidity}%</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-gray-500 text-xs">Wind Speed</p>
                    <p className="text-gray-800 font-bold text-lg">{weather.windSpeed} m/s</p>
                  </div>
                </div>
              </div>

              {/* Farming Insight */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <p className="text-yellow-800 font-bold text-sm uppercase tracking-wide mb-2">
                  🌾 Today's Farming Insight
                </p>
                <p className="text-gray-700 text-base">
                  {weather.icon} {weather.insight}
                </p>
              </div>
            </div>
          )}

          {!weather && !weatherLoading && !weatherError && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-3">🌍</p>
              <p className="text-sm">Search for your city to see weather conditions and farming tips</p>
            </div>
          )}
        </div>

        {/* Tips Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-gray-800 font-bold text-lg mb-4">📋 General Farming Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '💧', tip: 'Water crops early morning to reduce evaporation.' },
              { icon: '🌱', tip: 'Rotate crops each season to maintain soil health.' },
              { icon: '🐛', tip: 'Regularly inspect crops for pests and diseases.' },
              { icon: '📦', tip: 'Keep records of your yield for better planning.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-gray-600 text-sm">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FarmerModal from '../components/FarmerModal';
import API from '../api/axios';

const AdminDashboard = () => {
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [farmersRes, statsRes] = await Promise.all([
        API.get('/farmers'),
        API.get('/farmers/stats')
      ]);
      setFarmers(farmersRes.data.farmers);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAdd = () => {
    setSelectedFarmer(null);
    setModalOpen(true);
  };

  const handleEdit = (farmer) => {
    setSelectedFarmer(farmer);
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await API.delete(`/farmers/${id}`);
      showSuccess(`${name} has been deleted.`);
      fetchData();
    } catch (err) {
      setError('Failed to delete farmer.');
    }
  };

  const handleModalSubmit = async (form) => {
    setSubmitLoading(true);
    setError('');
    try {
      if (selectedFarmer) {
        await API.put(`/farmers/${selectedFarmer.id}`, form);
        showSuccess('Farmer updated successfully!');
      } else {
        await API.post('/farmers', form);
        showSuccess('Farmer added successfully!');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase()) ||
    (f.location || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.crop || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🛠️ Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage all registered farmers on Farm Mall</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
            ✅ {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 flex items-center space-x-4">
            <div className="bg-green-100 rounded-full p-4">
              <span className="text-3xl">👨‍🌾</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Farmers</p>
              <p className="text-green-700 font-bold text-3xl">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-4">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Showing Now</p>
              <p className="text-blue-700 font-bold text-3xl">{filteredFarmers.length}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl shadow-md p-6 flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <span className="text-3xl">🌱</span>
            </div>
            <div>
              <p className="text-green-200 text-sm">Platform</p>
              <p className="text-white font-bold text-xl">Farm Mall</p>
            </div>
          </div>
        </div>

        {/* Farmers Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-gray-800 font-bold text-lg">All Farmers</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, crop..."
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
              />
              <button
                onClick={handleAdd}
                className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
              >
                + Add Farmer
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🌱</div>
              <p className="text-gray-400 text-sm">Loading farmers...</p>
            </div>
          ) : filteredFarmers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">👨‍🌾</div>
              <p className="text-gray-500 font-medium">
                {search ? 'No farmers match your search.' : 'No farmers registered yet.'}
              </p>
              {!search && (
                <button
                  onClick={handleAdd}
                  className="mt-4 bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition"
                >
                  Add your first farmer
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Crop</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFarmers.map((farmer, index) => (
                    <tr key={farmer.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 rounded-full w-9 h-9 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                            {farmer.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{farmer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{farmer.email}</td>
                      <td className="px-6 py-4 text-gray-600">{farmer.location || <span className="text-gray-300">—</span>}</td>
                      <td className="px-6 py-4">
                        {farmer.crop ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            {farmer.crop}
                          </span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{farmer.phone || <span className="text-gray-300">—</span>}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(farmer)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(farmer.id, farmer.name)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <FarmerModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setError(''); }}
        onSubmit={handleModalSubmit}
        farmer={selectedFarmer}
        loading={submitLoading}
      />
    </div>
  );
};

export default AdminDashboard;
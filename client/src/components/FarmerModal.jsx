import { useState, useEffect } from 'react';

const FarmerModal = ({ isOpen, onClose, onSubmit, farmer, loading }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    crop: '',
    phone: ''
  });

  useEffect(() => {
    if (farmer) {
      setForm({
        name: farmer.name || '',
        email: farmer.email || '',
        location: farmer.location || '',
        crop: farmer.crop || '',
        phone: farmer.phone || ''
      });
    } else {
      setForm({ name: '', email: '', location: '', crop: '', phone: '' });
    }
  }, [farmer, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-green-700 rounded-t-2xl px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">
            {farmer ? '✏️ Edit Farmer' : '➕ Add New Farmer'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-green-200 text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. John Kamau"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="e.g. john@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Nakuru, Kenya"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Crop</label>
            <input
              type="text"
              name="crop"
              value={form.crop}
              onChange={handleChange}
              placeholder="e.g. Maize, Tomatoes, Tea"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +254 712 345 678"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition disabled:opacity-60"
            >
              {loading ? 'Saving...' : farmer ? 'Update Farmer' : 'Add Farmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerModal;

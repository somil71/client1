import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/profile');
      setUser(res.data.data);
      setFormData({ name: res.data.data.name });
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/user/login');
      }
      setMessage({ text: 'Failed to load profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setSaving(true);
    
    try {
      const res = await api.patch('/user/profile', formData);
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      setMessage({ text: 'Profile updated successfully', type: 'success' });
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to update profile', 
        type: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6 md:p-8"
          >
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex items-center gap-6 mb-8 pb-8 border-b">
              <div className="w-20 h-20 bg-gradient-to-br from-saffron-500 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase shadow-md">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <div className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                  ROLE: {user?.role}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition border-gray-300"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                  disabled
                  readOnly
                />
                <p className="mt-1 text-xs text-gray-500">Email address cannot be changed.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary min-w-[140px]"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

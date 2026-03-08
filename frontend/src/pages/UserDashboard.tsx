import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

export default function UserDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/requests/me');
      setRequests(res.data.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/user/login');
      } else {
        setError('Failed to fetch requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-saffron-100 text-saffron-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
          <Link to="/request-help" className="btn btn-primary">
            New Request
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin"></div>
          </div>
        ) : requests.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-16"
          >
            <div className="w-20 h-20 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-saffron-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No requests yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't submitted any assistance requests yet. If you need help, please submit a new request.
            </p>
            <Link to="/request-help" className="btn btn-primary inline-flex">
              Submit Request
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {requests.map((request, index) => (
              <motion.div 
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      ID: {request._id.toString().slice(0, 12).toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">{request.typeOfHelp.replace('-', ' ')} Help</h3>
                  <p className="text-gray-600 line-clamp-2 max-w-2xl">{request.description}</p>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0 md:text-right text-left">
                  <span className="text-sm text-gray-500">
                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                  <Link 
                    to={`/track-request?id=${request._id.toString().slice(0, 12).toUpperCase()}`}
                    className="text-saffron-600 hover:text-saffron-800 font-medium inline-flex items-center"
                  >
                    View Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestsAPI } from '../services/api';

export default function TrackRequestPage() {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRequest(null);
    setLoading(true);
    setSearched(true);

    try {
      // The trackingId is the first 12 characters of the MongoDB ObjectId
      const response = await requestsAPI.getRequest(trackingId);
      setRequest(response.data.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Request not found. Please check your tracking ID and try again.'
      );
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'reviewing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'completed':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getStatusMessage = (status: string) => {
    const messages: Record<string, string> = {
      pending: 'Your request is under review. We will reach out soon.',
      reviewing: 'Your request is being actively reviewed by our team.',
      approved: 'Your request has been approved! We will contact you shortly.',
      rejected: 'Unfortunately, your request could not be approved at this time.',
      completed: 'Your request has been completed. Thank you for choosing us!'
    };
    return messages[status] || 'Status unknown';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="min-h-[calc(100vh-80px)]">
        {/* Hero Section */}
        <motion.section
          className="bg-gradient-to-br from-primary-50 to-saffron-50 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="container-max">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Track Your Request
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your tracking ID to check the status of your assistance request
            </p>
          </div>
        </motion.section>

        {/* Search Section */}
        <motion.section
          className="container-max py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tracking ID
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    This is the ID provided in your confirmation email (e.g., 69AC87D81450)
                  </p>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                    placeholder="Enter your tracking ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !trackingId.trim()}
                  className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Track Request'}
                </button>
              </form>

              {error && searched && (
                <motion.div
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="font-medium">Request Not Found</p>
                  <p className="text-sm mt-1">{error}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Request Details Section */}
        {request && (
          <motion.section
            className="container-max pb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-2xl mx-auto">
              {/* Status Overview */}
              <div className={`card p-8 mb-8 border-l-4 ${getStatusColor(request.status)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Request Status
                    </h2>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                        request.status
                      )}`}
                    >
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Request ID</p>
                    <p className="font-mono font-bold text-gray-900">{request._id}</p>
                  </div>
                </div>
                <p className="text-gray-700 mt-4 text-lg">
                  {getStatusMessage(request.status)}
                </p>
              </div>

              {/* Request Details */}
              <div className="card p-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{request.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{request.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{request.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">City</p>
                    <p className="font-semibold text-gray-900">{request.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Type of Help</p>
                    <p className="font-semibold text-gray-900">
                      {request.typeOfHelp.replace(/-/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Urgency Level</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {request.urgencyLevel}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-700">{request.description}</p>
                </div>

                {request.address && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600 mb-2">Address</p>
                    <p className="text-gray-700">{request.address}</p>
                  </div>
                )}
              </div>

              {/* Response Message */}
              {request.responseMessage && (
                <div className="card p-8 mb-8 bg-blue-50 border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Message from Our Team
                  </h3>
                  <p className="text-blue-800">{request.responseMessage}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="card p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-3 h-3 bg-saffron-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Request Submitted</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {request.updatedAt !== request.createdAt && (
                    <div className="flex gap-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-600">
                          {new Date(request.updatedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-12 p-8 bg-gray-50 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  Contact us if you have any questions about your request
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="btn btn-primary"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
}

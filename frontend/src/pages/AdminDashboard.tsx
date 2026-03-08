import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { requestsAPI } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    completedRequests: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    urgencyLevel: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    status: '',
    responseMessage: '',
    adminNotes: '',
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, statsRes] = await Promise.all([
          requestsAPI.listRequests(1, filters),
          requestsAPI.getStatistics(),
        ]);
        setRequests(requestsRes.data.data);
        setStats(statsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setUpdateFormData({
      status: request.status,
      responseMessage: request.responseMessage || '',
      adminNotes: request.adminNotes || '',
    });
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      await requestsAPI.updateStatus(selectedRequest._id, updateFormData);
      setShowModal(false);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id
            ? { ...req, ...updateFormData }
            : req
        )
      );
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to update request:', error);
    }
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

  const StatCard = ({ label, value, color }: any) => (
    <motion.div
      className="card text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`text-4xl font-bold ${color} mb-2`}>{value}</div>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container-max flex items-center justify-between h-20">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container-max py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Requests" value={stats.totalRequests} color="text-saffron-600" />
          <StatCard label="Pending" value={stats.pendingRequests} color="text-yellow-600" />
          <StatCard label="Approved" value={stats.approvedRequests} color="text-green-600" />
          <StatCard label="Completed" value={stats.completedRequests} color="text-purple-600" />
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Urgency</label>
              <select
                value={filters.urgencyLevel}
                onChange={(e) => setFilters({ ...filters, urgencyLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <motion.div
          className="card overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No requests found</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Urgency</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{request.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.typeOfHelp}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        {request.urgencyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-saffron-600 hover:text-saffron-800 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </main>

      {/* Detail Modal */}
      {selectedRequest && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedRequest(null)}
        >
          <motion.div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Request Info */}
              <div className="space-y-4 mb-8 pb-8 border-b">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type of Help</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.typeOfHelp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Urgency Level</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.urgencyLevel}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-semibold text-gray-900">{selectedRequest.description}</p>
                </div>
              </div>

              {/* Update Form */}
              {!showModal ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary w-full"
                >
                  Update Request
                </button>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                    <select
                      value={updateFormData.status}
                      onChange={(e) =>
                        setUpdateFormData({ ...updateFormData, status: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Response Message
                    </label>
                    <textarea
                      value={updateFormData.responseMessage}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          responseMessage: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Message to be sent to the requester..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={updateFormData.adminNotes}
                      onChange={(e) =>
                        setUpdateFormData({ ...updateFormData, adminNotes: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Internal notes..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleUpdateRequest}
                      className="flex-1 btn btn-primary"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}

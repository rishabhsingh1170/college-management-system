import React, { useEffect, useState } from 'react';
import { FaTicketAlt, FaUser, FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { getRequest, putRequest } from '../../api/api';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SupportAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await getRequest('/admin/get-support-tickets');
      setTickets(response.data);
    } catch (err) {
      setError("Failed to fetch support tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (supportId) => {
    try {
      await putRequest(`/admin/update-support-tickets/${supportId}/status`, { newStatus });
      toast.success("Ticket status updated successfully!");
      setEditingTicket(null);
      fetchTickets(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update ticket status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'New': return <FaTicketAlt />;
      case 'In Progress': return <FaSpinner className="animate-spin" />;
      case 'Resolved': return <FaCheckCircle />;
      default: return null;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading support tickets...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        Admin Support Dashboard ⚙️
      </h2>
      
      {tickets.length === 0 ? (
        <div className="text-center text-gray-500 p-8">No support tickets have been submitted.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.support_id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.support_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center space-x-2">
                    <FaUser />
                    <span>{ticket.student_name} (ID: {ticket.student_id})</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{ticket.issue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editingTicket === ticket.support_id ? (
                      <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="p-1 border rounded-md">
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)} {ticket.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingTicket === ticket.support_id ? (
                      <button onClick={() => handleUpdateStatus(ticket.support_id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">Save</button>
                    ) : (
                      <button onClick={() => { setEditingTicket(ticket.support_id); setNewStatus(ticket.status); }} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupportAdmin;
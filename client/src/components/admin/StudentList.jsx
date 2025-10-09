import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaSearch, FaFilter, FaListAlt, FaIdBadge, FaEnvelope, FaPhone, FaBuilding, FaGraduationCap, FaCalendarAlt, FaSave, FaArrowLeft, FaMoneyBillWave, FaEdit, FaCheckCircle, FaTimesCircle, FaDollarSign, FaUser, FaCalendarTimes } from 'react-icons/fa';
import { getRequest, putRequest } from '../../api/api';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSearchSection, setShowSearchSection] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [searchedStudent, setSearchedStudent] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [feeData, setFeeData] = useState([]);
  const [editingFeeId, setEditingFeeId] = useState(null);
  const [newFeeStatus, setNewFeeStatus] = useState('');
  const [newPaidAmount, setNewPaidAmount] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoadingSearch(true);
    setSearchError(null);
    setSearchedStudent(null);
    setViewingStudent(null);
    try {
      const response = await getRequest(`/admin/student/${searchId}/basic`);
      setSearchedStudent(response.data);
    } catch (err) {
      setSearchError(err.response?.data?.message || "Student not found.");
    } finally {
      setLoadingSearch(false);
    }
  };
  
  const fetchPendingStudents = async () => {
    setLoading(true);
    setStudents([]); // Clear the list before fetching
    try {
      const response = await getRequest('/admin/students/pending-fees');
      setStudents(response.data);
    } catch (err) {
      setError("Failed to fetch pending fee student data.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditClick = async (studentId) => {
    try {
      setLoading(true);
      const response = await getRequest(`/admin/student/${studentId}`);
      setViewingStudent(response.data.student);
      setCourses(response.data.courses);
      setSemesters(response.data.semesters);
      setFeeData(response.data.fees);
      toast.success("Student details loaded!");
    } catch (err) {
      setError("Failed to fetch student details.");
      toast.error(err.response?.data?.message || "Student details not found.");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await putRequest(`/admin/student/${viewingStudent.student_id}`, viewingStudent);
      toast.success("Student details updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update student details.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFeeUpdate = async (feeId) => {
    setIsSubmitting(true);
    try {
      await putRequest(`/admin/fees/${feeId}`, { status: newFeeStatus, paid_amount: newPaidAmount });
      toast.success("Fee status updated successfully!");
      await handleEditClick(viewingStudent.student_id);
      setEditingFeeId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update fee status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToList = () => {
    setViewingStudent(null);
    setSearchId('');
    setSearchedStudent(null);
    setSearchError(null);
    setShowSearchSection(true);
  };
  
  useEffect(() => {
    // Initial data fetch is not needed with this design
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN');
  const getStatusColor = (status) => status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const totalDue = feeData.reduce((sum, fee) => sum + (fee.amount - fee.paid_amount), 0);
  const hasDueFees = totalDue > 0;

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (viewingStudent) {
    return (
      <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Edit Student: {viewingStudent.name}
          </h2>
          <button onClick={handleBackToList} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
            <FaArrowLeft />
            <span>Back to List</span>
          </button>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Personal Info</h3>
        <form onSubmit={handlePersonalSubmit} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative"><FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="text" name="name" value={viewingStudent.name} onChange={(e) => setViewingStudent({...viewingStudent, name: e.target.value})} placeholder="Name" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required /></div>
            <div className="relative"><FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="email" name="email" value={viewingStudent.email} onChange={(e) => setViewingStudent({...viewingStudent, email: e.target.value})} placeholder="Email" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required /></div>
            <div className="relative"><FaPhone className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="tel" name="phone_no" value={viewingStudent.phone_no} onChange={(e) => setViewingStudent({...viewingStudent, phone_no: e.target.value})} placeholder="Phone" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" /></div>
            <div className="relative"><FaCalendarAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="date" name="DOB" value={viewingStudent.DOB?.split('T')[0] || ''} onChange={(e) => setViewingStudent({...viewingStudent, DOB: e.target.value})} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" /></div>
            <div className="relative"><FaGraduationCap className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><select name="course_id" value={viewingStudent.course_id} onChange={(e) => setViewingStudent({...viewingStudent, course_id: e.target.value})} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required><option value="">Select Course</option>{courses.map(course => <option key={course.course_id} value={course.course_id}>{course.course_name}</option>)}</select></div>
            <div className="relative"><FaBuilding className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><select name="semester_id" value={viewingStudent.semester_id} onChange={(e) => setViewingStudent({...viewingStudent, semester_id: e.target.value})} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required><option value="">Select Semester</option>{semesters.map(sem => <option key={sem.semester_id} value={sem.semester_id}>Semester {sem.semester_no}</option>)}</select></div>
          </div>
          <div className="text-center">
            <button type="submit" disabled={isSubmitting} className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 mx-auto">
              <FaSave />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 pt-6 border-t border-gray-200">Fee Management</h3>
        <div className="bg-gray-50 rounded-xl shadow-md p-4">
          <div className={`p-4 rounded-xl shadow-md mb-4 ${hasDueFees ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              <div className="flex items-center justify-between">
                <div><p className="text-xl font-semibold mb-1">Total Amount Due</p><p className="text-4xl font-extrabold">{formatCurrency(totalDue)}</p></div>
                {hasDueFees ? <FaCalendarTimes className="text-5xl opacity-40" /> : <FaCheckCircle className="text-5xl opacity-40" />}
              </div>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeData.length > 0 ? (
                  feeData.map((fee) => (
                    <tr key={fee.fee_id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`Semester ${fee.semester_no}`}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(fee.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editingFeeId === fee.fee_id ? (
                          <input type="number" value={newPaidAmount} onChange={(e) => setNewPaidAmount(e.target.value)} className="w-24 p-1 border rounded" />
                        ) : (
                          formatCurrency(fee.paid_amount)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                        {editingFeeId === fee.fee_id ? (
                          <select value={newFeeStatus} onChange={(e) => setNewFeeStatus(e.target.value)} className="w-24 p-1 border rounded">
                            <option value="Paid">Paid</option>
                            <option value="Due">Due</option>
                          </select>
                        ) : (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(fee.status)}`}>{fee.status}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editingFeeId === fee.fee_id ? (
                          <button onClick={() => handleFeeUpdate(fee.fee_id)} disabled={isSubmitting} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Save</button>
                        ) : (
                          <button onClick={() => { setEditingFeeId(fee.fee_id); setNewFeeStatus(fee.status); setNewPaidAmount(fee.paid_amount); }} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Edit</button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (<tr><td colSpan="5" className="text-center text-gray-500 p-4">No fee history found.</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg" data-aos="fade-up">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        Student Management 🧑‍🎓
      </h2>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <button 
          onClick={() => { setShowSearchSection(true); fetchAllStudents(); }} 
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-colors duration-200 ${showSearchSection ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaSearch />
          <span>Update Student Detail</span>
        </button>
        <button 
          onClick={() => { setShowSearchSection(false); fetchPendingStudents(); }} 
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-colors duration-200 ${!showSearchSection ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <FaFilter />
          <span>See Due Fee Student List</span>
        </button>
      </div>

      {showSearchSection ? (
        <div className="p-6 bg-gray-50 rounded-xl shadow-md" data-aos="fade-right">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Search Student</h3>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Student ID"
              required
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={loadingSearch} className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400">
              {loadingSearch ? 'Finding...' : 'Find'}
            </button>
          </form>
          {searchError && <p className="text-red-500 mt-4 text-sm">{searchError}</p>}
          {searchedStudent && (
            <div className="mt-4 p-4 bg-white rounded-md border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h4 className="text-lg font-bold">{searchedStudent.name}</h4>
                <p className="text-sm text-gray-600">ID: {searchedStudent.student_id}</p>
                <p className="text-sm text-gray-600">Email: {searchedStudent.email}</p>
              </div>
              <button onClick={() => handleEditClick(searchedStudent.student_id)} className="mt-2 md:mt-0 text-blue-600 hover:underline">
                View/Edit Details
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-xl shadow-md" data-aos="fade-left">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
            <FaListAlt className="text-red-500" />
            <span>Students with Due Fees</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.student_id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                        <button onClick={() => handleEditClick(student.student_id)}>
                          {student.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.department_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.total_due}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center text-gray-500 p-4">No students with pending fees.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
import React, { useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaSearch, FaListAlt, FaBuilding, FaEnvelope, FaIdBadge, FaPhone, FaArrowLeft, FaSave, FaUserTie, FaCalendarAlt, FaBriefcase, FaDollarSign } from 'react-icons/fa';
import { getRequest, putRequest } from '../../api/api';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchedFaculty, setSearchedFaculty] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  // formData is used for two-way binding in the edit form
  const [formData, setFormData] = useState({ name: '', email: '', phone_no: '', DOB: '', designation: '', specialization: '', dep_id: '', joining_date: '', salary: '' });
  
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, [viewingDetails]);

  const fetchFacultyList = async () => {
    try {
      const response = await getRequest('/admin/faculty-list');
      setFaculty(response.data);
    } catch (err) {
      setError("Failed to fetch faculty list.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoadingSearch(true);
    setSearchError(null);
    setSearchedFaculty(null);
    setViewingDetails(null);
    try {
      // Use the basic endpoint for search preview
      const response = await getRequest(`/admin/faculty/${searchId}/basic`);
      setSearchedFaculty(response.data);
    } catch (err) {
      setSearchError(err.response?.data?.message || "Faculty not found.");
    } finally {
      setLoadingSearch(false);
    }
  };
  
  const handleViewDetails = async (facultyId) => {
    try {
        setLoading(true);
        // *** CORRECTED ENDPOINT ***: Use the endpoint that returns all details
        const response = await getRequest(`/admin/faculty/${facultyId}`); 
        
        // The full response has { faculty: {...}, departments: [...] }
        const facultyData = response.data.faculty;

        // Ensure date inputs are correctly formatted for HTML input type="date"
        const formattedData = {
            ...facultyData,
            DOB: (facultyData.DOB?.split('T')[0]) || '',
            joining_date: (facultyData.joining_date?.split('T')[0]) || '',
            salary: facultyData.salary || 0 // Ensure salary is not null
        };
        
        setViewingDetails(formattedData); // Set the full data object for conditional rendering
        setDepartments(response.data.departments);
        setFormData(formattedData); // Set the form state for editing
        
        toast.success("Faculty details loaded!");
    } catch (err) {
        setError("Failed to fetch faculty details.");
        toast.error(err.response?.data?.message || "Faculty details not found.");
    } finally {
        setLoading(false);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // The formData state already holds the latest values
      await putRequest(`/admin/faculty/${viewingDetails.faculty_id}`, formData);
      toast.success("Faculty details updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update faculty details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToList = () => {
    setViewingDetails(null);
    setSearchId('');
    setSearchedFaculty(null);
    setSearchError(null);
    fetchFacultyList();
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Ensure numeric inputs are handled correctly
    const finalValue = (name === 'salary') ? (parseFloat(value) || '') : value;
    setFormData({ ...formData, [name]: finalValue });
  };
  
  const handleInputDateChange = (e) => {
    const { name, value } = e.target;
    // Update the state with the raw YYYY-MM-DD string
    setFormData({ ...formData, [name]: value });
  };
  
  useEffect(() => {
    fetchFacultyList();
  }, []);

  // Renaming viewingDetails.faculty_id to keep JSX clean
  const facultyId = viewingDetails?.faculty_id;
  
  if (loading) return <div className="p-8 text-center text-gray-500">Loading faculty list...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (viewingDetails) {
    return (
      <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto" data-aos="fade-up">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Edit Faculty: {viewingDetails.name}
          </h2>
          <button onClick={handleBackToList} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
            <FaArrowLeft />
            <span>Back to List</span>
          </button>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Personal Info</h3>
        <form onSubmit={handlePersonalSubmit} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative"><FaUserTie className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="Name" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required /></div>
            <div className="relative"><FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} placeholder="Email" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required /></div>
            <div className="relative"><FaPhone className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="tel" name="phone_no" value={formData.phone_no || ''} onChange={handleInputChange} placeholder="Phone" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" /></div>
            {/* DOB Input: Use the separate handler */}
            <div className="relative"><FaCalendarAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="date" name="DOB" value={formData.DOB || ''} onChange={handleInputDateChange} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" /></div>
            <div className="relative"><FaBriefcase className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="text" name="designation" value={formData.designation || ''} onChange={handleInputChange} placeholder="Designation" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" /></div>
            <div className="relative"><FaUserTie className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="text" name="specialization" value={formData.specialization || ''} onChange={handleInputChange} placeholder="Specialization" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" /></div>
            <div className="relative"><FaBuilding className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><select name="dep_id" value={formData.dep_id || ''} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required><option value="">Select Department</option>{departments.map(dep => <option key={dep.dep_id} value={dep.dep_id}>{dep.name}</option>)}</select></div>
            <div className="relative"><FaDollarSign className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="number" name="salary" value={formData.salary || ''} onChange={handleInputChange} placeholder="Salary" className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" /></div>
            {/* Joining Date Input: Use the separate handler */}
            <div className="relative"><FaCalendarAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" /><input type="date" name="joining_date" value={formData.joining_date || ''} onChange={handleInputDateChange} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div className="text-center">
            <button type="submit" disabled={isSubmitting} className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 mx-auto">
              <FaSave />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-white rounded-xl shadow-lg" data-aos="fade-up">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
        Faculty Management 👨‍🏫
      </h2>

      {/* Search Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-md" data-aos="fade-right">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
          <FaSearch className="text-blue-500" />
          <span>Search Faculty</span>
        </h3>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Faculty ID"
            required
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" disabled={loadingSearch} className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400">
            {loadingSearch ? 'Finding...' : 'Find'}
          </button>
        </form>
        {searchError && <p className="text-red-500 mt-4 text-sm">{searchError}</p>}
        {searchedFaculty && (
          <div className="mt-4 p-4 bg-white rounded-md border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h4 className="text-lg font-bold">{searchedFaculty.name}</h4>
              <p className="text-sm text-gray-600">ID: {searchedFaculty.faculty_id}</p>
              <p className="text-sm text-gray-600">Email: {searchedFaculty.email}</p>
            </div>
            <button onClick={() => handleViewDetails(searchedFaculty.faculty_id)} className="mt-2 md:mt-0 text-blue-600 hover:underline">
              View/Edit Details
            </button>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-gray-200" data-aos="fade-left">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-3">
          <FaListAlt className="text-blue-500" />
          <span>All Faculty Members</span>
        </h3>
        {faculty.length === 0 ? (
          <div className="text-center text-gray-500 p-8">No faculty members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faculty.map((member) => (
                  <tr key={member.faculty_id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.faculty_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                      <button onClick={() => handleViewDetails(member.faculty_id)}>
                        {member.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.department_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyManagement;
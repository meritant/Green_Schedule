import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

function DefectReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);



//   const handleStatusChange = async (reportId, newStatus) => {
//     try {
//       const response = await fetch(`/api/v1/defect-reports/${reportId}/status?status=${newStatus}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
  
//       if (!response.ok) throw new Error('Failed to update status');
  
//       showNotification('success', 'Status updated successfully');
//       fetchReports(); // Refresh the list
//     } catch (error) {
//       showNotification('error', 'Failed to update status');
//     }
//   };



const handleStatusChange = async (reportId, newStatus) => {
    try {
      const response = await fetch(`/api/v1/defect-reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        params: { status: newStatus }  
      });

      if (!response.ok) throw new Error('Failed to update status');

      showNotification('success', 'Status updated successfully');
      fetchReports();
    } catch (error) {
      showNotification('error', 'Failed to update status');
      console.error('Error:', error);
    }
};





  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/defect-reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      setReports(data);
    } catch (error) {
      showNotification('error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Defect Reports</h1>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Report #</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Part</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Defect</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Severity</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reported By</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
    {user.role === 'SUPERVISOR' && (
      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {report.reportNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {report.vehicleNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {report.partName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {report.defectDescription}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.majorDefect 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.majorDefect ? 'Major' : 'Minor'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {report.reportedBy}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {report.reportedAt}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      report.status === 'REPORTED' ? 'bg-yellow-100 text-yellow-800' :
      report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
      report.status === 'FIXED' ? 'bg-green-100 text-green-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {report.status}
    </span>
  </td>
  {user.role === 'SUPERVISOR' && (
    <td className="whitespace-nowrap px-3 py-4 text-sm">
      <select
        value={report.status}
        onChange={(e) => handleStatusChange(report.id, e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        <option value="REPORTED">Reported</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="FIXED">Fixed</option>
        <option value="VERIFIED">Verified</option>
      </select>
    </td>
  )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DefectReportList;
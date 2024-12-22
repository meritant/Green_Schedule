import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';


function DefectReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();

  // A state for modal
const [selectedReport, setSelectedReport] = useState(null);
const [showModal, setShowModal] = useState(false);





  useEffect(() => {
    fetchReports();
  }, [user]);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
        const response = await fetch(`/api/v1/defect-reports/${reportId}/status?status=${newStatus}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to update status');
        showNotification('success', 'Status updated successfully');
        fetchReports();
    } catch (error) {
        showNotification('error', error.message);
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

  // Delete handler
const handleDelete = async (reportId) => {
  if (!window.confirm('Are you sure you want to delete this report?')) return;

  try {
      const response = await fetch(`/api/v1/defect-reports/${reportId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });

      if (!response.ok) throw new Error('Failed to delete report');
      showNotification('success', 'Report deleted successfully');
      fetchReports();
  } catch (error) {
      showNotification('error', 'Failed to delete report');
  }
};

// Modal component
const ReportModal = ({ report, onClose }) => {
  // f ANY item is a major defect, it is Major
  const hasMajorDefect = report.items.some(item => item.majorDefect);
  return (
  
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
          Report Details #{report.reportNumber}
              <span className={`ml-4 px-3 py-1 rounded-full text-sm ${
                hasMajorDefect 
                  ? 'bg-red-500 text-white' 
                  : 'bg-yellow-500 text-gray-900'
              }`}>
                {hasMajorDefect ? 'Major Severity' : 'Minor Severity'}
              </span>
            </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Vehicle Information</h3>
            <div className="space-y-1">
              <p><strong className="mr-2">Vehicle:</strong> {report.vehicleNumber}</p>
              <p><strong className="mr-2">Mileage:</strong> {report.mileage} km</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Defects</h3>
            {report.items.map((item, index) => (
              <div 
                key={index} 
                className={`mt-2 p-4 rounded-lg ${
                  item.majorDefect 
                    ? 'bg-red-50 border-l-4 border-red-500' 
                    : 'bg-yellow-50 border-l-4 border-yellow-500'
                }`}
              >
                <p><strong className="mr-2">Part:</strong> {item.partName}</p>
                <p><strong className="mr-2">Defect:</strong> {item.defectDescription}</p>
                <p>
                  <strong className="mr-2">Severity:</strong> 
                  <span className={item.majorDefect ? 'text-red-600 font-bold' : 'text-yellow-600 font-bold'}>
                    {item.majorDefect ? 'Major' : 'Minor'}
                  </span>
                </p>
                <p>
                  <strong className="mr-2">Status:</strong> 
                  <span className={
                    item.isNotWorking 
                      ? 'text-red-600 font-bold' 
                      : item.isPartiallyWorking 
                        ? 'text-yellow-600 font-bold' 
                        : 'text-green-600 font-bold'
                  }>
                    {item.isNotWorking 
                      ? 'Not Working' 
                      : item.isPartiallyWorking 
                        ? 'Partially Working' 
                        : 'Working'}
                  </span>
                </p>
                {item.comments && (
                  <p className="mt-2">
                    <strong className="mr-2">Comments:</strong> 
                    {item.comments}
                    
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Report Information</h3>
            <div className="space-y-1">
              <p><strong className="mr-2">Reported By:</strong> {report.reportedBy}</p>
              <p><strong className="mr-2">Date:</strong> {report.reportedAt}</p>
              <p>
                <strong className="mr-2">Status:</strong> 
                <span className={`px-2 py-1 rounded-full text-xs ${
                  report.status === 'REPORTED' ? 'bg-yellow-100 text-yellow-800' :
                  report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  report.status === 'FIXED' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {report.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

  // Filter reports for DRIVER
  const filteredReports = user.role === 'DRIVER' 
    ? reports.filter(report => report.reportedBy === user.username)
    : reports;

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen">
        <div className="text-gray-600">Loading...</div>
      
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            {user.role === 'SUPERVISOR' ? 'Defect Reports' : 'My Defect Reports'}
          </h1>
        </div>
        {user.role === 'DRIVER' && (
          <div>
            <button
              onClick={() => navigate('/reports/new')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Report
            </button>
          </div>
        )}
      </div>
      
      {filteredReports.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {user.role === 'SUPERVISOR' 
              ? 'No defect reports found' 
              : 'You don\'t have any reports'}
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Report #</th> */}
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                      {/* <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Part</th> */}
                      {/* <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Defect</th> */}
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Severity</th>
                      {user.role === 'SUPERVISOR' && (
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reported By</th>
                      )}
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      {user.role === 'SUPERVISOR' && (
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredReports.map((report) => (
                      <tr key={report.id}>
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {report.reportNumber}
                        </td> */}
                        <td 
  className="whitespace-nowrap px-3 py-4 text-sm text-blue-600 underline cursor-pointer hover:text-blue-800"
  onClick={() => {
    setSelectedReport(report);
    setShowModal(true);
  }}
>
  {report.vehicleNumber}
</td>
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {report.partName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {report.defectDescription}
                        </td> */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.majorDefect 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.majorDefect ? 'Major' : 'Minor'}
                          </span>
                        </td>
                        {user.role === 'SUPERVISOR' && (
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {report.reportedBy}
                          </td>
                        )}
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


                        {/* Actions column in the table: */}


                        {user.role === 'SUPERVISOR' && (
    <td className="whitespace-nowrap px-3 py-4 text-sm space-x-2">
        <select
            value={report.status}
            onChange={(e) => handleStatusChange(report.id, e.target.value)}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm"
        >
            <option value="REPORTED">Reported</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FIXED">Fixed</option>
            <option value="VERIFIED">Verified</option>
        </select>
        <button
            onClick={() => {
              setSelectedReport(report);
              setShowModal(true);
            }}
            
            className="text-indigo-600 hover:text-indigo-900 mx-2"
        >
            View
        </button>
        <button
            onClick={() => handleDelete(report.id)}
            className="text-red-600 hover:text-red-900"
        >
            Delete
        </button>
    </td>
)}

                        {/* Actions column in the table: END */}


                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}



{/* Main renderer */}
{showModal && selectedReport && ( 
      <ReportModal 
        report={selectedReport} 
        onClose={() => { 
          setSelectedReport(null); 
          setShowModal(false); 
        }} 
      /> 
    )}

{/* Main renderer END */}



    </div>
  );
}

export default DefectReportList;
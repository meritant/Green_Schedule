import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../common/LoadingSpinner';


function DefectReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();

  // A state for modal
const [selectedReport, setSelectedReport] = useState(null);
const [showModal, setShowModal] = useState(false);

// States for filtered reports
const [activeReports, setActiveReports] = useState([]);
const [verifiedReports, setVerifiedReports] = useState([]);


useEffect(() => {
  const filterReports = (reports) => {
    const active = reports.filter(report => report.status !== 'VERIFIED');
    const verified = reports.filter(report => report.status === 'VERIFIED');
    setActiveReports(active);
    setVerifiedReports(verified);
  };
  
  if (user.role === 'DRIVER') {
    filterReports(reports.filter(report => report.reportedBy === user.username));
  } else {
    filterReports(reports);
  }
}, [reports, user]);


useEffect(() => {
  console.log('User:', user); // Log user object
  if (user) {
    fetchReports();
  }
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
  // If ANY item is a major defect, it is Major
  const hasMajorDefect = report.items.some(item => item.majorDefect);
  
  // PDF feature
  
  const handleDownload = async () => {
    try {
        const response = await fetch(`/api/v1/defect-reports/${report.id}/pdf`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to download PDF');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${report.reportNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        showNotification('error', 'Failed to download PDF');
    }
};
  
  // PDF feature END
  
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

{/* Status disabled, doesn't work properly */}

                {/* <p>
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
                </p> */}

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
        <div className="mt-4 flex justify-end space-x-3">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700"
                        >
                            Close
                        </button>
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
        {/* <div className="text-gray-600">Loading...</div> */}
        <LoadingSpinner />
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
      
      {user.role === 'SUPERVISOR' && (
    <div className="mt-4 mb-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-grey-700">
                        <span className="font-medium">Important:</span> To release a vehicle and make it available in the system, the report status must be changed to <strong>"Verified"</strong>.
                    </p>
                </div>
            </div>
        </div>
    </div>
)}

      {activeReports.length === 0 && verifiedReports.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {user.role === 'SUPERVISOR' 
              ? 'No defect reports found' 
              : 'You don\'t have any reports'}
          </p>
        </div>
      ) : (
      <>

        {/* Active Reports Section */}
        <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Active Reports</h2>
            {activeReports.length > 0 ? (
              <div className="mt-4 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vehicle</th>
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
                          {activeReports.map((report) => (
                      <tr key={report.id}>
                        
                        <td 
                          className="whitespace-nowrap px-3 py-4 text-sm text-blue-600 underline cursor-pointer hover:text-blue-800"
                          onClick={() => {
                            setSelectedReport(report);
                            setShowModal(true);
                          }}
                        >
                          {report.vehicleNumber}
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

{/* View button dissabled */}

        {/* <button
            onClick={() => {
              setSelectedReport(report);
              setShowModal(true);
            }}
            
            className="text-indigo-600 hover:text-indigo-900 mx-2"
        >
            View
        </button> */}

        
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
            ) : (
              <p className="text-gray-500">No active reports</p>
            )}
          </div>


           {/* Verified Reports Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Verified Reports</h2>
            {verifiedReports.length > 0 ? (
              <div className="mt-4 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        
                        {/* Existing table header */}
                        <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vehicle</th>
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
                          {verifiedReports.map((report) => (
                            // Existing table row rendering, using verifiedReports




                            <tr key={report.id}>
                              {/* Existing table cell content */}
                              <td 
                                className="whitespace-nowrap px-3 py-4 text-sm text-blue-600 underline cursor-pointer hover:text-blue-800"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setShowModal(true);
                                }}
                              >
                                {report.vehicleNumber}
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
        
        {/* Action Buttons */}

        {/* <button
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
        </button> */}

        {/* Action Buttons END */}
        
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
            ) : (
              <p className="text-gray-500">No verified reports</p>
            )}
          </div>
          

        </>
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
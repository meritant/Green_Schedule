import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import axiosInstance from '../../utils/axiosConfig';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

function DefectReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await axiosInstance.get(`/defect-reports/${id}`);
      setReport(response.data);
    } catch (err) {
      setError('Failed to load report details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.patch(`/defect-reports/${id}/status`, { status: newStatus });
      showNotification('success', 'Report status updated successfully');
      fetchReport();
    } catch (err) {
      showNotification('error', 'Failed to update report status');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!report) return <ErrorMessage message="Report not found" />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Defect Report #{report.reportNumber}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Reported on {new Date(report.reportedAt).toLocaleString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            report.defectOption.isMajorDefect 
              ? 'bg-red-100 text-red-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {report.defectOption.isMajorDefect ? 'Major Defect' : 'Minor Defect'}
          </span>
        </div>

        {/* Details */}
        <div className="border-t border-gray-200">
          <dl>
            {/* Vehicle Information */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Vehicle</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {report.vehicleNumber} - {report.vehicleMake} {report.vehicleModel}
              </dd>
            </div>

            {/* Defect Information */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Part</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {report.defectOption.partName}
              </dd>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Defect Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {report.defectOption.description}
              </dd>
            </div>

            {/* Working Status */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="space-y-2">
                  {report.isPartiallyWorking && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md mr-2">
                      Partially Working
                    </span>
                  )}
                  {report.isNotWorking && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md">
                      Not Working
                    </span>
                  )}
                </div>
              </dd>
            </div>

            {/* Mileage */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Mileage</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {report.mileage.toLocaleString()}
              </dd>
            </div>

            {/* Comments */}
            {report.comments && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Comments</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {report.comments}
                </dd>
              </div>
            )}

            {/* Reporter Information */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Reported By</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {report.reportedBy} (Employee #{report.employeeNumber})
              </dd>
            </div>
          </dl>
        </div>

        {/* Actions */}
        {user.role === 'SUPERVISOR' && (
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <select
                value={report.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="REPORTED">Reported</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="FIXED">Fixed</option>
                <option value="VERIFIED">Verified</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default DefectReportDetail;
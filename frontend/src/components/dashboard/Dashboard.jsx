import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';
import LoadingSpinner from '../common/LoadingSpinner';

document.title = 'Dashboard | GS';


function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    defectiveVehicles: 0,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user.role === 'SUPERVISOR') {
      const fetchDashboardData = async () => {
        try {
          const response = await axiosInstance.get('/dashboard/stats');
          setStats(response.data);
        } catch (err) {
          setError('Failed to load dashboard data');
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user.role]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome, {user.username}!
      </h1>

      {user.role === 'SUPERVISOR' && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Vehicles
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalVehicles}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Defective Vehicles
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-red-600">
                  {stats.defectiveVehicles}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Reports
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-blue-600">
                  {stats.totalReports}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Use the sidebar menu to:
                </p>
                <ul className="list-disc ml-5 mt-2 text-sm text-blue-700">
                  <li>Manage vehicles and their status</li>
                  <li>View and manage employees</li>
                  <li>Access defect reports - click on vehicle number to view full report details and download PDF</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {user.role === 'DRIVER' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Important Information:
                </p>
                <ul className="list-disc ml-5 mt-2 text-sm text-blue-700">
                  <li>You can report any defects found in your vehicle</li>
                  <li>Use the sidebar to access defect reporting form</li>
                  <li>View your submitted reports and their status</li>
                  <li>Generate and download PDF reports</li>

                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Defect Severity Guidelines:</p>
                <ul className="list-disc ml-5 mt-2 text-sm text-yellow-700">
                  <li><span className="font-medium">Minor Defects:</span> Vehicle can be operated but must be repaired upon arrival</li>
                  <li><span className="font-medium">Major Defects:</span> Stop immediately and contact supervisor/dispatch for further instructions</li>
                  <li>When in doubt, <strong>always prioritize</strong> safety and contact your supervisor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
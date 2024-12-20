import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    defectiveVehicles: 0,
    pendingReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome, {user.username}!
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              Pending Reports
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">
              {stats.pendingReports}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
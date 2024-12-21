import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/vehicles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      showNotification('error', 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Vehicles</h1>
        <Link
          to="/vehicles/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Vehicle
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle.id}
            to={`/vehicles/${vehicle.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{vehicle.vehicleNumber}</h2>
            <div className="text-gray-600">
              <p>{vehicle.make} {vehicle.model}</p>
              <p>License: {vehicle.licensePlate}</p>
              <p className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
                vehicle.status === 'NORMAL' 
                  ? 'bg-green-100 text-green-800'
                  : vehicle.status === 'WARNING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {vehicle.status}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No vehicles found
        </div>
      )}
    </div>
  );
}

export default VehicleList;
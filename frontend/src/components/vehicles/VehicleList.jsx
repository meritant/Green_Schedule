import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const VehicleModal = ({ vehicle, onClose }) => {
    if (!vehicle) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">
                Vehicle Details
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Vehicle Number</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.vehicleNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">License Plate</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.licensePlate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Make</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.make}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Model</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.model}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Year</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.year}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Type</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Schedule Type</label>
                  <p className="mt-1 text-sm text-gray-900">{vehicle.scheduleTypeName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <p className={`mt-1 inline-block px-2 py-1 rounded text-sm ${
                    vehicle.status === 'NORMAL' 
                      ? 'bg-green-100 text-green-800'
                      : vehicle.status === 'WARNING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  
  {vehicles.map((vehicle) => (
    <div
      key={vehicle.id}
      onClick={() => {
        setSelectedVehicle(vehicle);
        setShowModal(true);
      }}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
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
    </div>
  ))}



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
          <div
            key={vehicle.id}
            onClick={() => {
              setSelectedVehicle(vehicle);
              setShowModal(true);
            }}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
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
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedVehicle && (
        <VehicleModal 
          vehicle={selectedVehicle} 
          onClose={() => {
            setShowModal(false);
            setSelectedVehicle(null);
          }}
        />
      )}

      {vehicles.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No vehicles found
        </div>
      )}
      
      
    </div>
  );
}

export default VehicleList;
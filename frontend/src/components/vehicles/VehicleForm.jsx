import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { useState, useEffect } from 'react';

function VehicleForm() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [scheduleTypes, setScheduleTypes] = useState([]);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    licensePlate: '',
    make: '',
    model: '',
    year: '',
    type: 'TRUCK',
    scheduleTypeId: ''
  });

  useEffect(() => {
    fetchScheduleTypes();
  }, []);

  const fetchScheduleTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/schedule-types', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch schedule types');
      const data = await response.json();
      setScheduleTypes(data);
    } catch (error) {
      showNotification('error', 'Failed to load schedule types');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Disable vehicle creation for the demo
  showNotification('error', 'Vehicle creation is disabled in the demo.');
  return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/vehicles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create vehicle');
      
      showNotification('success', 'Vehicle created successfully');
      navigate('/vehicles');
    } catch (error) {
      showNotification('error', 'Failed to create vehicle');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6">Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
          <input
            type="text"
            name="vehicleNumber"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.vehicleNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">License Plate</label>
          <input
            type="text"
            name="licensePlate"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.licensePlate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Make</label>
          <input
            type="text"
            name="make"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.make}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            name="model"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.model}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="text"
            name="year"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.year}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="TRUCK">Truck</option>
            <option value="TRAILER">Trailer</option>
            <option value="BUS">Bus</option>
            <option value="VAN">Van</option>
          </select>
        </div>

{/* Schedule type  */}
<div>
    <label className="block text-sm font-medium text-gray-700">Schedule Type</label>
    <select
      name="scheduleTypeId"
      required
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      value={formData.scheduleTypeId}
      onChange={handleChange}
    >
      <option value="">Select Schedule Type</option>
      {scheduleTypes.map(schedule => (
        <option key={schedule.id} value={schedule.id}>
          {schedule.name}
        </option>
      ))}
    </select>
  </div>
          {/* Schedule type  */}
        <div className="flex justify-end space-x-3">
        
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}

export default VehicleForm;
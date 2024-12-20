import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from '../../utils/axiosConfig';

// Validation schema
const schema = yup.object().shape({
  defectOptionId: yup.string().required('Please select a part'),
  isPartiallyWorking: yup.boolean(),
  isNotWorking: yup.boolean(),
  mileage: yup
    .number()
    .typeError('Mileage must be a number')
    .required('Mileage is required')
    .positive('Mileage must be positive'),
  comments: yup
    .string()
    .max(1000, 'Comments must not exceed 1000 characters')
});

function DefectReport() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      vehicleId: vehicleId,
      defectOptionId: '',
      isPartiallyWorking: false,
      isNotWorking: false,
      comments: '',
      mileage: ''
    }
  });

  useEffect(() => {
    fetchVehicleAndParts();
  }, [vehicleId]);

  const fetchVehicleAndParts = async () => {
    try {
      const [vehicleResponse, partsResponse] = await Promise.all([
        axiosInstance.get(`/vehicles/${vehicleId}`),
        axiosInstance.get(`/parts/schedule/${vehicleId}`)
      ]);
      setVehicle(vehicleResponse.data);
      setParts(partsResponse.data);
    } catch (err) {
      setError('Failed to load vehicle and parts data');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/defect-reports', data);
      navigate(`/vehicles/${vehicleId}`);
    } catch (err) {
      setError('Failed to submit defect report');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!vehicle) return <div>Vehicle not found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Report Defect - {vehicle.vehicleNumber}
          </h3>
          <div className="mt-2 mb-5 text-sm text-gray-500">
            {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Part
              </label>
              <select
                {...register('defectOptionId')}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a part</option>
                {parts.map((part) => (
                  <optgroup key={part.id} label={part.name}>
                    {part.defectOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.description} ({option.isMajorDefect ? 'Major' : 'Minor'})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.defectOptionId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.defectOptionId.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isPartiallyWorking')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Partially Working
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isNotWorking')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Not Working
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mileage
              </label>
              <input
                type="number"
                {...register('mileage')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.mileage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mileage.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <textarea
                {...register('comments')}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.comments && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.comments.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/vehicles/${vehicleId}`)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DefectReport;
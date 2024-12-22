import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

function DefectReportForm() {
  const [mileage, setMileage] = useState('');
   const [vehicles, setVehicles] = useState([]);
   const [selectedVehicle, setSelectedVehicle] = useState(null);
   const [loading, setLoading] = useState(true);
   const [currentStep, setCurrentStep] = useState(1);
   const [defects, setDefects] = useState([{
       id: 1,
       partId: '',
       defectOptionId: '',
       isPartiallyWorking: false,
       isNotWorking: false,
       comments: ''
   }]);
   const [scheduleDetails, setScheduleDetails] = useState({
       parts: [],
       defectOptions: {}
   });

   const navigate = useNavigate();
   const { showNotification } = useNotification();

   useEffect(() => {
       fetchAvailableVehicles();
   }, []);

   const fetchAvailableVehicles = async () => {
       try {
           const response = await fetch('/api/v1/vehicles', {
               headers: {
                   'Authorization': `Bearer ${localStorage.getItem('token')}`
               }
           });
           
           if (!response.ok) throw new Error('Failed to fetch vehicles');
           
           const data = await response.json();
           console.log('Vehicles data:', data); // Add this

           // Filter only NORMAL status vehicles
           const availableVehicles = data.filter(vehicle => vehicle.status === 'NORMAL');
           setVehicles(availableVehicles);
       } catch (error) {
           showNotification('error', 'Failed to load available vehicles');
       } finally {
           setLoading(false);
       }
   };

   const handleMileageChange = (e) => {
    setMileage(e.target.value);
};

const handleVehicleSelect = (e) => {
  const vehicle = vehicles.find(v => v.id === e.target.value);
  console.log('Selected vehicle:', vehicle);
  setSelectedVehicle(vehicle);
  if (vehicle && vehicle.scheduleTypeId) {
      fetchScheduleDetails(vehicle);
  }
};

const fetchScheduleDetails = async (vehicle) => {
  try {
      console.log('Fetching schedule details for vehicle:', vehicle);
      const response = await fetch(`/api/v1/parts/schedule/${vehicle.scheduleTypeId}`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });
      
      if (!response.ok) throw new Error('Failed to fetch schedule details');
      
      const data = await response.json();
      console.log('Schedule details:', data);
      setScheduleDetails(data);
  } catch (error) {
      console.error('Error fetching schedule details:', error);
      showNotification('error', 'Failed to load schedule details');
  }
};

   const handleNext = () => {
       setCurrentStep(2);
   };

   const addDefect = () => {
       setDefects([
           ...defects,
           {
               id: defects.length + 1,
               partId: '',
               defectOptionId: '',
               isPartiallyWorking: false,
               isNotWorking: false,
               comments: ''
           }
       ]);
   };

   const removeDefect = (defectId) => {
       setDefects(defects.filter(d => d.id !== defectId));
   };

   const updateDefect = (defectId, field, value) => {
    console.log('Updating defect:', defectId, field, value); // Add this log

       setDefects(defects.map(defect => 
           defect.id === defectId 
               ? { ...defect, [field]: value }
               : defect
       ));
   };

// REMOVE    const [previewVisible, setPreviewVisible] = useState(false);
   const [showPreview, setShowPreview] = useState(false);



   const handlePreview = () => {
    const isValid = mileage && defects.every(d => d.partId && d.defectOptionId);
    
    if (!isValid) {
        showNotification('error', 'Please fill in all required fields');
        return;
    }
    setCurrentStep(3);
};


   const VehicleSelectionStep = () => (
       <div className="grid grid-cols-1 gap-y-6">
           <div>
               <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
                   Select Vehicle
               </label>
               <select
                   id="vehicle"
                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                   onChange={handleVehicleSelect}
                   value={selectedVehicle?.id || ''}
               >
                   <option value="">Select a vehicle</option>
                   {vehicles.map((vehicle) => (
                       <option key={vehicle.id} value={vehicle.id}>
                           {vehicle.vehicleNumber} - {vehicle.make} {vehicle.model}
                       </option>
                   ))}
               </select>
           </div>

           {selectedVehicle && (
               <div className="bg-gray-50 px-4 py-5 sm:rounded-lg">
                   <h4 className="text-sm font-medium text-gray-700">Vehicle Details</h4>
                   <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                       <div>
                           <dt className="text-sm font-medium text-gray-500">Number</dt>
                           <dd className="mt-1 text-sm text-gray-900">{selectedVehicle.vehicleNumber}</dd>
                       </div>
                       <div>
                           <dt className="text-sm font-medium text-gray-500">License Plate</dt>
                           <dd className="mt-1 text-sm text-gray-900">{selectedVehicle.licensePlate}</dd>
                       </div>
                       <div>
                           <dt className="text-sm font-medium text-gray-500">Make/Model</dt>
                           <dd className="mt-1 text-sm text-gray-900">{selectedVehicle.make} {selectedVehicle.model}</dd>
                       </div>
                       <div>
                           <dt className="text-sm font-medium text-gray-500">Year</dt>
                           <dd className="mt-1 text-sm text-gray-900">{selectedVehicle.year}</dd>
                       </div>
                   </dl>
               </div>
           )}

           <div className="flex justify-end">
               <button
                   type="button"
                   disabled={!selectedVehicle}
                   onClick={handleNext}
                   className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                       ${selectedVehicle 
                           ? 'bg-indigo-600 hover:bg-indigo-700' 
                           : 'bg-gray-300 cursor-not-allowed'
                       }`}
               >
                   Next
               </button>
           </div>
       </div>
   );

  //  Defect selection step 

  const DefectSelectionStep = () => (
    <div className="space-y-6">
        {/* Add mileage field at the top */}
        <div className="bg-white p-4 rounded-lg shadow">
            <label className="block text-sm font-medium text-gray-700">
                Current Mileage
            </label>
            <input
    type="number"
    required
    value={mileage}
    onChange={handleMileageChange}
    className="mt-1 block w-full rounded-md border-gray-300"
    placeholder="Enter current mileage"
/>
        </div>

        {/* Defects section */}
        {defects.map((defect, index) => (
            <div key={defect.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium">Defect #{index + 1}</h4>
                    {defects.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeDefect(defect.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Remove
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-y-4">
                    {/* Part Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Part
                        </label>
                        <select
    value={defect.partId || ''}  // Add || ''
    onChange={(e) => updateDefect(defect.id, 'partId', e.target.value)}
    className="mt-1 block w-full rounded-md border-gray-300"
    required
>
                            <option value="">Select Part</option>
                            {scheduleDetails.parts.map(part => (
                                <option key={part.id} value={part.id}>
                                    {part.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Defect Option Selection - only show if part is selected */}
                    {defect.partId && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Defect
                            </label>
                            <select
                                value={defect.defectOptionId}
                                onChange={(e) => updateDefect(defect.id, 'defectOptionId', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300"
                                required
                            >
                                <option value="">Select Defect</option>
                                {scheduleDetails.parts
                                    .find(part => part.id === defect.partId)
                                    ?.defectOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.description} ({option.isMajorDefect ? 'Major' : 'Minor'})
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {/* Working Status */}
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`partially-${defect.id}`}
                                checked={defect.isPartiallyWorking}
                                onChange={(e) => updateDefect(defect.id, 'isPartiallyWorking', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 rounded"
                            />
                            <label htmlFor={`partially-${defect.id}`} className="ml-2 text-sm text-gray-700">
                                Partially Working
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`not-working-${defect.id}`}
                                checked={defect.isNotWorking}
                                onChange={(e) => updateDefect(defect.id, 'isNotWorking', e.target.checked)}
                                className="h-4 w-4 text-indigo-600 rounded"
                            />
                            <label htmlFor={`not-working-${defect.id}`} className="ml-2 text-sm text-gray-700">
                                Not Working
                            </label>
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Comments
                        </label>
                        <textarea
                            value={defect.comments}
                            onChange={(e) => updateDefect(defect.id, 'comments', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300"
                            rows={3}
                        />
                    </div>
                </div>
            </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-between">
            <button
                type="button"
                onClick={addDefect}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
                Add Another Defect
            </button>
            
            <div className="space-x-3">
                <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handlePreview}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Preview Report
                </button>
            </div>
        </div>
    </div>
);

// Defect selection step END

const handleSubmit = async () => {
    try {
        const reportData = {
            vehicleId: selectedVehicle.id,
            mileage: parseInt(mileage),
            items: defects.map(defect => ({
                defectOptionId: defect.defectOptionId,
                isPartiallyWorking: defect.isPartiallyWorking,
                isNotWorking: defect.isNotWorking,
                comments: defect.comments
            }))
        };

        const response = await fetch('/api/v1/defect-reports', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
        });

        if (!response.ok) throw new Error('Failed to submit report');
        
        showNotification('success', 'Report submitted successfully');
        navigate('/reports');
    } catch (error) {
        showNotification('error', 'Failed to submit report');
        console.error('Submit error:', error);
    }
};

const PreviewReport = () => {
    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold">Report Preview</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="font-medium">Vehicle Information</h3>
                    <p>{selectedVehicle.vehicleNumber} - {selectedVehicle.make} {selectedVehicle.model}</p>
                    <p>License Plate: {selectedVehicle.licensePlate}</p>
                    <p>Current Mileage: {mileage}</p>
                </div>

                <div>
                    <h3 className="font-medium">Reported Defects</h3>
                    {defects.map((defect, index) => {
                        const selectedPart = scheduleDetails.parts.find(p => p.id === defect.partId);
                        const selectedDefect = selectedPart?.defectOptions.find(d => d.id === defect.defectOptionId);
                        
                        return (
                            <div key={defect.id} className="mt-4 p-4 bg-gray-50 rounded">
                                <p className="font-medium">Defect #{index + 1}</p>
                                <div className="ml-4">
                                    <p>Part: {selectedPart?.name}</p>
                                    <p>Defect: {selectedDefect?.description}</p>
                                    <p>Severity: <span className={selectedDefect?.isMajorDefect ? 'text-red-600' : 'text-yellow-600'}>
                                        {selectedDefect?.isMajorDefect ? 'Major' : 'Minor'}
                                    </span></p>
                                    {(defect.isPartiallyWorking || defect.isNotWorking) && (
                                        <p>Working Status: {defect.isNotWorking ? 'Not Working' : 'Partially Working'}</p>
                                    )}
                                    {defect.comments && <p>Comments: {defect.comments}</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700"
                >
                    Edit Report
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Submit Report
                </button>
            </div>
        </div>
    );
};




   if (loading) return <div>Loading...</div>;

   return (
       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="bg-white shadow sm:rounded-lg">
               <div className="px-4 py-5 sm:p-6">
                   <h3 className="text-lg font-medium leading-6 text-gray-900">
                       Report Vehicle Defect - Step {currentStep} of 2
                   </h3>
                   
                   <div className="mt-6">
                   {currentStep === 1 ? VehicleSelectionStep() : 
                    currentStep === 2 ? DefectSelectionStep() : 
                    PreviewReport()}
                   
                                      </div>
               </div>
           </div>
       </div>
   );
}

export default DefectReportForm;
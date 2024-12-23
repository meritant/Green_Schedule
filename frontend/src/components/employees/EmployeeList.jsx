import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function EmployeeList() {
 const [employees, setEmployees] = useState([]);

 useEffect(() => {
   const fetchEmployees = async () => {
     const response = await fetch('/api/v1/users', {
       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
     });
     const data = await response.json();
     setEmployees(data);
   };
   fetchEmployees();
 }, []);

 return (
   <div className="px-4 sm:px-6 lg:px-8">
     <div className="sm:flex sm:items-center">
       <div className="sm:flex-auto">
         <h1 className="text-xl font-semibold">Employees</h1>
       </div>
       <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
         <Link to="/employees/new" 
           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
           Add Employee
         </Link>
       </div>
     </div>
     
     <div className="mt-8 flex flex-col">
       <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
         <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
           <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
             <table className="min-w-full divide-y divide-gray-300">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                   <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                   <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Employee #</th>
                   <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-200 bg-white">
                 {employees.map((employee) => (
                   <tr key={employee.id}>
                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{employee.username}</td>
                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.email}</td>
                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.employeeNumber}</td>
                     <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.role}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}

export default EmployeeList;
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const { user } = useAuth();
  const isSupervisor = user?.role === 'SUPERVISOR';

  return (
    <div className="w-64 bg-gray-800 min-h-screen text-white">
      <nav className="mt-5 px-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          Dashboard
        </NavLink>

        {isSupervisor && (
          <>
            <NavLink
              to="/vehicles"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              Vehicles
            </NavLink>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              Employees
            </NavLink>
          </>
        )}

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          Defect Reports
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import VehicleList from './components/vehicles/VehicleList';
import VehicleForm from './components/vehicles/VehicleForm';
import EmployeeList from './components/employees/EmployeeList';
import DefectReportList from './components/reports/DefectReportList';
import DefectReportForm from './components/reports/DefectReportForm';



function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <div className="w-full">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                

                
                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="/vehicles" element={<VehicleList />} />
                  <Route path="/vehicles/new" element={<VehicleForm />} />
                  <Route path="employees" element={<EmployeeList />} />
                  <Route path="/reports" element={<DefectReportList />} />
                  <Route path="/reports/new" element={<DefectReportForm />} />

                  

                </Route>
              </Routes>
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
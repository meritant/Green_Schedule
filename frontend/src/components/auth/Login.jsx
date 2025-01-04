import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

document.title = 'Log in';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          
        {/* Demo Account Information */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-3 text-center">🌟 Demo Accounts 🌟</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <span className="bg-white text-blue-500 font-semibold rounded-full px-3 py-1 text-sm">
                  DRIVER
                </span>
                <p className="flex-1">
                  <strong>To file reports:</strong> Use username: <span className="font-mono">driver</span> and password: <span className="font-mono">123456</span>
                </p>
              </li>
              <li className="flex items-center space-x-3">
                <span className="bg-white text-indigo-500 font-semibold rounded-full px-3 py-1 text-sm">
                  SUPERVISOR
                </span>
                <p className="flex-1">
                  <strong>To manage reports, employees, and vehicles:</strong> Use username: <span className="font-mono">super</span> and password: <span className="font-mono">123456</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
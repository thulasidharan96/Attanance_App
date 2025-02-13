import { useState } from 'react';
import { LoginApi } from '../service/Api';
import { storeUserData, storeUserId, storeUserName, storeRegisterNumber, storeDepartment } from '../service/Storage'; 
import { Link, Navigate } from 'react-router-dom';
import { isAdminAuthentication, isAuthenticated } from '../service/Auth';
import Header from '../component/Header';
import Footer from '../component/Footer';

export default function HomePage() {
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        custom_error: null
    };

    const [errors, setErrors] = useState(initialStateErrors);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const handleInput = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let errorsCopy = { ...initialStateErrors };
        let hasError = false;

        if (inputs.email === "") {
            errorsCopy.email.required = true;
            hasError = true;
        }
        if (inputs.password === "") {
            errorsCopy.password.required = true;
            hasError = true;
        }

        if (hasError) {
            setErrors(errorsCopy);
            return;
        }

        try {
            setLoading(true);
            const response = await LoginApi(inputs);
            const { token } = response.data;
            storeUserData(token);
            storeUserId(response.data.userId);
            storeUserName(response.data.name);
            storeRegisterNumber(response.data.RegisterNumber);
            storeDepartment(response.data.department);
            localStorage.setItem("role", response.data.role);
        } catch (err) {
            setErrors({
                ...errorsCopy,
                custom_error: err.code === "ERR_BAD_REQUEST" 
                    ? "Invalid Credentials." 
                    : "An error occurred."
            });
        } finally {
            setLoading(false);
        }
    };

    if (isAdminAuthentication()) {
        return <Navigate to="/admin" />;
    } else if (isAuthenticated()) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-slate-400 px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleInput}
                  placeholder="Enter your email"
                  aria-label="Email"
                />
                {errors.email.required && <span className="text-red-500 text-xs mt-1">Email is required.</span>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleInput}
                  placeholder="Enter your password"
                  aria-label="Password"
                />
                {errors.password.required && <span className="text-red-500 text-xs mt-1">Password is required.</span>}
              </div>
              <div>
                {loading ? (
                  <div className="flex justify-center items-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  errors.custom_error && <p className="text-red-500 text-sm text-center mb-4">{errors.custom_error}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
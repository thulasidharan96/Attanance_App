import { useState } from "react";
import { RegisterApi } from "../service/Api";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";

export default function RegisterPage() {
  const initialErrors = {
    name: null,
    email: null,
    password: null,
    RegisterNumber: null,
    custom_error: null,
  };

  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    RegisterNumber: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
    setErrors({ ...errors, [name]: null, custom_error: null });
  };

  const validateInputs = () => {
    const newErrors = {};
    let hasError = false;

    if (!inputs.name.trim()) {
      newErrors.name = "Name is required.";
      hasError = true;
    }

    if (!inputs.email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    }

    if (!inputs.password) {
      newErrors.password = "Password is required.";
      hasError = true;
    } else if (
      inputs.password.length < 8 ||
      !/[A-Z]/.test(inputs.password) ||
      !/[0-9]/.test(inputs.password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include a number, and an uppercase letter.";
      hasError = true;
    }

    if (!inputs.RegisterNumber.trim()) {
      newErrors.RegisterNumber = "Registration number is required.";
      hasError = true;
    } else if (!inputs.RegisterNumber.startsWith("9533")) {
      newErrors.RegisterNumber = "Please provide a valid registration number.";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);

    try {
      const response = await RegisterApi(inputs);
      if (response?.status === 201) {
        window.location.href = "/";
      } else {
        setErrors({
          ...errors,
          custom_error: "Unexpected response during registration.",
        });
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.error;
      let customError = "An error occurred during registration.";

      if (errorMessage === "User already exists") {
        customError = "User already exists. Please use a different email.";
      } else if (errorMessage === "Email already registered") {
        customError = "Email already registered!";
      } else if (errorMessage === "Invalid Registration Number") {
        customError = "Register number already exists.";
      } else if (errorMessage?.includes("Password must be")) {
        customError = "Password must be at least 6 characters!";
      }

      setErrors({ ...errors, custom_error: customError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-slate-400 px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
              Register Now
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 py-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  value={inputs.name}
                  onChange={handleInput}
                  className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.name && (
                  <span className="text-sm text-red-500">{errors.name}</span>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 py-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={inputs.email}
                  onChange={handleInput}
                  className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email}</span>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 py-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={inputs.password}
                  onChange={handleInput}
                  className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="RegisterNumber"
                  className="block text-sm font-medium text-gray-700 py-1"
                >
                  Registration Number
                </label>
                <input
                  type="text"
                  name="RegisterNumber"
                  id="RegisterNumber"
                  placeholder="Enter your registration number"
                  value={inputs.RegisterNumber}
                  onChange={handleInput}
                  className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.RegisterNumber && (
                  <span className="text-sm text-red-500">
                    {errors.RegisterNumber}
                  </span>
                )}
              </div>

              {errors.custom_error && (
                <p className="text-sm text-red-500">{errors.custom_error}</p>
              )}

              {loading && (
                <div className="flex justify-center">
                  <div className="animate-spin h-6 w-6 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Register
              </button>
            </form>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-medium text-blue-500 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

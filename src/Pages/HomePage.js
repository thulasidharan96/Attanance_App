import { useState } from 'react';
import { LoginApi } from '../service/Api';
import { storeUserData, storeUserId, storeUserName, storeRegisterNumber, storeDepartment } from '../service/Storage'; 
import { Link, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../service/Auth';
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

            //console.log(response.data.name);
            //console.log(response.data.RegisterNumber)
            //console.log(getRegisterNumber());

            
            if (isAuthenticated()) {
                return <Navigate to="/dashboard" />;
            }
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

    if (isAuthenticated()) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen flex flex-col"> 
            <Header />
            <main className="flex-grow flex flex-col">
            <section className="flex-grow flex justify-center items-center bg-slate-400">
                <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-white">
                    <h2 className="text-center text-2xl font-semibold mb-6">Login Now</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 py-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-2 border border-black rounded-md focus:ring-2 focus:ring-blue-500"
                                onChange={handleInput}
                                placeholder="Enter your email"
                                aria-label="Email"
                            />
                            {errors.email.required && <span className="text-red-500 text-xs">Email is required.</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 py-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full p-2 border border-black rounded-md focus:ring-2 focus:ring-blue-500"
                                onChange={handleInput}
                                placeholder="Enter your password"
                                aria-label="Password"
                            />
                            {errors.password.required && <span className="text-red-500 text-xs">Password is required.</span>}
                        </div>
                        <div className="mb-4">
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border text-blue-500" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                errors.custom_error && <p className="text-red-500 text-xs">{errors.custom_error}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 mt-5 rounded-md hover:bg-blue-600"
                                disabled={loading}
                            >
                                Login
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="text-sm">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
                        </div>
                    </form>
                </div>
            </section>
            </main>
            <Footer />
        </div>
    );
}

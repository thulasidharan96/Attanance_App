import { useState } from 'react';
import { LoginApi } from '../service/Api';
import { storeUserData } from '../service/Storage';
import { Link} from 'react-router-dom';

export default function LoginPage() {
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

    const handleSubmit = (event) => {
        event.preventDefault();
        let errorsCopy = { ...initialStateErrors }; // Create a copy to avoid direct mutation
        let hasError = false;

        if (inputs.email === "") {
            errorsCopy.email.required = true;
            hasError = true;
        }
        if (inputs.password === "") {
            errorsCopy.password.required = true;
            hasError = true;
        }

        if (!hasError) {
            setLoading(true);
            LoginApi(inputs)
                .then((response) => {
                    storeUserData(response.data.idToken);
                    // Redirect to home page after successful login
                    window.location.href = "/home"; // Replace with your redirect URL
                })
                .catch((err) => {
                    if (err.code === "ERR_BAD_REQUEST") {
                        setErrors({ ...errorsCopy, custom_error: "Invalid Credentials." });
                    } else {
                        setErrors({ ...errorsCopy, custom_error: "An error occurred." });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setErrors(errorsCopy); // Update errors only after form validation
        }
    };

    return (
        <div>
            <section className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-center text-2xl font-semibold mb-6">Login Now</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleInput}
                                placeholder="Enter your email"
                            />
                            {errors.email.required && <span className="text-red-500 text-xs">Email is required.</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleInput}
                                placeholder="Enter your password"
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
                                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
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
        </div>
    );
}

import { useState } from 'react';
import { RegisterApi } from '../service/Api';
import { storeUserData } from '../service/Storage';
import { Link } from 'react-router-dom';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Firestore imports
import { initializeApp } from 'firebase/app'; // Firebase initialization
import { firebaseConfig } from '../service/Api';
import Header from '../component/Header';
import Footer from '../component/Footer';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function RegisterPage() {
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        name: { required: false },
        regno: { required: false, error: null },
        custom_error: null
    };

    const [errors, setErrors] = useState(initialStateErrors);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
        regno: ""
    });

    const handleInput = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let errorsCopy = { ...initialStateErrors };
        let hasError = false;

        // Validation logic
        if (inputs.name === "") {
            errorsCopy.name.required = true;
            hasError = true;
        }
        if (inputs.email === "") {
            errorsCopy.email.required = true;
            hasError = true;
        }
        if (inputs.password === "") {
            errorsCopy.password.required = true;
            hasError = true;
        }
        if (inputs.regno === "") {
            errorsCopy.regno = { required: true, error: "Registration number is required." };
            hasError = true;
        } else if (!inputs.regno.startsWith("9533")) {
            errorsCopy.regno = { required: false, error: "Please provide a valid registration number." };
            hasError = true;
        }

        if (!hasError) {
            setLoading(true);
            try {
                const response = await RegisterApi(inputs);
                storeUserData(response.data.idToken);

                // Store data in Firestore
                const userRef = doc(db, "users", response.data.localId); // Use localId as the document ID
                await setDoc(userRef, {
                    name: inputs.name,
                    email: inputs.email,
                    regno: inputs.regno,
                    createdAt: new Date().toISOString()
                });

                // Reset inputs after successful registration
                setInputs({
                    email: "",
                    password: "",
                    name: "",
                    regno: ""
                });

                // Redirect to dashboard after successful registration
                window.location.href = "/";
            } catch (err) {
                if (err.response.data.error.message === "EMAIL_EXISTS") {
                    setErrors({ ...errorsCopy, custom_error: "Email already registered!" });
                } else if (String(err.response.data.error.message).includes('WEAK_PASSWORD')) {
                    setErrors({ ...errorsCopy, custom_error: "Password must be at least 6 characters!" });
                }
            } finally {
                setLoading(false);
            }
        } else {
            setErrors(errorsCopy);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <div className="flex flex-col items-center justify-center p-4 space-y-6 sm:space-y-8 lg:space-y-10">
                <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Register Now</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={inputs.name}
                                onChange={handleInput}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.name.required && <span className="text-sm text-red-500">Name is required.</span>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={inputs.email}
                                onChange={handleInput}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.email.required && <span className="text-sm text-red-500">Email is required.</span>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={inputs.password}
                                onChange={handleInput}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.password.required && <span className="text-sm text-red-500">Password is required.</span>}
                        </div>
                        <div>
                            <label htmlFor="regno" className="block text-sm font-medium text-gray-700">
                                Registration Number
                            </label>
                            <input
                                type="text"
                                name="regno"
                                id="regno"
                                value={inputs.regno}
                                onChange={handleInput}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.regno.required && (
                                <span className="text-sm text-red-500">Registration number is required.</span>
                            )}
                            {errors.regno.error && <span className="text-sm text-red-500">{errors.regno.error}</span>}
                        </div>
                        {errors.custom_error && <p className="text-sm text-red-500">{errors.custom_error}</p>}
                        {loading && (
                            <div className="flex justify-center">
                                <div className="animate-spin h-6 w-6 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Register
                        </button>
                    </form>
                    <p className="text-sm text-center text-gray-600">
                        Already have an account? <Link to="/" className="text-indigo-600 hover:underline">Login</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

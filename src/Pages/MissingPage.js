import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';

const MissingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="flex justify-center items-center flex-grow bg-gray-100">
        <div className="text-center p-8 bg-white shadow-xl rounded-lg max-w-sm w-full">
          <h1 className="text-6xl font-bold text-red-600">404</h1>
          <p className="mt-4 text-2xl text-gray-800">Oops! Page not found</p>
          <p className="mt-2 text-gray-500">
            The page you're looking for might have been moved or deleted.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Go Back Home
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MissingPage;

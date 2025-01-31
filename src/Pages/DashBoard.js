import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom'; 
import { isAuthenticated, logout } from '../service/Auth';
import Attendance from '../service/Attendance';
import Header from '../component/Header';
import Footer from '../component/Footer';

// Predefined company location (latitude, longitude)
const companyLat = 8.79288;
const companyLon = 78.12069;

// Function to calculate distance between two geographic points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Distance in meters
  return distance;
};

const WelcomeMessage = () => (
  <div className="mb-6 p-6 bg-blue-100 rounded-lg shadow-xl">
    <p className="text-2xl font-semibold text-blue-600">Welcome !</p>
    <p className="text-sm text-gray-600">We're glad to have you on board.</p>
  </div>
);

const UserTable = ({ users }) => (
  <div className="overflow-x-auto shadow-xl rounded-lg bg-white">
    <table className="min-w-full table-auto border-collapse mt-6">
      <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <tr>
          <th className="border px-6 py-3 text-left">RegNo</th>
          <th className="border px-6 py-3 text-left">Name</th>
          <th className="border px-6 py-3 text-left">Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="hover:bg-gray-100 transition duration-200">
            <td className="border px-6 py-3">{user.regno}</td>
            <td className="border px-6 py-3">{user.name}</td>
            <td className="border px-6 py-3">{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DashBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWithinLocation, setIsWithinLocation] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Mock data fetch - replace with your actual data fetching logic
    const fetchUsers = async () => {
      try {
        // Simulated user data
        const mockUsers = [
          { id: 1, regno: "001", name: "John Doe", email: "john@example.com" },
          { id: 2, regno: "002", name: "Jane Smith", email: "jane@example.com" }
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const todayDate = new Date().toLocaleDateString();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          const distance = getDistance(userLat, userLon, companyLat, companyLon);
          setIsWithinLocation(distance < 1000);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated()) return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center space-x-2 text-blue-600">
          <span>Loading...</span>
          <div className="animate-spin w-5 h-5 border-4 border-t-4 border-blue-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">Dashboard</h2>
          <div className="text-right">
            <p className="text-sm text-gray-500">{todayDate}</p>
          </div>
        </div>

        <WelcomeMessage />

        <UserTable users={users} />

        <div className="mt-6 text-center">
          {isWithinLocation ? (
            <Attendance user={users[0]} />
          ) : (
            <p className="text-red-600">You must be within the designated location to mark attendance.</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashBoard;

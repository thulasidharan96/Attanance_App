import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { isAuthenticated, logout } from "../service/Auth";
import Attendance from "../service/Attendance";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { UserApi } from "../service/Api";

// Predefined company location (latitude, longitude)
const companyLat = 8.79288;
const companyLon = 78.12069;

// Function to calculate distance between two geographic points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Distance in meters
  return distance;
};

const UserTable = ({ users }) => (
  <div className="overflow-x-auto shadow-xl rounded-lg bg-white max-h-96">
    <table className="min-w-full table-auto border-collapse mt-6">
      <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <tr>
          <th className="border px-6 py-3 text-left">Date</th>
          <th className="border px-6 py-3 text-left">Attendance Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="hover:bg-gray-100 transition duration-200"
          >
            <td className="border px-4 py-3 font-bold">{user.dateOnly}</td>
            <td className="border px-4 py-3 ">
              <span
                className={
                  user.attendanceStatus === "present"
                    ? "text-green-600 font-bold"  // Green for Present
                    : user.attendanceStatus === "late"
                    ? "text-yellow-500 font-bold"  // Yellow for Late
                    : user.attendanceStatus === "Absent"
                    ? "text-red-600 font-bold"  // Red for Absent
                    : "text-gray-600"  // Default to gray if no status
                }
              >
                {user.attendanceStatus}
              </span>
            </td>
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
    // Fetch user data from the API
    const fetchUsers = async () => {
      try {
        const response = await UserApi(); // Fetch real user data
        console.log(response.data); // Log the data for debugging
        setUsers(response.data); // Update state with API response
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Update loading state
      }
    };

    fetchUsers(); // Call the fetch function
  }, []);

  // Geolocation check to ensure user is within the company radius
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          const distance = getDistance(userLat, userLon, companyLat, companyLon);
          setIsWithinLocation(distance < 1000); // Distance threshold: 1000 meters
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  const handleUserClick = () => {
    console.log("User clicked to sync data");
    UserApi().then((response) => {
      console.log(response.data);
      setUsers(response.data); // Sync data from the API
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // Navigate to the login screen
  };

  if (!isAuthenticated()) return <Navigate to="/" />; // Redirect if not authenticated

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

      <main className="flex-grow bg-slate-400 py-8">
        <div className="container mx-auto max-w-4xl px-4 mb-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl font-bold text-indigo-700">Dashboard</h2>

            {/* Logout Section */}
            <div className="flex justify-between item-center text-center">
              <button
                onClick={handleLogout}
                className="px-2 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* User Table Section */}
          <div className="mb-6">
            <UserTable users={users} />
            <div className="text-center">
              <button
                onClick={handleUserClick}
                className="px-3 py-3 mt-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors duration-200"
              >
                Sync Data
              </button>
            </div>
          </div>

          {/* Attendance Section */}
          <div className="text-center">
            {isWithinLocation ? (
              <Attendance user={users[0]} />
            ) : (
              <p className="text-red-600">
                You must be within the designated location to mark attendance.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashBoard;
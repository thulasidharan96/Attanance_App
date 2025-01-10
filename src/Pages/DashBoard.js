import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../service/Api';
import { useNavigate, Navigate } from 'react-router-dom'; 
import { isAuthenticated, logout } from '../service/Auth';
import Attendance from '../service/Attendance';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const todayDate = new Date().toLocaleDateString();

  const handleLogout = async () => {
    try {
      logout();
      console.log('User signed out');
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-700">Dashboard</h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">{todayDate}</p>
        </div>
      </div>

      <WelcomeMessage />

      <UserTable users={users} />

      <div className="mt-6 text-center">
        <Attendance user={users[0]} /> {/* Passing the first user to Attendance */}
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
  );
};

export default DashBoard;

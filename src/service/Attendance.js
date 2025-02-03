import React, { useState } from 'react';
import { AttendanceApi } from './Api';
import { getUserData, getUserId } from './Storage';

const Attendance = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleClick = async () => {
    const token = getUserData();
    const userId = getUserId();

    console.log(token);
    console.log(userId);

    try {
      const response = await AttendanceApi({
        userId: userId,
        headers: {
          'Authorization': `Bearer ${token}`, // Passing the token in the Authorization header
        }
      });

      // Handle successful attendance marking
      console.log(response);
      alert('Attendance marked successfully!');
      setIsButtonDisabled(true);
    } catch (error) {
      console.error('Attendance marking failed:', error);
      
      // Show error message from response if available
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
      alert(errorMessage);
      
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isButtonDisabled}
      >
        {isButtonDisabled ? 'Attendance Marked' : 'Mark Attendance'}
      </button>
    </div>
  );
};

export default Attendance;

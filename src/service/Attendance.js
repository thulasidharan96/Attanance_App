import React, { useState } from 'react';

const Attendance = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleClick = () => {
    alert('Process completed!');
    setIsButtonDisabled(true);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow "
        disabled={isButtonDisabled}
      >
        Mark Attendance
      </button>
    </div>
  );
};

export default Attendance;

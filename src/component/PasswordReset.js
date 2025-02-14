import React, { useState } from "react";

const generateRandomPassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

const PasswordReset = ({ onClose, clientId }) => {
  const [password, setPassword] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    const newPassword = generateRandomPassword();
    setPassword(newPassword);
    setGenerated(true);
  };

  const handleConfirm = () => {
    sendPassword(password, clientId);
    onClose();
  };

  const sendPassword = (password, clientId) => {
    console.log(`Password for user ${clientId}: ${password}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Reset Password
        </h2>
        <div className="flex flex-col items-center">
          {generated ? (
            <div className="bg-gray-100 p-3 rounded-lg w-full text-center text-lg font-mono mb-4 select-all">
              {password}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center mb-4">
              Click below to generate a new password
            </p>
          )}
          <button
            onClick={handleGenerate}
            className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Generate Password
          </button>
          {generated && (
            <button
              onClick={handleConfirm}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Confirm Reset
            </button>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;

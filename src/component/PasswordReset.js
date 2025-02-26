import React, { useState } from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { changePassword } from "../service/Api";
import MathVerify from "../component/MathVerify";

const generateRandomPassword = () => {
  const length = 16;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);

  return Array.from(
    randomValues,
    (value) => charset[value % charset.length]
  ).join("");
};

const isValidPassword = (password) => {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*()_+]/.test(password)
  );
};

const PasswordReset = ({ onClose, initialPassword = "", clientId }) => {
  const [password, setPassword] = useState(initialPassword);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mathVerified, setMathVerified] = useState(false);
  const [mathAnswer, setMathAnswer] = useState(null);

  const handleGenerate = () => {
    setPassword(generateRandomPassword());
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    if (!isValidPassword(password) || mathAnswer === null) {
      console.error("Invalid password format or missing math verification.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(password, clientId, mathAnswer);
      alert("Password reset successful!");
      onClose();
    } catch (error) {
      console.error("Failed to reset password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      {!mathVerified ? (
        <MathVerify
          onSuccess={(answer) => {
            setMathVerified(true);
            setMathAnswer(answer);
          }}
          onClose={onClose}
        />
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Reset Password
          </h2>

          <div className="w-full">
            <div className="relative w-full">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 pr-20 rounded-lg w-full text-center text-lg font-mono"
                placeholder="Enter or generate password"
              />
              {password && (
                <button
                  onClick={handleCopy}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-sm bg-gray-200 px-2 py-1 rounded"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}

              <button
                onClick={handleGenerate}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ShieldCheckIcon className="w-5 h-5" />
              </button>
            </div>

            {!isValidPassword(password) && password.length > 0 && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Password must have at least 6 characters, 1 uppercase letter, 1
                number, and 1 special character.
              </p>
            )}

            {password && (
              <button
                onClick={handleConfirm}
                disabled={loading || !isValidPassword(password)}
                className={`mt-4 w-full px-4 py-2 text-white rounded-lg transition-colors ${
                  loading || !isValidPassword(password)
                    ? "bg-gray-400"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {loading ? "Processing..." : "Confirm Reset"}
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
      )}
    </div>
  );
};

export default PasswordReset;

import React, { useState, useEffect } from "react";
import { getVerifyQuestion } from "../service/Api";

const MathVerify = ({ onSuccess, onClose }) => {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const questionData = await getVerifyQuestion();
        setQuestion(questionData);
      } catch (error) {
        console.error("Failed to fetch math question:", error);
        setError("Failed to load verification question.");
      }
    }

    fetchQuestion();
  }, []);

  const handleSubmit = () => {
    if (parseInt(answer) === question.correctAnswer) {
      onSuccess(answer); // Pass answer back to PasswordReset
    } else {
      setError("Incorrect answer. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Math Verification
        </h2>

        {question ? (
          <>
            <p className="text-lg font-medium text-center">
              {question.question}
            </p>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="border p-2 w-full rounded-lg text-center mt-2"
              placeholder="Enter answer"
            />

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Verify
            </button>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading question...</p>
        )}

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

export default MathVerify;

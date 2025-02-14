import React, { useState } from "react";

const YourComponent = () => {
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  // Example value, replace with your actual logic

  return (
    <div>
      {/* Leave Request Section */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          {/* <MapPinIcon className="w-6 h-6 text-cyan-600" /> */}
          Leave Request
        </h2>

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowLeaveForm(true)}
        >
          Leave Request
        </button>
        {showLeaveForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 w-80">
              <h2 className="text-xl font-semibold mb-4">Leave Application</h2>
              <form>
                <label htmlFor="startDate">Start Date:</label>
                <br />
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full mb-4 p-2 border rounded-lg"
                />
                <br />
                <label htmlFor="endDate">End Date:</label>
                <br />
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full mb-4 p-2 border rounded-lg"
                />
                <br />
                <label htmlFor="reason">Reason:</label>
                <br />
                <textarea
                  id="reason"
                  name="reason"
                  rows="4"
                  className="w-full mb-4 p-2 border rounded-lg"
                ></textarea>
                <br />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLeaveForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourComponent;

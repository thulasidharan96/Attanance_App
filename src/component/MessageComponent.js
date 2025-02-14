import React, { useEffect } from "react";
import { postUserMessage } from "../service/Api";

const MessageComponent = ({ onClose, clientId }) => {
  useEffect(() => {
    console.log("clientId:", clientId);
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    console.log(message);
    console.log(clientId);
    try {
      const response = await postUserMessage(message, clientId);
      console.log(response);
      if (response.message === "Message sent successfully") {
        alert("Message sent successfully!");
      } else {
        alert("Failed to send message. Please try again.");
      }
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 md:p-8">
      <div className="bg-white shadow-lg rounded-xl w-full md:max-w-md lg:max-w-lg xl:max-w-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 md:h-32"
              placeholder="Enter your message"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageComponent;

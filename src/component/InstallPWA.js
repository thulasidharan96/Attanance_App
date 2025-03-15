import { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid"; // Import Heroicons for a modern look

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Prevent automatic Chrome prompt
      setDeferredPrompt(event);
      setShowInstallButton(true); // Show the install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted PWA installation");
      } else {
        console.log("User dismissed PWA installation");
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    });
  };

  return (
    <>
      {showInstallButton && (
        <div className="fixed bottom-5 right-5 flex items-center space-x-2 p-3 bg-blue-600 text-white shadow-lg rounded-xl animate-bounce">
          <button
            onClick={handleInstallClick}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 transition-all duration-300 ease-in-out text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Install App</span>
          </button>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;

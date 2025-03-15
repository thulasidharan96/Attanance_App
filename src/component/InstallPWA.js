import { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    // Ensures button is updated when deferredPrompt changes
    setShowInstallButton(deferredPrompt !== null);
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted PWA installation");
    } else {
      console.log("User dismissed PWA installation");
    }

    setDeferredPrompt(null);
  };

  return (
    <>
      {showInstallButton && (
        <div className="fixed bottom-8 right-8 z-50">
          {/* Pulsing animation */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></div>

          {/* Install Button */}
          <button
            onClick={handleInstallClick}
            className="relative flex flex-col items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white"
            aria-label="Install App"
          >
            <div className="flex flex-col items-center">
              <ArrowDownTrayIcon className="h-8 w-8 mb-1" />
              <span className="text-xs font-medium">Install</span>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;

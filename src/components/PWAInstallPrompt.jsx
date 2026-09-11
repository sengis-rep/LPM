// lpm/src/components/PWAInstallPrompt.jsx
import { useState } from 'react';
import lotusTLogo from '../assets/lotus-t-gold.png';

export default function PWAInstallPrompt({ deferredPrompt, onInstalled }) {
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Check user device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const handleAndroidInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onInstalled();
      }
    } else {
      alert("To install on Android: Tap the three dots (⋮) in Chrome and select 'Install app' or 'Add to Home screen'.");
    }
  };

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col justify-center items-center p-4 text-black">
      <div className="max-w-md w-full bg-white p-7 rounded-2xl shadow-2xl border-t-8 border-green-500 text-center">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center tracking-tight mb-2">
          <span className="text-3xl font-black text-orange-500">LO</span>
          <img src={lotusTLogo} alt="Lotus T" className="h-12 w-auto -mt-2.5 mx-[-2px] object-contain" />
          <span className="text-3xl font-black text-orange-500 mr-2">US</span>
          <span className="text-xl font-black tracking-wide text-green-600">PREMIUM MART</span>
        </div>
        <p className="text-xs font-extrabold text-gray-500 mb-6">@rivertree residency Sengkang</p>

        <div className="bg-yellow-100 border-2 border-yellow-400 p-3 rounded-lg mb-6">
          <p className="text-sm font-black text-black">Install Our App to Continue</p>
          <p className="text-xs font-semibold text-gray-700 mt-1">
            For rapid ordering, delivery alerts, and resident privileges, please add our store app to your phone home screen.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Android Button */}
          <button
            onClick={handleAndroidInstall}
            className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-black rounded-lg shadow font-black text-sm bg-green-500 hover:bg-yellow-300 active:scale-95 transition-all text-black"
          >
            🤖 Install on Android / Google Chrome
          </button>

          {/* iPhone / iOS Button */}
          <button
            onClick={() => setShowIOSGuide(!showIOSGuide)}
            className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-black rounded-lg shadow font-black text-sm bg-white hover:bg-yellow-300 active:scale-95 transition-all text-black"
          >
            🍏 Install on iPhone / iPad (Safari)
          </button>
        </div>

        {/* iOS Step-by-Step Instructions */}
        {showIOSGuide && (
          <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg text-left text-xs font-bold space-y-2 text-gray-800">
            <p className="font-extrabold text-black">How to install on Apple iOS:</p>
            <p>1. Open this page in <strong>Safari</strong>.</p>
            <p>2. Tap the <strong>Share</strong> button at the bottom (the square icon with an upward arrow ⎋).</p>
            <p>3. Scroll down and tap <strong>"Add to Home Screen"</strong> (➕ icon).</p>
            <p>4. Tap <strong>Add</strong> at the top right. Then open Lotus Mart from your phone home screen!</p>
          </div>
        )}

        {/* Optional browser bypass for testing */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onInstalled}
            className="text-[11px] font-bold text-gray-400 underline hover:text-black"
          >
            Preview in browser anyway (Testing mode)
          </button>
        </div>
      {/* FOOTER SECTION: POWERED BY TEXT AT THE VERY BOTTOM */}
      <div className="text-center py-3">
        <p className="text-xs font-bold text-gray-400 tracking-wider">
          Powered by LOTUS Global Foods and Trading PTE. LTD.
        </p>
      </div>
      </div>
    </div>
  );
}
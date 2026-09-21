// lpm/src/components/ComingSoon.jsx
import HeaderBar from './HeaderBar';

export default function ComingSoon({ user, isGuest, onLogout }) {
  const shopWhatsApp = "6581234567"; // Insert your Singapore phone number without '+'
  const shopEmail = "hello@lotusglobalfoods.com"; //[cite: 4]

  const customerName = user?.full_name || (isGuest ? "Guest Neighbor" : "Rivertree Resident"); //[cite: 4]
  
  const whatsappUrl = `https://wa.me/${shopWhatsApp}?text=${encodeURIComponent(
    `Hi Lotus Premium Mart! My name is ${customerName}. Here is what I would love to see on your shelves:`
  )}`; //[cite: 4]

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center">
      {/* Top Header Bar */}
      <HeaderBar />

      {/* Main Feedback Card */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-8 border-green-500 text-center text-black">
          <h1 className="text-2xl sm:text-3xl font-black mb-1">
            Online Store Coming Soon!
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-gray-600 mb-6 pb-4 border-b-2 border-gray-100">
            Stocking up on regional pantry essentials and fresh arrivals for Rivertrees Residences.
          </p>

          <h2 className="text-lg font-black mb-1">What should we bring in?</h2>
          <p className="text-xs font-semibold text-gray-600 mb-5">
            Tell us your requested brands, spices, snacks, or groceries:
          </p>

          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-black rounded-md shadow text-sm font-black text-black bg-[#25D366] hover:bg-yellow-400 active:scale-95 transition-all"
            >
              💬 Chat via WhatsApp
            </a>

            <a
              href={`mailto:${shopEmail}?subject=LPM Product Requests - ${customerName}`}
              className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-black rounded-md shadow text-sm font-black text-black bg-white hover:bg-yellow-300 active:scale-95 transition-all"
            >
              ✉️ Send an Email
            </a>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="mt-6 text-xs font-extrabold text-gray-500 underline hover:text-black transition-colors"
            >
              {isGuest ? 'Back to Login' : 'Sign Out'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
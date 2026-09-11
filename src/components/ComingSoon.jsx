// lpm/src/components/ComingSoon.jsx
export default function ComingSoon({ user, onLogout }) {
  const shopWhatsApp = "6581234567"; // Set your SG phone number without '+'
  const shopEmail = "hello@lotusglobalfoods.com";

  const customerName = user?.user_metadata?.full_name || user?.full_name || "a neighborhood resident";
  
  const whatsappUrl = `https://wa.me/${shopWhatsApp}?text=${encodeURIComponent(
    `Hi Lotus Premium Mart! My name is ${customerName}. Here is what I would love to see on your shelves:`
  )}`;

  return (
    <div className="min-h-screen bg-orange-500 p-4 sm:p-6 flex flex-col justify-center items-center text-black">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-2xl border-t-8 border-green-500 text-center">
        
        <h1 className="text-3xl font-extrabold text-black mb-2">Shop Online Coming Soon!</h1>
        <p className="font-bold text-gray-700 mb-6 pb-6 border-b-2 border-gray-100">
          We are stocking up on regional pantry essentials and fresh arrivals.
        </p>

        <h2 className="text-xl font-extrabold text-black mb-2">What should we bring in?</h2>
        <p className="text-sm font-semibold text-gray-600 mb-6">
          Tell us your requested brands, snacks, or groceries below:
        </p>

        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-black rounded-md shadow text-base font-extrabold text-black bg-green-500 hover:bg-yellow-400 active:scale-95 transition-all"
          >
            💬 Chat via WhatsApp
          </a>

          <a
            href={`mailto:${shopEmail}?subject=LPM Product Feedback - ${customerName}`}
            className="w-full flex items-center justify-center py-3.5 px-4 border-2 border-black rounded-md shadow text-base font-extrabold text-black bg-white hover:bg-yellow-300 active:scale-95 transition-all"
          >
            ✉️ Send Us an Email
          </a>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="mt-6 text-xs font-bold text-gray-500 underline hover:text-black"
          >
            Sign Out / Back to Login
          </button>
        )}

      </div>
    </div>
  );
}
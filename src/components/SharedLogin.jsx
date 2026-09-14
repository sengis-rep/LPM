// lpm/src/components/SharedLogin.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import lotusTLogo from '../assets/lotus-t-gold.png';

export default function SharedLogin({ tagline = "Powered by LOTUS Global Foods and Trading PTE. LTD.", onSuccessfulLogin }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [authMethod, setAuthMethod] = useState('');
  const [isEmailAuth, setIsEmailAuth] = useState(true);
  const [otp, setOtp] = useState('');
  const [whatsappCode, setWhatsappCode] = useState('');

  const [authUser, setAuthUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [blockNo, setBlockNo] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [condoName, setCondoName] = useState('');

  const shopWhatsAppNumber = "6581234567"; // Shop Business WhatsApp without '+'

  const handleProceedAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const inputVal = authMethod.trim();
    const isEmail = inputVal.includes('@');
    setIsEmailAuth(isEmail);

    if (isEmail) {
      const { error } = await supabase.auth.signInWithOtp({ email: inputVal });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('OTP sent to your email address!');
        setStep(2);
      }
    } else {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setWhatsappCode(randomCode);
      setStep(2);
    }
    setLoading(false);
  };

  const handleVerifyEmailOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.verifyOtp({
      email: authMethod.trim(),
      token: otp.trim(),
      type: 'email',
    });

    if (error) {
      setMessage(`Invalid PIN: ${error.message}`);
      setLoading(false);
      return;
    }

    if (data.session) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single();

      if (existingProfile?.full_name) {
        onSuccessfulLogin(data.user);
      } else {
        setAuthUser(data.user);
        setStep(3);
      }
    }
    setLoading(false);
  };

  const handleWhatsAppConfirmed = () => {
    const mobileUser = {
      id: `wa_${authMethod.replace(/[^0-9]/g, '')}`,
      phone: authMethod.trim(),
      isWhatsAppVerified: true
    };
    setAuthUser(mobileUser);
    setStep(3);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.id,
        full_name: fullName.trim(),
        block_no: blockNo.trim(),
        unit_no: unitNo.trim(),
        condo_name: condoName.trim(),
      });

    if (error) {
      onSuccessfulLogin({ ...authUser, full_name: fullName });
    } else {
      onSuccessfulLogin(authUser);
    }
    setLoading(false);
  };

  const waLink = `https://wa.me/${shopWhatsAppNumber}?text=${encodeURIComponent(
    `Hi Lotus Premium Mart! My phone verification code is: ${whatsappCode}`
  )}`;

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 text-black">
      


      {/* MAIN CARD CONTAINER */}
      <div className="my-auto sm:mx-auto sm:w-full sm:max-w-md">
              {/* HEADER SECTION: LOTUS PREMIUM MART (SINGLE LINE) + LOCATION (WHITE TEXT) */}

        <div className="bg-white py-7 px-4 shadow-2xl sm:rounded-lg sm:px-10 border-t-8 border-green-500">
                <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center select-none pt-4">
        
        {/* Single Line Branding: LO [Logo-T] US (White) + PREMIUM MART (Neon Green) */}
        
        {/* Brand Header */}
        <div className="flex items-center justify-center tracking-tight mb-2">
          <span className="text-3xl font-black text-orange-500">LO</span>
          <img src={lotusTLogo} alt="Lotus T" className="h-12 w-auto -mt-2.5 mx-[-2px] object-contain" />
          <span className="text-3xl font-black text-orange-500 mr-2">US</span>
          <span className="text-xl font-black tracking-wide text-green-600">PREMIUM MART</span>
        </div>
        <p className="text-xs font-extrabold text-gray-500 mb-6">@rivertree residency Sengkang</p>

      </div>
          {message && (
            <div className="mb-4 text-xs sm:text-sm text-center font-bold text-black bg-yellow-300 p-2.5 rounded shadow-sm">
              {message}
            </div>
          )}

          {/* STEP 1: INITIAL PHONE OR EMAIL PROMPT */}
          {step === 1 && (
            <form className="space-y-4" onSubmit={handleProceedAuth}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Email Address or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={authMethod}
                  onChange={(e) => setAuthMethod(e.target.value)}
                  className="block w-full border-2 border-gray-200 rounded-md p-2.5 text-black focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-yellow-300 transition-all bg-gray-50 hover:bg-white text-sm"
                  placeholder="+65 8900 2325 or user@domain.com"
                />
                <p className="text-[11px] font-semibold text-gray-500 mt-1.5">
                  * Email receives OTP pin; mobile numbers verify via shop WhatsApp.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border-2 border-black rounded-md shadow-sm text-base font-extrabold text-black bg-orange-500 hover:bg-yellow-400 active:scale-95 transition-all"
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>

              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => onSuccessfulLogin('guest')}
                  className="w-full flex justify-center py-2.5 px-4 border-2 border-black rounded-md shadow-sm text-sm font-extrabold text-black bg-white hover:bg-yellow-300 transition-all active:scale-95"
                >
                  Continue as Guest
                </button>
              </div>
            </form>
          )}

          {/* STEP 2A: EMAIL OTP VERIFICATION */}
          {step === 2 && isEmailAuth && (
            <form className="space-y-4" onSubmit={handleVerifyEmailOTP}>
              <div>
                <label className="block text-xs font-bold uppercase text-black mb-1">
                  Enter 6-Digit Email OTP
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full border-2 border-gray-200 rounded-md p-2 text-center tracking-widest text-2xl font-bold text-black focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-yellow-300 transition-all bg-gray-50"
                  placeholder="• • • • • •"
                />

                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-gray-600 hover:text-black"
                  >
                    ← Edit Email
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedAuth}
                    className="text-xs font-bold text-black hover:text-green-600 transition-colors"
                  >
                    Resend Code
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border-2 border-black rounded-md shadow-sm text-base font-extrabold text-black bg-orange-500 hover:bg-yellow-400 active:scale-95 transition-all"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {/* STEP 2B: PHONE NUMBER VERIFICATION VIA WHATSAPP */}
          {step === 2 && !isEmailAuth && (
            <div className="space-y-4 text-center">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase">Your Verification Code</p>
                <div className="my-2 p-3 bg-gray-100 border-2 border-dashed border-black rounded font-mono text-3xl font-black tracking-widest text-black">
                  {whatsappCode}
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  Tap below to send this code to our official shop WhatsApp account to complete verification.
                </p>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppConfirmed}
                className="w-full flex items-center justify-center py-3 px-4 border-2 border-black rounded-md shadow-sm text-sm font-extrabold text-black bg-[#25D366] hover:bg-yellow-300 active:scale-95 transition-all"
              >
                💬 Open WhatsApp to Send Code
              </a>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-gray-600 underline hover:text-black"
              >
                Use another number or email
              </button>
            </div>
          )}

          {/* STEP 3: POST-VERIFICATION PROFILE & ADDRESS SETUP */}
          {step === 3 && (
            <form className="space-y-3" onSubmit={handleSaveProfile}>
              <div className="text-center pb-2 border-b border-gray-200">
                <h3 className="font-extrabold text-sm text-black uppercase">Delivery Address</h3>
                <p className="text-xs text-gray-600">Where should we deliver your groceries?</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full border-2 border-gray-200 rounded-md p-2 text-sm text-black focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-yellow-300 transition-all bg-gray-50"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Block No.</label>
                  <input
                    type="text"
                    required
                    value={blockNo}
                    onChange={(e) => setBlockNo(e.target.value)}
                    className="block w-full border-2 border-gray-200 rounded-md p-2 text-sm text-black focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-yellow-300 transition-all bg-gray-50"
                    placeholder="269A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black mb-1">Unit No.</label>
                  <input
                    type="text"
                    required
                    value={unitNo}
                    onChange={(e) => setUnitNo(e.target.value)}
                    className="block w-full border-2 border-gray-200 rounded-md p-2 text-sm text-black focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-yellow-300 transition-all bg-gray-50"
                    placeholder="#01-187"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Condo / Street Name</label>
                <input
                  type="text"
                  required
                  value={condoName}
                  onChange={(e) => setCondoName(e.target.value)}
                  className="block w-full border-2 border-gray-200 rounded-md p-2 text-sm text-black focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-yellow-300 transition-all bg-gray-50"
                  placeholder="Rivertree Residences"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex justify-center py-3 px-4 border-2 border-black rounded-md shadow-sm text-base font-extrabold text-black bg-orange-500 hover:bg-yellow-400 active:scale-95 transition-all"
              >
                {loading ? 'Saving...' : 'Start Shopping'}
              </button>
            </form>
          )}
              {/* FOOTER SECTION: POWERED BY TEXT AT THE VERY BOTTOM */}
            <div className="text-center py-3">
              <p className="text-xs font-bold text-gray-400 tracking-wider">
                {tagline}
              </p>
        </div>

      </div>
      </div>



    </div>
  );
}
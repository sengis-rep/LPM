// lpm/src/components/HeaderBar.jsx
export default function HeaderBar() {
  return (
    <header className="w-full bg-white border-b-4 border-green-500 shadow-md py-2.5 px-4 flex justify-center items-center">
      <img
        src="/lotus-banner.png"
        alt="Lotus Premium Mart @ Rivertrees"
        className="h-16 sm:h-20 w-auto max-w-full object-contain select-none filter drop-shadow-sm"
        loading="eager"
      />
    </header>
  );
}
// lpm/src/components/HeaderBar.jsx
export default function HeaderBar() {
  return (
    <div className="w-full flex justify-center items-center">
      <img
        src="/lotus-banner.png"
        alt="Lotus Premium Mart @ Rivertrees"
        className="h-14 sm:h-30 w-auto max-w-full object-contain select-none filter drop-shadow-sm"
        loading="eager"
      />
    </div>
  );
}
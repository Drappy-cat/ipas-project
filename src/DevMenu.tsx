import { useState } from 'react';

const SCREENS = [
  'splash', 'homepage', 'onboarding',
  'roleSelect', 'loginGuru',
  'teacherDash', 'uploadMateri', 'buatInteraktif', 'progressSiswa', 'kelolaBab', 'pengaturanGuru',
  'studentHome', 'daftarBab', 'detailBab',
  'bacaMateri', 'mediaHub',
  'dragDrop', 'flipCards', 'virtualEksperimen', 'simulasiAir',
  'quiz', 'hasilKuis', 'proyekP5'
];

export default function DevMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const jumpTo = (screen: string) => {
    window.dispatchEvent(new CustomEvent('dev-nav', { detail: { screen } }));
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans">
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl p-2 mb-2 border border-gray-200 w-48 max-h-64 overflow-y-auto">
          <p className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">Dev Menu - Jump to</p>
          <div className="flex flex-col gap-1">
            {SCREENS.map(s => (
              <button
                key={s}
                onClick={() => jumpTo(s)}
                className="text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition-transform"
      >
        ⚙️
      </button>
    </div>
  );
}

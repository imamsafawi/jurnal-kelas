import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-3 shadow-md">
            <svg className="w-10 h-10 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Jurnal Mengajar</h1>
            <p className="text-blue-200 text-sm md:text-base">SMP Negeri 17 Surabaya — Kelas VII</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

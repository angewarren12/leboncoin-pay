import React from "react";

const Header: React.FC = () => (
  <header className="w-full py-4 border-b border-gray-200 bg-white">
    <div className="container mx-auto px-4 flex items-center">
      <img src="/logo.png" alt="Leboncoin" className="h-8" />
    </div>
  </header>
);

export default Header; 
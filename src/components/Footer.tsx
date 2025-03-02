
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4 mt-auto border-t border-gray-200">
      <div className="container mx-auto px-4 text-center text-xs text-gray-500">
        <p>©2006-{currentYear} Leboncoin. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-1">
          <a href="#" className="hover:text-leboncoin-orange transition-colors">Privacy</a>
          <a href="#" className="hover:text-leboncoin-orange transition-colors">Legal</a>
          <a href="#" className="hover:text-leboncoin-orange transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

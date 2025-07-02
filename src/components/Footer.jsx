import React from 'react';
import { Link } from 'react-router'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300 text-base-content py-8 border-t border-base-content/10">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          <Link to="/" className="flex items-center justify-center">
            <img src="/logo.png" alt="SharedSpoon Logo" className="h-8 mr-2" />
            <span className="italic font-light text-base-content/80 text-xl">Shared</span>
            <span className="font-bold text-primary text-xl">Spoon</span>
          </Link>
        </div>
        <p className="text-sm">
          &copy; {currentYear} SharedSpoon. All rights reserved.
        </p>
        <p className="text-xs mt-1 text-base-content/70">
          Reducing food waste, one meal at a time.
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;
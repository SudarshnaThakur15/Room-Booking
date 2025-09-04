import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import "../../index.css";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FaFacebookF className="text-2xl hover:text-blue-600 transition-colors duration-300" />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <FaTwitter className="text-2xl hover:text-blue-400 transition-colors duration-300" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram className="text-2xl hover:text-pink-500 transition-colors duration-300" />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedinIn className="text-2xl hover:text-blue-700 transition-colors duration-300" />
        </a>
      </div>
      <div className="text-center text-sm">
        &copy; 2024 Book-Your-Room. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

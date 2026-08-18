import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full mt-20 mb-8 md:mb-4 px-6 py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 pb-24 md:pb-8">
      <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
        <div className="flex items-center gap-2">
          <img src="/mouvie-logo-removebg-preview.png" alt="Mouvie Logo" className="h-8 object-contain" />
        </div>
        <p className="text-gray-500 text-sm">
          Built with React & Tailwind CSS. Powered by TMDB.
        </p>
      </div>

      <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
        <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Useful Resources</h4>
        <a 
          href="https://fmhy.net/video" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          FMHY Video Directory
        </a>
      </div>
    </footer>
  );
};

export default Footer;

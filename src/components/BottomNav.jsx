import React from 'react';

const BottomNav = ({ activeTab, onTabChange, onFilterClick }) => {
    const tabs = [
        { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
        { id: 'search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Search' },
        { id: 'favorites', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z', label: 'Favorites' },
        { id: 'filter', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', label: 'Filter' },
        { id: 'trending', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', label: 'Trending' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-lg border-t border-white/10 px-6 py-3 z-40 md:hidden pb-safe">
            <ul className="flex justify-between items-center max-w-sm mx-auto">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <li key={tab.id}>
                            <button
                                onClick={() => tab.id === 'filter' ? onFilterClick() : onTabChange(tab.id)}
                                className={`flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={isActive ? 2.5 : 2}
                                    stroke="currentColor"
                                    className="w-6 h-6 transition-transform duration-200"
                                    style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                                </svg>
                                <span className="text-[10px] font-medium">{tab.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default BottomNav;

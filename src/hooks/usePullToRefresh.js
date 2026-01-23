import { useState, useEffect } from 'react';

export const usePullToRefresh = (onRefresh) => {
    const [pullStartElement, setPullStartElement] = useState(0);
    const [pullChange, setPullChange] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const handleTouchStart = (e) => {
            if (window.scrollY === 0) {
                setPullStartElement(e.targetTouches[0].clientY);
            }
        };

        const handleTouchMove = (e) => {
            const touchY = e.targetTouches[0].clientY;
            const diff = touchY - pullStartElement;

            if (window.scrollY === 0 && diff > 0 && pullStartElement > 0) {
                // Resistance effect
                setPullChange(diff > 150 ? 150 : diff);
                e.preventDefault(); // Prevent native scroll
            }
        };

        const handleTouchEnd = async () => {
            if (pullChange > 80) { // Threshold to trigger refresh
                setIsRefreshing(true);
                setPullChange(0);
                await onRefresh();
                setIsRefreshing(false);
            } else {
                setPullChange(0);
            }
            setPullStartElement(0);
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [pullStartElement, pullChange, onRefresh]);

    return { isRefreshing, pullChange };
};

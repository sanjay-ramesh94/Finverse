import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function PullToRefresh({ children }) {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const pullDistance = Math.max(0, currentY - startY);
  const maxPull = 80;
  const isPulling = pullDistance > 0 && startY > 0;

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (window.scrollY === 0 && startY > 0) {
        const y = e.touches[0].clientY;
        if (y > startY) {
          // Only prevent default if we are actively pulling down at the top
          // Note: passive: false is required on the event listener to call preventDefault
          // e.preventDefault();
          setCurrentY(y);
        } else {
          setStartY(0);
          setCurrentY(0);
        }
      }
    };

    const handleTouchEnd = () => {
      if (isPulling && pullDistance >= maxPull && !refreshing) {
        setRefreshing(true);
        // Add a small delay for visual feedback before reloading
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setStartY(0);
        setCurrentY(0);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    // Using passive false so we could prevent default if needed, though most mobile browsers handle it fine
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startY, pullDistance, refreshing, isPulling]);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none transition-all duration-200 ease-out"
        style={{
          transform: `translateY(${isPulling ? Math.min(pullDistance, maxPull) - 50 : -50}px)`,
          opacity: isPulling ? Math.min(pullDistance / maxPull, 1) : 0,
        }}
      >
        <div
          className="mt-safe-top w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center transition-transform"
          style={{ transform: `rotate(${pullDistance * 3}deg)` }}
        >
          <RefreshCw size={20} className={refreshing ? "animate-spin text-indigo-500" : "text-slate-400"} />
        </div>
      </div>
      <div
        className="transition-transform duration-200 ease-out min-h-screen"
        style={{ transform: isPulling && !refreshing ? `translateY(${Math.min(pullDistance, maxPull) * 0.3}px)` : "translateY(0)" }}
      >
        {children}
      </div>
    </>
  );
}

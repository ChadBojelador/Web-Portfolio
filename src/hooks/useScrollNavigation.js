// Hook for scroll-based page navigation
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PAGE_ORDER = ['/', '/projects', '/certificates', '/tools', '/about'];

export const useScrollNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let scrollTimeout = null;
    let isNavigating = false;
    let scrollCount = 0;
    const SCROLL_THRESHOLD = 150; // Increased from 50px to 150px
    const REQUIRED_SCROLLS = 3; // Need 3 scroll events in same direction

    const handleScroll = (e) => {
      if (isNavigating) return;

      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Debounce scroll events
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const atBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;
        const atTop = scrollTop <= SCROLL_THRESHOLD;

        const currentIndex = PAGE_ORDER.indexOf(location.pathname);

        // Scroll down at bottom - go to next page
        if (atBottom && currentIndex < PAGE_ORDER.length - 1) {
          scrollCount++;
          if (scrollCount >= REQUIRED_SCROLLS) {
            isNavigating = true;
            scrollCount = 0;
            navigate(PAGE_ORDER[currentIndex + 1]);
            window.scrollTo(0, 0);
            setTimeout(() => {
              isNavigating = false;
            }, 300);
          }
        }
        // Scroll up at top - go to previous page
        else if (atTop && currentIndex > 0 && e.deltaY < 0) {
          scrollCount++;
          if (scrollCount >= REQUIRED_SCROLLS) {
            isNavigating = true;
            scrollCount = 0;
            navigate(PAGE_ORDER[currentIndex - 1]);
            window.scrollTo(0, document.documentElement.scrollHeight);
            setTimeout(() => {
              isNavigating = false;
            }, 300);
          }
        } else {
          scrollCount = 0; // Reset if not at edge
        }
      }, 100);
    };

    const handleWheel = (e) => {
      handleScroll(e);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [navigate, location]);
};

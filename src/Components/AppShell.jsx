import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SpotifyPlaylistCard from './SpotifyPlaylistCard';

const FLOATING_MARGIN = 12;

function AppShell() {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const nonHomeSegments = ['/projects', '/about', '/certificates', '/tools'];
  const isDraggableRoute = nonHomeSegments.some((segment) => normalizedPath.endsWith(segment));
  const isHome = !isDraggableRoute;

  const floatingCardRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [floatingPosition, setFloatingPosition] = useState(null);
  const [homeStyle, setHomeStyle] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const clampPosition = (x, y) => {
    if (typeof window === 'undefined') return { x, y };
    const element = floatingCardRef.current;
    const cardWidth = element?.offsetWidth ?? Math.min(320, window.innerWidth * 0.92);
    const cardHeight = element?.offsetHeight ?? 220;
    const maxX = Math.max(FLOATING_MARGIN, window.innerWidth - cardWidth - FLOATING_MARGIN);
    const maxY = Math.max(FLOATING_MARGIN, window.innerHeight - cardHeight - FLOATING_MARGIN);
    return {
      x: Math.min(Math.max(FLOATING_MARGIN, x), maxX),
      y: Math.min(Math.max(FLOATING_MARGIN, y), maxY),
    };
  };

  const getDefaultFloatingPosition = () => {
    if (typeof window === 'undefined') return { x: FLOATING_MARGIN, y: FLOATING_MARGIN };
    const defaultLeft = Math.max(FLOATING_MARGIN, (window.innerWidth - 1120) / 2);
    const defaultTop = window.innerHeight - 220 - FLOATING_MARGIN;
    return clampPosition(defaultLeft, defaultTop);
  };

  // Draggable routes positioning
  useEffect(() => {
    if (!isDraggableRoute) return;
    if (floatingPosition) return;
    setFloatingPosition(getDefaultFloatingPosition());
  }, [isDraggableRoute, floatingPosition]);

  useEffect(() => {
    if (!isDraggableRoute) return undefined;
    const handleResize = () => {
      setFloatingPosition((prev) => {
        if (!prev) return getDefaultFloatingPosition();
        return clampPosition(prev.x, prev.y);
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDraggableRoute]);

  // Home route precise alignment tracking
  useEffect(() => {
    if (!isHome) return;

    let observer;
    const updateHomePos = () => {
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Fallback for mobile: stick it right below the profile card
        const aside = document.querySelector('.left-column aside');
        if (aside) {
          const rect = aside.getBoundingClientRect();
          setHomeStyle({
            position: 'absolute',
            top: `${rect.bottom + window.scrollY + 20}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(94vw, 360px)'
          });
        }
      } else {
        // Desktop: Align perfectly with "What I've Accompolished" (carousel-section)
        const carousel = document.getElementById('carousel-section');
        const leftCol = document.querySelector('.left-column');
        const aside = document.querySelector('.left-column aside');

        if (carousel && leftCol) {
          const carouselRect = carousel.getBoundingClientRect();
          const leftColRect = leftCol.getBoundingClientRect();

          let targetTop = carouselRect.top + window.scrollY;

          // Ensure it never overlaps the white profile card
          if (aside) {
            const asideRect = aside.getBoundingClientRect();
            const minTop = asideRect.bottom + window.scrollY + 90; // 24px padding below white card
            if (targetTop < minTop) {
              targetTop = minTop;
            }
          }

          setHomeStyle({
            position: 'absolute',
            top: `${targetTop}px`,
            left: `${leftColRect.left + window.scrollX}px`,
            width: `${leftColRect.width}px`,
            transform: 'none'
          });
        }
      }
    };

    updateHomePos();
    window.addEventListener('resize', updateHomePos);

    // We observe mutations incase fonts/images push the layout down
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(updateHomePos);
      const root = document.getElementById('root');
      if (root) observer.observe(root);
    }

    return () => {
      window.removeEventListener('resize', updateHomePos);
      if (observer) observer.disconnect();
    };
  }, [isHome]);


  const handleDragStart = (event) => {
    if (!isDraggableRoute) return;
    if (event.button !== undefined && event.button !== 0) return;
    const element = floatingCardRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    dragStateRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleDragMove = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging) return;
    if (dragState.pointerId !== event.pointerId) return;
    const nextLeft = event.clientX - dragState.offsetX;
    const nextTop = event.clientY - dragState.offsetY;
    setFloatingPosition(clampPosition(nextLeft, nextTop));
  };

  const handleDragEnd = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || dragState.pointerId !== event.pointerId) return;
    dragStateRef.current = { isDragging: false, pointerId: null, offsetX: 0, offsetY: 0 };
    setIsDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const floatingStyle =
    isDraggableRoute && floatingPosition
      ? {
        position: 'fixed',
        left: `${floatingPosition.x}px`,
        top: `${floatingPosition.y}px`,
        bottom: 'auto',
        right: 'auto',
      }
      : undefined;

  const persistentClassName = isHome
    ? 'spotify-persistent spotify-persistent--home'
    : 'spotify-persistent spotify-persistent--floating spotify-persistent--draggable';

  return (
    <>
      <Outlet />
      <div
        className={persistentClassName}
        style={isHome ? (homeStyle || {}) : floatingStyle}
        ref={floatingCardRef}
      >
        {isDraggableRoute && (
          <div className="spotify-controls-row">
            <button
              type="button"
              className="spotify-minimize-btn"
              onClick={() => setIsMinimized((prev) => !prev)}
              aria-label={isMinimized ? "Expand player" : "Minimize player"}
            >
              {isMinimized ? '＋' : '—'}
            </button>
            <button
              type="button"
              className={`spotify-drag-handle${isDragging ? ' is-dragging' : ''}`}
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              aria-label="Drag music player"
            >
              ⠿ Drag player
            </button>
          </div>
        )}
        <div className={isMinimized && isDraggableRoute ? 'spotify-hidden-container' : ''}>
          <SpotifyPlaylistCard compact={isDraggableRoute} />
        </div>
      </div>
    </>
  );
}

export default AppShell;

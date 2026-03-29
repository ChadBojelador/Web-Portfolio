import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SpotifyPlaylistCard from './SpotifyPlaylistCard';

const FLOATING_MARGIN = 12;
const HOME_GAP = 12;

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
  const [homePosition, setHomePosition] = useState(null);

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

  useEffect(() => {
    if (!isDraggableRoute) return;
    if (floatingPosition) return;
    setFloatingPosition(getDefaultFloatingPosition());
  }, [isDraggableRoute, floatingPosition]);

  useEffect(() => {
    if (!isHome) return undefined;

    const updateHomePosition = () => {
      const profileCard = document.querySelector('.main-contain aside');
      if (!profileCard || typeof window === 'undefined') {
        setHomePosition(null);
        return;
      }

      const rect = profileCard.getBoundingClientRect();
      const maxWidth = Math.max(220, window.innerWidth - FLOATING_MARGIN * 2);
      const width = Math.min(rect.width, maxWidth);
      const maxLeft = Math.max(FLOATING_MARGIN, window.innerWidth - width - FLOATING_MARGIN);
      const nextLeft = Math.min(Math.max(FLOATING_MARGIN, rect.left), maxLeft);

      setHomePosition({
        left: nextLeft,
        top: rect.bottom + HOME_GAP,
        width,
      });
    };

    updateHomePosition();
    window.addEventListener('resize', updateHomePosition);

    let observer;
    const profileCard = document.querySelector('.main-contain aside');
    if (profileCard && 'ResizeObserver' in window) {
      observer = new ResizeObserver(updateHomePosition);
      observer.observe(profileCard);
    }

    return () => {
      window.removeEventListener('resize', updateHomePosition);
      observer?.disconnect();
    };
  }, [isHome]);

  useEffect(() => {
    if (!isDraggableRoute) return undefined;

    const handleResize = () => {
      setFloatingPosition((previousPosition) => {
        if (!previousPosition) return getDefaultFloatingPosition();
        return clampPosition(previousPosition.x, previousPosition.y);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDraggableRoute]);

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

    dragStateRef.current = {
      isDragging: false,
      pointerId: null,
      offsetX: 0,
      offsetY: 0,
    };
    setIsDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const persistentClassName = isHome
    ? 'spotify-persistent spotify-persistent--home'
    : 'spotify-persistent spotify-persistent--floating spotify-persistent--draggable';

  const floatingStyle = isDraggableRoute && floatingPosition
    ? {
      left: `${floatingPosition.x}px`,
      top: `${floatingPosition.y}px`,
      bottom: 'auto',
      right: 'auto',
    }
    : undefined;

  const homeStyle = isHome && homePosition
    ? {
      left: `${homePosition.left}px`,
      top: `${homePosition.top}px`,
      width: `${homePosition.width}px`,
      right: 'auto',
      bottom: 'auto',
      transform: 'none',
    }
    : undefined;

  const persistentStyle = isHome ? homeStyle : floatingStyle;

  return (
    <>
      <Outlet />
      <div className={persistentClassName} style={persistentStyle} ref={floatingCardRef}>
        {isDraggableRoute && (
          <button
            type="button"
            className={`spotify-drag-handle${isDragging ? ' is-dragging' : ''}`}
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            aria-label="Drag music player"
          >
            Drag player
          </button>
        )}
        <SpotifyPlaylistCard compact={isDraggableRoute} />
      </div>
    </>
  );
}

export default AppShell;

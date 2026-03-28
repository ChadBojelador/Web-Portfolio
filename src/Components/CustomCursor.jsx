import { useState, useEffect, useRef, useCallback } from 'react';
import '../Styles/index.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const trailRef = useRef(null);
  const requestRef = useRef(null);
  const trailPos = useRef({ x: -100, y: -100 });

  const updatePosition = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
    const target = e.target;
    const isInteractive = target instanceof Element && target.closest('button, a, input, textarea, [role="button"]');
    setIsHovering(!!isInteractive);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', updatePosition);
    return () => {
      document.removeEventListener('mousemove', updatePosition);
    };
  }, [updatePosition]);

  // Smooth trail using lerp (linear interpolation) in rAF loop
  useEffect(() => {
    const animate = () => {
      if (trailRef.current) {
        trailPos.current.x += (position.x - trailPos.current.x) * 0.12;
        trailPos.current.y += (position.y - trailPos.current.y) * 0.12;
        trailRef.current.style.transform = `translate(${trailPos.current.x - 24}px, ${trailPos.current.y - 24}px) scale(${isHovering ? 1.8 : 1})`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [position, isHovering]);

  return (
    <>
      <div
        className="cursor"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: isHovering ? 0.7 : 1
        }}
      />
      <div
        ref={trailRef}
        className="cursor-trail"
        style={{ opacity: isHovering ? 0.4 : 0.7 }}
      />
    </>
  );
};

export default CustomCursor;
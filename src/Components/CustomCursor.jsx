
import { useState, useEffect, useRef } from 'react';
import '../Styles/index.css'; // Create this CSS file

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const trailRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = target.closest('button, a, input, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseenter', updatePosition);
    
    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseenter', updatePosition);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
   const animate = () => {
    if (trailRef.current) {
      const trail = trailRef.current;
      trail.style.transform = `translate(
        ${position.x - 24}px, 
        ${position.y - 24}px
      ) scale(${isHovering ? 1.8 : 1})`;
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
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: isHovering ? 0.4 : 0.7
        }}
      />
    </>
  );
};

export default CustomCursor;
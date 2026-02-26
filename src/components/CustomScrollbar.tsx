'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function CustomScrollbar() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  const updateScrollbar = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    setScrollPercentage(percentage);

    // Calculate thumb height based on viewport/content ratio
    const viewportRatio = window.innerHeight / document.documentElement.scrollHeight;
    const minThumbHeight = 40;
    const trackHeight = window.innerHeight - 20; // 10px padding top and bottom
    const calculatedHeight = Math.max(minThumbHeight, viewportRatio * trackHeight);
    setThumbHeight(calculatedHeight);

    // Show scrollbar if content is scrollable
    setIsVisible(document.documentElement.scrollHeight > window.innerHeight);
  }, []);

  useEffect(() => {
    updateScrollbar();
    window.addEventListener('scroll', updateScrollbar);
    window.addEventListener('resize', updateScrollbar);

    return () => {
      window.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [updateScrollbar]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const trackHeight = trackRect.height - thumbHeight;
    const clickPercentage = (clickY - thumbHeight / 2) / trackHeight;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const newScrollTop = Math.max(0, Math.min(scrollHeight, clickPercentage * scrollHeight));

    window.scrollTo({ top: newScrollTop, behavior: 'smooth' });
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScroll.current = window.scrollY;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !trackRef.current) return;

      const deltaY = e.clientY - dragStartY.current;
      const trackHeight = trackRef.current.getBoundingClientRect().height - thumbHeight;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDelta = (deltaY / trackHeight) * scrollHeight;

      window.scrollTo({ top: dragStartScroll.current + scrollDelta });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, thumbHeight]);

  if (!isVisible) return null;

  const trackHeight = typeof window !== 'undefined' ? window.innerHeight - 20 : 0;
  const maxThumbOffset = trackHeight - thumbHeight;
  const thumbOffset = (scrollPercentage / 100) * maxThumbOffset;

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      className="fixed right-0 top-0 bottom-0 w-[10px] bg-white z-[9999] cursor-pointer"
      style={{ padding: '10px 0' }}
    >
      <div
        onMouseDown={handleThumbMouseDown}
        className={`absolute right-0 w-[10px] rounded-full ${
          isDragging ? 'bg-[#6B2850]' : 'bg-[#873260] hover:bg-[#6B2850]'
        }`}
        style={{
          height: `${thumbHeight}px`,
          top: `${thumbOffset + 10}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'top 0.1s ease-out, background-color 0.2s',
        }}
      />
    </div>
  );
}

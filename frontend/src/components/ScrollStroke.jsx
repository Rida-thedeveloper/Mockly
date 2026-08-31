import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * Scroll-driven SVG stroke decoration.
 *
 * Props:
 *   path        – SVG path d string
 *   viewBox     – e.g. "0 0 1200 3200"
 *   color       – primary stroke color (rgba or css var)
 *   glowColor   – glow halo color
 *   dotColor    – travelling dot fill
 *   strokeWidth – main stroke px (default 2.5)
 *   side        – 'left' | 'right' | 'center' (SVG horizontal alignment)
 *   scrollRange – [start, end] of scrollYProgress to animate over (default [0, 0.9])
 *   filterId    – unique id prefix to avoid filter collisions across pages
 */
export default function ScrollStroke({
  path,
  viewBox = '0 0 1200 3200',
  color = 'rgba(201,168,76,0.45)',
  glowColor = 'rgba(201,168,76,0.18)',
  dotColor = '#C9A84C',
  strokeWidth = 2.5,
  side = 'center',
  scrollRange = [0, 0.9],
  filterId = 'sg',
}) {
  const { scrollYProgress } = useScroll();

  const rawLength = useTransform(scrollYProgress, [scrollRange[0], scrollRange[1]], [0, 1]);
  const pathLength = useSpring(rawLength, { stiffness: 40, damping: 18 });
  const dotProgress = useTransform(scrollYProgress, scrollRange, ['0%', '100%']);
  const dotOpacity = useTransform(scrollYProgress, [scrollRange[0], scrollRange[0] + 0.03, scrollRange[1] - 0.05, scrollRange[1]], [0, 1, 1, 0]);
  const pathOpacity = useTransform(scrollYProgress, [scrollRange[0], scrollRange[0] + 0.03, scrollRange[1] - 0.05, scrollRange[1]], [0, 1, 1, 0]);

  const alignStyle = side === 'left'
    ? { left: 0, transform: 'none' }
    : side === 'right'
    ? { right: 0, left: 'auto', transform: 'none' }
    : { left: '50%', transform: 'translateX(-50%)' };

  // ghost path color (very faint, always visible)
  const ghostColor = color.replace(/[\d.]+\)$/, '0.08)');

  return (
    <>
      <style>{`@media (max-width: 767px) { .mockly-stroke-${filterId} { display: none !important; } }`}</style>
      <div
        className={`mockly-stroke-${filterId}`}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none', overflow: 'hidden', zIndex: -1,
        }}
      >
        <svg
          viewBox={viewBox}
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', top: 0, width: '100%', height: '100%', ...alignStyle }}
        >
          <defs>
            <filter id={`${filterId}-glow`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={`${filterId}-glow-soft`} x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ghost trail — always visible, very faint */}
          <path d={path} stroke={ghostColor} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" fill="none" />

          {/* Ambient glow halo */}
          <motion.path
            d={path}
            stroke={glowColor}
            strokeWidth={strokeWidth * 5}
            strokeLinecap="round"
            fill="none"
            filter={`url(#${filterId}-glow-soft)`}
            style={{ pathLength, opacity: pathOpacity }}
          />

          {/* Main stroke */}
          <motion.path
            d={path}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            style={{ pathLength, opacity: pathOpacity }}
          />

          {/* Bright core */}
          <motion.path
            d={path}
            stroke={color.replace(/[\d.]+\)$/, '0.25)')}
            strokeWidth={strokeWidth * 0.3}
            strokeLinecap="round"
            fill="none"
            style={{ pathLength, opacity: pathOpacity }}
          />

          {/* Travelling dot */}
          <motion.circle
            r="6"
            fill={dotColor}
            filter={`url(#${filterId}-glow)`}
            style={{ offsetPath: `path('${path}')`, offsetDistance: dotProgress, opacity: dotOpacity }}
          />
          {/* Dot halo */}
          <motion.circle
            r="14"
            fill={glowColor}
            style={{ offsetPath: `path('${path}')`, offsetDistance: dotProgress, opacity: dotOpacity }}
          />
        </svg>
      </div>
    </>
  );
}

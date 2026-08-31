import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroScreen({ onDone }) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  function dismiss() {
    setVisible(false);
  }

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onEnd = () => dismiss();
    const onTime = () => {
      if (vid.duration) setProgress(vid.currentTime / vid.duration);
    };

    vid.addEventListener('ended', onEnd);
    vid.addEventListener('timeupdate', onTime);
    return () => {
      vid.removeEventListener('ended', onEnd);
      vid.removeEventListener('timeupdate', onTime);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'var(--obsidian)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            src="/intro.mp4"
            autoPlay
            muted={false}
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Subtle vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 60%, rgba(10,10,12,0.7) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Progress bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'var(--gold)',
                transformOrigin: 'left',
                scaleX: progress,
              }}
            />
          </div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            onClick={dismiss}
            style={{
              position: 'absolute',
              top: '28px',
              right: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '100px',
              color: 'var(--text-primary)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            whileHover={{
              background: 'rgba(201,168,76,0.15)',
              borderColor: 'rgba(201,168,76,0.4)',
              color: 'var(--gold-light)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              style={{ opacity: 0.7 }}
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="12"
                y="3"
                width="1.5"
                height="10"
                rx="0.75"
                fill="currentColor"
              />
            </svg>
          </motion.button>

          {/* Mockly wordmark — faint overlay so brand is visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(13px, 2vw, 18px)',
              letterSpacing: '0.35em',
              color: 'rgba(201,168,76,0.55)',
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}
          >
            Mockly
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

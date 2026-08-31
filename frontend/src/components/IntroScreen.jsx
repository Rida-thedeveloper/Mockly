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
    vid.play().catch(() => {});

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10,10,12,0.92)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          {/* MOCKLY wordmark — top */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(22px, 3vw, 32px)',
              letterSpacing: '0.45em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              fontWeight: 700,
              pointerEvents: 'none',
            }}
          >
            Mockly
          </motion.div>

          {/* Video card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'relative',
              width: 'min(560px, 90vw)',
              aspectRatio: '16/9',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(201,168,76,0.2)',
              boxShadow: '0 0 60px rgba(201,168,76,0.08), 0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            <video
              ref={videoRef}
              src="/intro.mp4"
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Progress bar inside the card */}
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
              <div
                style={{
                  height: '100%',
                  background: 'var(--gold)',
                  width: `${progress * 100}%`,
                  transition: 'width 0.25s linear',
                }}
              />
            </div>
          </motion.div>

          {/* Skip button — below the video */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            onClick={dismiss}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              color: 'var(--text-secondary)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            whileHover={{
              background: 'rgba(201,168,76,0.12)',
              borderColor: 'rgba(201,168,76,0.35)',
              color: 'var(--gold-light)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Skip intro
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.7 }}>
              <path
                d="M3 8h9M8.5 4.5l3.5 3.5-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="12" y="3.5" width="1.5" height="9" rx="0.75" fill="currentColor" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroScreen({ onDone }) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  // Browser autoplay policy: video must start muted to autoplay.
  // User can click the sound overlay to unmute.
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSoundPrompt, setShowSoundPrompt] = useState(true);

  function dismiss() {
    setVisible(false);
  }

  function enableSound() {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = false;
    setSoundEnabled(true);
    setShowSoundPrompt(false);
  }

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Must start muted for autoplay to work (Chrome/Safari policy).
    // User can tap the prompt to unmute.
    vid.muted = true;
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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'var(--obsidian)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          {/* MOCKLY wordmark */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              letterSpacing: '0.5em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              fontWeight: 700,
              pointerEvents: 'none',
            }}
          >
            Mockly
          </motion.div>

          {/* Video wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'relative', width: 'min(380px, 80vw)' }}
          >
            <video
              ref={videoRef}
              src="/intro.mp4"
              autoPlay
              playsInline
              muted
              style={{ width: '100%', display: 'block', borderRadius: '12px' }}
            />

            {/* Sound enable prompt — shown until user taps */}
            <AnimatePresence>
              {showSoundPrompt && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ delay: 0.8, duration: 0.35 }}
                  onClick={enableSound}
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: 100,
                    color: 'var(--gold)',
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Tap for sound
                </motion.button>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', marginTop: '10px' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--gold)',
                  width: `${progress * 100}%`,
                  borderRadius: '1px',
                  transition: 'width 0.25s linear',
                }}
              />
            </div>
          </motion.div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            onClick={dismiss}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 22px',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '100px',
              color: 'var(--text-secondary)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px', fontWeight: 500,
              letterSpacing: '0.03em', cursor: 'pointer', lineHeight: 1,
            }}
            whileHover={{ background: 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.3)', color: 'var(--gold-light)' }}
            whileTap={{ scale: 0.95 }}
          >
            Skip intro
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h9M8.5 4.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="12" y="3.5" width="1.5" height="9" rx="0.75" fill="currentColor" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

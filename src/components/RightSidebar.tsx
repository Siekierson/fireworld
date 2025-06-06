'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ChatAssistant from './ChatAssistant';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function RightSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add debug effect
  useEffect(() => {
    console.log('Panel state changed:', isOpen);
  }, [isOpen]);

  const MobileButton = () => {
    if (!mounted || !isMobile || isOpen) return null;

    return createPortal(
      <div 
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          zIndex: 99999,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={() => {
            console.log('Button clicked, current state:', isOpen);
            setIsOpen(prev => !prev);
          }}
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '1rem',
            borderRadius: '9999px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3.5rem',
            height: '3.5rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#ea580c';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f97316';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
        >
          <ChatBubbleLeftRightIcon style={{ width: '1.75rem', height: '1.75rem' }} />
        </button>
      </div>,
      document.body
    );
  };

  const MobilePanel = () => {
    if (!mounted || !isMobile || !isOpen) return null;

    return createPortal(
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        {/* Backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Panel */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            height: '75vh',
            backgroundColor: '#541010',
            backdropFilter: 'blur(8px)',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease-in-out',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            padding: '1rem', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                color: '#f97316',
                padding: '0.5rem',
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ea580c'}
              onMouseOut={(e) => e.currentTarget.style.color = '#f97316'}
            >
              <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span style={{ fontSize: '0.875rem' }}>Zamknij</span>
            </button>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#f97316',
              margin: 0
            }}>AI Assistant</h2>
            <div style={{ width: '4rem' }} /> {/* Spacer dla zachowania równowagi */}
          </div>
          <div style={{ height: 'calc(75vh - 4rem)', overflow: 'hidden' }}>
            <ChatAssistant />
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <MobileButton />
      
      {/* Mobile Panel */}
      <MobilePanel />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 h-screen bg-[#541010] backdrop-blur-lg p-6 flex flex-col fixed right-0 top-0">
        <div className="flex-none mb-4">
          <h2 className="text-xl font-bold text-orange-500">AI Assistant</h2>
        </div>
        <div className="h-[calc(100vh-8rem)] overflow-hidden">
          <ChatAssistant />
        </div>
      </div>
    </>
  );
} 
'use client';

import { useEffect, useState, useCallback } from 'react';
import { logViolation, isAppWhitelisted } from '@/lib/db';

interface ViolationTrackerProps {
  participantId: string;
  isActive: boolean;
}

// List of common application titles that might be detected
const APP_PATTERNS: Record<string, RegExp[]> = {
  'Arduino IDE': [
    /arduino/i,
    /IDE/i,
  ],
  'Visual Studio Code': [
    /code/i,
    /vs code/i,
    /visual studio/i,
  ],
  'Notepad++': [
    /notepad\+\+/i,
    /notepad plus/i,
  ],
  'Code::Blocks': [
    /code::blocks/i,
    /codeblocks/i,
  ],
  'Chat Interface': [
    /chat/i,
    /gpt/i,
    /whatsapp/i,
    /telegram/i,
    /messenger/i,
    /slack/i,
    /discord/i,
  ],
  'Browser Tab': [
    /chrome/i,
    /firefox/i,
    /safari/i,
    /edge/i,
  ],
};

// Attempt to detect whichapp is currently focused (limited by browser sandbox)
function detectActiveApp(): string | null {
  // Browser sandboxing severely limits what we can detect
  // We can only detect based on document visibility and tab focus
  // More advanced detection would require OS-level permissions
  
  if (!document.hasFocus()) {
    return 'external_application';
  }
  
  return null;
}

export function ViolationTracker({
  participantId,
  isActive,
}: ViolationTrackerProps) {
  const [lastWindowState, setLastWindowState] = useState<'focus' | 'blur'>('focus');
  const [lastVisibilityState, setLastVisibilityState] = useState<'visible' | 'hidden'>(
    document.visibilityState as 'visible' | 'hidden'
  );
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [windowBlurCount, setWindowBlurCount] = useState(0);

  // Handle tab/window visibility changes
  const handleVisibilityChange = useCallback(() => {
    if (!isActive) return;

    const isVisible = document.visibilityState === 'visible';
    
    if (!isVisible && lastVisibilityState === 'visible') {
      // User switched away from this tab
      setTabSwitchCount(prev => prev + 1);
      
      // Log as critical violation
      logViolation(
        participantId,
        'tab_switch',
        'User switched to another browser tab',
        {
          severity: 'critical',
          is_approved: false,
        }
      );
    }

    setLastVisibilityState(document.visibilityState as 'visible' | 'hidden');
  }, [isActive, lastVisibilityState, participantId]);

  // Handle window focus/blur (switching to different application)
  const handleWindowBlur = useCallback(() => {
    if (!isActive) return;

    setWindowBlurCount(prev => prev + 1);
    
    // Attempt to detect what application the user switched to
    const detectedApp = detectActiveApp();
    
    // Check if it's a whitelisted app
    let severity: 'permitted' | 'warning' | 'critical' = 'warning';
    let appName = detectedApp || 'Unknown application';
    
    if (detectedApp === 'external_application') {
      // Try to guess which application based on common patterns
      appName = 'External application';
      severity = 'warning';
    }

    // Check if it's a whitelisted app
    const isWhitelisted = detectedApp && isAppWhitelisted(detectedApp);

    if (isWhitelisted) {
      severity = 'permitted';
    }

    logViolation(
      participantId,
      detectedApp === 'external_application' ? 'window_blur' : 'local_app_access',
      `User switched focus away from test interface`,
      {
        severity,
        app_name: appName,
        is_approved: isWhitelisted,
      }
    );

    setLastWindowState('blur');
  }, [isActive, participantId]);

  const handleWindowFocus = useCallback(() => {
    setLastWindowState('focus');
  }, []);

  // Handle keyboard shortcuts (Alt+Tab, Ctrl combinations)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) return;

      // Detect Alt+Tab
      if ((e.altKey && e.key === 'Tab') || (e.ctrlKey && e.key === 'Tab')) {
        logViolation(
          participantId,
          'keypress_violation',
          'Alt+Tab or Ctrl+Tab pressed - attempted to switch tasks',
          {
            severity: 'critical',
            is_approved: false,
          }
        );
        e.preventDefault();
      }

      // Detect Cmd+Tab (macOS)
      if (e.metaKey && e.key === 'Tab') {
        logViolation(
          participantId,
          'keypress_violation',
          'Cmd+Tab pressed - attempted to switch tasks',
          {
            severity: 'critical',
            is_approved: false,
          }
        );
        e.preventDefault();
      }
    },
    [isActive, participantId]
  );

  // Handle attempts to open new tabs/windows
  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (!isActive) return;
      
      // Right-click attempt - could be opening dev tools or new tab
      const target = e.target as HTMLElement;
      if (target && !target.closest('[data-allow-context-menu]')) {
        logViolation(
          participantId,
          'security_attempt',
          'Right-click context menu attempted - possibly opening dev tools',
          {
            severity: 'critical',
            is_approved: false,
          }
        );
      }
    },
    [isActive, participantId]
  );

  // Attempt to detect fullscreen exit
  const handleFullscreenChange = useCallback(() => {
    if (!isActive) return;

    if (!document.fullscreenElement) {
      logViolation(
        participantId,
        'fullscreen_exit',
        'User exited fullscreen mode',
        {
          severity: 'warning',
          is_approved: false,
        }
      );
    }
  }, [isActive, participantId]);

  // Set up event listeners
  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [
    isActive,
    handleVisibilityChange,
    handleWindowBlur,
    handleWindowFocus,
    handleKeyDown,
    handleContextMenu,
    handleFullscreenChange,
  ]);

  // Component doesn't render anything - it just logs violations
  return null;
}

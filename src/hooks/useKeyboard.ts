import { useEffect } from 'react';
import { useCalcStore } from '../store/calcStore';
import { useGraphStore } from '../store/graphStore';
import { useUIStore } from '../store/uiStore';

export function useKeyboard() {
  const setPlaying = useCalcStore((state) => state.setPlaying);
  const playing = useCalcStore((state) => state.playing);
  const resetTime = useCalcStore((state) => state.resetTime);
  const toggleGradient = useCalcStore((state) => state.toggleGradientArrows);
  const toggleWireframe = useCalcStore((state) => state.toggleWireframe);
  const toggleContours = useCalcStore((state) => state.toggleContours);
  const toggleSlicing = useCalcStore((state) => state.toggleSlicing);
  const toggleDerivative = useCalcStore((state) => state.toggleDerivativeOverlay);
  const toggleIntegral = useCalcStore((state) => state.toggleIntegralOverlay);
  const addFunction = useGraphStore((state) => state.addFunction);
  const undo = useGraphStore((state) => state.undo);
  const cycleFunction = useGraphStore((state) => state.cycleSelection);
  const setShortcutsOpen = useUIStore((state) => state.setShortcutModalOpen);
  const setActivePanel = useUIStore((state) => state.setActivePanel);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

      if (event.key === '?') {
        event.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setActivePanel(null);
        setShortcutsOpen(false);
        return;
      }

      if (isTyping) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
          event.preventDefault();
          addFunction();
        }
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        setPlaying(!playing);
      }

      if (event.key.toLowerCase() === 'r') {
        resetTime();
      }
      if (event.key.toLowerCase() === 'g') {
        toggleGradient();
      }
      if (event.key.toLowerCase() === 'w') {
        toggleWireframe();
      }
      if (event.key.toLowerCase() === 'c') {
        toggleContours();
      }
      if (event.key.toLowerCase() === 's') {
        toggleSlicing();
      }
      if (event.key.toLowerCase() === 'd') {
        toggleDerivative();
      }
      if (event.key.toLowerCase() === 'i') {
        toggleIntegral();
      }
      if (event.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
          void document.documentElement.requestFullscreen();
        } else {
          void document.exitFullscreen();
        }
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        cycleFunction();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        undo();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
        event.preventDefault();
        addFunction();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    addFunction,
    cycleFunction,
    playing,
    resetTime,
    setActivePanel,
    setPlaying,
    setShortcutsOpen,
    toggleContours,
    toggleDerivative,
    toggleGradient,
    toggleIntegral,
    toggleSlicing,
    toggleWireframe,
    undo,
  ]);
}
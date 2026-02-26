import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Maximize2, Minimize2, MoreHorizontal } from 'lucide-react';
import ChatDrawer from './ChatDrawer';

export type AssistantState = 'idle' | 'executing' | 'attention';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(true);
  const [state, setState] = useState<AssistantState>('idle');
  const constraintsRef = useRef(null);

  // Mock state changes for demo purposes
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      setState((prev) => {
        if (prev === 'idle') return 'executing';
        if (prev === 'executing') return 'attention';
        return 'idle';
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const getStatusClasses = () => {
    switch (state) {
      case 'executing':
        return 'bg-blue-500 shadow-blue-500/50 animate-spin-slow';
      case 'attention':
        return 'bg-orange-500 shadow-orange-500/50 animate-pulse';
      case 'idle':
      default:
        return 'bg-indigo-600 shadow-indigo-600/50 hover:scale-105';
    }
  };

  return (
    <>
      {/* Draggable Ball Container */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        ref={constraintsRef}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
              className="absolute bottom-8 right-8 pointer-events-auto"
              style={{ x: 0, y: 0 }}
            >
              <button
                onClick={() => setIsOpen(true)}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-transform duration-200 ${getStatusClasses()}`}
                aria-label="Open AI Assistant"
              >
                {state === 'executing' ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : state === 'attention' ? (
                  <Bot size={28} className="animate-bounce" />
                ) : (
                  <Bot size={28} />
                )}
                
                {/* Breathing effect for idle */}
                {state === 'idle' && (
                  <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-30 animate-ping" style={{ animationDuration: '3s' }} />
                )}
                
                {/* Notification dot */}
                {state === 'attention' && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Drawer */}
      <ChatDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

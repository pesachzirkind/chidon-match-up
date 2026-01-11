import React, { useEffect } from 'react';
import type { Mitzvah } from '../../types';
import Button from '../Button/Button';

interface FeedbackModalProps {
  message: string;
  mitzvah?: Mitzvah | null;
  onClose: () => void;
  autoCloseDelay?: number;
}

export function FeedbackModal({ 
  message, 
  mitzvah, 
  onClose,
  autoCloseDelay = 3000 
}: FeedbackModalProps) {
  // Auto-close after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [onClose, autoCloseDelay]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-bounce-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Not Quite!
            </h3>
            <p className="text-sm text-gray-500">
              Here's a learning tip:
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-gray-700 text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Mitzvah details (if available) */}
        {mitzvah && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              About this Mitzvah:
            </p>
            <p className="text-hebrew text-lg text-gray-800 mb-1">
              {mitzvah.hebrew_name}
            </p>
            <p className="text-sm text-gray-600">
              {mitzvah.english_name}
            </p>
          </div>
        )}

        {/* Progress indicator */}
        <div className="w-full bg-gray-200 rounded-full h-1 mb-4 overflow-hidden">
          <div 
            className="bg-blue-500 h-1 rounded-full transition-all duration-100"
            style={{
              animation: `shrink ${autoCloseDelay}ms linear forwards`
            }}
          />
        </div>

        {/* Close button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
          >
            Got it! Continue
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default FeedbackModal;

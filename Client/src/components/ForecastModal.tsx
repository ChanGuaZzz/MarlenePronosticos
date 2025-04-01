import React, { useState, useEffect, useRef } from "react";

type ForecastModalProps = {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
};

const ForecastModal: React.FC<ForecastModalProps> = ({ isOpen, imageUrl, onClose }) => {
  const [showImage, setShowImage] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Function to hide image
    const hideImage = (mode: string="normal") => {
      setShowImage(false);
      // Show image again after a delay
      if (mode === "normal") {
        setTimeout(() => setShowImage(true), 3000);
      }
    };

    // Handle keyboard events (PrintScreen, Ctrl+P, Cmd+Shift+3/4, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen') {
        hideImage();
      }
      
      // Ctrl+P, Ctrl+Shift+I (inspect), and other common shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || 
          (e.shiftKey && e.key === 'i') || e.key === 'c')) {
        hideImage();
      }
      // Add detection for Meta+Shift combinations
      else if (e.metaKey && e.shiftKey) {
        hideImage();
      }
    };

    // Window blur might indicate screenshot tool activation
    const handleBlur = () => {
      hideImage("blur");
    };

    // Prevent context menu (right-click and long press on mobile)
    const preventContextMenu = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      hideImage();
      return false;
    };

    // Mobile touch events that might indicate screenshot attempts
    const handleTouchStart = (e: TouchEvent) => {
      // Multiple fingers might indicate screenshot gesture
      if (e.touches.length > 1) {
        hideImage();
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', () => setShowImage(true)); // Reset on focus
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/60 backdrop-blur-lg bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pronóstico</h3>
          <div className="mt-2 relative select-none touch-none">
            {/* Watermark overlay that appears in screenshots */}
            <div className="absolute inset-0 pointer-events-none z-5 flex items-center justify-center opacity-30">
              <p className="text-black font-bold text-xl rotate-45 select-none">
                CONTENIDO PROTEGIDO
              </p>
            </div>
            
            {!showImage && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
                <p className="text-red-600 font-bold">Captura de pantalla no permitida</p>
              </div>
            )}
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Pronóstico" 
              className={`w-full h-auto ${!showImage ? 'invisible' : ''} select-none`}
              style={{ 
                WebkitTouchCallout: 'none',
                userSelect: 'none' 
              }}
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
            />
          </div>
          <div className="mt-5 text-center">
            <p className="text-xs text-red-600 mb-2">
              ⚠️ Capturas de pantalla están prohibidas. Contenido de pago.
            </p>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastModal;
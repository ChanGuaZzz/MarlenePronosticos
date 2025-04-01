import React, { useState, useEffect, useRef } from "react";

type ForecastModalProps = {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
};

const ForecastModal: React.FC<ForecastModalProps> = ({ isOpen, imageUrl, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleContent, setVisibleContent] = useState(true);
  
  // Function to render image on canvas with watermark
  useEffect(() => {
    if (!isOpen || !imageUrl) return;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Add watermark pattern
      ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.font = '20px Arial';
      
      // Create diagonal watermark pattern
      for (let i = 0; i < canvas.width; i += 120) {
        for (let j = 0; j < canvas.height; j += 60) {
          ctx.save();
          ctx.translate(i, j);
          ctx.rotate(-Math.PI / 6);
          ctx.fillText('CONTENIDO PROTEGIDO', 0, 0);
          ctx.restore();
        }
      }
    };
  }, [isOpen, imageUrl]);
  
  // Detect visibility change (possible screenshot attempt)
  useEffect(() => {
    if (!isOpen) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setVisibleContent(false);
      } else {
        // Add delay before showing content again
        setTimeout(() => setVisibleContent(true), 300);
      }
    };
    
    // Detect window focus/blur (possible screenshot attempt)
    const handleBlur = () => setVisibleContent(false);
    const handleFocus = () => setTimeout(() => setVisibleContent(true), 300);
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isOpen]);
  
  // Prevent keyboard shortcuts for screenshots
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen, Ctrl+P, Cmd+Shift+3/4 (Mac screenshot)
      if (
        e.key === 'PrintScreen' || 
        (e.ctrlKey && e.key === 'p') || 
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4'))
      ) {
        e.preventDefault();
        setVisibleContent(false);
        setTimeout(() => setVisibleContent(true), 1000);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-lg bg-opacity-75 flex items-center justify-center p-4"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative bg-white rounded-lg max-w-4xl mx-auto overflow-hidden">
        <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
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
          <div 
            ref={containerRef}
            className="mt-2 relative select-none touch-none"
            style={{ 
              WebkitTouchCallout: 'none',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          >
            {/* Protection overlay */}
            {!visibleContent && (
              <div className="absolute inset-0 bg-gray-800 z-20 flex items-center justify-center">
                <p className="text-white text-lg">Contenido protegido</p>
              </div>
            )}
            
            {/* Canvas rendering instead of direct img tag */}
            <canvas 
              ref={canvasRef}
              className="w-full h-auto"
              style={{ 
                opacity: visibleContent ? 1 : 0,
                WebkitTouchCallout: 'none',
                userSelect: 'none'
              }}
            />
            
            {/* Additional protection layer with CSS blend modes */}
            <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-5" 
                 style={{background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)'}} />
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
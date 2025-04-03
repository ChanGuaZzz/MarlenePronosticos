import { useAppContext } from "../contexts/AppContext";

type ForecastModalProps = {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
};

const ForecastModal: React.FC<ForecastModalProps> = ({ isOpen, imageUrl, onClose }) => {
  
  const {session} = useAppContext();
  // const {username} = useAppContext();

  if (!isOpen|| !session) return null;

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
            <div className="absolute inset-0 pointer-events-none z-5 flex flex-wrap items-center justify-center opacity-30 overflow-hidden">
              {Array(50).fill(0).map((_, index) => (
                <p 
                  key={index} 
                  className="text-black font-bold text-xl rotate-45 select-none m-4"
                  style={{
                    position: 'relative',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {session.username}
                </p>
              ))}
            </div>
            
            <img 
              src={imageUrl} 
              alt="Pronóstico" 
              className={`w-full h-auto select-none`}
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
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import ForecastModal from "../components/ForecastModal";

// Tipo para nuestras compras
type Purchase = {
  id: number;
  title: string;
  description: string;
  purchaseDate: string;
  price: number;
  matchDate: string;
  forecastImageUrl: string;
  status: "completed" | "pending";
};

function MyPurchases() {
  // Estado para almacenar las compras
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    // Aquí normalmente harías una llamada API
    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        // Simular llamada a API
        setTimeout(() => {
          const dummyData: Purchase[] = [
            {
              id: 1,
              title: "Barcelona vs Real Madrid",
              description: "Predicción para El Clásico",
              purchaseDate: "2025-04-01",
              price: 0.01,
              matchDate: "2025-04-10",
              forecastImageUrl: `https://placehold.co/600x400/3b8250/FFFFFF?text=Pronostico+Barcelona+vs+Real+Madrid`,
              status: "completed",
            },
            {
              id: 2,
              title: "Manchester City vs Liverpool",
              description: "Premier League - Jornada 32",
              purchaseDate: "2025-03-28",
              price: 0.01,
              matchDate: "2025-04-05",
              forecastImageUrl: "https://placehold.co/600x400/3b8250/FFFFFF?text=Pronostico+City+vs+Liverpool",
              status: "completed",
            },
          ];
          setPurchases(dummyData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError("Error al cargar tus compras");
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  // Función para abrir el modal con la imagen seleccionada
  const handleShowForecast = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-green-800 sm:text-5xl">Mis Compras</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-green-700 sm:mt-4">
              Consulta los pronósticos que has adquirido
            </p>
          </div>

          {/* Grid de compras */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-600">Aún no has realizado ninguna compra.</p>
              </div>
            ) : (
              purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{purchase.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        purchase.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {purchase.status === "completed" ? "Completado" : "Pendiente"}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{purchase.description}</p>

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <svg
                        className="mr-1.5 h-5 w-5 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Partido: {new Date(purchase.matchDate).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <svg
                        className="mr-1.5 h-5 w-5 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Comprado el: {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xl font-bold text-green-700">${purchase.price.toFixed(2)}</div>
                      <button
                        onClick={() => handleShowForecast(purchase.forecastImageUrl)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Ver Pronóstico
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal para mostrar la imagen del pronóstico */}
      <ForecastModal 
        isOpen={showModal}
        imageUrl={selectedImage}
        onClose={() => setShowModal(false)}
      />
      
      <Footer />
    </>
  );
}

export default MyPurchases;
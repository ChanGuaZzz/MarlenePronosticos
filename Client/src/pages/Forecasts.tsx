import { useState, useEffect } from "react";
import PaypalButton from "../components/PaypalButton";
import Footer from "../components/Footer";

// Tipo para nuestras predicciones
type Forecast = {
  id: number;
  title: string;
  description: string;
  date: string;
  price: number;
  matchDate: string;
  accuracy: number;
};

function ForeCasts() {
  // Estado para almacenar las predicciones
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Aquí normalmente harías una llamada API
    // Por ahora, usamos datos de ejemplo
    const fetchForecasts = async () => {
      try {
        setIsLoading(true);
        // Simular llamada a API
        setTimeout(() => {
          const dummyData: Forecast[] = [
            {
              id: 1,
              title: "Barcelona vs Real Madrid",
              description: "Predicción para El Clásico",
              date: "2025-04-05",
              price: 0.01,
              matchDate: "2025-04-10",
              accuracy: 85,
            },
          ];
          setForecasts(dummyData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError("Error al cargar las predicciones");
        setIsLoading(false);
      }
    };

    fetchForecasts();
  }, []);

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
            <h1 className="text-4xl font-extrabold text-green-800 sm:text-5xl">Predicciones Disponibles</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-green-700 sm:mt-4">
              Descubre nuestras predicciones deportivas con alta probabilidad de acierto
            </p>
          </div>

          {/* Grid de predicciones */}
          <div className="flex flex-wrap justify-center ">
            {forecasts.map((forecast) => (
              <div
                key={forecast.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{forecast.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {forecast.accuracy}% precisión
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{forecast.description}</p>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
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
                    Partido: {new Date(forecast.matchDate).toLocaleDateString()}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-xl font-bold text-green-700">${forecast.price.toFixed(2)}</div>
                    <PaypalButton amount={`${forecast.price}`} invoice={"Pronostico"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForeCasts;

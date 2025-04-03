import { useState, useEffect } from "react";
import PaypalButton from "../components/PaypalButton";
import Footer from "../components/Footer";
import { useAppContext } from "../contexts/AppContext";
import { Link } from "react-router-dom";
import { CoinsIcon, GiftIcon } from "lucide-react";
import { product } from "../models/interfaces";
import axios from "axios";

// Assuming we're using the same product interface or we could create a giftCard interface

function Shop() {
  // Estado para almacenar las gift cards
  const [giftCards, setGiftCards] = useState<product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAppContext();

  useEffect(() => {
    const fetchGiftCards = async () => {
      setIsLoading(true);

      // Fetch gift cards from API

      axios
        .get("http://localhost:3000/getgiftcards", { withCredentials: true })
        .then((response) => {
          const data: product[] = response.data;
          console.log("Gift Cards:", data);
          setGiftCards(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching gift cards:", error);
          setIsLoading(false);
          const dummydata: product[] = [
            {
              _id: "gc1",
              title: "Gift Card Básica",
              description:
                "Regala 1 predicción deportiva con esta tarjeta de regalo. Ideal para introducir a alguien al mundo de las predicciones deportivas.",
              price: 9.99,
              createdAt: "2023-10-01T00:00:00Z",
              forecastImageUrl: "https://example.com/giftcard-basic.jpg",
              isGiftCard: true,
            },
            {
              _id: "gc2",
              title: "Gift Card Premium",
              description:
                "Incluye 3 predicciones deportivas de alta precisión. El regalo perfecto para los fanáticos del deporte.",
              price: 24.99,
              createdAt: "2023-10-01T00:00:00Z",
              forecastImageUrl: "https://example.com/giftcard-basic.jpg",
              isGiftCard: true,
            },
            {
              _id: "gc3",
              title: "Gift Card VIP",
              description: "Acceso a 5 predicciones deportivas premium y asesoramiento personalizado durante 1 semana.",
              price: 49.99,
              createdAt: "2023-10-01T00:00:00Z",
              forecastImageUrl: "https://example.com/giftcard-basic.jpg",
              isGiftCard: true,
            },
            {
              _id: "gc4",
              title: "Gift Card Anual",
              description:
                "El regalo definitivo: acceso a predicciones premium durante todo un año con actualizaciones semanales.",
              price: 199.99,
              createdAt: "2023-10-01T00:00:00Z",
              forecastImageUrl: "https://example.com/giftcard-basic.jpg",
              isGiftCard: true,
            },
          ];
          setGiftCards(dummydata);
        });
    };

    fetchGiftCards();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-purple-800 sm:text-5xl">Gift Cards</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-purple-700 sm:mt-4">
              Regala predicciones con nuestras tarjetas de regalo exclusivas
            </p>
          </div>

          {/* Mensaje cuando no hay gift cards */}
          {giftCards.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No hay gift cards disponibles</h3>
              <p className="text-gray-600">Vuelve más tarde para consultar nuevas opciones</p>
            </div>
          ) : (
            /* Grid de gift cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {giftCards.map((card) => (
                <div
                  key={card._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
                >
                  <img src={card.forecastImageUrl} className="h-48 w-full  flex justify-center items-center"/>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-600 mb-4">{card.description}</p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xl font-bold text-purple-700">${card.price.toFixed(2)}</div>

                      {session ? (
                        <PaypalButton amount={`${card.price}`} invoice={"GiftCard"} itemId={card._id} />
                      ) : (
                        <Link
                          to={"/login"}
                          className="bg-amber-300 flex justify-center items-center px-4 text-[12px] text-center w-[150px] font-[10px] py-0.5 cursor-pointer transition-all hover:scale-103 hover:bg-[#ffc439] rounded-full"
                        >
                          <CoinsIcon className="mr-1 animate-pulse" />
                          Comprar
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Shop;

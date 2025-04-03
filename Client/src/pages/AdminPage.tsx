import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { product } from "../models/interfaces";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

interface FormDataType {
  title: string;
  description: string;
  price: string;
  matchDate: string;
  forecastImageUrl: string;
  accuracy: string;
  isGiftCard: boolean;
  giftCardCode: string;
}

interface MessageType {
  text: string;
  type: string;
}

function AdminPage() {
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    price: "",
    matchDate: "",
    forecastImageUrl: "",
    accuracy: "",
    isGiftCard: false,
    giftCardCode: "",
  });
  const [message, setMessage] = useState<MessageType>({ text: "", type: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<product[]>([]);
  const [giftCards, setGiftCards] = useState<product[]>([]);
  const {session}=useAppContext();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    axios
      .get(`${import.meta.env.VITE_URL_SERVER}/getallproducts`)
      .then((response) => {
        console.log("Response from server:", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .get(`${import.meta.env.VITE_URL_SERVER}/getallgiftcards`)
      .then((response) => {
        console.log("Response from server:", response.data);
        setGiftCards(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    // Prepare data based on product type
    const productData: Partial<FormDataType> = { ...formData };

    // If not a gift card, remove gift card specific fields
    if (!productData.isGiftCard) {
      productData.giftCardCode = undefined;
    } else {
      // If a gift card, remove forecast specific fields
      productData.matchDate = undefined;
      productData.accuracy = undefined;
    }
    axios
      .post(`${import.meta.env.VITE_URL_SERVER}/createproduct`, productData)
      .then(() => {
        setMessage({ text: "Producto creado exitosamente", type: "success" });
        setLoading(false);
        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          matchDate: "",
          forecastImageUrl: "",
          accuracy: "",
          isGiftCard: false,
          giftCardCode: "",
        });
      })
      .catch((error) => {
        console.error("Error creating product:", error);
        setMessage({ text: "Error al crear el producto", type: "error" });
        setLoading(false);
      });
  };

  const handleToggleDisabled = (productId: string) => {
    setLoading(true);
    axios.post(`${import.meta.env.VITE_URL_SERVER}/toggleproduct/`,{productId},{withCredentials: true})
      .then(() => {
        setMessage({ text: "Producto actualizado exitosamente", type: "success" });
        setLoading(false);
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        setMessage({ text: "Error al actualizar el producto", type: "error" });
        setLoading(false);
      });
  };

  if(!session?.username)  return navigate("/login");

  return (
    <div className=" bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">Panel de Administrador</h1>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isGiftCard"
              name="isGiftCard"
              checked={formData.isGiftCard}
              onChange={handleChange}
              className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="isGiftCard" className="ml-2 text-lg font-medium">
              Es una Tarjeta de Regalo
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {formData.isGiftCard ? (
            <div>
              <label htmlFor="giftCardCode" className="block text-sm font-medium text-gray-700 mb-1">
                Código de la Tarjeta de Regalo
              </label>
              <input
                type="text"
                id="giftCardCode"
                name="giftCardCode"
                value={formData.giftCardCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="matchDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha del Partido
                  </label>
                  <input
                    type="datetime-local"
                    id="matchDate"
                    name="matchDate"
                    value={formData.matchDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="accuracy" className="block text-sm font-medium text-gray-700 mb-1">
                    Precisión (%)
                  </label>
                  <input
                    type="number"
                    id="accuracy"
                    name="accuracy"
                    value={formData.accuracy}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <label htmlFor="forecastImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL de la Imagen del Pronóstico
            </label>
            <input
              type="url"
              id="forecastImageUrl"
              name="forecastImageUrl"
              value={formData.forecastImageUrl}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition duration-200 disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
      <div className="max-w-4xl my-10 mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Administrar Productos</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Pronósticos</h3>
          {products.length === 0 ? (
            <p className="text-gray-500 italic">No hay pronósticos disponibles</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left border-b">Título</th>
                    <th className="py-3 px-4 text-left border-b">Precio</th>
                    <th className="py-3 px-4 text-left border-b">Fecha del Partido</th>
                    <th className="py-3 px-4 text-left border-b">Precisión</th>
                    <th className="py-3 px-4 text-left border-b">Estado</th>
                    <th className="py-3 px-4 text-left border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(product => !product.isGiftCard).map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{product.title}</td>
                      <td className="py-3 px-4 border-b">${product.price}</td>
                      <td className="py-3 px-4 border-b">
                        {product.matchDate&&new Date(product.matchDate).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 border-b">{product.accuracy}%</td>
                      <td className="py-3 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-sm ${!product.isActive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {!product.isActive ? 'Desactivado' : 'Activo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b">
                        <button
                          onClick={() => handleToggleDisabled(product._id)}
                          className={`px-3 py-1 rounded text-white ${!product.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          {!product.isActive ? 'Activar' : 'Desactivar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Tarjetas de Regalo</h3>
          {giftCards.length === 0 ? (
            <p className="text-gray-500 italic">No hay tarjetas de regalo disponibles</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left border-b">Título</th>
                    <th className="py-3 px-4 text-left border-b">Precio</th>
                    <th className="py-3 px-4 text-left border-b">Código</th>
                    <th className="py-3 px-4 text-left border-b">Estado</th>
                    <th className="py-3 px-4 text-left border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {giftCards.map((giftCard) => (
                    <tr key={giftCard._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{giftCard.title}</td>
                      <td className="py-3 px-4 border-b">${giftCard.price}</td>
                      <td className="py-3 px-4 border-b">{giftCard.giftCardCode}</td>
                      <td className="py-3 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-sm ${!giftCard.isActive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {!giftCard.isActive ? 'Desactivado' : 'Activo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b">
                        <button
                          onClick={() => handleToggleDisabled(giftCard._id)}
                          className={`px-3 py-1 rounded text-white ${!giftCard.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          {!giftCard.isActive ? 'Activar' : 'Desactivar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

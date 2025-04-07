import { useState, FormEvent, ChangeEvent, useEffect} from "react";
import axios from "axios";
import { MessageType, product } from "../models/interfaces";
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



function AdminPage() {
  const { session } = useAppContext();
  const navigate = useNavigate();
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
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Redirección para usuarios no admin
  useEffect(() => {
    if (session) {
      if (!session.isAdmin) {
        navigate("/"); // Redirecciona a la página principal
      } else {
        setIsAdmin(true);
      }
    }
  }, [session, navigate]);

  // Obtener datos solo si el usuario es admin
  useEffect(() => {
    if (!isAdmin) return;

    fetchAllData();
  }, [isAdmin]);

  // Log de formData
  useEffect(() => {
    console.log("formData:", formData);
  }, [formData]);

  const fetchAllData = async () => {
    try {
      const productsResponse = await axios.get(`${import.meta.env.VITE_URL_SERVER}/getallproducts`);
      console.log("Products response:", productsResponse.data);
      setProducts(productsResponse.data);

      const giftCardsResponse = await axios.get(`${import.meta.env.VITE_URL_SERVER}/getallgiftcards`);
      console.log("Gift cards response:", giftCardsResponse.data);
      setGiftCards(giftCardsResponse.data);

      const purchasesResponse = await axios.get(`${import.meta.env.VITE_URL_SERVER}/getallpurchases`, { withCredentials: true });
      console.log("Purchases response:", purchasesResponse.data);
      setPurchases(purchasesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsResponse = await axios.get(`${import.meta.env.VITE_URL_SERVER}/getallproducts`);
      setProducts(productsResponse.data);

      const giftCardsResponse = await axios.get(`${import.meta.env.VITE_URL_SERVER}/getallgiftcards`);
      setGiftCards(giftCardsResponse.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    setFormData({...formData, forecastImageUrl: ""});
  }, [formData.isGiftCard]);

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
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error creating product:", error);
        setMessage({ text: "Error al crear el producto", type: "error" });
        setLoading(false);
      })
      .finally(() => {
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      });
  };

  const handleToggleDisabled = (productId: string) => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_URL_SERVER}/toggleproduct/`, { productId }, { withCredentials: true })
      .then(() => {
        setMessage({ text: "Producto actualizado exitosamente", type: "success" });
        setLoading(false);
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        setMessage({ text: "Error al actualizar el producto", type: "error" });
        setLoading(false);
      })
      .finally(() => {
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      });
  };

  const handleDelete = (productId: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.");
    if (!confirmDelete) return;

    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_URL_SERVER}/deleteproduct`, { productId }, { withCredentials: true })
      .then(() => {
        setMessage({ text: "Producto eliminado exitosamente", type: "success" });
        setLoading(false);
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        setMessage({ text: "Error al eliminar el producto", type: "error" });
        setLoading(false);
      });
  };

  // Si el usuario no es admin, muestra página en blanco
  if (!isAdmin) {
    return null;
  }

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
          {formData.isGiftCard ? (
            <div>
              <label htmlFor="forecastImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL de la Imagen miniatura
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
          ) : (
            <>
              {
                //Si no es una tarjeta de regalo, se muestra un elemento imagepicker para subir la imagen del pronóstico
                <>
                  <div>
                    <label htmlFor="forecastImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Imagen del Pronóstico
                    </label>
                    <input
                      type="file"
                      id="forecastImageUrl"
                      name="forecastImageUrl"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if(!file){
                          setFormData({
                            ...formData,
                            forecastImageUrl: "", // Limpiar la URL de la imagen en el formData
                          });
                          return;
                        }
                        if (file) {
                          // Comprobar tamaño del archivo (limitar a 1MB por ejemplo)
                          if (file.size > 1024 * 1024) {
                            setMessage({
                              text: "La imagen es demasiado grande. El tamaño máximo es 1MB.",
                              type: "error",
                            });
                            setTimeout(() => {
                              setMessage({ text: "", type: "" });
                            }, 3000);
                            console.error("La imagen es demasiado grande. El tamaño máximo es 1MB.");
                            // Limpiar el input de archivo y el valor del formData
                            e.target.value = ""; // Esto resetea el input file
                            setFormData({
                              ...formData,
                              forecastImageUrl: "", // Limpiar la URL de la imagen en el formData
                            });
                            return;
                          }

                          // Redimensionar imagen antes de convertir a base64
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const img = new Image();
                            img.onload = () => {
                              // Crear un canvas para redimensionar
                              const canvas = document.createElement("canvas");
                              // Establecer dimensiones máximas
                              const MAX_WIDTH = 800;
                              const MAX_HEIGHT = 800;
                              let width = img.width;
                              let height = img.height;

                              // Calcular las nuevas dimensiones
                              if (width > height) {
                                if (width > MAX_WIDTH) {
                                  height *= MAX_WIDTH / width;
                                  width = MAX_WIDTH;
                                }
                              } else {
                                if (height > MAX_HEIGHT) {
                                  width *= MAX_HEIGHT / height;
                                  height = MAX_HEIGHT;
                                }
                              }

                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext("2d");
                              ctx?.drawImage(img, 0, 0, width, height);

                              // Convertir canvas a base64 (ajustar calidad con el tercer parámetro)
                              const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                              setFormData({ ...formData, forecastImageUrl: dataUrl });
                            };
                            img.src = reader.result as string;
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    {/* Image Preview */}
                    
                  </div>
                  
                </>
              }
              
            </>
          )}
          {formData.forecastImageUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Vista previa:</p>
                        <img
                          src={formData.forecastImageUrl}
                          alt="Vista previa del pronóstico"
                          className="max-h-48 rounded-md border border-gray-300"
                        />
                      </div>
                    )}

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
            <>
              {/* Tabla para pantallas medianas y grandes */}
              <div className="hidden md:block overflow-x-auto">
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
                    {products
                      .filter((product) => !product.isGiftCard)
                      .map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 border-b">{product.title}</td>
                          <td className="py-3 px-4 border-b">${product.price}</td>
                          <td className="py-3 px-4 border-b">
                            {product.matchDate && new Date(product.matchDate).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 border-b">{product.accuracy}%</td>
                          <td className="py-3 px-4 border-b">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                !product.isActive ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {!product.isActive ? "Desactivado" : "Activo"}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-b">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleDisabled(product._id)}
                                className={`px-3 py-1 rounded text-white ${
                                  !product.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                                }`}
                              >
                                {!product.isActive ? "Activar" : "Desactivar"}
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="px-3 py-1 rounded text-white bg-gray-600 hover:bg-gray-700"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de tarjetas para móviles */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {products
                  .filter((product) => !product.isGiftCard)
                  .map((product) => (
                    <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="font-semibold text-lg mb-2">{product.title}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Precio:</span>
                          <span className="font-medium">${product.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fecha:</span>
                          <span className="font-medium">{product.matchDate && new Date(product.matchDate).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Precisión:</span>
                          <span className="font-medium">{product.accuracy}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Estado:</span>
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              !product.isActive ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {!product.isActive ? "Desactivado" : "Activo"}
                          </span>
                        </div>
                        <div className="pt-2 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleToggleDisabled(product._id)}
                            className={`py-2 rounded text-white text-center ${
                              !product.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {!product.isActive ? "Activar" : "Desactivar"}
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="py-2 rounded text-white text-center bg-gray-600 hover:bg-gray-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Tarjetas de Regalo</h3>
          {giftCards.length === 0 ? (
            <p className="text-gray-500 italic">No hay tarjetas de regalo disponibles</p>
          ) : (
            <>
              {/* Tabla para pantallas medianas y grandes */}
              <div className="hidden md:block overflow-x-auto">
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
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              !giftCard.isActive ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {!giftCard.isActive ? "Desactivado" : "Activo"}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleDisabled(giftCard._id)}
                              className={`px-3 py-1 rounded text-white ${
                                !giftCard.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                              }`}
                            >
                              {!giftCard.isActive ? "Activar" : "Desactivar"}
                            </button>
                            <button
                              onClick={() => handleDelete(giftCard._id)}
                              className="px-3 py-1 rounded text-white bg-gray-600 hover:bg-gray-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista de tarjetas para móviles */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {giftCards.map((giftCard) => (
                  <div key={giftCard._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-lg mb-2">{giftCard.title}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio:</span>
                        <span className="font-medium">${giftCard.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Código:</span>
                        <span className="font-medium break-all">{giftCard.giftCardCode}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Estado:</span>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            !giftCard.isActive ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {!giftCard.isActive ? "Desactivado" : "Activo"}
                        </span>
                      </div>
                      <div className="pt-2 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleToggleDisabled(giftCard._id)}
                          className={`py-2 rounded text-white text-center ${
                            !giftCard.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {!giftCard.isActive ? "Activar" : "Desactivar"}
                        </button>
                        <button
                          onClick={() => handleDelete(giftCard._id)}
                          className="py-2 rounded text-white text-center bg-gray-600 hover:bg-gray-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl my-10 mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Historial de Compras</h2>

        {purchases.length === 0 ? (
          <p className="text-gray-500 italic">No hay compras registradas</p>
        ) : (
          <>
            {/* Tabla para pantallas medianas y grandes */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left border-b">Orden ID</th>
                    <th className="py-3 px-4 text-left border-b">Cliente</th>
                    <th className="py-3 px-4 text-left border-b">Pagador</th>
                    <th className="py-3 px-4 text-left border-b">Producto</th>
                    <th className="py-3 px-4 text-left border-b">Valor</th>
                    <th className="py-3 px-4 text-left border-b">Fecha</th>
                    <th className="py-3 px-4 text-left border-b">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase._id} className="hover:bg-gray-50">
                      <td className="py-3 px-2 border-b font-medium">{purchase.orderId}</td>
                      <td className="py-3 px-2 border-b">{purchase.userId?.username || "Usuario no disponible"}</td>
                      <td className="py-3 text-[#0038ba]  font-bold border-b">
                        {purchase.payerFullName || "Pagador no disponible"}
                      </td>
                      <td className="py-3 px-4 border-b">{purchase.productId?.title || "Producto no disponible"}</td>
                      <td className="py-3 px-4 border-b">${purchase.value || "0.00"}</td>
                      <td className="py-3 px-4 border-b">{new Date(purchase.purchaseDate).toLocaleString()}</td>
                      <td className="py-3 px-4 border-b">
                        <span className="px-1 py-1 rounded text-sm bg-green-100 text-green-800">{purchase.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista de tarjetas para móviles */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {purchases.map((purchase) => (
                <div key={purchase._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Orden:</span>
                    <span className="font-medium text-sm">{purchase.orderId}</span>
                  </div>

                  <div className="space-y-2 text-sm mt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cliente:</span>
                      <span className="font-medium">{purchase.userId?.username || "Usuario no disponible"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Pagador:</span>
                      <span className="font-medium">{purchase.payerFullName || "Pagador no disponible"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Producto:</span>
                      <span className="font-medium">{purchase.productId?.title || "Producto no disponible"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-medium">${purchase.productId?.price || "0.00"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{new Date(purchase.purchaseDate).toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estado:</span>
                      <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">{purchase.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;

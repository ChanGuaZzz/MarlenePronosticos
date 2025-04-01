import { useState } from "react";
import Footer from "../components/Footer";
import { Coins } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const { Texts } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form Data:", formData);
    if (!isLogin) {
      axios.post("http://localhost:3000/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      }, {withCredentials: true}).then((response) => {
        console.log("Registration successful:", response.data);

      }).catch((error) => {
        console.error("Error during registration:", error);
      });
    }else{
      axios.post("http://localhost:3000/login", {
        username: formData.username,
        password: formData.password,
      }, {withCredentials: true}).then((response) => {
        console.log("Login successful:", response.data);
      }).catch((error) => {
        console.error("Error during login:", error);
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br to-[#007332] from-[#00a73e] flex items-center justify-center p-4">
        <Link to={"/"} className="fixed backdrop-blur-lg rounded-full  flex space-x-2 top-0 left-0 px-2 m-10 z-500">
          <Coins color="yellow" size={30} className="iconofoto" />
          <h1 className="text-xl font-bold text-white">{Texts.hero.title}</h1>
        </Link>
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800">{isLogin ? "Bienvenido de nuevo" : "Crear cuenta"}</h1>
            <p className="text-gray-500 mt-2">
              {isLogin ? "Accede a tu cuenta para continuar" : "Regístrate para empezar a usar nuestros servicios"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button
              className={`py-2 px-4 w-1/2 text-center font-medium ${
                isLogin ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-green-600"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Iniciar Sesión
            </button>
            <button
              className={`py-2 px-4 w-1/2 text-center font-medium ${
                !isLogin ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-green-600"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required={!isLogin}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-600">
                    Recordarme
                  </label>
                </div>
                <a href="#" className="text-green-600 hover:text-green-800">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isLogin ? "Iniciar Sesión" : "Registrarse"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? (
              <p>
                ¿No tienes una cuenta?{" "}
                <button onClick={() => setIsLogin(false)} className="text-green-600 hover:text-green-800 font-medium">
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tienes una cuenta?{" "}
                <button onClick={() => setIsLogin(true)} className="text-green-600 hover:text-green-800 font-medium">
                  Inicia sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;

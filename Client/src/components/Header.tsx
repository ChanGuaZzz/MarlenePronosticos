import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Coins } from "lucide-react";

// Definir el tipo para los elementos de navegación
interface NavItem {
  path: string;
  label: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { Texts, handleLogout, session } = useAppContext();

  // Estado inicial con tipo explícito
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  // Actualizar navItems cuando Texts cambie
  useEffect(() => {
    const initialNavItems: NavItem[] = [
      { path: "/", label: "Home" },
      { path: "/pronosticos", label: Texts.Forecast },
      { path: "/profile", label: Texts.profile },
      { path: "/mis-compras", label: Texts.purchases },
      { path: "/shop", label: Texts.shop },
    ];
    setNavItems(initialNavItems);
  }, [Texts]);

  // Actualizar navItems si el usuario es administrador
  useEffect(() => {
    if (session?.isAdmin) {
      setNavItems([{ path: "/", label: "Home" },
        { path: "/pronosticos", label: Texts.Forecast },
        { path: "/profile", label: Texts.profile },
        { path: "/administratorPage", label: Texts.admin },
        { path: "/shop", label: Texts.shop }]);
    }else{
      setNavItems([{ path: "/", label: "Home" },
        { path: "/pronosticos", label: Texts.Forecast },
        { path: "/profile", label: Texts.profile },
        { path: "/mis-compras", label: Texts.purchases },
        { path: "/shop", label: Texts.shop }])
    }
  }, [session, Texts]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (location.pathname === "/login") {
    return null; // No renderizar el header en la página de login
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-green-600 via-green-500 to-green-500 text-white shadow-md z-500">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="logo">
            <Link to="/" className="text-xl flex font-bold text-white no-underline tracking-wide">
              <Coins color="yellow" className="mx-1" />
              {Texts.hero.title}
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-white font-medium relative pb-1 ${
                      isActive(item.path)
                        ? 'text-green-200 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-green-200'
                        : "hover:text-green-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="auth-buttons">
            {!session ? (
              <Link
                to="/login"
                className="border-2 border-white mx-5 text-white py-2 px-6 rounded-full no-underline font-medium transition-all hover:bg-white hover:text-green-800"
              >
                Login
              </Link>
            ) : (
              <Link
                to="/login"
                className={`border-2 border-red-100 mx-5 text-white py-2 px-6 rounded-full no-underline font-medium hover:bg-[#d84a11] transition-colors `}
                onClick={handleLogout}
              >
                LogOut
              </Link>
            )}
          </div>

          {/* Botón para el menú móvil */}
          <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menú móvil (visibilidad basada en el estado) */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} transition-all duration-300 ease-in-out`}>
          <ul className="px-4 pt-2 pb-4 space-y-2 bg-gradient-to-r from-green-900 via-green-800 to-green-700">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block py-2 px-3 rounded ${
                    isActive(item.path) ? "bg-green-800 text-green-200" : "text-white hover:bg-green-800 hover:text-green-200"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <div style={{ paddingTop: "60px" }}></div>
    </>
  );
};

export default Header;
import { Link } from "react-router-dom";

interface ModalToLockProps {
    message: string;
}

function ModalToLock({ message }: ModalToLockProps) {
  return (
    <div className="absolute inset-0 backdrop-blur-sm flex justify-center items-center bg-black/60">
    <div className="bg-black/5 backdrop-blur-xs p-8 rounded-xl shadow-2xl border border-green-200/30 max-w-md w-full mx-4">
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white">Área privada</h2>
        <p className="text-green-100">Inicia sesión para {message}</p>
        <Link 
          to={"/login"} 
          className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Iniciar sesión
        </Link>
        <p className="text-green-200/70 text-sm">¿No tienes una cuenta? <Link to="/login" className="text-green-300 hover:text-white underline">Regístrate aquí</Link></p>
      </div>
    </div>
  </div>
  );
}
export default ModalToLock; 
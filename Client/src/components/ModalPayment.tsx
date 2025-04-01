import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext.tsx";
import { Link } from "react-router-dom";

const ModalPayment = () => {
  const [visible, setVisible] = useState(false);

  const { modalPaymentOpen, setModalPaymentOpen, IsSuccess } = useAppContext();
  const isOpen = modalPaymentOpen;
  const status = IsSuccess;
  const onClose = (e:any) => {
    !status&& e?.preventDefault();
    
    setModalPaymentOpen(false);
    setVisible(false);
  };
  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  // Add this new effect to handle body overflow
  useEffect(() => {
    if (visible) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    // Cleanup function to ensure we remove the class when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex justify-center items-center z-10000">
      <div
        className={`relative bg-white rounded-lg shadow-lg w-[400px] max-w-[90%] p-8 text-center
        ${status ? "border-t-4 border-green-500" : "border-t-4 border-red-500"}`}
      >
        <button
          className="absolute top-2 right-2 bg-transparent border-none text-2xl text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col items-center">
          {status ? (
            <>
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4">
                ✓
              </div>
              <h2 className="text-xl font-semibold my-2 text-gray-800">¡Pago Exitoso!</h2>
              <p className="text-gray-600 mb-3">Tu pago ha sido procesado correctamente.</p>
            </>
          ) : (
            <>
              <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4">✗</div>
              <h2 className="text-xl font-semibold my-2 text-gray-800">Error en el Pago</h2>
              <p className="text-gray-600 mb-3">Ha ocurrido un error al procesar tu pago. Por favor intenta nuevamente</p>
            </>
          )}

          <Link
            to={"/mis-compras"}
            className="mt-6 py-2 px-6 bg-blue-600 text-white border-0 rounded text-base cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={ (e)=>{ onClose(e)}}
          >
            {status ? "ir a mis compras" : "Cerrar"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModalPayment;

import { useAppContext } from '../contexts/AppContext';
import { useState } from 'react';

function Contact() {
  const { Texts } = useAppContext();
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Subscription email:', email);
    setEmail('');
    // Here you would typically send this to your API
  };
  
  return (
    <div className="py-16 bg-green-800 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Recibe pronósticos gratuitos
          </h2>
          <p className="text-green-100 mb-8">
            Suscríbete a nuestra newsletter y recibe pronósticos gratuitos todas las semanas. Además, obtén un 15% de descuento en tu primer mes.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              Suscribirse
            </button>
          </form>
          
          <p className="text-sm text-green-200 mt-4">
            Prometemos no compartir tu información. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
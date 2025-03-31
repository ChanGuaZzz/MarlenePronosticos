import { useLanguage } from '../contexts/LanguageContext';

function Pricing() {
  const { Texts } = useLanguage();
  
  const plans = [
    {
      name: "Principiante",
      price: "19.99",
      interval: "mensual",
      features: [
        "5 pronósticos semanales",
        "Acceso a estadísticas básicas",
        "Soporte por email"
      ],
      recommended: false,
      buttonText: "Empezar ahora"
    },
    {
      name: "Profesional",
      price: "49.99",
      interval: "mensual",
      features: [
        "15 pronósticos semanales",
        "Análisis completo de partidos",
        "Alertas en tiempo real",
        "Soporte prioritario 24/7"
      ],
      recommended: true,
      buttonText: "Obtener el mejor valor"
    },
    {
      name: "VIP",
      price: "99.99",
      interval: "mensual",
      features: [
        "Pronósticos ilimitados",
        "Análisis exclusivos",
        "Asesoría personalizada",
        "Acceso a grupo privado",
        "Garantía de devolución"
      ],
      recommended: false,
      buttonText: "Unirse a VIP"
    }
  ];

  return (
    <div className="py-16 bg-green-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-3">
          Planes y precios
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades y comienza a recibir pronósticos de alta precisión hoy mismo.
        </p>
        
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 ${
                plan.recommended ? 'border-4 border-green-500 relative' : ''
              }`}
            >
              {plan.recommended && (
                <div className="bg-green-500 text-white py-1 px-4 absolute right-0 top-0 rounded-bl-lg font-semibold">
                  Recomendado
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-green-700">${plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
                <ul className="mb-8 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.recommended 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-green-800'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
import { useLanguage } from '../contexts/LanguageContext';

function Features() {
  const { Texts } = useLanguage();
  

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
        {Texts.features.title}
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8">
          {Texts.features.items.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white w-[400px] h-[200px] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-green-500"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import LandingPhoto from '../assets/landingphoto.png'; // Assuming you have a landing image

function Hero() {
  const { Texts } = useAppContext();

  
  
  return (
    <div className="relative bg-gradient-to-br from-green-700 to-green-900 text-white">
      <div className="container mx-auto px-6 py-16 md:py-24 md:flex md:items-center">
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 ">{Texts.hero.title}</h1>
          <p className="text-xl md:text-2xl mb-8">{Texts.hero.subtitle}</p>
          <div className="flex flex-col md:flex-row my-5 space-y-4 md:space-y-0 md:space-x-4 justify-center md:justify-start">
            <Link to={"/login"} className="bg-white text-green-800 hover:bg-green-100 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all">
            {Texts.hero.ctaPrimary}
            </Link>
            <Link to={"/pronosticos"} className="bg-transparent border-2 border-white hover:bg-white hover:text-green-800 px-6 py-3 rounded-lg font-semibold transition-all">
            {Texts.hero.ctaSecondary}
            </Link>
          </div>
        </div>
        <div className=" md:w-1/2 flex justify-center items-center">
          <img 
            src={LandingPhoto}
            alt="Sports prediction" 
            className="landing w-[80%] max-w-[400px] hidden md:block rounded-lg shadow-xl mt-8 md:mt-0"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400/3b8250/FFFFFF?text=Pronósticos+Deportivos";
            }}
          />
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-16 bg-white rounded-t-3xl"></div>
    </div>
  );
}

export default Hero;
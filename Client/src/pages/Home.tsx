import { useLanguage } from '../contexts/LanguageContext';
import Hero from '../components/Hero.tsx';
import Features from '../components/Features.tsx';
import Pricing from '../components/Pricing.tsx';
import Testimonials from '../components/Testimonials.tsx';
import Contact from '../components/Contact.tsx';
import Footer from '../components/Footer.tsx';

function Home() {
   const { Texts } = useLanguage();
   
   return (
      <div className="min-h-screen bg-green-50">
         <Hero />
         <Features />
         <Testimonials />
         <Footer />
      </div>
   );
}

export default Home;
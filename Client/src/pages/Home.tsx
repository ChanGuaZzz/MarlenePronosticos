import Hero from '../components/Hero.tsx';
import Features from '../components/Features.tsx';
import Testimonials from '../components/Testimonials.tsx';
import Footer from '../components/Footer.tsx';

function Home() {
   
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
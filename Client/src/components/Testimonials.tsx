import { useAppContext } from "../contexts/AppContext";

function Testimonials() {
  const { Texts } = useAppContext();

 

  return (
    <div className="py-16 bg-white">
      <div className="w-full flex justify-center items-center mb-8">
        <div className="bg-black/10 w-[90%] h-[2px] rounded-b-full"></div>
      </div>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">{Texts.testimonials.title} </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {Texts.testimonials.items.map((testimonial, index) => (
            <div key={index} className="showscroll bg-green-50 p-8 rounded-xl shadow-md">
              <svg className="w-10 h-10 text-green-400 mb-4" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10,8H6a2,2,0,0,0-2,2v4a2,2,0,0,0,2,2h4v2a4,4,0,0,1-4,4H6a2,2,0,0,0,0,4h.2A8,8,0,0,0,14,18V10A2,2,0,0,0,12,8Z" />
                <path d="M26,8H22a2,2,0,0,0-2,2v4a2,2,0,0,0,2,2h4v2a4,4,0,0,1-4,4H22a2,2,0,0,0,0,4h.2A8,8,0,0,0,30,18V10A2,2,0,0,0,28,8Z" />
              </svg>
              <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
              <div>
                <p className="font-bold text-green-700">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;

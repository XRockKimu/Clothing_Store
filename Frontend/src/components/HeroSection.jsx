import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 3, spacing: 10 },
      slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
    },
    [
      // Auto-play plugin
      (slider) => {
        let timeout;
        let clearNextTimeout = () => clearTimeout(timeout);
        let nextTimeout = () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            slider.next();
          }, 3000);
        };
        slider.on("created", nextTimeout);
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/products?limit=5`)
      .then((res) => res.json())
      .then((data) => {
        const enhancedAds = data.map((product, index) => ({
          ...product,
          discount: index % 2 === 0 ? "50% OFF" : "20% OFF",
          sale_price: index % 2 === 0 ? "¥20,000 JPY" : "¥15,000 JPY",
          sale_text: index === 0 ? "FIRST ORDER" : index === 1 ? "SUMMER SALE" : "PICK UP RECOMMENDED",
          sale_start: "7.20(Sun)",
          sale_end: "7.27(Sun) JST",
          bg_color: index === 0 ? "bg-teal-100" : index === 1 ? "bg-green-100" : "bg-teal-200",
        }));
        setAds(enhancedAds);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load promotions.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-24 py-12 bg-gray-50 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-5xl mx-auto">
        {error ? (
          <p className="text-center text-gray-500 text-sm font-light">
            {error}
          </p>
        ) : isLoading ? (
          <p className="text-center text-gray-500 text-sm font-light">
            Loading...
          </p>
        ) : ads.length === 0 ? (
          <p className="text-center text-gray-500 text-sm font-light">
            No promotions available.
          </p>
        ) : (
          <>
            <div ref={sliderRef} className="keen-slider rounded-sm overflow-hidden">
              {ads.map((product) => (
                <Link
                  to={`/product/${product.product_id}`}
                  key={product.product_id}
                  className="keen-slider__slide relative border border-black border-opacity-10"
                >
                  <div className={`w-full h-48 sm:h-64 md:h-80 ${product.bg_color} overflow-hidden`}>
                    <img
                      src={product.image_url || "https://via.placeholder.com/1200x400"}
                      alt={product.product_name}
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                      <div>
                        <p className="text-sm font-light">REGISTERED MEMBER ONLY</p>
                        <h3 className="text-2xl font-light mt-1">{product.sale_text}</h3>
                        {product.discount && (
                          <p className="text-xl font-light mt-1 bg-yellow-300 text-gray-800 inline-block px-2 py-1 rounded">
                            {product.discount}
                          </p>
                        )}
                        {product.sale_price && (
                          <p className="text-lg font-light mt-1">{product.sale_price}</p>
                        )}
                      </div>
                      <div className="text-xs font-light">
                        {product.sale_start} ~ {product.sale_end}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {ads.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === idx ? "bg-gray-800" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
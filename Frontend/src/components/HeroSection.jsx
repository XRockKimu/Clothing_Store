import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1, // Default for mobile
      spacing: 10,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 10 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 10 },
      },
    },
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
    created: () => {
      console.log("Slider created");
    },
  }, [
    // Auto-play plugin
    (slider) => {
      let timeout;
      let mouseOver = false;
      const clearNextTimeout = () => clearTimeout(timeout);
      const nextTimeout = () => {
        clearTimeout(timeout);
        if (!mouseOver) {
          timeout = setTimeout(() => {
            slider.next();
          }, 3000);
        }
      };
      slider.on("created", nextTimeout);
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
      slider.on("mouseOver", () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.on("mouseOut", () => {
        mouseOver = false;
        nextTimeout();
      });
    },
  ]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        console.log("API Data:", data); // Debug
        // Slice to 5 products for compatibility, assuming no limit query support
        const slicedData = data.slice(0, 5);
        const enhancedAds = slicedData.map((product, index) => ({
          ...product,
          discount: index % 2 === 0 ? "50% OFF" : "20% OFF",
          sale_text: index === 0 ? "FIRST ORDER" : index === 1 ? "SUMMER SALE" : "PICK UP RECOMMENDED",
          sale_start: "7.20(Sun)",
          sale_end: "7.27(Sun) JST",
          bg_color: index === 0 ? "bg-teal-100" : index === 1 ? "bg-green-100" : "bg-teal-200",
        }));
        setAds(enhancedAds);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load promotions. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Memoized ads to prevent unnecessary re-renders
  const displayedAds = useMemo(() => ads, [ads]);

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-24 py-12 bg-gray-100 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 tracking-wide animate-fade-in">
          Featured Promotions
        </h2>
        {error ? (
          <p className="text-center text-red-600 text-lg font-medium animate-fade-in">
            {error}
          </p>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-teal-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="status"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : displayedAds.length === 0 ? (
          <p className="text-center text-gray-500 text-lg font-medium animate-fade-in">
            No promotions available.
          </p>
        ) : (
          <>
            <div
              ref={sliderRef}
              className="keen-slider rounded-2xl overflow-hidden"
              role="region"
              aria-label="Featured promotions carousel"
            >
              {displayedAds.map((product) => (
                <Link
                  to={`/product/${product.product_id}`}
                  key={product.product_id}
                  className="keen-slider__slide relative group"
                >
                  <div className={`w-full h-48 sm:h-64 md:h-80 ${product.bg_color} overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl`}>
                    <img
                      src={product.image_url || "https://via.placeholder.com/1200x400"}
                      alt={product.product_name || "Promotion image"}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                      <div>
                        <p className="text-sm font-medium">REGISTERED MEMBER ONLY</p>
                        <h3 className="text-xl md:text-2xl font-medium mt-2">{product.sale_text}</h3>
                        {product.discount && (
                          <p className="text-lg font-medium mt-2 bg-yellow-400 text-gray-900 inline-block px-3 py-1 rounded-lg">
                            {product.discount}
                          </p>
                        )}
                        {product.sale_price && (
                          <p className="text-lg font-medium mt-2">{product.sale_price}</p>
                        )}
                      </div>
                      <div className="text-xs font-medium">
                        {product.sale_start} ~ {product.sale_end}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {displayedAds.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentSlide === idx ? "bg-teal-600 scale-125" : "bg-gray-300 hover:bg-teal-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={currentSlide === idx}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function MotionCarousel({ items, options }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    
    // Initial sync
    setSelectedIndex(emblaApi.selectedScrollSnap());
    
    // Update on scroll
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const cards = Array.isArray(items) ? items : [];
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-10 px-2 sm:px-4 overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 sm:gap-6 cursor-grab active:cursor-grabbing">
          {cards.map((card, index) => (
            <motion.div
              key={card.metric || card.title || index}
              className="flex-[0_0_48%] sm:flex-[0_0_50%] md:flex-[0_0_34%] lg:flex-[0_0_30%] min-w-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <div
                className={cn(
                  "h-[230px] sm:h-[280px] rounded-3xl relative overflow-hidden transition-all duration-500 ease-out",
                  "bg-[#1e1c1b] border border-white/10 shadow-2xl",
                  selectedIndex === index ? "scale-100 ring-1 ring-white/30 opacity-100" : "scale-95 opacity-50"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                <div className="flex flex-col h-full items-center justify-center p-4 sm:p-6 text-center font-['Poppins'] text-[rgb(153,144,143)]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 sm:mb-4">
                    <span className="text-sm sm:text-xl font-bold">{card.metric || String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-sm sm:text-xl font-semibold mb-2 tracking-tight">{card.title || 'Untitled'}</h3>
                  <p className="text-xs sm:text-sm max-w-[18ch] sm:max-w-xs mx-auto leading-relaxed">
                    {card.description || 'No description yet.'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center mt-7 sm:mt-10 gap-2 sm:gap-3">
        {cards.map((_, idx) => (
          <button
            key={idx}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-500",
              selectedIndex === idx 
                ? "bg-white w-8" 
                : "bg-white/20 hover:bg-white/40"
            )}
            onClick={() => emblaApi?.scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export default function EmblaCarousel({ images }: { images: string[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true })

  return (
    <div className="embla h-[500px] w-full overflow-hidden" ref={emblaRef}>
      <div className="embla__container flex h-full">
        {images.map((src, i) => (
          <div className="embla__slide min-w-full h-full relative" key={i}>
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

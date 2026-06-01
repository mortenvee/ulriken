import { useState } from 'react'

const imageModules = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', {
  eager: true,
})
const images = Object.values(imageModules).map((m) => m.default)

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="gallery-placeholder">
        <p>📷 Legg bilder av Ulrik i src/assets/ — de dukker opp her automatisk</p>
      </div>
    )
  }

  return (
    <div className="gallery">
      <div className="gallery-main">
        <img src={images[activeIndex]} alt="Ulrik" />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              className={`gallery-thumb ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <img src={src} alt={`Ulrik ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

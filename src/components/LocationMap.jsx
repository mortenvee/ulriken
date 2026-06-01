const QUERY = encodeURIComponent('Villa Holtet')

export default function LocationMap() {
  return (
    <div className="map-section">
      <h3>📍 Villa Holtet</h3>
      <div className="map-embed">
        <iframe
          title="Kart til Villa Holtet"
          src={`https://maps.google.com/maps?q=${QUERY}&output=embed`}
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '8px' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        className="directions-link"
        href={`https://www.google.com/maps/dir/?api=1&destination=${QUERY}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Få veibeskrivelse →
      </a>
    </div>
  )
}

import { useState } from 'react'
import confetti from 'canvas-confetti'
import { supabase } from '../lib/supabase'
import Countdown from './Countdown'
import Gallery from './Gallery'
import LocationMap from './LocationMap'
import headerImg from '../assets/header/header.png'

function fireConfetti() {
  const end = Date.now() + 800
  const colors = ['#667eea', '#764ba2', '#f9a826', '#ffffff']
  ;(function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export default function RSVPForm({ onAdminClick }) {
  const [formData, setFormData] = useState({
    name: '',
    attending: 'yes',
    adults: '1',
    children: '0',
    allergies: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (!formData.name.trim()) {
        setError('Navn er påkrevd')
        setIsSubmitting(false)
        return
      }

      const { error: insertError } = await supabase
        .from('rsvp_responses')
        .insert([
          {
            name: formData.name.trim(),
            attending: formData.attending === 'yes',
            adults: parseInt(formData.adults),
            children: parseInt(formData.children),
            allergies: formData.allergies.trim(),
            created_at: new Date().toISOString(),
          },
        ])

      if (insertError) {
        setError('Kunne ikke lagre svar. Prøv igjen.')
        console.error(insertError)
      } else {
        if (formData.attending === 'yes') fireConfetti()
        setSuccessMessage('Takk for tilbakemelding!')
        setFormData({
          name: '',
          attending: 'yes',
          adults: '1',
          children: '0',
          allergies: '',
        })
        setTimeout(() => setSuccessMessage(''), 4000)
      }
    } catch (err) {
      setError('En feil oppstod. Prøv igjen.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="form-container">
      <div className="hero">
        <img
          className="hero-illustration"
          src={headerImg}
          alt="Navnefest for Ulrik"
        />
        <p className="hero-details">
          16. august • Villa Holtet • 13:00
        </p>
        <Countdown />
      </div>

      <div className="welcome">
        <p className="welcome-lead">Velkommen til navnefest!</p>
        <p>
          Vi har gleden av å invitere til navnefest for Ulrik på Villa Holtet
          lørdag 16. august kl. 13.00.
        </p>
        <p>
          Denne dagen ønsker vi å samle venner og familie for å feire Ulrik med
          god mat, kaker og hyggelig samvær. Kanskje dukker det også opp litt
          underholdning underveis.
        </p>
        <p>Vi håper dere har anledning til å komme og dele dagen med oss.</p>
        <p className="welcome-deadline">Svarfrist: 30. juni.</p>
      </div>

      <Gallery />

      <div className="info-note">
        <p>For dere som reiser til Oslo:</p>
        <p>
          Vi anbefaler{' '}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Scandic+Helsfyr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Scandic Helsfyr
          </a>
        </p>
      </div>

      <div className="form-card">
        <h2 className="card-title">Gi oss beskjed om du kommer 💌</h2>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Navn *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ditt navn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="attending">Kommer du? *</label>
            <select
              id="attending"
              name="attending"
              value={formData.attending}
              onChange={handleChange}
            >
              <option value="yes">Ja, jeg kommer</option>
              <option value="no">Nei, jeg kan ikke komme</option>
            </select>
          </div>

          {formData.attending === 'yes' && (
            <>
              <div className="form-group">
                <label htmlFor="adults">Antall voksne</label>
                <input
                  type="number"
                  id="adults"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  min="1"
                  max="10"
                />
              </div>

              <div className="form-group">
                <label htmlFor="children">Antall barn</label>
                <input
                  type="number"
                  id="children"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  min="0"
                  max="10"
                />
              </div>

              <div className="form-group">
                <label htmlFor="allergies">Allergier / diettbehov</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="F.eks. glutenfri, nøttallergi, vegetar..."
                  rows="3"
                />
              </div>
            </>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Lagrer...' : 'Send svar'}
          </button>
        </form>
      </div>

      <div className="form-card">
        <LocationMap />
      </div>

      <button className="admin-button" onClick={onAdminClick}>
        Admin
      </button>
    </div>
  )
}

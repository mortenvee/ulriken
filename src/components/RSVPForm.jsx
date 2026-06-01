import { useState } from 'react'
import { supabase } from '../lib/supabase'

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
        setSuccessMessage('Takk for tilbakemelding!')
        setFormData({
          name: '',
          attending: 'yes',
          adults: '1',
          children: '0',
          allergies: '',
        })
        setTimeout(() => setSuccessMessage(''), 3000)
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
      <div className="form-card">
        <h1>🎉 Navnefest for Ulrik Brurok Vee</h1>
        <p className="event-details">
          16. august • Villa Holtet • 13:00 - 17:00
        </p>

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

        <button className="admin-button" onClick={onAdminClick}>
          Admin
        </button>
      </div>
    </div>
  )
}

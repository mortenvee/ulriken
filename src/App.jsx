import { useState, useEffect } from 'react'
import RSVPForm from './components/RSVPForm'
import AdminView from './components/AdminView'

function App() {
  const [currentPage, setCurrentPage] = useState('form')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === 'true') {
      setCurrentPage('admin')
    }
  }, [])

  const handleAdminSuccess = () => {
    setIsAdminAuthenticated(true)
    setCurrentPage('admin')
  }

  const handleLogout = () => {
    setIsAdminAuthenticated(false)
    setCurrentPage('form')
    window.history.replaceState({}, '', '/')
  }

  return (
    <div className="app">
      {currentPage === 'form' && (
        <RSVPForm onAdminClick={() => setCurrentPage('pin-entry')} />
      )}
      {currentPage === 'pin-entry' && !isAdminAuthenticated && (
        <PinEntry
          onSuccess={handleAdminSuccess}
          onCancel={() => setCurrentPage('form')}
        />
      )}
      {currentPage === 'admin' && isAdminAuthenticated && (
        <AdminView onLogout={handleLogout} />
      )}
    </div>
  )
}

function PinEntry({ onSuccess, onCancel }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const correctPin = '523152'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pin === correctPin) {
      onSuccess()
    } else {
      setError('Feil PIN-kode')
      setPin('')
    }
  }

  return (
    <div className="pin-container">
      <div className="pin-card">
        <h2>Adminpanel</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Skriv inn PIN (6 siffer)"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value)
              setError('')
            }}
            maxLength="6"
            inputMode="numeric"
            autoFocus
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Logg inn</button>
          <button type="button" onClick={onCancel} className="cancel">
            Avbryt
          </button>
        </form>
      </div>
    </div>
  )
}

export default App

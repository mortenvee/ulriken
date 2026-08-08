import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminView({ onLogout }) {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    attending: 0,
    notAttending: 0,
    totalAdults: 0,
    totalChildren: 0,
  })

  useEffect(() => {
    fetchResponses()
    const subscription = supabase
      .channel('rsvp_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rsvp_responses' },
        () => {
          fetchResponses()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchResponses = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('rsvp_responses')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError('Kunne ikke hente svar')
        console.error(fetchError)
        return
      }

      setResponses(data || [])
      calculateStats(data || [])
    } catch (err) {
      setError('En feil oppstod')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data) => {
    const attending = data.filter((r) => r.attending)
    const totalAdults = attending.reduce((sum, r) => sum + (r.adults || 0), 0)
    const totalChildren = attending.reduce((sum, r) => sum + (r.children || 0), 0)

    setStats({
      total: data.length,
      attending: attending.length,
      notAttending: data.length - attending.length,
      totalAdults,
      totalChildren,
    })
  }

  const deleteResponse = async (id) => {
    if (!confirm('Slett denne meldingen?')) return

    try {
      const { error: deleteError } = await supabase
        .from('rsvp_responses')
        .delete()
        .eq('id', id)

      if (deleteError) {
        setError('Kunne ikke slette')
        console.error(deleteError)
      } else {
        fetchResponses()
      }
    } catch (err) {
      setError('En feil oppstod')
      console.error(err)
    }
  }

  const escapeCsv = (value) => {
    const str = String(value ?? '')
    if (/[",\n;]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const exportCsv = () => {
    const headers = [
      'Navn',
      'Status',
      'Voksne',
      'Barn',
      'Allergier',
      'Sendt inn',
    ]
    const rows = responses.map((r) => [
      r.name,
      r.attending ? 'Kommer' : 'Kommer ikke',
      r.attending ? r.adults : '',
      r.attending ? r.children : '',
      r.allergies || '',
      new Date(r.created_at).toLocaleString('no-NO'),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(';'))
      .join('\n')

    // BOM så Excel viser æøå riktig
    const blob = new Blob(['﻿' + csv], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gjesteliste-ulrik-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-card">
          <p>Laster data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <h1>📋 Admin Panel</h1>
          <div className="admin-actions">
            <button
              onClick={exportCsv}
              className="export-button"
              disabled={responses.length === 0}
            >
              Last ned CSV
            </button>
            <button onClick={onLogout} className="logout-button">
              Logg ut
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-grid">
          <div className="stat-box">
            <p className="stat-label">Totalt svar</p>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Kommer</p>
            <p className="stat-value">{stats.attending}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Kommer ikke</p>
            <p className="stat-value">{stats.notAttending}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Voksne (kommer)</p>
            <p className="stat-value">{stats.totalAdults}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Barn (kommer)</p>
            <p className="stat-value">{stats.totalChildren}</p>
          </div>
        </div>

        <div className="responses-section">
          <h2>Alle svar ({responses.length})</h2>

          {responses.length === 0 ? (
            <p className="no-data">Ingen svar ennå</p>
          ) : (
            <div className="responses-list">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className={`response-item ${
                    response.attending ? 'attending' : 'not-attending'
                  }`}
                >
                  <div className="response-content">
                    <h3>{response.name}</h3>
                    <p>
                      <strong>Status:</strong>{' '}
                      {response.attending ? '✅ Kommer' : '❌ Kommer ikke'}
                    </p>
                    {response.attending && (
                      <>
                        <p>
                          <strong>Antall:</strong> {response.adults} voksne,{' '}
                          {response.children} barn
                        </p>
                        {response.allergies && (
                          <p>
                            <strong>Allergier:</strong> {response.allergies}
                          </p>
                        )}
                      </>
                    )}
                    <p className="response-date">
                      {new Date(response.created_at).toLocaleDateString(
                        'no-NO'
                      )}{' '}
                      {new Date(response.created_at).toLocaleTimeString(
                        'no-NO'
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteResponse(response.id)}
                    className="delete-button"
                  >
                    Slett
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

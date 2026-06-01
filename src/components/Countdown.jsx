import { useState, useEffect } from 'react'

const EVENT_DATE = new Date('2026-08-16T13:00:00+02:00')

function getTimeLeft() {
  const diff = EVENT_DATE - new Date()
  if (diff <= 0) return null

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) {
    return (
      <div className="countdown">
        <p className="countdown-done">Dagen er her! 🎉</p>
      </div>
    )
  }

  return (
    <div className="countdown">
      <div className="countdown-unit">
        <span className="countdown-value">{timeLeft.days}</span>
        <span className="countdown-label">dager</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value">{timeLeft.hours}</span>
        <span className="countdown-label">timer</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value">{timeLeft.minutes}</span>
        <span className="countdown-label">min</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value">{timeLeft.seconds}</span>
        <span className="countdown-label">sek</span>
      </div>
    </div>
  )
}

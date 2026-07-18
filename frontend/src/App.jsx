import { useState } from 'react'

function App() {
  const [day, setDay] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/plan'

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Meal Planner</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          cols="50"
          placeholder="Describe your day..."
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div>
          <h2>Generated Meal Plan</h2>
          
          <h3>Meals</h3>
          <ul>
            {Object.entries(result.meals || {}).map(([key, val]) => (
              <li key={key}>
                <strong>{key}:</strong> {val}
              </li>
            ))}
          </ul>

          <h3>Grocery List</h3>
          <ul>
            {(result.grocery_list || []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <h3>Substitutions</h3>
          <ul>
            {(result.substitutions || []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <h3>Budget Logic</h3>
          <p>{result.budget_logic}</p>

          <hr />
          <h3>Raw JSON Response</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App

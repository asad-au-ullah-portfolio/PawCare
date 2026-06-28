import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState<string>("Testing connection...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = 'https://localhost:7228/healthcheck'; 

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message || "Connected successfully!");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>CORS Test</h1>
      {error ? (
        <p style={{ color: 'red' }}>❌ Error: {error}</p>
      ) : (
        <p style={{ color: 'green' }}>✅ Response: {message}</p>
      )}
    </div>
  );
}

export default App;
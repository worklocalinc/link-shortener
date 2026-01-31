export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Link Shortener</h1>
      <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>Coming soon...</p>
      <div style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }}>
        <code>https://link-shortener.sha.red</code>
      </div>
    </main>
  )
}

import React from 'react';

const URLList = ({ urls, loading }) => {
  const YOUR_API_BASE_URL = 'http://20.244.56.144/evaluation-service';
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaWRkaGlhZGl0eWEwMUBnbWFpbC5jb20iLCJleHAiOjE3NTI1NTU2NDcsImlhdCI6MTc1MjU1NDc0NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImZhMDEwZTliLTY0ZGYtNGViOS1iZGY5LWIxYTlmZjQ1Y2EzMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFkaXR5YSBzaW5naCIsInN1YiI6IjUyZjFkMjhmLTQwMDgtNDU1Yi1iYTZhLTQ0NzE2MTFhZjE2NiJ9LCJlbWFpbCI6InNpZGRoaWFkaXR5YTAxQGdtYWlsLmNvbSIsIm5hbWUiOiJhZGl0eWEgc2luZ2giLCJyb2xsTm8iOiIyMjE4MjM3IiwiYWNjZXNzQ29kZSI6IlFBaERVciIsImNsaWVudElEIjoiNTJmMWQyOGYtNDAwOC00NTViLWJhNmEtNDQ3MTYxMWFmMTY2IiwiY2xpZW50U2VjcmV0IjoidUF3Y0JrZ2VHZlFGeUtReiJ9.NQ-GJv2lXHxShaPzIyttwJQOjsj2_KFw9MbUMqYGQtU";

  const copy = (txt) => {
    navigator.clipboard.writeText(txt).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      const area = document.createElement('textarea');
      area.value = txt;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
      alert('Copied to clipboard!');
    });
  };

  const expired = (date) => new Date(date) < new Date();

  const handleClick = async (originalUrl, shortcode) => {
    try {
      await fetch(`${YOUR_API_BASE_URL}/click/${shortcode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'direct',
          location: 'India',
        }),
      });

      window.open(originalUrl, '_blank');
    } catch (error) {
      console.error('Error recording click:', error);
      window.open(originalUrl, '_blank');
    }
  };

  if (loading) return <div>Loading your URLs...</div>;

  return (
    <div>
      <h2>Your Shortened URLs</h2>
      {urls.length === 0 ? (
        <p style={{ color: '#666' }}>No URLs yet. Create your first one above!</p>
      ) : (
        <div>
          {urls.map((u, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #ddd',
                padding: 15,
                margin: '10px 0',
                borderRadius: 6,
                background: expired(u.expiry) ? '#fff3cd' : '#fff',
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <strong>Original:</strong>
                <span style={{ wordBreak: 'break-all', marginLeft: 10 }}>{u.originalUrl}</span>
              </div>

              <div style={{ marginBottom: 10 }}>
                <strong>Short URL:</strong>
                <span style={{ color: '#1976d2', marginLeft: 10 }}>{u.shortLink}</span>
                <button
                  onClick={() => copy(u.shortLink)}
                  style={{
                    marginLeft: 10,
                    padding: '4px 8px',
                    background: '#2196F3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={() => handleClick(u.originalUrl, u.shortcode)}
                  style={{
                    marginLeft: 5,
                    padding: '4px 8px',
                    background: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Open
                </button>
              </div>

              <div style={{ fontSize: 14, color: '#666' }}>
                <span>Created: {new Date(u.createdAt).toLocaleString()}</span>
                <span style={{ marginLeft: 15 }}>
                  Expires: {new Date(u.expiry).toLocaleDateString()}
                </span>
                {expired(u.expiry) && (
                  <span
                    style={{
                      color: '#d32f2f',
                      marginLeft: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    EXPIRED
                  </span>
                )}
              </div>

              {u.clickData && u.clickData.length > 0 && (
                <div style={{ marginTop: 10, fontSize: 13 }}>
                  <strong>Click Details:</strong>
                  <ul style={{ paddingLeft: 20 }}>
                    {u.clickData.map((click, idx) => (
                      <li key={idx}>
                        📅 {new Date(click.timestamp).toLocaleString()} — 🌐 {click.referrer} — 📍 {click.location}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default URLList;

import React, { useState } from 'react';

const URLForm = ({ onSubmit }) => {
  const [rows, setRows] = useState([{ url: '', time: 30, code: '' }]);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');

  const YOUR_API_BASE_URL = 'http://20.244.56.144/evaluation-service/';
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaWRkaGlhZGl0eWEwMUBnbWFpbC5jb20iLCJleHAiOjE3NTI1NTU2NDcsImlhdCI6MTc1MjU1NDc0NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImZhMDEwZTliLTY0ZGYtNGViOS1iZGY5LWIxYTlmZjQ1Y2EzMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFkaXR5YSBzaW5naCIsInN1YiI6IjUyZjFkMjhmLTQwMDgtNDU1Yi1iYTZhLTQ0NzE2MTFhZjE2NiJ9LCJlbWFpbCI6InNpZGRoaWFkaXR5YTAxQGdtYWlsLmNvbSIsIm5hbWUiOiJhZGl0eWEgc2luZ2giLCJyb2xsTm8iOiIyMjE4MjM3IiwiYWNjZXNzQ29kZSI6IlFBaERVciIsImNsaWVudElEIjoiNTJmMWQyOGYtNDAwOC00NTViLWJhNmEtNDQ3MTYxMWFmMTY2IiwiY2xpZW50U2VjcmV0IjoidUF3Y0JrZ2VHZlFGeUtReiJ9.NQ-GJv2lXHxShaPzIyttwJQOjsj2_KFw9MbUMqYGQtU";

  const genCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  };

  const handleChange = (i, field, val) => {
    const copy = [...rows];
    copy[i][field] = val;
    setRows(copy);
  };

  const addRow = () => {
    setRows([...rows, { url: '', time: 30, code: '' }]);
  };

  const removeRow = (i) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, idx) => idx !== i));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMsg('');

    const valid = rows.filter((r) => r.url.trim() !== '');
    if (!valid.length) {
      setMsg('Add at least one URL.');
      setSending(false);
      return;
    }

    try {
      const newShortLinks = await Promise.all(
        valid.map(async (r) => {
          const code = r.code || genCode();
          const payload = {
            longUrl: r.url,
            shortCode: code,
            expiryInMinutes: r.time,
          };

          const response = await fetch(`${YOUR_API_BASE_URL}shorten`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to shorten URL');
          }

          const responseData = await response.json();
          return {
            originalUrl: r.url,
            shortLink:
              responseData.shortLink ||
              `${YOUR_API_BASE_URL.replace('/evaluation-service', '')}short.ly/${responseData.shortCode}`,
            shortcode: responseData.shortCode || code,
            createdAt: new Date().toISOString(),
            expiry: new Date(new Date().setMinutes(new Date().getMinutes() + r.time)).toISOString(),
            clicks: 0,
            clickData: [],
          };
        })
      );

      setMsg('Shortened successfully!');
      setRows([{ url: '', time: 30, code: '' }]);
      onSubmit(newShortLinks);
    } catch (error) {
      setMsg(`Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
      <h2>Shorten URLs</h2>

      {msg && (
        <div
          style={{
            padding: 10,
            marginBottom: 15,
            background: msg.includes('Error') ? '#ffebee' : '#e8f5e8',
            color: msg.includes('Error') ? '#c62828' : '#2e7d32',
            borderRadius: 4,
          }}
        >
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 15, alignItems: 'center' }}>
            <input
              type="url"
              placeholder="https://example.com"
              value={r.url}
              onChange={(e) => handleChange(i, 'url', e.target.value)}
              style={{ flex: 2, padding: 8, fontSize: 14 }}
              required
            />
            <input
              type="number"
              placeholder="Mins"
              value={r.time}
              onChange={(e) => handleChange(i, 'time', parseInt(e.target.value) || 30)}
              min="1"
              style={{ flex: 1, padding: 8, fontSize: 14 }}
            />
            <input
              type="text"
              placeholder="Custom code"
              value={r.code}
              onChange={(e) => handleChange(i, 'code', e.target.value)}
              style={{ flex: 1, padding: 8, fontSize: 14 }}
            />
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(i)}
                style={{
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <div style={{ marginTop: 15 }}>
          <button
            type="button"
            onClick={addRow}
            style={{
              background: '#2196F3',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 4,
              cursor: 'pointer',
              marginRight: 10,
            }}
          >
            Add URL
          </button>
          <button
            type="submit"
            disabled={sending}
            style={{
              background: sending ? '#ccc' : '#4CAF50',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 4,
              cursor: sending ? 'not-allowed' : 'pointer',
            }}
          >
            {sending ? 'Working...' : 'Shorten'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default URLForm;

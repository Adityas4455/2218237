import React, { useEffect, useState } from 'react';

const StatsPage = () => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  const YOUR_API_BASE_URL = 'http://20.244.56.144/evaluation-service';
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaWRkaGlhZGl0eWEwMUBnbWFpbC5jb20iLCJleHAiOjE3NTI1NTU2NDcsImlhdCI6MTc1MjU1NDc0NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImZhMDEwZTliLTY0ZGYtNGViOS1iZGY5LWIxYTlmZjQ1Y2EzMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFkaXR5YSBzaW5naCIsInN1YiI6IjUyZjFkMjhmLTQwMDgtNDU1Yi1iYTZhLTQ0NzE2MTFhZjE2NiJ9LCJlbWFpbCI6InNpZGRoaWFkaXR5YTAxQGdtYWlsLmNvbSIsIm5hbWUiOiJhZGl0eWEgc2luZ2giLCJyb2xsTm8iOiIyMjE4MjM3IiwiYWNjZXNzQ29kZSI6IlFBaERVciIsImNsaWVudElEIjoiNTJmMWQyOGYtNDAwOC00NTViLWJhNmEtNDQ3MTYxMWFmMTY2IiwiY2xpZW50U2VjcmV0IjoidUF3Y0JrZ2VHZlFGeUtReiJ9.NQ-GJv2lXHxShaPzIyttwJQOjsj2_KFw9MbUMqYGQtU";

  useEffect(() => {
    const fetchStats = async () => {
      setLoad(true);
      try {
        const response = await fetch(`${YOUR_API_BASE_URL}/urls`, {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const statsData = await response.json();
        setData(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoad(false);
      }
    };

    fetchStats();
  }, []);

  if (load) return <div>Loading stats...</div>;

  return (
    <div>
      <h2>Stats</h2>
      {data.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <div>
          {data.map((item, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '12px',
                margin: '10px 0',
              }}
            >
              <h3>{item.shortLink}</h3>
              <p><b>Original:</b> {item.originalUrl}</p>
              <p><b>Clicks:</b> {item.clicks || 0}</p>
              <p><b>Expires:</b> {new Date(item.expiry).toLocaleDateString()}</p>

              {item.clickData?.length > 0 && (
                <div>
                  <h4>Click History</h4>
                  {item.clickData.map((click, j) => (
                    <div
                      key={j}
                      style={{
                        background: '#f9f9f9',
                        padding: '8px',
                        margin: '5px 0',
                        fontSize: '14px',
                      }}
                    >
                      <div>Time: {new Date(click.timestamp).toLocaleString()}</div>
                      <div>Referrer: {click.referrer || 'Direct'}</div>
                      <div>Location: {click.location || 'Unknown'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatsPage;

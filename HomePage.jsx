import React, { useEffect, useState } from 'react';
import URLForm from '../components/URLForm';
import URLList from '../components/URLList';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  const YOUR_API_BASE_URL = 'http://20.244.56.144/evaluation-service';
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYXVyYWJoYmhhbmRhcmkuMjIwMTEyOTYyQGdlaHUuYWMuLmluIiwiZXhwIjoxNzUyNTU5OTAwLCJpYXQiOjE3NTI1NTkwMDAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBwcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhMDE2MjY4Mi1jOTdjLTQ0YTMtYjFiNS1lMTYyZTRlOGQyZWYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzYXVyYWJoIGJoYW5kYXJpIiwic3ViIjoiNTFiYzNmNjgtMWY1Ni00NjVhLWIxYjUtZWZjYjVlMDUyZGY4In0sImVtYWlsIjoic2F1cmFiaGJoYW5kYXJpLjIyMDExMjk2MkBnZWh1LmFjLmluIiwibmFtZSI6InNhdXJhYmggYmhhbmRhcmkiLCJyb2xsTm8iOiIyMjYxNTE2IiwiYWNjZXNzQ29kZSI6IlFBSERVciIsImNsaWVudElEIjoiNTFiYzNmNjgtMWY1Ni00NjVhLWIxYjUtZWZjYjVlMDUyZGY4IiwiY2xpZW50U2VjcmV0IjoidGFGd1hRcXdoVGJDc3ZwZCJ9.rlh3op5ITKS_MwB0WVdWqE3achNQ0qe3p6BxqdfOpuA";

  const fetchUrlsFromAPI = async () => {
    setLoad(true);
    try {
      const response = await fetch(`${YOUR_API_BASE_URL}/urls`, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      const urls = await response.json();
      setData(urls);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchUrlsFromAPI();
  }, []);

  const addUrl = (newUrls) => {
    fetchUrlsFromAPI();
  };

  return (
    <div>
      <URLForm onSubmit={addUrl} />
      <br />
      <URLList urls={data} loading={load} />
    </div>
  );
};

export default HomePage;

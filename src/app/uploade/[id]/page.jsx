'use client';

// pages/client-data.js
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientData() {
  const [client, setClient] = useState(null);
  const [dossierId, setDossierId] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/'); // Redirect to login if no token is found
      return;
    }

    async function fetchData() {
      try {
        const response = await fetch('/api/Client/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setClient(data.client);
          setDossierId(data.dossierId);
        } else {
          setError(data.error || 'Failed to fetch client data');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Something went wrong');
      }
    }

    fetchData();
  }, [router]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  if (!client) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Client Information</h2>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>ID:</strong> {client.id}</p>
      <p><strong>Dossier ID:</strong> {dossierId}</p>
    </div>
  );
}

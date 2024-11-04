'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function ClientPage() {
  const router = useRouter();
  const { id: clientId } = useParams();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClientData() {
      try {
        const response = await fetch(`/api/Client/${clientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch client data');
        }
        const data = await response.json();
        setClientData(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (clientId) fetchClientData();
  }, [clientId]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!clientData) return <div>No client data found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Account</h1>
      <div className="text-gray-700">
        <p><strong>Firstname:</strong> {clientData.Firstname}</p>
        <p><strong>Lastname:</strong> {clientData.Lastname}</p>
        <p><strong>Email:</strong> {clientData.email}</p>
        <p><strong>Numero:</strong> {clientData.numero}</p>
        <p><strong>CIN:</strong> {clientData.CIN}</p>
        <p><strong>City:</strong> {clientData.city}</p>
        <p><strong>Address:</strong> {clientData.address}</p>
        <p><strong>Code Postal:</strong> {clientData.codePostal}</p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-4"
      >
        Logout
      </button>

      {clientData.dossiers && clientData.dossiers.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Dossiers</h2>
          {clientData.dossiers.map((dossier) => (
            <div key={dossier.id} className="mb-4 p-4 border rounded">
              <p><strong>Dossier ID:</strong> {dossier.id}</p>
              <p><strong>Contract ID:</strong> {dossier.idContra}</p>
              <p><strong>Status:</strong> {dossier.status}</p>
              {dossier.uploade && dossier.uploade.length > 0 && (
                <div>
                  <strong>Uploaded Files:</strong>
                  <ul>
                    {dossier.uploade.map((file, index) => (
                      <li key={index}>
                        <a href={file} target="_blank" rel="noopener noreferrer">{file}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4">No dossiers found.</p>
      )}
    </div>
  );
}

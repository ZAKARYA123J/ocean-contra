'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientDetails() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchClientDetails = async () => {
    try {
      const response = await fetch(`/api/Client/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch client details');
      }
      const data = await response.json();
      setClient(data);
    } catch (err) {
      console.error('Error fetching client details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setMessage(null);
    try {
      const response = await fetch(`/api/Client/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify client');
      }
      const updatedClient = await response.json();
      setClient(updatedClient);
      setMessage('Client successfully verified!');
    } catch (err) {
      console.error('Error verifying client:', err);
      setMessage(err.message);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  if (loading) {
    return <div>Loading client details...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!client) {
    return <div>No client details available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Details</h1>

      {/* Display success or error message */}
      {message && (
        <div
          className={`mb-4 ${
            message.includes('successfully') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </div>
      )}

      {/* Client Information */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Client Information</h2>
        <p><strong>Full Name:</strong> {client.register.Firstname} {client.register.Lastname}</p>
        <p><strong>Email:</strong> {client.register.email}</p>
        <p><strong>Status:</strong> {client.register.StatuClient}</p>
        <p><strong>Phone:</strong> {client.register.numero}</p>
        <p><strong>City:</strong> {client.city || 'N/A'}</p>
        <p><strong>Address:</strong> {client.address || 'N/A'}</p>
        <p><strong>ZIP Code:</strong> {client.zipCode || 'N/A'}</p>
        <p><strong>CIN:</strong> {client.CIN || 'N/A'}</p>
        <p><strong>Passport:</strong> {client.passport || 'N/A'}</p>
      </div>

      {/* Verify Client Button */}
      {client.register.StatuClient !== 'verified' && (
        <button
          onClick={handleVerify}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Verify Client
        </button>
      )}

      {/* Dossier Information */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Dossiers</h2>
        {client.register.dossiers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.register.dossiers.map((dossier) => (
              <div
                key={dossier.id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-md"
              >
                <h3 className="font-bold mb-2">Dossier ID: {dossier.id}</h3>
                <p><strong>Status:</strong> {dossier.status}</p>
                <p><strong>Contra ID:</strong> {dossier.idContra}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No dossiers available for this client.</p>
        )}
      </div>
    </div>
  );
}

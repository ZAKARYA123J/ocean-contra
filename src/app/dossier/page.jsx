'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DossierList() {
  const [dossiers, setDossiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const response = await fetch('/api/Dossier');
        if (!response.ok) {
          throw new Error('Failed to fetch dossiers');
        }
        const data = await response.json();
        setDossiers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossiers();
  }, []);

  if (isLoading) {
    return <p>Loading dossiers...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dossiers with Client and Contract Details</h1>
      {dossiers.length === 0 ? (
        <p>No dossiers found.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Dossier Status</th>
              <th className="px-4 py-2 border">Client Name</th>
              <th className="px-4 py-2 border">Client Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Contract City</th>
              <th className="px-4 py-2 border">Contract Price</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((dossier) => (
              <tr key={dossier.id} className="border-t">
                <td className="px-4 py-2 border">{dossier.status}</td>
                <td className="px-4 py-2 border">
                  {dossier.client?.Firstname} {dossier.client?.Lastname}
                </td>
                <td className="px-4 py-2 border">{dossier.client?.email}</td>
                <td className="px-4 py-2 border">{dossier.client?.numero}</td>
                <td className="px-4 py-2 border">{dossier.contra?.titleCity || 'N/A'}</td>
                <td className="px-4 py-2 border">{dossier.contra?.prix || 'N/A'} €</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => router.push(`/dossierPage/${dossier.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

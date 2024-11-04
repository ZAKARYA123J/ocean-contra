'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DossierDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [dossier, setDossier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(''); // State to track the selected status
  const [isUpdating, setIsUpdating] = useState(false); // State to track the update process

  useEffect(() => {
    if (!id) return;

    const fetchDossier = async () => {
      try {
        const response = await fetch(`/api/Dossier/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dossier details');
        }
        const data = await response.json();
        setDossier(data);
        setStatus(data.status); // Initialize the status state with the current status
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDossier();
  }, [id]);

  const handleStatusChange = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/Dossier/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update dossier status');
      }

      // Update the dossier state with the new status
      setDossier((prevDossier) => ({ ...prevDossier, status }));
      alert('Status updated successfully');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 text-xl">Loading dossier details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 text-xl">Error: {error}</p>;
  }

  if (!dossier) {
    return <p className="text-center text-gray-500 text-xl">Dossier not found.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Dossier Details</h1>
      <table className="w-full max-w-4xl text-left text-lg">
        <tbody>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50 w-1/3">Status</th>
            <td className="py-4 px-6">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="INCOMPLETED">INCOMPLETED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50">Client Name</th>
            <td className="py-4 px-6">{dossier.client?.Firstname} {dossier.client?.Lastname}</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50">Client Email</th>
            <td className="py-4 px-6">{dossier.client?.email}</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50">Phone</th>
            <td className="py-4 px-6">{dossier.client?.numero}</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50">CIN</th>
            <td className="py-4 px-6">{dossier.client?.CIN}</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50">City</th>
            <td className="py-4 px-6">{dossier.client?.city}</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50">Address</th>
            <td className="py-4 px-6">{dossier.client?.address}</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50">Contract City</th>
            <td className="py-4 px-6">{dossier.contra?.titleCity || 'N/A'}</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50">Contract Price</th>
            <td className="py-4 px-6">{dossier.contra?.prix || 'N/A'} €</td>
          </tr>
          <tr className="border-b">
            <th className="py-4 px-6 text-gray-600 font-semibold bg-gray-50">Uploads</th>
            <td className="py-4 px-6">
              {dossier.uploade && dossier.uploade.length > 0 ? dossier.uploade.join(', ') : 'No uploads available'}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center mt-10">
        <button
          onClick={handleStatusChange}
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-200 mr-4"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Status'}
        </button>
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

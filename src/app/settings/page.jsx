'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterList() {
  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRegisters = async () => {
      try {
        const response = await fetch('/api/register'); // Adjust to your GET endpoint for all registers
        if (!response.ok) {
          throw new Error('Failed to fetch registers');
        }
        const data = await response.json();
        setRegisters(data);
      } catch (error) {
        console.error('Error fetching registers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisters();
  }, []);

  const handleDetails = (id) => {
    router.push(`/clientDetails/${id}`); // Adjust this route to match your details page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (registers.length === 0) {
    return <div>No registers found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registered Clients</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Firstname</th>
            <th className="px-4 py-2 border">Lastname</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {registers.map((register) => (
            <tr key={register.id}>
              <td className="px-4 py-2 border">{register.Firstname}</td>
              <td className="px-4 py-2 border">{register.Lastname}</td>
              <td className="px-4 py-2 border">{register.email}</td>
              <td className="px-4 py-2 border">{register.StatuClient}</td>
              <td className="px-4 py-2 border text-center">
                <button
                  onClick={() => handleDetails(register.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Detail Client
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

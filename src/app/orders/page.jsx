'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function RegisterFormComponent() {
  const searchParams = useSearchParams();
  const contraId = searchParams.get('contraId'); // Get contraId from the URL if available

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [clientData, setClientData] = useState({
    Firstname: '',
    Lastname: '',
    email: '',
    password: '',
    numero: '',
    CIN: '',
    city: '',
    address: '',
    codePostal: '',
    avantage: '',
  });

  // Handle change for each input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/Client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...clientData,
          contraId: contraId ? parseInt(contraId, 10) : null, // Include contraId if present
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register client');
      }

      const data = await response.json();
      setMessage(
        contraId
          ? 'Client and dossier registered successfully!'
          : 'Client registered successfully without a dossier.'
      );
      setClientData({
        Firstname: '',
        Lastname: '',
        email: '',
        password: '',
        numero: '',
        CIN: '',
        city: '',
        address: '',
        codePostal: '',
        avantage: '',
      });
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Failed to register client.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Register for {contraId ? `Contract ID: ${contraId}` : 'Client Only'}
      </h1>

      {message && (
        <div className={`mb-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {Object.keys(clientData).map((field) => (
          <div className="mb-4" key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              id={field}
              name={field}
              value={clientData[field]}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required={field !== 'avantage'}
              disabled={isLoading}
            />
          </div>
        ))}

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register Client'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href={`/login?contraId=${contraId}`} className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

// Wrapping component with Suspense
export default function RegisterForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterFormComponent />
    </Suspense>
  );
}

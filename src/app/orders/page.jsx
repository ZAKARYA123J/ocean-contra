'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const contraId = searchParams.get('contraId'); // Get contraId from the URL if available

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const [clientData, setClientData] = useState({
    Firstname: '',
    Lastname: '',
    email: '',
    password: '',
    numero: '',
    CIN: null,
    city: null,
    address: null,
    codePostal: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value || null }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!clientData.email.includes('@')) newErrors.email = 'Invalid email address';
    if (clientData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (clientData.numero.length < 10) newErrors.numero = 'Numero must be at least 10 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

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
        CIN: null,
        city: null,
        address: null,
        codePostal: null,
      });
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Failed to register client.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">
        Register for {contraId ? `Contract ID: ${contraId}` : 'Client Only'}
      </h1>

      {message && (
        <div className={`mb-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(clientData).map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              id={field}
              name={field}
              value={clientData[field] || ''}
              onChange={handleChange}
              className={`mt-1 p-2 block w-full border border-gray-300 rounded-md ${errors[field] ? 'border-red-500' : ''}`}
              required={field !== 'avantage'}
              disabled={isLoading}
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register Client'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href={`/login?contraId=${contraId}`} className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

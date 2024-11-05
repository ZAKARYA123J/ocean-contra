'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [clientInfo, setClientInfo] = useState(null); 

  // Wrap `useSearchParams` with Suspense
  const SearchParamsComponent = () => {
    const searchParams = useSearchParams();
    const contraId = searchParams.get('contraId');
    return contraId;
  };

  const contraId = (
    <Suspense fallback={null}>
      <SearchParamsComponent />
    </Suspense>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...loginData,
          idContra: contraId ? parseInt(contraId, 10) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      setMessage('Login successful!');
      localStorage.setItem('token', data.token);

      setClientInfo({ clientId: data.client.id, dossierId: data.dossierId });

      if (data.client && data.client.id) {
        router.push(`/uploade/${data.client.id}`);
      } else {
        throw new Error("Client ID not found.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Failed to log in. Please check your email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {message && (
        <div className={`mb-4 ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}

      {clientInfo && (
        <div className="mb-4 text-gray-700">
          <p>Client ID: {clientInfo.clientId}</p>
          <p>Dossier ID: {clientInfo.dossierId}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

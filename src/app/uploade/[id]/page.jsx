'use client';

import { useState, useEffect } from 'react';

export default function ClientForm() {
  const [clientData, setClientData] = useState({
    CIN: '',
    secture: '',
    city: '',
    address: '',
    zipCode: '',
    apostyle: '',
    CINFront: null,
    CINBackground: null,
    passport: null,
    diplomat: null,
    images: null,
    addaDocument: [],
    registerId: '',
  });
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === 'addaDocument') {
      setClientData((prevData) => ({
        ...prevData,
        [name]: Array.from(files),
      }));
    } else {
      setClientData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    }
  };

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Client');
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const formData = { ...clientData };
      const fileFields = ['CINFront', 'CINBackground', 'passport', 'diplomat', 'images'];

      for (const field of fileFields) {
        if (formData[field]) {
          const file = formData[field];
          const base64 = await toBase64(file);
          formData[field] = { base64, type: file.type };
        }
      }

      if (formData.addaDocument && formData.addaDocument.length > 0) {
        formData.addaDocument = await Promise.all(
          formData.addaDocument.map(async (file) => ({
            base64: await toBase64(file),
            type: file.type,
          }))
        );
      }

      const response = await fetch('/api/Client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create client');
      const data = await response.json();

      setMessage('Client created successfully!');
      setClientData({
        CIN: '',
        secture: '',
        city: '',
        address: '',
        zipCode: '',
        apostyle: '',
        CINFront: null,
        CINBackground: null,
        passport: null,
        diplomat: null,
        images: null,
        addaDocument: [],
        registerId: '',
      });

      fetchClients(); 
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Client</h1>

      {message && (
        <div
          className={`mb-4 ${
            message.includes('successfully') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(clientData).map((field) => {
          if (['CINFront', 'CINBackground', 'passport', 'diplomat', 'images', 'addaDocument'].includes(field)) {
            return (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="file"
                  id={field}
                  name={field}
                  multiple={field === 'addaDocument'}
                  onChange={handleFileChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
            );
          }

          return (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={clientData[field]}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
          );
        })}

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8">Clients</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-5">
          {clients.map((client) => (
            <li key={client.id}>
              {client.city}, {client.address} (Register ID: {client.registerId})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

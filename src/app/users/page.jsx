'use client';

import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaBuilding, FaLanguage, FaCalendarAlt, FaMedkit, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ContraList() {
  const [contras, setContras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchContras() {
      try {
        const res = await fetch('/api/Contra');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des contrats');
        }
        const data = await res.json();
        setContras(data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
        setErrorMessage('Erreur lors du chargement des contrats.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchContras();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this contract?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/Contra/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setContras((prev) => prev.filter((contra) => contra.id !== id));
      } else {
        console.error('Failed to delete contract');
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  };

  if (isLoading) return <p>Chargement des contrats...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div className="container">
      <h1 className="title">Liste des Contrats</h1>
      <button onClick={() => router.push('/contaract')} className="add-button">
        Ajouter un Contrat
      </button>

      {contras.length === 0 ? (
        <p className="no-contracts">Aucun contrat disponible.</p>
      ) : (
        <div className="grid">
          {contras.map((contra) => (
            <div key={contra.id} className="card">
              <img src={contra.image} alt={contra.titleCity} className="card-image" />

              <div className="card-details">
                <h2 className="card-title">
                  <FaMapMarkerAlt className="icon" /> {contra.titleCity}
                </h2>
                <p className="card-text">
                  <FaBuilding className="icon" /> {contra.steps.join(' / ')}
                </p>
                <p className="card-text">
                  <FaLanguage className="icon" /> {contra.levelLangue ? `Required language ${contra.levelLangue}` : 'Language is not required'}
                </p>
                <p className="card-text">
                  <FaCalendarAlt className="icon" /> {contra.duration}
                </p>
                <p className="card-text">
                  <FaMedkit className="icon" /> {contra.avantage || 'Housing, medical care, renewable for 5 years, and citizenship assistance'}
                </p>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button onClick={() => router.push(`/updatecontra/${contra.id}`)} className="icon-button edit-button">
                    <FaEdit /> Update
                  </button>
                  <button onClick={() => handleDelete(contra.id)} className="icon-button delete-button">
                    <FaTrash /> Delete
                  </button>
                  <button onClick={() => router.push(`/orders?contraId=${contra.id}`)} className="icon-button apply-button">
                    <FaCheckCircle /> Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          text-align: center;
        }

        .title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 24px;
        }

        .add-button {
          background-color: #38a169;
          color: white;
          padding: 10px 20px;
          border-radius: 30px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-bottom: 24px;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .add-button:hover {
          background-color: #2f855a;
        }

        .grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .card {
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s;
        }

        .card:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .card-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .card-details {
          padding: 16px;
          text-align: left;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #2d3748;
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .card-text {
          color: #4a5568;
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .icon {
          color: #3182ce;
          margin-right: 8px;
        }

        .action-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
        }

        .icon-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          cursor: pointer;
          color: white;
          border: none;
        }

        .edit-button {
          background-color: #3182ce;
        }

        .edit-button:hover {
          background-color: #2b6cb0;
        }

        .delete-button {
          background-color: #e53e3e;
        }

        .delete-button:hover {
          background-color: #c53030;
        }

        .apply-button {
          background-color: #38a169;
        }

        .apply-button:hover {
          background-color: #2f855a;
        }
      `}</style>
    </div>
  );
}

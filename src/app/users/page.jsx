'use client';

import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaBuilding, FaLanguage, FaCalendarAlt, FaMedkit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ContraList() {
  const [contras, setContras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchContras() {
      try {
        const res = await fetch('http://localhost:3000/api/Contra');
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

                <button onClick={() => router.push(`/orders?contraId=${contra.id}`)} className="apply-button">
                  To Apply
                </button>
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
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

        .no-contracts {
          text-align: center;
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

        .apply-button {
          width: 100%;
          background-color: #3182ce;
          color: white;
          padding: 10px;
          border-radius: 30px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .apply-button:hover {
          background-color: #2b6cb0;
        }
      `}</style>
    </div>
  );
}


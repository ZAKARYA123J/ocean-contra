// pages/clientDetails/[id].js

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #333333;
  margin-bottom: 1rem;
`;

const ClientInfo = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const InfoItem = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin: 0.5rem 0;

  & strong {
    color: #111827;
  }
`;

const DossierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
`;

const DossierCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CardImage = styled.div`
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const IconText = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  color: #374151;

  & > span {
    margin-right: 0.5rem;
  }
`;

const ApplyButton = styled.a`
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  margin-top: 1rem;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

export default function ClientDetails() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchClientById = async () => {
        try {
          const response = await fetch(`/api/Client/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch client details');
          }
          const data = await response.json();
          setClient(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchClientById();
    }
  }, [id]);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!client) {
    return <p>Loading client details...</p>;
  }

  return (
    <Container>
      <Title>Client Details</Title>

      {/* Section des informations du client */}
      <ClientInfo>
        <InfoItem><strong>Full Name:</strong> {client.Firstname} {client.Lastname}</InfoItem>
        <InfoItem><strong>Email:</strong> {client.email}</InfoItem>
        <InfoItem><strong>City:</strong> {client.city}</InfoItem>
        <InfoItem><strong>cin:</strong> {client.CIN}</InfoItem>
        <InfoItem><strong>Phone:</strong> {client.numero}</InfoItem>
        <InfoItem><strong>Address:</strong> {client.address}</InfoItem>
        <InfoItem><strong>Code Postal:</strong> {client.codePostal}</InfoItem>
      </ClientInfo>

      {/* Grille des dossiers */}
      <DossierGrid>
        {client.dossiers.length > 0 ? (
          client.dossiers.map((dossier, index) => (
            <DossierCard key={index}>
              {/* Placeholder pour l'image de Dossier */}
              <CardImage src="https://via.placeholder.com/300x200" alt="Dossier Image" />

              <CardContent>
                <h3> {dossier.location || "Unknown Location"}</h3>
                <IconText>
                  
                  <p>Construction / Blacksmithing / Joinery</p>
                </IconText>
                <IconText>
                  
                  <p>{dossier.languageRequired || "Language is not required"}</p>
                </IconText>
                <IconText>
                 
                  <p>1-year employment contract</p>
                </IconText>
                <IconText>
                  
                  <p>Housing, medical care, renewable for 5 years, citizenship assistance.</p>
                </IconText>
                
              </CardContent>
            </DossierCard>
          ))
        ) : (
          <p>No dossiers available</p>
        )}
      </DossierGrid>
    </Container>
  );
}

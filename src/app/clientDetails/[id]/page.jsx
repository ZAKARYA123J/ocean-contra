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

const InfoItem = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin: 0.5rem 0;

  & strong {
    color: #111827;
  }
`;

export default function ClientDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        try {
          const response = await fetch(`/api/register/${id}`); // Fetch register and client details
          if (!response.ok) {
            throw new Error('Failed to fetch details');
          }
          const result = await response.json();
          setData(result);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchDetails();
    }
  }, [id]);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading details...</p>;
  }

  return (
    <Container>
      <Title>Client Details</Title>

      <div>
        <InfoItem><strong>Full Name:</strong> {data.Firstname} {data.Lastname}</InfoItem>
        <InfoItem><strong>Email:</strong> {data.email}</InfoItem>
        <InfoItem><strong>Status:</strong> {data.StatuClient}</InfoItem>
      </div>

      {data.client && (
        <div>
          <h2 className="text-xl font-bold mt-4 mb-2">Client Info</h2>
          <InfoItem><strong>City:</strong> {data.client.city}</InfoItem>
          <InfoItem><strong>CIN:</strong> {data.client.CIN}</InfoItem>
          <InfoItem><strong>Address:</strong> {data.client.address}</InfoItem>
          <InfoItem><strong>Zip Code:</strong> {data.client.zipCode}</InfoItem>
        </div>
      )}
    </Container>
  );
}

'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 0;
  margin: 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 1rem 0;
  text-align: center;
  color: #333333;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
`;

const TableHead = styled.thead`
  background-color: #e5e7eb;
  color: #374151;
  text-transform: uppercase;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
`;

const TableBody = styled.tbody`
  color: #4b5563;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9fafb;
  }

  &:hover {
    background-color: #f3f4f6;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  white-space: nowrap;
  color: #111827;
  border-bottom: 1px solid #ddd;
`;

const Message = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
  margin-top: 2rem;
`;

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/Client');
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (isLoading) {
    return <Message>Loading clients...</Message>;
  }

  if (error) {
    return <Message style={{ color: '#ef4444' }}>Error: {error}</Message>;
  }

  return (
    <Container>
      <Title>Clients and Their Dossiers</Title>
      {clients.length === 0 ? (
        <Message>No clients found.</Message>
      ) : (
        <StyledTable>
          <TableHead>
            <tr>
              <TableHeader>Client</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>City</TableHeader>
              <TableHeader>Phone</TableHeader>
              <TableHeader>Address</TableHeader>
              <TableHeader>Code Postal</TableHeader>
              <TableHeader>Uploads</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              client.dossiers.length > 0 ? (
                client.dossiers.map((dossier, index) => (
                  <TableRow key={`${client.id}-${index}`}>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={client.dossiers.length}>
                          {client.Firstname} {client.Lastname}
                        </TableCell>
                        <TableCell rowSpan={client.dossiers.length}>
                          {client.email}
                        </TableCell>
                        <TableCell rowSpan={client.dossiers.length}>
                          {client.city}
                        </TableCell>
                        <TableCell rowSpan={client.dossiers.length}>
                          {client.numero}
                        </TableCell>
                        <TableCell rowSpan={client.dossiers.length}>
                          {client.address}
                        </TableCell>
                        <TableCell rowSpan={client.dossiers.length}>
                          {client.codePostal}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      {dossier.uploade.length > 0 ? (
                        dossier.uploade.map((file, i) => (
                          <a key={i} href={file} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', display: 'block' }}>
                            {file}
                          </a>
                        ))
                      ) : (
                        'No uploads'
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key={client.id}>
                  <TableCell>{client.Firstname} {client.Lastname}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.city}</TableCell>
                  <TableCell>{client.numero}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>{client.codePostal}</TableCell>
                  <TableCell>No dossiers available</TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </StyledTable>
      )}
    </Container>
  );
}

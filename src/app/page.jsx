'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for layout
const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f4f5f7;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SidebarItem = styled.div`
  font-size: 1rem;
  margin: 10px 0;
  color: #333;
  cursor: pointer;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchBar = styled.input`
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
  width: 200px;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const Card = styled.div`
  width: 250px;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.bgColor || '#ddd'};
  color: white;
  text-align: center;
`;

export default function Dashboard() {
  const [contracts, setContracts] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [lastUpdatedDossier, setLastUpdatedDossier] = useState(null);

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        const contractResponse = await fetch('/api/Contra');
        const dossierResponse = await fetch('/api/Dossier');
        const clientResponse = await fetch('/api/Client');
        
        const contractData = await contractResponse.json();
        const dossierData = await dossierResponse.json();
        const clientData = await clientResponse.json();

        setContracts(contractData);
        setDossiers(dossierData);
        setClients(clientData);

        // Assuming dossierData is sorted by creation or update date in descending order
        if (dossierData.length > 0) {
          setLastUpdatedDossier(dossierData[0]);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      {/* Sidebar */}
      

      {/* Main Content */}
      <Content>
        <Header>
          <h1>Dashboard Overview</h1>
          <SearchBar placeholder="Search..." />
        </Header>

        {/* Cards displaying data */}
        <CardsContainer>
          <Card bgColor="#f87171">
            <h3>Total Contracts</h3>
            <p>{contracts.length}</p>
          </Card>

          <Card bgColor="#a78bfa">
            <h3>Total Clients</h3>
            <p>{clients.length}</p>
          </Card>

          <Card bgColor="#60a5fa">
            <h3>Total Dossiers</h3>
            <p>{dossiers.length}</p>
          </Card>
        </CardsContainer>

        {/* Last Updated/Created Dossier */}
        <div style={{ marginTop: '20px' }}>
          <h3>Last Updated/Created Dossier</h3>
          {lastUpdatedDossier ? (
            <div>
              <p><strong>Status:</strong> {lastUpdatedDossier.status}</p>
              <p><strong>Client ID:</strong> {lastUpdatedDossier.idClient}</p>
              <p><strong>Associated Contra ID:</strong> {lastUpdatedDossier.idContra}</p>
            </div>
          ) : (
            <p>No recent dossier updates.</p>
          )}
        </div>
      </Content>
    </Container>
  );
}

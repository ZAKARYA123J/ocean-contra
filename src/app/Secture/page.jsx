'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px 15px;
  margin: 5px;
  font-size: 1rem;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.secondary ? '#ff5c5c' : '#0070f3')};

  &:hover {
    background-color: ${(props) => (props.secondary ? '#ff3030' : '#0059c1')};
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

export default function SectureManager() {
  const [sectures, setSectures] = useState([]);
  const [nameSecture, setNameSecture] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSecture();
  }, []);

  async function fetchSecture() {
    try {
      const response = await fetch('/api/Secture');
      const data = await response.json();
      setSectures(data);
    } catch (error) {
      console.error('Error fetching sectures:', error);
    }
  }

  async function createSecture() {
    try {
      const response = await fetch('/api/Secture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameSecture }),
      });
      const newSecture = await response.json();
      setSectures([...sectures, newSecture]);
      setNameSecture('');
    } catch (error) {
      console.error('Error creating secture:', error);
    }
  }

  async function updateSecture() {
    try {
      const response = await fetch(`/api/Secture/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameSecture }),
      });
      const updatedSecture = await response.json();
      setSectures(sectures.map((secture) => (secture.id === updatedSecture.id ? updatedSecture : secture)));
      setEditingId(null);
      setNameSecture('');
    } catch (error) {
      console.error('Error updating secture:', error);
    }
  }

  async function deleteSecture(id) {
    try {
      await fetch(`/api/Secture/${id}`, { method: 'DELETE' });
      setSectures(sectures.filter((secture) => secture.id !== id));
    } catch (error) {
      console.error('Error deleting secture:', error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      updateSecture();
    } else {
      createSecture();
    }
  }

  return (
    <Container>
      <Title>Secture Manager</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={nameSecture}
          onChange={(e) => setNameSecture(e.target.value)}
          placeholder="Enter secture name"
          required
        />
        <Button type="submit">{editingId ? 'Update Secture' : 'Add Secture'}</Button>
        {editingId && <Button secondary onClick={() => { setEditingId(null); setNameSecture(''); }}>Cancel</Button>}
      </Form>

      <List>
        {sectures.map((secture) => (
          <ListItem key={secture.id}>
            {secture.nameSecture}
            <div>
              <Button onClick={() => { setEditingId(secture.id); setNameSecture(secture.nameSecture); }}>Edit</Button>
              <Button secondary onClick={() => deleteSecture(secture.id)}>Delete</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.8em;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #0070f3;
  color: #fff;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

const Message = styled.p`
  color: ${(props) => (props.isError ? '#d9534f' : '#5cb85c')};
  text-align: center;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.1em;
  color: #555;
`;

export default function UpdateContra() {
  const { id } = useParams();
  const router = useRouter();

  const [contraData, setContraData] = useState({
    titleCity: '',
    prix: '',
    levelLangue: '',
    duration: '',
    steps: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchContra = async () => {
      setFetching(true);
      try {
        const response = await fetch(`/api/Contra/${id}`);
        const data = await response.json();

        if (response.ok) {
          setContraData(data);
          setPreviewImage(data.image);
        } else {
          setMessage({ text: `Error fetching contra: ${data.error}`, isError: true });
        }
      } catch (error) {
        console.error('Error fetching contra:', error);
        setMessage({ text: 'Error fetching contra data.', isError: true });
      } finally {
        setFetching(false);
      }
    };

    fetchContra();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContraData((prev) => ({
      ...prev,
      [name]: name === 'steps' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();

    // Only append non-empty fields to formData
    if (contraData.titleCity) formData.append('titleCity', contraData.titleCity);
    if (contraData.prix) formData.append('prix', contraData.prix);
    if (contraData.levelLangue) formData.append('levelLangue', contraData.levelLangue);
    if (contraData.duration) formData.append('duration', contraData.duration);
    if (contraData.steps.length > 0) formData.append('steps', JSON.stringify(contraData.steps));
    if (imageFile) formData.append('image', imageFile);

    try {
      const response = await fetch(`/api/Contra/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Contra updated successfully.', isError: false });
        setTimeout(() => router.push('/users'), 1000); // Redirect after a short delay
      } else {
        setMessage({ text: `Error updating contra: ${data.error}`, isError: true });
      }
    } catch (error) {
      console.error('Error updating contra:', error);
      setMessage({ text: 'Failed to update contra.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingText>Loading contra data...</LoadingText>;

  return (
    <Container>
      <Title>Update Contra (ID: {id})</Title>
      {message && <Message isError={message.isError}>{message.text}</Message>}
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Image Upload:</Label>
          <Input type="file" name="image" accept="image/*" onChange={handleFileChange} />
          {previewImage && <PreviewImage src={previewImage} alt="Image preview" />}
        </div>
        <div>
          <Label>City Title:</Label>
          <Input
            type="text"
            name="titleCity"
            value={contraData.titleCity || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Price:</Label>
          <Input
            type="number"
            name="prix"
            value={contraData.prix || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Language Level:</Label>
          <Input
            type="text"
            name="levelLangue"
            value={contraData.levelLangue || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Duration:</Label>
          <Input
            type="text"
            name="duration"
            value={contraData.duration || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>Steps (comma-separated):</Label>
          <Input
            type="text"
            name="steps"
            value={contraData.steps.join(',') || ''}
            onChange={handleChange}
          />
        </div>
        <Button type="submit">
          {loading ? 'Updating...' : 'Update Contra'}
        </Button>
      </Form>
    </Container>
  );
}

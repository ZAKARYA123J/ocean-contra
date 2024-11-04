'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Select from 'react-select'; // Importation de react-select

interface Secture {
  id: string;
  nameSecture: string;
}

export default function ContraForm() {
  const [titleCity, setTitleCity] = useState<string>('');
  const [prix, setPrix] = useState<string>('');
  const [levelLangue, setLevelLangue] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [selectedSectures, setSelectedSectures] = useState<string[]>([]); // État pour les secteurs sélectionnés
  const [newStep, setNewStep] = useState<string>(''); 
  const [stepsArray, setStepsArray] = useState<string[]>([]); 
  const [image, setImage] = useState<string | null>(null);
  const [sectures, setSectures] = useState<Secture[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Charger les secteurs disponibles depuis l'API
  useEffect(() => {
    setIsMounted(true);

    async function fetchSectures() {
      try {
        const res = await fetch('http://localhost:3000/api/Secture');
        const data = await res.json();
        setSectures(data);
      } catch (error) {
        console.error('Error fetching sectures:', error);
        setErrorMessage('Erreur lors du chargement des secteurs.');
      }
    }
    fetchSectures();
  }, []);

  // Gérer l'upload de l'image
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Ajouter une étape à la liste des étapes
  const addStep = () => {
    if (newStep.trim() !== '') {
      setStepsArray([...stepsArray, newStep.trim()]);
      setNewStep(''); 
    }
  };

  // Supprimer une étape
  const removeStep = (index: number) => {
    const updatedSteps = stepsArray.filter((_, i) => i !== index);
    setStepsArray(updatedSteps);
  };

  // Gérer la sélection des secteurs via react-select
  const handleSecturesChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: any) => option.value);
    setSelectedSectures(selectedIds);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); 
    setSuccessMessage(null); 

    const data = {
      titleCity,
      prix,
      levelLangue,
      duration,
      idSecture: selectedSectures, // Utiliser les secteurs sélectionnés
      steps: stepsArray, 
      image,
    };

    try {
      const res = await fetch('http://localhost:3000/api/Contra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la soumission du contrat');
      }

      const result = await res.json();
      console.log(result);

      setSuccessMessage('Contrat soumis avec succès !');
      setTitleCity('');
      setPrix('');
      setLevelLangue('');
      setDuration('');
      setSelectedSectures([]); // Réinitialiser la sélection des secteurs
      setStepsArray([]); 
      setImage(null); 

    } catch (error) {
      console.error('Error submitting the form', error);
      setErrorMessage('Erreur lors de la soumission du contrat.');
    } finally {
      setIsLoading(false); 
    }
  };

  if (!isMounted) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Créer un nouveau contrat</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="titleCity" className="block text-sm font-medium text-gray-700">
            Titre de la ville
          </label>
          <input
            type="text"
            id="titleCity"
            value={titleCity}
            onChange={(e) => setTitleCity(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
            Prix
          </label>
          <input
            type="number"
            id="prix"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="levelLangue" className="block text-sm font-medium text-gray-700">
            Niveau de langue
          </label>
          <input
            type="text"
            id="levelLangue"
            value={levelLangue}
            onChange={(e) => setLevelLangue(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Durée
          </label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        {/* Sélection multiple pour Secture avec react-select */}
        <div className="mb-4">
          <label htmlFor="idSecture" className="block text-sm font-medium text-gray-700">
            Secteur
          </label>
          <Select
            isMulti
            options={sectures.map((secture) => ({ value: secture.id, label: secture.nameSecture }))}
            onChange={handleSecturesChange}
            isDisabled={isLoading}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Ajout d'une étape */}
        <div className="mb-4">
          <label htmlFor="newStep" className="block text-sm font-medium text-gray-700">
            Ajouter une étape
          </label>
          <input
            type="text"
            id="newStep"
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={addStep}
            className="mt-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Ajouter létape
          </button>
        </div>

        {/* Liste des étapes ajoutées */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Étapes ajoutées :</h2>
          <ul>
            {stepsArray.map((step, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{step}</span>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Téléchargez une image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        {image && (
          <div className="mb-4">
            <img src={image} alt="Aperçu de l'image téléchargée" className="max-w-xs h-auto" />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : 'Soumettre le contrat'}
        </button>
      </form>
    </div>
  );
}

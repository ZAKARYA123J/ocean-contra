import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Méthode POST pour créer un nouveau Secture
export async function POST(req) {
  try {
    const body = await req.json();
    const { nameSecture } = body;

    // Vérifier que le nom du secteur est fourni
    if (!nameSecture) {
      return new Response(JSON.stringify({ error: 'nameSecture is required' }), { status: 400 });
    }

    // Créer une nouvelle entrée dans la table Secture
    const newSecture = await prisma.secture.create({
      data: {
        nameSecture,
      },
    });

    return new Response(JSON.stringify(newSecture), { status: 201 });
  } catch (error) {
    console.error('Error creating Secture:', error);
    return new Response(JSON.stringify({ error: 'Error creating Secture' }), { status: 500 });
  }
}

// Méthode GET pour récupérer toutes les entrées de Secture
export async function GET() {
  try {
    // Récupérer toutes les entrées de Secture
    const sectures = await prisma.secture.findMany({
      include: {
        contras: true, // Inclure les contrats associés, notez que 'contras' doit correspondre à votre modèle
      },
    });
    return new Response(JSON.stringify(sectures), { status: 200 });
  } catch (error) {
    console.error('Error fetching Secture:', error);
    return new Response(JSON.stringify({ error: 'Error fetching Secture' }), { status: 500 });
  }
}

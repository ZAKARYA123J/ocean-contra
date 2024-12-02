import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function GET(req) {
  try {
    const dossiers = await prisma.dossier.findMany({
      include: {
        client: {
          select: {
            id: true,
            CIN: true,
            city: true,
            address: true,
          },
        },
        contra: {
          select: {
            id: true,
            titleCity: true,
            levelLangue: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc', 
      },
    });

    return new Response(JSON.stringify(dossiers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching dossiers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch dossiers' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


export async function POST(req) {
  try {
    const { idClient, idContra, status } = await req.json();

    if (!idClient || !idContra || !status) {
      return new Response(JSON.stringify({ error: 'idClient, idContra, and status are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await prisma.client.findUnique({
      where: { id: idClient },
    });

    if (!client) {
      return new Response(JSON.stringify({ error: `Client with ID ${idClient} does not exist` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const contra = await prisma.contra.findUnique({
      where: { id: idContra },
    });

    if (!contra) {
      return new Response(JSON.stringify({ error: `Contra with ID ${idContra} does not exist` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const dossier = await prisma.dossier.create({
      data: {
        idClient,
        idContra,
        status,
      },
    });

    return new Response(JSON.stringify(dossier), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating dossier:', error);
    return new Response(JSON.stringify({ error: 'Failed to create dossier' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
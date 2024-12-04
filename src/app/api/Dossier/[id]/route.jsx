import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET method to fetch a dossier by ID
export async function GET(req, { params }) {
  const { id } = params;
  try {
    const dossier = await prisma.dossier.findUnique({
      where: { id: Number(id) },
      include: {
        register: true,
        contra: true,
      },
    });
    if (!dossier) {
      return new Response(JSON.stringify({ error: `Dossier with ID ${id} not found` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(dossier), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error fetching dossier with ID ${id}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch dossier' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
// PUT method to update a dossier by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const { status } = await req.json();
  try {
    const updatedDossier = await prisma.dossier.update({
      where: { id: Number(id) },
      data: { status },
    });
    return new Response(JSON.stringify(updatedDossier), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error updating dossier status with ID ${id}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to update dossier status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE method to delete a dossier by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await prisma.dossier.delete({
      where: { id: Number(id) },
    });
    return new Response(JSON.stringify({ message: `Dossier with ID ${id} deleted successfully` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error deleting dossier with ID ${id}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to delete dossier' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

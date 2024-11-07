import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { nameSecture } = body;

    if (!nameSecture) {
      return new Response(JSON.stringify({ error: 'nameSecture is required' }), { status: 400 });
    }

    const updatedSecture = await prisma.secture.update({
      where: { id },
      data: { nameSecture },
    });

    return new Response(JSON.stringify(updatedSecture), { status: 200 });
  } catch (error) {
    console.error('Error updating Secture:', error);
    return new Response(JSON.stringify({ error: 'Error updating Secture' }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);

    const deletedSecture = await prisma.secture.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deletedSecture), { status: 200 });
  } catch (error) {
    console.error('Error deleting Secture:', error);
    return new Response(JSON.stringify({ error: 'Error deleting Secture' }), { status: 500 });
  }
}

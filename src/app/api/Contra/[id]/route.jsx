import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const contra = await prisma.contra.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        sectures: true,  
        dossiers: true, 
      },
    });

    if (!contra) {
      return new Response(JSON.stringify({ error: 'Contra not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(contra), { status: 200 });
  } catch (error) {
    console.error('Error fetching Contra by ID:', error);
    return new Response(JSON.stringify({ error: 'Error fetching Contra by ID' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

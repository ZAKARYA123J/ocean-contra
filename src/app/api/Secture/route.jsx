import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { nameSecture } = body;

    if (!nameSecture) {
      return new Response(JSON.stringify({ error: 'nameSecture is required' }), { status: 400 });
    }

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

export async function GET() {
  try {
    const sectures = await prisma.secture.findMany({
      include: {
        contras: true, 
      },
    });
    return new Response(JSON.stringify(sectures), { status: 200 });
  } catch (error) {
    console.error('Error fetching Secture:', error);
    return new Response(JSON.stringify({ error: 'Error fetching Secture' }), { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'a5f719ac8b4b73f2a620fd73c85a7d5f79b52fcfcdc5d57c8e8f749ad7e315c47230483d7db1525f20c5c4fd65423e9c9c8244d4f7bc9cfd5753fbb4f8439f60';
function setCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with a specific domain in production
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
export async function POST(req) {
  try {
    const { email, password, idContra } = await req.json();
    console.log("Received login request:", { email, password, idContra });

    const contraId = idContra ? parseInt(idContra, 10) : null;

    if (contraId) {
      const contraExists = await prisma.contra.findUnique({
        where: { id: contraId },
      });
      if (!contraExists) {
        console.error('Specified contract (Contra) does not exist:', contraId);
        return setCorsHeaders(NextResponse.json({ error: 'Specified contract (Contra) does not exist.' }, { status: 400 }));
      }
    }

    const client = await prisma.client.findUnique({
      where: { email },
      include: { dossiers: true },
    });

    if (!client) {
      console.error('Client not found with the provided email');
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, client.password);
    if (!isValid) {
      console.error('Password does not match');
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    let dossier = client.dossiers.find((dossier) => dossier.idContra === contraId);

    if (contraId && !dossier) {
      dossier = await prisma.dossier.create({
        data: {
          uploade: [],
          status: 'INCOMPLETED',
          client: {
            connect: { id: client.id },
          },
          contra: {
            connect: { id: contraId },
          },
        },
      });
      console.log(`Dossier created for client ${client.id} and contra ${contraId}`);
    }

    const token = jwt.sign({ clientId: client.id }, JWT_SECRET, { expiresIn: '1h' });

    // Set redirectPath based on the presence of contraId
    const redirectPath = contraId
      ? `/uploade/${client.id}?contraId=${contraId}`
      : `/uploade/${client.id}`;

    console.log('Login successful, token generated');
    return NextResponse.json(
      {
        token,
        client: { email: client.email, id: client.id },
        dossierId: dossier ? dossier.id : null,
        redirectPath, // Include the redirect path
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during login:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

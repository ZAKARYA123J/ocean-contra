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
    const { email, password, contraId } = await req.json();
    console.log('Received login request:', { email, password, contraId });

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
      });
      if (!contraExists) {
        console.error('Specified contract (Contra) does not exist:', contraId);
        return setCorsHeaders(NextResponse.json({ error: 'Specified contract (Contra) does not exist.' }, { status: 400 }));
      }
    }

    const register = await prisma.register.findUnique({
      where: { email },
    });

    if (!register) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, register.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    const token = jwt.sign({ registerId: register.id }, JWT_SECRET, { expiresIn: '1h' });

    let message = 'Access granted.';
    let dossier = null;

    if (register.StatuClient === 'verified' && contraId) {
      const existingDossier = await prisma.dossier.findFirst({
        where: {
          idregister: register.id,
          idContra: contraId,
        },
      });

      if (existingDossier) {
        message = 'Dossier already exists for this register and contra.';
      } else {
        dossier = await prisma.dossier.create({
          data: {
            idregister: register.id,
            idContra: contraId,
            status: 'INCOMPLETED',
          },
        });

        message = 'Dossier created successfully.';
      }
    } else if (register.StatuClient === 'inverified' || !contraId) {
      message = 'You have to complete your account.';
    }

    return new Response(
      JSON.stringify({
        token,
        user: { email: register.email, id: register.id, Firstname: register.Firstname, Lastname: register.Lastname },
        message,
        dossier: dossier || null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during login:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Error logging in' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

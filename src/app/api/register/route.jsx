import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { Firstname, Lastname, email, password, numero, StatuClient, contraId } = await req.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new register entry
    const register = await prisma.register.create({
      data: {
        Firstname,
        Lastname,
        email,
        password: hashedPassword,
        numero,
        StatuClient: StatuClient || "Pending",
      },
    });

    let dossier = null;

    if (StatuClient === "verified" && contraId) {
      dossier = await prisma.dossier.create({
        data: {
          idContra: contraId,
          idregister: register.id,
          status: "INCOMPLETED",
        },
      });
    }

    return new Response(
      JSON.stringify({
        register,
        dossier: dossier ? dossier : "No dossier created",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating register or dossier:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// GET
export async function GET(req) {
  try {
    const registers = await prisma.register.findMany({
      include: { 
        dossiers: true, 
      },
    });

    return new Response(JSON.stringify(registers), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching registers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch registers' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
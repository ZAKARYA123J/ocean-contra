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

// GET: Retrieve a register entry by ID
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: "A valid ID is required" }), { status: 400 });
    }

    // Fetch the register by ID
    const register = await prisma.register.findUnique({
      where: { id: parseInt(id, 10) },
      include: { dossiers: true }, // Include related dossiers
    });

    if (!register) {
      return new Response(JSON.stringify({ error: "Register not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(register), { status: 200 });
  } catch (error) {
    console.error("Error retrieving register:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

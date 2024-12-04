import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// POST: Create a new register entry
export async function POST(req) {
  try {
    const { Firstname, Lastname, email, password, numero, StatuClient, contraId } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

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
export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(id)) {
      return new Response(
        JSON.stringify({ error: "A valid ID is required" }),
        { status: 400 }
      );
    }

    const register = await prisma.register.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        client: true,  
        dossiers: true 
      },
    });

    if (!register) {
      return new Response(
        JSON.stringify({ error: "Register not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(register), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error retrieving register by ID:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}


// PUT: Update StatuClient and create a dossier if conditions are met
export async function PUT(req) {
  try {
    const { id, StatuClient, contraId } = await req.json();

    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: "A valid ID is required" }), { status: 400 });
    }

    const register = await prisma.register.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!register) {
      return new Response(JSON.stringify({ error: "Register not found" }), { status: 404 });
    }

    const updatedRegister = await prisma.register.update({
      where: { id: parseInt(id, 10) },
      data: { StatuClient },
    });

    let dossier = null;

    if (StatuClient === "verified" && contraId) {
      dossier = await prisma.dossier.create({
        data: {
          idContra: contraId,
          idregister: updatedRegister.id,
          status: "INCOMPLETED",
        },
      });
    }

    return new Response(
      JSON.stringify({
        updatedRegister,
        dossier: dossier ? dossier : "No dossier created",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating register or creating dossier:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// DELETE: Delete a register entry by ID
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ error: "A valid ID is required" }), { status: 400 });
    }

    await prisma.register.delete({
      where: { id: parseInt(id, 10) },
    });

    return new Response(
      JSON.stringify({ message: `Register with ID ${id} deleted successfully` }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting register:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { storage } from '../../../../firebase';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// GET method to retrieve a client by ID, including dossiers
export async function GET(req, { params }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid client ID' }), { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: { dossiers: true },
    });

    if (!client) {
      return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(client), { status: 200 });
  } catch (error) {
    console.error('Error retrieving client by ID:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve client' }), { status: 500 });
  }
}

// PUT method to update a client and optionally upload a new file
export async function PUT(req, { params }) {
  const id = parseInt(params.id, 10);
  const { Firstname, Lastname, email, password, numero, CIN, city, address, codePostal, contraId, file } = await req.json();

  let fileURL = null;
  if (file) {
    try {
      const fileName = `${uuidv4()}_${file.name}`;
      const firebaseFile = storage.file(fileName);
      await firebaseFile.save(Buffer.from(file, 'base64'), {
        contentType: file.type,
      });
      await firebaseFile.makePublic();
      fileURL = `https://storage.googleapis.com/${storage.name}/${fileName}`;
    } catch (uploadError) {
      console.error('Error uploading file to Firebase:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to upload file to Firebase' }), { status: 500 });
    }
  }

  try {
    const updatedData = {
      Firstname,
      Lastname,
      email,
      numero,
      CIN,
      city,
      address,
      codePostal,
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        ...updatedData,
        ...(contraId ? {
          dossiers: {
            updateMany: {
              where: { idContra: contraId },
              data: {
                uploade: fileURL ? [fileURL] : undefined,
                status: 'INCOMPLETED',
              },
            },
          },
        } : {}),
      },
    });
    return new Response(JSON.stringify(updatedClient), { status: 200 });
  } catch (error) {
    console.error('Error updating client or dossier:', error);
    return new Response(JSON.stringify({ error: 'Failed to update client or dossier' }), { status: 500 });
  }
}

// DELETE method to remove a client and their associated dossiers
export async function DELETE(req, { params }) {
  const id = parseInt(params.id, 10);

  try {
    await prisma.client.delete({
      where: { id },
    });
    return new Response(JSON.stringify({ message: 'Client and associated dossiers deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting client or dossier:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete client or dossier' }), { status: 500 });
  }
}

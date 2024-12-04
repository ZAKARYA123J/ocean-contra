import { PrismaClient } from '@prisma/client';
import { storage } from '../../../../firebase'; 
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const uploadFileToFirebase = async (fileBase64, fileType) => {
  const fileName = `${uuidv4()}.${fileType.split('/')[1]}`;
  const firebaseFile = storage.ref(fileName);

  await firebaseFile.putString(fileBase64, 'base64', {
    contentType: fileType,
  });

  return firebaseFile.getDownloadURL();
};

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        register: {
          include: {
            dossiers: true,
          },
        },
      },
    });

    if (!client) {
      return new Response(JSON.stringify({ error: `Client with ID ${id} not found` }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(client), { status: 200 });
  } catch (error) {
    console.error('Error fetching client:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch client details' }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const {
    CINFront,
    CINBackground,
    passport,
    diplomat,
    images,
    addaDocument,
    ...updateData
  } = await req.json();

  try {
    const client = await prisma.client.findUnique({ where: { id: parseInt(id, 10) } });

    if (!client) {
      return new Response(
        JSON.stringify({ error: `Client with ID ${id} not found` }),
        { status: 404 }
      );
    }

    const uploadedFiles = {};

    if (CINFront) uploadedFiles.CINFront = await uploadFileToFirebase(CINFront.base64, CINFront.type);
    if (CINBackground) uploadedFiles.CINBackground = await uploadFileToFirebase(CINBackground.base64, CINBackground.type);
    if (passport) uploadedFiles.passport = await uploadFileToFirebase(passport.base64, passport.type);
    if (diplomat) uploadedFiles.diplomat = await uploadFileToFirebase(diplomat.base64, diplomat.type);
    if (images) uploadedFiles.images = await uploadFileToFirebase(images.base64, images.type);
    if (addaDocument && addaDocument.length > 0) {
      uploadedFiles.addaDocument = await Promise.all(
        addaDocument.map((file) => uploadFileToFirebase(file.base64, file.type))
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: parseInt(id, 10) },
      data: { ...updateData, ...uploadedFiles },
    });

    return new Response(JSON.stringify(updatedClient), { status: 200 });
  } catch (error) {
    console.error('Error updating client:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update client' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const client = await prisma.client.findUnique({ where: { id: parseInt(id, 10) } });

    if (!client) {
      return new Response(
        JSON.stringify({ error: `Client with ID ${id} not found` }),
        { status: 404 }
      );
    }

    await prisma.client.delete({ where: { id: parseInt(id, 10) } });

    return new Response(
      JSON.stringify({ message: `Client with ID ${id} successfully deleted` }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting client:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete client' }),
      { status: 500 }
    );
  }
}

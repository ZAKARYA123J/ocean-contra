import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  const { Firstname, Lastname, email, password, numero, CIN, city, address, codePostal, contraId, file } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

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
    const newClient = await prisma.client.create({
      data: {
        Firstname,
        Lastname,
        email,
        password: hashedPassword,
        numero,
        CIN,
        city,
        address,
        codePostal,
        ...(contraId ? {
          dossiers: {
            create: {
              idContra: contraId,
              uploade: fileURL ? [fileURL] : [],
              status: 'INCOMPLETED',
            },
          },
        } : {}),
      },
    });
    return new Response(JSON.stringify(newClient), { status: 201 });
  } catch (error) {
    console.error('Error creating client or dossier:', error);
    return new Response(JSON.stringify({ error: 'Failed to create client or dossier' }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const clients = await prisma.client.findMany({
      include: {
        dossiers: {
          include: {
            contra: { 
              select: {
                titleCity: true,
              },
            },
          },
        },
      },
    });
    return new Response(JSON.stringify(clients), { status: 200 });
  } catch (error) {
    console.error('Error retrieving clients with dossiers:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve clients with dossiers' }), { status: 500 });
  }
}
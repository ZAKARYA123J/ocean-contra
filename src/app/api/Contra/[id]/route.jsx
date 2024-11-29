import { PrismaClient } from '@prisma/client';
import { storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

async function parseFormData(req) {
  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.includes("multipart/form-data")) {
    throw new Error("Unsupported content type, must be multipart/form-data");
  }

  const formData = await req.formData();
  const fields = {};
  const files = {};

  formData.forEach((value, key) => {
    if (value instanceof File) {
      files[key] = value;
    } else {
      fields[key] = value;
    }
  });

  return { fields, files };
}

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const { fields, files } = await parseFormData(req);

    const { titleCity, prix, levelLangue, duration, steps } = fields;
    const parsedSteps = steps ? JSON.parse(steps) : [];

    let imageUrl;
    if (files.image) {
      const imageFile = files.image;
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const imageRef = ref(storage, `images/${fileName}`);
      const buffer = await imageFile.arrayBuffer();

      await uploadBytes(imageRef, new Uint8Array(buffer));
      imageUrl = await getDownloadURL(imageRef);
    } else {
      imageUrl = fields.image;
    }

    const updatedContra = await prisma.contra.update({
      where: { id: parseInt(id, 10) },
      data: {
        titleCity,
        prix: prix ? parseFloat(prix) : undefined,
        levelLangue,
        duration,
        steps: parsedSteps,
        image: imageUrl,
      },
    });

    return new Response(JSON.stringify(updatedContra), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating Contra:', error);
    return new Response(JSON.stringify({ error: 'Error updating Contra' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const contra = await prisma.contra.findUnique({
      where: { id: parseInt(id, 10) }, 
    });

    if (!contra) {
      return new Response(JSON.stringify({ error: 'Contra not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(contra), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching contra:', error);
    return new Response(JSON.stringify({ error: 'Error fetching contra' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedContra = await prisma.contra.delete({
      where: { id: parseInt(id, 10) },
    });

    return new Response(JSON.stringify(deletedContra), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting contra:', error);
    return new Response(JSON.stringify({ error: 'Error deleting contra' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

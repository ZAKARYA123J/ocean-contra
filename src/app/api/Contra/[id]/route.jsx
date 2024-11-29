import { PrismaClient } from '@prisma/client';
import { storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const contra = await prisma.contra.findUnique({
      where: { id: parseInt(id, 10) },
      include: { sectures: true }, // Include related sectors if needed
    });

    if (!contra) {
      return new Response(JSON.stringify({ error: 'Contra not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(contra), { status: 200 });
  } catch (error) {
    console.error('Error fetching Contra:', error);
    return new Response(JSON.stringify({ error: 'Error fetching Contra' }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();
    const { titleCity, prix, levelLangue, duration, selectedSectures, image, avantage, steps } = body;

    const secturesToConnect = Array.isArray(selectedSectures)
      ? selectedSectures.map((sectureId) => ({ id: parseInt(sectureId, 10) }))
      : [];

    let imageUrl = image;

    if (image && image.startsWith('data:image/')) {
      const mimeType = image.match(/data:(.*);base64,/)[1];
      const fileExtension = mimeType.split('/')[1];
      const buffer = Buffer.from(image.split(',')[1], 'base64');

      const fileName = `${uuidv4()}.${fileExtension}`;
      const imageRef = ref(storage, `images/${fileName}`);

      await uploadBytes(imageRef, buffer);
      imageUrl = await getDownloadURL(imageRef);
    }

    const updatedContra = await prisma.contra.update({
      where: { id: parseInt(id, 10) },
      data: {
        titleCity,
        prix: prix ? parseFloat(prix) : undefined,
        levelLangue,
        duration,
        avantage,
        image: imageUrl,
        steps: steps || [],
        sectures: {
          set: [], // Clear existing relations
          connect: secturesToConnect, // Connect new sectors
        },
      },
    });

    return new Response(JSON.stringify(updatedContra), { status: 200 });
  } catch (error) {
    console.error('Error updating Contra:', error);
    return new Response(JSON.stringify({ error: 'Error updating Contra' }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const deletedContra = await prisma.contra.delete({
      where: { id: parseInt(id, 10) },
    });

    return new Response(JSON.stringify(deletedContra), { status: 200 });
  } catch (error) {
    console.error('Error deleting Contra:', error);
    return new Response(JSON.stringify({ error: 'Error deleting Contra' }), {
      status: 500,
    });
  }
}

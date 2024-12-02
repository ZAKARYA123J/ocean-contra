import { PrismaClient } from '@prisma/client';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';  // Pour générer des noms de fichier uniques

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { titleCity, prix, levelLangue, duration, selectedSectures, image,avantage, steps } = body;

    // Vérifier que selectedSectures est un tableau
    const secturesToConnect = Array.isArray(selectedSectures)
      ? selectedSectures.map(id => ({ id: parseInt(id, 10) })) // Connecter les secteurs sélectionnés
      : []; // Sinon, utilisez un tableau vide

    // Extraire l'extension de fichier de l'image base64 (par exemple "image/png")
    const mimeType = image.match(/data:(.*);base64,/)[1];
    const fileExtension = mimeType.split('/')[1]; // Extraire l'extension, par ex: "png"

    // Convertir l'image en un Buffer
    const buffer = Buffer.from(image.split(',')[1], 'base64');

    // Générer un nom de fichier unique pour l'image
    const fileName = `${uuidv4()}.${fileExtension}`;
    const imageRef = ref(storage, `images/${fileName}`);

    // Télécharger l'image dans Firebase Storage
    await uploadBytes(imageRef, buffer);

    // Obtenir l'URL de téléchargement de l'image
    const imageUrl = await getDownloadURL(imageRef);

    // Créer une nouvelle entrée dans la base de données Prisma avec les steps
    const newContra = await prisma.contra.create({
      data: {
        titleCity,
        prix: parseFloat(prix),
        levelLangue,
        duration,
        avantage,
        sectures: {
          connect: secturesToConnect, // Utiliser le tableau préparé
        },
        image: imageUrl,  // Sauvegarder l'URL de l'image
        steps, // Ajouter le tableau des étapes (assurez-vous que c'est un tableau)
      },
    });

    return new Response(JSON.stringify(newContra), { status: 201 });
  } catch (error) {
    console.error('Error creating Contra:', error);
    return new Response(JSON.stringify({ error: 'Error creating Contra' }), { status: 500 });
  }
}

// Méthode GET pour récupérer les Contras
export async function GET() {
  try {
    const contras = await prisma.contra.findMany();
    return new Response(JSON.stringify(contras), { status: 200 });
  } catch (error) {
    console.error('Error fetching Contras:', error);
    return new Response(JSON.stringify({ error: 'Error fetching Contras' }), { status: 500 });
  }
}

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();


// export async function GET(req) {
//   try {
//     const dossiers = await prisma.dossier.findMany({
//       include: {
//         client: true,
//         contra: true,
//       },
//     });
//     return new Response(JSON.stringify(dossiers), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching dossiers:', error);
//     return new Response(JSON.stringify({ error: 'Failed to fetch dossiers' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// export async function POST(req) {
//   try {
//     const { idClient, idContra, uploade, status } = await req.json();

//     if (!idClient || !idContra || !status) {
//       return new Response(JSON.stringify({ error: 'idClient, idContra, and status are required' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const clientExists = await prisma.client.findUnique({ where: { id: idClient } });
//     const contraExists = await prisma.contra.findUnique({ where: { id: idContra } });

//     if (!clientExists) {
//       return new Response(JSON.stringify({ error: `Client with ID ${idClient} does not exist` }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//     if (!contraExists) {
//       return new Response(JSON.stringify({ error: `Contra with ID ${idContra} does not exist` }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const dossier = await prisma.dossier.create({
//       data: {
//         idClient,
//         idContra,
//         uploade: uploade || [],
//         status,
//       },
//     });

//     return new Response(JSON.stringify(dossier), {
//       status: 201,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error creating dossier:', error);
//     return new Response(JSON.stringify({ error: 'Failed to create dossier' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

import { PrismaClient } from '@prisma/client';
import { storage } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
export async function GET(req) {
    try {
      const dossiers = await prisma.dossier.findMany({
        include: {
          client: true,
          contra: true,
        },
      });
      return new Response(JSON.stringify(dossiers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching dossiers:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch dossiers' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

export async function POST(req) {
  try {
    const { idClient, idContra, status, files } = await req.json(); // `files` will contain base64 encoded file data or URLs

    if (!idClient || !idContra || !status) {
      return new Response(JSON.stringify({ error: 'idClient, idContra, and status are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const clientExists = await prisma.client.findUnique({ where: { id: idClient } });
    const contraExists = await prisma.contra.findUnique({ where: { id: idContra } });

    if (!clientExists) {
      return new Response(JSON.stringify({ error: `Client with ID ${idClient} does not exist` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!contraExists) {
      return new Response(JSON.stringify({ error: `Contra with ID ${idContra} does not exist` }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let uploadedURLs = [];

    for (const file of files) {
      const { base64, type } = file; 

      try {
        const fileName = `${uuidv4()}.${type.split('/')[1]}`; 
        const firebaseFile = storage.file(fileName);

        await firebaseFile.save(Buffer.from(base64, 'base64'), {
          contentType: type,
          public: true,
        });

        const url = `https://storage.googleapis.com/${storage.name}/${fileName}`;
        uploadedURLs.push(url);
      } catch (uploadError) {
        console.error('Error uploading file to Firebase:', uploadError);
        return new Response(JSON.stringify({ error: 'Failed to upload file to Firebase' }), { status: 500 });
      }
    }

    const dossier = await prisma.dossier.create({
      data: {
        idClient,
        idContra,
        uploade: uploadedURLs, 
        status,
      },
    });

    return new Response(JSON.stringify(dossier), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating dossier:', error);
    return new Response(JSON.stringify({ error: 'Failed to create dossier' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

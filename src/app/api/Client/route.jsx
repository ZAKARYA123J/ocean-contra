import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { storage } from "../../../firebase";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const {
      CIN,
      CINFront,
      CINBackground,
      secture,
      city,
      address,
      zipCode,
      passport,
      diplomat,
      images,
      apostyle,
      addaDocument,
      registerId,
    } = await req.json();

    if (!registerId) {
      return new Response(JSON.stringify({ error: "registerId is required" }), {
        status: 400,
      });
    }

    const register = await prisma.register.findUnique({
      where: { id: parseInt(registerId, 10) },
    });

    if (!register) {
      return new Response(
        JSON.stringify({ error: `Register with ID ${registerId} does not exist` }),
        { status: 404 }
      );
    }

    // Upload helper function
    const uploadFileToFirebase = async (fileBase64, fileType) => {
      const fileName = `${uuidv4()}.${fileType.split("/")[1]}`;
      const fileRef = ref(storage, `images/${fileName}`);

      await uploadString(fileRef, fileBase64, "base64", {
        contentType: fileType,
      });

      return getDownloadURL(fileRef);
    };

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

    // Create client
    const client = await prisma.client.create({
      data: {
        CIN,
        secture,
        city,
        address,
        zipCode,
        apostyle,
        registerId: parseInt(registerId, 10),
        ...uploadedFiles,
      },
    });

    return new Response(JSON.stringify(client), { status: 201 });
  } catch (error) {
    console.error("Error creating client or uploading files:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create client or upload files" }),
      { status: 500 }
    );
  }
}
